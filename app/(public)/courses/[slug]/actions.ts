"use server";

import { requiredUser } from "@/app/data/user/require-user";
import { arcjetInstance, fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import Stripe from "stripe";
const aj = arcjetInstance.withRule(
    fixedWindow({
        mode: "LIVE",
        window: '1m',
        max: 5,
    })
)


export async function enrollmentCourseAction(courseId: string): Promise<ApiResponse | never> {

    const user = await requiredUser();
    let checkoutUrl: string;

    try {
        const req = await request()
        const decision = await aj.protect(req, {
            fingerprint: user.id
        })
        if (decision.isDenied()) {
            if (decision.reason.isBot()) {
                return {
                    status: "error",
                    message: "Activité suspecte détectée. Accès refusé."
                }

            }
            if (decision.reason.isRateLimit()) {
                return {
                    message: "Activité suspecte détectée. Veuillez réessayer plus tard.",
                    status: "error"
                }

            }
            // cas général
            return {
                message: "Requête refusée. Merci de réessayer plus tard.",
                status: "error"
            }
        }
        const course = await prisma.courses.findUnique({
            where: {
                id: courseId
            }, select: {
                id: true,
                title: true,
                price: true,
                slug: true
            }
        });

        if (!course) {
            return {
                status: 'error',
                message: "Cours introuvable"
            }
        }

        let stripeCustomerId: string

        const userWithStripCustomerId = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                stripeCustomerId: true,
            }
        })

        if (userWithStripCustomerId?.stripeCustomerId) {
            stripeCustomerId = userWithStripCustomerId.stripeCustomerId
        } else {

            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user.id
                }
            });
            stripeCustomerId = customer.id

            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    stripeCustomerId: stripeCustomerId
                }
            })
        }

        const result = await prisma.$transaction(async (tx) => {
            const existingEnrollment = await tx.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: courseId
                    }
                },
                select: {
                    id: true,
                    status: true,
                }
            });
            if (existingEnrollment?.status === "Active") {
                return {
                    status: "success",
                    message: "Vous êtes déjà inscrit à ce cours"
                }
            }

            let enrollment;

            if (existingEnrollment) {
                enrollment = await tx.enrollment.update({
                    where: {
                        id: existingEnrollment.id,
                    },
                    data: {
                        amount: course.price,
                        status: "Pending",
                        updatedAt: new Date()
                    }
                })
            } else {
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: courseId,
                        amount: course.price,
                        status: "Pending"
                    }
                })
            }
            const checkoutSession = await stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                line_items: [
                    {
                        price: "price_1SO8hOHYiGABUcK8rUcVrY2t",
                        quantity: 1
                    }
                ],
                mode: 'payment',
                success_url: `${env.BETTER_AUTH_URL}/payment/success`,
                cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
                metadata: {
                    userId: user.id,
                    courseId: course.id,
                    enrollmentId: enrollment.id
                }
            });
            return {
                enrollment: enrollment,

                checkoutUrl: checkoutSession.url,
            }
        });

        checkoutUrl = result.checkoutUrl as string


    } catch (error) {
        if (error instanceof Stripe.errors.StripeError) {
            return {
                status: 'error',
                message: 'Erreur du système de paiement. Veuillez réessayer plus tard.'
            }
        }
        return {
            status: 'error',
            message: "Échec d'inscription au cours"
        }
    }

    redirect(checkoutUrl)

}
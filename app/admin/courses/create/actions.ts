"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { arcjetInstance } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseSchemaType, coursesSchema } from "@/lib/zodSchemas";
import { detectBot, fixedWindow, request } from "@arcjet/next";

const aj = arcjetInstance.withRule(
    detectBot({
        mode: 'LIVE',
        allow: [],
    })
).withRule(
    fixedWindow({
        mode: 'LIVE',
        window: "1m",
        max: 5,
    })
)


export async function CreateCourse(values: CourseSchemaType): Promise<ApiResponse> {
    const session = await requireAdmin();
    try {
        const req = await request()
        const decision = await arcjetInstance.protect(req, {
            fingerprint: session.user.id
        })

        if (decision.isDenied()) {
            if (decision.reason.isBot()) {
                return {
                    message: "Activité suspecte détectée. Accès refusé.",
                    status: "error"
                }

            }
            if (decision.reason.isRateLimit()) {
                return {
                    message: "Trop de requêtes. Veuillez réessayer plus tard.",
                    status: "error"
                }

            }
            // cas général
            return {
                message: "Requête refusée. Merci de réessayer plus tard.",
                status: "error"
            }
        }

        const validation = coursesSchema.safeParse(values)

        if (!validation.success) {
            return {
                status: 'error',
                message: "Données invalides"
            }
        }

        const data = await prisma.courses.create({
            data: {
                ...validation.data,
                userId: session?.user.id as string
            }

        })
        return {
            status: 'success',
            message: 'Cours créer avec succès'
        }

    } catch (error) {
        console.log(error)
        return {
            status: "error",
            message: 'Erreur de creation du cours'
        }
    }
}
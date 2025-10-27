"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { arcjetInstance } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseSchemaType, coursesSchema } from "@/lib/zodSchemas";


import { detectBot, fixedWindow, request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

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

export async function editCourse(data: CourseSchemaType, coursId: string): Promise<ApiResponse> {
    const user = await requireAdmin()

    try {
        const req = await request()
        const decision = await arcjetInstance.protect(req, {
            fingerprint: user.user.id
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
        const result = coursesSchema.safeParse(data);

        if (!result.success) {
            return {
                status: "error",
                message: "données non valident"
            }
        }

        await prisma.courses.update({
            where: {
                id: coursId,
                userId: user.user.id,
            },
            data: {
                ...result.data,
            }
        })

        return {
            status: "success",
            message: "Cours"
        }
    } catch (error) {
        return {
            status: "error",
            message: "Echec de mis à jours du cours"
        }
    }
}

export async function reorderLessons(
    chapterId: string,
    lessons: { id: string, position: number }[],
    courseId: string
): Promise<ApiResponse> {
    await requireAdmin()
    try {
        if (!lessons || lessons.length === 0) {
            return {
                status: "error",
                message: "Aucune leçon fournie pour la réorganisation"
            }
        }

        const updates = lessons.map((lesson) =>
            prisma.lesson.update({
                where: {
                    id: lesson.id,
                    chapterId: chapterId
                }, data: {
                    position: lesson.position
                },
            })
        )
        await prisma.$transaction(updates);
        revalidatePath(`/admin/courses/${courseId}/edit`)
        
        return {
            status: "success",
            message: "Leçons reordonner avec succès"
        }
    } catch (error) {
        return {
            status: "error",
            message: "Impossible de réorganiser les leçons."
        }
    }
}

export async function reorderChapter(courseId: string, chapters: {id: string, position:number}[]):Promise<ApiResponse>{
    await requireAdmin()
    try {
        if (!chapters || chapters.length===0){
            return {
                status: "error",
                message: "Aucun Chapitre fourni pour la réorganisation"
            }
        }
        const updates = chapters.map((chapter) =>
            prisma.chapter.update({
                where: {
                    id: chapter.id,
                    courseId: courseId
                }, data: {
                    position: chapter.position
                },
            })
        )
        await prisma.$transaction(updates);
        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: "success",
            message: "chapitres reordonner avec succès"
        }

    } catch (error) {
        return {
            status: "error",
            message: "Échec de reorganisation des chapitres"
        }
    }
}
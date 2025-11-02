"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { arcjetInstance } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { chapterSchema, chapterSchemaType, CourseSchemaType, coursesSchema, lessonSchema, lessonSchemaType } from "@/lib/zodSchemas";


import { fixedWindow, request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjetInstance.withRule(
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
        const decision = await aj.protect(req, {
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

export async function reorderChapter(courseId: string, chapters: { id: string, position: number }[]): Promise<ApiResponse> {
    await requireAdmin()
    try {
        if (!chapters || chapters.length === 0) {
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


export async function addChapter(values: chapterSchemaType): Promise<ApiResponse> {
    await requireAdmin()
    const user = await requireAdmin()
    console.log(user)
    try {
        const result = chapterSchema.safeParse(values);

        if (!result.success) {
            return {
                status: "error",
                message: "Données Invalid",
            };
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.chapter.findFirst({
                where: {
                    courseId: result.data.courseId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: 'desc',
                }
            });

            await tx.chapter.create({
                data: {
                    title: result.data.title,
                    courseId: result.data.courseId,
                    position: (maxPos?.position ?? 0) + 1
                }
            })
        })

        revalidatePath(`admin/courses/${result.data.courseId}/edit`)

        return {
            status: "success",
            message: "Chapitre ajouter avec succèss"
        }

    } catch (error) {
        return {
            status: "error",
            message: "Échec de creation du chapitre"
        }
    }
}


export async function addLesson(values: lessonSchemaType): Promise<ApiResponse> {
   await requireAdmin()
    
    try {
        const result = lessonSchema.safeParse(values);

        if (!result.success) {
            return {
                status: "error",
                message: "Données Invalid", 
            };
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.lesson.findFirst({
                where: {
                    chapterId: result.data.chapterId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: 'desc',
                }
            });

            await tx.lesson.create({
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    videoUrl: result.data.videoUrl,
                    thumbnailKey: result.data.thumbnailKey,
                    chapterId: result.data.chapterId,
                    position: (maxPos?.position ?? 0) + 1
                }
            })
        })

        revalidatePath(`admin/courses/${result.data.courseId}/edit`)

        return {
            status: "success",
            message: "leçon ajouter avec succèss"
        }

    } catch (error) {
        console.log(error)
        return {
            status: "error",
            message: "Échec de creation du leçon"
        }
    }
}


export async function deleteLessons({ chapterId, courseId, lessonId }: { chapterId: string, courseId: string, lessonId: string }): Promise<ApiResponse> {
    await requireAdmin()
    try {
        const chapterWithLessons = await prisma.chapter.findUnique({
            where: {
                id: chapterId
            },
            select: {
                lessons: {
                    orderBy: {
                        position: "asc"
                    },
                    select: {
                        id: true,
                        position: true,
                    }
                }
            }
        });

        if (!chapterWithLessons) {
            return {
                status: "error",
                message: "Chapitre non trouvé!"
            }
        }
        const lessons = chapterWithLessons.lessons
        const lessonDelete = lessons.find((lesson) => lesson.id === lessonId)
        if (!lessonDelete) {
            return {
                status: "error",
                message: "Leçon non trouvé!"
            }
        }

        const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId)
        const updates = remainingLessons.map((lesson, index) => {
            return prisma.lesson.update({
                where: { id: lesson.id },
                data: { position: index + 1 }
            })
        })

        await prisma.$transaction([
            ...updates,
            prisma.lesson.delete({
                where: {
                    id: lessonId,
                    chapterId: chapterId
                }
            })
        ])
        revalidatePath(`admin/courses/${courseId}/edit`)
        return {
            status: "success",
            message: "Leçon supprimé avec succès !"
        }
    } catch (error) {
        return {
            status: "error",
            message: "Échec de suppression du leçon"
        }
    }

}


export async function deleteChapter({ chapterId, courseId}: { chapterId: string, courseId: string}): Promise<ApiResponse> {

    try {
        await requireAdmin()
        const coursWithchapter = await prisma.courses.findUnique({
            where: {
                id: courseId
            },
            select: {
                chapter: {
                    orderBy: {
                        position: "asc"
                    },
                    select: {
                        id: true,
                        position: true,
                    }
                }
            }
        });

        if (!coursWithchapter) {
            return {
                status: "error",
                message: "cours non trouvé!"
            }
        }
        const chapters = coursWithchapter.chapter

        const chapterDelete = chapters.find((chapter) => chapter.id === chapterId)
        if (!chapterDelete) {
            return {
                status: "error",
                message: "Chapitre non trouvé!"
            }
        }

        const remainingchapters = chapters.filter((chapter) => chapter.id !== chapterId)
        const updates = remainingchapters.map((chap, index) => {
            return prisma.chapter.update({
                where: { id: chap.id },
                data: { position: index + 1 }
            })
        })

        await prisma.$transaction([
            prisma.lesson.deleteMany({
                where: { chapterId },
            }),
            ...updates,
            prisma.chapter.delete({
                where: {
                    id: chapterId
                }
            })
        ])
        revalidatePath(`admin/courses/${courseId}/edit`)
        return {
            status: "success",
            message: "Chapitre supprimé avec succès !"
        }
    } catch (error) {
        console.error("Erreur deleteChapter:", error);
        return {
            status: "error",
            message: "Échec de suppression du chapitre"
        }
    }

}
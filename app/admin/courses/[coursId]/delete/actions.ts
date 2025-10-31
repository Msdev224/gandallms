"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { arcjetInstance } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { fixedWindow, request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjetInstance.withRule(
    fixedWindow({
        mode: 'LIVE',
        window: "1m",
        max: 5,
    })
)

export async function deleteCourse(courseId: string): Promise<ApiResponse>{
    const session  = await requireAdmin();
    if (!courseId) {
        return { status: "error", message: "ID du cours manquant." };
    }

    try {
        const req = await request()
        const decision = await aj.protect(req, {
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
        // await prisma.courses.delete({
        //     where: {
        //         id: coursId
        //     }
        // })
        await prisma.$transaction(async (tx) => {

            // 1️⃣ Récupérer tous les chapitres liés au cours
            const chapters = await tx.chapter.findMany({
                where: { courseId },
                select: { id: true },
            });

            const chapterIds = chapters.map(c => c.id);

            // 2️⃣ Supprimer les lessons liées à ces chapitres
            await tx.lesson.deleteMany({
                where: {
                    chapterId: { in: chapterIds },
                },
            });

            // 3️⃣ Supprimer les chapitres
            await tx.chapter.deleteMany({
                where: { courseId },
            });

            // 4️⃣ Supprimer le cours
            await tx.courses.delete({
                where: { id: courseId },
            });
        });

        revalidatePath("/admin/courses/")

        return {
            message: "Cours supprimer avec succès",
            status: "success"
        }
    }catch(e){
        console.log(e)
        return {
            message: "Quelque choses s'est mal passée",
            status: "error"
        }
    }
}
import "server-only";
import { requireAdmin } from "./require-admin";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export async function  adminGetCourse(id: string){
    await requireAdmin()

    const data = await prisma.courses.findUnique({
        where: {
          id: id
        },
        select: {
            id:true,
            slug:true,
            title:true,
            price:true,
            status:true,
            level: true,
            fileKey:true,
            duration:true,
            category:true,
            description:true,
            smallDescription:true,
            chapter: {
                select: {
                    id: true,
                    title: true,
                    position:true,
                    lessons: {
                        select: {
                            id:true,
                            title: true,
                            description: true,
                            thumbnailKey: true,
                            position: true,
                            videoUrl: true,
                        }
                    }
                }
            }
        }
        
    })

    if(!data){
        return notFound()
    }

    return data
}

export type AdminCourseSingularType = Awaited<ReturnType<typeof adminGetCourse>>;
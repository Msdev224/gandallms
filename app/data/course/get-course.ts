import "server-only";

import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export async function getIndividualCourse(slug: string) {
    const course = await prisma.courses.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            title: true,
            description: true,
            smallDescription: true,
            fileKey: true,
            price: true,
            duration: true,
            level: true,
            category: true,
            chapter: {
                orderBy: {
                    position: 'asc'
                },
                select: { 
                    id: true,
                    title: true,
                    lessons:{
                        orderBy: {
                            position: 'asc'
                        },
                        select: {
                            id: true,
                            title: true,
                        }
                    }
                },
                
            },

        }
    })

    if(!course){
        return notFound()
    }

    return course;
}
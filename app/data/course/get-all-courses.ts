import prisma from "@/lib/db";

export async function getAllCourses() {
    const data = await prisma.courses.findMany({
        where: {
            status: "Published"
        },
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            slug: true,
            title: true,
            price: true,
            level: true,
            fileKey: true,
            duration: true,
            category: true,
            smallDescription: true,
        }
    })
    return data;
}

export type PublicCourseType = Awaited <ReturnType <typeof getAllCourses>>[0]
import "server-only"
import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetRecentCourses(){
    // await new Promise((resolve)=>setTimeout(resolve, 5000))
    await requireAdmin();

    const data = await prisma.courses.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        take: 2,
        select: {
            id: true,
            smallDescription: true,
            duration: true,
            level: true,
            price: true,
            fileKey:true,
            slug:true,
            title: true,
            
        }
    });
    return data;
}
import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "./require-admin";
import prisma from "@/lib/db";

export async function adminGetCourses() {
    await requireAdmin()

    const data = await prisma.courses.findMany({
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            title: true,
            smallDescription: true,
            fileKey: true,
            duration: true,
            price: true,
            status: true,
            slug: true,
            level: true,
            category: true
        }
    })
    return data
}

export type adminCourseType = Awaited<ReturnType<typeof adminGetCourses>>

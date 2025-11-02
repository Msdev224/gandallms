import "server-only";

import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetDashboardStats() {
    await requireAdmin()



    const [totalSignups, totalCustomers, totalCourses, totalLessons] = await Promise.all([
        // total inscrits
        prisma.user.count(),

        // total clients
        prisma.user.count({
            where: {
                enrollment: {
                    some: {}
                }
            }
        }),
        // total cours()
        prisma.courses.count(),

        // total lessons
        prisma.lesson.count()
    ])

    return {
        totalSignups, 
        totalCustomers, 
        totalCourses, 
        totalLessons
    }
}
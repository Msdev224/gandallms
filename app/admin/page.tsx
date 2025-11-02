import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { adminGetEnrollmentsStats } from "../data/admin/admin-get-enrollments-stats";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses";
import AdminCourseCard from "./courses/_components/AdminCourseCard";
import { Suspense } from "react";
import { EmptyCard } from "@/components/EmptyCard";
import { AdminCourseCardSkeleton } from "./courses/_components/AdminCoursesCardSkeleton";

export default async function AdminIndexPage() {

  const enrollmentData = await adminGetEnrollmentsStats()
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive data={enrollmentData} />

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cours Réçent</h2>
          <Link
            href="/admin/courses"
            className={buttonVariants({ variant: "outline" })}
          >
            Tous les cours
          </Link>
        </div>
        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecenteCourses />
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecenteCourses(){
  const data = await adminGetRecentCourses();

  if(data.length ===0 ){
    return <EmptyCard link="admin/courses/create" text="Ajouter un Cours" />
  }

  return(
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {data.map((course)=>(
      <AdminCourseCard key={course.id} data={course} />
    ))}
    </div>
  )
}

function RenderRecentCoursesSkeletonLayout(){
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Array.from({length:2}).map((_, index)=>(
      <AdminCourseCardSkeleton key={index} />
    ))}
  </div>
}
import { adminGetCourses } from '@/app/data/admin/admin-get-courses'
import { buttonVariants } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import Link from 'next/link'
import AdminCourseCard from './_components/AdminCourseCard'
import { requireAdmin } from '@/app/data/admin/require-admin'

const CoursesPage = async () => {

  const data = await adminGetCourses()
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vos Cours</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          Créer un cours
          <PlusCircleIcon />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
       {data.map((course)=>(
        
          <AdminCourseCard data={course} key={course.id} />
       ))}
      </div>
    </>
  );
}

export default CoursesPage
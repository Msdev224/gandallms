import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { ArrowRight, Eye, GraduationCap, MoreVertical, Pencil, TimerIcon, Trash, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export const CourseStatus = {
  Draft: "Draft",
  Published: "Published",
  Archived: "Archived",
} as const;

export const CourseLevel = {
  Beginner: "Beginner",
  Intermediaire: "Intermediaire",
  Advanced: "Advanced",
} as const;


interface iAppProps {
  //   data: adminCourseType;
  level: CourseLevel;
  id: string;
  title: string;
  fileKey: string;
  price: number;
  duration: number;
  category: string;
  smallDescription: string;
  slug: string;
  status: CourseStatus;
}

// types utiles
export type CourseStatus = typeof CourseStatus[keyof typeof CourseStatus]
export type CourseLevel = typeof CourseLevel[keyof typeof CourseLevel]


const AdminCourseCard = ({ data }: {data: iAppProps}) => {
  const thumbnailUrl = useConstructUrl(data.fileKey);
  return (
    <Card className="group relative py-0 gap-0">
      {/* absolute dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/courses/${data.slug}/edit`}>
                <Pencil className="size-4 mr-2" /> Modifier le cours
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${data.slug}/edit`}>
                <Eye className="size-4 mr-2" /> Voir le cours
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/delete`}>
                <Trash2 className="size-4 mr-2 text-red-500" />
                Supprimé le cours
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={thumbnailUrl}
        alt="url image minuature"
        width={600} // ← largeur en px
        height={400}
        className="w-full rounded-t-lg aspect-video object-cover"
      />
      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${data.id}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight">
          {data.smallDescription}{" "}
        </p>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex gap-x-2 items-center ">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground font-semibold">
              {data.duration}h
            </p>
          </div>

          <div className="flex gap-x-2 items-center ">
            <GraduationCap className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground font-semibold">
              {data.level}
            </p>
          </div>
        </div>

        <Link
          href={`/admin/courses/${data.id}/edit`}
          className={buttonVariants({ className: "w-full mt-4" })}
        >
          Editer le Cours <ArrowRight />
        </Link>
      </CardContent>
    </Card>
  );
};

export default AdminCourseCard;

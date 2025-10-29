import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { School, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: PublicCourseType;
}

const PublicCourseCard = ({ data }: iAppProps) => {
  const thumbnailUrl = useConstructUrl(data.fileKey);
  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{data.level}</Badge>
      <Image
        src={thumbnailUrl || "/default-thumbnail.jpg"}
        alt="thumbnail Image of course"
        width={600}
        height={400}
        className="w-full rounded-t-xl aspect-video"
      />

      <CardContent className="p-4">
        <Link
          href={`/courses/${data.slug}`}
          className="font-medium text-lg line-clamp-1  hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.smallDescription}
        </p>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex space-x-2 items-center">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-muted-foreground text-sm">{data.duration}h</p>
          </div>

          <div className="flex space-x-2 items-center">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-muted-foreground text-sm">{data.category}</p>
          </div>
        </div>
        <Link
          href={`/courses/${data.slug}`}
          className={buttonVariants({ className: "mt-4 w-full" })}
        >
          Apprendre Plus
        </Link>
      </CardContent>
    </Card>
  );
};

export default PublicCourseCard;

export function PublicCourseCardSkeleton(){
    return (
      <Card className="group relative py-0 gap-0">
        <div className="absolute top-2 right-2 z-10 flex items-center">
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
        <div className="w-full relative h-fit">
          <Skeleton className="w-full rounded-t-xl  aspect-video" />
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          
          <div className="mt-4 flex items-center gap-x-5">
            <div className="flex items-center gap-x-2">
                <Skeleton className="size-6 rounded-md" />
                <Skeleton className="h-4 w-8" />
            </div>
          </div>
          <Skeleton className="mt-4 w-full h-10 rounded-md" />
        </CardContent>
      </Card>
    );
}
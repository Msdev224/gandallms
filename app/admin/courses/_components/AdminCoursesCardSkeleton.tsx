import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // si tu as un composant Skeleton, sinon créer un div avec bg-muted animate-pulse

export const AdminCourseCardSkeleton = () => {
  return (
    <Card className="group relative py-0 gap-0">
      {/* image placeholder */}
      <div className="w-full h-48 rounded-t-lg bg-muted animate-pulse" />

      <CardContent className="p-4 space-y-3">
        {/* title */}
        <Skeleton className="h-6 w-3/4 rounded" />
        {/* description */}
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />

        <div className="flex mt-4 gap-x-5">
          <div className="flex gap-x-2 items-center">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
          <div className="flex gap-x-2 items-center">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-14 rounded" />
          </div>
        </div>

        {/* button */}
        <Skeleton className="h-10 w-full mt-4 rounded" />
      </CardContent>
    </Card>
  );
};

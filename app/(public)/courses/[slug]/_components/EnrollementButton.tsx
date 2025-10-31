"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { enrollmentCourseAction } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function EnrollementButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();
  //   const router = useRouter();
  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        enrollmentCourseAction(courseId)
      );
      if (error) {
        toast.error(
          "Une erreur inattendue s'est produite. Veuillez réessayer."
        );
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <Button onClick={onSubmit} disabled={isPending} className="w-ful">
      {isPending ? (
        <>
          <Loader2 className="animate-spin size-4" /> Achat en cours ...
        </>
      ) : (
        "S'inscrire Maintenant !"
      )}
    </Button>
  );
}

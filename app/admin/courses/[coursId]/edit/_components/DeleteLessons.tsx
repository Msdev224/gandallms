import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteLessons } from "../actions";
import { toast } from "sonner";

export function DeleteLessons({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  async function onDelete() {
    startTransition(async () => {
      const {data: result, error} = await tryCatch(deleteLessons({chapterId, courseId, lessonId}));

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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" className="cursor-pointer">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous vraiment sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Elle supprimera définitivement cette
            leçon.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={pending}>
            {pending ? "Suppresion..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    
  );
}

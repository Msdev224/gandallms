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
import { Loader, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteChapter, deleteLessons } from "../actions";
import { toast } from "sonner";

export function DeleteChapter({
  chapterId,
  courseId,

}: {
  chapterId: string;
  courseId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  async function onDelete() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteChapter({ chapterId, courseId
          
        })
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
            Cette action est irréversible. Elle supprimera définitivement ce
            chapitre
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={pending}>
            {pending ? (
              <>
                <Loader className="size-4 animate-spin" />
                "Suppresion..."
              </>
            ) : (
              "Supprimer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader } from "lucide-react";
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
import { tryCatch } from "@/hooks/try-catch";
import { deleteCourse } from "./actions";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface DeleteCourseProps {
  courseId: string;
  redirectTo?: string;
  onClose?: () => void;
}

export default function DeleteCourse({
  courseId,
  redirectTo = "/admin/courses",
  onClose,
}: DeleteCourseProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));
      if (error) {
        toast.error("Une erreur inattendue s'est produite.");
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
        onClose?.();
        window.location.href = redirectTo; // ou router.push si Next.js 13+
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <>
      {/* Bouton visible dans le DropdownMenu */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <DropdownMenuItem asChild>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 /> Supprimer
            </Button>
          </AlertDialogTrigger>
        </DropdownMenuItem>

        {/* Modal */}
        <AlertDialogContent className="sm:max-w-lg w-full mx-auto my-auto p-6 rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et supprimera définitivement ce
              cours.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={pending}>
              {pending ? (
                <>
                  <Loader className="animate-spin mr-2" /> Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

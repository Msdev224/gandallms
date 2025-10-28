"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { chapterSchemaType, chapterSchema } from "@/lib/zodSchemas";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { addChapter } from "../actions";
import { toast } from "sonner";
export default function NewChapterModal({ courseId }: { courseId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition()

  const form = useForm<chapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      courseId: courseId,
    },
  });

  async function onSubmit(values: chapterSchemaType) {
    startTransition(async () =>{
        const {data: result, error} = await tryCatch(addChapter(values));

        if(error){
          toast.error(
            "Une erreur inattendue s'est produite. Veuillez réessayer."
          );
          return;
        }

        if(result.status === "success"){
          toast.success(result.message)
          form.reset();
          setIsOpen(false)
        } else if (result.status === 'error'){
          toast.error(result.message)
        }
    })
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="size-4" /> Nouveau Chapitre
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-110">
        <DialogHeader>
          <DialogTitle>Nouveau Chapitre</DialogTitle>
          <DialogDescription>
            comment aimeriez-vous nommer votre chapitre
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nommez le chapitre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={pending} type="submit">
                {pending ? "Ajoute..." : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

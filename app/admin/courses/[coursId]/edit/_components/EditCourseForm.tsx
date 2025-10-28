"use client";
import { Button } from "@/components/ui/button";
import {
  courseCategories,
  CourseLevel,
  CourseSchemaType,
  coursesSchema,
  CourseStatus,
} from "@/lib/zodSchemas";
import { Loader2, RefreshCcw, SparkleIcon } from "lucide-react";
import { useForm, Control } from "react-hook-form";
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
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/Uploader";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { editCourse } from "../actions";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";

interface iApprops {
  data: AdminCourseSingularType;
}

export function EditCourse({ data }: iApprops) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(coursesSchema),
    defaultValues: {
      title: data.title,
      description: data.description,
      fileKey: data.fileKey,
      price: data.price,
      duration: data.duration,
      level: data.level,
      category: data.category as CourseSchemaType["category"],
      status: data.status,
      slug: data.slug,
      smallDescription: data.smallDescription,
    },
  });
  function onSubmit(values: CourseSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        editCourse(values, data.id)
      );
      if (error) {
        toast.error(
          "Une erreur inattendue s'est produite. Veuillez réessayer."
        );
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* TiTre */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Slug */}
        <div className="flex gap-4 items-end">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Slug" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            className="w-fit cursor-pointer"
            onClick={() => {
              const titleValue = form.getValues("title");

              const slug = slugify(titleValue);
              form.setValue("slug", slug, { shouldValidate: true });
            }}
          >
            Générer le slug <SparkleIcon className="ml-1" size={16} />
          </Button>
        </div>
        {/* Courte description */}
        <FormField
          control={form.control}
          name="smallDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Courte Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Courte Description"
                  {...field}
                  className="min-h-30"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fichier */}
        <FormField
          control={form.control}
          name="fileKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Uploader onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Categorie et Niveaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categorie</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selectionner une catégory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveaux</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selectionner le niveau" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CourseLevel.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée (heure)</FormLabel>
                <FormControl>
                  <Input placeholder="Durée" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix (GNF)</FormLabel>
                <FormControl>
                  <Input placeholder="Prix" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selectionner le statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CourseStatus.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className={`cursor-pointer`} type="submit" disabled={isPending}>
          {isPending ? (
            <>
              Mis à jour...
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Mis à jour <RefreshCcw className="ml-1" size={16} />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

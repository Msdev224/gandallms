import { getIndividualCourse } from "@/app/data/course/get-course";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useConstructUrl } from "@/hooks/use-construct-url";
import {
  IconBook,
  IconCategory,
  IconCategory2,
  IconChartBar,
  IconChevronDown,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
type Params = Promise<{ slug: string }>;

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getIndividualCourse(slug);
  const thumbnailUrl = useConstructUrl(course.fileKey);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={thumbnailUrl || "/default-thumbnail.jpg"}
            alt={`Image du cours ${course.title}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradiend-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
              {course.smallDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
              <span>{course.level}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconCategory className="size-4" />
              <span>{course.category}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconClock className="size-4" />
              <span>{course.duration} heures</span>
            </Badge>
          </div>

          <Separator className="my-8" />
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight uppercase">
              Description:
            </h2>

            <RenderDescription json={JSON.parse(course.description)} />
          </div>
        </div>
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight uppercase">
              Contenu
            </h2>
            <div className="">
              {course.chapter.length} - Sections |{" "}
              {course.chapter.reduce(
                (total, chapter) => total + chapter.lessons.length,
                0
              ) || 0}{" "}
              Leçons
            </div>
          </div>
          <div className="space-y-4">
            {course.chapter.map((chapter, index) => (
              <Collapsible key={chapter.id} defaultOpen={index == 0}>
                <Card className="p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md gap-0">
                  <CollapsibleTrigger>
                    <div className="">
                      <CardContent className="p-6 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <p className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                              {index + 1}
                            </p>
                            <div>
                              <h3 className="font-semibold text-xl text-left">
                                {chapter.title}{" "}
                              </h3>
                              <p className="text-sm text-muted-foreground text-left">
                                {" "}
                                {chapter.lessons.length}{" "}
                                {chapter.lessons.length !== 1
                                  ? "Leçons"
                                  : "Leçon"}{" "}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-sx">
                              {chapter.lessons.length}{" "}
                              {chapter.lessons.length !== 1
                                ? "Leçons"
                                : "Leçon"}
                            </Badge>
                            <IconChevronDown className="size-5 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-2 bg-muted/20">
                      <div className="p-6 pt-4 space-y-3">
                        {chapter.lessons.map((lesson, lessonIndex) => (
                          <div
                            className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent transition-colors "
                            key={lesson.id}
                          >
                            <div className="flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/20">
                              <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">
                                {" "}
                                {lesson.title}{" "}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                lesson {lessonIndex + 1}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollement Card */}
      <div className="order-2 lg:col-span-1">
        <div className="sticky top-20">
          <Card className="py-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Prix :</span>
                <span className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat("fr-GN", {
                    style: "currency",
                    currency: "GNF",
                    minimumFractionDigits: 0,
                  }).format(course.price)}
                </span>
              </div>
              <div className="mb-6 space-y-3 rounded-lg bg-muted p-4">
                <h4 className="font-medium">Ce que vous obtiendrez:</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconClock className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Durée du Cours </p>
                      <p className="text-sm text-muted-foreground">
                        {course.duration} heures
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconChartBar className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Niveau de Difficulté
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {course.level}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconCategory2 className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Categorie</p>
                      <p className="text-sm text-muted-foreground">
                        {course.category}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconBook className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total</p>
                      <p className="text-sm text-muted-foreground">
                        {course.chapter.reduce(
                          (total, chapter) => total + chapter.lessons.length,
                          0
                        ) || 0}{" "}
                        Leçons
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <h4>Ce cours comprend : </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 p-1">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Un accès complet à vie</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 p-1">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Un accès sur mobile ou ordinateur de bureau </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 p-1">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Un certificat de reussite</span>
                  </li>
                </ul>
              </div>

              <Button className="w-full cursor-pointer">Inscrivez-vous maintenant</Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">Garantie de remboursement de 15 jours</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

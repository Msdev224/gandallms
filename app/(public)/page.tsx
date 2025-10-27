"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Link from "next/link";


interface featureProps {
  title: string;
  description: string;
  icon: string;
}
const features: featureProps[] = [
  {
    title: "Cours complets",
    description:
      "Accédez à une large gamme de cours soigneusement sélectionnés et conçus par des experts du secteur.",
    icon: "📚",
  },

  {
    title: "Apprentissage interactif",
    description:
      "Participez à du contenu interactif, des quiz et des devoirs pour améliorer votre expérience d'apprentissage.",
    icon: "🎮",
  },

  {
    title: "Suivi des progrès",
    description:
      "Suivez vos progrès et vos réalisations avec des analyses détaillées et un tableau de bord personnalisé",
    icon: "📊",
  },
  {
    title: "Soutien communautaire",
    description:
      "Rejoignez une communauté dynamique d'apprenants et d'instructeurs pour collaborer et acquérir des connaissances.",
    icon: "👥",
  },
];
export default function Home() {
 
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant={"outline"}>L'avenir de l'Éducation en Ligne</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Améliorez votre expérience d'apprentissage
          </h1>
          <p className="max-w-[700px] text-muted-foreground">
            Découvrez une nouvelle façon d'apprendre grâce à notre plateforme de
            gestion de l'apprentissage moderne et interactive. Accédez à des
            cours de haute qualité, où et quand vous le souhaitez.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/courses"
              className={buttonVariants({
                size: "lg",
              })}
            >
              Explorer les cours
            </Link>

            <Link
              href="/login"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
              })}
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}

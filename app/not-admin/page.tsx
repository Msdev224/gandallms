import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="bg-destructive/50 rounded-full p-4 w-fit mx-auto">
            <ShieldX className="size-16 text-destructive" />
          </div>
          <CardTitle className="text-center text-2xl mt-4">
            Accès non Autorisé
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground max-w-xs mx-auto">
            Accès refusé : seuls les administrateurs sont autorisés à créer des
            cours ou à gérer ce type de contenu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/"
            className={`${buttonVariants({ variant: "outline", className:'w-full' })} mr-2`}
          >
            <ArrowLeft />
            Retour à la page d'acceuil
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

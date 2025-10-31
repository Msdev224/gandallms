import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {  ArrowRight, BadgeCheckIcon } from "lucide-react";
import Link from "next/link";
import { ConfettiTrigger } from "@/components/ConfettiTrigger";

export default function PaymentSuccessfull() {

  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
        <ConfettiTrigger />
      <Card className="w-88">
        <CardContent className="">
          <div className="w-full flex justify-center mb-4">
            <BadgeCheckIcon className="size-25 p-2 bg-green-500/30 text-green-500 rounded-full" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">
              Paiement Effectuer avec succès
            </h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
              Félicitations, votre paiement a bien été effectué. Vous devriez
              maintenant avoir accès au cours !
            </p>

            <Link
              href="/dashboard"
              className={buttonVariants({ className: "w-full mt-5" })}
            >
              Aller au tableau de bord
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

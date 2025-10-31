import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelled(){
    return (
      <div className="w-full min-h-screen flex flex-1 justify-center items-center">
        <Card className="w-88">
          <CardContent className="">
            <div className="w-full flex justify-center mb-4">
              <XIcon className="size-12 p-2 bg-red-500/30 text-red-500 rounded-full" />
            </div>
            <div className="mt-3 text-center sm:mt-5 w-full">
              <h2 className="text-xl font-semibold">Paiement annulé</h2>
              <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
                Pas de souci, vous ne serez pas facturé. Veuillez réessayer.
              </p>

              <Link href="/" className={buttonVariants({className:"w-full mt-5"})}>
              <ArrowLeft className="size-4" />
              Retourner à la page d'acceuil
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}
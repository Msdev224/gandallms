import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Logo from "@/public/logo.png"
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href={"/"}
        className={buttonVariants({
          variant: "outline",
          className:
            "absolute top-4 left-4 hover:bg-orange-500 hover:text-white",
        })}
      >
        <ArrowLeft className="size-4" />
        Retourner
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href={"/"}
          className="flex items-center gap-2 self-center font-semibold"
        >
          <Image src={Logo} alt="logo" width={64} height={64} className="" />
          Gandal LMS.
        </Link>
        {children}

        <div className="text-balance text-center text-xs text-muted-foreground">
          En cliquant sur « Continuer », vous acceptez nos{" "}
          <span className="hover:text-primay hover:underline hover:cursor-pointer">Conditions d'Utilisation</span> et notre{" "}
          <span className="hover:text-primay hover:underline hover:cursor-pointer">Politique de Confidentialité</span>.
        </div>
      </div>
    </div>
  );
}

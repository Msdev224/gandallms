import { IconBookOff } from "@tabler/icons-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";

export function EmptyCard({text, link}:{text:string, link:string}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBookOff />
        </EmptyMedia>
        <EmptyTitle>Aucun Cours Pour l'instant</EmptyTitle>
        <EmptyDescription>
          Vous n'avez encore ajouté aucun cours. Cliquez sur "Ajouter un cours"
          pour créer de nouvelles formations et commencer à remplir votre
          catalogue.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Link href={link} className={buttonVariants()}>
            {text}
          </Link>
        </div>
      </EmptyContent>
    </Empty>
  );
}

import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import {
  Bold,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo2,
  Redo2,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Copy,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface iAppProps {
  editor: Editor | null;
}

export function MenuBar({ editor }: iAppProps) {
  if (!editor) {
    return null;
  }

  const buttons = [
    {
      icon: Bold,
      label: "Gras",
      isActive: () => editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      label: "Italique",
      isActive: () => editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: Strikethrough,
      label: "Barré",
      isActive: () => editor.isActive("strike"),
      onClick: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      icon: Code,
      label: "Code en ligne",
      isActive: () => editor.isActive("code"),
      onClick: () => editor.chain().focus().toggleCode().run(),
    },
  ];

  const headingButtons = [
    {
      icon: Heading1Icon,
      label: "Titre 1",
      isActive: () => editor.isActive("heading", { level: 1 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: Heading2Icon,
      label: "Titre 2",
      isActive: () => editor.isActive("heading", { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: Heading3Icon,
      label: "Titre 3",
      isActive: () => editor.isActive("heading", { level: 3 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ];

  const listButtons = [
    {
      icon: List,
      label: "Liste à puces",
      isActive: () => editor.isActive("bulletList"),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      label: "Liste numérotée",
      isActive: () => editor.isActive("orderedList"),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: Quote,
      label: "Citation",
      isActive: () => editor.isActive("blockquote"),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      icon: Code,
      label: "Bloc de code",
      isActive: () => editor.isActive("codeBlock"),
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
    },
  ];

  const alignButtons = [
    {
      icon: AlignLeft,
      label: "Aligner à gauche",
      isActive: () => editor.isActive({ textAlign: "left" }),
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
    },
    {
      icon: AlignCenter,
      label: "Centrer",
      isActive: () => editor.isActive({ textAlign: "center" }),
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
    },
    {
      icon: AlignRight,
      label: "Aligner à droite",
      isActive: () => editor.isActive({ textAlign: "right" }),
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
    },
    {
      icon: AlignJustify,
      label: "Justifier",
      isActive: () => editor.isActive({ textAlign: "justify" }),
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
    },
  ];

  const linkButtons = [
    {
      icon: Link,
      label: "Lien",
      isActive: () => editor.isActive("link"),
      onClick: () => {
        const url = prompt("Entrez l'URL:");
        if (url) {
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }
      },
    },
  ];

  const undoRedoButtons = [
    {
      icon: Undo2,
      label: "Annuler",
      isActive: () => false,
      onClick: () => editor.chain().focus().undo().run(),
    },
    {
      icon: Redo2,
      label: "Refaire",
      isActive: () => false,
      onClick: () => editor.chain().focus().redo().run(),
    },
  ];

  const utilityButtons = [
    {
      icon: Type,
      label: "Paragraphe",
      isActive: () => editor.isActive("paragraph"),
      onClick: () => editor.chain().focus().setParagraph().run(),
    },
    {
      icon: Copy,
      label: "Copier le contenu",
      isActive: () => false,
      onClick: () => {
        navigator.clipboard.writeText(editor.getHTML());
        alert("Contenu copié !");
      },
    },
    {
      icon: Trash2,
      label: "Effacer tout",
      isActive: () => false,
      onClick: () => {
        if (confirm("Êtes-vous sûr de vouloir effacer tout le contenu ?")) {
          editor.chain().focus().clearContent().run();
        }
      },
    },
  ];

  type Button = {
    icon: React.ElementType;
    label: string;
    isActive: () => boolean;
    onClick: () => void;
  };

  const renderButtonGroup = (buttons: Button[]) => (
    <>
      {buttons.map((button, idx) => (
        <Tooltip key={idx}>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={button.isActive()}
              onPressedChange={button.onClick}
              className={cn(
                "transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                button.isActive() &&
                  "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              )}
            >
              <button.icon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>{button.label}</TooltipContent>
        </Tooltip>
      ))}
    </>
  );

  return (
    <div className="bg-white dark:bg-gray-900 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
      <TooltipProvider>
        <div className="flex flex-wrap gap-2 items-center p-3">
          {/* Formatage texte */}
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-md p-1 border border-gray-200 dark:border-gray-700">
            {renderButtonGroup(buttons)}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Titres */}
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-md p-1 border border-gray-200 dark:border-gray-700">
            {renderButtonGroup(headingButtons)}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Listes et blocs */}
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-md p-1 border border-gray-200 dark:border-gray-700">
            {renderButtonGroup(listButtons)}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Alignement */}
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-md p-1 border border-gray-200 dark:border-gray-700">
            {renderButtonGroup(alignButtons)}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Liens */}
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-md p-1 border border-gray-200 dark:border-gray-700">
            {renderButtonGroup(linkButtons)}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-md p-1 border border-gray-200 dark:border-gray-700">
            {renderButtonGroup(undoRedoButtons)}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Utilitaires */}
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-md p-1 border border-gray-200 dark:border-gray-700">
            {renderButtonGroup(utilityButtons)}
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}

"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { BulletList, OrderedList, ListItem } from "@tiptap/extension-list";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { MenuBar } from "./MenuBar";
import { useState, useEffect } from "react";

const lowlight = createLowlight(all);

export function RichTextEditor() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-inside ml-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-inside ml-4",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "my-0", // <-- clé : pas de marge
          },
        },
        codeBlock: false,
        code: {
          HTMLAttributes: {
            class: "bg-muted px-2 py-1 rounded text-sm font-mono",
          },
        },
        heading: {
          levels: [1, 2, 3],
        },
        blockquote: {
          HTMLAttributes: {
            class:
              "border-l-4 border-muted-foreground pl-4 italic text-muted-foreground",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline hover:text-blue-600",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono",
        },
      }),
    ],
    immediatelyRender: false,
    content: `
    <h2>Bienvenue dans l'éditeur Rich Text</h2>
    <p>Commencez à taper ou utilisez les outils de formatage ci-dessus pour :</p>
    <ul>
      <li>Créer des listes à puces</li>
      <li>Ajouter des listes numérotées</li>
      <li>Aligner votre texte</li>
    </ul>
  `,
  });
  if (!isMounted || !editor) return null;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="border border-input rounded-lg overflow-hidden shadow-lg bg-card">
        {/* Barre de menu */}
        <MenuBar editor={editor} />

        {/* Éditeur */}
        <div className="border-t border-input bg-white dark:bg-slate-950">
          <EditorContent
            editor={editor}
            className="prose prose-sm dark:prose-invert max-w-none p-6 min-h-[500px] focus:outline-none
  [&_ul]:list-disc [&_ul]:list-inside [&_ul]:ml-4 [&_ul]:my-2
  [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:ml-4 [&_ol]:my-2
  [&_li]:my-0
  [&_p]:my-2
  [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:my-4
  [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:my-3
  [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:my-2
  [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-2
  [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-2
  [&_code]:bg-muted [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
  [&_a]:text-blue-500 [&_a]:underline [&_a]:hover:text-blue-600
  [&_strong]:font-bold
  [&_em]:italic
  [&_s]:line-through"
          />
        </div>

        {/* Informations bas de page */}
        <div className="border-t border-input bg-muted/50 p-3 text-xs text-muted-foreground flex justify-between">
          <span>Mots: {editor.storage.characterCount?.words() || 0}</span>
          <span>
            Caractères: {editor.storage.characterCount?.characters() || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

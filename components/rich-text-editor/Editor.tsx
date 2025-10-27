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

export function RichTextEditor({ field }: { field: any }) {
  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => setIsMounted(true), []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        codeBlock: false,
        code: {
          HTMLAttributes: {
            class:
              "bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono",
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "font-bold",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class:
              "border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc pl-6 my-2",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal pl-6 my-2",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "leading-relaxed",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-blue-600 dark:text-blue-400 underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-300",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class:
            "bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm font-mono my-2",
        },
      }),
    ],

    editorProps: {
      attributes: {
        class:
          "min-h-[300px] px-4 focus:outline-non prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
        // "prose prose-sm dark:prose-invert max-w-none focus:outline-none p-6 min-h-[300px]",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value): "",
  });

  // if (!isMounted || !editor) {
  //   return (
  //     <div className="w-full max-w-5xl mx-auto">
  //       <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-900">
  //         <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-12 border-b border-gray-200 dark:border-gray-700" />
  //         <div className="min-h-[500px] bg-white dark:bg-gray-900 p-6" />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-900">
        {/* Barre de menu */}
        <MenuBar editor={editor} />

        {/* Éditeur */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
          <EditorContent
            editor={editor}
            className="min-h-[500px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-6 [&_.ProseMirror]:min-h-[500px]
            
            /* Paragraphes et texte */
            [&_.ProseMirror_p]:my-3 [&_.ProseMirror_p]:leading-relaxed
            [&_.ProseMirror_strong]:font-bold
            [&_.ProseMirror_em]:italic
            [&_.ProseMirror_s]:line-through
            
            /* Titres */
            [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:my-4 [&_.ProseMirror_h1]:leading-tight
            [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:my-3 [&_.ProseMirror_h2]:leading-tight
            [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_h3]:my-2 [&_.ProseMirror_h3]:leading-tight
            
            /* Listes - SOLUTION D'ALIGNEMENT */
            [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-3
            [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-3
            [&_.ProseMirror_li]:my-1 [&_.ProseMirror_li]:leading-relaxed
            [&_.ProseMirror_li>p]:m-0 [&_.ProseMirror_li>p]:inline
            
            /* Citations */
            [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-gray-300 [&_.ProseMirror_blockquote]:dark:border-gray-600 
            [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-gray-600 
            [&_.ProseMirror_blockquote]:dark:text-gray-400 [&_.ProseMirror_blockquote]:my-3
            
            /* Code */
            [&_.ProseMirror_pre]:bg-gray-100 [&_.ProseMirror_pre]:dark:bg-gray-800 [&_.ProseMirror_pre]:p-4 
            [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:my-3
            [&_.ProseMirror_code]:bg-gray-100 [&_.ProseMirror_code]:dark:bg-gray-800 [&_.ProseMirror_code]:px-1.5 
            [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:text-sm [&_.ProseMirror_code]:font-mono
            
            /* Liens */
            [&_.ProseMirror_a]:text-blue-600 [&_.ProseMirror_a]:dark:text-blue-400 [&_.ProseMirror_a]:underline 
            [&_.ProseMirror_a]:cursor-pointer [&_.ProseMirror_a:hover]:text-blue-800 [&_.ProseMirror_a:hover]:dark:text-blue-300"
          />
        </div>

        {/* Informations bas de page */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 text-xs text-gray-600 dark:text-gray-400 flex justify-between">
          <span>Mots: {editor?.storage.characterCount?.words() || 0}</span>
          <span>
            Caractères: {editor?.storage.characterCount?.characters() || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

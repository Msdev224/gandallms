"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import {type JSONContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import parse from 'html-react-parser'
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);

export function RenderDescription({json}: {json: JSONContent}) {
  const output = useMemo(()=>{
    return generateHTML(json, [
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
    ]);
  }, [json]);

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  )
}

import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import type { Operation } from "fast-json-patch";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import SlashCommand from "./SlashCommand";

type Props = {
  open: boolean;
  onClose: () => void;
  schema: any;
  setSchema: (s:any)=>void;
  path: string;
  value?: any;
  brandColor?: string;
  placeholder?: string;
};

export default function RichTextFullScreen({
  open, onClose, schema, setSchema, path, value,
  brandColor="#6D28D9", placeholder="Γράψε περιεχόμενο…"
}: Props) {
  const extensions = useMemo(() => [
    StarterKit.configure({ 
      heading: { levels:[1,2,3,4] },
      link: false, // Disable built-in link to avoid duplicates
      underline: false // Disable built-in underline to avoid duplicates
    }),
    Underline, 
    Link.configure({ autolink: true, openOnClick:false }),
    TextStyle, Color, Highlight,
    TextAlign.configure({ types:["heading","paragraph"] }),
    Placeholder.configure({ placeholder }),
    Image, Table.configure({ resizable:true }), TableRow, TableHeader, TableCell,
    CharacterCount, Typography, SlashCommand
  ], [placeholder]);

  // Debounce patch updates to prevent bombardment
  const applyPatchDebounced = useMemo(() => {
    let timeout: any;
    return (json: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const op: Operation = { op: value ? "replace" : "add", path, value: { type:"tiptap", json } };
        const next = applyPatchWithValidation(schema, [op]);
        setSchema(next);
      }, 180);
    };
  }, [schema, setSchema, path, value]);

  const editor = useEditor({
    extensions,
    content: value?.json ?? value ?? null,
    onUpdate: ({ editor }) => applyPatchDebounced(editor.getJSON())
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") { e.preventDefault(); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full h-full md:mx-auto md:my-6 md:h-[92vh] md:max-w-5xl rounded-xl shadow-lg overflow-hidden flex flex-col">
        <header className="flex items-center gap-3 p-3 border-b">
          <div className="w-2 h-2 rounded-full" style={{ background: brandColor }} />
          <h3 className="font-semibold">Full-screen editor</h3>
          <div className="ml-auto text-sm opacity-60">Esc • ⌘/Ctrl+S</div>
        </header>
        <div className="flex-1 overflow-auto">
          <EditorContent editor={editor} className="prose max-w-none p-6 min-h-[60vh]" />
        </div>
        <footer className="p-3 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-3 h-9 rounded-md border">Close</button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
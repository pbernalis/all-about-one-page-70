import React, { useMemo, useState } from "react";
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
import RichTextFullScreen from "./RichTextFullScreen";
import SlashCommand from "./SlashCommand";

function palette(brand: string) {
  return [brand, "#111827", "#374151", "#6B7280", "#9CA3AF", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];
}

type Props = {
  schema: any; setSchema: (s:any)=>void; path: string;
  value?: any; placeholder?: string; brandColor?: string;
  uploadImage?: (file: File) => Promise<string>;
  readOnly?: boolean; className?: string;
  enableSlashCommands?: boolean;
  showFullScreenButton?: boolean;
};

export default function RichTextField({
  schema, setSchema, path, value, placeholder="Γράψε περιεχόμενο…",
  brandColor="#6D28D9", uploadImage, readOnly=false, className="",
  enableSlashCommands=true, showFullScreenButton=true
}: Props) {

  const [openFull, setOpenFull] = useState(false);

  const extensions = useMemo(() => {
    const base = [
      StarterKit.configure({ 
        heading: { levels:[1,2,3,4] },
        link: false, // Disable built-in link to avoid duplicates
        underline: false // Disable built-in underline to avoid duplicates
      }),
      Underline,
      Link.configure({ autolink: true, defaultProtocol:"https", openOnClick:false, linkOnPaste:true }),
      TextStyle, Color, Highlight,
      TextAlign.configure({ types:["heading","paragraph"] }),
      Placeholder.configure({ placeholder }),
      Image.extend({ addOptions(){ return { allowBase64:true }; } }),
      Table.configure({ resizable:true }), TableRow, TableHeader, TableCell,
      CharacterCount, Typography,
    ];
    if (enableSlashCommands) base.push(SlashCommand as any);
    return base;
  }, [placeholder, enableSlashCommands]);

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
    editable: !readOnly,
    onUpdate: ({ editor }) => applyPatchDebounced(editor.getJSON())
  });

  if (!editor) return null;

  async function onPickImage(){
    if (!uploadImage) return;
    const input = document.createElement("input");
    input.type="file"; input.accept="image/*";
    input.onchange = async () => {
      const f = input.files?.[0]; if (!f) return;
      const src = await uploadImage(f);
      editor.chain().focus().setImage({ src, alt:"" }).run();
    };
    input.click();
  }

  const colors = palette(brandColor);
  const Btn = (p:React.ButtonHTMLAttributes<HTMLButtonElement>) =>
    <button {...p} className={`px-2 py-1 text-sm rounded hover:bg-muted ${p.className??""}`} />;

  return (
    <div className={`border rounded-xl overflow-hidden bg-white ${className}`}>
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
          <Btn onClick={()=>editor.chain().focus().undo().run()}>↺</Btn>
          <Btn onClick={()=>editor.chain().focus().redo().run()}>↻</Btn>
          <span className="mx-1 w-px h-5 bg-border" />
          <Btn onClick={()=>editor.chain().focus().toggleBold().run()}><b>B</b></Btn>
          <Btn onClick={()=>editor.chain().focus().toggleItalic().run()}><i>I</i></Btn>
          <Btn onClick={()=>editor.chain().focus().toggleUnderline().run()}><u>U</u></Btn>
          <Btn onClick={()=>editor.chain().focus().toggleStrike().run()}>S</Btn>
          <Btn onClick={()=>editor.chain().focus().toggleCode().run()}>{"</>"}</Btn>
          <span className="mx-1 w-px h-5 bg-border" />
          <Btn onClick={()=>editor.chain().focus().setParagraph().run()}>P</Btn>
          {[1,2,3,4].map(l=>(
            <Btn key={l} onClick={()=>editor.chain().focus().toggleHeading({level:l as any}).run()}>H{l}</Btn>
          ))}
          <Btn onClick={()=>editor.chain().focus().toggleBulletList().run()}>• List</Btn>
          <Btn onClick={()=>editor.chain().focus().toggleOrderedList().run()}>1. List</Btn>
          <Btn onClick={()=>editor.chain().focus().toggleBlockquote().run()}>❝</Btn>
          <Btn onClick={()=>editor.chain().focus().setHorizontalRule().run()}>—</Btn>
          <span className="mx-1 w-px h-5 bg-border" />
          <Btn onClick={()=>editor.chain().focus().setTextAlign("left").run()}>⟸</Btn>
          <Btn onClick={()=>editor.chain().focus().setTextAlign("center").run()}>≡</Btn>
          <Btn onClick={()=>editor.chain().focus().setTextAlign("right").run()}>⟹</Btn>
          <span className="mx-1 w-px h-5 bg-border" />
          <div className="flex items-center gap-1">
            {colors.map(c=>(
              <button key={c} onClick={()=>editor.chain().focus().setColor(c).run()}
                      className="w-5 h-5 rounded border" style={{background:c}} title={c}/>
            ))}
            <Btn onClick={()=>editor.chain().focus().unsetColor().run()}>⨯</Btn>
            <Btn onClick={()=>editor.chain().focus().toggleHighlight().run()}>HL</Btn>
          </div>
          <span className="mx-1 w-px h-5 bg-border" />
          <Btn onClick={()=>{
            const url = prompt("Insert URL");
            if (url) editor.chain().focus().extendMarkRange("link")
              .setLink({ href:url, target:"_blank", rel:"noopener noreferrer" }).run();
          }}>🔗</Btn>
          <Btn onClick={()=>editor.chain().focus().unsetLink().run()}>Unlink</Btn>
          <Btn onClick={onPickImage}>🖼</Btn>

          {showFullScreenButton && (
            <button onClick={()=>setOpenFull(true)}
              className="ml-auto px-2 py-1 text-sm rounded border bg-white hover:bg-muted"
              title="Full-screen (⌘/Ctrl+Shift+E)">⤢ Full</button>
          )}
        </div>
      )}
      
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[160px]" />

      <RichTextFullScreen
        open={openFull}
        onClose={()=>setOpenFull(false)}
        schema={schema}
        setSchema={setSchema}
        path={path}
        value={value}
        brandColor={brandColor}
        placeholder={placeholder}
      />
    </div>
  );
}
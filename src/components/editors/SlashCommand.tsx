import React, { useEffect, useRef } from "react";
import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import { Suggestion } from "@tiptap/suggestion";
import tippy, { Instance as TippyInstance } from "tippy.js";
import "tippy.js/dist/tippy.css";

type Item = {
  title: string;
  hint?: string;
  run: (ctx: { editor: any; range: { from: number; to: number } }) => void;
};

function getItems(editor: any): Item[] {
  return [
    { title: "Heading 1", hint: "Big title", run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run() },
    { title: "Heading 2", run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run() },
    { title: "Paragraph", run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setParagraph().run() },
    { title: "Bullet List", run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run() },
    { title: "Ordered List", run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run() },
    { title: "Quote", run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run() },
    { title: "Divider", run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run() },
    { title: "Image", hint: "Paste URL…", run: ({ editor, range }) => {
      const url = window.prompt("Image URL");
      if (url) editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
    }},
    { title: "Link", run: ({ editor, range }) => {
      const url = window.prompt("Link URL");
      if (url) editor.chain().focus().deleteRange(range).extendMarkRange("link")
        .setLink({ href: url, target: "_blank", rel: "noopener noreferrer" }).run();
    }},
  ];
}

const List: React.FC<{ items: Item[]; command: (item: Item) => void; }> = ({ items, command }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current?.querySelector("[data-item]") as HTMLButtonElement | null;
    el?.focus();
  }, []);
  return (
    <div ref={ref} className="rounded-md border bg-white shadow-md overflow-hidden min-w-[220px]">
      {items.map((it, i) => (
        <button key={i} data-item
          className="w-full text-left px-3 py-2 text-sm hover:bg-muted focus:bg-muted outline-none"
          onClick={() => command(it)}>
          <div className="font-medium">{it.title}</div>
          {it.hint && <div className="text-xs opacity-60">{it.hint}</div>}
        </button>
      ))}
    </div>
  );
};

export const SlashCommand = Extension.create({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: true,
        allowSpaces: false,
        command: ({ editor, range, props }: any) => {
          props.item.run({ editor, range });
        },
        items: ({ editor, query }: any) => {
          const all = getItems(editor);
          if (!query) return all;
          return all.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()));
        },
        render: () => {
          let component: ReactRenderer | null = null;
          let popup: TippyInstance[] = [];

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(List, {
                props: { items: props.items, command: (item: Item) => props.command({ id: item.title, item }) },
                editor: props.editor,
              });
              popup = tippy("body", {
                getReferenceClientRect: props.clientRect as any,
                appendTo: () => document.body,
                content: (component.element as any),
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },
            onUpdate(props: any) {
              component?.updateProps({
                items: props.items,
                command: (item: Item) => props.command({ id: item.title, item }),
              });
              popup[0].setProps({ getReferenceClientRect: props.clientRect as any });
            },
            onKeyDown(props: any) {
              if (props.event.key === "Escape") { popup[0].hide(); return true; }
              return false;
            },
            onExit() {
              popup[0]?.destroy();
              component?.destroy();
            },
          };
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [Suggestion({ editor: this.editor, ...this.options.suggestion })];
  },
});

export default SlashCommand;
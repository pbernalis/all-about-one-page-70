import { generateHTML } from "@tiptap/core";
import DOMPurify from "dompurify";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Typography from "@tiptap/extension-typography";

const extensions = [
  StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
  Underline,
  Link,
  TextStyle,
  Color,
  Highlight,
  TextAlign,
  Image,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  Typography,
];

export function richJsonToHtml(json: any) {
  if (!json) return "";
  try {
    const html = generateHTML(json, extensions as any);
    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  } catch (error) {
    console.warn("Error rendering rich text:", error);
    return "";
  }
}
import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import type { PageRecord } from "../types/page";

const DATA_DIR = path.join(process.cwd(), "data", "pages");
async function ensureDir() { await fs.mkdir(DATA_DIR, { recursive: true }); }

export function normalizeSlug(s: string) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\-\/]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\-|\-$/g, "");
}

export async function listPages(): Promise<Array<Pick<PageRecord, "id"|"slug"|"title"|"status">>> {
  await ensureDir();
  const files = await fs.readdir(DATA_DIR);
  const rows: Array<Pick<PageRecord, "id"|"slug"|"title"|"status">> = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    const raw = await fs.readFile(path.join(DATA_DIR, f), "utf-8");
    const p = JSON.parse(raw) as PageRecord;
    rows.push({ id: p.id, slug: p.slug, title: p.title, status: p.status });
  }
  return rows;
}

export async function loadPage(id: string): Promise<PageRecord | null> {
  await ensureDir();
  const file = path.join(DATA_DIR, `${id}.json`);
  try { return JSON.parse(await fs.readFile(file, "utf-8")); } catch { return null; }
}

export async function loadPageBySlug(slug: string): Promise<PageRecord | null> {
  await ensureDir();
  const files = await fs.readdir(DATA_DIR);
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    const raw = await fs.readFile(path.join(DATA_DIR, f), "utf-8");
    const p = JSON.parse(raw) as PageRecord;
    if (p.slug === slug) return p;
  }
  return null;
}

export async function slugExists(slug: string): Promise<boolean> {
  return !!(await loadPageBySlug(slug));
}

export async function savePage(p: PageRecord): Promise<void> {
  await ensureDir();
  const file = path.join(DATA_DIR, `${p.id}.json`);
  await fs.writeFile(file, JSON.stringify(p, null, 2), "utf-8");
}

export async function createPage(opts: { slug: string; title: string }): Promise<PageRecord> {
  await ensureDir();
  const slug = normalizeSlug(opts.slug);
  if (!slug) throw new Error("invalid_slug");
  if (await slugExists(slug)) throw new Error("slug_conflict");

  const id = nanoid();
  const now = new Date().toISOString();
  const init: PageRecord = {
    id,
    slug,
    title: opts.title,
    status: "draft",
    draft: { schema: { content: {} }, version: 1, updatedAt: now },
    published: { schema: null, version: 0, updatedAt: null },
    history: [],
  };
  await savePage(init);
  return init;
}
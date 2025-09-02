import type { Plugin, ViteDevServer } from "vite";
import jsonPatch from "fast-json-patch";
const { compare, applyPatch } = jsonPatch;
import type { Operation } from "fast-json-patch";
import { promises as fs } from "fs";
import path from "path";
import {
  listPages, createPage, loadPage, loadPageBySlug, savePage, normalizeSlug, slugExists,
} from "../src/server/pagesFS";
import { applyPatchWithValidation } from "../src/cms/patching/patch-validator";

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureUniqueSlug(base: string) {
  const clean = slugify(base);
  const tryList = [clean, `${clean}-copy`];
  for (const s of tryList) {
    if (!(await loadPageBySlug(s))) return s;
  }
  let i = 2;
  // π.χ. about-copy-2, about-copy-3…
  while (await loadPageBySlug(`${clean}-copy-${i}`)) i++;
  return `${clean}-copy-${i}`;
}

function send(res: any, status: number, data: any) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
function notFound(res: any) { send(res, 404, { error: "not found" }); }

async function readBody(req: any) {
  return await new Promise<any>((resolve) => {
    let data = "";
    req.on("data", (c: any) => (data += c));
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
    });
  });
}

function match(url: string, pattern: RegExp) {
  const m = url.match(pattern);
  return m ? m.slice(1) : null;
}

export default function pagesApiPlugin(): Plugin {
  return {
    name: "pages-api-plugin",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || "";
        if (!url.startsWith("/api/")) return next();

        // GET /api/pages
        if (req.method === "GET" && url === "/api/pages") {
          const rows = await listPages();
          return send(res, 200, rows);
        }

        // POST /api/pages  {slug,title}
        if (req.method === "POST" && url === "/api/pages") {
          const body = await readBody(req);
          if (!body?.slug || !body?.title) {
            return send(res, 400, { error: "missing slug/title" });
          }
          const slug = normalizeSlug(body.slug);
          if (!slug) return send(res, 400, { error: "invalid_slug" });
          if (await slugExists(slug)) return send(res, 409, { error: "slug_conflict" });
          const page = await createPage({ slug, title: body.title });
          return send(res, 201, page);
        }

        // GET|PATCH|POST /api/pages/:id
        const mId = match(url, /^\/api\/pages\/([^/]+)$/);
        if (mId) {
          const id = decodeURIComponent(mId[0]);
          const page = await loadPage(id);
          if (!page) return notFound(res);

          // GET
          if (req.method === "GET") return send(res, 200, page);

          // PATCH { mode: "schema"|"patches", schema?, patches?, baseVersion? }
          if (req.method === "PATCH") {
            const body = await readBody(req);
            if (body.baseVersion && body.baseVersion !== page.draft.version) {
              return send(res, 409, { error: "version_conflict", currentVersion: page.draft.version });
            }
            const prev = page.draft.schema;
            let nextDraft = prev;

            if (body.mode === "schema") {
              nextDraft = body.schema;
            } else if (body.mode === "patches") {
              nextDraft = applyPatchWithValidation(prev, body.patches as Operation[]);
            } else {
              return send(res, 400, { error: "invalid mode" });
            }

            const now = new Date().toISOString();
            const diff = compare(prev, nextDraft);

            page.draft.schema = nextDraft;
            page.draft.version += 1;
            page.draft.updatedAt = now;

            if (diff.length) {
              page.history.push({
                id: `${page.draft.version}:${now}`,
                at: now,
                op: "save",
                patches: diff,
                fromVersion: page.draft.version - 1,
                toVersion: page.draft.version,
                scope: "draft",
              });
            }

            await savePage(page);
            return send(res, 200, { draft: page.draft, version: page.draft.version });
          }

          // POST { action: "publish" | "revert" }
          if (req.method === "POST") {
            const body = await readBody(req);
            const now = new Date().toISOString();

            if (body?.action === "rename") {
              if (typeof body.title === "string") page.title = body.title;
              if (typeof body.slug === "string" && body.slug !== page.slug) {
                const exists = await loadPageBySlug(body.slug);
                if (exists && exists.id !== page.id) return send(res, 409, { error: "slug_taken" });
                page.slug = body.slug;
              }
              page.history.push({ 
                id: `${page.draft.version}:${now}`, 
                at: now, 
                op: "save" as const, 
                fromVersion: page.draft.version,
                toVersion: page.draft.version,
                scope: "draft" as const
              });
              await savePage(page);
              return send(res, 200, { id: page.id, slug: page.slug, title: page.title });
            }

            if (body?.action === "duplicate") {
              const src = page;
              const now = new Date().toISOString();

              const newTitle = typeof body.title === "string" && body.title.trim()
                ? body.title.trim()
                : `${src.title} (copy)`;

              const requested = typeof body.slug === "string" && body.slug.trim()
                ? body.slug.trim()
                : `${src.slug}-copy`;

              const newSlug = await ensureUniqueSlug(requested);

              // φτιάξε νέο record
              const np = await createPage({ slug: newSlug, title: newTitle });
              // copy draft schema βαθιά
              np.draft.schema = JSON.parse(JSON.stringify(src.draft.schema || { content: {} }));
              np.draft.updatedAt = now;
              // option: αν θέλεις να αντιγράφεις και published:
              if (body.copyPublished && src.published?.schema) {
                np.published.schema = JSON.parse(JSON.stringify(src.published.schema));
                np.published.version = src.published.version || 1;
                np.published.updatedAt = now;
                np.status = "published";
              }
              await savePage(np);
              return send(res, 201, { id: np.id, slug: np.slug, title: np.title, status: np.status });
            }

            if (body?.action === "publish") {
              page.published.schema = page.draft.schema;
              page.published.version += 1;
              page.published.updatedAt = now;
              page.status = "published";
              page.history.push({
                id: `${page.published.version}:${now}`,
                at: now,
                op: "publish",
                fromVersion: page.draft.version,
                toVersion: page.published.version,
                scope: "published",
              });
              await savePage(page);
              return send(res, 200, { published: page.published });
            }

            if (body?.action === "revert") {
              if (!page.published.schema) return send(res, 400, { error: "no_published_version" });
              const diff = compare(page.draft.schema, page.published.schema);
              page.draft.schema = applyPatch(page.draft.schema, diff).newDocument;
              page.draft.version += 1;
              page.draft.updatedAt = now;
              page.history.push({
                id: `${page.draft.version}:${now}`,
                at: now,
                op: "revert",
                patches: diff,
                fromVersion: page.draft.version - 1,
                toVersion: page.draft.version,
                scope: "draft",
              });
              await savePage(page);
              return send(res, 200, { draft: page.draft });
            }

          return send(res, 400, { error: "unknown action" });
        }
      }

      // DELETE /api/pages/:id
      if (mId && req.method === "DELETE") {
        const id = decodeURIComponent(mId[0]);
        const file = path.join(process.cwd(), "data", "pages", `${id}.json`);
        try { await fs.unlink(file); } catch {}
        return send(res, 204, {});
      }

      // POST /api/pages/:id/duplicate { slug, title? }
      const mDup = match(url, /^\/api\/pages\/([^/]+)\/duplicate$/);
      if (mDup && req.method === "POST") {
        const id = decodeURIComponent(mDup[0]);
        const src = await loadPage(id);
        if (!src) return notFound(res);
        const body = await readBody(req);
        const slug = normalizeSlug(body?.slug || `${src.slug}-copy`);
        if (!slug) return send(res, 400, { error: "invalid_slug" });
        if (await slugExists(slug)) return send(res, 409, { error: "slug_conflict" });

        const copy = await createPage({ slug, title: body?.title || `${src.title} (Copy)` });
        // carry over draft schema
        copy.draft.schema = src.draft.schema;
        await savePage(copy);
        return send(res, 201, copy);
      }

      // POST /api/pages/:id/rename-slug { slug }
      const mRename = match(url, /^\/api\/pages\/([^/]+)\/rename-slug$/);
      if (mRename && req.method === "POST") {
        const id = decodeURIComponent(mRename[0]);
        const p = await loadPage(id);
        if (!p) return notFound(res);
        const body = await readBody(req);
        const next = normalizeSlug(body?.slug);
        if (!next) return send(res, 400, { error: "invalid_slug" });
        if (next !== p.slug && await slugExists(next)) {
          return send(res, 409, { error: "slug_conflict" });
        }
        p.slug = next;
        await savePage(p);
        return send(res, 200, { id: p.id, slug: p.slug });
      }

      // GET /api/public/pages/:slug
      const mSlug = match(url, /^\/api\/public\/pages\/([^/]+)$/);
      if (mSlug && req.method === "GET") {
        const slug = decodeURIComponent(mSlug[0]);
        const p = await loadPageBySlug(slug);
        if (!p || !p.published.schema) return notFound(res);
        return send(res, 200, { slug: p.slug, title: p.title, schema: p.published.schema });
      }

      return next();
      });
    },
  };
}
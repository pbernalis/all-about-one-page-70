import type { Operation } from "fast-json-patch";

export function safeRemove(schema: any, indexPath: string): Operation[] {
  // indexPath: "content/logo_cloud/logos/2"
  const segs = indexPath.split("/").filter(Boolean);
  const idx = Number(segs[segs.length - 1]);
  const arrPath = segs.slice(0, -1).join("/");

  // resolve array
  let cur: any = schema;
  for (const s of segs.slice(0, -1)) {
    if (!cur || typeof cur !== "object" || !(s in cur)) return []; // no-op
    cur = cur[s];
  }
  if (!Array.isArray(cur)) return [];
  if (idx < 0 || idx >= cur.length) return []; // bounds check

  return [{ op: "remove", path: `/${indexPath}` }];
}
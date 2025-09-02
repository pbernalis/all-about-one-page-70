import type { Operation } from "fast-json-patch";

export function ensureObjectOps(schema: any, objectPath: string): Operation[] {
  const segs = objectPath.split("/").filter(Boolean); // ["content","logo_cloud"]
  let cur: any = schema;

  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (cur && typeof cur === "object" && s in cur) {
      cur = cur[s];
      continue;
    }
    const soFar = segs.slice(0, i + 1).join("/"); // σωστή πρόοδος
    return [{ op: "add", path: `/${soFar}`, value: {} }];
  }
  return [];
}
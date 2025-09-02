import type { Operation } from "fast-json-patch";

export function arrayMoveOps(schema: any, arrayPath: string, from: number, to: number): Operation[] {
  if (from === to) return [];
  const segs = arrayPath.split("/").filter(Boolean);
  let cur: any = schema;
  for (const s of segs) {
    if (!cur || typeof cur !== "object" || !(s in cur)) return [];
    cur = (cur as any)[s];
  }
  if (!Array.isArray(cur)) return [];
  const arr = cur as any[];
  if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) return [];
  const item = arr[from];
  const targetIndex = to > from ? to - 1 : to;
  return [
    { op: "remove", path: `/${arrayPath}/${from}` },
    { op: "add", path: `/${arrayPath}/${targetIndex}`, value: item },
  ];
}
import type { Operation } from "fast-json-patch";

/** Δίνει 1 op "add []" αν λείπει ο πίνακας, αλλιώς [] */
export function ensureArrayOps(schema: any, arrayPath: string): Operation[] {
  const segs = arrayPath.split("/").filter(Boolean); // e.g. ["content","logo_cloud","logos"]
  let cur: any = schema;

  // Περνάμε όλα εκτός από το τελευταίο segment (ο parent)
  for (let i = 0; i < segs.length - 1; i++) {
    const s = segs[i];
    if (!(cur && typeof cur === "object" && s in cur)) {
      // αν λείπει parent, δεν φτιάχνουμε εδώ object — άφησε το ensureObjectOps να προηγηθεί
      return [{ op: "add", path: `/${segs.slice(0, i + 1).join("/")}`, value: {} }];
    }
    cur = cur[s];
  }

  const last = segs[segs.length - 1];
  if (!cur || typeof cur !== "object" || !(last in cur)) {
    return [{ op: "add", path: `/${arrayPath}`, value: [] }];
  }
  // υπάρχει: βεβαιώσου ότι είναι array (αν είναι λάθος τύπος, το αφήνουμε στη validator layer)
  return Array.isArray(cur[last]) ? [] : [{ op: "add", path: `/${arrayPath}`, value: [] }];
}
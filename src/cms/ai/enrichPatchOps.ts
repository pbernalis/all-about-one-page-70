// src/cms/ai/enrichPatchOps.ts

export type JsonPatchOp = {
  op: "add" | "remove" | "replace";
  path: string;
  value?: unknown;
  from?: string;
};

export type EnrichedOp = JsonPatchOp & {
  beforeValue?: unknown; // value found at path in schemaBefore
  afterValue?: unknown;  // value found at path in schemaAfter (or 'value' for add/replace)
  existsBefore?: boolean;
  existsAfter?: boolean;
};

/** RFC6901 pointer segment unescape */
function unescapeSeg(seg: string) {
  return seg.replace(/~1/g, "/").replace(/~0/g, "~");
}

/** Get value at JSON Pointer path; returns {found, value, parent, key} */
export function getAtPointer(root: any, pointer: string): {
  found: boolean;
  value: any;
  parent: any;
  key: string | number | null;
} {
  if (pointer === "" || pointer === "/") return { found: true, value: root, parent: null, key: null };
  if (!pointer.startsWith("/")) return { found: false, value: undefined, parent: null, key: null };

  const segs = pointer
    .split("/")
    .slice(1)
    .map(unescapeSeg);

  let node: any = root;
  let parent: any = null;
  let key: string | number | null = null;

  for (const seg of segs) {
    parent = node;
    key = Array.isArray(node) ? (seg === "-" ? node.length : Number(seg)) : seg;
    if (Array.isArray(node)) {
      if (typeof key !== "number" || key < 0 || key >= node.length) {
        // For arrays, non-existent index is not found (except "-" which is append)
        return { found: false, value: undefined, parent, key };
      }
      node = node[key];
    } else if (node && typeof node === "object" && seg in node) {
      node = node[seg];
    } else {
      return { found: false, value: undefined, parent, key };
    }
  }
  return { found: true, value: node, parent, key };
}

/**
 * Enrich ops with before/after values using schema snapshots.
 * - beforeValue: value at path in schemaBefore (if found)
 * - afterValue:  value at path in schemaAfter if provided; otherwise:
 *      * add/replace => op.value
 *      * remove      => undefined
 */
export function enrichPatchOps(
  ops: JsonPatchOp[],
  schemaBefore: unknown,
  schemaAfter?: unknown
): EnrichedOp[] {
  return ops.map((op) => {
    const before = getAtPointer(schemaBefore, op.path);
    const beforeValue = before.found ? before.value : undefined;

    let afterValue: unknown = undefined;
    let existsAfter = false;

    if (schemaAfter !== undefined) {
      const after = getAtPointer(schemaAfter, op.path);
      existsAfter = after.found;
      afterValue = after.found ? after.value : undefined;
    } else {
      // Fallback if you didn't pass schemaAfter
      if (op.op === "add" || op.op === "replace") afterValue = op.value;
    }

    return {
      ...op,
      beforeValue,
      afterValue,
      existsBefore: before.found,
      existsAfter,
    };
  });
}
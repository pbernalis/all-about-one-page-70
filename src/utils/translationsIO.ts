import type { Operation } from "fast-json-patch";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import { ensureObjectOps } from "@/helpers/ensureObject";
import Papa from "papaparse";

type Translations = Record<string, Record<string, string>>;

export function downloadJSON(obj: any, filename = "translations.json") {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function readFileAsJSON(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      try { resolve(JSON.parse(String(fr.result || "{}"))); }
      catch (e) { reject(e); }
    };
    fr.onerror = reject;
    fr.readAsText(file, "utf-8");
  });
}

export function validateTranslationsShape(raw: any): Translations {
  if (!raw || typeof raw !== "object") throw new Error("Invalid JSON root");
  const out: Translations = {};
  for (const [loc, dict] of Object.entries(raw)) {
    if (typeof dict !== "object" || dict === null) throw new Error(`Invalid locale object: ${loc}`);
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(dict as any)) {
      if (!/^[A-Za-z0-9_.-]{1,64}$/.test(k)) {
        throw new Error(`Invalid key: ${k} (use a–z, 0–9, '_', '-', '.')`);
      }
      clean[k] = typeof v === "string" ? v : String(v ?? "");
    }
    out[loc] = clean;
  }
  return out;
}

export type DiffResult = {
  ops: Operation[];
  addedLocales: number;
  removedLocales: number;
  addedKeys: number;
  updatedKeys: number;
  removedKeys: number;
};

export function diffTranslations(
  curr: Translations | undefined,
  incoming: Translations,
  pruneMissing: boolean
): DiffResult {
  const current = curr ?? {};
  const ops: Operation[] = [];
  let addedLocales = 0, removedLocales = 0, addedKeys = 0, updatedKeys = 0, removedKeys = 0;

  ops.push(...ensureObjectOps({ translations: current } as any, "translations"));

  for (const [loc, dict] of Object.entries(incoming)) {
    const hasLocale = current.hasOwnProperty(loc);
    if (!hasLocale) {
      ops.push({ op: "add", path: `/translations/${loc}`, value: {} });
      addedLocales++;
    }
    ops.push(...ensureObjectOps({ translations: { ...(current as any) } } as any, `translations/${loc}`));

    const currDict = (current[loc] ?? {}) as Record<string, string>;
    for (const [k, val] of Object.entries(dict)) {
      if (!currDict.hasOwnProperty(k)) {
        ops.push({ op: "add", path: `/translations/${loc}/${k}`, value: val });
        addedKeys++;
      } else if (currDict[k] !== val) {
        ops.push({ op: "replace", path: `/translations/${loc}/${k}`, value: val });
        updatedKeys++;
      }
    }
  }

  if (pruneMissing) {
    for (const [loc, dict] of Object.entries(current)) {
      if (!incoming.hasOwnProperty(loc)) {
        ops.push({ op: "remove", path: `/translations/${loc}` });
        removedLocales++;
        continue;
      }
      const incDict = incoming[loc]!;
      for (const k of Object.keys(dict)) {
        if (!incDict.hasOwnProperty(k)) {
          ops.push({ op: "remove", path: `/translations/${loc}/${k}` });
          removedKeys++;
        }
      }
    }
  }

  return { ops, addedLocales, removedLocales, addedKeys, updatedKeys, removedKeys };
}

export function applyTranslationsImport(
  schema: any,
  setSchema: (s:any)=>void,
  incoming: Translations,
  mode: "merge" | "replace"
) {
  const current: Translations | undefined = schema?.translations;
  const { ops, addedLocales, removedLocales, addedKeys, updatedKeys, removedKeys } =
    diffTranslations(current, incoming, mode === "replace");

  const next = applyPatchWithValidation(schema, ops);
  setSchema(next);

  return { addedLocales, removedLocales, addedKeys, updatedKeys, removedKeys, totalOps: ops.length };
}

// ---------- CSV helpers ----------

export function downloadCSV(csv: string, filename = "translations.csv") {
  // Προσθέτουμε BOM για σωστό άνοιγμα σε Excel
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result || ""));
    fr.onerror = reject;
    fr.readAsText(file, "utf-8");
  });
}

/** Μετατρέπει translations σε CSV με header: key,<locale1>,<locale2>,... */
export function translationsToCSV(obj: Translations, selectedLocales?: string[]): string {
  const locales = (selectedLocales && selectedLocales.length > 0)
    ? selectedLocales
    : Object.keys(obj || {}).sort();

  const keys = new Set<string>();
  for (const loc of locales) {
    const dict = obj?.[loc] ?? {};
    Object.keys(dict).forEach(k => keys.add(k));
  }
  const rows = Array.from(keys).sort().map(k => {
    const row: Record<string, string> = { key: k };
    for (const loc of locales) row[loc] = obj?.[loc]?.[k] ?? "";
    return row;
  });
  return Papa.unparse(rows, { quotes: true, header: true });
}

/** Διαβάζει CSV (header με key + locales) -> Translations */
export function csvToTranslations(csv: string): Translations {
  const res = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => String(h || "").trim(),
  });
  if (res.errors && res.errors.length) throw new Error(res.errors[0].message);

  const fields = res.meta.fields || [];
  if (!fields.includes("key")) throw new Error("CSV must include a 'key' column");

  const locales = fields.filter(f => f !== "key");
  if (locales.length === 0) throw new Error("CSV must include at least one locale column");

  const out: Translations = {};
  for (const loc of locales) out[loc] = {};

  for (const row of res.data) {
    const key = String((row as any).key || "").trim();
    if (!key) continue;
    if (!/^[A-Za-z0-9_.-]{1,64}$/.test(key)) throw new Error(`Invalid key: ${key}`);

    for (const loc of locales) {
      const raw = row[loc];
      const val = raw == null ? "" : String(raw);
      out[loc]![key] = val;
    }
  }
  return out;
}
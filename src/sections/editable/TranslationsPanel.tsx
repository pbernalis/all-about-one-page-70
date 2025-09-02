import React, { useEffect, useMemo, useState } from "react";
import InlineText from "@/components/editors/InlineText";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import type { Operation } from "fast-json-patch";
import { ensureObjectOps } from "@/helpers/ensureObject";
import { safeRemove } from "@/helpers/safeOps";
import {
  downloadCSV, readFileAsText, csvToTranslations, translationsToCSV,
  applyTranslationsImport, downloadJSON, readFileAsJSON, validateTranslationsShape
} from "@/utils/translationsIO";

/** Συμβουλή: κράτα keys χωρίς '/' για να είναι έγκυρα JSON Pointer paths. */
const validKey = (s: string) => /^[A-Za-z0-9_.-]{1,64}$/.test(s);

type Props = {
  schema: any;
  setSchema: (s:any)=>void;
  readOnly?: boolean;
  className?: string;
};

export default function TranslationsPanel({ schema, setSchema, readOnly=false, className="" }: Props) {
  const [filter, setFilter] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newLocale, setNewLocale] = useState("");

  const translations = schema?.translations ?? {};
  const locales: string[] = useMemo(() => Object.keys(translations), [translations]);

  // Επιλογή γλωσσών για export (default: όλες)
  const availableLocales = useMemo<string[]>(
    () => Object.keys(schema?.translations ?? {}).sort(),
    [schema?.translations]
  );
  const [selectedLocales, setSelectedLocales] = useState<string[]>(availableLocales);

  // Re-sync όταν αλλάζει το schema (π.χ. import)
  useEffect(() => { setSelectedLocales(availableLocales); }, [availableLocales]);

  const toggleLocale = (loc: string) =>
    setSelectedLocales(prev => prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]);

  const selectAll = () => setSelectedLocales(availableLocales);
  const selectNone = () => setSelectedLocales([]);

  const allKeys: string[] = useMemo(() => {
    const set = new Set<string>();
    for (const loc of locales) {
      Object.keys(translations[loc] ?? {}).forEach(k => set.add(k));
    }
    return [...set].sort();
  }, [locales, translations]);

  const keys = allKeys.filter(k => !filter || k.toLowerCase().includes(filter.toLowerCase()));

  /** Προσθήκη νέου key σε ΟΛΑ τα locales (κενό string όπου λείπει) */
  const addKey = () => {
    const k = newKey.trim();
    if (!validKey(k)) return alert("Χρησιμοποίησε a–z, 0–9, '_', '-', '.' (χωρίς '/').");
    if (allKeys.includes(k)) return alert("Το key υπάρχει ήδη.");

    const ops: Operation[] = [];
    ops.push(...ensureObjectOps(schema, "translations")); // βεβαιώσου ότι υπάρχει root

    for (const loc of locales.length ? locales : ["en"]) {
      ops.push(...ensureObjectOps(schema, `translations/${loc}`));
      const has = !!schema?.translations?.[loc]?.hasOwnProperty(k);
      if (!has) ops.push({ op: "add", path: `/translations/${loc}/${k}`, value: "" });
    }
    setSchema(applyPatchWithValidation(schema, ops));
    setNewKey("");
  };

  /** Προσθήκη νέου locale (δημιουργεί άδειο object) */
  const addLocale = () => {
    const loc = newLocale.trim();
    if (!/^[A-Za-z-]{2,8}$/.test(loc)) return alert("Παράδειγμα locale: en, el, en-US");
    if (locales.includes(loc)) return alert("Το locale υπάρχει ήδη.");
    const ops: Operation[] = [
      ...ensureObjectOps(schema, "translations"),
      { op: "add", path: `/translations/${loc}`, value: {} } as Operation,
    ];
    setSchema(applyPatchWithValidation(schema, ops));
    setNewLocale("");
  };

  /** Διαγραφή key από όλα τα locales (όπου υπάρχει) */
  const removeKey = (k: string) => {
    const ops: Operation[] = [];
    for (const loc of locales) {
      if (schema?.translations?.[loc]?.hasOwnProperty(k)) {
        ops.push({ op: "remove", path: `/translations/${loc}/${k}` });
      }
    }
    if (!ops.length) return;
    setSchema(applyPatchWithValidation(schema, ops));
  };

  /** Διαγραφή locale */
  const removeLocale = (loc: string) => {
    setSchema(applyPatchWithValidation(schema, safeRemove(schema, `translations/${loc}`)));
  };

  return (
    <section className={`rounded-xl border bg-card ${className}`} data-editable="true">
      <header className="flex flex-wrap gap-2 items-center p-3 border-b">
        <h3 className="font-semibold">Translations</h3>
        <div className="ml-auto flex gap-2">
          <input
            value={filter}
            onChange={e=>setFilter(e.target.value)}
            placeholder="Φίλτρο keys…"
            className="h-9 px-3 rounded-md border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </header>

      {/* Actions */}
      {!readOnly && (
        <div className="p-3 border-b flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <input
              value={newKey}
              onChange={e=>setNewKey(e.target.value)}
              placeholder="Νέο key (e.g. hero.title)"
              className="h-9 px-3 rounded-md border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button className="h-9 px-3 rounded-md border bg-background hover:bg-muted transition-colors" onClick={addKey}>+ Key</button>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={newLocale}
              onChange={e=>setNewLocale(e.target.value)}
              placeholder="Νέο locale (e.g. el)"
              className="h-9 px-3 rounded-md border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button className="h-9 px-3 rounded-md border bg-background hover:bg-muted transition-colors" onClick={addLocale}>+ Locale</button>
          </div>
        </div>
      )}

      {/* Import / Export */}
      {!readOnly && (
        <div className="p-3 border-b flex flex-wrap gap-2 items-center">
          <button
            className="h-9 px-3 rounded-md border bg-background hover:bg-muted transition-colors"
            onClick={() => downloadJSON(schema?.translations ?? {}, `translations-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`)}
            title="Κατέβασε όλες τις μεταφράσεις σε JSON"
          >
            ⬇️ Export JSON
          </button>

          {/* Import (merge) */}
          <label className="h-9 px-3 rounded-md border bg-background hover:bg-muted transition-colors cursor-pointer inline-flex items-center gap-2">
            ⬆️ Import (merge)
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const f = e.currentTarget.files?.[0];
                if (!f) return;
                try {
                  const raw = await readFileAsJSON(f);
                  const clean = validateTranslationsShape(raw);
                  const res = applyTranslationsImport(schema, setSchema, clean, "merge");
                  alert(`Imported (merge):
+Locales: ${res.addedLocales}, +Keys: ${res.addedKeys}, Updated: ${res.updatedKeys}`);
                } catch (err:any) {
                  alert(`Import error: ${err?.message ?? err}`);
                } finally {
                  e.currentTarget.value = "";
                }
              }}
            />
          </label>

          {/* Import (replace) */}
          <label className="h-9 px-3 rounded-md border bg-background hover:bg-muted transition-colors cursor-pointer inline-flex items-center gap-2">
            ♻️ Import (replace)
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const f = e.currentTarget.files?.[0];
                if (!f) return;
                try {
                  if (!window.confirm("This will remove locales/keys not present in the file. Continue?")) {
                    e.currentTarget.value = ""; return;
                  }
                  const raw = await readFileAsJSON(f);
                  const clean = validateTranslationsShape(raw);
                  const res = applyTranslationsImport(schema, setSchema, clean, "replace");
                  alert(`Imported (replace):
+Locales: ${res.addedLocales}, -Locales: ${res.removedLocales}, +Keys: ${res.addedKeys}, Updated: ${res.updatedKeys}, -Keys: ${res.removedKeys}`);
                } catch (err:any) {
                  alert(`Import error: ${err?.message ?? err}`);
                } finally {
                  e.currentTarget.value = "";
                }
              }}
            />
          </label>

          {/* Import CSV (merge) */}
          <label className="h-9 px-3 rounded-md border bg-background hover:bg-muted transition-colors cursor-pointer inline-flex items-center gap-2">
            📥 Import CSV (merge)
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={async (e) => {
                const f = e.currentTarget.files?.[0];
                if (!f) return;
                try {
                  const csv = await readFileAsText(f);
                  const incoming = csvToTranslations(csv);
                  const res = applyTranslationsImport(schema, setSchema, incoming, "merge");
                  alert(`CSV merge:
Locales+: ${res.addedLocales}, Keys+: ${res.addedKeys}, Updated: ${res.updatedKeys}`);
                } catch (err:any) {
                  alert(`CSV import error: ${err?.message ?? err}`);
                } finally { e.currentTarget.value = ""; }
              }}
            />
          </label>

          {/* Import CSV (replace) */}
          <label className="h-9 px-3 rounded-md border bg-background hover:bg-muted transition-colors cursor-pointer inline-flex items-center gap-2">
            ♻️ Import CSV (replace)
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={async (e) => {
                const f = e.currentTarget.files?.[0];
                if (!f) return;
                try {
                  if (!window.confirm("Replace θα αφαιρέσει locales/keys που δεν υπάρχουν στο CSV. Συνέχεια;")) {
                    e.currentTarget.value = ""; return;
                  }
                  const csv = await readFileAsText(f);
                  const incoming = csvToTranslations(csv);
                  const res = applyTranslationsImport(schema, setSchema, incoming, "replace");
                  alert(`CSV replace:
Locales+: ${res.addedLocales}, Locales-: ${res.removedLocales}, Keys+: ${res.addedKeys}, Updated: ${res.updatedKeys}, Keys-: ${res.removedKeys}`);
                } catch (err:any) {
                  alert(`CSV import error: ${err?.message ?? err}`);
                } finally { e.currentTarget.value = ""; }
              }}
            />
          </label>

          {/* Locales filter UI */}
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-muted-foreground">Export locales</span>
            <button type="button" onClick={selectAll} className="h-7 px-2 rounded-md border bg-background hover:bg-muted transition-colors text-xs">All</button>
            <button type="button" onClick={selectNone} className="h-7 px-2 rounded-md border bg-background hover:bg-muted transition-colors text-xs">None</button>

            <div className="flex flex-wrap gap-1">
              {availableLocales.map(loc => (
                <label key={loc}
                       className={`h-7 px-2 rounded-full border text-xs cursor-pointer inline-flex items-center gap-1 transition-colors ${
                         selectedLocales.includes(loc) ? "bg-primary/10 border-primary" : "bg-background hover:bg-muted"
                       }`}>
                  <input
                    type="checkbox"
                    className="accent-primary"
                    checked={selectedLocales.includes(loc)}
                    onChange={() => toggleLocale(loc)}
                  />
                  {loc}
                </label>
              ))}
            </div>

            <span className="ml-2 text-xs opacity-60">
              {selectedLocales.length}/{availableLocales.length}
            </span>
          </div>

          {/* Export CSV — χρησιμοποιεί το φίλτρο */}
          <button
            className="h-9 px-3 rounded-md border bg-background hover:bg-muted transition-colors disabled:opacity-50"
            disabled={selectedLocales.length === 0}
            onClick={() => {
              const csv = translationsToCSV(schema?.translations ?? {}, selectedLocales);
              downloadCSV(
                csv,
                `translations-${selectedLocales.join("_")}-${new Date()
                  .toISOString()
                  .slice(0,19)
                  .replace(/[:T]/g,"-")}.csv`
              );
            }}
            title={selectedLocales.length ? "Κατέβασε CSV" : "Διάλεξε τουλάχιστον ένα locale"}
          >
            📤 Export CSV (filtered)
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-3 w-56">Key</th>
              {locales.map(loc => (
                <th key={loc} className="text-left p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{loc}</span>
                    {!readOnly && (
                      <button className="text-xs px-2 h-7 rounded-md border bg-background hover:bg-muted transition-colors" onClick={()=>removeLocale(loc)}>
                        Διαγραφή locale
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.length === 0 && (
              <tr><td className="p-4 italic opacity-60" colSpan={1+locales.length}>Δεν υπάρχουν keys.</td></tr>
            )}
            {keys.map(k => (
              <tr key={k} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{k}</code>
                    {!readOnly && (
                      <button className="text-xs px-2 h-7 rounded-md border bg-background hover:bg-muted transition-colors" onClick={()=>removeKey(k)}>
                        Διαγραφή key
                      </button>
                    )}
                  </div>
                </td>
                {locales.map(loc => (
                  <td key={loc} className="p-3 align-top">
                    <InlineText
                      path={`/translations/${loc}/${k}`}
                      value={schema?.translations?.[loc]?.[k]}
                      placeholder={`${loc}.${k}`}
                      readOnly={readOnly}
                      schema={schema}
                      setSchema={setSchema}
                      className="min-w-[220px]"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
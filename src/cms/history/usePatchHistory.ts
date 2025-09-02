import { useRef, useCallback, useState, useEffect } from "react";
import { compare, type Operation } from "fast-json-patch";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";

const PUB_KEY = "cms_published_snapshot";

export function usePatchHistory(schema: any, setSchema: (s: any) => void) {
  const past = useRef<any[]>([]);
  const future = useRef<any[]>([]);
  const [published, setPublished] = useState<any | null>(null);

  // load published from localStorage (optional but handy)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PUB_KEY);
      if (raw) setPublished(JSON.parse(raw));
    } catch {}
  }, []);

  const setSchemaWithHistory = useCallback(
    (next: any) => {
      if (!next || typeof next !== "object") return;
      
      // Add current state to history before changing
      past.current.push(schema);
      // Limit history stack to 50 items
      if (past.current.length > 50) past.current.shift();
      future.current = []; // Clear future when making new changes
      
      setSchema(next);
    },
    [schema, setSchema]
  );

  const undo = useCallback(() => {
    if (!past.current.length) return;
    const target = past.current.pop()!;
    const ops: Operation[] = compare(schema, target);
    const next = applyPatchWithValidation(schema, ops);
    future.current.push(schema);
    setSchema(next);
  }, [schema, setSchema]);

  const redo = useCallback(() => {
    if (!future.current.length) return;
    const target = future.current.pop()!;
    const ops: Operation[] = compare(schema, target);
    const next = applyPatchWithValidation(schema, ops);
    past.current.push(schema);
    setSchema(next);
  }, [schema, setSchema]);

  const publish = useCallback(() => {
    // Create safe deep clone
    const snap = typeof structuredClone === "function"
      ? structuredClone(schema)
      : JSON.parse(JSON.stringify(schema));
    
    setPublished(snap);
    try { localStorage.setItem(PUB_KEY, JSON.stringify(snap)); } catch {}
    past.current = [];
    future.current = [];
  }, [schema]);

  const revertDraft = useCallback(() => {
    if (!published) return;
    const ops: Operation[] = compare(schema, published);
    const next = applyPatchWithValidation(schema, ops);
    past.current.push(schema);
    future.current = [];
    setSchema(next);
  }, [schema, setSchema, published]);

  // Dirty state calculation
  const isDirty = !!(published && compare(published, schema).length);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      if (e.key.toLowerCase() === "z" && !e.shiftKey) { 
        e.preventDefault(); 
        undo(); 
      }
      if ((e.key.toLowerCase() === "z" && e.shiftKey) || e.key.toLowerCase() === "y") { 
        e.preventDefault(); 
        redo(); 
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  // Prevent accidental page leave when dirty
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) { 
        e.preventDefault(); 
        e.returnValue = ""; 
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  return {
    setSchemaWithHistory,
    undo, redo,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
    publish, revertDraft,
    hasPublished: !!published,
    published,
    isDirty,
  };
}
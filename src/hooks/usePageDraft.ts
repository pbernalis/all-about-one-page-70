
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { compare, Operation } from "fast-json-patch";
import { pagesApi } from "@/api/pages";
import { withRetry } from "@/utils/withRetry";
import { useToast } from "@/hooks/use-toast";
import { waitForSandboxReady } from "@/utils/health";

export function usePageDraft(pageId: string): {
  readonly loading: boolean;
  readonly record: any;
  readonly schema: any;
  readonly setSchemaWithHistory: (next: any) => void;
  readonly publish: () => Promise<void>;
  readonly revertDraft: () => Promise<void>;
  readonly isDirty: boolean;
  readonly viewPublished: boolean;
  readonly setViewPublished: React.Dispatch<React.SetStateAction<boolean>>;
  readonly publishedSchema: any;
  readonly updateMeta: (meta: { title?: string; slug?: string }) => Promise<any>;
  readonly saveDraftNow: () => Promise<any>;
  readonly hasUnsavedDraft: boolean;
  readonly showDiffModal: boolean;
  readonly conflictData: { old: any; new: any } | null;
  readonly handleDiffConfirm: () => void;
  readonly handleDiffCancel: () => void;
} {
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<any>(null);
  const [schema, setSchema] = useState<any>(null);
  const [viewPublished, setViewPublished] = useState(false);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [conflictData, setConflictData] = useState<{ old: any; new: any } | null>(null);
  const { toast } = useToast();
  
  // Refs to prevent duplicate operations
  const saveTimer = useRef<any>(null);
  const loadingRef = useRef(false);
  const sandboxReadyRef = useRef(false);

  useEffect(() => {
    // Skip loading if pageId is empty/undefined
    if (!pageId || pageId === "undefined") {
      setLoading(false);
      setRecord(null);
      setSchema(null);
      sandboxReadyRef.current = false;
      return;
    }

    // Prevent duplicate loading
    if (loadingRef.current) return;
    loadingRef.current = true;

    let on = true;
    (async () => {
      setLoading(true);
      try {
        // Wait for sandbox to be ready before loading
        if (!sandboxReadyRef.current) {
          await waitForSandboxReady();
          sandboxReadyRef.current = true;
        }
        
        const data = await pagesApi.get(pageId);
        if (!on) return;
        setRecord(data);
        setSchema(data.draft?.schema ?? { content: {} });
      } catch (error) {
        console.error("Failed to load page:", error);
        if (on) {
          setRecord(null);
          setSchema(null);
        }
      }
      setLoading(false);
      loadingRef.current = false;
    })();
    return () => { 
      on = false; 
      loadingRef.current = false;
    };
  }, [pageId]);

  const setSchemaWithHistory = useCallback((next: any) => { setSchema(next); }, []);

  // autosave (debounce 500ms) με JSON Patch diffs
  useEffect(() => {
    // Guard against invalid states - require both pageId and loaded record with valid ID
    if (!pageId || pageId === "undefined" || !record || !record.id || viewPublished || !sandboxReadyRef.current) return;
    
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      // Check if still online before attempting save
      if (typeof navigator !== 'undefined' && !navigator.onLine) return;
      
      const baseVersion = record.draft?.version ?? 0;
      const patches: Operation[] = compare(record.draft?.schema ?? {}, schema ?? {});
      if (patches.length === 0) return;
      
      try {
        const result = await pagesApi.update(pageId, { 
          mode: "patches", 
          patches, 
          baseVersion 
        });
        setRecord((prev: any) => ({
          ...prev,
          draft: { ...prev.draft, ...result.draft, version: result.version }
        }));
      } catch (error: any) {
        if (error.message.startsWith("version_conflict:")) {
          const data = await pagesApi.get(pageId);
          
          // Show diff modal for user confirmation
          setConflictData({ 
            old: record.draft?.schema ?? {}, 
            new: data.draft?.schema ?? {} 
          });
          setShowDiffModal(true);
          
          toast({
            title: "Version conflict detected",
            description: "Changes were made in another tab. Review the differences to continue.",
            variant: "default"
          });
        } else {
          console.error("Save failed:", error);
        }
      }
    }, 1000); // Increased debounce to reduce API calls during restarts
    return () => clearTimeout(saveTimer.current);
  }, [schema, record, viewPublished, pageId, toast]);

  const publish = useCallback(async () => {
    if (!record) return;
    try {
      const result = await pagesApi.publish(record.id);
      setRecord((prev: any) => ({ ...prev, published: result.published, status: "published" }));
    } catch (error) {
      console.error("Failed to publish:", error);
    }
  }, [record]);

  const revertDraft = useCallback(async () => {
    if (!record) return;
    try {
      const result = await pagesApi.revert(record.id);
      setRecord((prev: any) => ({ ...prev, draft: result.draft }));
      setSchema(result.draft.schema);
    } catch (error) {
      console.error("Failed to revert:", error);
    }
  }, [record]);

  const isDirty = useMemo(() => {
    if (!record) return false;
    try { return compare(record.published?.schema ?? {}, schema ?? {}).length > 0; }
    catch { return true; }
  }, [record, schema]);

  const saveDraftNow = useCallback(async () => {
    // Guard against invalid states - require both pageId and loaded record
    if (!pageId || pageId === "undefined" || !record || !record.id) {
      return { ok: false, reason: "no-record" as const };
    }
    
    // Pause autosave while offline to prevent noisy errors
    const offline = typeof navigator !== 'undefined' && !navigator.onLine;
    if (offline) return { ok: false, reason: 'offline' as const };
    
    // Wait for sandbox if not ready
    if (!sandboxReadyRef.current) {
      try {
        await waitForSandboxReady();
        sandboxReadyRef.current = true;
      } catch (error) {
        return { ok: false, reason: 'sandbox_not_ready' as const };
      }
    }
    
    const baseVersion = record.draft?.version ?? 0;
    
    // Defensive clone to avoid comparing same references
    const before = JSON.parse(JSON.stringify(record.draft?.schema ?? {}));
    const after = schema ?? {};
    const patches: Operation[] = compare(before, after);
    
    if (patches.length === 0) return { ok: true, skipped: true as const };

    try {
      // Use ETag if available for optimistic locking
      const etag = record.draft?.version?.toString();
      const result = await pagesApi.update(pageId, { mode: "patches", patches, baseVersion }, etag);
      setRecord((prev: any) => ({
        ...prev,
        draft: { ...prev.draft, ...result.draft, version: result.version }
      }));
      return { ok: true };
    } catch (error: any) {
      if (error.message.startsWith("version_conflict:")) {
        // Handle version conflict - refetch and update local state
        // Guard against deleted pages
        try {
          const data = await pagesApi.get(pageId);
          setRecord(data);
          setSchema(data.draft?.schema ?? {});
          return { ok: false, reason: "version_conflict" as const };
        } catch (fetchError: any) {
          if (fetchError.message.startsWith("404")) {
            return { ok: false, reason: "page_deleted" as const };
          }
          throw fetchError;
        }
      }
      throw error;
    }
  }, [pageId, record, schema]);

  const hasUnsavedDraft = useMemo(() => {
    if (!record) return false;
    try { 
      return compare(record.draft?.schema ?? {}, schema ?? {}).length > 0; 
    } catch { 
      return true; 
    }
  }, [record, schema]);

  const updateMeta = useCallback(
    async (meta: { title?: string; slug?: string }) => {
      if (!record) return;
      const res = await pagesApi.rename(record.id, meta);
      // optimistic update
      setRecord((prev: any) => ({ ...prev, title: res.title, slug: res.slug }));
      return res;
    },
    [record]
  );

  const handleDiffConfirm = useCallback(() => {
    if (conflictData) {
      setRecord((prev: any) => ({ 
        ...prev, 
        draft: { ...prev.draft, schema: conflictData.new } 
      }));
      setSchema(conflictData.new);
    }
    setShowDiffModal(false);
    setConflictData(null);
  }, [conflictData]);

  const handleDiffCancel = useCallback(() => {
    setShowDiffModal(false);
    setConflictData(null);
  }, []);

  return {
    loading, 
    record, 
    schema, 
    setSchemaWithHistory,
    publish, 
    revertDraft, 
    isDirty,
    viewPublished, 
    setViewPublished,
    publishedSchema: record?.published?.schema ?? null,
    updateMeta,
    saveDraftNow,
    hasUnsavedDraft,
    showDiffModal,
    conflictData,
    handleDiffConfirm,
    handleDiffCancel,
  } as const;
}

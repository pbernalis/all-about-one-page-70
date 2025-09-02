import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { slugify } from "@/utils/slugify";
import { Button } from "@/components/ui/button";

type Props = {
  pageId: string;
  initialTitle: string;
  initialSlug: string;
  onRename: (meta: { title?: string; slug?: string }) => Promise<any>;
  onSaveDraft?: () => Promise<{ ok: boolean; skipped?: boolean }>;
  hasUnsavedDraft?: boolean;
  viewPublished?: boolean;
};

export default function TitleBar({
  pageId, initialTitle, initialSlug, onRename,
  onSaveDraft, hasUnsavedDraft = false, viewPublished = false,
}: Props) {
  const [title, setTitle] = useState(initialTitle || "");
  const [slug, setSlug] = useState(initialSlug || "");
  const [lockSlug, setLockSlug] = useState(true); // auto-sync από title
  const [saving, setSaving] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const debTimer = useRef<number | null>(null);
  const dirty = useMemo(() => title !== initialTitle || slug !== initialSlug, [title, slug, initialTitle, initialSlug]);

  useEffect(() => {
    setTitle(initialTitle || "");
    setSlug(initialSlug || "");
  }, [pageId, initialTitle, initialSlug]);

  // auto-sync slug όταν αλλάζει ο τίτλος & είναι locked
  useEffect(() => {
    if (!lockSlug) return;
    setSlug((prev) => {
      const next = slugify(title || "");
      return next || prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, lockSlug]);

  const commit = (meta?: { title?: string; slug?: string }) => {
    if (debTimer.current) window.clearTimeout(debTimer.current);
    debTimer.current = window.setTimeout(async () => {
      const newTitle = meta?.title ?? title;
      const newSlug  = meta?.slug ?? slug;
      if (!newTitle) return; // τίτλος υποχρεωτικός UI-wise
      setSaving("saving");
      setError(null);
      try {
        await onRename({ title: newTitle, slug: newSlug });
        setSaving("idle");
      } catch (e: any) {
        setSaving("error");
        const msg = e?.message || "Rename failed";
        setError(msg === "slug_taken" ? "Το slug χρησιμοποιείται ήδη." : msg);
      }
    }, 600) as unknown as number;
  };

  const onTitleBlur = () => commit({ title, slug: lockSlug ? slugify(title) : slug });
  const onSlugBlur  = () => commit({ title, slug });

  const clickSave = async () => {
    if (!onSaveDraft) return;
    setSavingDraft(true);
    const res = await onSaveDraft().catch(() => ({ ok: false }));
    setSavingDraft(false);
    if (res?.ok) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 900);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Modern Page Info */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col min-w-0">
          <input
            className="text-lg font-semibold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 min-w-[200px] transition-all duration-200"
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (!lockSlug) commit({ title: e.target.value, slug }); }}
            onBlur={onTitleBlur}
            placeholder="Page title…"
            aria-label="Page title"
          />
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">/</span>
            <input
              className="text-sm bg-transparent border border-border/30 rounded-lg px-2 py-1 text-muted-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 min-w-[150px] transition-all duration-200"
              value={slug}
              onChange={(e) => { setSlug(e.target.value.toLowerCase()); }}
              onBlur={onSlugBlur}
              placeholder="slug"
              aria-label="Slug"
            />
            <label className="flex items-center gap-1 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={lockSlug}
                onChange={(e) => setLockSlug(e.target.checked)}
                className="w-3 h-3 accent-primary transition-transform duration-200 group-hover:scale-110"
              />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">auto</span>
            </label>
          </div>
        </div>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center gap-3">
        {onSaveDraft && (
          <Button
            onClick={clickSave}
            disabled={viewPublished || savingDraft || !hasUnsavedDraft}
            variant={hasUnsavedDraft ? "default" : "outline"}
            size="sm"
            className={`transition-all duration-200 ${hasUnsavedDraft ? 'bg-gradient-primary shadow-glow hover:scale-105' : 'glass border-border/30'}`}
            title={viewPublished ? "Disabled while previewing Published" : "Save Draft"}
          >
            {savingDraft ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Saving</span>
              </div>
            ) : (justSaved ? (
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Saved</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${hasUnsavedDraft ? 'bg-orange-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span>Save Draft</span>
              </div>
            ))}
          </Button>
        )}
        
        {saving === "saving" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span>Updating</span>
          </div>
        )}
        
        {saving === "error" && (
          <div className="text-sm text-destructive bg-destructive/10 px-3 py-1 rounded-lg border border-destructive/20">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
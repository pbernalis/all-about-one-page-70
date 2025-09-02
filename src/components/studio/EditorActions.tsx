// src/components/studio/EditorActions.tsx
import React from "react";
import type { PageSchema } from "@/cms/schema/types";
import type { UserBrief } from "@/ai/call-gemini";
import type { Operation } from "fast-json-patch";
import { callGemini } from "@/ai/call-gemini";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import { sanitizeSectionOps } from "@/cms/patching/ops-sanitizer";
import { templateCatalog } from "@/cms/templates/catalog";
import { useToast } from "@/hooks/use-toast";

interface EditorActionsProps {
  schema: PageSchema;
  setSchema: (schema: PageSchema) => void;
  brief?: UserBrief;
}

export function EditorActions({ schema, setSchema, brief }: EditorActionsProps) {
  const [lockLayout, setLockLayout] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const { toast } = useToast();

  async function regenerateContent() {
    setBusy(true);
    try {
      const ops: Operation[] = await callGemini({
        mode: "fill-content",
        currentSchema: schema,
        templateCatalog,
        brief: brief || { language: "el", tone: "professional" },
      });

      const filtered = lockLayout
        ? ops.filter((op) => !/^\/layout$|^\/sections(\/|$)/.test(op.path))
        : ops;

      const sanitizedOps = sanitizeSectionOps(filtered);
      const next = applyPatchWithValidation(schema, sanitizedOps);
      setSchema(next);
      toast({ 
        title: "Content regenerated!", 
        description: `Applied ${sanitizedOps.length} updates.` 
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={lockLayout}
          onChange={() => setLockLayout((v) => !v)}
        />
        Lock layout
      </label>
      <button disabled={busy} onClick={regenerateContent}>
        {busy ? "Generating…" : "Regenerate content"}
      </button>
    </div>
  );
}
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import PatchToolbar from "@/components/studio/PatchToolbar";
import TitleBar from "@/components/studio/TitleBar";
import { usePageDraft } from "@/hooks/usePageDraft";
import { DynamicPageRenderer } from "@/components/DynamicPageRenderer";
import { usePatchHistory } from "@/cms/history/usePatchHistory";
import { Button } from "@/components/ui/button";
import { Layout, X } from "lucide-react";
import { TEMPLATES, Template } from "@/templates";
import { pagesApi } from "@/api/pages";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function StudioPage() {
  const params = useParams() as { id: string };
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showPickerParam = searchParams.get("template") === "choose";
  const [inlineEdit, setInlineEdit] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { toast } = useToast();

  const {
    loading, record, schema, setSchemaWithHistory,
    publish, revertDraft, isDirty,
    viewPublished, setViewPublished, publishedSchema,
    updateMeta, saveDraftNow, hasUnsavedDraft
  } = usePageDraft(params.id || "default");

  // Local undo/redo history for immediate UI responsiveness
  const {
    setSchemaWithHistory: setSchemaWithLocalHistory,
    undo, redo, canUndo, canRedo
  } = usePatchHistory(schema, setSchemaWithHistory);

  // Auto-open template picker when needed
  useEffect(() => {
    const empty = !schema || !schema.content || !Object.keys(schema.content).length;
    if (showPickerParam || empty) {
      setPickerOpen(true);
    }
  }, [showPickerParam, schema]);

  const applyTemplate = async (tplId: string) => {
    const template = TEMPLATES.find(t => t.id === tplId);
    if (!template || !record) return;

    const newSchema = template.schema;
    setSchemaWithLocalHistory(newSchema);

    // Save immediately as draft to backend
    try {
      await pagesApi.update(record.id, {
        mode: "schema",
        schema: newSchema,
        baseVersion: record.draft?.version,
      });
      toast({ title: "Template applied!", description: `${template.name} template loaded successfully` });
    } catch (e) {
      toast({ title: "Save error", description: "Template applied but auto-save failed", variant: "destructive" });
    }

    setPickerOpen(false);
  };

  const saveAndExit = async () => {
    try {
      await saveDraftNow();
      toast({ title: "Draft saved!", description: "Returning to pages list" });
      navigate("/pages");
    } catch (error) {
      toast({ title: "Save failed", description: "Could not save draft", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;

  const readOnly = viewPublished;
  const schemaToRender = viewPublished ? (publishedSchema ?? { content: {} }) : (schema ?? { content: {} });

  return (
    <div className="flex flex-col min-h-screen" data-inline-on={!readOnly && inlineEdit ? "true" : "false"}>
      <TitleBar
        pageId={record?.id || ""}
        initialTitle={record?.title || ""}
        initialSlug={record?.slug || ""}
        onRename={updateMeta}
        onSaveDraft={saveDraftNow}
        hasUnsavedDraft={hasUnsavedDraft}
        viewPublished={viewPublished}
      />
      <PatchToolbar
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onPublish={publish}
        onRevert={revertDraft}
        hasPublished={!!publishedSchema}
        isDirty={isDirty}
        viewPublished={viewPublished}
        setViewPublished={setViewPublished}
      />
      <div className="flex items-center gap-3 px-3 py-2 border-b bg-muted/30">
        <button
          className="h-8 px-3 rounded-md border disabled:opacity-50"
          disabled={readOnly}
          onClick={() => setInlineEdit(v => !v)}
          title="Toggle inline editing"
        >
          {(!readOnly && inlineEdit) ? "Inline: ON" : "Inline: OFF"}
        </button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPickerOpen(true)}
          title="Choose Template"
        >
          <Layout className="h-4 w-4 mr-2" />
          Templates
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={saveDraftNow}
          disabled={!isDirty}
          title="Save current changes as draft"
        >
          💾 Save Draft
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={saveAndExit}
          title="Save and return to pages list"
        >
          Save & Exit
        </Button>
      </div>

      {/* Template Picker Modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-[720px] max-h-[80vh] overflow-auto rounded-xl bg-card border shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Choose Template</h2>
              <Button variant="ghost" size="sm" onClick={() => setPickerOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template.id)}
                  className="w-full text-left p-4 border border-border rounded-lg hover:bg-muted/40 transition-colors"
                >
                  <div className="font-medium text-foreground">{template.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {template.schema.sections.join(' → ')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <DynamicPageRenderer
        layoutId="default"
        sections={schemaToRender?.sections || []}
        customData={schemaToRender?.content || {}}
        theme={schemaToRender?.theme || { brandColor: "#0066cc", radius: "md", density: "normal" }}
        inlineEdit={!readOnly && inlineEdit}
        schema={schemaToRender}
        setSchema={setSchemaWithLocalHistory}
      />
    </div>
  );
}

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, useMatch } from 'react-router-dom';
import { DynamicPageRenderer } from '@/components/DynamicPageRenderer';
import { ChatPanel } from '@/components/studio/ChatPanel';
import { useToast } from '@/hooks/use-toast';
import { ResizableChatDock } from '@/components/modern/ResizableChatDock';
import ModernMenu from '@/components/modern/ModernMenu';
import { Layout, X, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMembership } from '@/hooks/useMembership';
import PatchToolbar from '@/components/studio/PatchToolbar';
import { usePatchHistory } from '@/cms/history/usePatchHistory';
import { usePageDraft } from '@/hooks/usePageDraft';
import TitleBar from '@/components/studio/TitleBar';
import { pagesApi } from '@/api/pages';
import { TemplatePicker } from '@/components/studio/TemplatePicker';
import { TEMPLATES_META, getTemplateById } from '@/cms/templates/meta';
import { getTemplateSections } from '@/cms/templates/catalog';
import { applyPatch, type Operation } from "fast-json-patch";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getSections, isSchemaEmpty } from '@/utils/schemaHelpers';
import { useMultiTabSync } from '@/hooks/useMultiTabSync';
import { DiffModal } from '@/components/studio/DiffModal';

// Export types for other components that need them
export interface Section {
  id: string;
  type: string;
  props: Record<string, any>;
}

export interface PageSchema {
  id: string;
  name: string;
  sections: Section[];
}

// Default theme to prevent object recreation on every render
const DEFAULT_THEME = { brandColor: "#0066cc", radius: "md", density: "normal" } as const;

const StudioModern = () => {
  // ✅ ALL HOOKS DECLARED UNCONDITIONALLY AT THE TOP
  
  // Router hooks
  const { siteSlug = 'default' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isChatHub = !!useMatch("/studio/chat");
  
  // Get parameters
  const pageId = searchParams.get("pageId");
  const showPickerParam = searchParams.get("template") === "choose";
  
  // Toast hook
  const { toast } = useToast();
  
  // Membership hook
  const { siteId, loading: membershipLoading, allowed } = useMembership(
    isChatHub ? 'default' : siteSlug
  );

  // Page draft hook - ALWAYS called, internally handles empty pageId
  const draftHook = usePageDraft(pageId || "");
  console.debug('usePageDraft type check:', Array.isArray(draftHook) ? 'array' : typeof draftHook, draftHook);
  
  const {
    loading, record, schema, setSchemaWithHistory,
    publish, revertDraft, isDirty,
    viewPublished, setViewPublished, publishedSchema,
    updateMeta, saveDraftNow, hasUnsavedDraft,
    showDiffModal, conflictData, handleDiffConfirm, handleDiffCancel
  } = draftHook;

  // Local undo/redo history for immediate UI responsiveness  
  const {
    setSchemaWithHistory: setSchemaWithLocalHistory,
    undo, redo, canUndo, canRedo
  } = usePatchHistory(schema, setSchemaWithHistory);

  // Local state hooks
  const [pickerOpen, setPickerOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showChatGlobalState, setShowChatGlobalState] = useState(false);

  // Refs
  const pickerShownRef = useRef(false);
  const templateAppliedRef = useRef(false);

  // Multi-tab sync hook
  useMultiTabSync({
    pageId: pageId || '',
    currentVersion: record?.draft?.version,
    onVersionConflict: (newVersion) => {
      toast({
        title: "Page updated in another tab",
        description: "This page was modified in another browser tab. Changes will be synchronized automatically.",
        variant: "default"
      });
    }
  });

  // Auto-open template picker when needed (only once) 
  useEffect(() => {
    if (!pageId || pickerShownRef.current) return; // chat-only or already shown
    
    // Use helper for consistent empty detection
    if (showPickerParam || (schema && isSchemaEmpty(schema))) {
      setPickerOpen(true);
      pickerShownRef.current = true;
    }
  }, [pageId, showPickerParam, schema]);

  const applyTemplate = useCallback(async (tplId: string) => {
    if (templateAppliedRef.current || applying) return; // Prevent duplicate application
    templateAppliedRef.current = true;
    setApplying(true);
    
    try {
      const template = getTemplateById(tplId as any);
      if (!template || !record) {
        return;
      }

      const tplSections = getTemplateSections(tplId);
      const newSchema = {
        ...schema,
        sections: tplSections || []
      };

      setSchemaWithLocalHistory(newSchema);
      setPickerOpen(false);

      const result = await saveDraftNow();
      if (result.ok) {
        toast({
          title: "Template applied",
          description: `${template.label} template has been applied to your page.`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Template application failed:", error);
      toast({
        title: "Template failed",
        description: "There was an error applying the template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setApplying(false);
      // Reset to allow future template applications
      setTimeout(() => {
        templateAppliedRef.current = false;
      }, 1000);
    }
  }, [schema, record, setSchemaWithLocalHistory, saveDraftNow, toast]);

  // Publishing function
  const handlePublish = useCallback(async () => {
    try {
      await saveDraftNow(); // Save any pending changes first
      await publish();
      toast({
        title: "Page published",
        description: "Your changes are now live!",
        variant: "default"
      });
    } catch (error) {
      console.error("Publishing failed:", error);
      toast({
        title: "Publishing failed", 
        description: "There was an error publishing your page. Please try again.",
        variant: "destructive"
      });
    }
  }, [saveDraftNow, publish, toast]);

  // Revert function
  const handleRevert = useCallback(async () => {
    try {
      await revertDraft();
      toast({
        title: "Changes reverted",
        description: "Your draft has been reverted to the published version.",
        variant: "default"
      });
    } catch (error) {
      console.error("Revert failed:", error);
      toast({
        title: "Revert failed",
        description: "There was an error reverting your changes. Please try again.",
        variant: "destructive"
      });
    }
  }, [revertDraft, toast]);

  // Handle AI chat apply with JSON patches
  const onChatApply = useCallback(async (payload: { 
    type: "patches" | "schema"; 
    patches?: Operation[]; 
    schema?: any; 
    note?: string; 
  }) => {
    if (!record) return;
    
    // If you're previewing the published version, switch to draft mode
    if (viewPublished) setViewPublished(false);

    try {
      if (payload.type === "patches" && payload.patches?.length) {
        const next = applyPatch(schema ?? {}, payload.patches).newDocument;
        setSchemaWithLocalHistory(next);

        toast({
          title: "Changes applied",
          description: payload.note || "AI suggestions have been applied to your page.",
          variant: "default"
        });
      } else if (payload.type === "schema" && payload.schema) {
        setSchemaWithLocalHistory(payload.schema);
        
        toast({
          title: "Schema updated",
          description: payload.note || "Page schema has been updated.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Failed to apply changes:", error);
      toast({
        title: "Failed to apply changes",
        description: "There was an error applying the AI suggestions. Please try again.",
        variant: "destructive"
      });
    }
  }, [record, viewPublished, setViewPublished, schema, setSchemaWithLocalHistory, toast]);

  // Handle page generation
  const handleGenerate = useCallback(async (prompt: string) => {
    if (!record) return;
    
    try {
      // This would integrate with your AI generation API
      toast({
        title: "Generating content...",
        description: "AI is creating new content based on your prompt.",
        variant: "default"
      });
    } catch (error) {
      console.error("Generation failed:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating content. Please try again.",
        variant: "destructive"
      });
    }
  }, [record, toast]);

  // Handle edit requests
  const handleEdit = useCallback(async (prompt: string) => {
    if (!record) return;
    
    try {
      // This would integrate with your AI editing API
      toast({
        title: "Processing edit...",
        description: "AI is making changes based on your request.",
        variant: "default"
      });
    } catch (error) {
      console.error("Edit failed:", error);
      toast({
        title: "Edit failed",
        description: "There was an error processing your edit request. Please try again.",
        variant: "destructive"
      });
    }
  }, [record, toast]);

  // Determine render schema (published vs draft)
  const renderSchema = useMemo(() => {
    if (viewPublished && publishedSchema) return publishedSchema;
    return schema ?? {};
  }, [viewPublished, publishedSchema, schema]);

  // Extract sections safely
  const sections = useMemo(() => {
    return renderSchema?.sections || renderSchema?.content?.sections || [];
  }, [renderSchema]);
  
  // Memoize theme to prevent unnecessary re-renders
  const theme = useMemo(() => 
    renderSchema.theme || DEFAULT_THEME, 
    [renderSchema.theme]
  );

  // ✅ RENDER DECISIONS AFTER ALL HOOKS ARE DECLARED
  const shouldShowLoading = pageId && loading;
  const shouldShowComponent = isChatHub;

  // Handle loading state
  if (shouldShowLoading) {
    return <div className="p-6">Loading…</div>;
  }

  // Handle invalid access
  if (!shouldShowComponent) {
    return null; // safety
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Modern Premium Header / Navigation Bar */}
      <div className="relative border-b border-border/10 bg-gradient-to-r from-card/95 via-card/80 to-card/95 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
        
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Navigation */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/studio')}
                className="hover:scale-105 transition-all duration-200 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="font-medium">Studio</span>
              </Button>
              
              {pageId && record && (
                <div className="flex items-center gap-3">
                  <div className="h-6 w-px bg-border/30"></div>
                  <TitleBar 
                    pageId={pageId}
                    initialTitle={record.title}
                    initialSlug={record.slug}
                    onRename={updateMeta}
                  />
                </div>
              )}
            </div>

            {/* Center - Page Tools (when editing a page) */}
            {pageId && record && (
              <div className="flex items-center gap-2">
                <PatchToolbar
                  canUndo={canUndo}
                  canRedo={canRedo}
                  onUndo={undo}
                  onRedo={redo}
                  onPublish={handlePublish}
                  onRevert={handleRevert}
                  hasPublished={!!record.published}
                  viewPublished={viewPublished}
                  setViewPublished={setViewPublished}
                  isDirty={isDirty}
                  isApplying={applying}
                />
              </div>
            )}

            {/* Right side - Global Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChatGlobalState(!showChatGlobalState)}
                className={cn(
                  "hover:scale-105 transition-all duration-200",
                  showChatGlobalState ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <span className="font-medium">AI Chat</span>
              </Button>
              
              <ModernMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Page Editor / Canvas (Left) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {pageId && record ? (
            <div className="flex-1 overflow-auto bg-gradient-to-br from-muted/20 via-background to-muted/30">
              <div className="min-h-full">
                <DynamicPageRenderer
                  layoutId="studio"
                  sections={sections}
                  customData={{}}
                  theme={theme}
                  inlineEdit={true}
                  schema={renderSchema}
                  setSchema={setSchemaWithLocalHistory}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-muted/20 via-background to-muted/30">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-full blur-xl"></div>
                  <div className="relative bg-gradient-to-br from-card via-card/95 to-card/90 p-6 rounded-full border border-border/20 backdrop-blur-sm">
                    <Layout className="h-12 w-12 text-primary mx-auto" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gradient mb-3">Welcome to Studio</h2>
                <p className="text-muted-foreground mb-6">
                  Select an existing page or create a new one to start editing with AI-powered tools.
                </p>
                <Button
                  onClick={() => navigate('/studio')}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-105 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Pages
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* AI Chat Panel (Right) */}
        <ResizableChatDock
          canvas={null}
          chat={
            <div className="h-full bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm">
              <ChatPanel
                siteSlug="global-chat"
                siteId={undefined}
                schema={null}
                onSchemaUpdate={() => {}}
                onGenerate={handleGenerate}
                onEdit={handleEdit}
                onApply={undefined}
              />
            </div>
          }
          initialCollapsed={!showChatGlobalState && !chatOpen}
        />
      </div>

      {/* Modern Template Picker Modal */}
      {!!pageId && pickerOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-in fade-in-50 duration-300">
          <div className="bg-gradient-to-br from-card via-card/95 to-card/90 w-full max-w-6xl h-[80vh] rounded-3xl shadow-strong border border-border/20 backdrop-blur-lg overflow-hidden">
            <div className="relative p-6 border-b border-border/20 bg-gradient-to-r from-card/50 to-transparent">
              <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gradient">Choose Template</h2>
                  <p className="text-muted-foreground mt-1">Select a template to start building your page</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setPickerOpen(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 h-full overflow-hidden">
              <TemplatePicker
                selectedTemplate={null}
                onTemplateSelect={applyTemplate}
                onSchemaGenerate={() => {
                  // Handle AI schema generation if needed
                  setPickerOpen(false);
                }}
              />
              
              {/* Loading overlay when applying template */}
              {applying && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="flex items-center gap-3 px-4 py-3 bg-card rounded-lg border shadow-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Applying template...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Diff Modal for Version Conflicts */}
      <DiffModal
        open={showDiffModal}
        onOpenChange={() => {}}
        oldSchema={conflictData?.old}
        newSchema={conflictData?.new}
        onConfirm={handleDiffConfirm}
        onCancel={handleDiffCancel}
      />
    </div>
  );
};

export default StudioModern;

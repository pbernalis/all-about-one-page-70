import React, { useEffect, useId, useState } from "react";
import { useResizablePane } from "@/hooks/useResizablePane";
import { useZoom } from "@/hooks/useZoom";
import { SplitPaneModern } from "@/components/ui/split-pane-modern";

/** Props you care about in Studio */
type ResizableChatDockProps = {
  canvas: React.ReactNode;               // your preview renderer
  chat: React.ReactNode;                 // your chat UI (input, history)
  storageKey?: string;                   // key to persist width
  initialCollapsed?: boolean;
};

export const ResizableChatDock: React.FC<ResizableChatDockProps> = ({
  canvas,
  chat,
  storageKey = "studio:chatWidth",
  initialCollapsed = false,
}) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [fullscreen, setFullscreen] = useState(false);

  const pane = useResizablePane({
    storageKey,
    defaultWidth: 420,
    minWidth: 320,
    maxWidth: 800,
    snapPoints: [360, 420, 540, 640],
    snapThreshold: 16,
  });

  const { zoom, zoomIn, zoomOut, resetZoom, canZoomIn, canZoomOut } = useZoom();

  // lock scroll on fullscreen
  useEffect(() => {
    const b = document.body;
    if (fullscreen) b.style.overflow = "hidden";
    return () => { b.style.overflow = ""; };
  }, [fullscreen]);

  // focus chat input on open
  const chatInputId = useId();
  useEffect(() => {
    if (!collapsed) {
      setTimeout(() => {
        document.querySelector<HTMLInputElement>("#chat-input")?.focus();
      }, 80);
    }
  }, [collapsed]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["INPUT","TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
      if (e.key.toLowerCase() === "f") { e.preventDefault(); setFullscreen(v=>!v); }
      if (e.key.toLowerCase() === "j") { e.preventDefault(); setCollapsed(v=>!v); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`relative h-full w-full ${fullscreen ? "fixed inset-0 z-[100] bg-background" : ""}`}>
      {/* Top bar controls (zoom / fullscreen / toggle) */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-xl bg-background/80 backdrop-blur-sm px-3 py-2 shadow-lg border border-border/50">
        <button
          className="rounded-md border border-border bg-background/50 px-2 py-1 text-sm hover:bg-accent disabled:opacity-50 transition-colors"
          onClick={zoomOut}
          disabled={!canZoomOut}
          aria-label="Zoom out"
        >−</button>
        <span className="min-w-12 text-center text-sm font-medium text-foreground">{Math.round(zoom * 100)}%</span>
        <button
          className="rounded-md border border-border bg-background/50 px-2 py-1 text-sm hover:bg-accent disabled:opacity-50 transition-colors"
          onClick={zoomIn}
          disabled={!canZoomIn}
          aria-label="Zoom in"
        >+</button>
        <button className="rounded-md border border-border bg-background/50 px-2 py-1 text-sm hover:bg-accent transition-colors" onClick={resetZoom}>
          Reset
        </button>
        <div className="mx-1 h-5 w-px bg-border" />
        <button
          className={`rounded-md border border-border px-2 py-1 text-sm transition-colors ${fullscreen ? "bg-primary text-primary-foreground" : "bg-background/50 hover:bg-accent"}`}
          onClick={() => setFullscreen((v) => !v)}
          aria-pressed={fullscreen}
          aria-label="Toggle fullscreen"
          title="Fullscreen (F)"
        >
          {fullscreen ? "Exit" : "Full"}
        </button>
        <button
          className="rounded-md border border-border bg-background/50 px-2 py-1 text-sm hover:bg-accent transition-colors"
          onClick={() => setCollapsed((v) => !v)}
          aria-pressed={collapsed}
          aria-controls={chatInputId}
          aria-label="Toggle chat"
          title="Toggle chat (J)"
        >
          {collapsed ? "Chat" : "Hide"}
        </button>
      </div>

      {/* When collapsed, canvas takes all */}
      {collapsed ? (
        <div className="h-full w-full overflow-hidden">
          <div
            className="h-full w-full origin-top-left transition-transform duration-200"
            style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}
          >
            {canvas}
          </div>
        </div>
      ) : (
        <SplitPaneModern
          rightWidth={pane.width}
          onResizeStart={pane.startResize}
          isResizing={pane.isResizing}
          left={
            <div className="h-full w-full overflow-auto">
              <div
                className="h-full w-full origin-top-left transition-transform duration-200"
                style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}
              >
                {canvas}
              </div>
            </div>
          }
          right={
            <div className="flex h-full flex-col bg-card">
              <header className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
                <button
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-accent transition-colors"
                  onClick={() => setCollapsed(true)}
                  aria-label="Hide chat"
                >
                  ✕
                </button>
              </header>
              <div className="min-h-0 flex-1 overflow-auto">{chat}</div>
            </div>
          }
        />
      )}

      {/* Floating buttons when collapsed */}
      {collapsed && !fullscreen && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed right-6 bottom-6 z-20 rounded-full bg-gradient-primary px-4 py-3 text-sm font-medium text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 animate-pulse hover:animate-none"
          title="Open chat (J)"
        >
          💬 Open Chat
        </button>
      )}
    </div>
  );
};
import React from "react";

type SplitPaneProps = {
  left: React.ReactNode;
  right: React.ReactNode;
  rightWidth: number;            // px
  onResizeStart?: () => void;
  isResizing?: boolean;
  className?: string;
};

export const SplitPaneModern: React.FC<SplitPaneProps> = ({
  left,
  right,
  rightWidth,
  onResizeStart,
  isResizing = false,
  className,
}) => {
  return (
    <div className={`relative flex h-full w-full ${className ?? ""}`}>
      {/* Left (canvas) */}
      <div className="min-w-0 flex-1 overflow-hidden">{left}</div>

      {/* Resizer */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize chat panel"
        tabIndex={0}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          onResizeStart?.();
        }}
        className={`w-1.5 cursor-col-resize select-none bg-transparent hover:bg-border active:bg-border/70 transition-colors ${
          isResizing ? "bg-border" : ""
        }`}
      >
        {/* snap ticks visual */}
        <div className="pointer-events-none h-full opacity-40">
          <div className="h-full w-px mx-auto bg-gradient-to-b from-transparent via-border to-transparent repeat-[space]"></div>
        </div>
      </div>

      {/* Right (chat) */}
      <aside
        style={{ width: rightWidth }}
        className="h-full max-w-[60vw] min-w-[20rem] border-l bg-sidebar text-sidebar-foreground"
      >
        {right}
      </aside>
    </div>
  );
};
import React from 'react';
import { cn } from '@/lib/utils';

interface SplitPaneProps {
  children: [React.ReactNode, React.ReactNode];
  rightPaneWidth: number;
  onResizeStart: () => void;
  onDoubleClick?: () => void;
  isResizing?: boolean;
  className?: string;
}

export const SplitPane: React.FC<SplitPaneProps> = ({
  children,
  rightPaneWidth,
  onResizeStart,
  onDoubleClick,
  isResizing = false,
  className
}) => {
  const [leftPane, rightPane] = children;

  return (
    <div className={cn("flex-1 flex relative", className)}>
      {/* Left Pane */}
      <div 
        className="flex-1 transition-all duration-300"
        style={{ marginRight: rightPaneWidth }}
      >
        {leftPane}
      </div>

      {/* Resize Handle */}
      <div
        className={cn(
          "absolute top-0 bottom-0 w-1 cursor-col-resize z-10 group transition-colors",
          "bg-border hover:bg-border/80",
          isResizing && "bg-primary/50"
        )}
        style={{ right: rightPaneWidth - 1 }}
        onMouseDown={onResizeStart}
        onDoubleClick={onDoubleClick}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panels"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            // Handle keyboard resize if needed
            e.preventDefault();
          }
        }}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary/10" />
      </div>

      {/* Right Pane */}
      <div 
        className="absolute top-0 bottom-0 right-0 transition-all duration-300"
        style={{ width: rightPaneWidth }}
      >
        {rightPane}
      </div>
    </div>
  );
};
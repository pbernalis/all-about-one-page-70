import React from 'react';
import { RotateCcw, Play, Eye, Sparkles, Clock, Zap } from 'lucide-react';
import type { ChatMessage } from '@/hooks/useChatHistory';
import { cn } from '@/lib/utils';

interface MessageActionsProps {
  message: ChatMessage;
  onRestore?: (snapshot: unknown) => void;
  onRerun?: (prompt: string) => void;
  onViewChanges?: (ops: unknown[]) => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  message,
  onRestore,
  onRerun,
  onViewChanges,
}) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const hasChanges = isAssistant && Array.isArray(message.patchOps) && message.patchOps.length > 0;
  const hasSnapshot = isAssistant && message.schemaSnapshot;

  // Debug logging
  if (isAssistant) {
    console.log('Assistant message debug:', {
      hasChanges,
      patchOps: message.patchOps,
      hasSnapshot: !!message.schemaSnapshot,
      messageId: message.id
    });
  }

  // Show actions for any user message or assistant message (for demo purposes)
  if (!isUser && !isAssistant) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {isUser && (
        <button
          className={cn(
            "group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium",
            "bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-700 border border-emerald-200/50",
            "hover:from-emerald-100 hover:to-emerald-200/50 hover:border-emerald-300/50 hover:shadow-sm",
            "transition-all duration-200 hover:scale-105 active:scale-95",
            "dark:from-emerald-900/20 dark:to-emerald-800/20 dark:text-emerald-300 dark:border-emerald-800/50"
          )}
          onClick={() => onRerun?.(message.content)}
          title="Re-run this prompt with AI"
        >
          <Zap className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform duration-200" />
          Re-run prompt
        </button>
      )}

      {hasChanges && (
        <button
          className={cn(
            "group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium",
            "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 border border-blue-200/50",
            "hover:from-blue-100 hover:to-blue-200/50 hover:border-blue-300/50 hover:shadow-sm",
            "transition-all duration-200 hover:scale-105 active:scale-95",
            "dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300 dark:border-blue-800/50"
          )}
          onClick={() => onViewChanges?.(message.patchOps!)}
          title={`View ${message.patchOps!.length} design change${message.patchOps!.length > 1 ? 's' : ''}`}
        >
          <Eye className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" />
          <span className="flex items-center gap-1">
            Changes
            <span className="bg-blue-200/60 text-blue-800 px-1.5 py-0.5 rounded-full text-[10px] font-semibold dark:bg-blue-800/40 dark:text-blue-200">
              {message.patchOps!.length}
            </span>
          </span>
        </button>
      )}

      {hasSnapshot && (
        <button
          className={cn(
            "group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium",
            "bg-gradient-to-r from-amber-50 to-amber-100/50 text-amber-700 border border-amber-200/50",
            "hover:from-amber-100 hover:to-amber-200/50 hover:border-amber-300/50 hover:shadow-sm",
            "transition-all duration-200 hover:scale-105 active:scale-95",
            "dark:from-amber-900/20 dark:to-amber-800/20 dark:text-amber-300 dark:border-amber-800/50"
          )}
          onClick={() => onRestore?.(message.schemaSnapshot)}
          title="Restore design to this version"
        >
          <RotateCcw className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-300" />
          Restore version
        </button>
      )}

      {/* Enhanced demo buttons for testing */}
      {isAssistant && !hasChanges && !hasSnapshot && (
        <div className="flex items-center gap-1.5">
          <button
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium",
              "bg-muted/50 text-muted-foreground/50 border border-muted/30 cursor-not-allowed",
              "dark:bg-muted/20 dark:text-muted-foreground/40"
            )}
            title="No changes recorded for this message"
            disabled
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="flex items-center gap-1">
              Changes
              <span className="bg-muted/40 text-muted-foreground/40 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                0
              </span>
            </span>
          </button>
          <button
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium",
              "bg-muted/50 text-muted-foreground/50 border border-muted/30 cursor-not-allowed",
              "dark:bg-muted/20 dark:text-muted-foreground/40"
            )}
            title="No schema snapshot available"
            disabled
          >
            <Clock className="h-3.5 w-3.5" />
            Restore version
          </button>
        </div>
      )}

      {/* AI Enhancement Badge for Assistant Messages */}
      {isAssistant && (hasChanges || hasSnapshot) && (
        <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200/50 rounded-lg text-[10px] font-medium text-purple-700 dark:from-purple-900/20 dark:to-purple-800/20 dark:text-purple-300 dark:border-purple-800/50">
          <Sparkles className="h-3 w-3" />
          AI Enhanced
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface ChangesModalProps {
  open: boolean;
  onClose: () => void;
  operations: unknown[];
}

export const ChangesModal: React.FC<ChangesModalProps> = ({
  open,
  onClose,
  operations,
}) => {
  const formatOperation = (op: any) => {
    const { op: operation, path, value } = op;
    const operationColors = {
      add: 'text-green-600',
      remove: 'text-red-600',
      replace: 'text-blue-600',
    };
    
    const operationLabels = {
      add: 'ADD',
      remove: 'REMOVE',
      replace: 'REPLACE',
    };

    return (
      <div key={`${operation}-${path}`} className="mb-3 p-3 bg-sidebar-bg/30 rounded-md border">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-mono font-semibold px-2 py-1 rounded ${operationColors[operation as keyof typeof operationColors] || 'text-muted-foreground'} bg-background`}>
            {operationLabels[operation as keyof typeof operationLabels] || operation?.toUpperCase()}
          </span>
          <span className="text-xs font-mono text-muted-foreground">{path}</span>
        </div>
        
        {/* Show before/after diff for replace operations */}
        {operation === 'replace' && (op as any).beforeValue !== undefined && (op as any).afterValue !== undefined ? (
          <div className="text-xs space-y-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-md border bg-muted/30 p-2">
                <div className="mb-1 text-[10px] opacity-60">before</div>
                <pre className="whitespace-pre-wrap break-words text-xs">
                  {JSON.stringify((op as any).beforeValue, null, 2)}
                </pre>
              </div>
              <div className="rounded-md border bg-muted/30 p-2">
                <div className="mb-1 text-[10px] opacity-60">after</div>
                <pre className="whitespace-pre-wrap break-words text-xs">
                  {JSON.stringify((op as any).afterValue, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ) : operation === 'remove' && (op as any).beforeValue !== undefined ? (
          <div className="text-xs">
            <div className="text-muted-foreground mb-1">Removed value:</div>
            <pre className="text-xs text-sidebar-foreground bg-background p-2 rounded border overflow-x-auto">
              {JSON.stringify((op as any).beforeValue, null, 2)}
            </pre>
          </div>
        ) : value !== undefined ? (
          <div className="text-xs">
            <div className="text-muted-foreground mb-1">Value:</div>
            <pre className="text-xs text-sidebar-foreground bg-background p-2 rounded border overflow-x-auto">
              {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Applied Changes ({operations.length})
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          {operations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No changes recorded
            </div>
          ) : (
            <div className="space-y-2">
              {operations.map((op, index) => (
                <div key={index}>
                  {formatOperation(op)}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
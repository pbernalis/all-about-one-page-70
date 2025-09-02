import React from "react";
import { compare } from "fast-json-patch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { GitMerge, Plus, Minus, Edit } from "lucide-react";

interface DiffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  oldSchema: any;
  newSchema: any;
  onConfirm: () => void;
  onCancel: () => void;
}

function getDiffIcon(op: string) {
  switch (op) {
    case 'add': return <Plus className="h-3 w-3 text-green-500" />;
    case 'remove': return <Minus className="h-3 w-3 text-red-500" />;
    case 'replace': return <Edit className="h-3 w-3 text-blue-500" />;
    default: return <Edit className="h-3 w-3 text-muted-foreground" />;
  }
}

function formatValue(value: any): string {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

export function DiffModal({ 
  open, 
  onOpenChange, 
  oldSchema, 
  newSchema, 
  onConfirm, 
  onCancel 
}: DiffModalProps) {
  const patches = compare(oldSchema || {}, newSchema || {});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitMerge className="h-5 w-5" />
            Rebase Changes
          </DialogTitle>
          <DialogDescription>
            Another tab made changes to this page. Review the differences before applying:
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-96 border rounded-lg">
          <div className="p-4 space-y-2">
            {patches.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No differences detected
              </div>
            ) : (
              patches.map((patch, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card/50"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getDiffIcon(patch.op)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {patch.op.toUpperCase()}
                      </Badge>
                      <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {patch.path || '/'}
                      </code>
                    </div>
                    
                    {patch.op === 'remove' ? (
                      <div className="text-sm">
                        <span className="text-red-600">- </span>
                        <span className="bg-red-50 dark:bg-red-950/30 px-1 rounded">
                          {formatValue(('value' in patch) ? patch.value : 'removed')}
                        </span>
                      </div>
                    ) : patch.op === 'move' || patch.op === 'copy' ? (
                      <div className="text-sm">
                        <span className="text-blue-600">~ </span>
                        <span className="bg-blue-50 dark:bg-blue-950/30 px-1 rounded">
                          {patch.op === 'move' ? `moved from ${(patch as any).from}` : `copied from ${(patch as any).from}`}
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <span className="text-green-600">+ </span>
                        <span className="bg-green-50 dark:bg-green-950/30 px-1 rounded">
                          {formatValue(('value' in patch) ? patch.value : 'modified')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
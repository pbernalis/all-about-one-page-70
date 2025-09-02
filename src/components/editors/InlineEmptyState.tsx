import React from "react";

interface InlineEmptyStateProps {
  message: string;
  buttonText: string;
  onAdd: () => void;
  readOnly?: boolean;
}

export default function InlineEmptyState({ message, buttonText, onAdd, readOnly = false }: InlineEmptyStateProps) {
  if (readOnly) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <div className="text-sm">{message}</div>
      </div>
    );
  }

  return (
    <div className="py-8 text-center border-2 border-dashed border-muted rounded-xl">
      <div className="text-sm text-muted-foreground mb-4">{message}</div>
      <button 
        onClick={onAdd}
        className="px-4 h-9 rounded-md border bg-white hover:bg-muted transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}
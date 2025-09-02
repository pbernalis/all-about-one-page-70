import React from "react";
import { ErrorBoundary } from "react-error-boundary";

function InlineError({ error }: { error?: any }) {
  return (
    <div className="p-4 border border-red-200 rounded-xl bg-red-50 text-red-600">
      <div className="text-sm font-medium">Δεν φορτώνει ο editor</div>
      <div className="text-xs mt-1 opacity-75">{String(error?.message ?? error ?? "")}</div>
    </div>
  );
}

interface InlineErrorBoundaryProps {
  children: React.ReactNode;
}

export default function InlineErrorBoundary({ children }: InlineErrorBoundaryProps) {
  return (
    <ErrorBoundary FallbackComponent={InlineError}>
      {children}
    </ErrorBoundary>
  );
}
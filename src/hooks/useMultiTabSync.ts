import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MultiTabSyncOptions {
  pageId: string;
  currentVersion?: number;
  onVersionConflict?: (newVersion: number) => void;
}

/**
 * Multi-tab synchronization hook
 * Warns users when the same page is being edited in multiple tabs
 */
export function useMultiTabSync({ pageId, currentVersion, onVersionConflict }: MultiTabSyncOptions) {
  const { toast } = useToast();
  const lastVersionRef = useRef(currentVersion);
  const storageKey = `page:${pageId}:version`;

  // Update localStorage when version changes
  useEffect(() => {
    if (currentVersion !== undefined && currentVersion !== lastVersionRef.current) {
      lastVersionRef.current = currentVersion;
      try {
        localStorage.setItem(storageKey, currentVersion.toString());
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [currentVersion, storageKey]);

  // Listen for version changes from other tabs
  useEffect(() => {
    if (!pageId) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageKey && event.newValue) {
        const newVersion = parseInt(event.newValue, 10);
        const currentVer = lastVersionRef.current ?? 0;
        
        if (!isNaN(newVersion) && newVersion > currentVer) {
          toast({
            title: "Page updated in another tab",
            description: "This page was modified in another browser tab. Your edits will be rebased automatically.",
            variant: "default"
          });
          
          onVersionConflict?.(newVersion);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [pageId, storageKey, toast, onVersionConflict]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Ignore localStorage errors
      }
    };
  }, [storageKey]);
}
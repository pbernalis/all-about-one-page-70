import { useCallback, useEffect, useRef, useState } from "react";

type UseResizablePaneOptions = {
  storageKey: string;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;          // hard cap
  snapPoints?: number[];      // e.g. [360, 420, 540, 640]
  snapThreshold?: number;     // e.g. 16px
};

const safeGet = (k: string, fb: string) =>
  typeof window === "undefined" ? fb : localStorage.getItem(k) ?? fb;

export function useResizablePane({
  storageKey,
  defaultWidth = 420,
  minWidth = 320,
  maxWidth = 800,
  snapPoints = [],
  snapThreshold = 16,
}: UseResizablePaneOptions) {
  const [width, setWidth] = useState(() => {
    const saved = Number(safeGet(storageKey, `${defaultWidth}`));
    return Number.isFinite(saved) ? saved : defaultWidth;
  });
  const [isResizing, setIsResizing] = useState(false);
  const rafId = useRef<number | null>(null);

  const snap = useCallback(
    (w: number) => {
      if (!snapPoints.length) return w;
      const hit = snapPoints.find((p) => Math.abs(p - w) <= snapThreshold);
      return hit ?? w;
    },
    [snapPoints, snapThreshold]
  );

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem(storageKey, `${width}`);
  }, [storageKey, width]);

  useEffect(() => {
    const onMove = (e: MouseEvent | PointerEvent) => {
      if (!isResizing) return;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const newW = window.innerWidth - (e as MouseEvent).clientX;
        const effectiveMax = Math.min(maxWidth, window.innerWidth * 0.6);
        const clamped = Math.max(minWidth, Math.min(effectiveMax, newW));
        setWidth(snap(clamped));
      });
    };
    const onUp = () => {
      if (!isResizing) return;
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    }
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isResizing, maxWidth, minWidth, snap]);

  return {
    width,
    setWidth,
    isResizing,
    startResize: () => setIsResizing(true),
    resetWidth: () => setWidth(defaultWidth),
  };
}
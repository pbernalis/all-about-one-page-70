import { useCallback, useState } from "react";

const ZOOM_LEVELS = [0.5, 0.67, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];

export function useZoom(defaultZoom = 1) {
  const [zoom, setZoom] = useState(defaultZoom);

  const zoomIn = useCallback(() => {
    const i = ZOOM_LEVELS.findIndex((z) => z >= zoom);
    const next = ZOOM_LEVELS[Math.min((i < 0 ? 4 : i) + 1, ZOOM_LEVELS.length - 1)];
    setZoom(next);
  }, [zoom]);

  const zoomOut = useCallback(() => {
    const i = ZOOM_LEVELS.findIndex((z) => z >= zoom);
    const prev = ZOOM_LEVELS[Math.max((i < 0 ? 4 : i) - 1, 0)];
    setZoom(prev);
  }, [zoom]);

  const resetZoom = useCallback(() => setZoom(1), []);
  const fitToScreen = useCallback((containerW: number, contentW: number) => {
    const ratio = containerW / contentW;
    const fit = ZOOM_LEVELS.find((z) => z >= ratio) ?? ZOOM_LEVELS[0];
    setZoom(fit);
  }, []);

  return {
    zoom, setZoom, zoomIn, zoomOut, resetZoom, fitToScreen,
    canZoomIn: zoom < ZOOM_LEVELS[ZOOM_LEVELS.length - 1],
    canZoomOut: zoom > ZOOM_LEVELS[0],
  };
}
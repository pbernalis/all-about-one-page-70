import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

/**
 * Create stable callbacks that don't change reference on every render
 * Helps prevent unnecessary re-renders in child components
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef<T>(callback);
  ref.current = callback;
  
  return useCallback(((...args: Parameters<T>) => ref.current(...args)) as T, []);
}

/**
 * Create stable object references for props/context values
 * Prevents re-renders when object contents haven't actually changed
 */
export function useStableObject<T extends Record<string, any>>(obj: T): T {
  return useMemo(() => obj, Object.values(obj));
}

/**
 * Debounce hook for expensive operations (search, API calls, etc.)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for frequent events (scroll, resize, etc.)
 */
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef<number>(0);
  
  return useCallback(((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }) as T, [callback, delay]);
}

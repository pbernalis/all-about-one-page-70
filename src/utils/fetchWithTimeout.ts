/**
 * Fetch with abort timeout to prevent hung requests
 */

// AbortSignal.any polyfill for older browsers
if (!('any' in AbortSignal)) {
  // @ts-ignore
  AbortSignal.any = (signals: AbortSignal[]) => {
    const ctrl = new AbortController();
    const onAbort = () => ctrl.abort();
    signals.forEach(s => s?.addEventListener?.('abort', onAbort, { once: true }));
    return ctrl.signal;
  };
}

export async function fetchWithTimeout(
  input: RequestInfo, 
  init: RequestInit = {}, 
  ms = 15_000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  
  try {
    return await fetch(input, { 
      ...init, 
      signal: init.signal ? 
        // Combine signals if one already exists
        AbortSignal.any?.([init.signal, controller.signal]) ?? controller.signal
        : controller.signal 
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
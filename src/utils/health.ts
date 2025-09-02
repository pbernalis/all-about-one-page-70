/**
 * Sandbox health check utility to ensure server is ready before critical operations
 */
import { fetchWithTimeout } from "@/utils/fetchWithTimeout";

export async function waitForSandboxReady(maxAttempts = 6): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetchWithTimeout("/", { method: "HEAD" }, 3000);
      if (res.ok) return; // 2xx => server is ready
      
      // 412 Precondition Failed indicates server restart/HMR reconnection
      if (res.status === 412) {
        throw Object.assign(new Error("412"), { transient: true });
      }
    } catch (e: any) {
      // Let transient errors be retried, but non-network errors should bubble up
      if (e?.name !== 'AbortError' && e?.name !== 'TypeError' && !e?.transient) {
        throw e;
      }
    }
    
    // Exponential backoff: 300ms, 600ms, 1.2s, 2.4s, 4.8s, 9.6s
    await new Promise(r => setTimeout(r, 300 * Math.pow(2, i)));
  }
  
  // After max attempts, let the normal withRetry take over
  console.warn('waitForSandboxReady: Max attempts reached, continuing with normal retry logic');
}
/**
 * Utility for retrying failed requests with exponential backoff and jitter
 * Handles both HTTP errors and network failures, including rate limits
 */

function parseRetryAfter(res?: Response): number | null {
  const header = res?.headers?.get?.('Retry-After');
  if (!header) return null;
  
  // Try as seconds first
  const seconds = Number(header);
  if (Number.isFinite(seconds)) return seconds * 1000;
  
  // Try as HTTP-date format
  const date = Date.parse(header);
  return Number.isFinite(date) ? Math.max(date - Date.now(), 0) : null;
}

function isTransient(err: any): boolean {
  // Our API throws "502", "503: ..." etc from j(res)
  if (typeof err?.message === 'string' && /^5\d\d/.test(err.message)) return true;
  // Handle 412 Precondition Failed (sandbox restarts)
  if (typeof err?.message === 'string' && err.message.startsWith('412')) return true;
  // Fetch/network errors (no HTTP status)
  if (err?.name === 'TypeError') return true;
  // AbortError from timeouts - treat as transient  
  if (err?.name === 'AbortError') {
    err.transient = true;
    return true;
  }
  // Optional: explicit flag if you ever use custom errors
  if (err?.transient === true) return true;
  return false;
}

export async function withRetry<T>(
  fn: () => Promise<T>, 
  retries = 3, 
  baseDelay = 400
): Promise<T> {
  let lastErr: any;
  
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      lastErr = e;
      
      // Handle 429 rate limits with Retry-After header
      const is429 = typeof e?.message === 'string' && e.message.startsWith('429');
      const retryAfterMs = is429 ? parseRetryAfter(e.response) : null;
      const transient = isTransient(e);
      
      if ((!transient && !is429) || i === retries) break;
      
      // Use server's Retry-After or exponential backoff with jitter
      const jitter = Math.floor(Math.random() * 150);
      const delay = retryAfterMs ?? (baseDelay * Math.pow(2, i) + jitter);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  
  throw lastErr;
}
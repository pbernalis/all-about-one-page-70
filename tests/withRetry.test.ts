import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withRetry } from '@/utils/withRetry';

describe('withRetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('backs off on 5xx and eventually succeeds', async () => {
    let calls = 0;
    const fn = vi.fn().mockImplementation(async () => {
      calls++;
      if (calls < 3) {
        throw Object.assign(new Error('502'), { transient: true });
      }
      return 'ok';
    });

    const result = await withRetry(fn, 3, 1);
    
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('honors Retry-After header for 429', async () => {
    const res = new Response(null, { 
      status: 429, 
      headers: { 'Retry-After': '1' } 
    });
    const err = Object.assign(new Error('429'), { response: res });
    const fn = vi.fn()
      .mockRejectedValueOnce(err)
      .mockResolvedValueOnce('ok');

    const t0 = Date.now();
    const result = await withRetry(fn, 1, 1);
    
    expect(result).toBe('ok');
    expect(Date.now() - t0).toBeGreaterThanOrEqual(900); // ~1s
  });

  it('handles transient errors correctly', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(Object.assign(new Error('AbortError'), { name: 'AbortError' }))
      .mockRejectedValueOnce(Object.assign(new Error('TypeError'), { name: 'TypeError' }))
      .mockResolvedValueOnce('success');

    const result = await withRetry(fn, 3);
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('does not retry non-transient errors', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('400: Bad Request'));

    await expect(withRetry(fn, 3)).rejects.toThrow('400: Bad Request');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('handles HTTP-date format in Retry-After', async () => {
    const futureDate = new Date(Date.now() + 1000).toUTCString();
    const res = new Response(null, { 
      status: 429, 
      headers: { 'Retry-After': futureDate } 
    });
    const err = Object.assign(new Error('429'), { response: res });
    const fn = vi.fn()
      .mockRejectedValueOnce(err)
      .mockResolvedValueOnce('ok');

    const t0 = Date.now();
    const result = await withRetry(fn, 1, 1);
    
    expect(result).toBe('ok');
    expect(Date.now() - t0).toBeGreaterThanOrEqual(900);
  });
});
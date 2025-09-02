import { Operation } from 'fast-json-patch';
import { validatePatch } from '@/cms/patching/patch-validator';
import { describe, it, expect } from 'vitest';

describe('patch validator', () => {
  it('accepts valid patch operations', () => {
    const ops: Operation[] = [
      { op: 'add', path: '/content/title', value: 'Hello World' },
      { op: 'replace', path: '/seo/description', value: 'Updated description' },
    ];
    
    const { valid, errors } = validatePatch(ops);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it('rejects operations exceeding limits', () => {
    const ops: Operation[] = Array(50).fill({ op: 'add', path: '/content/item', value: 'test' });
    
    const { valid, errors } = validatePatch(ops);
    expect(valid).toBe(false);
    expect(errors.some(e => e.includes('Too many operations'))).toBe(true);
  });

  it('rejects disallowed paths', () => {
    const ops: Operation[] = [
      { op: 'add', path: '/secrets/token', value: 'dangerous' },
    ];
    
    const { valid, errors } = validatePatch(ops);
    expect(valid).toBe(false);
    expect(errors.some(e => e.includes('path not allowed'))).toBe(true);
  });
});
// tests/ops-sanitizer.test.ts
import { describe, it, expect } from 'vitest';
import { sanitizeSectionOps } from '@/cms/patching/ops-sanitizer';
import type { Operation } from 'fast-json-patch';

describe('ops-sanitizer', () => {
  it('should map unknown section ids to allowed ones', () => {
    const ops: Operation[] = [
      { op: 'replace', path: '/sections', value: ['pricing', 'faq', 'contact', 'feature-detail'] }
    ];

    const result = sanitizeSectionOps(ops);
    
    expect(result).toEqual([
      { op: 'replace', path: '/sections', value: ['pricing_tiered', 'faq_accordion', 'cta', 'features'] }
    ]);
  });

  it('should remove duplicate sections while preserving order', () => {
    const ops: Operation[] = [
      { op: 'replace', path: '/sections', value: ['hero', 'pricing', 'price', 'features', 'hero'] }
    ];

    const result = sanitizeSectionOps(ops);
    
    expect(result).toEqual([
      { op: 'replace', path: '/sections', value: ['hero', 'pricing_tiered', 'features'] }
    ]);
  });

  it('should drop unknown sections that cannot be mapped', () => {
    const ops: Operation[] = [
      { op: 'replace', path: '/sections', value: ['hero', 'unknown-section', 'features'] }
    ];

    const result = sanitizeSectionOps(ops);
    
    expect(result).toEqual([
      { op: 'replace', path: '/sections', value: ['hero', 'features'] }
    ]);
  });

  it('should remap content paths from old to new section ids', () => {
    const ops: Operation[] = [
      { op: 'add', path: '/content/pricing', value: { title: 'Plans' } },
      { op: 'add', path: '/content/faq/items', value: [] },
      { op: 'add', path: '/content/contact', value: { text: 'Get in touch' } }
    ];

    const result = sanitizeSectionOps(ops);
    
    expect(result).toEqual([
      { op: 'add', path: '/content/pricing_tiered', value: { title: 'Plans' } },
      { op: 'add', path: '/content/faq_accordion/items', value: [] },
      { op: 'add', path: '/content/cta', value: { text: 'Get in touch' } }
    ]);
  });

  it('should drop content operations for unknown sections', () => {
    const ops: Operation[] = [
      { op: 'add', path: '/content/hero', value: { title: 'Hello' } },
      { op: 'add', path: '/content/unknown-section', value: { title: 'Unknown' } },
      { op: 'add', path: '/content/features', value: { items: [] } }
    ];

    const result = sanitizeSectionOps(ops);
    
    expect(result).toEqual([
      { op: 'add', path: '/content/hero', value: { title: 'Hello' } },
      { op: 'add', path: '/content/features', value: { items: [] } }
    ]);
  });

  it('should pass through non-section operations unchanged', () => {
    const ops: Operation[] = [
      { op: 'replace', path: '/theme/brandColor', value: '#000' },
      { op: 'add', path: '/seo/title', value: 'My Site' },
      { op: 'replace', path: '/layout', value: 'default' }
    ];

    const result = sanitizeSectionOps(ops);
    
    expect(result).toEqual(ops);
  });

  it('should handle complex mapping scenarios', () => {
    const ops: Operation[] = [
      { op: 'replace', path: '/sections', value: [
        'hero', 'feature-grid', 'testimonial-spotlight', 'pricing', 
        'integrations', 'legal-body', 'empty-state', 'unknown-section'
      ]},
      { op: 'add', path: '/content/feature-grid', value: { items: [] } },
      { op: 'add', path: '/content/testimonial-spotlight', value: { quotes: [] } },
      { op: 'add', path: '/content/integrations', value: { logos: [] } },
      { op: 'add', path: '/content/legal-body', value: { text: 'Terms' } },
      { op: 'add', path: '/content/unknown-section', value: { data: 'should be dropped' } }
    ];

    const result = sanitizeSectionOps(ops);
    
    expect(result).toEqual([
      { op: 'replace', path: '/sections', value: [
        'hero', 'features', 'testimonials_marquee', 'pricing_tiered', 'logo_cloud', 'legal_content'
      ]},
      { op: 'add', path: '/content/features', value: { items: [] } },
      { op: 'add', path: '/content/testimonials_marquee', value: { quotes: [] } },
      { op: 'add', path: '/content/logo_cloud', value: { logos: [] } },
      { op: 'add', path: '/content/legal_content', value: { text: 'Terms' } }
    ]);
  });
});
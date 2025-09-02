import { describe, it, expect } from 'vitest';
import { getSections, isSchemaEmpty, setSections } from '@/utils/schemaHelpers';

describe('schemaHelpers', () => {
  describe('getSections', () => {
    it('extracts sections from multiple shapes', () => {
      expect(getSections({ sections: [1] })).toHaveLength(1);
      expect(getSections({ content: { sections: [1, 2] } })).toHaveLength(2);
      expect(getSections({ blocks: [1, 2, 3] })).toHaveLength(3);
    });

    it('handles undefined and null gracefully', () => {
      expect(getSections(undefined)).toEqual([]);
      expect(getSections(null)).toEqual([]);
      expect(getSections({})).toEqual([]);
    });

    it('prioritizes sections over content.sections over blocks', () => {
      const schema = {
        sections: [1],
        content: { sections: [2, 3] },
        blocks: [4, 5, 6]
      };
      expect(getSections(schema)).toEqual([1]);
    });
  });

  describe('isSchemaEmpty', () => {
    it('detects empty schema correctly', () => {
      expect(isSchemaEmpty(undefined)).toBe(true);
      expect(isSchemaEmpty(null)).toBe(true);
      expect(isSchemaEmpty({})).toBe(true);
      expect(isSchemaEmpty({ layout: 'x' })).toBe(false);
      expect(isSchemaEmpty({ sections: [1] })).toBe(false);
      expect(isSchemaEmpty({ content: { sections: [1] } })).toBe(false);
      expect(isSchemaEmpty({ blocks: [1] })).toBe(false);
    });

    it('considers schemas with only empty arrays as empty', () => {
      expect(isSchemaEmpty({ sections: [] })).toBe(true);
      expect(isSchemaEmpty({ content: { sections: [] } })).toBe(true);
      expect(isSchemaEmpty({ blocks: [] })).toBe(true);
    });
  });

  describe('setSections', () => {
    it('sets sections respecting structure', () => {
      expect(setSections({}, [1])).toEqual({ sections: [1] });
      expect(setSections({ content: { sections: [] } }, [1]))
        .toEqual({ content: { sections: [1] } });
      expect(setSections({ blocks: [] }, [1]))
        .toEqual({ blocks: [1] });
    });

    it('preserves other properties when setting sections', () => {
      const schema = { layout: 'grid', meta: { title: 'Test' } };
      const result = setSections(schema, [1, 2]);
      expect(result).toEqual({ 
        layout: 'grid', 
        meta: { title: 'Test' }, 
        sections: [1, 2] 
      });
    });

    it('handles nested content structure', () => {
      const schema = { content: { sections: [], meta: { version: 1 } } };
      const result = setSections(schema, [1]);
      expect(result).toEqual({ 
        content: { 
          sections: [1], 
          meta: { version: 1 } 
        } 
      });
    });
  });
});
/**
 * Utilities for handling schema normalization and section extraction
 * Supports multiple schema formats for future extensibility
 */

export type PageSchema = { 
  sections?: any[]; 
  content?: { sections?: any[] };
  blocks?: any[]; // Future support for block-based schemas
  [key: string]: any;
};

/**
 * Safely extract sections from schema, handling different schema formats
 * Priority: schema.sections > schema.content.sections > schema.blocks > []
 */
export function getSections(schema?: PageSchema): any[] {
  if (!schema) return [];
  
  // Direct sections array (most common)
  if (Array.isArray(schema.sections)) return schema.sections;
  
  // Nested in content object
  if (Array.isArray(schema.content?.sections)) return schema.content.sections;
  
  // Future: block-based schemas
  if (Array.isArray(schema.blocks)) return schema.blocks;
  
  return [];
}

/**
 * Check if schema is effectively empty (no content sections)
 */
export function isSchemaEmpty(schema?: PageSchema): boolean {
  if (!schema) return true;
  
  const sections = getSections(schema);
  const hasContent = sections.length > 0;
  const hasLayout = !!schema.layout;
  const hasOtherContent = schema.content && Object.keys(schema.content).length > 0;
  
  return !hasContent && !hasLayout && !hasOtherContent;
}

/**
 * Safely set sections in schema, maintaining the existing structure
 */
export function setSections(schema: PageSchema, sections: any[]): PageSchema {
  if (schema.sections !== undefined) {
    return { ...schema, sections };
  }
  
  if (schema.content?.sections !== undefined) {
    return { 
      ...schema, 
      content: { ...schema.content, sections } 
    };
  }
  
  // Future: handle blocks format
  if (schema.blocks !== undefined) {
    return { ...schema, blocks: sections };
  }
  
  // Default to top-level sections
  return { ...schema, sections };
}
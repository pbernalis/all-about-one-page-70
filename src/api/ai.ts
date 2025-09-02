import { supabase } from '@/integrations/supabase/client';
import { StudioSchema, JsonPatchOp } from '@/types/schema';
import { templates } from '@/catalog/templates';
import { applyPatch } from '@/lib/patch';

export interface AiGenerateResult {
  templateSlug: string;
  content: Record<string, any>;
  reason?: string;
  alternatives?: string[];
}

export interface AiPatchResult {
  ops: Array<{
    op: 'replace' | 'add' | 'remove';
    path: string;
    value?: any;
  }>;
  reason?: string;
  warning?: string;
}

export async function aiGenerate(
  prompt: string, 
  schema?: StudioSchema | null,
  options?: {
    locale?: string;
    tone?: string;
    goal?: string;
  }
): Promise<AiGenerateResult> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-template-generator', {
      body: {
        userPrompt: prompt,
        availableTemplates: templates.map(t => ({
          slug: t.id,
          title: t.name,
          sections: t.sections
        })),
        options: options || {},
        schema: schema || undefined
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`AI generation failed: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from AI generation');
    }

    // Validate the response structure
    if (!data.templateSlug || !data.content) {
      throw new Error('Invalid response format from AI generation');
    }

    return data as AiGenerateResult;
  } catch (error) {
    console.error('AI generate error:', error);
    throw new Error(
      error instanceof Error 
        ? `AI generation failed: ${error.message}`
        : 'AI generation failed: Unknown error'
    );
  }
}

export async function aiPatch(params: {
  schema: StudioSchema;
  instruction: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}): Promise<AiPatchResult> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-schema-editor', {
      body: {
        schema: params.schema,
        instruction: params.instruction,
        history: params.history || []
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`AI patch failed: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from AI patch');
    }

    // Validate the response structure
    if (!Array.isArray(data.ops)) {
      throw new Error('Invalid response format from AI patch');
    }

    return data as AiPatchResult;
  } catch (error) {
    console.error('AI patch error:', error);
    throw new Error(
      error instanceof Error 
        ? `AI patch failed: ${error.message}`
        : 'AI patch failed: Unknown error'
    );
  }
}

// Helper function to apply JSON Patch operations
export function applyJsonPatch(schema: StudioSchema, ops: AiPatchResult['ops']): StudioSchema {
  // Use the robust patch implementation
  return applyPatch(schema, ops as JsonPatchOp[]);
}

// Helper to normalize sections for a given template
export function normalizeForTemplate(templateSlug: string): string[] {
  const template = templates.find(t => t.id === templateSlug);
  return template ? template.sections : ['hero', 'features', 'contact'];
}
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

// --- JSON Patch Validator (inline) ---
type Op = 'add' | 'remove' | 'replace';
interface JsonPatchOperation { op: Op; path: string; value?: unknown }
interface ValidationResult { valid: boolean; errors: string[] }

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const PATH_ALLOWLIST: RegExp[] = [
  /^\/theme\/(brandColor|radius|density|typography|spacing|borderRadius)$/i,
  /^\/sections$/,
  /^\/sections\/-$/,
  /^\/sections\/\d+$/,
  /^\/content\/[A-Za-z0-9\-_.]+$/,
  /^\/content\/[A-Za-z0-9\-_.]+\/.+$/
];

const SECTION_ALLOW = [
  'hero','features','pricing','contact','faq','testimonials','about','services','service-detail',
  'case-studies','stats','team','blog-list','blog-post','portfolio','search-results'
];

function isJsonPointer(path: string) {
  return path.startsWith('/') && !path.includes('//');
}
function pathAllowed(path: string) {
  return PATH_ALLOWLIST.some((rx) => rx.test(path));
}
function byteLength(obj: unknown) {
  try { return new TextEncoder().encode(JSON.stringify(obj)).length; } catch { return Infinity; }
}
function isHexColor(v: unknown): v is string { return typeof v === 'string' && HEX_RE.test(v); }

function validatePatch(ops: JsonPatchOperation[], opts?: { maxOps?: number; maxBytes?: number }): ValidationResult {
  const errors: string[] = [];
  const maxOps = opts?.maxOps ?? 25;
  const maxBytes = opts?.maxBytes ?? 20 * 1024;

  if (!Array.isArray(ops)) return { valid: false, errors: ['Invalid ops array'] };
  if (ops.length === 0) return { valid: true, errors };
  if (ops.length > maxOps) errors.push(`Too many operations (>${maxOps})`);
  const bytes = byteLength(ops);
  if (bytes > maxBytes) errors.push(`Patch too large (${bytes} bytes)`);

  ops.forEach((op, i) => {
    if (!op || !['add','remove','replace'].includes(op.op)) errors.push(`op[${i}]: unsupported op`);
    if (!op.path || typeof op.path !== 'string') errors.push(`op[${i}]: missing path`);
    if (op.path && !isJsonPointer(op.path)) errors.push(`op[${i}]: invalid JSON-pointer`);
    if (op.path && !pathAllowed(op.path)) errors.push(`op[${i}]: path not allowed: ${op.path}`);

    // /theme/*
    if (/^\/theme\//i.test(op.path)) {
      if (op.op === 'remove') errors.push(`op[${i}]: remove not allowed for theme`);
      if (op.op !== 'remove' && op.value === undefined) errors.push(`op[${i}]: value required for theme`);
      if (/brandColor$/i.test(op.path) && !isHexColor(op.value)) errors.push(`op[${i}]: theme.brandColor must be hex`);
      if (/radius$/i.test(op.path) && typeof op.value !== 'number') errors.push(`op[${i}]: theme.radius must be number`);
      if (/density$/i.test(op.path) && !['compact','comfortable','spacious'].includes(String(op.value))) errors.push(`op[${i}]: invalid theme.density`);
    }

    // /sections
    if (op.path === '/sections') {
      if (op.op !== 'replace') errors.push(`op[${i}]: only replace allowed on /sections`);
      if (!Array.isArray(op.value)) errors.push(`op[${i}]: /sections must be array`);
      else {
        const bad = (op.value as unknown[]).filter((s) => !SECTION_ALLOW.includes(String(s)));
        if (bad.length) errors.push(`op[${i}]: unknown section(s): ${bad.join(',')}`);
      }
    }
    if (/^\/sections\/-$/i.test(op.path)) {
      if (op.op !== 'add') errors.push(`op[${i}]: only add allowed at /sections/-`);
      if (!SECTION_ALLOW.includes(String(op.value))) errors.push(`op[${i}]: unknown section "${op.value}"`);
    }
    if (/^\/sections\/\d+$/i.test(op.path)) {
      if (op.op === 'add') errors.push(`op[${i}]: add at /sections/{i} not allowed; use /sections/-`);
      if (op.op !== 'remove' && !SECTION_ALLOW.includes(String(op.value))) errors.push(`op[${i}]: unknown section "${op.value}"`);
    }

    // /content/* — require value for add/replace
    if (/^\/content\//i.test(op.path)) {
      if (op.op !== 'remove' && op.value === undefined) errors.push(`op[${i}]: value required for content changes`);
    }
  });

  return { valid: errors.length === 0, errors };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { schema, instruction, history = [] } = await req.json();

    // Build chat history context
    const historyContext = history.slice(-5).map((msg: any) => 
      `${msg.role}: ${msg.content}`
    ).join('\n');

    const systemPrompt = `You are an expert at editing website schemas using JSON Patch operations (RFC 6902).

CURRENT SCHEMA:
${JSON.stringify(schema, null, 2)}

ALLOWED OPERATIONS:
- replace: Change existing values
- add: Add new properties or array items
- remove: Remove properties or array items

ALLOWED PATHS EXAMPLES:
- /theme/brandColor - Change brand color
- /theme/radius - Change border radius
- /theme/density - Change spacing density
- /content/hero/headline - Change hero headline
- /content/hero/subheadline - Change hero subheadline
- /content/features/headline - Change features title
- /content/features/items/0/title - Change first feature title
- /sections/- - Add new section to end of array
- /sections/2 - Replace section at index 2

RULES:
1. Return ONLY valid JSON, no code fences or markdown
2. Never change /layoutId unless explicitly requested
3. For color changes, use hex format (e.g., #0ea5e9)
4. For adding sections, use canonical names: hero, features, pricing, testimonials, contact
5. If unclear, return empty ops array with warning

RESPONSE FORMAT:
{
  "ops": [
    { "op": "replace", "path": "/theme/brandColor", "value": "#0ea5e9" }
  ],
  "reason": "Applied color change as requested"
}

OR if unclear:
{
  "ops": [],
  "warning": "Please clarify what you want to change"
}

CHAT HISTORY:
${historyContext}`;

    const userMessage = `Apply this instruction to the schema: "${instruction}"`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt + '\n\nUSER INSTRUCTION:\n' + userMessage }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    // Clean up the response and parse JSON
    let cleanedText = generatedText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

const result = JSON.parse(cleanedText);

// Validate AI-produced patch before returning
const validation = validatePatch(Array.isArray(result.ops) ? result.ops : [], { maxOps: 25, maxBytes: 20 * 1024 });
if (!validation.valid) {
  console.warn('Patch rejected by validator:', validation.errors);
  return new Response(JSON.stringify({ ops: [], warning: `Patch rejected: ${validation.errors.join(' | ')}` }), {
    status: 400,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

console.log('Schema edit successful:', result.ops?.length || 0, 'operations');

return new Response(JSON.stringify(result), {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});
  } catch (error) {
    console.error('Error in ai-schema-editor:', error);
    return new Response(JSON.stringify({ 
      ops: [],
      error: error.message,
      warning: 'Could not process the instruction due to an error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
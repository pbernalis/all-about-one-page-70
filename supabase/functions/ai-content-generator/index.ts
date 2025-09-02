// supabase/functions/ai-content-generator/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type Operation = { op: "add"|"replace"|"remove"; path: string; value?: unknown; from?: string };
type Mode = "pick-layout" | "fill-content";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const ALLOWLIST = [
  /^\/layout$/,
  /^\/sections$/,
  /^\/sections\/\d+$/,
  /^\/sections\/-$/,
  /^\/content(\/[^/]+)+$/,
  /^\/seo(\/.*)?$/,
  /^\/nav\/items(\/\d+)?(\/(label|href))?$/,
  /^\/translations(\/[^/]+)+$/,
  /^\/content\/[^/]+\/images(\/\d+)?(\/(src|alt))?$/,
];

const MAX_OPS = 40;
const MAX_BYTES = 25 * 1024;

function byteLength(obj: unknown) {
  try { return new TextEncoder().encode(JSON.stringify(obj)).length; }
  catch { return Number.MAX_SAFE_INTEGER; }
}

function validatePatch(ops: Operation[]) {
  const errors: string[] = [];
  if (!Array.isArray(ops)) return { valid: false, errors: ["Invalid ops array"] };
  if (ops.length > MAX_OPS) errors.push(`Too many operations: ${ops.length} > ${MAX_OPS}`);
  const size = byteLength(ops);
  if (size > MAX_BYTES) errors.push(`Patch too large: ${size}B > ${MAX_BYTES}B`);

  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    if (!["add","replace","remove"].includes(op.op)) {
      errors.push(`Op#${i} disallowed op '${op.op}'`);
      continue;
    }
    if (typeof op.path !== "string") {
      errors.push(`Op#${i} missing path`);
      continue;
    }
    if (!ALLOWLIST.some(rx => rx.test(op.path))) {
      errors.push(`Op#${i} path not allowed: ${op.path}`);
    }
  }
  return { valid: errors.length === 0, errors };
}

async function callGemini(payload: unknown): Promise<Operation[]> {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) {
    console.log("No GEMINI_API_KEY found, using mock responses");
    // DEV MOCK
    const brief = (payload as any)?.brief ?? {};
    const language = brief?.language ?? "el";
    const isGreek = language === "el";
    const mode: Mode = (payload as any)?.mode ?? "fill-content";
    const layoutMissing = !(payload as any)?.currentSchema?.layout;

    const ops: Operation[] = [];
    if (mode === "pick-layout" && layoutMissing) {
      ops.push(
        { op: "add", path: "/layout", value: "landing" },
        { op: "add", path: "/sections", value: ["hero", "features", "cta"] },
      );
    }
    if (mode === "fill-content") {
      ops.push(
        {
          op: "add",
          path: "/content/hero",
          value: {
            title: isGreek ? "Χτίστε site με AI" : "Build a site with AI",
            subtitle: isGreek ? "Περιγράψτε την ιδέα σας — προεπισκόπηση άμεσα" : "Describe your idea — instant preview",
            cta: isGreek ? "Ξεκινήστε" : "Get Started",
          },
        },
        {
          op: "add",
          path: "/content/features",
          value: { items: [
            { title: isGreek ? "Ταχύτητα" : "Speed", desc: isGreek ? "Σελίδες σε δευτερόλεπτα" : "Pages in seconds" },
            { title: isGreek ? "Ευελιξία" : "Flexibility", desc: isGreek ? "Κάθε layout, κάθε κλάδος" : "Any layout, any niche" },
          ]},
        },
        {
          op: "add",
          path: "/content/cta",
          value: {
            text: isGreek ? "Έτοιμοι να ξεκινήσετε;" : "Ready to get started?",
            button: isGreek ? "Δημιουργήστε τη σελίδα σας" : "Create your page"
          },
        },
        {
          op: "add",
          path: "/seo",
          value: {
            title: "AI Website Builder",
            description: isGreek ? "Δημιουργήστε επαγγελματικές ιστοσελίδες με AI" : "Create professional websites with AI",
          },
        },
      );
    }
    return ops;
  }

  console.log("Using real Gemini API");
  // REAL CALL
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "system",
            parts: [
              {
                text:
                  "Return ONLY a JSON Patch array (RFC6902). Allowed paths: /layout, /sections, /content/*, /seo/*, /nav/items/*, /translations/*, /content/*/images/*.",
              },
            ],
          },
          {
            role: "user",
            parts: [{ text: JSON.stringify(payload) }],
          },
        ],
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Gemini output parse error");
  }
}

serve(async (req) => {
  console.log(`${req.method} ${req.url}`);
  
  // CORS preflight
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });

  try {
    const payload = await req.json();
    console.log("AI content generator payload:", { 
      mode: payload?.mode, 
      hasSchema: !!payload?.currentSchema,
      language: payload?.brief?.language 
    });

    const ops = await callGemini(payload);
    console.log(`Generated ${ops.length} operations`);

    const validation = validatePatch(ops);
    if (!validation.valid) {
      console.error("Validation failed:", validation.errors);
      return new Response(JSON.stringify({ ok:false, errors: validation.errors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok:true, ops }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ai-content-generator error:", err);
    return new Response(JSON.stringify({ ok:false, error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
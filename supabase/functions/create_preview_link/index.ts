// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// CORS helper
function cors(res: Response) {
  const h = new Headers(res.headers);
  h.set("Access-Control-Allow-Origin", "*"); // TODO: restrict to your app origin in prod
  h.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  h.set("Access-Control-Allow-Headers", "authorization,content-type");
  return new Response(res.body, { ...res, headers: h });
}

// Env
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

function b64url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return cors(new Response(null, { status: 204 }));

  try {
    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return cors(new Response(JSON.stringify({ error: "Missing auth" }), { status: 401 }));
    }

    const origin = new URL(req.url).origin;
    const { site_id, page_id, expires_in_minutes = 120 } = await req.json() as {
      site_id: string;
      page_id?: string; // optional if you don't have pages FK yet
      expires_in_minutes?: number; // default 120 mins
    };

    if (!site_id) {
      return cors(new Response(JSON.stringify({ error: "Missing site_id" }), { status: 400 }));
    }

    // 1) Use an *authed* client (with caller JWT) to enforce RLS when checking membership
    const authed = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    // Caller must be admin/editor of this site
    const { data: member, error: memErr } = await authed
      .from("memberships")
      .select("role")
      .eq("site_id", site_id)
      .in("role", ["admin", "editor"])
      .maybeSingle();

    if (memErr) {
      return cors(new Response(JSON.stringify({ error: memErr.message }), { status: 500 }));
    }
    if (!member) {
      return cors(new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 }));
    }

    // 2) Create a strong token
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    const token = b64url(bytes);

    // 3) Compute expiry
    const expires_at = new Date(Date.now() + Math.max(1, expires_in_minutes) * 60_000).toISOString();

    // 4) Insert with service-role (bypasses RLS)
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { error: insErr } = await admin.from("preview_tokens").insert({
      site_id,
      page_id: page_id ?? null,
      token,
      expires_at,
    });
    if (insErr) {
      return cors(new Response(JSON.stringify({ error: insErr.message }), { status: 500 }));
    }

    const preview_url = `${origin}/view?preview=${token}`;

    return cors(
      new Response(
        JSON.stringify({ ok: true, token, expires_at, preview_url }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
  } catch (e: any) {
    return cors(new Response(JSON.stringify({ error: e?.message ?? "Server error" }), { status: 500 }));
  }
});
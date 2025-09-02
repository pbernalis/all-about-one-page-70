// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// Basic CORS helper
function cors(res: Response) {
  const h = new Headers(res.headers);
  h.set("Access-Control-Allow-Origin", "*"); // tighten to your origin in prod
  h.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  h.set("Access-Control-Allow-Headers", "authorization,content-type");
  return new Response(res.body, { ...res, headers: h });
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  // Preflight
  if (req.method === "OPTIONS") return cors(new Response(null, { status: 204 }));

  try {
    // Optional: require caller to be authenticated (JWT passed from client)
    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return cors(new Response(JSON.stringify({ error: "Missing auth" }), { status: 401 }));
    }

    const { site_id, email, role } = await req.json() as {
      site_id: string;
      email: string;
      role: "admin" | "editor" | "viewer";
    };

    if (!site_id || !email || !role) {
      return cors(new Response(JSON.stringify({ error: "Missing params" }), { status: 400 }));
    }

    // Service-role client for admin operations
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // 1) Resolve or invite user
    // Prefer the dedicated Admin API call:
    const { data: byEmail, error: lookupErr } = await admin.auth.admin.getUserByEmail(email);
    if (lookupErr && lookupErr.status !== 404) {
      return cors(new Response(JSON.stringify({ error: lookupErr.message }), { status: 500 }));
    }

    let userId = byEmail?.user?.id ?? null;
    if (!userId) {
      const { data: invited, error: invErr } = await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${new URL(req.url).origin}/auth/callback`,
      });
      if (invErr) return cors(new Response(JSON.stringify({ error: invErr.message }), { status: 500 }));
      userId = invited.user?.id ?? null;
      if (!userId) return cors(new Response(JSON.stringify({ error: "Invite failed" }), { status: 500 }));
    }

    // 2) Upsert membership
    const { error: upErr } = await admin
      .from("memberships")
      .upsert({ user_id: userId, site_id, role }, { onConflict: "user_id,site_id" });
    if (upErr) return cors(new Response(JSON.stringify({ error: upErr.message }), { status: 500 }));

    return cors(new Response(JSON.stringify({ ok: true }), { status: 200 }));
  } catch (e: any) {
    return cors(new Response(JSON.stringify({ error: e?.message ?? "Server error" }), { status: 500 }));
  }
});
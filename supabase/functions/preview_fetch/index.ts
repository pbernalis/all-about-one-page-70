// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

function cors(res: Response) {
  const h = new Headers(res.headers);
  h.set("Access-Control-Allow-Origin", "*"); // tighten in prod
  h.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  h.set("Access-Control-Allow-Headers", "authorization,content-type");
  return new Response(res.body, { ...res, headers: h });
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") return cors(new Response(null, { status: 204 }));

  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) return cors(new Response(JSON.stringify({ error: "Missing token" }), { status: 400 }));

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { data: row, error } = await admin
      .from("preview_tokens")
      .select("site_id, page_id, expires_at")
      .eq("token", token)
      .maybeSingle();

    if (error || !row) return cors(new Response(JSON.stringify({ error: "Invalid token" }), { status: 404 }));
    if (new Date(row.expires_at).getTime() < Date.now()) {
      return cors(new Response(JSON.stringify({ error: "Token expired" }), { status: 410 }));
    }

    // If you have a pages table, fetch the page by row.page_id; otherwise return a stub
    // Example (adjust columns to your schema):
    // const { data: page, error: pErr } = await admin
    //   .from("pages")
    //   .select("title, slug, data_json, status")
    //   .eq("id", row.page_id)
    //   .maybeSingle();

    // if (pErr || !page) return cors(new Response(JSON.stringify({ error: "Page not found" }), { status: 404 }));

    return cors(new Response(JSON.stringify({ ok: true, token_info: row }), { status: 200 }));
  } catch (e: any) {
    return cors(new Response(JSON.stringify({ error: e?.message ?? "Server error" }), { status: 500 }));
  }
});
/**
 * One-time bootstrap: ensure a user (by email) is admin of a site.
 * Usage:
 *   EMAIL=pbernalis@gmail.com SITE_SLUG=my-site SITE_NAME="My First Site" \
 *   SUPABASE_URL=https://vutoglthnjuhgayyatzu.supabase.co SUPABASE_SERVICE_ROLE_KEY=... \
 *   npx tsx scripts/bootstrap-admin.ts
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://vutoglthnjuhgayyatzu.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const EMAIL = process.env.EMAIL!;
const SITE_SLUG = process.env.SITE_SLUG || "my-site";
const SITE_NAME = process.env.SITE_NAME || "My First Site";

if (!SERVICE_ROLE_KEY || !EMAIL) {
  console.error("Missing env: SUPABASE_SERVICE_ROLE_KEY and EMAIL are required.");
  console.log("Usage:");
  console.log("  EMAIL=pbernalis@gmail.com SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/bootstrap-admin.ts");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  console.log("🔍 Looking up user:", EMAIL);
  
  // 1) Find or invite the user
  const { data: users, error: listError } = await admin.auth.admin.listUsers();
  if (listError) throw listError;
  
  let user = users.users.find(u => (u.email || "").toLowerCase() === EMAIL.toLowerCase());

  if (!user) {
    console.log("✉️  Inviting user…");
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(EMAIL, {
      redirectTo: `${SUPABASE_URL}/auth/callback`,
    });
    if (inviteError) throw inviteError;
    user = invited.user!;
    console.log("✅ Invite sent:", user.id);
  } else {
    console.log("✅ Found user:", user.id);
  }

  const userId = user!.id;

  // 2) Ensure site exists (or update owner)
  console.log("🏗️  Ensuring site exists…", SITE_SLUG);
  const { data: site, error: siteError } = await admin
    .from("sites")
    .upsert(
      { slug: SITE_SLUG, name: SITE_NAME, owner_id: userId }, 
      { onConflict: "slug" }
    )
    .select("id, slug")
    .single();
  
  if (siteError) throw siteError;

  const siteId = site.id;
  console.log("✅ Site ready:", site.slug, siteId);

  // 3) Upsert admin membership
  console.log("👑 Granting admin role…");
  const { error: membershipError } = await admin
    .from("memberships")
    .upsert(
      { user_id: userId, site_id: siteId, role: "admin" }, 
      { onConflict: "user_id,site_id" }
    );
  
  if (membershipError) throw membershipError;

  console.log("\n🎉 Done!");
  console.log(`   User: ${EMAIL}`);
  console.log(`   Site: ${SITE_NAME} (${SITE_SLUG})`);
  console.log(`   Open Studio: /studio/${SITE_SLUG}\n`);
  console.log("Next steps:");
  console.log("1. Log in to your app with this email");
  console.log("2. Go to /studio/_pick to see your site");
  console.log(`3. Or go directly to /studio/${SITE_SLUG}`);
}

main().catch((e) => {
  console.error("❌ Bootstrap failed:", e?.message || e);
  process.exit(1);
});
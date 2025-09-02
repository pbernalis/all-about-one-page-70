import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type SiteRow = { id: string; name: string; slug: string; memberships: { role: string }[] };

export default function SiteSwitcher() {
  const { siteSlug } = useParams();
  const navigate = useNavigate();
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      // Get user's memberships first
      const { data: memberships } = await supabase
        .from("memberships")
        .select("site_id, role")
        .eq("user_id", user.id);
      
      if (!memberships?.length) {
        setSites([]);
        return;
      }

      // Get sites for those memberships
      const siteIds = memberships.map(m => m.site_id);
      const { data: sites } = await supabase
        .from("sites")
        .select("id, name, slug")
        .in("id", siteIds)
        .order("name", { ascending: true });

      // Combine sites with their roles
      const sitesWithRoles = (sites || []).map(site => ({
        ...site,
        memberships: [{ role: memberships.find(m => m.site_id === site.id)?.role }]
      }));
      
      setSites(sitesWithRoles);
    })();
  }, []);

  const current = sites.find(s => s.slug === siteSlug);
  const go = (slug: string) => {
    localStorage.setItem("lastSiteSlug", slug);
    navigate(`/studio/${slug}`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={() => setOpen(v => !v)}>
        {current ? current.name : "Choose site"}
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-64 rounded-lg border bg-background p-2 shadow-xl">
          {sites.length === 0 ? (
            <div className="p-3 text-sm opacity-70">No sites yet</div>
          ) : (
            sites.map(s => (
              <button
                key={s.id}
                onClick={() => go(s.slug)}
                className={`block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted ${
                  s.slug === siteSlug ? "bg-muted" : ""
                }`}
              >
                <div className="font-medium">{s.name}</div>
                <div className="text-xs opacity-60">/{s.slug}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
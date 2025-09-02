import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "lucide-react";

interface Site {
  id: string;
  slug: string;
  name: string;
}

export default function StudioPick() {
  const { user } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSites = async () => {
      try {
        // Get sites where user has membership (inner join ensures only accessible sites)
        const { data, error } = await (supabase as any)
          .from("sites")
          .select("id, name, slug, memberships!inner(role)")
          .eq("memberships.user_id", user.id)
          .order("name", { ascending: true });

        if (error) {
          console.error("Failed to fetch sites:", error);
          setSites([]);
        } else {
          setSites(data ?? []);
          
          // Check for last visited site and auto-redirect if user has access
          const lastSiteSlug = localStorage.getItem("lastSiteSlug");
          if (lastSiteSlug && data?.some((s: Site) => s.slug === lastSiteSlug)) {
            window.location.href = `/studio/${lastSiteSlug}`;
          }
        }
      } catch (error) {
        console.error("Failed to fetch sites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <h1 className="text-2xl font-semibold">Sign in Required</h1>
          <p className="text-muted-foreground">
            Please sign in to access your sites.
          </p>
          <Link to="/" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your sites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <Layout className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-semibold">Choose a Site</h1>
            <p className="text-muted-foreground">
              Select a site to open in the Studio
            </p>
          </div>

          {sites.length === 0 ? (
            <div className="text-center space-y-4 py-12">
              <p className="text-muted-foreground">
                You don't have access to any sites yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Contact your administrator to request access.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {sites.map((site) => (
                <Link
                  key={site.slug}
                  to={`/studio/${site.slug}`}
                  className="block p-6 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-soft transition-all"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {site.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      /{site.slug}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
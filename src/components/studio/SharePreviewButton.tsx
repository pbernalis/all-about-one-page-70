import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function SharePreviewButton({
  siteId,
  pageId,
}: { siteId: string; pageId?: string }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createLink = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not signed in");

      const res = await fetch("https://vutoglthnjuhgayyatzu.supabase.co/functions/v1/create_preview_link", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ site_id: siteId, page_id: pageId, expires_in_minutes: 120 }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to create preview link");

      await navigator.clipboard.writeText(json.preview_url);
      toast({
        title: "Preview link copied",
        description: "Anyone with the link can view this draft until it expires.",
      });
    } catch (e: any) {
      toast({
        title: "Could not create link",
        description: e?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="rounded-md border px-3 py-1.5 text-sm"
      onClick={createLink}
      disabled={loading}
      title="Create a draft preview link"
    >
      {loading ? "Creating…" : "Share preview"}
    </button>
  );
}
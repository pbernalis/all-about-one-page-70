import { useEffect, useState } from "react";

export default function PreviewView() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const token = q.get("preview");
    if (!token) { setErr("Missing token"); setLoading(false); return; }

    (async () => {
      try {
        const res = await fetch(`https://vutoglthnjuhgayyatzu.supabase.co/functions/v1/preview_fetch?token=${encodeURIComponent(token)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Invalid token");
        // If you wired pages fetching in preview_fetch, you'll get { page }
        setPage(json.page ?? json.token_info ?? null);
      } catch (e: any) {
        setErr(e?.message ?? "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading preview…</div>;
  if (err) return <div className="p-6 text-destructive">Error: {err}</div>;
  if (!page) return <div className="p-6">No content</div>;

  // TODO: render your page JSON with the same renderer you use for published pages
  return (
    <div className="p-6">
      <div className="mb-4 text-sm text-muted-foreground bg-muted p-3 rounded">
        📋 Preview Mode - This is a draft preview that will expire automatically
      </div>
      <pre className="text-xs bg-muted p-3 rounded overflow-auto">
        {JSON.stringify(page, null, 2)}
      </pre>
    </div>
  );
}
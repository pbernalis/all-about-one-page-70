import { useEffect, useState } from "react";
import { DynamicPageRenderer } from "@/components/DynamicPageRenderer";
import { pagesApi } from "@/api/pages";

export default function PublicPage({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await pagesApi.publicBySlug(slug);
        setPageData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load page");
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!pageData) return <div className="p-6">Page not found</div>;

  return (
    <DynamicPageRenderer
      layoutId="default"
      sections={pageData.schema?.sections || []}
      customData={pageData.schema?.content || {}}
      theme={pageData.schema?.theme || { brandColor: "#0066cc", radius: "md", density: "normal" }}
      inlineEdit={false}
      schema={pageData.schema}
      setSchema={() => {}}
    />
  );
}
import RichTextField from "@/components/editors/RichTextField";
import { richJsonToHtml } from "@/components/editors/richHtml";

export function BlogBodySection({ data, theme, schema, setSchema, readOnly }: any) {
  if (!readOnly) {
    return (
      <section className="py-8">
        <RichTextField
          schema={schema}
          setSchema={setSchema}
          path="/content/post_body/rich"
          value={data?.rich}
          placeholder="Γράψε το άρθρο εδώ…"
          brandColor={theme?.colorPrimary ?? "#6D28D9"}
          enableSlashCommands
          showFullScreenButton
        />
      </section>
    );
  }
  const html = data?.rich?.json ? richJsonToHtml(data.rich.json) : "";
  return <section className="prose max-w-none py-8" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default BlogBodySection;
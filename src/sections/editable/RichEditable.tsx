import RichTextField from "@/components/editors/RichTextField";
import { richJsonToHtml } from "@/components/editors/richHtml";

export default function RichEditable({
  id, data, theme, schema, setSchema, readOnly,
  placeholder = "Γράψε περιεχόμενο…",
}: {
  id: "post_body" | "legal_content" | "story";
  data: any; theme?: any; schema: any; setSchema: (s:any)=>void; readOnly: boolean;
  placeholder?: string;
}) {
  const brand = theme?.colorPrimary ?? "#6D28D9";

  if (!readOnly) {
    return (
      <section className="py-8">
        <RichTextField
          schema={schema}
          setSchema={setSchema}
          path={`/content/${id}/rich`}
          value={data?.rich}
          placeholder={placeholder}
          brandColor={brand}
          enableSlashCommands
          showFullScreenButton
        />
      </section>
    );
  }

  const html = data?.rich?.json ? richJsonToHtml(data.rich.json) : "";
  return (
    <section
      className="prose max-w-none py-8"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
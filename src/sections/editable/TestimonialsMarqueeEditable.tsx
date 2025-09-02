import InlineText from "@/components/editors/InlineText";
import type { Operation } from "fast-json-patch";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import { ensureArrayOps } from "@/helpers/ensureArray";

export default function TestimonialsMarqueeEditable({ data, schema, setSchema, readOnly }: any) {
  // Υποστήριξη είτε items[{text,author}] είτε quotes[]
  const items: Array<any> = data?.items ?? (data?.quotes ?? []).map((q: string) => ({ text: q }));

  const add = () => {
    const initOps = ensureArrayOps(schema, "content/testimonials_marquee/items");
    const addOp: Operation = { op: "add", path: "/content/testimonials_marquee/items/-", value: { text: "Τέλειο!", author: "" } };
    setSchema(applyPatchWithValidation(schema, [...initOps, addOp]));
  };

  const remove = (i: number) => {
    const op: Operation = { op: "remove", path: `/content/testimonials_marquee/items/${i}` };
    setSchema(applyPatchWithValidation(schema, [op]));
  };

  return (
    <section className="py-10 grid gap-4">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border p-4 flex items-center gap-2">
          <span className="text-xl">"</span>
          <InlineText
            path={`/content/testimonials_marquee/items/${i}/text`}
            value={it?.text ?? it?.quote}
            placeholder="Σύντομο quote"
            readOnly={readOnly}
            schema={schema}
            setSchema={setSchema}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground">
            —{" "}
            <InlineText
              path={`/content/testimonials_marquee/items/${i}/author`}
              value={it?.author}
              placeholder="Όνομα (προαιρετικό)"
              readOnly={readOnly}
              schema={schema}
              setSchema={setSchema}
              className="inline"
            />
          </span>

          {!readOnly && (
            <button onClick={() => remove(i)} className="ml-2 px-3 h-8 rounded-md border text-sm">Διαγραφή</button>
          )}
        </div>
      ))}

      {!readOnly && (
        <div>
          <button onClick={add} className="px-4 h-9 rounded-md border bg-white hover:bg-muted">+ Quote</button>
        </div>
      )}
    </section>
  );
}
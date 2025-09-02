import InlineText from "@/components/editors/InlineText";
import type { Operation } from "fast-json-patch";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import { ensureArrayOps } from "@/helpers/ensureArray";

export default function TestimonialsEditable({ data, schema, setSchema, readOnly }: any) {
  const items: Array<any> = data?.items ?? data?.quotes ?? [];

  const add = () => {
    const initOps = ensureArrayOps(schema, "content/testimonials/items");
    const addOp: Operation = { op: "add", path: "/content/testimonials/items/-", value: { quote: "Υπέροχο προϊόν!", author: "Όνομα" } };
    setSchema(applyPatchWithValidation(schema, [...initOps, addOp]));
  };

  const remove = (i: number) => {
    const op: Operation = { op: "remove", path: `/content/testimonials/items/${i}` };
    setSchema(applyPatchWithValidation(schema, [op]));
  };

  return (
    <section className="py-10 grid gap-6 md:grid-cols-2">
      {items.map((it, i) => (
        <figure key={i} className="rounded-xl border p-5">
          <blockquote className="italic">
            "
            <InlineText
              path={`/content/testimonials/items/${i}/quote`}
              value={it?.quote ?? it?.text}
              placeholder="Κείμενο μαρτυρίας"
              readOnly={readOnly}
              schema={schema}
              setSchema={setSchema}
              className="inline"
            />
            "
          </blockquote>
          <figcaption className="mt-3 text-sm">
            —{" "}
            <InlineText
              path={`/content/testimonials/items/${i}/author`}
              value={it?.author}
              placeholder="Συντάκτης"
              readOnly={readOnly}
              schema={schema}
              setSchema={setSchema}
              className="inline"
            />
          </figcaption>

          {!readOnly && (
            <div className="mt-3">
              <button onClick={() => remove(i)} className="px-3 h-8 rounded-md border text-sm">Διαγραφή</button>
            </div>
          )}
        </figure>
      ))}
      {!readOnly && (
        <div>
          <button onClick={add} className="px-4 h-9 rounded-md border bg-white hover:bg-muted">+ Testimonial</button>
        </div>
      )}
    </section>
  );
}
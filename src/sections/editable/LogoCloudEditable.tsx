import InlineText from "@/components/editors/InlineText";
import InlineEmptyState from "@/components/editors/InlineEmptyState";
import type { Operation } from "fast-json-patch";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import { ensureArrayOps } from "@/helpers/ensureArray";
import { ensureObjectOps } from "@/helpers/ensureObject";
import { safeRemove } from "@/helpers/safeOps";

export default function LogoCloudEditable({ data, schema, setSchema, readOnly }: any) {
  const logos: Array<{ src?: string; alt?: string; href?: string }> = data?.logos ?? [];

  const add = () => {
    const initObj = ensureObjectOps(schema, "content/logo_cloud");
    const initArr = ensureArrayOps(schema, "content/logo_cloud/logos");
    const addOp: Operation = { op: "add", path: "/content/logo_cloud/logos/-", value: { src: "", alt: "", href: "" } };
    setSchema(applyPatchWithValidation(schema, [...initObj, ...initArr, addOp]));
  };

  const remove = (i: number) => {
    const ops = safeRemove(schema, `content/logo_cloud/logos/${i}`);
    if (ops.length) setSchema(applyPatchWithValidation(schema, ops));
  };

  return (
    <section className="py-10">
      {logos.length === 0 ? (
        <InlineEmptyState
          message="Δεν υπάρχουν λογότυπα ακόμη"
          buttonText="+ Προσθήκη λογότυπου"
          onAdd={add}
          readOnly={readOnly}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {logos.map((item, i) => (
            <div key={i} className="rounded-xl border p-4">
              <div className="text-sm text-muted-foreground">Image URL</div>
              <InlineText
                path={`/content/logo_cloud/logos/${i}/src`}
                value={item?.src}
                placeholder="https://…logo.svg"
                readOnly={readOnly}
                schema={schema}
                setSchema={setSchema}
              />

              <div className="mt-2 text-sm text-muted-foreground">Alt</div>
              <InlineText
                path={`/content/logo_cloud/logos/${i}/alt`}
                value={item?.alt}
                placeholder="Επωνυμία"
                readOnly={readOnly}
                schema={schema}
                setSchema={setSchema}
              />

              <div className="mt-2 text-sm text-muted-foreground">Link (optional)</div>
              <InlineText
                path={`/content/logo_cloud/logos/${i}/href`}
                value={item?.href}
                placeholder="https://…"
                readOnly={readOnly}
                schema={schema}
                setSchema={setSchema}
              />

              {!readOnly && (
                <div className="mt-3">
                  <button onClick={() => remove(i)} className="px-3 h-8 rounded-md border text-sm">Διαγραφή</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!readOnly && logos.length > 0 && (
        <div className="mt-6 text-center">
          <button onClick={add} className="px-4 h-9 rounded-md border bg-white hover:bg-muted">+ Λογότυπο</button>
        </div>
      )}
    </section>
  );
}
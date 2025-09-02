import InlineText from "@/components/editors/InlineText";
import InlineEmptyState from "@/components/editors/InlineEmptyState";
import type { Operation } from "fast-json-patch";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import { ensureArrayOps } from "@/helpers/ensureArray";
import { ensureObjectOps } from "@/helpers/ensureObject";
import { safeRemove } from "@/helpers/safeOps";

export default function CareersGridEditable({ data, schema, setSchema, readOnly }: any) {
  const jobs: Array<{ title?: string; location?: string; type?: string; url?: string }> = data?.jobs ?? [];

  const add = () => {
    const initObj = ensureObjectOps(schema, "content/careers_grid");
    const initArr = ensureArrayOps(schema, "content/careers_grid/jobs");
    const value = { title: "Νέα θέση", location: "Remote", type: "Full-time", url: "#" };
    const addOp: Operation = { op: "add", path: "/content/careers_grid/jobs/-", value };
    setSchema(applyPatchWithValidation(schema, [...initObj, ...initArr, addOp]));
  };

  const remove = (i: number) => {
    const ops = safeRemove(schema, `content/careers_grid/jobs/${i}`);
    if (ops.length) setSchema(applyPatchWithValidation(schema, ops));
  };

  return (
    <section className="py-10">
      {jobs.length === 0 ? (
        <InlineEmptyState
          message="Δεν υπάρχουν θέσεις εργασίας ακόμη."
          buttonText="+ Νέα θέση"
          onAdd={add}
          readOnly={readOnly}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((j, i) => (
            <article key={i} className="rounded-xl border p-5">
              <h3 className="text-lg font-semibold">
                <InlineText
                  path={`/content/careers_grid/jobs/${i}/title`}
                  value={j?.title}
                  placeholder="Τίτλος θέσης"
                  readOnly={readOnly}
                  schema={schema}
                  setSchema={setSchema}
                />
              </h3>

              <div className="mt-1 text-sm text-muted-foreground">
                <InlineText
                  path={`/content/careers_grid/jobs/${i}/location`}
                  value={j?.location}
                  placeholder="Τοποθεσία"
                  readOnly={readOnly}
                  schema={schema}
                  setSchema={setSchema}
                />{" "}
                •{" "}
                <InlineText
                  path={`/content/careers_grid/jobs/${i}/type`}
                  value={j?.type}
                  placeholder="Τύπος (π.χ. Full-time)"
                  readOnly={readOnly}
                  schema={schema}
                  setSchema={setSchema}
                />
              </div>

              <div className="mt-3">
                <InlineText
                  path={`/content/careers_grid/jobs/${i}/url`}
                  value={j?.url}
                  placeholder="Link αγγελίας"
                  readOnly={readOnly}
                  schema={schema}
                  setSchema={setSchema}
                  className="text-primary underline"
                />
              </div>

              {!readOnly && (
                <div className="mt-3">
                  <button onClick={() => remove(i)} className="px-3 h-8 rounded-md border text-sm">Διαγραφή</button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {!readOnly && jobs.length > 0 && (
        <div className="mt-6 text-center">
          <button onClick={add} className="px-4 h-9 rounded-md border bg-white hover:bg-muted">+ Νέα θέση</button>
        </div>
      )}
    </section>
  );
}
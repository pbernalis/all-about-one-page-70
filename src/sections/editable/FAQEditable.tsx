import InlineText from "@/components/editors/InlineText";
import SortableArray from "@/components/editors/SortableArray";
import type { Operation } from "fast-json-patch";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import { ensureArrayOps } from "@/helpers/ensureArray";
import { safeRemove } from "@/helpers/safeOps";
import { arrayMoveOps } from "@/helpers/arrayMoveOps";
import { generateId } from "@/helpers/generateId";

export default function FAQEditable({ data, schema, setSchema, readOnly }: any) {
  const items: Array<{ id?: string; q?: string; a?: string }> = data?.items ?? [];

  const addItem = () => {
    const initOps = ensureArrayOps(schema, "content/faq_accordion/items");
    const addOp: Operation = { 
      op: "add", 
      path: "/content/faq_accordion/items/-", 
      value: { id: generateId(), q: "", a: "" } 
    };
    setSchema(applyPatchWithValidation(schema, [...initOps, addOp]));
  };

  const removeItem = (i: number) => {
    const ops = safeRemove(schema, `content/faq_accordion/items/${i}`);
    if (ops.length) setSchema(applyPatchWithValidation(schema, ops));
  };

  const handleMove = (from: number, to: number) => {
    const ops = arrayMoveOps(schema, "content/faq_accordion/items", from, to);
    if (ops.length) setSchema(applyPatchWithValidation(schema, ops));
  };

  return (
    <section className="py-10 max-w-3xl mx-auto">
      <div className="space-y-4">
        {items.length === 0 ? (
          !readOnly && (
            <button onClick={addItem} className="px-4 h-10 rounded-md border bg-background hover:bg-muted transition-colors">
              + Νέα ερώτηση
            </button>
          )
        ) : (
          <div className="max-h-[70vh] overflow-auto pr-1">
            <SortableArray
              items={items}
              getItemId={(it, i) => it?.id ?? String(i)}
              onMove={handleMove}
              disabled={readOnly}
              className="space-y-4"
              renderItem={(it, i) => (
                <div className="p-4 pl-10 md:pl-14 rounded-xl border bg-white">
                  <div className="flex items-start gap-3">
                    <h4 className="font-semibold shrink-0 mt-2">Q:</h4>
                    <InlineText
                      path={`/content/faq_accordion/items/${i}/q`}
                      value={it?.q}
                      placeholder="Ερώτηση"
                      readOnly={readOnly}
                      schema={schema}
                      setSchema={setSchema}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-start gap-3 mt-3">
                    <h4 className="font-semibold shrink-0 mt-2">A:</h4>
                    <InlineText
                      path={`/content/faq_accordion/items/${i}/a`}
                      value={it?.a}
                      placeholder="Απάντηση"
                      readOnly={readOnly}
                      schema={schema}
                      setSchema={setSchema}
                      className="w-full"
                    />
                  </div>
                  {!readOnly && (
                    <div className="mt-3">
                      <button 
                        onClick={() => removeItem(i)} 
                        className="px-3 h-8 rounded-md border bg-background hover:bg-muted transition-colors text-sm text-destructive"
                      >
                        Διαγραφή
                      </button>
                    </div>
                  )}
                </div>
              )}
            />
          </div>
        )}

        {!readOnly && items.length > 0 && (
          <button onClick={addItem} className="px-4 h-10 rounded-md border bg-background hover:bg-muted transition-colors">
            + Νέα ερώτηση
          </button>
        )}
      </div>
    </section>
  );
}
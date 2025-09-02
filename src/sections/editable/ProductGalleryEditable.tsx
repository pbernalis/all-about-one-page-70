import SortableArray from "@/components/editors/SortableArray";
import { arrayMoveOps } from "@/helpers/arrayMoveOps";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import { ensureArrayOps } from "@/helpers/ensureArray";
import { ensureObjectOps } from "@/helpers/ensureObject";
import { safeRemove } from "@/helpers/safeOps";
import { generateId } from "@/helpers/generateId";
import InlineText from "@/components/editors/InlineText";
import type { Operation } from "fast-json-patch";

export default function ProductGalleryEditable({ data, schema, setSchema, readOnly }: any) {
  const items: Array<{ id?: string; title?: string; caption?: string; image?: { src?: string; alt?: string } }> = data?.items ?? [];

  const add = () => {
    const initObj = ensureObjectOps(schema, "content/product_gallery");
    const initArr = ensureArrayOps(schema, "content/product_gallery/items");
    const value = { 
      id: generateId(),
      title: "Νέο project", 
      caption: "Σύντομη περιγραφή", 
      image: { src: "", alt: "" } 
    };
    const addOp: Operation = { op: "add", path: "/content/product_gallery/items/-", value };
    setSchema(applyPatchWithValidation(schema, [...initObj, ...initArr, addOp]));
  };

  const remove = (i: number) => {
    const ops = safeRemove(schema, `content/product_gallery/items/${i}`);
    if (ops.length) setSchema(applyPatchWithValidation(schema, ops));
  };

  const handleMove = (from: number, to: number) => {
    const ops = arrayMoveOps(schema, "content/product_gallery/items", from, to);
    if (ops.length) setSchema(applyPatchWithValidation(schema, ops));
  };

  return (
    <section className="space-y-3">
      {items.length === 0 ? (
        !readOnly && <button className="px-3 h-8 rounded-md border" onClick={add}>+ Προϊόν</button>
      ) : (
        <div className="max-h-[70vh] overflow-auto pr-1">
          <SortableArray
            items={items}
            getItemId={(it, i) => it?.id ?? String(i)}
            onMove={handleMove}
            disabled={readOnly}
            renderItem={(it, i) => (
              <div className="p-3 pl-10 md:pl-14 rounded border border-dashed bg-white space-y-2">
                <InlineText
                  path={`/content/product_gallery/items/${i}/title`}
                  value={it.title}
                  placeholder="Τίτλος"
                  readOnly={readOnly}
                  schema={schema}
                  setSchema={setSchema}
                />
                <InlineText
                  path={`/content/product_gallery/items/${i}/caption`}
                  value={it.caption}
                  placeholder="Λεζάντα"
                  readOnly={readOnly}
                  schema={schema}
                  setSchema={setSchema}
                />
                <div className="text-xs text-muted-foreground">
                  Image: <InlineText
                    path={`/content/product_gallery/items/${i}/image/src`}
                    value={it?.image?.src}
                    placeholder="https://..."
                    readOnly={readOnly}
                    schema={schema}
                    setSchema={setSchema}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Alt: <InlineText
                    path={`/content/product_gallery/items/${i}/image/alt`}
                    value={it?.image?.alt}
                    placeholder="Περιγραφή εικόνας"
                    readOnly={readOnly}
                    schema={schema}
                    setSchema={setSchema}
                  />
                </div>
                {!readOnly && (
                  <button
                    onClick={() => remove(i)}
                    className="px-3 h-8 rounded-md border bg-background hover:bg-muted transition-colors text-sm text-destructive"
                  >
                    Διαγραφή
                  </button>
                )}
              </div>
            )}
          />
        </div>
      )}

      {!readOnly && items.length > 0 && (
        <button className="px-3 h-8 rounded-md border" onClick={add}>+ Προϊόν</button>
      )}
    </section>
  );
}
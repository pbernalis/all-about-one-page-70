import InlineText from "@/components/editors/InlineText";
import SortableArray from "@/components/editors/SortableArray";
import type { Operation } from "fast-json-patch";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import { ensureArrayOps } from "@/helpers/ensureArray";
import { safeRemove } from "@/helpers/safeOps";
import { arrayMoveOps } from "@/helpers/arrayMoveOps";
import { generateId } from "@/helpers/generateId";

export default function TeamEditable({ data, schema, setSchema, readOnly }: any) {
  const members: Array<{ id?: string; name?: string; role?: string }> = data?.members ?? [];

  const add = () => {
    const initOps = ensureArrayOps(schema, "content/team/members");
    const addOp: Operation = { 
      op: "add", 
      path: "/content/team/members/-", 
      value: { id: generateId(), name: "Όνομα", role: "Ρόλος" } 
    };
    setSchema(applyPatchWithValidation(schema, [...initOps, addOp]));
  };

  const remove = (i: number) => {
    const ops = safeRemove(schema, `content/team/members/${i}`);
    if (ops.length) setSchema(applyPatchWithValidation(schema, ops));
  };

  const handleMove = (from: number, to: number) => {
    const ops = arrayMoveOps(schema, "content/team/members", from, to);
    if (ops.length) setSchema(applyPatchWithValidation(schema, ops));
  };

  return (
    <section className="py-10">
      {members.length === 0 ? (
        !readOnly && (
          <button onClick={add} className="px-4 h-10 rounded-md border bg-background hover:bg-muted transition-colors">
            + Νέο μέλος
          </button>
        )
      ) : (
        <div className="max-h-[70vh] overflow-auto pr-1">
          <SortableArray
            items={members}
            getItemId={(m, i) => m?.id ?? String(i)}
            onMove={handleMove}
            disabled={readOnly}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            renderItem={(m, i) => (
              <div className="p-5 pl-10 md:pl-14 rounded-xl border bg-white">
                <div className="text-lg font-semibold">
                  <InlineText
                    path={`/content/team/members/${i}/name`}
                    value={m?.name}
                    placeholder="Όνομα"
                    readOnly={readOnly}
                    schema={schema}
                    setSchema={setSchema}
                  />
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  <InlineText
                    path={`/content/team/members/${i}/role`}
                    value={m?.role}
                    placeholder="Ρόλος"
                    readOnly={readOnly}
                    schema={schema}
                    setSchema={setSchema}
                  />
                </div>
                {!readOnly && (
                  <div className="mt-3">
                    <button 
                      onClick={() => remove(i)} 
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

      {!readOnly && members.length > 0 && (
        <button onClick={add} className="px-4 h-10 rounded-md border bg-background hover:bg-muted transition-colors">
          + Νέο μέλος
        </button>
      )}
    </section>
  );
}
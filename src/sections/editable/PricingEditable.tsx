import InlineText from "@/components/editors/InlineText";
import type { Operation } from "fast-json-patch";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import { ensureArrayOps } from "@/helpers/ensureArray";

export default function PricingEditable({ data, schema, setSchema, readOnly }: any) {
  const tiers: Array<any> = data?.tiers ?? [];

  const addTier = () => {
    const initOps = ensureArrayOps(schema, "content/pricing_tiered/tiers");
    const value = { name: "Νέο πλάνο", price: "€0/μήνα", features: ["—"], cta: "Επιλογή" };
    const addOp: Operation = { op: "add", path: "/content/pricing_tiered/tiers/-", value };
    setSchema(applyPatchWithValidation(schema, [...initOps, addOp]));
  };

  const removeTier = (i: number) => {
    const op: Operation = { op: "remove", path: `/content/pricing_tiered/tiers/${i}` };
    setSchema(applyPatchWithValidation(schema, [op]));
  };

  const addFeature = (tierIndex: number) => {
    const initOps = ensureArrayOps(schema, `content/pricing_tiered/tiers/${tierIndex}/features`);
    const addOp: Operation = { op: "add", path: `/content/pricing_tiered/tiers/${tierIndex}/features/-`, value: "Νέο feature" };
    setSchema(applyPatchWithValidation(schema, [...initOps, addOp]));
  };

  const removeFeature = (tierIndex: number, fIndex: number) => {
    const op: Operation = { op: "remove", path: `/content/pricing_tiered/tiers/${tierIndex}/features/${fIndex}` };
    setSchema(applyPatchWithValidation(schema, [op]));
  };

  return (
    <section className="py-10 grid gap-6 md:grid-cols-3">
      {tiers.map((t, i) => (
        <div key={i} className="rounded-xl border p-5">
          <h3 className="text-lg font-semibold">
            <InlineText
              path={`/content/pricing_tiered/tiers/${i}/name`}
              value={t?.name}
              placeholder="Όνομα πλάνου"
              readOnly={readOnly}
              schema={schema}
              setSchema={setSchema}
            />
          </h3>

          <div className="mt-2 text-2xl">
            <InlineText
              path={`/content/pricing_tiered/tiers/${i}/price`}
              value={t?.price}
              placeholder="Τιμή (π.χ. €19/μήνα)"
              readOnly={readOnly}
              schema={schema}
              setSchema={setSchema}
            />
          </div>

          <ul className="mt-4 space-y-2">
            {(t?.features ?? []).map((f: string, fi: number) => (
              <li key={fi} className="flex items-center gap-2">
                <span>•</span>
                <InlineText
                  path={`/content/pricing_tiered/tiers/${i}/features/${fi}`}
                  value={f}
                  placeholder="Περιγραφή feature"
                  readOnly={readOnly}
                  schema={schema}
                  setSchema={setSchema}
                  className="w-full"
                />
                {!readOnly && (
                  <button onClick={() => removeFeature(i, fi)} className="text-xs px-2 h-7 rounded border">
                    −
                  </button>
                )}
              </li>
            ))}
          </ul>

          {!readOnly && (
            <div className="mt-3 flex gap-2">
              <button onClick={() => addFeature(i)} className="px-3 h-8 rounded-md border text-sm">+ Feature</button>
              <button onClick={() => removeTier(i)} className="px-3 h-8 rounded-md border text-sm">Διαγραφή πλάνου</button>
            </div>
          )}

          <div className="mt-4">
            <a className="inline-block px-4 h-10 rounded-lg bg-primary text-primary-foreground leading-[40px]">
              <InlineText
                path={`/content/pricing_tiered/tiers/${i}/cta`}
                value={t?.cta}
                placeholder="CTA (π.χ. Επίλεξε)"
                readOnly={readOnly}
                schema={schema}
                setSchema={setSchema}
              />
            </a>
          </div>
        </div>
      ))}

      {!readOnly && (
        <div>
          <button onClick={addTier} className="px-4 h-9 rounded-md border bg-white hover:bg-muted">+ Προσθήκη πλάνου</button>
        </div>
      )}
    </section>
  );
}
import React from "react";
import InlineText from "@/components/editors/InlineText";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import type { Operation } from "fast-json-patch";
import { ensureObjectOps } from "@/helpers/ensureObject";
import { ensureArrayOps } from "@/helpers/ensureArray";
import { safeRemove } from "@/helpers/safeOps";
import { arrayMoveOps } from "@/helpers/arrayMoveOps";

type Props = {
  schema: any;
  setSchema: (s: any) => void;
  readOnly?: boolean;
  className?: string;
};

export default function NavigationPanel({ schema, setSchema, readOnly = false, className = "" }: Props) {
  const navItems = schema?.nav?.items ?? [];

  const addItem = () => {
    const ops: Operation[] = [
      ...ensureObjectOps(schema, "nav"),
      ...ensureArrayOps(schema, "nav/items"),
      { op: "add", path: "/nav/items/-", value: { label: "New Link", href: "/" } }
    ];
    setSchema(applyPatchWithValidation(schema, ops));
  };

  const removeItem = (index: number) => {
    const ops = safeRemove(schema, `nav/items/${index}`);
    if (ops.length) setSchema(applyPatchWithValidation(schema, ops));
  };

  const moveItem = (from: number, direction: -1 | 1) => {
    const to = from + direction;
    if (to < 0 || to >= navItems.length) return;
    const ops = arrayMoveOps(schema, "nav/items", from, to);
    if (ops.length) setSchema(applyPatchWithValidation(schema, ops));
  };

  return (
    <section className={`rounded-xl border bg-card p-4 ${className}`} data-editable="true">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-muted-foreground">Navigation Menu</h3>
        {!readOnly && (
          <button
            onClick={addItem}
            className="h-8 px-3 rounded-md border bg-background hover:bg-muted transition-colors text-sm"
          >
            + Add Link
          </button>
        )}
      </div>

      <div className="space-y-3">
        {navItems.length === 0 && (
          <div className="text-sm italic opacity-60">No navigation items</div>
        )}
        
        {navItems.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <InlineText
                path={`/nav/items/${index}/label`}
                value={item.label}
                placeholder="Link text"
                readOnly={readOnly}
                schema={schema}
                setSchema={setSchema}
              />
              <InlineText
                path={`/nav/items/${index}/href`}
                value={item.href}
                placeholder="/page-url"
                readOnly={readOnly}
                schema={schema}
                setSchema={setSchema}
              />
            </div>
            
            {!readOnly && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="h-8 w-8 rounded-md border bg-background hover:bg-muted transition-colors disabled:opacity-50 flex items-center justify-center"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveItem(index, 1)}
                  disabled={index === navItems.length - 1}
                  className="h-8 w-8 rounded-md border bg-background hover:bg-muted transition-colors disabled:opacity-50 flex items-center justify-center"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="h-8 w-8 rounded-md border bg-background hover:bg-muted transition-colors text-destructive flex items-center justify-center"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
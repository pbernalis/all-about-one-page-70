import React from "react";
import InlineText from "@/components/editors/InlineText";
import RichTextField from "@/components/editors/RichTextField";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import type { Operation } from "fast-json-patch";
import { ensureObjectOps } from "@/helpers/ensureObject";
import { ensureArrayOps } from "@/helpers/ensureArray";
import { safeRemove } from "@/helpers/safeOps";

/** Μικρά helpers */
function isImageLike(v: any) {
  return v && typeof v === "object" && ("src" in v || "alt" in v);
}
function seg(path: string, key: string) {
  return `${path}/${key}`.replace(/\/+/g, "/");
}

/** Primitive editors */
const InlineBool: React.FC<{
  path: string; value?: boolean; readOnly: boolean; schema: any; setSchema: (s:any)=>void;
}> = ({ path, value, readOnly, schema, setSchema }) => {
  if (readOnly) return <span>{value ? "On" : "Off"}</span>;
  const onChange = (v: boolean) => {
    const op: Operation = value == null ? { op: "add", path, value: v } : { op: "replace", path, value: v };
    setSchema(applyPatchWithValidation(schema, [op]));
  };
  return (
    <label className="inline-flex items-center gap-2">
      <input type="checkbox" checked={!!value} onChange={e=>onChange(e.target.checked)} />
      <span className="text-xs opacity-60">{path.split("/").slice(-1)[0]}</span>
    </label>
  );
};

const InlineNumber: React.FC<{
  path: string; value?: number; readOnly: boolean; schema: any; setSchema: (s:any)=>void;
}> = ({ path, value, readOnly, schema, setSchema }) => {
  if (readOnly) return <span>{value}</span>;
  const onCommit = (v: number) => {
    const op: Operation = value == null ? { op: "add", path, value: v } : { op: "replace", path, value: v };
    setSchema(applyPatchWithValidation(schema, [op]));
  };
  return (
    <input
      type="number"
      defaultValue={value ?? 0}
      onBlur={(e)=>onCommit(Number(e.target.value))}
      className="w-24 bg-transparent border-b border-dashed border-muted-foreground/40 outline-none focus:border-solid focus:border-primary"
      data-editable="true"
    />
  );
};

/** Image object editor {src, alt} */
const InlineImageBox: React.FC<{
  path: string; value: any; readOnly: boolean; schema: any; setSchema: (s:any)=>void;
  uploadImage?: (file: File) => Promise<string>;
}> = ({ path, value, readOnly, schema, setSchema, uploadImage }) => {
  const setField = (k: "src"|"alt") => (val: string) => {
    const p = seg(path, k);
    const op: Operation = (value && k in value) ? { op:"replace", path:p, value:val } : { op:"add", path:p, value:val };
    setSchema(applyPatchWithValidation(schema, [op]));
  };
  const pickFile = async () => {
    if (!uploadImage || readOnly) return;
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = async () => {
      const f = input.files?.[0]; if (!f) return;
      const url = await uploadImage(f);
      setField("src")(url);
    };
    input.click();
  };
  return (
    <div className="flex items-center gap-3 p-2 rounded border border-dashed border-muted">
      <div className="w-20 h-12 bg-muted rounded overflow-hidden flex items-center justify-center">
        {value?.src ? <img src={value.src} alt="" className="max-w-full max-h-full object-cover" /> : <span className="text-xs">No image</span>}
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
        <InlineText path={seg(path,"src")} value={value?.src} placeholder="Image URL" readOnly={readOnly} schema={schema} setSchema={setSchema} />
        <InlineText path={seg(path,"alt")} value={value?.alt} placeholder="Alt" readOnly={readOnly} schema={schema} setSchema={setSchema} />
      </div>
      {!readOnly && uploadImage && (
        <button className="px-2 h-8 rounded-md border bg-background hover:bg-muted transition-colors" onClick={pickFile}>Upload</button>
      )}
    </div>
  );
};

/** Array editor για arrays string/number/object (με recursion) */
const InlineArray: React.FC<{
  path: string; value: any[]; readOnly: boolean; schema: any; setSchema: (s:any)=>void;
  uploadImage?: (file: File) => Promise<string>;
  brandColor?: string;
}> = ({ path, value, readOnly, schema, setSchema, uploadImage, brandColor }) => {
  const addPrimitive = (primitive: any) => {
    const ops = [
      ...ensureObjectOps(schema, path.replace(/\/[^/]+$/, "")), // parent object
      ...ensureArrayOps(schema, path),
      { op: "add", path: `/${path}/-`, value: primitive } as Operation
    ];
    setSchema(applyPatchWithValidation(schema, ops));
  };
  const addObject = () => addPrimitive({});
  const remove = (i: number) => setSchema(applyPatchWithValidation(schema, safeRemove(schema, `${path}/${i}`)));

  return (
    <div className="space-y-2">
      {value?.length ? value.map((item, i) => (
        <div key={i} className="p-2 rounded border border-dashed border-muted">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs opacity-60">{path.split("/").slice(-1)[0]}[{i}]</div>
            {!readOnly && <button className="px-2 h-7 rounded-md border bg-background hover:bg-muted text-xs transition-colors" onClick={()=>remove(i)}>Διαγραφή</button>}
          </div>
          <GenericFields
            basePath={`${path}/${i}`}
            data={item}
            readOnly={readOnly}
            schema={schema}
            setSchema={setSchema}
            uploadImage={uploadImage}
            brandColor={brandColor}
          />
        </div>
      )) : <div className="text-sm opacity-60 italic">Κενή λίστα</div>}
      {!readOnly && (
        <div className="flex gap-2">
          <button className="px-3 h-8 rounded-md border bg-background hover:bg-muted text-sm transition-colors" onClick={()=>addPrimitive("")}>+ String</button>
          <button className="px-3 h-8 rounded-md border bg-background hover:bg-muted text-sm transition-colors" onClick={()=>addPrimitive(0)}>+ Number</button>
          <button className="px-3 h-8 rounded-md border bg-background hover:bg-muted text-sm transition-colors" onClick={addObject}>+ Object</button>
        </div>
      )}
    </div>
  );
};

/** Ο renderer όλων των fields */
const GenericFields: React.FC<{
  basePath: string; data: any; readOnly: boolean; schema: any; setSchema: (s:any)=>void;
  uploadImage?: (file: File) => Promise<string>;
  brandColor?: string;
}> = ({ basePath, data, readOnly, schema, setSchema, uploadImage, brandColor }) => {
  // TipTap container
  if (data && typeof data === "object" && data.type === "tiptap" && data.json) {
    return (
      <RichTextField
        schema={schema} setSchema={setSchema}
        path={`/${basePath}`} value={data}
        placeholder="Πλούσιο κείμενο…"
        brandColor={brandColor}
        readOnly={readOnly}
      />
    );
  }

  if (typeof data === "string") {
    return <InlineText path={`/${basePath}`} value={data} placeholder={basePath.split("/").slice(-1)[0]} readOnly={readOnly} schema={schema} setSchema={setSchema} />;
  }
  if (typeof data === "number") {
    return <InlineNumber path={`/${basePath}`} value={data} readOnly={readOnly} schema={schema} setSchema={setSchema} />;
  }
  if (typeof data === "boolean") {
    return <InlineBool path={`/${basePath}`} value={data} readOnly={readOnly} schema={schema} setSchema={setSchema} />;
  }
  if (Array.isArray(data)) {
    return <InlineArray path={basePath} value={data} readOnly={readOnly} schema={schema} setSchema={setSchema} uploadImage={uploadImage} brandColor={brandColor} />;
  }
  if (isImageLike(data)) {
    return <InlineImageBox path={`/${basePath}`} value={data} readOnly={readOnly} schema={schema} setSchema={setSchema} uploadImage={uploadImage} />;
  }
  if (data && typeof data === "object") {
    return (
      <div className="space-y-4">
        {Object.keys(data).map((k) => (
          <div key={k} className="space-y-2">
            <div className="text-xs font-medium opacity-60">{k}</div>
            <GenericFields
              basePath={seg(basePath, k)}
              data={data[k]}
              readOnly={readOnly}
              schema={schema}
              setSchema={setSchema}
              uploadImage={uploadImage}
              brandColor={brandColor}
            />
          </div>
        ))}
      </div>
    );
  }
  // null/undefined → δώσε δυνατότητα να το "δημιουργήσει" ο χρήστης σαν string
  if (!readOnly) {
    const addInitial = () => {
      const ops = [
        ...ensureObjectOps(schema, basePath.split("/").slice(0, -1).join("/")),
        { op: "add", path: `/${basePath}`, value: "" } as Operation
      ];
      setSchema(applyPatchWithValidation(schema, ops));
    };
    return <button className="px-3 h-8 rounded-md border bg-background hover:bg-muted text-sm transition-colors" onClick={addInitial}>+ {basePath.split("/").slice(-1)[0]}</button>;
  }
  return null;
};

/** Το section wrapper: περνάς όλο το content object του section */
const GenericEditable: React.FC<{
  id: string; data: any; schema: any; setSchema: (s:any)=>void; readOnly: boolean;
  brandColor?: string; uploadImage?: (f:File)=>Promise<string>;
}> = ({ id, data, schema, setSchema, readOnly, brandColor, uploadImage }) => {
  if (!data || typeof data !== "object") {
    return <div className="text-sm opacity-60">No content for <code>{id}</code></div>;
  }
  return (
    <section className="space-y-4 p-4 border border-dashed border-muted/40 rounded-lg" data-editable-section={id}>
      <div className="text-sm font-medium text-muted-foreground mb-4">Section: {id}</div>
      <GenericFields
        basePath={`content/${id}`}
        data={data}
        readOnly={readOnly}
        schema={schema}
        setSchema={setSchema}
        brandColor={brandColor}
        uploadImage={uploadImage}
      />
    </section>
  );
};

export default GenericEditable;
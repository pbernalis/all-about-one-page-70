import { describe, it, expect } from "vitest";

type Operation = { op:"add"|"replace"|"remove"; path:string; value?:unknown };

const ALLOWLIST = [
  /^\/layout$/, 
  /^\/sections$/, 
  /^\/sections\/\d+$/, 
  /^\/sections\/-$/,
  /^\/content(\/[^/]+)+$/, 
  /^\/seo(\/.*)?$/, 
  /^\/nav\/items(\/\d+)?(\/(label|href))?$/,
  /^\/translations(\/[^/]+)+$/, 
  /^\/content\/[^/]+\/images(\/\d+)?(\/(src|alt))?$/,
];

function validateOperation(op: Operation): boolean {
  return ["add", "replace", "remove"].includes(op.op) && 
         ALLOWLIST.some(rx => rx.test(op.path));
}

function validatePatch(ops: Operation[]): boolean {
  return ops.every(validateOperation);
}

describe("JSON Patch validation", () => {
  it("accepts allowed content path", () => {
    expect(validatePatch([{ 
      op: "add", 
      path: "/content/hero", 
      value: { title: "Test Title" } 
    }])).toBe(true);
  });

  it("accepts allowed seo path", () => {
    expect(validatePatch([{ 
      op: "replace", 
      path: "/seo/title", 
      value: "New Title" 
    }])).toBe(true);
  });

  it("accepts allowed nav path", () => {
    expect(validatePatch([{ 
      op: "add", 
      path: "/nav/items/0/label", 
      value: "Home" 
    }])).toBe(true);
  });

  it("rejects disallowed path", () => {
    expect(validatePatch([{ 
      op: "add", 
      path: "/state/secret", 
      value: "x" 
    }])).toBe(false);
  });

  it("rejects invalid operation", () => {
    expect(validatePatch([{ 
      op: "destroy" as any, 
      path: "/content/hero", 
      value: {} 
    }])).toBe(false);
  });

  it("validates multiple operations", () => {
    expect(validatePatch([
      { op: "add", path: "/content/hero", value: { title: "Test" } },
      { op: "replace", path: "/seo/title", value: "New Title" },
      { op: "add", path: "/content/features", value: { items: [] } }
    ])).toBe(true);
  });

  it("rejects batch with one invalid operation", () => {
    expect(validatePatch([
      { op: "add", path: "/content/hero", value: { title: "Test" } },
      { op: "add", path: "/forbidden/path", value: "bad" },
      { op: "add", path: "/content/features", value: { items: [] } }
    ])).toBe(false);
  });
});
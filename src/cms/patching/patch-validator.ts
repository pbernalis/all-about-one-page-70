// JSON Patch validator with allowlist and limits
import type { Operation } from "fast-json-patch";

export type ValidationResult = { valid: boolean; errors: string[] };

const ALLOWLIST = [
  /^\/layout$/,
  /^\/sections$/,
  /^\/sections\/\d+$/,
  /^\/sections\/-$/,
  /^\/content(\/[^/]+)+$/,                           // /content/* (nested ok)
  /^\/seo(\/.*)?$/,                                  // /seo/*
  /^\/nav\/items(\/\d+)?(\/(label|href))?$/,         // /nav/items/* (+fields)
  /^\/translations(\/[^/]+)+$/,                      // /translations/*
  /^\/content\/[^/]+\/images(\/\d+)?(\/(src|alt))?$/, // /content/*/images/*
  /^\/ui(\/.*)?$/,                                   // /ui/* for UI updates
  /^\/meta(\/.*)?$/                                  // /meta/* for metadata
];

const MAX_OPS = 40;
const MAX_BYTES = 25 * 1024;

function withinAllowlist(path: string) {
  return ALLOWLIST.some(rx => rx.test(path));
}

function byteLength(obj: unknown) {
  try { 
    return new TextEncoder().encode(JSON.stringify(obj)).length; 
  } catch { 
    return Infinity; 
  }
}

export function validatePatch(ops: Operation[]): ValidationResult {
  const errors: string[] = [];
  if (!Array.isArray(ops)) return { valid: false, errors: ["Invalid ops array"] };
  if (ops.length === 0) return { valid: true, errors };
  if (ops.length > MAX_OPS) errors.push(`Too many operations: ${ops.length} > ${MAX_OPS}`);

  const size = byteLength(ops);
  if (size > MAX_BYTES) errors.push(`Patch too large: ${size}B > ${MAX_BYTES}B`);

  for (const [i, op] of ops.entries()) {
    if (!["add", "replace", "remove"].includes((op as any).op)) {
      errors.push(`Op#${i}: disallowed op '${(op as any).op}'`);
      continue;
    }
    if (typeof (op as any).path !== "string") {
      errors.push(`Op#${i}: missing/invalid path`);
      continue;
    }
    if (!withinAllowlist((op as any).path)) {
      errors.push(`Op#${i}: path not allowed: ${(op as any).path}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function applyPatchWithValidation<T>(doc: T, ops: Operation[]): T {
  const { applyPatch } = require("fast-json-patch");
  const res = validatePatch(ops);
  if (!res.valid) {
    const err = new Error("Patch validation failed: " + res.errors.join("; "));
    (err as any).errors = res.errors;
    throw err;
  }
  // fast-json-patch returns { newDocument, testOps } in v3
  const result = applyPatch(structuredClone(doc), ops, /*validate*/false, /*mutate*/false);
  return result.newDocument as T;
}
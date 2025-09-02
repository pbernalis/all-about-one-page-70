import { compare, type Operation } from "fast-json-patch";

export function diffAtPath(current: any, target: any, basePath: string): Operation[] {
  const prefix = basePath.startsWith("/") ? basePath : "/" + basePath;
  return compare(current, target).filter(op => 
    op.path === prefix || op.path.startsWith(prefix + "/")
  );
}
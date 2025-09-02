import type { PageSchema } from "@/cms/schema/types";

export type Density = "compact" | "comfortable" | "spacious";

// Update the old StudioSchema to use the new PageSchema
export interface StudioSchema extends PageSchema {}

export type JsonPatchOp = {
  op: "replace" | "add" | "remove";
  path: string;
  value?: any;
};

export interface AiGenerateResult {
  templateSlug: string;
  content: Record<string, any>;
  reason?: string;
  alternatives?: string[];
}

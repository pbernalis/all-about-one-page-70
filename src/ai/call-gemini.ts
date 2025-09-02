// src/ai/call-gemini.ts
import type { Operation } from "fast-json-patch";
import { supabase } from "@/integrations/supabase/client";

type GeminiMode = "pick-layout" | "fill-content";

export interface UserBrief {
  industry?: string;
  audience?: string;
  tone?: string;
  language?: string;
  keywords?: string[];
}

interface CallGeminiParams {
  mode: GeminiMode;
  currentSchema: any;
  templateCatalog: Record<string, string[]>;
  brief: UserBrief;
}

export async function callGemini({
  mode,
  currentSchema,
  templateCatalog,
  brief,
}: CallGeminiParams): Promise<Operation[]> {
  try {
    const { data, error } = await supabase.functions.invoke("ai-content-generator", {
      body: { mode, currentSchema, templateCatalog, brief },
    });

    if (error) throw new Error(`AI generation failed: ${error.message}`);

    if (!data?.ok) {
      const msg = data?.errors?.join?.("; ") || data?.error || "Unknown error";
      throw new Error(`AI generation failed: ${msg}`);
    }
    if (!Array.isArray(data.ops)) {
      throw new Error("Invalid response format from AI generation");
    }
    return data.ops as Operation[];
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    throw new Error(`AI generation failed: ${msg}`);
  }
}
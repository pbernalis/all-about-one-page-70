import React, { useState } from "react";
import { DynamicPageRenderer } from "@/components/DynamicPageRenderer";
import { EditorActions } from "@/components/studio/EditorActions";
import { callGemini } from "@/ai/call-gemini";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import { sanitizeSectionOps } from "@/cms/patching/ops-sanitizer";
import { templateCatalog } from "@/cms/templates/catalog";
import type { PageSchema } from "@/cms/schema/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialSchema: PageSchema = {
  theme: {
    brandColor: "#0ea5e9",
    radius: "md",
    density: "normal"
  },
  content: {}
};

export default function AITestPage() {
  const [schema, setSchema] = useState<PageSchema>(initialSchema);
  const [loading, setLoading] = useState(false);

  async function generateNewPage() {
    setLoading(true);
    try {
      // Phase A: Pick layout if needed
      if (!schema.layout) {
        const opsA = await callGemini({
          mode: "pick-layout",
          currentSchema: schema,
          templateCatalog,
          brief: { language: "el", tone: "professional", industry: "AI SaaS" }
        });
        
        const sanitizedOpsA = sanitizeSectionOps(opsA);
        const withLayout = applyPatchWithValidation(schema, sanitizedOpsA);
        setSchema(withLayout);

        // Phase B: Fill content
        const opsB = await callGemini({
          mode: "fill-content",
          currentSchema: withLayout,
          templateCatalog,
          brief: { language: "el", tone: "professional", industry: "AI SaaS" }
        });

        const sanitizedOpsB = sanitizeSectionOps(opsB);
        const finalSchema = applyPatchWithValidation(withLayout, sanitizedOpsB);
        setSchema(finalSchema);
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  }

  function resetSchema() {
    setSchema(initialSchema);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">AI Content Generation Test</h1>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={generateNewPage} 
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate AI Page"}
            </Button>
            <Button 
              onClick={resetSchema} 
              variant="outline"
            >
              Reset
            </Button>
          </div>
          
          {schema.layout && (
            <EditorActions 
              schema={schema} 
              setSchema={setSchema}
              brief={{ language: "el", tone: "professional", industry: "AI SaaS" }}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Schema Debug */}
          <Card>
            <CardHeader>
              <CardTitle>Current Schema</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(schema, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {schema.layout && schema.sections ? (
                <div className="border rounded-lg overflow-hidden">
                  <DynamicPageRenderer
                    layoutId={schema.layout}
                    sections={schema.sections}
                    customData={schema.content}
                    theme={schema.theme}
                  />
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No layout generated yet. Click "Generate AI Page" to start.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
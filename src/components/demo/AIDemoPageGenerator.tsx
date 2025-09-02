import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { callGemini, type UserBrief } from "@/ai/call-gemini";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import { sanitizeSectionOps } from "@/cms/patching/ops-sanitizer";
import { templateCatalog } from "@/cms/templates/catalog";
import { DynamicPageRenderer } from "@/components/DynamicPageRenderer";
import type { PageSchema } from "@/cms/schema/types";
import type { Operation } from "fast-json-patch";

const defaultSchema: PageSchema = {
  theme: {
    brandColor: "#0ea5e9",
    radius: "md",
    density: "normal"
  },
  content: {}
};

export function AIDemoPageGenerator() {
  const [schema, setSchema] = useState<PageSchema>(defaultSchema);
  const [lastOps, setLastOps] = useState<Operation[]>([]);
  const [lockLayout, setLockLayout] = useState(true);
  const [loading, setLoading] = useState(false);

  const brief: UserBrief = {
    industry: "AI SaaS",
    audience: "Developers",
    tone: "professional",
    language: "el"
  };

  async function generatePage() {
    setLoading(true);
    try {
      // Phase A: Pick layout (if needed)
      if (!schema.layout) {
        const opsA = await callGemini({
          mode: "pick-layout",
          currentSchema: schema,
          templateCatalog: Object.fromEntries(
            Object.entries(templateCatalog).map(([k, v]) => [k, [...v]])
          ),
          brief
        });
        
        const sanitizedOpsA = sanitizeSectionOps(opsA);
        const withLayout = applyPatchWithValidation(schema, sanitizedOpsA);
        setSchema(withLayout);
        setLastOps([...lastOps, ...opsA]);

        // Phase B: Fill content
        const opsB = await callGemini({
          mode: "fill-content",
          currentSchema: withLayout,
          templateCatalog: Object.fromEntries(
            Object.entries(templateCatalog).map(([k, v]) => [k, [...v]])
          ),
          brief
        });

        const sanitizedOpsB = sanitizeSectionOps(opsB);
        const finalSchema = applyPatchWithValidation(withLayout, sanitizedOpsB);
        setSchema(finalSchema);
        setLastOps([...opsA, ...opsB]);
      } else {
        // Only Phase B
        const ops = await callGemini({
          mode: "fill-content",
          currentSchema: schema,
          templateCatalog: Object.fromEntries(
            Object.entries(templateCatalog).map(([k, v]) => [k, [...v]])
          ),
          brief
        });

        const filtered1 = lockLayout
          ? ops.filter(op => !/^\/layout$|^\/sections(\/|$)/.test(op.path))
          : ops;

        // Filter out any ops that would create missing content
        const filtered2 = filtered1.filter((op) => {
          if (op.path.startsWith('/content/') && !schema.sections?.includes(op.path.split('/')[2])) {
            return false;
          }
          return true;
        });

        const sanitizedOps = sanitizeSectionOps(filtered2);
        const nextSchema = applyPatchWithValidation(schema, sanitizedOps);
        setSchema(nextSchema);
        setLastOps(filtered2);
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Controls */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>AI Page Generator Demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={generatePage} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Generating..." : schema.layout ? "Regenerate Content" : "Generate Page"}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={lockLayout}
                onChange={(e) => setLockLayout(e.target.checked)}
                id="lock-layout"
              />
              <label htmlFor="lock-layout" className="text-sm">
                Lock layout (content only)
              </label>
            </div>

            {schema.layout && (
              <div className="space-y-2">
                <Badge variant="secondary">Layout: {schema.layout}</Badge>
                <Badge variant="outline">
                  Sections: {schema.sections?.length || 0}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Last Patch Ops ({lastOps.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(lastOps, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(schema, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {schema.layout && schema.sections ? (
              <DynamicPageRenderer
                layoutId={schema.layout}
                sections={schema.sections}
                customData={schema.content}
                theme={schema.theme}
              />
            ) : (
              <div className="p-8 text-center text-gray-500">
                Click "Generate Page" to create a layout
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
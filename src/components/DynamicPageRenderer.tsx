import React from "react";
import type { PageSchema, ThemeTokens } from "@/cms/schema/types";
import { getSectionComponent } from "@/sections/registry";
import InlineErrorBoundary from "@/components/editors/InlineErrorBoundary";
import { useMobileGuard } from "@/hooks/use-mobile-guard";
import GenericEditable from "@/sections/editable/GenericEditable";
import TranslationsPanel from "@/sections/editable/TranslationsPanel";
import SEOPanel from "@/sections/editable/SEOPanel";
import NavigationPanel from "@/sections/editable/NavigationPanel";
import { getSections } from "@/utils/schemaHelpers";

type NormalizedTheme = {
  colorPrimary: string;
  radiusPx: number;
  spacingBase: number;
};

function themeToNormalized(t: ThemeTokens): NormalizedTheme {
  const radiusPx: Record<ThemeTokens["radius"], number> = { sm: 4, md: 8, lg: 12 };
  const spacingByDensity: Record<ThemeTokens["density"], number> = {
    compact: 6,
    cozy: 8,
    normal: 10,
  };
  return {
    colorPrimary: t.brandColor,
    radiusPx: radiusPx[t.radius],
    spacingBase: spacingByDensity[t.density],
  };
}

export interface DynamicPageRendererProps {
  layoutId: string;
  sections: string[];
  customData: Record<string, any>;
  theme: ThemeTokens;
  inlineEdit?: boolean;
  schema?: any;
  setSchema?: (s: any) => void;
}

export function DynamicPageRenderer({
  layoutId,
  sections,
  customData,
  theme,
  inlineEdit = false,
  schema,
  setSchema,
}: DynamicPageRendererProps) {
  const normalizedTheme = themeToNormalized(theme);
  const isDesktop = useMobileGuard();
  const shouldShowInlineEdit = inlineEdit && isDesktop;

  // Ensure sections is always an array using the helper
  const safeSections = getSections({ sections, content: customData });

  // Import editable components dynamically to avoid loading them if not needed
  const getEditableComponent = async (id: string) => {
    if (!inlineEdit) return null;
    
    try {
      switch (id) {
        case 'hero':
          const { default: HeroEditable } = await import('@/sections/editable/HeroEditable');
          return HeroEditable;
        case 'features':
          const { default: FeaturesEditable } = await import('@/sections/editable/FeaturesEditable');
          return FeaturesEditable;
        case 'post_body':
          const { default: RichEditable } = await import('@/sections/editable/RichEditable');
          return (props: any) => <RichEditable id="post_body" {...props} />;
        case 'legal_content':
          const { default: RichEditable2 } = await import('@/sections/editable/RichEditable');
          return (props: any) => <RichEditable2 id="legal_content" {...props} />;
        case 'story':
          const { default: RichEditable3 } = await import('@/sections/editable/RichEditable');
          return (props: any) => <RichEditable3 id="story" {...props} />;
        case 'faq_accordion':
          const { default: FAQEditable } = await import('@/sections/editable/FAQEditable');
          return FAQEditable;
        case 'pricing_tiered':
          const { default: PricingEditable } = await import('@/sections/editable/PricingEditable');
          return PricingEditable;
        case 'team':
          const { default: TeamEditable } = await import('@/sections/editable/TeamEditable');
          return TeamEditable;
        case 'testimonials':
          const { default: TestimonialsEditable } = await import('@/sections/editable/TestimonialsEditable');
          return TestimonialsEditable;
        case 'logo_cloud':
          const { default: LogoCloudEditable } = await import('@/sections/editable/LogoCloudEditable');
          return LogoCloudEditable;
        case 'careers_grid':
          const { default: CareersGridEditable } = await import('@/sections/editable/CareersGridEditable');
          return CareersGridEditable;
        case 'product_gallery':
          const { default: ProductGalleryEditable } = await import('@/sections/editable/ProductGalleryEditable');
          return ProductGalleryEditable;
        case 'testimonials_marquee':
          const { default: TestimonialsMarqueeEditable } = await import('@/sections/editable/TestimonialsMarqueeEditable');
          return TestimonialsMarqueeEditable;
        default:
          return null;
      }
    } catch (error) {
      console.warn(`Failed to load editable component for ${id}:`, error);
      return null;
    }
  };

  return (
    <div data-layout={layoutId} data-inline-on={shouldShowInlineEdit ? "true" : "false"}>
      {/* Control Panels - show at top when in edit mode */}
      {shouldShowInlineEdit && schema && setSchema && (
        <div className="space-y-6 mb-6">
          {/* SEO Panel */}
          <React.Suspense fallback={<div className="text-sm opacity-60">Loading SEO editor...</div>}>
            <InlineErrorBoundary>
              <SEOPanel 
                schema={schema} 
                setSchema={setSchema} 
                readOnly={false}
                className="mx-4"
              />
            </InlineErrorBoundary>
          </React.Suspense>
          
          {/* Navigation Panel */}
          <React.Suspense fallback={<div className="text-sm opacity-60">Loading navigation editor...</div>}>
            <InlineErrorBoundary>
              <NavigationPanel 
                schema={schema} 
                setSchema={setSchema} 
                readOnly={false}
                className="mx-4"
              />
            </InlineErrorBoundary>
          </React.Suspense>
          
          {/* Translations Panel */}
          <React.Suspense fallback={<div className="text-sm opacity-60">Loading translations...</div>}>
            <InlineErrorBoundary>
              <TranslationsPanel 
                schema={schema} 
                setSchema={setSchema} 
                readOnly={false}
                className="mx-4"
              />
            </InlineErrorBoundary>
          </React.Suspense>
        </div>
      )}
      
      {safeSections.map((id) => {
        const data = (customData && customData[id]) || {};
        
        if (shouldShowInlineEdit && schema && setSchema) {
          // Try custom editable components first
          
          if (id === 'hero') {
            const HeroEditable = React.lazy(() => import('@/sections/editable/HeroEditable'));
            return (
              <React.Suspense key={id} fallback={<div className="text-sm opacity-60">Loading editor...</div>}>
                <InlineErrorBoundary>
                  <HeroEditable
                    data={data}
                    theme={normalizedTheme}
                    schema={schema}
                    setSchema={setSchema}
                    readOnly={false}
                  />
                </InlineErrorBoundary>
              </React.Suspense>
            );
          }
          
          if (id === 'features') {
            const FeaturesEditable = React.lazy(() => import('@/sections/editable/FeaturesEditable'));
            return (
              <React.Suspense key={id} fallback={<div className="text-sm opacity-60">Loading editor...</div>}>
                <InlineErrorBoundary>
                  <FeaturesEditable
                    data={data}
                    schema={schema}
                    setSchema={setSchema}
                    readOnly={false}
                  />
                </InlineErrorBoundary>
              </React.Suspense>
            );
          }
          
          if (['post_body', 'legal_content', 'story'].includes(id)) {
            const RichEditable = React.lazy(() => import('@/sections/editable/RichEditable'));
            return (
              <React.Suspense key={id} fallback={<div className="text-sm opacity-60">Loading editor...</div>}>
                <InlineErrorBoundary>
                  <RichEditable
                    id={id as "post_body" | "legal_content" | "story"}
                    data={data}
                    theme={normalizedTheme}
                    schema={schema}
                    setSchema={setSchema}
                    readOnly={false}
                  />
                </InlineErrorBoundary>
              </React.Suspense>
            );
          }

          if (id === 'faq_accordion') {
            const FAQEditable = React.lazy(() => import('@/sections/editable/FAQEditable'));
            return (
              <React.Suspense key={id} fallback={<div className="text-sm opacity-60">Loading editor...</div>}>
                <InlineErrorBoundary>
                  <FAQEditable
                    data={data}
                    schema={schema}
                    setSchema={setSchema}
                    readOnly={false}
                  />
                </InlineErrorBoundary>
              </React.Suspense>
            );
          }

          if (id === 'pricing_tiered') {
            const PricingEditable = React.lazy(() => import('@/sections/editable/PricingEditable'));
            return (
              <React.Suspense key={id} fallback={<div className="text-sm opacity-60">Loading editor...</div>}>
                <InlineErrorBoundary>
                  <PricingEditable
                    data={data}
                    schema={schema}
                    setSchema={setSchema}
                    readOnly={false}
                  />
                </InlineErrorBoundary>
              </React.Suspense>
            );
          }

          if (id === 'team') {
            const TeamEditable = React.lazy(() => import('@/sections/editable/TeamEditable'));
            return (
              <React.Suspense key={id} fallback={<div className="text-sm opacity-60">Loading editor...</div>}>
                <InlineErrorBoundary>
                  <TeamEditable
                    data={data}
                    schema={schema}
                    setSchema={setSchema}
                    readOnly={false}
                  />
                </InlineErrorBoundary>
              </React.Suspense>
            );
          }

          if (id === 'testimonials') {
            const TestimonialsEditable = React.lazy(() => import('@/sections/editable/TestimonialsEditable'));
            return (
              <React.Suspense key={id} fallback={<div className="text-sm opacity-60">Loading editor...</div>}>
                <InlineErrorBoundary>
                  <TestimonialsEditable
                    data={data}
                    schema={schema}
                    setSchema={setSchema}
                    readOnly={false}
                  />
                </InlineErrorBoundary>
              </React.Suspense>
            );
          }

          if (id === 'logo_cloud') {
            const LogoCloudEditable = React.lazy(() => import('@/sections/editable/LogoCloudEditable'));
            return (
              <React.Suspense key={id} fallback={<div className="text-sm opacity-60">Loading editor...</div>}>
                <InlineErrorBoundary>
                  <LogoCloudEditable
                    data={data}
                    schema={schema}
                    setSchema={setSchema}
                    readOnly={false}
                  />
                </InlineErrorBoundary>
              </React.Suspense>
            );
          }

          if (id === 'careers_grid') {
            const CareersGridEditable = React.lazy(() => import('@/sections/editable/CareersGridEditable'));
            return (
              <React.Suspense key={id} fallback={<div className="text-sm opacity-60">Loading editor...</div>}>
                <InlineErrorBoundary>
                  <CareersGridEditable
                    data={data}
                    schema={schema}
                    setSchema={setSchema}
                    readOnly={false}
                  />
                </InlineErrorBoundary>
              </React.Suspense>
            );
          }

          if (id === 'product_gallery') {
            const ProductGalleryEditable = React.lazy(() => import('@/sections/editable/ProductGalleryEditable'));
            return (
              <React.Suspense key={id} fallback={<div className="text-sm opacity-60">Loading editor...</div>}>
                <InlineErrorBoundary>
                  <ProductGalleryEditable
                    data={data}
                    schema={schema}
                    setSchema={setSchema}
                    readOnly={false}
                  />
                </InlineErrorBoundary>
              </React.Suspense>
            );
          }

          if (id === 'testimonials_marquee') {
            const TestimonialsMarqueeEditable = React.lazy(() => import('@/sections/editable/TestimonialsMarqueeEditable'));
            return (
              <React.Suspense key={id} fallback={<div className="text-sm opacity-60">Loading editor...</div>}>
                <InlineErrorBoundary>
                  <TestimonialsMarqueeEditable
                    data={data}
                    schema={schema}
                    setSchema={setSchema}
                    readOnly={false}
                  />
                </InlineErrorBoundary>
              </React.Suspense>
            );
          }

          // Fallback to GenericEditable for any section that doesn't have a custom editor
          return (
            <React.Suspense key={id} fallback={<div className="text-sm opacity-60">Loading editor...</div>}>
              <InlineErrorBoundary>
                <GenericEditable
                  id={id}
                  data={data}
                  schema={schema}
                  setSchema={setSchema}
                  readOnly={false}
                  brandColor={normalizedTheme.colorPrimary}
                />
              </InlineErrorBoundary>
            </React.Suspense>
          );
        }
        
        // Fall back to regular component for preview mode
        const Comp = getSectionComponent(id);
        if (!Comp) {
          return (
            <div key={id} style={{ border: "1px dashed #ddd", padding: 12, margin: "12px 0" }}>
              Unknown section: <code>{id}</code>
            </div>
          );
        }
        
        return (
          <Comp 
            key={id} 
            data={data} 
            theme={normalizedTheme}
          />
        );
      })}
    </div>
  );
}
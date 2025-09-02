// Template catalog with structure only (no seeds)
import type { SectionId } from "@/cms/sections/ids";

export const templateCatalog: Record<string, SectionId[]> = {
  home: ["hero", "features", "logo_cloud", "testimonials", "cta"],
  landing: ["hero", "features", "pricing_tiered", "faq_accordion", "cta"],
  pricing: ["pricing_tiered", "feature_comparison", "faq_accordion", "cta"],
  blog_post: ["post_header", "post_body", "cta"],
  portfolio: ["hero", "product_gallery", "testimonials_marquee", "cta"],
  careers: ["hero", "careers_grid", "team", "faq_accordion", "cta"],
  legal: ["legal_content"],
  not_found: ["not_found"],
};

export type TemplateId = keyof typeof templateCatalog;

export function getTemplateSections(layoutId: string): string[] {
  return [...(templateCatalog[layoutId as TemplateId] || [])];
}

export function getTemplateNames(): Array<{ id: string; name: string; sections: string[] }> {
  return Object.entries(templateCatalog).map(([id, sections]) => ({
    id,
    name: id.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    sections: [...sections],
  }));
}
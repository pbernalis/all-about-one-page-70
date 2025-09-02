export const sectionIds = [
  "hero",
  "features",
  "cta",
  "story",
  "values",
  "team",
  "logo_cloud",
  "testimonials",
  "pricing_tiered",
  "faq_accordion",
  "feature_comparison",
  "post_header",
  "post_body",
  "product_gallery",
  "testimonials_marquee",
  "careers_grid",
  "legal_content",
  "not_found",
] as const;

export type SectionId = typeof sectionIds[number];
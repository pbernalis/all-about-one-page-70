// src/cms/schema/types.ts
export type RadiusToken = "sm" | "md" | "lg";
export type DensityToken = "compact" | "cozy" | "normal";

export interface ThemeTokens {
  brandColor: string;
  radius: RadiusToken;
  density: DensityToken;
}

export interface PageSchema {
  layout?: string;
  sections?: string[]; // ordered section ids
  theme: ThemeTokens;
  content: Record<string, any>;
  seo?: {
    title?: string;
    description?: string;
    og?: { title?: string; description?: string; image?: string };
  };
  nav?: { items: { label: string; href: string }[] };
  translations?: Record<string, { content: Partial<Record<string, any>> }>;
}
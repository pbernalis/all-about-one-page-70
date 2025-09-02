// Section registry with capability requirements
// Defines what each section needs to function properly

import type { Capability } from './capabilities';

export type SectionId =
  | 'hero_bento' | 'hero_video' | 'hero_simple'
  | 'feature_grid' | 'feature_comparison' | 'feature_spotlight'
  | 'logo_cloud' | 'stats' | 'metrics'
  | 'testimonials_marquee' | 'testimonials_grid' | 'testimonial_spotlight'
  | 'pricing_tiered' | 'pricing_simple' | 'pricing_comparison'
  | 'faq_accordion' | 'faq_grid'
  | 'cta_banner' | 'cta_section'
  | 'featured_blog' | 'blog_categories' | 'blog_grid'
  | 'contact_form' | 'contact_info' | 'locations'
  | 'newsletter' | 'subscribe_form'
  | 'product_gallery' | 'product_grid' | 'product_details'
  | 'filters_sidebar' | 'search_bar' | 'search_results'
  | 'cart_drawer' | 'cart_items' | 'cart_summary'
  | 'checkout_progress' | 'billing_form' | 'order_summary'
  | 'docs_sidebar' | 'code_block' | 'docs_nav'
  | 'changelog_timeline' | 'changelog_grid'
  | 'dashboard_widgets' | 'analytics_charts' | 'data_tables'
  | 'team_grid' | 'team_spotlight' | 'company_culture'
  | 'job_listings' | 'benefits' | 'company_values'
  | 'case_studies' | 'case_hero' | 'problem' | 'solution' | 'results'
  | 'project_grid' | 'project_spotlight' | 'capabilities'
  | 'process_steps' | 'timeline' | 'workflow'
  | 'map_embed' | 'video_background' | 'image_gallery'
  | 'bento_grid' | 'card_grid' | 'masonry_grid'
  | 'auth_forms' | 'login_form' | 'register_form'
  | 'legal_body' | 'legal_hero' | 'privacy_policy'
  | 'error_state' | 'empty_state' | 'loading_state'
  | 'calendar_scheduler' | 'event_calendar' | 'booking_form'
  | 'social_feed' | 'social_proof' | 'integrations'
  | 'related_posts' | 'related_products' | 'recommendations'
  | 'pagination' | 'load_more' | 'infinite_scroll';

export interface SectionMeta {
  id: SectionId;
  label: string;
  description: string;
  requires: Capability[];         // must-have capabilities
  optional?: Capability[];        // nice-to-have (enables extra features)
  tags?: string[];                // for UI filtering
  category: 'hero' | 'content' | 'social' | 'ecommerce' | 'forms' | 'navigation' | 'media' | 'data' | 'utility';
}

export const SECTIONS_META: SectionMeta[] = [
  // Hero Sections
  {
    id: 'hero_bento',
    label: 'Hero Bento',
    description: 'Modern hero with bento grid layout',
    requires: ['media:image'],
    optional: ['media:video', 'media:carousel'],
    tags: ['hero', 'bento', 'modern'],
    category: 'hero',
  },
  {
    id: 'hero_video',
    label: 'Video Hero',
    description: 'Full-width hero with background video',
    requires: ['media:video'],
    optional: ['media:image'],
    tags: ['hero', 'video', 'fullwidth'],
    category: 'hero',
  },
  {
    id: 'hero_simple',
    label: 'Simple Hero',
    description: 'Clean hero with headline and CTA',
    requires: [],
    optional: ['media:image'],
    tags: ['hero', 'simple', 'minimal'],
    category: 'hero',
  },

  // Content Sections
  {
    id: 'feature_grid',
    label: 'Feature Grid',
    description: 'Grid layout showcasing features',
    requires: ['media:image'],
    optional: ['media:video'],
    tags: ['features', 'grid'],
    category: 'content',
  },
  {
    id: 'feature_comparison',
    label: 'Feature Comparison',
    description: 'Side-by-side feature comparison table',
    requires: [],
    optional: ['analytics:datatable'],
    tags: ['features', 'comparison', 'table'],
    category: 'content',
  },
  {
    id: 'logo_cloud',
    label: 'Logo Cloud',
    description: 'Customer/partner logo showcase',
    requires: ['media:image'],
    tags: ['logos', 'social-proof'],
    category: 'social',
  },
  {
    id: 'stats',
    label: 'Statistics',
    description: 'Key metrics and achievements',
    requires: [],
    optional: ['analytics:charts'],
    tags: ['metrics', 'stats'],
    category: 'content',
  },

  // Social Proof
  {
    id: 'testimonials_marquee',
    label: 'Testimonials Marquee',
    description: 'Scrolling testimonials with animations',
    requires: ['media:image'],
    tags: ['testimonials', 'marquee', 'animation'],
    category: 'social',
  },
  {
    id: 'testimonials_grid',
    label: 'Testimonials Grid',
    description: 'Grid layout for customer testimonials',
    requires: ['media:image'],
    tags: ['testimonials', 'grid'],
    category: 'social',
  },
  {
    id: 'case_studies',
    label: 'Case Studies',
    description: 'Customer success stories showcase',
    requires: ['media:image'],
    optional: ['media:video'],
    tags: ['case-studies', 'success'],
    category: 'social',
  },

  // Pricing
  {
    id: 'pricing_tiered',
    label: 'Tiered Pricing',
    description: 'Multi-tier pricing with features',
    requires: ['forms:builder'],
    optional: ['forms:payments'],
    tags: ['pricing', 'tiers'],
    category: 'content',
  },
  {
    id: 'pricing_comparison',
    label: 'Pricing Comparison',
    description: 'Detailed pricing comparison table',
    requires: ['analytics:datatable'],
    optional: ['forms:payments'],
    tags: ['pricing', 'comparison'],
    category: 'content',
  },

  // Forms & Interaction
  {
    id: 'contact_form',
    label: 'Contact Form',
    description: 'Contact form with validation',
    requires: ['forms:builder'],
    tags: ['contact', 'form'],
    category: 'forms',
  },
  {
    id: 'calendar_scheduler',
    label: 'Calendar Scheduler',
    description: 'Appointment booking calendar',
    requires: ['calendar:scheduler'],
    optional: ['forms:builder'],
    tags: ['calendar', 'booking', 'scheduler'],
    category: 'forms',
  },
  {
    id: 'newsletter',
    label: 'Newsletter Signup',
    description: 'Email newsletter subscription',
    requires: ['forms:builder'],
    tags: ['newsletter', 'email'],
    category: 'forms',
  },
  {
    id: 'faq_accordion',
    label: 'FAQ Accordion',
    description: 'Expandable FAQ sections',
    requires: [],
    optional: ['search:site'],
    tags: ['faq', 'accordion'],
    category: 'content',
  },

  // E-commerce
  {
    id: 'product_gallery',
    label: 'Product Gallery',
    description: 'Product showcase with image gallery',
    requires: ['ecom:catalog', 'media:gallery'],
    optional: ['media:carousel'],
    tags: ['ecommerce', 'products', 'gallery'],
    category: 'ecommerce',
  },
  {
    id: 'filters_sidebar',
    label: 'Product Filters',
    description: 'Sidebar with product filtering options',
    requires: ['ecom:catalog', 'analytics:datatable'],
    optional: ['search:site'],
    tags: ['ecommerce', 'filters', 'search'],
    category: 'ecommerce',
  },
  {
    id: 'cart_drawer',
    label: 'Shopping Cart',
    description: 'Slide-out shopping cart drawer',
    requires: ['ecom:cart'],
    tags: ['ecommerce', 'cart'],
    category: 'ecommerce',
  },
  {
    id: 'checkout_progress',
    label: 'Checkout Progress',
    description: 'Multi-step checkout with progress indicator',
    requires: ['ecom:checkout', 'forms:payments'],
    tags: ['ecommerce', 'checkout', 'progress'],
    category: 'ecommerce',
  },

  // Content & Documentation
  {
    id: 'docs_sidebar',
    label: 'Documentation Sidebar',
    description: 'Nested navigation for documentation',
    requires: ['search:site'],
    optional: ['i18n'],
    tags: ['docs', 'navigation'],
    category: 'navigation',
  },
  {
    id: 'code_block',
    label: 'Code Block',
    description: 'Syntax-highlighted code examples',
    requires: [],
    tags: ['code', 'syntax', 'docs'],
    category: 'content',
  },
  {
    id: 'changelog_timeline',
    label: 'Changelog Timeline',
    description: 'Product updates in timeline format',
    requires: [],
    optional: ['search:site'],
    tags: ['changelog', 'timeline', 'updates'],
    category: 'content',
  },
  {
    id: 'featured_blog',
    label: 'Featured Blog Posts',
    description: 'Highlighted blog content',
    requires: ['media:image'],
    optional: ['search:site'],
    tags: ['blog', 'content'],
    category: 'content',
  },

  // Analytics & Data
  {
    id: 'dashboard_widgets',
    label: 'Dashboard Widgets',
    description: 'Data visualization widgets',
    requires: ['analytics:charts'],
    optional: ['analytics:datatable'],
    tags: ['dashboard', 'widgets', 'analytics'],
    category: 'data',
  },
  {
    id: 'analytics_charts',
    label: 'Analytics Charts',
    description: 'Interactive data charts',
    requires: ['analytics:charts'],
    tags: ['analytics', 'charts', 'data'],
    category: 'data',
  },
  {
    id: 'data_tables',
    label: 'Data Tables',
    description: 'Sortable, filterable data tables',
    requires: ['analytics:datatable'],
    tags: ['table', 'data', 'sorting'],
    category: 'data',
  },

  // Media & Visual
  {
    id: 'video_background',
    label: 'Video Background',
    description: 'Full-screen background video',
    requires: ['media:video'],
    tags: ['video', 'background', 'hero'],
    category: 'media',
  },
  {
    id: 'image_gallery',
    label: 'Image Gallery',
    description: 'Responsive image gallery with lightbox',
    requires: ['media:gallery'],
    optional: ['media:carousel'],
    tags: ['gallery', 'images', 'lightbox'],
    category: 'media',
  },
  {
    id: 'bento_grid',
    label: 'Bento Grid',
    description: 'Modern asymmetric grid layout',
    requires: ['media:image'],
    optional: ['media:video'],
    tags: ['bento', 'grid', 'modern'],
    category: 'media',
  },

  // Business & Team
  {
    id: 'team_grid',
    label: 'Team Grid',
    description: 'Team member profiles in grid layout',
    requires: ['media:image'],
    tags: ['team', 'profiles'],
    category: 'content',
  },
  {
    id: 'job_listings',
    label: 'Job Listings',
    description: 'Career opportunities with filters',
    requires: ['forms:builder'],
    optional: ['analytics:datatable', 'search:site'],
    tags: ['careers', 'jobs'],
    category: 'content',
  },
  {
    id: 'company_values',
    label: 'Company Values',
    description: 'Mission, vision, and values showcase',
    requires: [],
    optional: ['media:image'],
    tags: ['values', 'mission'],
    category: 'content',
  },

  // Navigation & Search
  {
    id: 'search_bar',
    label: 'Search Bar',
    description: 'Site-wide search functionality',
    requires: ['search:site'],
    tags: ['search', 'navigation'],
    category: 'navigation',
  },
  {
    id: 'search_results',
    label: 'Search Results',
    description: 'Search results with pagination',
    requires: ['search:site'],
    optional: ['analytics:datatable'],
    tags: ['search', 'results'],
    category: 'navigation',
  },

  // Location & Map
  {
    id: 'map_embed',
    label: 'Map Embed',
    description: 'Interactive map with locations',
    requires: ['map:embed'],
    tags: ['map', 'location'],
    category: 'media',
  },
  {
    id: 'locations',
    label: 'Office Locations',
    description: 'Multiple office locations with details',
    requires: [],
    optional: ['map:embed'],
    tags: ['locations', 'offices'],
    category: 'content',
  },

  // Authentication
  {
    id: 'auth_forms',
    label: 'Authentication Forms',
    description: 'Login and registration forms',
    requires: ['auth:accounts', 'forms:builder'],
    tags: ['auth', 'login', 'forms'],
    category: 'forms',
  },

  // Utility
  {
    id: 'cta_banner',
    label: 'CTA Banner',
    description: 'Call-to-action banner section',
    requires: [],
    optional: ['forms:builder'],
    tags: ['cta', 'banner'],
    category: 'content',
  },
  {
    id: 'error_state',
    label: 'Error State',
    description: '404 and error page content',
    requires: [],
    optional: ['search:site'],
    tags: ['error', '404'],
    category: 'utility',
  },
  {
    id: 'legal_body',
    label: 'Legal Content',
    description: 'Terms, privacy policy content',
    requires: [],
    tags: ['legal', 'terms'],
    category: 'content',
  },
];

export function getSectionById(id: SectionId): SectionMeta | undefined {
  return SECTIONS_META.find(section => section.id === id);
}

export function getSectionsByCategory(category: SectionMeta['category']): SectionMeta[] {
  return SECTIONS_META.filter(section => section.category === category);
}

export function getSectionsByTag(tag: string): SectionMeta[] {
  return SECTIONS_META.filter(section => section.tags?.includes(tag));
}

export function searchSections(query: string): SectionMeta[] {
  const lowercaseQuery = query.toLowerCase();
  return SECTIONS_META.filter(section => 
    section.label.toLowerCase().includes(lowercaseQuery) ||
    section.description.toLowerCase().includes(lowercaseQuery) ||
    section.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
// Template metadata with capability requirements
// Defines what each template supports and minimum plan requirements

import type { Capability, Plan } from '../capabilities';

export type LayoutId =
  | 'home' | 'landing' | 'about' | 'features' | 'pricing' | 'contact'
  | 'blog_index' | 'blog_post' | 'case_study'
  | 'docs' | 'changelog' | 'careers'
  | 'shop_list' | 'shop_product' | 'cart' | 'checkout'
  | 'dashboard' | 'auth' | 'legal' | 'search' | 'not_found'
  | 'testimonials' | 'faq' | 'team' | 'portfolio'
  | 'service_detail' | 'services_overview';

export interface TemplateMeta {
  id: LayoutId;
  label: string;
  description: string;
  recommendedSections: string[];     // default section lineup
  capabilities: Capability[];        // what this template supports
  minPlan: Plan;                     // minimum plan required
  category: 'marketing' | 'content' | 'ecommerce' | 'business' | 'utility';
}

export const TEMPLATES_META: TemplateMeta[] = [
  // Marketing Templates
  {
    id: 'home',
    label: 'Home / Landing',
    description: 'Complete homepage with hero, features, social proof, and CTAs',
    recommendedSections: ['hero_bento','logo_cloud','feature_comparison','stats','testimonials_marquee','cta_banner','featured_blog'],
    capabilities: ['media:image','media:video','media:carousel','analytics:charts','analytics:datatable','forms:builder','map:embed','search:site','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'marketing',
  },
  {
    id: 'landing',
    label: 'Landing Page',
    description: 'Campaign-focused conversion page with single goal',
    recommendedSections: ['hero_bento','benefits','proof','pricing_tiered','faq_accordion','cta_banner'],
    capabilities: ['media:image','media:video','forms:builder','forms:payments','analytics:charts','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'marketing',
  },
  {
    id: 'pricing',
    label: 'Pricing',
    description: 'Tiered pricing plans with features comparison',
    recommendedSections: ['hero_bento','pricing_tiered','feature_comparison','faq_accordion','cta_banner'],
    capabilities: ['forms:builder','forms:payments','media:image','analytics:datatable','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'marketing',
  },
  {
    id: 'features',
    label: 'Features',
    description: 'Product capabilities showcase with comparisons',
    recommendedSections: ['hero_bento','feature_grid','feature_comparison','integrations','cta_banner'],
    capabilities: ['media:image','media:video','analytics:datatable','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'marketing',
  },
  {
    id: 'about',
    label: 'About',
    description: 'Company story, mission, values, and team',
    recommendedSections: ['hero_bento','story','values','team','map_embed','cta_banner'],
    capabilities: ['media:image','media:video','map:embed','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'business',
  },
  {
    id: 'contact',
    label: 'Contact',
    description: 'Contact forms, info, and office locations',
    recommendedSections: ['hero_bento','contact_form','map_embed','locations','faq_accordion'],
    capabilities: ['forms:builder','map:embed','calendar:scheduler','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'business',
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    description: 'Customer reviews and social proof showcase',
    recommendedSections: ['hero_bento','testimonials_marquee','logo_cloud','stats','case_studies','cta_banner'],
    capabilities: ['media:image','media:video','analytics:charts','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'marketing',
  },

  // Content Templates
  {
    id: 'blog_index',
    label: 'Blog',
    description: 'Blog listing with categories and newsletter signup',
    recommendedSections: ['hero_bento','featured_blog','blog_categories','newsletter','cta_banner'],
    capabilities: ['media:image','search:site','forms:builder','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'content',
  },
  {
    id: 'blog_post',
    label: 'Blog Post',
    description: 'Individual blog post with sharing and related content',
    recommendedSections: ['post_hero','post_body','author_bio','share','related_posts','cta_banner'],
    capabilities: ['media:image','media:video','search:site','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'content',
  },
  {
    id: 'docs',
    label: 'Documentation',
    description: 'Technical docs with sidebar navigation and search',
    recommendedSections: ['hero_bento','docs_sidebar','code_block','search_bar'],
    capabilities: ['search:site','i18n','media:image','code:syntax','seo','ai:generate','ai:patch'],
    minPlan: 'pro',
    category: 'content',
  },
  {
    id: 'changelog',
    label: 'Changelog',
    description: 'Product updates and release notes timeline',
    recommendedSections: ['hero_bento','changelog_timeline','newsletter','cta_banner'],
    capabilities: ['media:image','search:site','forms:builder','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'content',
  },

  // E-commerce Templates
  {
    id: 'shop_list',
    label: 'Product Catalog',
    description: 'Product listing with filters and search',
    recommendedSections: ['hero_bento','filters_sidebar','product_gallery','pagination'],
    capabilities: ['ecom:catalog','media:image','media:gallery','analytics:datatable','search:site','seo','ai:generate','ai:patch'],
    minPlan: 'business',
    category: 'ecommerce',
  },
  {
    id: 'shop_product',
    label: 'Product Page',
    description: 'Detailed product view with gallery and reviews',
    recommendedSections: ['product_gallery','product_details','testimonials_marquee','related_products','cta_banner'],
    capabilities: ['ecom:catalog','ecom:cart','media:image','media:gallery','media:carousel','forms:builder','seo','ai:generate','ai:patch'],
    minPlan: 'business',
    category: 'ecommerce',
  },
  {
    id: 'cart',
    label: 'Shopping Cart',
    description: 'Cart review and quantity management',
    recommendedSections: ['cart_items','cart_summary','recommended_products'],
    capabilities: ['ecom:cart','ecom:checkout','media:image','seo','ai:generate','ai:patch'],
    minPlan: 'business',
    category: 'ecommerce',
  },
  {
    id: 'checkout',
    label: 'Checkout',
    description: 'Payment flow with progress indicator',
    recommendedSections: ['checkout_progress','billing_form','order_summary'],
    capabilities: ['ecom:checkout','forms:payments','auth:accounts','seo','ai:generate','ai:patch'],
    minPlan: 'business',
    category: 'ecommerce',
  },

  // Business Templates
  {
    id: 'services_overview',
    label: 'Services Overview',
    description: 'Service listing with pricing and booking',
    recommendedSections: ['hero_bento','service_grid','pricing_tiered','calendar:scheduler','testimonials_marquee','cta_banner'],
    capabilities: ['media:image','forms:builder','calendar:scheduler','analytics:charts','seo','ai:generate','ai:patch'],
    minPlan: 'pro',
    category: 'business',
  },
  {
    id: 'service_detail',
    label: 'Service Detail',
    description: 'Individual service with booking and case studies',
    recommendedSections: ['hero_bento','service_details','process_steps','pricing_tiered','case_studies','calendar:scheduler'],
    capabilities: ['media:image','media:video','calendar:scheduler','forms:builder','forms:payments','seo','ai:generate','ai:patch'],
    minPlan: 'business',
    category: 'business',
  },
  {
    id: 'case_study',
    label: 'Case Study',
    description: 'Detailed customer success story with metrics',
    recommendedSections: ['case_hero','problem','solution','results','testimonial_spotlight','cta_banner'],
    capabilities: ['media:image','media:video','analytics:charts','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'business',
  },
  {
    id: 'careers',
    label: 'Careers',
    description: 'Job listings with company culture and benefits',
    recommendedSections: ['hero_bento','company_values','benefits','job_listings','team','cta_banner'],
    capabilities: ['media:image','forms:builder','auth:accounts','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'business',
  },
  {
    id: 'team',
    label: 'Team',
    description: 'Team member profiles and company culture',
    recommendedSections: ['hero_bento','team_grid','company_culture','values','cta_banner'],
    capabilities: ['media:image','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'business',
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    description: 'Project showcase with categories and details',
    recommendedSections: ['hero_bento','project_grid','capabilities','process_steps','cta_banner'],
    capabilities: ['media:image','media:gallery','media:video','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'business',
  },

  // Utility Templates
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Analytics dashboard with widgets and charts',
    recommendedSections: ['dashboard_widgets','analytics_charts','data_tables'],
    capabilities: ['analytics:charts','analytics:datatable','auth:accounts','ai:generate','ai:patch'],
    minPlan: 'pro',
    category: 'utility',
  },
  {
    id: 'auth',
    label: 'Authentication',
    description: 'Sign in/up forms with social login',
    recommendedSections: ['auth_forms','benefits','security_features'],
    capabilities: ['auth:accounts','forms:builder','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'utility',
  },
  {
    id: 'search',
    label: 'Search Results',
    description: 'Search functionality with filters and results',
    recommendedSections: ['search_bar','search_results','search_filters','cta_banner'],
    capabilities: ['search:site','analytics:datatable','seo','ai:generate','ai:patch'],
    minPlan: 'pro',
    category: 'utility',
  },
  {
    id: 'legal',
    label: 'Legal Pages',
    description: 'Terms, privacy policy, and legal documents',
    recommendedSections: ['legal_hero','legal_body','contact_info'],
    capabilities: ['seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'utility',
  },
  {
    id: 'not_found',
    label: '404 Error',
    description: 'Error page with helpful navigation',
    recommendedSections: ['error_state','popular_pages','search_bar','cta_banner'],
    capabilities: ['search:site','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'utility',
  },
  {
    id: 'faq',
    label: 'FAQ',
    description: 'Frequently asked questions with search',
    recommendedSections: ['hero_bento','faq_accordion','search_bar','contact_info'],
    capabilities: ['search:site','forms:builder','seo','ai:generate','ai:patch'],
    minPlan: 'free',
    category: 'utility',
  },
];

export function getTemplateById(id: LayoutId): TemplateMeta | undefined {
  return TEMPLATES_META.find(template => template.id === id);
}

export function getTemplatesByCategory(category: TemplateMeta['category']): TemplateMeta[] {
  return TEMPLATES_META.filter(template => template.category === category);
}

export function getTemplatesByPlan(plan: Plan): TemplateMeta[] {
  const planOrder: Plan[] = ['free', 'pro', 'business', 'enterprise'];
  const userPlanIndex = planOrder.indexOf(plan);
  
  return TEMPLATES_META.filter(template => {
    const templatePlanIndex = planOrder.indexOf(template.minPlan);
    return templatePlanIndex <= userPlanIndex;
  });
}
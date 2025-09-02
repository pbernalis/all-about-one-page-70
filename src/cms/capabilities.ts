// Capability-driven system for template features and sections
// Defines what features are available per plan and their dependencies

export type Capability =
  | 'media:image'
  | 'media:video'
  | 'media:gallery'
  | 'media:carousel'
  | 'calendar:scheduler'
  | 'calendar:events'
  | 'forms:builder'
  | 'forms:payments'
  | 'map:embed'
  | 'analytics:charts'
  | 'analytics:datatable'
  | 'ecom:catalog'
  | 'ecom:cart'
  | 'ecom:checkout'
  | 'auth:accounts'
  | 'search:site'
  | 'code:syntax'
  | 'i18n'
  | 'seo'
  | 'ai:generate'
  | 'ai:patch';

export type Plan = 'free' | 'pro' | 'business' | 'enterprise';

export interface FeatureGate {
  plans: Plan[];                 // which plans unlock this capability
  deps?: Capability[];           // prerequisites
}

export const FEATURE_GATES: Record<Capability, FeatureGate> = {
  'media:image':           { plans: ['free','pro','business','enterprise'] },
  'media:video':           { plans: ['pro','business','enterprise'] },
  'media:gallery':         { plans: ['pro','business','enterprise'], deps:['media:image'] },
  'media:carousel':        { plans: ['pro','business','enterprise'], deps:['media:image'] },
  'calendar:scheduler':    { plans: ['business','enterprise'] },
  'calendar:events':       { plans: ['pro','business','enterprise'] },
  'forms:builder':         { plans: ['free','pro','business','enterprise'] },
  'forms:payments':        { plans: ['business','enterprise'], deps:['forms:builder'] },
  'map:embed':             { plans: ['pro','business','enterprise'] },
  'analytics:charts':      { plans: ['pro','business','enterprise'] },
  'analytics:datatable':   { plans: ['pro','business','enterprise'] },
  'ecom:catalog':          { plans: ['business','enterprise'] },
  'ecom:cart':             { plans: ['business','enterprise'], deps:['ecom:catalog'] },
  'ecom:checkout':         { plans: ['business','enterprise'], deps:['ecom:cart'] },
  'auth:accounts':         { plans: ['free','pro','business','enterprise'] },
  'search:site':           { plans: ['pro','business','enterprise'] },
  'code:syntax':           { plans: ['free','pro','business','enterprise'] },
  'i18n':                  { plans: ['pro','business','enterprise'] },
  'seo':                   { plans: ['free','pro','business','enterprise'] },
  'ai:generate':           { plans: ['free','pro','business','enterprise'] },
  'ai:patch':              { plans: ['free','pro','business','enterprise'], deps:['ai:generate'] },
};

export function resolveCapabilities(plan: Plan): Set<Capability> {
  const out = new Set<Capability>();
  for (const [cap, gate] of Object.entries(FEATURE_GATES) as [Capability,FeatureGate][]) {
    if (gate.plans.includes(plan)) {
      out.add(cap);
      // Auto-include dependencies
      (gate.deps ?? []).forEach(d => out.add(d));
    }
  }
  return out;
}

export function getCapabilityLabel(cap: Capability): string {
  const labels: Record<Capability, string> = {
    'media:image': 'Images',
    'media:video': 'Video',
    'media:gallery': 'Gallery',
    'media:carousel': 'Carousel',
    'calendar:scheduler': 'Scheduler',
    'calendar:events': 'Calendar Events',
    'forms:builder': 'Form Builder',
    'forms:payments': 'Payments',
    'map:embed': 'Maps',
    'analytics:charts': 'Charts',
    'analytics:datatable': 'Data Tables',
    'ecom:catalog': 'Product Catalog',
    'ecom:cart': 'Shopping Cart',
    'ecom:checkout': 'Checkout',
    'auth:accounts': 'User Accounts',
    'search:site': 'Site Search',
    'code:syntax': 'Code Syntax',
    'i18n': 'Internationalization',
    'seo': 'SEO',
    'ai:generate': 'AI Generate',
    'ai:patch': 'AI Patch',
  };
  return labels[cap] || cap;
}

export function getMinPlanForCapability(cap: Capability): Plan {
  const gate = FEATURE_GATES[cap];
  const planOrder: Plan[] = ['free', 'pro', 'business', 'enterprise'];
  return gate.plans.sort((a, b) => planOrder.indexOf(a) - planOrder.indexOf(b))[0];
}
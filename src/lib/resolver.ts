// Layout seeds and content merging utilities

// Default layout seeds - baseline data for different section types
const layoutSeeds: Record<string, Record<string, any>> = {
  hero: {
    title: 'Welcome to Our Platform',
    subtitle: 'Transform your business with our innovative solutions',
    primaryCta: 'Get Started',
    secondaryCta: 'Learn More',
    backgroundColor: '#3b82f6'
  },
  features: {
    title: 'Powerful Features',
    subtitle: 'Everything you need to succeed',
    features: [
      { title: 'Feature One', description: 'Amazing capability that drives results' },
      { title: 'Feature Two', description: 'Innovative technology for modern needs' },
      { title: 'Feature Three', description: 'Seamless integration with existing tools' }
    ]
  },
  pricing: {
    title: 'Simple Pricing',
    subtitle: 'Choose the plan that fits your needs',
    plans: [
      {
        name: 'Starter',
        price: '$19',
        features: ['5 Projects', 'Basic Support', '10GB Storage']
      },
      {
        name: 'Professional',
        price: '$49',
        features: ['Unlimited Projects', 'Priority Support', '100GB Storage', 'Advanced Analytics']
      },
      {
        name: 'Enterprise',
        price: '$99',
        features: ['Everything in Pro', 'Custom Integrations', 'Dedicated Support', 'Unlimited Storage']
      }
    ]
  },
  testimonials: {
    title: 'Customer Success Stories',
    subtitle: 'See what our customers have to say',
    testimonials: [
      {
        quote: 'This platform transformed our workflow completely.',
        author: 'Sarah Chen',
        role: 'Product Manager, TechCorp'
      },
      {
        quote: 'Outstanding support and incredible results.',
        author: 'Michael Rodriguez',
        role: 'CEO, StartupXYZ'
      },
      {
        quote: 'The best investment we\'ve made for our business.',
        author: 'Emily Johnson',
        role: 'Operations Director, BigCo'
      }
    ]
  },
  contact: {
    title: 'Ready to Get Started?',
    subtitle: 'Contact us today and let\'s discuss your project',
    email: 'hello@company.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, Suite 100, City, State 12345'
  }
};

// Deep merge utility function
function deepMerge(target: any, source: any): any {
  if (typeof target !== 'object' || target === null) {
    return source;
  }
  
  if (typeof source !== 'object' || source === null) {
    return target;
  }

  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (Array.isArray(source[key])) {
        // For arrays, replace entirely with source array
        result[key] = [...source[key]];
      } else if (typeof source[key] === 'object' && source[key] !== null) {
        // For objects, recursively merge
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        // For primitives, use source value
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

/**
 * Resolves section data by merging layout seed with custom content
 * @param sectionKey - The canonical section key (hero, features, etc.)
 * @param customContent - Custom content data from schema.content[section]
 * @returns Merged data object for the section
 */
export function resolveSection(
  sectionKey: string, 
  customContent: Record<string, any> = {}
): Record<string, any> {
  const seed = layoutSeeds[sectionKey] || {};
  return deepMerge(seed, customContent);
}

/**
 * Resolves multiple sections at once
 * @param sections - Array of section keys
 * @param content - Content object with section-specific data
 * @returns Array of resolved section data
 */
export function resolveSections(
  sections: string[], 
  content: Record<string, any> = {}
): Array<{ key: string; data: Record<string, any> }> {
  return sections.map(sectionKey => ({
    key: sectionKey,
    data: resolveSection(sectionKey, content[sectionKey])
  }));
}

/**
 * Get layout seed for a specific section type
 * @param sectionKey - The canonical section key
 * @returns Default layout seed data
 */
export function getLayoutSeed(sectionKey: string): Record<string, any> {
  return layoutSeeds[sectionKey] || {};
}

/**
 * Check if a section type is supported
 * @param sectionKey - The section key to check
 * @returns Whether the section type has a layout seed
 */
export function isSupportedSection(sectionKey: string): boolean {
  return sectionKey in layoutSeeds;
}
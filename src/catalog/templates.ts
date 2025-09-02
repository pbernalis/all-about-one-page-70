// Template catalog with predefined layouts and content seeds

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  sections: string[];
  seeds: Record<string, any>;
}

export const templates: TemplateDefinition[] = [
  // === CORE MARKETING PAGES ===
  {
    id: 'home',
    name: 'Home',
    description: 'Main homepage with hero, value prop, and key features',
    sections: ['hero', 'features', 'proof', 'cta', 'contact'],
    seeds: {
      hero: { headline: 'Welcome to Your Success', subheadline: 'Transform your business with our innovative solutions', primaryCta: 'Get Started', secondaryCta: 'Learn More' },
      features: { title: 'Why Choose Us', items: [{ title: 'Fast', description: 'Lightning-fast performance' }, { title: 'Reliable', description: 'Dependable 24/7 service' }, { title: 'Secure', description: 'Enterprise-grade security' }] },
      proof: { title: 'Trusted by Industry Leaders', metrics: [{ label: 'Happy Customers', value: '10,000+' }, { label: 'Years Experience', value: '15+' }, { label: 'Success Rate', value: '99%' }] },
      cta: { title: 'Ready to Get Started?', subtitle: 'Join thousands of satisfied customers', buttons: [{ text: 'Start Today', href: '#contact' }] },
      contact: { title: 'Get in Touch', email: 'hello@company.com', phone: '+1 (555) 123-4567' }
    }
  },

  {
    id: 'about',
    name: 'About',
    description: 'Company story, mission, values, and team',
    sections: ['hero', 'story', 'values', 'team', 'cta'],
    seeds: {
      hero: { headline: 'Our Story', subheadline: 'Building the future through innovation and dedication' },
      story: { title: 'How We Started', content: 'Founded with a vision to transform industries through cutting-edge solutions...' },
      values: { title: 'Our Values', items: [{ title: 'Innovation', description: 'Pushing boundaries to create breakthrough solutions' }, { title: 'Integrity', description: 'Honest, transparent relationships with all stakeholders' }, { title: 'Excellence', description: 'Committed to delivering exceptional quality in everything we do' }] },
      team: { title: 'Meet Our Team', members: [{ name: 'John Smith', role: 'CEO & Founder', bio: 'Visionary leader with 15+ years experience' }, { name: 'Sarah Johnson', role: 'CTO', bio: 'Technology expert driving our innovation' }] },
      cta: { title: 'Want to Join Our Mission?', buttons: [{ text: 'View Careers', href: '/careers' }] }
    }
  },

  {
    id: 'services-overview',
    name: 'Services Overview',
    description: 'Complete list of services with pricing and FAQs',
    sections: ['hero', 'features', 'pricing', 'faq', 'contact'],
    seeds: {
      hero: { headline: 'Professional Services', subheadline: 'Comprehensive solutions tailored to your business needs' },
      features: { title: 'Our Services', items: [{ title: 'Consulting', description: 'Strategic guidance for growth' }, { title: 'Implementation', description: 'Expert execution of solutions' }, { title: 'Support', description: 'Ongoing maintenance and optimization' }] },
      pricing: { title: 'Service Packages', plans: [{ name: 'Basic', price: '$299', features: ['Initial consultation', 'Basic implementation', 'Email support'] }, { name: 'Premium', price: '$599', features: ['Everything in Basic', 'Priority support', 'Custom solutions'] }] },
      faq: { title: 'Frequently Asked Questions', items: [{ q: 'How long does implementation take?', a: 'Typically 2-4 weeks depending on complexity.' }, { q: 'Do you offer ongoing support?', a: 'Yes, we provide comprehensive support packages.' }] },
      contact: { title: 'Ready to Start?', email: 'services@company.com', phone: '+1 (555) 123-4567' }
    }
  },

  {
    id: 'service-detail',
    name: 'Service Detail',
    description: 'Deep dive into a specific service offering',
    sections: ['hero', 'feature-detail', 'process', 'pricing', 'testimonials', 'cta'],
    seeds: {
      hero: { headline: 'Digital Transformation Service', subheadline: 'Complete modernization of your business processes' },
      'feature-detail': { title: 'What\'s Included', bullets: ['Full digital audit', 'Technology roadmap', 'Implementation support', '6-month optimization'] },
      process: { title: 'Our Process', steps: [{ title: 'Discovery', description: 'Understanding your current state' }, { title: 'Strategy', description: 'Creating your transformation plan' }, { title: 'Execution', description: 'Implementing the solution' }] },
      pricing: { title: 'Investment', plans: [{ name: 'Standard', price: '$15,000', features: ['Complete audit', '3-month implementation', 'Basic support'] }] },
      testimonials: { title: 'Success Stories', testimonials: [{ text: 'Transformed our entire operation in 90 days', author: 'CEO, TechCorp' }] },
      cta: { title: 'Ready to Transform?', buttons: [{ text: 'Get Quote', href: '#contact' }] }
    }
  },

  {
    id: 'features',
    name: 'Features',
    description: 'Product capability showcase with comparisons',
    sections: ['hero', 'feature-grid', 'comparisons', 'integrations', 'cta'],
    seeds: {
      hero: { headline: 'Powerful Features', subheadline: 'Everything you need to succeed in one platform' },
      'feature-grid': { title: 'Core Capabilities', items: [{ title: 'Analytics', description: 'Real-time insights and reporting' }, { title: 'Automation', description: 'Streamline your workflows' }, { title: 'Integration', description: 'Connect with your favorite tools' }] },
      comparisons: { title: 'Feature Comparison', rows: [{ feature: 'Advanced Analytics', us: true, competitor: false }, { feature: 'API Access', us: true, competitor: 'Limited' }] },
      integrations: { title: 'Integrations', items: [{ name: 'Slack', description: 'Team communication' }, { name: 'Salesforce', description: 'CRM integration' }] },
      cta: { title: 'Experience All Features', buttons: [{ text: 'Start Free Trial', href: '#signup' }] }
    }
  },

  {
    id: 'pricing',
    name: 'Pricing',
    description: 'Plans, pricing, and frequently asked questions',
    sections: ['hero', 'pricing', 'faq', 'cta'],
    seeds: {
      hero: { headline: 'Simple, Transparent Pricing', subheadline: 'Choose the plan that fits your needs' },
      pricing: { title: 'Our Plans', plans: [{ name: 'Starter', price: '$29', period: '/month', features: ['Basic features', '5 users', 'Email support'] }, { name: 'Pro', price: '$99', period: '/month', features: ['All features', 'Unlimited users', 'Priority support'] }] },
      faq: { title: 'Pricing FAQ', items: [{ q: 'Can I change plans anytime?', a: 'Yes, upgrade or downgrade at any time.' }, { q: 'Is there a free trial?', a: '14-day free trial, no credit card required.' }] },
      cta: { title: 'Start Your Free Trial', buttons: [{ text: 'Get Started', href: '#signup' }] }
    }
  },

  {
    id: 'contact',
    name: 'Contact',
    description: 'Contact form, information, and locations',
    sections: ['hero', 'contact', 'locations', 'faq'],
    seeds: {
      hero: { headline: 'Get in Touch', subheadline: 'We\'d love to hear from you and discuss your needs' },
      contact: { title: 'Contact Information', form: { fields: ['Name', 'Email', 'Message'], button: { text: 'Send Message' } }, info: { phone: '+1 (555) 123-4567', email: 'hello@company.com', address: '123 Business St, City, State 12345' } },
      locations: { title: 'Our Offices', items: [{ label: 'Headquarters', address: '123 Main St, City, State', mapUrl: '#' }, { label: 'Regional Office', address: '456 Branch Ave, City, State', mapUrl: '#' }] },
      faq: { title: 'Contact FAQ', items: [{ q: 'What are your business hours?', a: 'Monday-Friday, 9 AM - 6 PM EST' }, { q: 'How quickly do you respond?', a: 'We aim to respond within 24 hours.' }] }
    }
  },

  {
    id: 'testimonials',
    name: 'Testimonials',
    description: 'Customer reviews, social proof, and success metrics',
    sections: ['hero', 'testimonials', 'logos', 'metrics', 'cta'],
    seeds: {
      hero: { headline: 'What Our Customers Say', subheadline: 'Real stories from real customers' },
      testimonials: { title: 'Customer Reviews', testimonials: [{ text: 'Outstanding service and results beyond expectations', author: 'Sarah Chen', role: 'Marketing Director' }, { text: 'The best investment we\'ve made for our business', author: 'Mike Johnson', role: 'CEO' }] },
      logos: { title: 'Trusted By', items: ['company-1.png', 'company-2.png', 'company-3.png'] },
      metrics: { title: 'Proven Results', metrics: [{ label: 'Customer Satisfaction', value: '98%' }, { label: 'Average ROI', value: '300%' }] },
      cta: { title: 'Join Our Success Stories', buttons: [{ text: 'Get Started', href: '#contact' }] }
    }
  },

  {
    id: 'case-study',
    name: 'Case Study',
    description: 'Detailed customer success story with results',
    sections: ['hero', 'problem', 'solution', 'results', 'testimonial-spotlight', 'cta'],
    seeds: {
      hero: { headline: 'TechCorp Success Story', subheadline: 'How we helped TechCorp increase revenue by 300%' },
      problem: { title: 'The Challenge', content: 'TechCorp was struggling with inefficient processes and declining productivity...' },
      solution: { title: 'Our Solution', content: 'We implemented a comprehensive digital transformation strategy...' },
      results: { title: 'The Results', metrics: [{ label: 'Revenue Increase', value: '300%' }, { label: 'Time Saved', value: '15 hours/week' }] },
      'testimonial-spotlight': { quote: 'The transformation exceeded all our expectations', author: 'John Smith', role: 'CEO, TechCorp' },
      cta: { title: 'Ready for Similar Results?', buttons: [{ text: 'Start Your Project', href: '#contact' }] }
    }
  },

  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Campaign-focused single-goal conversion page',
    sections: ['hero', 'benefits', 'proof', 'pricing', 'faq', 'cta'],
    seeds: {
      hero: { headline: 'Double Your Sales in 90 Days', subheadline: 'Proven system used by 1000+ businesses', primaryCta: 'Get Started Now' },
      benefits: { title: 'What You Get', items: [{ title: 'Proven System', description: 'Step-by-step blueprint for success' }, { title: 'Expert Support', description: 'Personal guidance throughout' }] },
      proof: { title: 'Real Results', metrics: [{ label: 'Success Rate', value: '94%' }, { label: 'Average Increase', value: '180%' }] },
      pricing: { title: 'Special Offer', plans: [{ name: 'Complete System', price: '$497', features: ['Full training program', 'Templates & tools', '90-day support'] }] },
      faq: { title: 'Common Questions', items: [{ q: 'How long does it take?', a: 'Most see results within 30 days.' }] },
      cta: { title: 'Limited Time Offer', buttons: [{ text: 'Claim Your Spot', href: '#order' }] }
    }
  },

  // === CONTENT PAGES ===
  {
    id: 'blog-index',
    name: 'Blog',
    description: 'Blog listing with newsletter signup',
    sections: ['hero', 'blog-list', 'newsletter', 'cta'],
    seeds: {
      hero: { headline: 'Our Blog', subheadline: 'Insights, tips, and industry updates' },
      'blog-list': { title: 'Latest Posts', posts: [{ title: 'Getting Started Guide', slug: 'getting-started', excerpt: 'Everything you need to know', date: '2024-01-15' }, { title: 'Best Practices', slug: 'best-practices', excerpt: 'Tips from the experts', date: '2024-01-10' }] },
      newsletter: { title: 'Stay Updated', subtitle: 'Get the latest posts delivered to your inbox', placeholder: 'Enter your email', ctaText: 'Subscribe' },
      cta: { title: 'Need Expert Help?', buttons: [{ text: 'Contact Us', href: '/contact' }] }
    }
  },

  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Individual blog post with author bio and sharing',
    sections: ['post-hero', 'post-body', 'author-bio', 'share', 'related-posts', 'cta'],
    seeds: {
      'post-hero': { title: 'How to Boost Your Productivity', date: '2024-01-15', author: { name: 'Jane Doe', avatar: '/author.jpg' } },
      'post-body': { content: 'Productivity is key to success. Here are proven strategies...' },
      'author-bio': { name: 'Jane Doe', bio: 'Productivity expert and bestselling author', links: [{ label: 'Twitter', href: '#' }] },
      share: { title: 'Share This Post', links: [{ label: 'Twitter', href: '#' }, { label: 'LinkedIn', href: '#' }] },
      'related-posts': { title: 'Related Articles', posts: [{ title: 'Time Management Tips', slug: 'time-management', excerpt: 'Master your schedule' }] },
      cta: { title: 'Want More Tips?', buttons: [{ text: 'Subscribe to Newsletter', href: '#newsletter' }] }
    }
  },

  {
    id: 'faq',
    name: 'FAQ',
    description: 'Comprehensive frequently asked questions',
    sections: ['hero', 'faq', 'contact'],
    seeds: {
      hero: { headline: 'Frequently Asked Questions', subheadline: 'Find answers to common questions' },
      faq: { title: 'Common Questions', items: [{ q: 'How do I get started?', a: 'Simply sign up and follow our onboarding process.' }, { q: 'What support do you offer?', a: 'We provide 24/7 email support and live chat during business hours.' }] },
      contact: { title: 'Still Have Questions?', subtitle: 'Our team is here to help', email: 'support@company.com', phone: '+1 (555) 123-4567' }
    }
  },

  {
    id: 'careers',
    name: 'Careers',
    description: 'Company culture, benefits, and job listings',
    sections: ['hero', 'values', 'benefits', 'job-listings', 'cta'],
    seeds: {
      hero: { headline: 'Join Our Team', subheadline: 'Build your career with industry-leading innovators' },
      values: { title: 'Our Culture', items: [{ title: 'Innovation', description: 'Encouraging creative thinking' }, { title: 'Growth', description: 'Continuous learning opportunities' }] },
      benefits: { title: 'Benefits & Perks', items: [{ title: 'Health Insurance', description: 'Comprehensive medical coverage' }, { title: 'Flexible Hours', description: 'Work-life balance' }] },
      'job-listings': { title: 'Open Positions', jobs: [{ title: 'Software Engineer', location: 'Remote', type: 'Full-time', link: '#apply' }, { title: 'Product Manager', location: 'San Francisco', type: 'Full-time', link: '#apply' }] },
      cta: { title: 'Ready to Apply?', buttons: [{ text: 'View All Jobs', href: '#jobs' }] }
    }
  },

  {
    id: 'team',
    name: 'Team',
    description: 'Team members and company culture',
    sections: ['hero', 'team', 'culture', 'cta'],
    seeds: {
      hero: { headline: 'Meet Our Team', subheadline: 'The passionate people behind our success' },
      team: { title: 'Leadership Team', members: [{ name: 'John Smith', role: 'CEO', bio: 'Visionary leader with 15 years experience', avatar: '/team-1.jpg' }, { name: 'Sarah Johnson', role: 'CTO', bio: 'Technology innovator and expert', avatar: '/team-2.jpg' }] },
      culture: { title: 'Our Culture', content: 'We believe in fostering creativity, collaboration, and continuous growth...' },
      cta: { title: 'Want to Join Us?', buttons: [{ text: 'View Careers', href: '/careers' }] }
    }
  },

  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Project showcase and capabilities',
    sections: ['hero', 'project-grid', 'capabilities', 'cta'],
    seeds: {
      hero: { headline: 'Our Work', subheadline: 'Explore our latest projects and success stories' },
      'project-grid': { title: 'Featured Projects', projects: [{ title: 'E-commerce Platform', image: '/project-1.jpg', link: '#', tags: ['Web Development', 'E-commerce'] }, { title: 'Mobile App', image: '/project-2.jpg', link: '#', tags: ['Mobile', 'iOS', 'Android'] }] },
      capabilities: { title: 'What We Do', items: [{ title: 'Web Development', description: 'Modern, responsive websites' }, { title: 'Mobile Apps', description: 'Native and cross-platform solutions' }] },
      cta: { title: 'Start Your Project', buttons: [{ text: 'Get Quote', href: '/contact' }] }
    }
  },

  // === UTILITY PAGES ===
  {
    id: 'auth',
    name: 'Authentication',
    description: 'Sign in/up forms with benefits',
    sections: ['auth-forms', 'benefits', 'faq'],
    seeds: {
      'auth-forms': { title: 'Welcome Back', subtitle: 'Sign in to your account or create a new one' },
      benefits: { title: 'Why Join Us?', items: [{ title: 'Exclusive Content', description: 'Access premium features' }, { title: 'Personalized Experience', description: 'Tailored to your needs' }] },
      faq: { title: 'Account Questions', items: [{ q: 'Is my data secure?', a: 'Yes, we use enterprise-grade security.' }] }
    }
  },

  {
    id: 'legal',
    name: 'Legal',
    description: 'Terms, privacy policy, and legal documents',
    sections: ['legal-body'],
    seeds: {
      'legal-body': { title: 'Privacy Policy', content: 'Last updated: January 1, 2024\n\nThis privacy policy describes how we collect, use, and protect your information...' }
    }
  },

  {
    id: 'not-found',
    name: '404 Page',
    description: 'Error page with helpful navigation',
    sections: ['empty-state', 'cta'],
    seeds: {
      'empty-state': { title: 'Page Not Found', description: 'The page you\'re looking for doesn\'t exist or has been moved.', cta: { text: 'Go Home', href: '/' } },
      cta: { title: 'Popular Pages', buttons: [{ text: 'Home', href: '/' }, { text: 'Services', href: '/services' }, { text: 'Contact', href: '/contact' }] }
    }
  },

  {
    id: 'search',
    name: 'Search Results',
    description: 'Search functionality with results',
    sections: ['search-bar', 'search-results', 'cta'],
    seeds: {
      'search-bar': { placeholder: 'Search our site...', title: 'Search Results' },
      'search-results': { title: 'Results', items: [{ title: 'Getting Started Guide', snippet: 'Learn how to get started with our platform...', href: '/blog/getting-started' }] },
      cta: { title: 'Need Help?', buttons: [{ text: 'Contact Support', href: '/contact' }] }
    }
  }
];

// Helper functions
export function getTemplateById(id: string): TemplateDefinition | undefined {
  return templates.find(template => template.id === id);
}

export function getTemplateNames(): Array<{ id: string; name: string; description: string }> {
  return templates.map(({ id, name, description }) => ({ id, name, description }));
}

export function getTemplateSections(templateId: string): string[] {
  const template = getTemplateById(templateId);
  return template ? template.sections : [];
}

export function getTemplateSeeds(templateId: string): Record<string, any> {
  const template = getTemplateById(templateId);
  return template ? template.seeds : {};
}
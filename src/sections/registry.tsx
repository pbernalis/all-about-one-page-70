// src/sections/registry.tsx
import React from 'react';
import type { SectionId } from "@/cms/sections/ids";

// Import section components from organized files
import {
  FeatureDetailSection,
  FeatureGridSection,
  ProcessSection,
  ComparisonsSection
} from './FeatureSections';

import {
  IntegrationsSection,
  LocationsSection,
  MetricsSection,
  BenefitsSection
} from './BusinessSections';

import {
  ProblemSection,
  SolutionSection,
  ResultsSection,
  TestimonialSpotlightSection,
  ProofSection
} from './ContentSections';

import {
  BlogListSection,
  NewsletterSection,
  PostHeroSection,
  AuthorBioSection,
  ShareSection,
  RelatedPostsSection
} from './BlogSections';

import {
  JobListingsSection,
  CultureSection,
  ProjectGridSection,
  CapabilitiesSection,
  AuthFormsSection,
  LegalBodySection,
  EmptyStateSection,
  SearchBarSection,
  SearchResultsSection
} from './UtilitySections';

export type NormalizedTheme = {
  colorPrimary: string;
  radiusPx: number;
  spacingBase: number;
};

export interface SectionProps {
  data: Record<string, any>;
  theme: NormalizedTheme;
}

// Enhanced Hero Section with cutting-edge design
const HeroSection: React.FC<SectionProps> = ({ data }) => (
  <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
    {/* Animated background mesh */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.03)_2px,transparent_2px)] bg-[length:60px_60px]"></div>
    </div>
    
    {/* Floating elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>
    
    <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
      <div className="animate-fade-in">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-none">
          <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            {data.title || "Build the Future"}
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-muted-foreground/90 leading-relaxed">
          {data.subtitle || "Create extraordinary experiences with cutting-edge technology and beautiful design."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary-glow text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25">
            <span className="relative z-10">{data.cta || "Get Started"}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </button>
          
          <button className="group px-8 py-4 border-2 border-primary/20 text-primary rounded-2xl font-semibold text-lg transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
            <span className="flex items-center gap-2">
              {data.secondaryCta || "Learn More"}
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection: React.FC<SectionProps> = ({ data }) => {
  const items = data.items || [];
  const title = data.title || "Powerful Features";
  const subtitle = data.subtitle || "Everything you need to succeed";
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: any, i: number) => (
            <div 
              key={i} 
              className="group relative p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent"></div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-primary-glow transition-colors duration-300">
                  {item.title || `Feature ${i + 1}`}
                </h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {item.desc || "Powerful feature that helps you achieve your goals faster and more efficiently."}
                </p>
                
                {/* Arrow indicator */}
                <div className="mt-6 flex items-center text-primary/60 group-hover:text-primary transition-colors duration-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection: React.FC<SectionProps> = ({ data }) => (
  <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)] bg-[hsl(var(--theme-primary))]/10">
    <div className="max-w-4xl mx-auto text-center">
      <h3 className="text-3xl font-bold mb-4 text-[hsl(var(--theme-primary))]">
        {data.text || "Ready to get started?"}
      </h3>
      <button className="bg-[hsl(var(--theme-primary))] hover:bg-[hsl(var(--theme-primary-dark))] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
        {data.button || "Get Started"}
      </button>
    </div>
  </section>
);

const StorySection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Our Story";
  const paragraphs = data.paragraphs || [
    "We started with a simple mission — help teams launch faster with AI.",
  ];
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-[hsl(var(--theme-primary))]">{title}</h2>
        {paragraphs.map((p: string, i: number) => (
          <p key={i} className="text-lg mb-4 text-foreground opacity-90">{p}</p>
        ))}
      </div>
    </section>
  );
};

const ValuesSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Our Values";
  const items = data.items || [
    { title: "Integrity", desc: "We do the right thing." },
    { title: "Speed", desc: "We ship and learn quickly." },
    { title: "Innovation", desc: "We embrace new technologies." },
  ];
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[hsl(var(--theme-primary))]">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item: any, i: number) => (
            <div key={i} className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-3 text-[hsl(var(--theme-primary))]">
                {item.title || `Value ${i + 1}`}
              </h3>
              <p className="text-muted-foreground">{item.desc || "Description"}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TeamSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Meet the Team";
  const members = data.members || [
    { name: "Alex", role: "CEO" },
    { name: "Dana", role: "Engineer" },
    { name: "Sam", role: "Designer" },
  ];
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[hsl(var(--theme-primary))]">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member: any, i: number) => (
            <div key={i} className="p-6 rounded-lg border bg-card text-center">
              <div className="w-16 h-16 bg-[hsl(var(--theme-primary))]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-[hsl(var(--theme-primary))] font-semibold text-lg">
                  {(member.name || "M")[0]}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{member.name || "Member"}</h3>
              <p className="text-muted-foreground">{member.role || "Role"}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingTieredSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Choose Your Plan";
  const subtitle = data.subtitle || "Transparent pricing that scales with your business";
  const tiers = data.tiers || [
    { name: "Starter", price: "€19", period: "month", features: ["Up to 10 projects", "Basic analytics", "Email support", "5GB storage"], cta: "Start Free Trial", popular: false },
    { name: "Pro", price: "€49", period: "month", features: ["Unlimited projects", "Advanced analytics", "Priority support", "50GB storage", "Custom integrations"], cta: "Get Started", popular: true },
    { name: "Enterprise", price: "€99", period: "month", features: ["Everything in Pro", "Dedicated support", "Custom solutions", "Unlimited storage", "SLA guarantee"], cta: "Contact Sales", popular: false },
  ];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier: any, i: number) => (
            <div 
              key={i} 
              className={`relative group ${tier.popular ? 'scale-105 z-10' : ''}`}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className={`relative p-8 rounded-3xl transition-all duration-500 hover:scale-105 ${
                tier.popular 
                  ? 'bg-gradient-to-br from-primary/10 via-card to-accent/10 border-2 border-primary/30 shadow-2xl shadow-primary/20' 
                  : 'bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/20 hover:shadow-xl'
              }`}>
                {/* Glow effect for popular */}
                {tier.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-3xl blur-xl opacity-50"></div>
                )}
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-primary">{tier.name}</h3>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-5xl font-bold text-foreground">{tier.price}</span>
                      <span className="text-lg text-muted-foreground ml-2">/{tier.period}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {(tier.features || []).map((feature: string, fi: number) => (
                      <li key={fi} className="flex items-center text-muted-foreground">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-accent p-1 mr-3 flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="group-hover:text-foreground transition-colors duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/25 hover:scale-105'
                      : 'bg-primary/10 text-primary border-2 border-primary/20 hover:bg-primary hover:text-white hover:border-primary'
                  }`}>
                    {tier.cta || "Get Started"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className="text-center mt-12 text-muted-foreground">
          <p className="mb-4">✓ 30-day money-back guarantee</p>
          <p>✓ No setup fees • Cancel anytime</p>
        </div>
      </div>
    </section>
  );
};

const FaqAccordionSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Frequently Asked Questions";
  const items = data.items || [
    { q: "How do I get started?", a: "Create a page and describe your idea." },
    { q: "Can I change the layout?", a: "Yes, at any time." },
    { q: "Is there customer support?", a: "Yes, we provide email and chat support." },
  ];
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[hsl(var(--theme-primary))]">{title}</h2>
        <div className="space-y-4">
          {items.map((item: any, i: number) => (
            <div key={i} className="p-4 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2 text-[hsl(var(--theme-primary))]">{item.q}</h3>
              <p className="text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "What Our Customers Say";
  const subtitle = data.subtitle || "Real stories from our satisfied customers";
  const items = data.items || [];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/5 to-background"></div>
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: any, i: number) => (
            <div 
              key={i} 
              className="group relative p-8 rounded-3xl bg-card/60 backdrop-blur-sm border border-border/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Star rating */}
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, si) => (
                    <svg key={si} className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-lg text-muted-foreground leading-relaxed mb-6 group-hover:text-foreground/90 transition-colors duration-300">
                  "{item.text || "This solution has completely transformed our workflow. Highly recommended for any business looking to scale efficiently."}"
                </blockquote>
                
                {/* Customer info */}
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                      {(item.name || "A")[0]}
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-primary group-hover:text-primary-glow transition-colors duration-300">
                      {item.name || "Alex Johnson"}
                    </p>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                      {item.role || "CEO"} • {item.company || "TechCorp"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LogoCloudSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Trusted by Leading Companies";
  const subtitle = data.subtitle || "Join thousands of companies that trust our platform";
  const logos = data.logos || [];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        {/* Animated logo grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {logos.map((logo: any, i: number) => (
            <div 
              key={i} 
              className="group relative p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:border-primary/30"
              style={{ animationDelay: `${i * 75}ms` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                {/* Logo */}
                <div className="w-16 h-16 mb-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                </div>
                
                <p className="text-sm font-semibold text-primary group-hover:text-primary-glow transition-colors duration-300">
                  {logo.name || `Company ${i + 1}`}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 text-muted-foreground">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span>SOC 2 Compliant</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span>GDPR Ready</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span>99.9% SLA</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Create comprehensive section registry
type SectionComponent = React.FC<SectionProps>;
const registry: Record<string, SectionComponent> = {
  // Core sections
  hero: HeroSection,
  features: FeaturesSection,
  cta: CTASection,
  story: StorySection,
  values: ValuesSection,
  team: TeamSection,
  pricing_tiered: PricingTieredSection,
  faq_accordion: FaqAccordionSection,
  testimonials: TestimonialsSection,
  logo_cloud: LogoCloudSection,
  
  // Feature sections
  'feature-detail': FeatureDetailSection,
  'feature-grid': FeatureGridSection,
  process: ProcessSection,
  comparisons: ComparisonsSection,
  
  // Business sections
  integrations: IntegrationsSection,
  locations: LocationsSection,
  logos: IntegrationsSection, // alias
  metrics: MetricsSection,
  benefits: BenefitsSection,
  
  // Content sections
  problem: ProblemSection,
  solution: SolutionSection,
  results: ResultsSection,
  'testimonial-spotlight': TestimonialSpotlightSection,
  proof: ProofSection,
  
  // Blog sections
  'blog-list': BlogListSection,
  newsletter: NewsletterSection,
  'post-hero': PostHeroSection,
  'post-body': PostHeroSection, // reuse for now
  'author-bio': AuthorBioSection,
  share: ShareSection,
  'related-posts': RelatedPostsSection,
  
  // Utility sections
  'job-listings': JobListingsSection,
  culture: CultureSection,
  'project-grid': ProjectGridSection,
  capabilities: CapabilitiesSection,
  'auth-forms': AuthFormsSection,
  'legal-body': LegalBodySection,
  'empty-state': EmptyStateSection,
  'search-bar': SearchBarSection,
  'search-results': SearchResultsSection,
  
  // Common aliases
  pricing: PricingTieredSection,
  faq: FaqAccordionSection,
  contact: CTASection,
};

export function getSectionComponent(id: string): SectionComponent | undefined {
  return registry[id as SectionId];
}

export const sectionRegistry = registry;


import React from 'react';
import type { SectionProps } from './registry';

export const ProblemSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "The Challenge We Solve";
  const subtitle = data.subtitle || "Understanding the pain points that matter";
  const description = data.description || "Many businesses struggle with outdated processes that slow down growth and limit potential.";
  const problems = data.problems || [
    { title: "Inefficient Workflows", impact: "60% time waste" },
    { title: "Manual Processes", impact: "High error rates" },
    { title: "Poor Integration", impact: "Data silos" }
  ];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-background to-orange-50 dark:from-red-950/10 dark:via-background dark:to-orange-950/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {description}
            </p>
            
            <div className="space-y-6">
              {problems.map((problem: any, i: number) => (
                <div 
                  key={i} 
                  className="group flex items-start space-x-4 p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-red-200/50 hover:border-red-300/50 transition-all duration-300"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-red-600 transition-colors duration-300">
                      {problem.title}
                    </h3>
                    <p className="text-red-600 font-medium text-sm">
                      Impact: {problem.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-3xl border border-red-200/50 flex items-center justify-center">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const SolutionSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Our Revolutionary Solution";
  const subtitle = data.subtitle || "Transforming challenges into opportunities";
  const description = data.description || "We've developed a comprehensive platform that eliminates inefficiencies and unlocks your team's potential.";
  const features = data.features || [
    { title: "AI-Powered Automation", benefit: "Reduce manual work by 80%" },
    { title: "Seamless Integration", benefit: "Connect all your tools" },
    { title: "Real-time Analytics", benefit: "Make data-driven decisions" }
  ];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-background to-blue-50 dark:from-green-950/10 dark:via-background dark:to-blue-950/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-3xl border border-green-200/50 flex items-center justify-center">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {description}
            </p>
            
            <div className="space-y-6">
              {features.map((feature: any, i: number) => (
                <div 
                  key={i} 
                  className="group flex items-start space-x-4 p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-green-200/50 hover:border-green-300/50 transition-all duration-300"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-green-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-green-600 font-medium text-sm">
                      {feature.benefit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ResultsSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Results";
  const results = data.results || [];
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[hsl(var(--theme-primary))]">{title}</h2>
        <div className="space-y-6">
          {results.map((result: any, i: number) => (
            <div key={i} className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-3 text-[hsl(var(--theme-primary))]">
                {result.title || `Result ${i + 1}`}
              </h3>
              <p className="text-muted-foreground">{result.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const TestimonialSpotlightSection: React.FC<SectionProps> = ({ data }) => {
  const testimonial = data.testimonial || {};
  const testimonials = data.testimonials || [testimonial];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              What Our Customers Say
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">Real stories from real people</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial: any, i: number) => (
            <div 
              key={i} 
              className="group relative p-8 rounded-3xl bg-card/60 backdrop-blur-sm border border-border/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Quote icon */}
                <div className="w-12 h-12 mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 4a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2H6zm4 2a1 1 0 000 2h4a1 1 0 100-2h-4zm-4 4a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <blockquote className="text-lg font-medium mb-8 text-foreground/90 leading-relaxed">
                  "{testimonial.quote || 'This product has completely transformed how we work. The results speak for themselves.'}"
                </blockquote>
                
                {/* Stars */}
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, starIndex) => (
                    <svg key={starIndex} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-primary font-semibold text-lg">
                      {(testimonial.author || "A")[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-primary group-hover:text-primary-glow transition-colors duration-300">
                      {testimonial.author || "Sarah Johnson"}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {testimonial.role || "CEO, TechCorp"}
                    </div>
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

export const ProofSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Social Proof";
  const items = data.items || [];
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[hsl(var(--theme-primary))]">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item: any, i: number) => (
            <div key={i} className="text-center p-6 rounded-lg border bg-card">
              <div className="text-3xl font-bold text-[hsl(var(--theme-primary))] mb-2">
                {item.stat || "100%"}
              </div>
              <div className="text-muted-foreground">{item.label || "Satisfaction"}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

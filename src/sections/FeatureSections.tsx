
import React from 'react';
import type { SectionProps } from './registry';

export const FeatureDetailSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Powerful Features";
  const description = data.description || "Discover what makes our solution extraordinary";
  const features = data.features || [];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/10 to-background"></div>
      <div className="absolute top-20 right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {features.map((feature: any, i: number) => (
            <div 
              key={i} 
              className="group relative"
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <div className="relative p-8 rounded-3xl bg-card/60 backdrop-blur-sm border border-border/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-primary-glow transition-colors duration-300">
                    {feature.title || `Feature ${i + 1}`}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg group-hover:text-foreground/90 transition-colors duration-300">
                    {feature.description || "Innovative feature that revolutionizes how you work and delivers exceptional results."}
                  </p>
                  
                  {/* Interactive element */}
                  <div className="mt-6 flex items-center text-primary/70 group-hover:text-primary transition-colors duration-300">
                    <span className="text-sm font-semibold tracking-wide">EXPLORE FEATURE</span>
                    <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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

export const FeatureGridSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Powerful Features";
  const subtitle = data.subtitle || "Everything you need in one comprehensive platform";
  const items = data.items || [];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
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
                {/* Icon */}
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-primary-glow transition-colors duration-300">
                  {item.title || `Feature ${i + 1}`}
                </h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {item.desc || "Powerful feature that streamlines your workflow and enhances productivity with intelligent automation."}
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

export const ProcessSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "How It Works";
  const subtitle = data.subtitle || "Simple steps to get started";
  const steps = data.steps || [];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 hidden lg:block"></div>
          
          <div className="space-y-16">
            {steps.map((step: any, i: number) => (
              <div 
                key={i} 
                className={`flex items-center gap-12 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                style={{ animationDelay: `${i * 200}ms` }}
              >
                {/* Content */}
                <div className="flex-1 lg:w-1/2">
                  <div className={`p-8 rounded-3xl bg-card/60 backdrop-blur-sm border border-border/50 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-primary/30 ${i % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8'}`}>
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl mr-4">
                        {i + 1}
                      </div>
                      <h3 className="text-2xl font-bold text-primary">
                        {step.title || `Step ${i + 1}`}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {step.description || "Detailed description of this step in the process."}
                    </p>
                  </div>
                </div>
                
                {/* Visual element */}
                <div className="flex-1 lg:w-1/2 relative">
                  <div className="aspect-square max-w-80 mx-auto rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          {i === 0 && <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />}
                          {i === 1 && <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />}
                          {i === 2 && <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />}
                          {i > 2 && <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />}
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const ComparisonsSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Why Choose Us";
  const subtitle = data.subtitle || "See how we compare to the competition";
  const items = data.items || [
    { feature: "Setup Time", us: "5 minutes", others: "Hours or days", highlight: true },
    { feature: "Support", us: "24/7 Live Chat", others: "Email only", highlight: true },
    { feature: "Integrations", us: "500+ Apps", others: "Limited", highlight: true },
    { feature: "Pricing", us: "Transparent", others: "Hidden fees", highlight: true },
  ];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/5 to-background"></div>
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="relative rounded-3xl bg-card/60 backdrop-blur-sm border border-border/50 overflow-hidden shadow-2xl">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
          
          <div className="relative z-10 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
                  <th className="p-6 text-left font-bold text-xl text-primary">Feature</th>
                  <th className="p-6 text-center font-bold text-xl">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent mr-2"></div>
                      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Our Platform</span>
                    </div>
                  </th>
                  <th className="p-6 text-center font-bold text-xl text-muted-foreground">Competition</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, i: number) => (
                  <tr 
                    key={i} 
                    className="border-b border-border/30 hover:bg-primary/5 transition-colors duration-300"
                  >
                    <td className="p-6 font-semibold text-foreground">
                      {item.feature || `Feature ${i + 1}`}
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-semibold text-green-600">{item.us || "Included"}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center mr-2">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-medium text-red-600">{item.others || "Limited"}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

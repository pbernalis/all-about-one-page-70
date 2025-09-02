
import React from 'react';
import type { SectionProps } from './registry';

export const IntegrationsSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Trusted by Industry Leaders";
  const subtitle = data.subtitle || "Seamlessly integrate with your favorite tools";
  const logos = data.logos || [
    { name: "Microsoft", category: "Enterprise" },
    { name: "Google", category: "Cloud" },
    { name: "Amazon", category: "Cloud" },
    { name: "Salesforce", category: "CRM" },
    { name: "Slack", category: "Communication" },
    { name: "Stripe", category: "Payments" }
  ];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/10 to-background"></div>
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {logos.map((logo: any, i: number) => (
            <div 
              key={i} 
              className="group relative p-8 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:border-primary/30"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                {/* Logo placeholder */}
                <div className="w-16 h-16 mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                </div>
                
                <h3 className="font-bold text-primary group-hover:text-primary-glow transition-colors duration-300">
                  {logo.name || `Partner ${i + 1}`}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground/70 transition-colors duration-300">
                  {logo.category || "Partner"}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Integrations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const LocationsSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Our Locations";
  const locations = data.locations || [];
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[hsl(var(--theme-primary))]">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location: any, i: number) => (
            <div key={i} className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-3 text-[hsl(var(--theme-primary))]">
                {location.city || `Location ${i + 1}`}
              </h3>
              <p className="text-muted-foreground mb-2">{location.address}</p>
              <p className="text-muted-foreground">{location.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const MetricsSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Proven Results";
  const subtitle = data.subtitle || "Numbers that speak for themselves";
  const metrics = data.metrics || [
    { value: "10M+", label: "Users Worldwide", icon: "users" },
    { value: "99.9%", label: "Uptime SLA", icon: "shield" },
    { value: "500+", label: "Enterprise Clients", icon: "building" },
    { value: "24/7", label: "Support Available", icon: "support" }
  ];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric: any, i: number) => (
            <div 
              key={i} 
              className="group relative text-center p-8 rounded-3xl bg-card/60 backdrop-blur-sm border border-border/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      {metric.icon === 'users' && <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />}
                      {metric.icon === 'shield' && <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />}
                      {metric.icon === 'building' && <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />}
                      {metric.icon === 'support' && <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-1.59-1.59A5.95 5.95 0 004 10c0 .954.223 1.856.619 2.657l1.539-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.539a4.002 4.002 0 00-2.346.033L7.246 4.667zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />}
                    </svg>
                  </div>
                </div>
                
                <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {metric.value || "0"}
                </div>
                <div className="text-muted-foreground font-medium group-hover:text-foreground/80 transition-colors duration-300">
                  {metric.label || "Metric"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const BenefitsSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Unlock Your Potential";
  const subtitle = data.subtitle || "Discover the advantages that set us apart";
  const benefits = data.benefits || [
    { 
      title: "Boost Productivity", 
      description: "Streamline workflows and automate repetitive tasks",
      icon: "productivity"
    },
    { 
      title: "Save Time & Money", 
      description: "Reduce operational costs by up to 60%",
      icon: "savings"
    },
    { 
      title: "Scale Effortlessly", 
      description: "Grow your business without infrastructure limitations",
      icon: "scale"
    },
    { 
      title: "Enhanced Security", 
      description: "Enterprise-grade protection for your data",
      icon: "security"
    }
  ];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background"></div>
      <div className="absolute top-20 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit: any, i: number) => (
            <div 
              key={i} 
              className="group relative p-8 rounded-3xl bg-card/60 backdrop-blur-sm border border-border/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex items-start space-x-6">
                {/* Icon */}
                <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      {benefit.icon === 'productivity' && <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />}
                      {benefit.icon === 'savings' && <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />}
                      {benefit.icon === 'scale' && <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 001.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />}
                      {benefit.icon === 'security' && <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />}
                    </svg>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-primary-glow transition-colors duration-300">
                    {benefit.title || `Benefit ${i + 1}`}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                    {benefit.description || "Discover how this powerful benefit can transform your workflow and deliver exceptional results for your business."}
                  </p>
                  
                  {/* Interactive element */}
                  <div className="mt-6 flex items-center text-primary/70 group-hover:text-primary transition-colors duration-300">
                    <span className="text-sm font-semibold tracking-wide">EXPLORE BENEFIT</span>
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


import React from 'react';
import type { SectionProps } from './registry';

export const JobListingsSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Join Our Amazing Team";
  const subtitle = data.subtitle || "Shape the future with us - explore exciting career opportunities";
  const jobs = data.jobs || [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Build beautiful, responsive interfaces using modern React and TypeScript.",
      requirements: ["5+ years React experience", "TypeScript proficiency", "Design system experience"]
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote / New York",
      type: "Full-time",
      description: "Create intuitive user experiences and drive product design decisions.",
      requirements: ["3+ years product design", "Figma expertise", "User research experience"]
    }
  ];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="space-y-8">
          {jobs.map((job: any, i: number) => (
            <div 
              key={i} 
              className="group relative p-8 rounded-3xl bg-card/60 backdrop-blur-sm border border-border/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold mb-2 text-primary group-hover:text-primary-glow transition-colors duration-300">
                      {job.title || `Position ${i + 1}`}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        {job.department || "Department"}
                      </span>
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {job.location || "Location"}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {job.type || "Full-time"}
                      </span>
                    </div>
                  </div>
                  
                  <button className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25">
                    Apply Now
                  </button>
                </div>
                
                <p className="text-muted-foreground text-lg leading-relaxed mb-6 group-hover:text-foreground/90 transition-colors duration-300">
                  {job.description || "Exciting opportunity to join our growing team and make a significant impact."}
                </p>
                
                {job.requirements && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Key Requirements:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {job.requirements.map((req: string, ri: number) => (
                        <li key={ri} className="flex items-center text-muted-foreground">
                          <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Don't see the perfect role? We're always looking for talented people.
          </p>
          <button className="px-8 py-4 border-2 border-primary/20 text-primary rounded-2xl font-semibold text-lg transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
            Send Us Your Resume
          </button>
        </div>
      </div>
    </section>
  );
};

export const CultureSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Our Culture";
  const description = data.description || "What it's like to work here";
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-[hsl(var(--theme-primary))]">{title}</h2>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>
    </section>
  );
};

export const ProjectGridSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Our Projects";
  const projects = data.projects || [];
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[hsl(var(--theme-primary))]">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any, i: number) => (
            <div key={i} className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-3 text-[hsl(var(--theme-primary))]">
                {project.name || `Project ${i + 1}`}
              </h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CapabilitiesSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Our Capabilities";
  const capabilities = data.capabilities || [];
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[hsl(var(--theme-primary))]">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((capability: any, i: number) => (
            <div key={i} className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-3 text-[hsl(var(--theme-primary))]">
                {capability.title || `Capability ${i + 1}`}
              </h3>
              <p className="text-muted-foreground">{capability.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const AuthFormsSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Welcome Back";
  const subtitle = data.subtitle || "Sign in to your account";
  const isSignUp = data.mode === "signup";
  
  return (
    <section className="py-24 px-6 relative overflow-hidden min-h-screen flex items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-md mx-auto w-full">
        <div className="p-8 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          
          <div className="space-y-6">
            {/* Social login */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
                <div className="w-5 h-5 rounded bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
                <div className="w-5 h-5 rounded bg-gradient-to-r from-gray-700 to-gray-900"></div>
                <span className="text-sm font-medium">GitHub</span>
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-4 text-muted-foreground">or continue with email</span>
              </div>
            </div>
            
            {/* Form */}
            <div className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
              </div>
              
              <button className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25">
                {isSignUp ? "Create Account" : "Sign In"}
              </button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button className="text-primary hover:text-primary-glow font-medium transition-colors duration-300">
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const LegalBodySection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Legal Information";
  const content = data.content || "Legal content goes here.";
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[hsl(var(--theme-primary))]">{title}</h1>
        <div className="prose max-w-none text-foreground">
          <p>{content}</p>
        </div>
      </div>
    </section>
  );
};

export const EmptyStateSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Nothing Found";
  const description = data.description || "There's nothing here yet.";
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-[hsl(var(--theme-primary))]">{title}</h2>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>
    </section>
  );
};

export const SearchBarSection: React.FC<SectionProps> = ({ data }) => {
  const placeholder = data.placeholder || "Search...";
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-4">
          <input
            type="search"
            placeholder={placeholder}
            className="flex-1 px-4 py-2 rounded-lg border bg-background"
          />
          <button className="bg-[hsl(var(--theme-primary))] text-white px-6 py-2 rounded-lg">
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export const SearchResultsSection: React.FC<SectionProps> = ({ data }) => {
  const results = data.results || [];
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {results.map((result: any, i: number) => (
            <div key={i} className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-2 text-[hsl(var(--theme-primary))]">
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

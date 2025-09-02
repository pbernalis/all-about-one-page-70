// Simple template system for clean Create → Pick → Save flow

export interface Template {
  id: string;
  name: string;
  schema: {
    layout: string;
    sections: string[];
    theme: {
      brandColor: string;
      radius: string;
      density: string;
    };
    content: Record<string, any>;
  };
}

export const TEMPLATES: Template[] = [
  {
    id: "home",
    name: "Home",
    schema: {
      layout: "home",
      sections: ["hero", "features", "proof", "cta", "contact"],
      theme: {
        brandColor: "#6D28D9",
        radius: "md",
        density: "normal"
      },
      content: {
        hero: {
          headline: "Welcome to Your Success",
          subheadline: "Transform your business with our innovative solutions",
          primaryCta: "Get Started",
          secondaryCta: "Learn More"
        },
        features: {
          title: "Why Choose Us",
          items: [
            { title: "Fast", description: "Lightning-fast performance" },
            { title: "Reliable", description: "Dependable 24/7 service" },
            { title: "Secure", description: "Enterprise-grade security" }
          ]
        },
        proof: {
          title: "Trusted by Industry Leaders",
          metrics: [
            { label: "Happy Customers", value: "10,000+" },
            { label: "Years Experience", value: "15+" },
            { label: "Success Rate", value: "99%" }
          ]
        },
        cta: {
          title: "Ready to Get Started?",
          subtitle: "Join thousands of satisfied customers",
          buttons: [{ text: "Start Today", href: "#contact" }]
        },
        contact: {
          title: "Get in Touch",
          email: "hello@company.com",
          phone: "+1 (555) 123-4567"
        }
      }
    }
  },
  {
    id: "about",
    name: "About",
    schema: {
      layout: "about",
      sections: ["hero", "story", "values", "team", "cta"],
      theme: {
        brandColor: "#0066cc",
        radius: "md", 
        density: "normal"
      },
      content: {
        hero: {
          headline: "Our Story",
          subheadline: "Building the future through innovation and dedication"
        },
        story: {
          title: "How We Started",
          content: "Founded with a vision to transform industries through cutting-edge solutions..."
        },
        values: {
          title: "Our Values",
          items: [
            { title: "Innovation", description: "Pushing boundaries to create breakthrough solutions" },
            { title: "Integrity", description: "Honest, transparent relationships with all stakeholders" },
            { title: "Excellence", description: "Committed to delivering exceptional quality in everything we do" }
          ]
        },
        team: {
          title: "Meet Our Team",
          members: [
            { name: "John Smith", role: "CEO & Founder", bio: "Visionary leader with 15+ years experience" },
            { name: "Sarah Johnson", role: "CTO", bio: "Technology expert driving our innovation" }
          ]
        },
        cta: {
          title: "Want to Join Our Mission?",
          buttons: [{ text: "View Careers", href: "/careers" }]
        }
      }
    }
  },
  {
    id: "services",
    name: "Services",
    schema: {
      layout: "services-overview", 
      sections: ["hero", "features", "pricing", "faq", "contact"],
      theme: {
        brandColor: "#059669",
        radius: "md",
        density: "normal"
      },
      content: {
        hero: {
          headline: "Professional Services",
          subheadline: "Comprehensive solutions tailored to your business needs"
        },
        features: {
          title: "Our Services",
          items: [
            { title: "Consulting", description: "Strategic guidance for growth" },
            { title: "Implementation", description: "Expert execution of solutions" },
            { title: "Support", description: "Ongoing maintenance and optimization" }
          ]
        },
        pricing: {
          title: "Service Packages",
          plans: [
            {
              name: "Basic",
              price: "$299",
              features: ["Initial consultation", "Basic implementation", "Email support"]
            },
            {
              name: "Premium", 
              price: "$599",
              features: ["Everything in Basic", "Priority support", "Custom solutions"]
            }
          ]
        },
        faq: {
          title: "Frequently Asked Questions",
          items: [
            { q: "How long does implementation take?", a: "Typically 2-4 weeks depending on complexity." },
            { q: "Do you offer ongoing support?", a: "Yes, we provide comprehensive support packages." }
          ]
        },
        contact: {
          title: "Ready to Start?",
          email: "services@company.com",
          phone: "+1 (555) 123-4567"
        }
      }
    }
  },
  {
    id: "landing",
    name: "Landing Page",
    schema: {
      layout: "landing",
      sections: ["hero", "benefits", "proof", "pricing", "faq", "cta"],
      theme: {
        brandColor: "#dc2626",
        radius: "md",
        density: "normal"
      },
      content: {
        hero: {
          headline: "Double Your Sales in 90 Days",
          subheadline: "Proven system used by 1000+ businesses",
          primaryCta: "Get Started Now"
        },
        benefits: {
          title: "What You Get",
          items: [
            { title: "Proven System", description: "Step-by-step blueprint for success" },
            { title: "Expert Support", description: "Personal guidance throughout" }
          ]
        },
        proof: {
          title: "Real Results",
          metrics: [
            { label: "Success Rate", value: "94%" },
            { label: "Average Increase", value: "180%" }
          ]
        },
        pricing: {
          title: "Special Offer",
          plans: [
            {
              name: "Complete System",
              price: "$497",
              features: ["Full training program", "Templates & tools", "90-day support"]
            }
          ]
        },
        faq: {
          title: "Common Questions",
          items: [
            { q: "How long does it take?", a: "Most see results within 30 days." }
          ]
        },
        cta: {
          title: "Limited Time Offer",
          buttons: [{ text: "Claim Your Spot", href: "#order" }]
        }
      }
    }
  }
];
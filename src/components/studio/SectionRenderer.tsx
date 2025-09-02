import React from 'react';
import { Section } from '@/pages/StudioModern';
import { Button } from '@/components/ui/button';

interface SectionRendererProps {
  section: Section;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  const renderHeroSection = (props: any) => (
    <section className="bg-gradient-primary text-white py-20 px-8 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          {props.title || 'Your Amazing Headline'}
        </h1>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          {props.subtitle || 'A compelling subtitle that explains your value proposition and engages your audience.'}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button variant="secondary" size="lg" className="shadow-medium">
            {props.primaryCta || 'Get Started'}
          </Button>
          <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
            {props.secondaryCta || 'Learn More'}
          </Button>
        </div>
      </div>
    </section>
  );

  const renderContentSection = (props: any) => (
    <section className="py-16 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            {props.title || 'About Our Solution'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {props.description || 'Learn more about what makes our solution unique and how it can help you achieve your goals.'}
          </p>
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {props.content || 'This is where your main content goes. You can include detailed information about your product, service, or company. The content will be rendered beautifully with proper typography and spacing.'}
          </p>
        </div>
      </div>
    </section>
  );

  const renderFeaturesSection = (props: any) => (
    <section className="py-16 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            {props.title || 'Key Features'}
          </h2>
          <p className="text-lg text-gray-600">
            {props.subtitle || 'Everything you need to succeed'}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {(props.features || [
            { title: 'Fast Performance', description: 'Lightning-fast loading times and smooth interactions.' },
            { title: 'Easy to Use', description: 'Intuitive interface designed for everyone.' },
            { title: 'Secure & Reliable', description: 'Enterprise-grade security and 99.9% uptime.' }
          ]).map((feature: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-soft">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderCtaSection = (props: any) => (
    <section className="py-16 px-8 bg-gray-900 text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">
          {props.title || 'Ready to Get Started?'}
        </h2>
        <p className="text-xl mb-8 opacity-90">
          {props.subtitle || 'Join thousands of satisfied customers today.'}
        </p>
        <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-medium">
          {props.ctaText || 'Start Your Journey'}
        </Button>
      </div>
    </section>
  );

  switch (section.type) {
    case 'hero':
      return renderHeroSection(section.props);
    case 'content':
      return renderContentSection(section.props);
    case 'features':
      return renderFeaturesSection(section.props);
    case 'cta':
      return renderCtaSection(section.props);
    default:
      return (
        <div className="p-8 text-center text-gray-500">
          Unknown section type: {section.type}
        </div>
      );
  }
};
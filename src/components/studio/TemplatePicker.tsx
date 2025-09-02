import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Layout, FileText, Zap, Users, Target, Building, ShoppingBag, Globe, Sparkles, ArrowRight, Check, Search, Filter, Home, User, Phone, Star, Briefcase, BookOpen, Shield, AlertCircle, FileSearch, UserCheck, Grid3X3, List, DollarSign, MessageSquare, Calendar, BarChart3, Code, ShoppingCart, CreditCard, Settings, Newspaper, Clock, TrendingUp, Award } from 'lucide-react';
import { TEMPLATES_META } from '@/cms/templates/meta';
import { cn } from '@/lib/utils';

interface TemplatePickerProps {
  selectedTemplate: string | null;
  onTemplateSelect: (templateId: string) => void;
  onSchemaGenerate: () => void; // Not needed but keeping for interface compatibility
}

// Comprehensive template configuration for all available templates
const templateConfig: Record<string, {
  icon: React.ComponentType<any>;
  gradient: string;
  accent: string;
  description: string;
  category: string;
}> = {
  // Marketing Templates
  'home': {
    icon: Home,
    gradient: 'from-blue-500 via-blue-600 to-indigo-700',
    accent: 'blue',
    description: 'Complete homepage with hero, features, and conversion elements',
    category: 'marketing'
  },
  'landing': {
    icon: Target,
    gradient: 'from-violet-500 via-violet-600 to-purple-700',
    accent: 'violet',
    description: 'High-converting landing page for campaigns and lead generation',
    category: 'marketing'
  },
  'pricing': {
    icon: DollarSign,
    gradient: 'from-green-500 via-green-600 to-emerald-700',
    accent: 'green',
    description: 'Tiered pricing plans with features comparison',
    category: 'marketing'
  },
  'features': {
    icon: Zap,
    gradient: 'from-cyan-500 via-cyan-600 to-blue-700',
    accent: 'cyan',
    description: 'Product capabilities showcase with feature comparisons',
    category: 'marketing'
  },
  'about': {
    icon: User,
    gradient: 'from-emerald-500 via-emerald-600 to-teal-700',
    accent: 'emerald',
    description: 'Company story, mission, values, and team showcase',
    category: 'marketing'
  },
  'contact': {
    icon: Phone,
    gradient: 'from-pink-500 via-pink-600 to-rose-700',
    accent: 'pink',
    description: 'Contact forms, information, and office locations',
    category: 'marketing'
  },
  'testimonials': {
    icon: Star,
    gradient: 'from-amber-500 via-amber-600 to-yellow-700',
    accent: 'amber',
    description: 'Customer reviews and social proof showcase',
    category: 'marketing'
  },

  // Content Templates
  'blog_index': {
    icon: BookOpen,
    gradient: 'from-slate-500 via-slate-600 to-gray-700',
    accent: 'slate',
    description: 'Blog listing with categories and newsletter signup',
    category: 'content'
  },
  'blog_post': {
    icon: FileText,
    gradient: 'from-blue-500 via-blue-600 to-cyan-700',
    accent: 'blue',
    description: 'Individual blog post with sharing and related content',
    category: 'content'
  },
  'docs': {
    icon: Code,
    gradient: 'from-purple-500 via-purple-600 to-violet-700',
    accent: 'purple',
    description: 'Technical documentation with sidebar navigation and search',
    category: 'content'
  },
  'changelog': {
    icon: Clock,
    gradient: 'from-orange-500 via-orange-600 to-red-700',
    accent: 'orange',
    description: 'Product updates and release notes timeline',
    category: 'content'
  },

  // E-commerce Templates
  'shop_list': {
    icon: ShoppingBag,
    gradient: 'from-green-500 via-green-600 to-emerald-700',
    accent: 'green',
    description: 'Product listing with filters and search',
    category: 'ecommerce'
  },
  'shop_product': {
    icon: Target,
    gradient: 'from-blue-500 via-blue-600 to-indigo-700',
    accent: 'blue',
    description: 'Detailed product view with gallery and reviews',
    category: 'ecommerce'
  },
  'cart': {
    icon: ShoppingCart,
    gradient: 'from-amber-500 via-amber-600 to-yellow-700',
    accent: 'amber',
    description: 'Shopping cart review and quantity management',
    category: 'ecommerce'
  },
  'checkout': {
    icon: CreditCard,
    gradient: 'from-emerald-500 via-emerald-600 to-teal-700',
    accent: 'emerald',
    description: 'Payment flow with progress indicator',
    category: 'ecommerce'
  },

  // Business Templates
  'services_overview': {
    icon: Building,
    gradient: 'from-purple-500 via-purple-600 to-violet-700',
    accent: 'purple',
    description: 'Service listing with pricing and booking',
    category: 'business'
  },
  'service_detail': {
    icon: Target,
    gradient: 'from-orange-500 via-orange-600 to-red-700',
    accent: 'orange',
    description: 'Individual service with booking and case studies',
    category: 'business'
  },
  'case_study': {
    icon: TrendingUp,
    gradient: 'from-indigo-500 via-indigo-600 to-purple-700',
    accent: 'indigo',
    description: 'Detailed customer success story with metrics',
    category: 'business'
  },
  'careers': {
    icon: Briefcase,
    gradient: 'from-emerald-500 via-emerald-600 to-green-700',
    accent: 'emerald',
    description: 'Job listings with company culture and benefits',
    category: 'business'
  },
  'team': {
    icon: Users,
    gradient: 'from-purple-500 via-purple-600 to-pink-700',
    accent: 'purple',
    description: 'Team member profiles and company culture',
    category: 'business'
  },
  'portfolio': {
    icon: Globe,
    gradient: 'from-orange-500 via-orange-600 to-amber-700',
    accent: 'orange',
    description: 'Project showcase with categories and details',
    category: 'business'
  },

  // Utility Templates
  'dashboard': {
    icon: BarChart3,
    gradient: 'from-blue-500 via-blue-600 to-indigo-700',
    accent: 'blue',
    description: 'Analytics dashboard with widgets and charts',
    category: 'utility'
  },
  'auth': {
    icon: UserCheck,
    gradient: 'from-indigo-500 via-indigo-600 to-blue-700',
    accent: 'indigo',
    description: 'Sign in/up forms with social login',
    category: 'utility'
  },
  'search': {
    icon: Search,
    gradient: 'from-cyan-500 via-cyan-600 to-teal-700',
    accent: 'cyan',
    description: 'Search functionality with filters and results',
    category: 'utility'
  },
  'legal': {
    icon: Shield,
    gradient: 'from-gray-500 via-gray-600 to-slate-700',
    accent: 'gray',
    description: 'Terms, privacy policy, and legal documents',
    category: 'utility'
  },
  'not_found': {
    icon: AlertCircle,
    gradient: 'from-red-500 via-red-600 to-pink-700',
    accent: 'red',
    description: 'Error page with helpful navigation',
    category: 'utility'
  },
  'faq': {
    icon: MessageSquare,
    gradient: 'from-teal-500 via-teal-600 to-cyan-700',
    accent: 'teal',
    description: 'Frequently asked questions with search',
    category: 'utility'
  }
};

const categoryConfig = {
  'marketing': { color: 'blue', count: 0 },
  'content': { color: 'emerald', count: 0 },
  'ecommerce': { color: 'purple', count: 0 },
  'business': { color: 'green', count: 0 },
  'utility': { color: 'amber', count: 0 }
};

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onSchemaGenerate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Calculate category counts and filter templates
  const { categorizedTemplates, categoryStats } = useMemo(() => {
    const stats = { ...categoryConfig };
    
    // Reset counts
    Object.keys(stats).forEach(cat => stats[cat as keyof typeof stats].count = 0);
    
    // Filter and categorize templates
    const filtered = TEMPLATES_META.filter(template => {
      const config = templateConfig[template.id];
      const matchesSearch = template.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (config?.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || config?.category === selectedCategory;
      
      if (config?.category && stats[config.category as keyof typeof stats]) {
        stats[config.category as keyof typeof stats].count++;
      }
      
      return matchesSearch && matchesCategory;
    });

    return { categorizedTemplates: filtered, categoryStats: stats };
  }, [searchQuery, selectedCategory]);

  const categories = ['all', ...Object.keys(categoryConfig)];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <Layout className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Choose Your Template
              </h2>
              <p className="text-sm text-muted-foreground">
                {categorizedTemplates.length} professional templates available
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/60 border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              const categoryData = category === 'all' 
                ? { color: 'slate', count: TEMPLATES_META.length }
                : categoryStats[category as keyof typeof categoryStats];
              
              return (
                <Button
                  key={category}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "transition-all duration-200 capitalize",
                    isActive && "shadow-md"
                  )}
                >
                  {category}
                  <span className="ml-1.5 text-xs opacity-70">
                    ({categoryData?.count || 0})
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Templates Content */}
      <div className="flex-1 overflow-auto p-6">
        {categorizedTemplates.length === 0 ? (
          /* Empty State */
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filter
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Template Grid/List */}
            <div className={cn(
              "gap-4",
              viewMode === 'grid' 
                ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" 
                : "flex flex-col space-y-3"
            )}>
              {categorizedTemplates.map((template) => {
                const config = templateConfig[template.id] || {
                  icon: Layout,
                  gradient: 'from-blue-500 via-blue-600 to-indigo-700',
                  accent: 'blue',
                  description: 'Professional template for your website',
                  category: 'Marketing'
                };
                const IconComponent = config.icon;
                const isSelected = selectedTemplate === template.id;
                
                return (
                  <Card 
                    key={template.id}
                    className={cn(
                      "group relative overflow-hidden cursor-pointer transition-all duration-300",
                      viewMode === 'list' && "flex items-center",
                      isSelected 
                        ? 'ring-2 ring-primary shadow-lg shadow-primary/25 bg-primary/5 scale-105' 
                        : 'hover:shadow-lg hover:-translate-y-1 border-border/50 hover:border-border'
                    )}
                    onClick={() => onTemplateSelect(template.id)}
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg z-10">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}

                    <div className={cn(
                      "relative p-6",
                      viewMode === 'list' && "flex items-center gap-4 w-full"
                    )}>
                      <div className={cn(
                        "flex gap-4",
                        viewMode === 'grid' ? "items-start" : "items-center flex-1"
                      )}>
                        {/* Icon */}
                        <div className={cn(
                          "rounded-xl bg-gradient-to-br shadow-lg flex items-center justify-center flex-shrink-0",
                          config.gradient,
                          viewMode === 'grid' ? "w-14 h-14" : "w-12 h-12"
                        )}>
                          <IconComponent className={cn(
                            "text-white",
                            viewMode === 'grid' ? "h-7 w-7" : "h-6 w-6"
                          )} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className={cn(
                              "font-semibold text-foreground group-hover:text-primary transition-colors",
                              viewMode === 'grid' ? "text-lg" : "text-base"
                            )}>
                              {template.label}
                            </h3>
                            <Badge 
                              variant="secondary" 
                              className="text-xs capitalize bg-muted/60"
                            >
                              {config.category}
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1" />
                          </div>
                          
                          <p className={cn(
                            "text-muted-foreground leading-relaxed mb-3",
                            viewMode === 'grid' ? "text-sm" : "text-xs"
                          )}>
                            {config.description}
                          </p>
                          
                          {/* Section Tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {template.recommendedSections.slice(0, viewMode === 'grid' ? 4 : 3).map((section) => (
                              <Badge 
                                key={section} 
                                variant="outline" 
                                className="text-xs px-2 py-0.5 bg-background/50 border-border/50"
                              >
                                {section}
                              </Badge>
                            ))}
                            {template.recommendedSections.length > (viewMode === 'grid' ? 4 : 3) && (
                              <Badge variant="outline" className="text-xs px-2 py-0.5">
                                +{template.recommendedSections.length - (viewMode === 'grid' ? 4 : 3)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-border/20 group-hover:ring-border/40 transition-all duration-300" />
                  </Card>
                );
              })}
            </div>

            {/* AI Generation Section */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <Card 
                className="group cursor-pointer overflow-hidden border-2 border-dashed border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                onClick={onSchemaGenerate}
              >
                <div className="relative p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 group-hover:from-violet-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                  
                  <div className="relative flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        Generate Custom Template
                      </h3>
                      <p className="text-muted-foreground">
                        Describe your vision and let AI create a unique template tailored to your specific business needs
                      </p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2" />
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
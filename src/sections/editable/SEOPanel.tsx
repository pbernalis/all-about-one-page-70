import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Search, Eye, Zap, Globe, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { ProfessionalInlineEditor } from '@/components/editors/ProfessionalInlineEditor';
import { cn } from '@/lib/utils';

type Props = {
  schema: any;
  setSchema: (s: any) => void;
  readOnly?: boolean;
  className?: string;
};

export default function SEOPanel({ schema, setSchema, readOnly = false, className = "" }: Props) {
  const seoData = schema?.seo || {};
  const { title = "", description = "", keywords = "", ogTitle = "", ogDescription = "" } = seoData;

  // SEO Analysis
  const titleLength = title?.length || 0;
  const descLength = description?.length || 0;
  const hasKeywords = keywords?.length > 0;
  
  const titleStatus = titleLength === 0 ? 'missing' : titleLength < 30 ? 'short' : titleLength > 60 ? 'long' : 'good';
  const descStatus = descLength === 0 ? 'missing' : descLength < 120 ? 'short' : descLength > 160 ? 'long' : 'good';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 dark:text-green-400';
      case 'short': case 'long': return 'text-yellow-600 dark:text-yellow-400';
      case 'missing': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle2 className="h-4 w-4" />;
      case 'short': case 'long': return <AlertCircle className="h-4 w-4" />;
      case 'missing': return <AlertCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const seoScore = [
    titleStatus === 'good' ? 25 : titleStatus === 'missing' ? 0 : 15,
    descStatus === 'good' ? 25 : descStatus === 'missing' ? 0 : 15,
    hasKeywords ? 20 : 0,
    ogTitle ? 15 : 0,
    ogDescription ? 15 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <motion.section
      className={`card-modern ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-editable="true"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary text-white shadow-glow">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">SEO Settings</h3>
              <p className="text-sm text-muted-foreground">
                Optimize your content for search engines
              </p>
            </div>
          </div>
          <Badge 
            variant={seoScore >= 80 ? 'default' : seoScore >= 60 ? 'secondary' : 'destructive'}
            className="px-3 py-1 shadow-sm"
          >
            SEO Score: {seoScore}/100
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Primary SEO Fields */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  Page Title
                  <span className={cn("flex items-center", getStatusColor(titleStatus))}>
                    {getStatusIcon(titleStatus)}
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-mono", getStatusColor(titleStatus))}>
                    {titleLength}/60
                  </span>
                  <Badge 
                    variant={titleStatus === 'good' ? 'default' : 'secondary'} 
                    className="capitalize text-xs"
                  >
                    {titleStatus}
                  </Badge>
                </div>
              </div>
              
              <ProfessionalInlineEditor
                path="/seo/title"
                value={title}
                placeholder="Enter a compelling page title (30-60 characters)"
                readOnly={readOnly}
                schema={schema}
                setSchema={setSchema}
                enableRichText={false}
                className="w-full text-base font-medium"
              />
              
              {titleStatus !== 'good' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-xs text-muted-foreground bg-muted/30 rounded-md p-2"
                >
                  {titleStatus === 'missing' && "⚠️ A page title is required for SEO"}
                  {titleStatus === 'short' && "💡 Consider making your title longer for better SEO"}
                  {titleStatus === 'long' && "✂️ Your title may be truncated in search results"}
                </motion.div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Meta Description
                  <span className={cn("flex items-center", getStatusColor(descStatus))}>
                    {getStatusIcon(descStatus)}
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-mono", getStatusColor(descStatus))}>
                    {descLength}/160
                  </span>
                  <Badge 
                    variant={descStatus === 'good' ? 'default' : 'secondary'} 
                    className="capitalize text-xs"
                  >
                    {descStatus}
                  </Badge>
                </div>
              </div>
              
              <ProfessionalInlineEditor
                path="/seo/description"
                value={description}
                placeholder="Write a compelling description that summarizes your page content (120-160 characters)"
                readOnly={readOnly}
                schema={schema}
                setSchema={setSchema}
                enableRichText={false}
                multiline={true}
                className="w-full min-h-[4rem]"
              />
              
              {descStatus !== 'good' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-xs text-muted-foreground bg-muted/30 rounded-md p-2"
                >
                  {descStatus === 'missing' && "⚠️ A meta description helps search engines understand your page"}
                  {descStatus === 'short' && "💡 Consider expanding your description for better click-through rates"}
                  {descStatus === 'long' && "✂️ Your description may be truncated in search results"}
                </motion.div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Keywords
                <Badge variant={hasKeywords ? 'default' : 'secondary'} className="text-xs">
                  {hasKeywords ? 'Set' : 'Missing'}
                </Badge>
              </label>
              
              <ProfessionalInlineEditor
                path="/seo/keywords"
                value={keywords}
                placeholder="Enter relevant keywords separated by commas (e.g., web design, UI/UX, development)"
                readOnly={readOnly}
                schema={schema}
                setSchema={setSchema}
                enableRichText={false}
                className="w-full"
              />
              
              <p className="text-xs text-muted-foreground bg-muted/20 rounded-md p-2">
                💡 Add relevant keywords that describe your content. Separate multiple keywords with commas.
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Open Graph / Social Media */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold">Social Media Preview</h4>
                <p className="text-sm text-muted-foreground">
                  How your page appears when shared on social platforms
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Social Title
                  <Badge variant={ogTitle ? 'default' : 'secondary'} className="text-xs">
                    {ogTitle ? 'Custom' : 'Uses page title'}
                  </Badge>
                </label>
                <ProfessionalInlineEditor
                  path="/seo/ogTitle"
                  value={ogTitle}
                  placeholder={title || "Enter a social media optimized title"}
                  readOnly={readOnly}
                  schema={schema}
                  setSchema={setSchema}
                  enableRichText={false}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Social Description
                  <Badge variant={ogDescription ? 'default' : 'secondary'} className="text-xs">
                    {ogDescription ? 'Custom' : 'Uses meta description'}
                  </Badge>
                </label>
                <ProfessionalInlineEditor
                  path="/seo/ogDescription"
                  value={ogDescription}
                  placeholder={description || "Enter a social media optimized description"}
                  readOnly={readOnly}
                  schema={schema}
                  setSchema={setSchema}
                  enableRichText={false}
                  multiline={true}
                  className="w-full min-h-[3rem]"
                />
              </div>
            </div>
          </div>

          {/* SEO Preview */}
          {(title || description) && (
            <>
              <Separator className="my-6" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Search Result Preview</h4>
                    <p className="text-sm text-muted-foreground">
                      How your page might appear in search results
                    </p>
                  </div>
                </div>
                
                <motion.div
                  className="border rounded-lg p-4 bg-muted/20 space-y-2 hover-lift"
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-lg text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1 font-medium">
                    {title || "Page Title - Your Website"}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-400">
                    https://yoursite.com/page-url
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {description || "Your page description will appear here. Make it compelling to improve click-through rates from search results."}
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
}
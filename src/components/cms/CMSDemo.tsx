import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CMSTextField } from './CMSTextField';
import { RichTextEditor } from './RichTextEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Eye, Code, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const CMSDemo: React.FC = () => {
  const [content, setContent] = useState({
    title: 'Welcome to Our CMS',
    description: 'This is a powerful content management system with rich text editing capabilities.',
    richContent: '<h2>Rich Text Example</h2><p>This editor supports <strong>bold text</strong>, <em>italics</em>, <u>underlines</u>, and much more!</p><ul><li>Bullet lists</li><li>Numbered lists</li><li>Tables and images</li></ul>',
    plainText: 'This is plain text content that can be edited with or without rich text mode.'
  });

  const handleSave = () => {
    toast({
      title: "Content Saved",
      description: "Your CMS content has been saved successfully.",
    });
  };

  const renderPreview = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
        <p className="text-muted-foreground text-lg">{content.description}</p>
      </div>
      
      <div 
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content.richContent }}
      />
      
      <div className="border-t pt-4">
        <p>{content.plainText}</p>
      </div>
    </div>
  );

  const renderCode = () => (
    <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
      <code>
{JSON.stringify(content, null, 2)}
      </code>
    </pre>
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Rich Text CMS Demo</h1>
            <p className="text-muted-foreground">
              Professional content management with TipTap editor integration
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mb-6">
          <Badge variant="secondary">TipTap Editor</Badge>
          <Badge variant="secondary">Rich Text</Badge>
          <Badge variant="secondary">Tables & Images</Badge>
          <Badge variant="secondary">Color Support</Badge>
          <Badge variant="secondary">Sanitized HTML</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Editor Panel */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Editor
            </CardTitle>
            <CardDescription>
              Create and edit content using our rich text editor with full CMS capabilities.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CMSTextField
              label="Page Title"
              value={content.title}
              onChange={(value) => setContent(prev => ({ ...prev, title: value }))}
              placeholder="Enter page title..."
              required
              maxLength={100}
              description="The main title of your page (SEO optimized)"
            />

            <CMSTextField
              label="Page Description"
              value={content.description}
              onChange={(value) => setContent(prev => ({ ...prev, description: value }))}
              type="textarea"
              placeholder="Enter page description..."
              maxLength={300}
              description="Brief description for search engines and social media"
            />

            <div className="space-y-3">
              <label className="text-sm font-medium">Rich Content</label>
              <p className="text-xs text-muted-foreground">
                Full-featured rich text editor with tables, images, and formatting
              </p>
              <RichTextEditor
                content={content.richContent}
                onChange={(html) => setContent(prev => ({ ...prev, richContent: html }))}
                placeholder="Start creating amazing content..."
                minHeight="300px"
                maxLength={10000}
                showWordCount={true}
              />
            </div>

            <CMSTextField
              label="Additional Text"
              value={content.plainText}
              onChange={(value) => setContent(prev => ({ ...prev, plainText: value }))}
              type="textarea"
              placeholder="Additional content..."
              maxLength={1000}
              description="Additional text content with optional rich text mode"
            />

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="btn-modern">
                <Save className="h-4 w-4 mr-2" />
                Save Content
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setContent({
                  title: '',
                  description: '',
                  richContent: '',
                  plainText: ''
                })}
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </CardTitle>
            <CardDescription>
              See how your content will appear to visitors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  JSON
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="mt-6">
                <div className="border rounded-lg p-6 bg-background min-h-[400px]">
                  {renderPreview()}
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="mt-6">
                <div className="min-h-[400px]">
                  {renderCode()}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <Card className="card-modern mt-8">
        <CardHeader>
          <CardTitle>CMS Features</CardTitle>
          <CardDescription>
            Comprehensive content management capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Rich Text Editing</h4>
              <p className="text-sm text-muted-foreground">
                Bold, italic, underline, strikethrough, code formatting
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Advanced Typography</h4>
              <p className="text-sm text-muted-foreground">
                Headings, paragraphs, lists, blockquotes, text alignment
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Color & Highlighting</h4>
              <p className="text-sm text-muted-foreground">
                Text colors, background highlights, custom color palettes
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Media Support</h4>
              <p className="text-sm text-muted-foreground">
                Images, links, responsive media embedding
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Tables</h4>
              <p className="text-sm text-muted-foreground">
                Resizable tables, headers, cell formatting
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Content Security</h4>
              <p className="text-sm text-muted-foreground">
                HTML sanitization, XSS protection, clean output
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CMSDemo;
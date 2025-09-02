import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfessionalInlineEditor } from '@/components/editors/ProfessionalInlineEditor';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  Edit3, 
  Palette, 
  AlignCenter, 
  Bold, 
  Italic, 
  Link2,
  List,
  Highlighter,
  Code
} from 'lucide-react';

export const InlineEditingDemo: React.FC = () => {
  const [schema, setSchema] = useState({
    content: {
      title: "Professional Inline Editor Demo",
      subtitle: "Click any text below to start editing with 96+ colors, rich formatting, and professional controls",
      description: {
        type: 'tiptap',
        json: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This is a '
                },
                {
                  type: 'text',
                  marks: [{ type: 'bold' }],
                  text: 'professional inline editor'
                },
                {
                  type: 'text',
                  text: ' with '
                },
                {
                  type: 'text',
                  marks: [{ type: 'highlight', attrs: { color: '#FEF3C7' } }],
                  text: 'rich text formatting'
                },
                {
                  type: 'text',
                  text: ' capabilities including '
                },
                {
                  type: 'text',
                  marks: [{ type: 'textStyle', attrs: { color: '#3B82F6' } }],
                  text: 'colored text'
                },
                {
                  type: 'text',
                  text: ', '
                },
                {
                  type: 'text',
                  marks: [{ type: 'italic' }],
                  text: 'italics'
                },
                {
                  type: 'text',
                  text: ', '
                },
                {
                  type: 'text',
                  marks: [{ type: 'underline' }],
                  text: 'underlines'
                },
                {
                  type: 'text',
                  text: ', '
                },
                {
                  type: 'text',
                  marks: [{ type: 'strike' }],
                  text: 'strikethrough'
                },
                {
                  type: 'text',
                  text: ', and more!'
                }
              ]
            }
          ]
        }
      },
      features: [
        "Rich text formatting with bold, italic, underline, strikethrough",
        "Professional color palette with 96+ text colors organized by spectrum", 
        "40+ highlight colors with beautiful pastels and professional tones",
        "Text alignment (left, center, right, justify)",
        "Headings, lists, quotes, and inline code for comprehensive content",
        "Smart link insertion with auto-detection and validation",
        "Undo/redo functionality with full history management",
        "Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U, Enter/Escape)",
        "Auto-save with visual feedback and animated indicators",
        "Glass morphism effects and smooth animations",
        "Professional floating toolbar with organized sections",
        "Color-coded quick actions and enhanced accessibility"
      ],
      sampleText: "Click this text to see the amazing formatting toolbar with 96+ colors!",
      longContent: {
        type: 'tiptap',
        json: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [{ type: 'text', text: 'Advanced Features' }]
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'This multiline editor includes ' },
                { type: 'text', marks: [{ type: 'bold' }], text: 'headings' },
                { type: 'text', text: ', ' },
                { type: 'text', marks: [{ type: 'code' }], text: 'inline code' },
                { type: 'text', text: ', and comprehensive formatting options.' }
              ]
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Bullet lists for organization' }] }]
                },
                {
                  type: 'listItem', 
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Multiple formatting options' }] }]
                }
              ]
            }
          ]
        }
      }
    }
  });

  const features = [
    { icon: <Bold className="h-4 w-4" />, name: "Bold/Italic/Underline", color: "bg-blue-500" },
    { icon: <Palette className="h-4 w-4" />, name: "Color Selection", color: "bg-purple-500" },
    { icon: <Highlighter className="h-4 w-4" />, name: "Text Highlighting", color: "bg-yellow-500" },
    { icon: <AlignCenter className="h-4 w-4" />, name: "Text Alignment", color: "bg-green-500" },
    { icon: <List className="h-4 w-4" />, name: "Lists & Quotes", color: "bg-orange-500" },
    { icon: <Link2 className="h-4 w-4" />, name: "Link Insertion", color: "bg-red-500" },
    { icon: <Code className="h-4 w-4" />, name: "Code Formatting", color: "bg-gray-500" },
    { icon: <Edit3 className="h-4 w-4" />, name: "Auto-save", color: "bg-emerald-500" }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Type className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            <ProfessionalInlineEditor
              path="/content/title"
              value={schema.content.title}
              schema={schema}
              setSchema={setSchema}
              readOnly={false}
              placeholder="Enter title..."
              enableRichText={false}
              className="text-3xl font-bold"
            />
          </h1>
        </div>
        
        <p className="text-muted-foreground text-lg">
          <ProfessionalInlineEditor
            path="/content/subtitle"
            value={schema.content.subtitle}
            schema={schema}
            setSchema={setSchema}
            readOnly={false}
            placeholder="Enter subtitle..."
            enableRichText={false}
          />
        </p>
      </div>

      {/* Feature Overview */}
      <Card className="bg-gradient-to-br from-card to-muted/20 border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            Rich Text Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-card/50 border border-border/30">
                <div className={`p-1.5 rounded-md ${feature.color} text-white`}>
                  {feature.icon}
                </div>
                <span className="text-sm font-medium">{feature.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Single Line Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Single Line Editing
            <Badge variant="secondary">Basic Mode</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Simple inline text editing without rich formatting
          </p>
          <div className="p-4 border border-border/50 rounded-lg bg-muted/20">
            <ProfessionalInlineEditor
              path="/content/sampleText"
              value={schema.content.sampleText}
              schema={schema}
              setSchema={setSchema}
              readOnly={false}
              placeholder="Click to edit this text..."
              enableRichText={false}
              className="text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Rich Text Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Rich Text Editing
            <Badge>Advanced Mode</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Full rich text editing with formatting toolbar, colors, and advanced features
          </p>
          <div className="p-4 border border-border/50 rounded-lg bg-muted/20 min-h-[120px]">
            <ProfessionalInlineEditor
              path="/content/description"
              value={schema.content.description}
              schema={schema}
              setSchema={setSchema}
              readOnly={false}
              placeholder="Click to start rich text editing..."
              enableRichText={true}
              multiline={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* Multiline Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Multiline Rich Text
            <Badge variant="outline">Full Features</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Complete rich text editing with headings, lists, quotes, and all formatting options
          </p>
          <div className="p-4 border border-border/50 rounded-lg bg-muted/20 min-h-[200px]">
            <ProfessionalInlineEditor
              path="/content/longContent"
              value={schema.content.longContent}
              schema={schema}
              setSchema={setSchema}
              readOnly={false}
              placeholder="Click to start multiline rich text editing..."
              enableRichText={true}
              multiline={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {schema.content.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-md border border-border/30">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InlineEditingDemo;
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  Code,
  Type,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Check,
  X,
  Edit3,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  Hash,
  ChevronDown,
  Minus,
  Plus,
  Subscript,
  Superscript,
  Save,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Operation } from 'fast-json-patch';
import { applyPatchWithValidation } from '@/cms/patching/patch-validator';

// Enhanced professional color palettes with better organization
const textColors = [
  // Grayscale & Basic
  '#000000', '#1A1A1A', '#333333', '#4D4D4D', '#666666', '#808080', '#999999', '#B3B3B3', '#CCCCCC', '#E6E6E6', '#F5F5F5', '#FFFFFF',
  
  // Red Spectrum
  '#8B0000', '#B22222', '#DC143C', '#FF0000', '#FF6347', '#FF7F50', '#FFA07A', '#FFB6C1', '#FFC0CB', '#FFE4E1', '#FFF0F5', '#FFEBEE',
  
  // Orange Spectrum
  '#CC5500', '#FF4500', '#FF6600', '#FF7F00', '#FF8C00', '#FFA500', '#FFB347', '#FFCC99', '#FFDAB9', '#FFE4B5', '#FFF8DC', '#FDF2E9',
  
  // Yellow Spectrum
  '#B8860B', '#DAA520', '#FFD700', '#FFFF00', '#FFFF66', '#FFFF99', '#FFFFCC', '#FFFFF0', '#F9FBE7', '#F0F4C3', '#FFF9C4', '#FFFDE7',
  
  // Green Spectrum
  '#006400', '#228B22', '#32CD32', '#00FF00', '#7CFC00', '#ADFF2F', '#9AFF9A', '#98FB98', '#90EE90', '#F0FFF0', '#F1F8E9', '#E8F5E8',
  
  // Blue Spectrum  
  '#000080', '#0000CD', '#0000FF', '#1E90FF', '#00BFFF', '#87CEEB', '#ADD8E6', '#B0E0E6', '#E0F6FF', '#F0F8FF', '#E3F2FD', '#E1F5FE',
  
  // Purple Spectrum
  '#4B0082', '#6A0DAD', '#8A2BE2', '#9932CC', '#BA55D3', '#DA70D6', '#DDA0DD', '#EE82EE', '#F8BBD9', '#FAE8FF', '#F3E5F5', '#EDE7F6',
  
  // Professional Colors
  '#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#1ABC9C', '#16A085', '#E74C3C', '#C0392B', '#9B59B6', '#8E44AD', '#F39C12', '#E67E22'
];

const highlightColors = [
  // Soft Pastels
  '#FFF3CD', '#FCF3CF', '#FEF9E7', '#F7FEE7', '#ECFDF5', '#D1FAE5', '#A7F3D0', '#6EE7B7',
  '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#E0E7FF', '#C7D2FE', '#A5B4FC', '#818CF8',
  '#EDE9FE', '#DDD6FE', '#C4B5FD', '#A78BFA', '#FAE8FF', '#F3E8FF', '#E879F9', '#D946EF',
  '#FDF2F8', '#FCE7F3', '#FBCFE8', '#F9A8D4', '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171',
  '#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#FFEDD5', '#FED7AA', '#FDBA74', '#FB923C'
];

const fontSizes = [
  { label: 'XS', value: '0.75rem' },
  { label: 'SM', value: '0.875rem' },
  { label: 'Base', value: '1rem' },
  { label: 'LG', value: '1.125rem' },
  { label: 'XL', value: '1.25rem' },
  { label: '2XL', value: '1.5rem' },
  { label: '3XL', value: '1.875rem' }
];

type Props = {
  path: string;
  value?: string | { type: string; json: any };
  placeholder?: string;
  readOnly: boolean;
  schema: any;
  setSchema: (s: any) => void;
  className?: string;
  enableRichText?: boolean;
  multiline?: boolean;
};

export const ProfessionalInlineEditor: React.FC<Props> = ({
  path,
  value,
  placeholder = "Click to edit...",
  readOnly,
  schema,
  setSchema,
  className = "",
  enableRichText = true,
  multiline = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Handle both string and rich text values
  const initialContent = useMemo(() => {
    if (!value) return "";
    if (typeof value === 'string') return value;
    if (value.type === 'tiptap' && value.json) return value.json;
    return "";
  }, [value]);

  const extensions = useMemo(() => [
    StarterKit.configure({
      paragraph: { HTMLAttributes: { class: 'mb-2 last:mb-0' } },
      heading: { levels: [1, 2, 3] },
      bulletList: { HTMLAttributes: { class: 'list-disc ml-4' } },
      orderedList: { HTMLAttributes: { class: 'list-decimal ml-4' } },
      link: false, // Disable built-in link to avoid duplicates
      underline: false // Disable built-in underline to avoid duplicates
    }),
    Underline,
    Link.configure({
      autolink: true,
      defaultProtocol: 'https',
      openOnClick: false,
      linkOnPaste: true,
      HTMLAttributes: {
        class: 'text-primary underline hover:text-primary/80 transition-colors',
      },
    }),
    TextStyle,
    Color.configure({ types: ['textStyle'] }),
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({ placeholder }),
    Typography,
  ], [placeholder]);

  const applyPatchDebounced = useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (content: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const finalValue = enableRichText && content && typeof content === 'object'
          ? { type: 'tiptap', json: content }
          : (typeof content === 'string' ? content : editor?.getText() || "");
        
        const op: Operation = value == null
          ? { op: "add", path, value: finalValue }
          : { op: "replace", path, value: finalValue };
          
        const next = applyPatchWithValidation(schema, [op]);
        setSchema(next);
        setHasChanges(false);
      }, 300);
    };
  }, [schema, setSchema, path, value, enableRichText]);

  const editor = useEditor({
    extensions,
    content: initialContent,
    editable: !readOnly && isEditing,
    onUpdate: ({ editor }) => {
      if (enableRichText) {
        applyPatchDebounced(editor.getJSON());
      } else {
        applyPatchDebounced(editor.getText());
      }
      setHasChanges(true);
    },
  });

  const handleSave = useCallback(() => {
    if (editor) {
      const content = enableRichText ? editor.getJSON() : editor.getText();
      applyPatchDebounced(content);
    }
    setIsEditing(false);
    setHasChanges(false);
  }, [editor, enableRichText, applyPatchDebounced]);

  const handleCancel = useCallback(() => {
    if (editor) {
      editor.commands.setContent(initialContent);
    }
    setIsEditing(false);
    setHasChanges(false);
  }, [editor, initialContent]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  }, [handleSave, handleCancel, multiline]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  if (readOnly) {
    return (
      <div 
        className={cn(
          "inline-block min-h-[1.2em] relative",
          className
        )}
        data-editable="false"
      >
        {enableRichText && editor ? (
          <EditorContent 
            editor={editor} 
            className="prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-0"
          />
        ) : (
          <span>
            {(typeof value === 'string' ? value : editor?.getText()) || (
              <span className="text-muted-foreground/60 italic">
                {placeholder || "No content"}
              </span>
            )}
          </span>
        )}
      </div>
    );
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title,
    disabled = false
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode; 
    title: string;
    disabled?: boolean;
  }) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant={isActive ? "default" : "ghost"}
        size="sm"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "h-7 w-7 p-0 transition-all duration-200",
          isActive && "bg-primary text-primary-foreground shadow-sm"
        )}
        title={title}
      >
        {children}
      </Button>
    </motion.div>
  );

  const ColorPicker = ({ 
    colors, 
    onColorSelect, 
    onRemoveColor, 
    icon, 
    title 
  }: {
    colors: string[];
    onColorSelect: (color: string) => void;
    onRemoveColor: () => void;
    icon: React.ReactNode;
    title: string;
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <ToolbarButton onClick={() => {}} title={title}>
            {icon}
          </ToolbarButton>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4 bg-card/98 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl" align="start">
        <DropdownMenuLabel className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          {icon}
          {title}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mb-4" />
        
        {/* Professional Color Grid with sections */}
        <div className="space-y-4">
          {title === "Text Color" && (
            <>
              {/* Grayscale Section */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Grayscale</div>
                <div className="grid grid-cols-12 gap-1.5">
                  {colors.slice(0, 12).map((color, index) => (
                    <motion.button
                      key={`grayscale-${index}`}
                      whileHover={{ scale: 1.2, y: -3, rotateY: 15 }}
                      whileTap={{ scale: 0.9 }}
                      className="group relative w-6 h-6 rounded-lg border border-border/30 hover:border-primary/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/20"
                      style={{ backgroundColor: color }}
                      onClick={() => onColorSelect(color)}
                      title={`Set color to ${color}`}
                    >
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {(color === '#FFFFFF' || color === '#F5F5F5' || color === '#E6E6E6') && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-80 transition-opacity">
                          <Check className="h-2.5 w-2.5 text-gray-700" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Color Spectrum Sections */}
              {[
                { name: 'Reds', slice: [12, 24] },
                { name: 'Oranges', slice: [24, 36] },
                { name: 'Yellows', slice: [36, 48] },
                { name: 'Greens', slice: [48, 60] },
                { name: 'Blues', slice: [60, 72] },
                { name: 'Purples', slice: [72, 84] },
                { name: 'Professional', slice: [84, 96] }
              ].map(({ name, slice }) => (
                <div key={name}>
                  <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{name}</div>
                  <div className="grid grid-cols-12 gap-1.5">
                    {colors.slice(slice[0], slice[1]).map((color, index) => (
                      <motion.button
                        key={`${name}-${index}`}
                        whileHover={{ scale: 1.2, y: -3, rotateY: 15 }}
                        whileTap={{ scale: 0.9 }}
                        className="group relative w-6 h-6 rounded-lg border border-border/30 hover:border-primary/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/20"
                        style={{ backgroundColor: color }}
                        onClick={() => onColorSelect(color)}
                        title={`Set color to ${color}`}
                      >
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {title === "Highlight" && (
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Highlight Colors</div>
              <div className="grid grid-cols-8 gap-2">
                {colors.map((color, index) => (
                  <motion.button
                    key={`highlight-${index}`}
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="group relative w-8 h-8 rounded-xl border-2 border-border/30 hover:border-primary/60 transition-all duration-300 shadow-lg hover:shadow-xl"
                    style={{ backgroundColor: color }}
                    onClick={() => onColorSelect(color)}
                    title={`Set highlight to ${color}`}
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-1 bg-gray-800/60 rounded opacity-40 group-hover:opacity-80 transition-opacity" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced Quick Actions */}
        <DropdownMenuSeparator className="my-4" />
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Quick Actions</div>
          
          <motion.div whileHover={{ x: 4 }} className="space-y-1">
            <DropdownMenuItem
              onClick={onRemoveColor}
              className="text-sm flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-400 cursor-pointer transition-all duration-200"
            >
              <div className="w-5 h-5 rounded-md bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <X className="h-3 w-3 text-red-600 dark:text-red-400" />
              </div>
              <span className="font-medium">Remove {title.toLowerCase()}</span>
            </DropdownMenuItem>
            
            {title === "Text Color" && (
              <DropdownMenuItem
                onClick={() => onColorSelect('#000000')}
                className="text-sm flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 cursor-pointer transition-all duration-200"
              >
                <div className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Type className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">Default text color</span>
              </DropdownMenuItem>
            )}

            {title === "Highlight" && (
              <DropdownMenuItem
                onClick={() => onColorSelect('#FEF3C7')}
                className="text-sm flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-950/30 dark:hover:text-yellow-400 cursor-pointer transition-all duration-200"
              >
                <div className="w-5 h-5 rounded-md bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                  <Highlighter className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                </div>
                <span className="font-medium">Default highlight</span>
              </DropdownMenuItem>
            )}
          </motion.div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="relative group">
      <motion.div
        className="relative"
        initial={{ opacity: 0.9 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Editor Content */}
        <div
          className={cn(
            "relative transition-all duration-300 rounded-lg",
            isEditing 
              ? "bg-card border-2 border-primary shadow-lg shadow-primary/10 p-3"
              : "border-2 border-dashed border-transparent hover:border-border/40 p-1 min-h-[2rem]",
            multiline ? "min-h-[4rem]" : "min-h-[2rem]",
            className
          )}
          onClick={() => !isEditing && setIsEditing(true)}
          onKeyDown={handleKeyDown}
          data-editable={!readOnly}
          data-inline-on={!readOnly}
        >
          {editor && (
            <EditorContent 
              editor={editor}
              className={cn(
                "prose prose-sm max-w-none",
                "[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[1.5rem]",
                isEditing ? "[&_.ProseMirror]:p-0" : "[&_.ProseMirror]:p-1",
                !isEditing && "cursor-pointer"
              )}
            />
          )}
          
          {/* Empty state */}
          {!isEditing && editor?.isEmpty && (
            <div className="absolute inset-0 flex items-center px-2">
              <span className="text-muted-foreground/60 italic text-sm">
                {placeholder}
              </span>
            </div>
          )}
        </div>

        {/* Rich Text Toolbar */}
        <AnimatePresence>
          {isEditing && enableRichText && editor && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute -top-20 left-0 right-0 z-50"
            >
              <div className="bg-card/95 backdrop-blur-lg border border-border/50 rounded-xl shadow-2xl p-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* History Controls */}
                  <div className="flex items-center gap-1">
                    <ToolbarButton
                      onClick={() => editor.chain().focus().undo().run()}
                      disabled={!editor.can().chain().focus().undo().run()}
                      title="Undo (Ctrl+Z)"
                    >
                      <Undo className="h-3.5 w-3.5" />
                    </ToolbarButton>
                    
                    <ToolbarButton
                      onClick={() => editor.chain().focus().redo().run()}
                      disabled={!editor.can().chain().focus().redo().run()}
                      title="Redo (Ctrl+Y)"
                    >
                      <Redo className="h-3.5 w-3.5" />
                    </ToolbarButton>
                  </div>

                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Headings for multiline */}
                  {multiline && (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div>
                            <ToolbarButton onClick={() => {}} title="Headings">
                              <div className="flex items-center gap-1">
                                <Hash className="h-3.5 w-3.5" />
                                <ChevronDown className="h-2.5 w-2.5" />
                              </div>
                            </ToolbarButton>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48" align="start">
                          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                            Text Style
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => editor.chain().focus().setParagraph().run()}
                            className={cn(
                              "flex items-center gap-2",
                              editor.isActive('paragraph') && "bg-primary/10 text-primary"
                            )}
                          >
                            <Type className="h-4 w-4" />
                            <span>Paragraph</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={cn(
                              "flex items-center gap-2",
                              editor.isActive('heading', { level: 1 }) && "bg-primary/10 text-primary"
                            )}
                          >
                            <Heading1 className="h-4 w-4" />
                            <span>Heading 1</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={cn(
                              "flex items-center gap-2",
                              editor.isActive('heading', { level: 2 }) && "bg-primary/10 text-primary"
                            )}
                          >
                            <Heading2 className="h-4 w-4" />
                            <span>Heading 2</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={cn(
                              "flex items-center gap-2",
                              editor.isActive('heading', { level: 3 }) && "bg-primary/10 text-primary"
                            )}
                          >
                            <Heading3 className="h-4 w-4" />
                            <span>Heading 3</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Separator orientation="vertical" className="h-6 mx-1" />
                    </>
                  )}

                  {/* Text Formatting */}
                  <div className="flex items-center gap-1">
                    <ToolbarButton
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      isActive={editor.isActive('bold')}
                      title="Bold (Ctrl+B)"
                    >
                      <Bold className="h-3.5 w-3.5" />
                    </ToolbarButton>
                    
                    <ToolbarButton
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      isActive={editor.isActive('italic')}
                      title="Italic (Ctrl+I)"
                    >
                      <Italic className="h-3.5 w-3.5" />
                    </ToolbarButton>
                    
                    <ToolbarButton
                      onClick={() => editor.chain().focus().toggleUnderline().run()}
                      isActive={editor.isActive('underline')}
                      title="Underline (Ctrl+U)"
                    >
                      <UnderlineIcon className="h-3.5 w-3.5" />
                    </ToolbarButton>
                    
                    <ToolbarButton
                      onClick={() => editor.chain().focus().toggleStrike().run()}
                      isActive={editor.isActive('strike')}
                      title="Strikethrough"
                    >
                      <Strikethrough className="h-3.5 w-3.5" />
                    </ToolbarButton>

                    <ToolbarButton
                      onClick={() => editor.chain().focus().toggleCode().run()}
                      isActive={editor.isActive('code')}
                      title="Inline Code"
                    >
                      <Code className="h-3.5 w-3.5" />
                    </ToolbarButton>
                  </div>

                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Enhanced Colors */}
                  <div className="flex items-center gap-1">
                    <ColorPicker
                      colors={textColors}
                      onColorSelect={(color) => editor.chain().focus().setColor(color).run()}
                      onRemoveColor={() => editor.chain().focus().unsetColor().run()}
                      icon={<Type className="h-3.5 w-3.5" />}
                      title="Text Color"
                    />
                    
                    <ColorPicker
                      colors={highlightColors}
                      onColorSelect={(color) => editor.chain().focus().setHighlight({ color }).run()}
                      onRemoveColor={() => editor.chain().focus().unsetHighlight().run()}
                      icon={<Highlighter className="h-3.5 w-3.5" />}
                      title="Highlight"
                    />
                  </div>

                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Text Alignment */}
                  <div className="flex items-center gap-1">
                    <ToolbarButton
                      onClick={() => editor.chain().focus().setTextAlign('left').run()}
                      isActive={editor.isActive({ textAlign: 'left' })}
                      title="Align Left"
                    >
                      <AlignLeft className="h-3.5 w-3.5" />
                    </ToolbarButton>
                    
                    <ToolbarButton
                      onClick={() => editor.chain().focus().setTextAlign('center').run()}
                      isActive={editor.isActive({ textAlign: 'center' })}
                      title="Align Center"
                    >
                      <AlignCenter className="h-3.5 w-3.5" />
                    </ToolbarButton>
                    
                    <ToolbarButton
                      onClick={() => editor.chain().focus().setTextAlign('right').run()}
                      isActive={editor.isActive({ textAlign: 'right' })}
                      title="Align Right"
                    >
                      <AlignRight className="h-3.5 w-3.5" />
                    </ToolbarButton>

                    <ToolbarButton
                      onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                      isActive={editor.isActive({ textAlign: 'justify' })}
                      title="Justify"
                    >
                      <AlignJustify className="h-3.5 w-3.5" />
                    </ToolbarButton>
                  </div>

                  {multiline && (
                    <>
                      <Separator orientation="vertical" className="h-6 mx-1" />
                      
                      {/* Lists & Quote */}
                      <div className="flex items-center gap-1">
                        <ToolbarButton
                          onClick={() => editor.chain().focus().toggleBulletList().run()}
                          isActive={editor.isActive('bulletList')}
                          title="Bullet List"
                        >
                          <List className="h-3.5 w-3.5" />
                        </ToolbarButton>
                        
                        <ToolbarButton
                          onClick={() => editor.chain().focus().toggleOrderedList().run()}
                          isActive={editor.isActive('orderedList')}
                          title="Numbered List"
                        >
                          <ListOrdered className="h-3.5 w-3.5" />
                        </ToolbarButton>
                        
                        <ToolbarButton
                          onClick={() => editor.chain().focus().toggleBlockquote().run()}
                          isActive={editor.isActive('blockquote')}
                          title="Quote"
                        >
                          <Quote className="h-3.5 w-3.5" />
                        </ToolbarButton>
                      </div>
                    </>
                  )}

                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Link */}
                  <ToolbarButton
                    onClick={addLink}
                    isActive={editor.isActive('link')}
                    title="Add Link"
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                  </ToolbarButton>

                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Save/Cancel */}
                  <div className="flex items-center gap-2 ml-auto">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="h-8 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                        title="Save (Enter)"
                      >
                        <Save className="h-3.5 w-3.5 mr-2" />
                        Save
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        className="h-8 px-4 border-border/50 hover:bg-muted/50"
                        title="Cancel (Escape)"
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-2" />
                        Cancel
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simple Save/Cancel for non-rich text */}
        <AnimatePresence>
          {isEditing && !enableRichText && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute -top-10 right-0 flex items-center gap-1 bg-card border border-border rounded-lg shadow-lg px-2 py-1"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="w-6 h-6 flex items-center justify-center rounded bg-green-500 hover:bg-green-600 text-white transition-colors"
                title="Save (Enter)"
              >
                <Check className="h-3 w-3" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="w-6 h-6 flex items-center justify-center rounded bg-red-500 hover:bg-red-600 text-white transition-colors"
                title="Cancel (Escape)"
              >
                <X className="h-3 w-3" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auto-save indicator */}
        <AnimatePresence>
          {hasChanges && !isEditing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-8 left-0 flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Auto-saving...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover Edit Indicator */}
        {!isEditing && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
            whileHover={{ scale: 1.2 }}
          >
            <Edit3 className="h-3 w-3 text-primary" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfessionalInlineEditor;
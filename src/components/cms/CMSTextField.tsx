import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RichTextEditor } from './RichTextEditor';
import { Type, AlignLeft, Eye, EyeOff } from 'lucide-react';

interface CMSTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'textarea' | 'rich';
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  description?: string;
  className?: string;
}

export const CMSTextField: React.FC<CMSTextFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  maxLength = 5000,
  description,
  className = ''
}) => {
  const [isRichTextMode, setIsRichTextMode] = useState(type === 'rich');
  const [showPreview, setShowPreview] = useState(false);

  const renderInput = () => {
    if (type === 'rich' || isRichTextMode) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {type !== 'rich' && (
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={isRichTextMode}
                    onCheckedChange={setIsRichTextMode}
                    id={`rich-mode-${label}`}
                  />
                  <Label htmlFor={`rich-mode-${label}`} className="text-xs text-muted-foreground">
                    Rich text mode
                  </Label>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs"
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-3 w-3 mr-1" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </>
              )}
            </Button>
          </div>
          
          {showPreview ? (
            <Card className="p-4 min-h-[200px]">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: value || '<p class="text-muted-foreground">No content</p>' }}
              />
            </Card>
          ) : (
            <RichTextEditor
              content={value}
              onChange={onChange}
              placeholder={placeholder}
              maxLength={maxLength}
              minHeight="200px"
            />
          )}
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch 
                checked={isRichTextMode}
                onCheckedChange={setIsRichTextMode}
                id={`rich-mode-${label}`}
              />
              <Label htmlFor={`rich-mode-${label}`} className="text-xs text-muted-foreground">
                Rich text mode
              </Label>
            </div>
            <span className="text-xs text-muted-foreground">
              {value.length}/{maxLength}
            </span>
          </div>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="min-h-[120px] resize-y"
          />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch 
              checked={isRichTextMode}
              onCheckedChange={setIsRichTextMode}
              id={`rich-mode-${label}`}
            />
            <Label htmlFor={`rich-mode-${label}`} className="text-xs text-muted-foreground">
              Rich text mode
            </Label>
          </div>
          {maxLength && (
            <span className="text-xs text-muted-foreground">
              {value.length}/{maxLength}
            </span>
          )}
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      </div>
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Type className="h-4 w-4 text-muted-foreground" />
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      {renderInput()}
    </div>
  );
};

export default CMSTextField;
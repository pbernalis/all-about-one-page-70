import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface QuickPromptPillProps {
  onActivate: () => void;
  className?: string;
}

export const QuickPromptPill: React.FC<QuickPromptPillProps> = ({
  onActivate,
  className
}) => {
  return (
    <Button
      onClick={onActivate}
      className={cn(
        "fixed right-6 bottom-6 z-50 h-12 px-4 gap-2",
        "bg-gradient-primary text-white shadow-lg hover:shadow-xl",
        "transition-all duration-200 hover:scale-105",
        "animate-pulse hover:animate-none",
        className
      )}
      size="sm"
    >
      <div className="relative">
        <Bot className="h-4 w-4" />
        <Sparkles className="h-2 w-2 absolute -top-1 -right-1 text-yellow-300" />
      </div>
      Ask AI
    </Button>
  );
};
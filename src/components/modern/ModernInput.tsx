import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface ModernInputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  floating?: boolean;
}

export const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  ({ className, icon, floating, placeholder, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <motion.div
          animate={{ scale: focused ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Input
            ref={ref}
            className={cn(
              "focus-modern transition-all duration-200",
              icon && "pl-10",
              floating && hasValue && "pt-6 pb-2",
              className
            )}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              setHasValue(!!e.target.value);
            }}
            onChange={(e) => setHasValue(!!e.target.value)}
            placeholder={floating ? "" : placeholder}
            {...props}
          />
        </motion.div>
        {floating && placeholder && (
          <motion.label
            className={cn(
              "absolute left-3 text-muted-foreground pointer-events-none transition-all duration-200",
              (focused || hasValue) 
                ? "top-2 text-xs text-primary" 
                : "top-1/2 -translate-y-1/2 text-sm"
            )}
            animate={{
              y: (focused || hasValue) ? -8 : 0,
              scale: (focused || hasValue) ? 0.85 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {placeholder}
          </motion.label>
        )}
      </div>
    );
  }
);

ModernInput.displayName = "ModernInput";
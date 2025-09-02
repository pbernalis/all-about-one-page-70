import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ModernButtonProps extends ButtonProps {
  glow?: boolean;
  gradient?: boolean;
  pulse?: boolean;
}

export const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, glow, gradient, pulse, children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          ref={ref}
          className={cn(
            "btn-modern focus-modern",
            glow && "hover-glow",
            gradient && "bg-gradient-primary hover:opacity-90",
            pulse && "animate-pulse",
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

ModernButton.displayName = "ModernButton";
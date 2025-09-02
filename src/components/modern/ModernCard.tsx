import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
  gradient?: boolean;
}

export const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, glass, hover, gradient, children, ...props }, ref) => {
    const cardVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      hover: hover ? { y: -4, scale: 1.02 } : {}
    };

    return (
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card
          ref={ref}
          className={cn(
            "card-modern",
            glass && "glass",
            gradient && "bg-gradient-canvas",
            hover && "hover-lift",
            className
          )}
          {...props}
        >
          {children}
        </Card>
      </motion.div>
    );
  }
);

ModernCard.displayName = "ModernCard";
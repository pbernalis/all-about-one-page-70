import React from 'react';
import { motion } from 'framer-motion';
import { ModernCard } from '@/components/modern/ModernCard';
import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ModernFeaturesProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
  layout?: 'grid' | 'list';
}

export const ModernFeatures: React.FC<ModernFeaturesProps> = ({
  title,
  subtitle,
  features,
  layout = 'grid'
}) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className={
            layout === 'grid'
              ? "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              : "space-y-8"
          }
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ModernCard hover glass className="h-full p-8">
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-glow mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ModernCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
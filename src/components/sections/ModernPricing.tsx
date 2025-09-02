import React from 'react';
import { motion } from 'framer-motion';
import { ModernCard } from '@/components/modern/ModernCard';
import { ModernButton } from '@/components/modern/ModernButton';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingTier {
  name: string;
  price: {
    monthly: number;
    annual: number;
  };
  description: string;
  features: string[];
  popular?: boolean;
  cta: {
    text: string;
    href?: string;
  };
}

interface ModernPricingProps {
  title?: string;
  subtitle?: string;
  tiers: PricingTier[];
  billing: 'monthly' | 'annual';
  onBillingChange?: (billing: 'monthly' | 'annual') => void;
}

export const ModernPricing: React.FC<ModernPricingProps> = ({
  title,
  subtitle,
  tiers,
  billing,
  onBillingChange
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

  const getPrice = (tier: PricingTier) => {
    return billing === 'monthly' ? tier.price.monthly : tier.price.annual;
  };

  const getSavings = (tier: PricingTier) => {
    const monthlyTotal = tier.price.monthly * 12;
    const annualPrice = tier.price.annual;
    return Math.round(((monthlyTotal - annualPrice) / monthlyTotal) * 100);
  };

  return (
    <section className="py-24 sm:py-32 bg-gradient-mesh">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center mb-16"
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

            {onBillingChange && (
              <div className="mt-8 flex justify-center">
                <div className="relative bg-muted p-1 rounded-full flex">
                  <button
                    onClick={() => onBillingChange('monthly')}
                    className={cn(
                      "relative px-6 py-2 text-sm font-medium rounded-full transition-all",
                      billing === 'monthly'
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => onBillingChange('annual')}
                    className={cn(
                      "relative px-6 py-2 text-sm font-medium rounded-full transition-all",
                      billing === 'annual'
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Annual
                    <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      Save up to 20%
                    </span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {tiers.map((tier, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ModernCard
                hover
                glass={!tier.popular}
                gradient={tier.popular}
                className={cn(
                  "relative h-full p-8",
                  tier.popular && "ring-2 ring-primary shadow-glow scale-105"
                )}
              >
                {tier.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <div className="flex items-center gap-1 bg-gradient-primary text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                      <Star className="h-4 w-4 fill-current" />
                      Most Popular
                    </div>
                  </motion.div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {tier.name}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6">
                    {tier.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        ${getPrice(tier)}
                      </span>
                      <span className="text-muted-foreground">
                        /{billing === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    
                    {billing === 'annual' && getSavings(tier) > 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-green-600 mt-1"
                      >
                        Save {getSavings(tier)}% annually
                      </motion.p>
                    )}
                  </div>

                  <ModernButton
                    className="w-full mb-8"
                    variant={tier.popular ? "default" : "outline"}
                    gradient={tier.popular}
                    glow={tier.popular}
                    size="lg"
                  >
                    {tier.cta.text}
                  </ModernButton>
                </div>

                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + featureIndex * 0.1 }}
                    >
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </ModernCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
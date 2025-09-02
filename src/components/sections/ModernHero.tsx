import React from 'react';
import { motion } from 'framer-motion';
import { ModernButton } from '@/components/modern/ModernButton';
import { ArrowRight, Play, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryCta?: {
    text: string;
    href?: string;
  };
  secondaryCta?: {
    text: string;
    href?: string;
  };
  rating?: {
    stars: number;
    text: string;
  };
  image?: string;
  video?: string;
}

export const ModernHero: React.FC<ModernHeroProps> = ({
  eyebrow,
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  rating,
  image,
  video
}) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-mesh">
      <div className="absolute inset-0 bg-gradient-canvas opacity-50" />
      
      <div className="relative px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-7xl"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              {eyebrow && (
                <motion.div variants={itemVariants}>
                  <span className="inline-flex items-center rounded-full bg-primary-soft px-4 py-1.5 text-sm font-medium text-primary">
                    {eyebrow}
                  </span>
                </motion.div>
              )}

              <motion.h1
                variants={itemVariants}
                className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
              >
                {title.split(' ').map((word, index) => (
                  <motion.span
                    key={index}
                    className={index === 0 ? "text-gradient" : ""}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {word}{' '}
                  </motion.span>
                ))}
              </motion.h1>

              {subtitle && (
                <motion.h2
                  variants={itemVariants}
                  className="mt-4 text-xl font-semibold text-muted-foreground"
                >
                  {subtitle}
                </motion.h2>
              )}

              {description && (
                <motion.p
                  variants={itemVariants}
                  className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto lg:mx-0"
                >
                  {description}
                </motion.p>
              )}

              {rating && (
                <motion.div
                  variants={itemVariants}
                  className="mt-6 flex items-center gap-2 justify-center lg:justify-start"
                >
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < rating.stars
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{rating.text}</span>
                </motion.div>
              )}

              <motion.div
                variants={itemVariants}
                className="mt-10 flex items-center gap-4 justify-center lg:justify-start flex-wrap"
              >
                {primaryCta && (
                  <ModernButton
                    size="lg"
                    gradient
                    glow
                    className="group"
                  >
                    {primaryCta.text}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </ModernButton>
                )}

                {secondaryCta && (
                  <ModernButton
                    variant="outline"
                    size="lg"
                    className="group"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {secondaryCta.text}
                  </ModernButton>
                )}
              </motion.div>
            </div>

            {/* Media */}
            {(image || video) && (
              <motion.div
                variants={itemVariants}
                className="relative lg:order-last"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-strong">
                  {video ? (
                    <video
                      src={video}
                      autoPlay
                      muted
                      loop
                      className="w-full h-auto aspect-video object-cover"
                    />
                  ) : image ? (
                    <img
                      src={image}
                      alt="Hero"
                      className="w-full h-auto aspect-video object-cover"
                    />
                  ) : null}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-primary rounded-full opacity-20"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-primary rounded-full opacity-15"
                  animate={{
                    y: [0, 10, 0],
                    rotate: [360, 180, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
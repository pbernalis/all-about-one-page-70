/**
 * Performance utilities for responsive images
 */

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Generate responsive srcSet for images
 * Usage: <img {...createResponsiveImage({ src: '/hero.jpg', alt: 'Hero' })} />
 */
export function createResponsiveImage({
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className,
  loading = 'lazy',
}: ResponsiveImageProps) {
  // Generate common responsive breakpoints
  const widths = [640, 768, 1024, 1280, 1920];
  
  const srcSet = widths
    .map(width => `${src}?w=${width} ${width}w`)
    .join(', ');

  return {
    src,
    srcSet,
    sizes,
    alt,
    className,
    loading,
    decoding: 'async' as const,
  };
}

/**
 * Preload critical images
 * Usage: preloadImage('/hero.jpg');
 */
export function preloadImage(src: string, as: 'image' = 'image') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = src;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Lazy load images with Intersection Observer
 * Usage: <img {...createLazyImage({ src: '/image.jpg', alt: 'Description' })} />
 */
export function createLazyImage({ src, alt, className }: Omit<ResponsiveImageProps, 'loading'>) {
  return {
    'data-src': src,
    alt,
    className: `${className || ''} lazy-image`,
    loading: 'lazy' as const,
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E',
  };
}

/**
 * Initialize lazy loading with Intersection Observer
 * Call this once in your app initialization
 */
export function initializeLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const dataSrc = img.getAttribute('data-src');
          if (dataSrc) {
            img.src = dataSrc;
            img.removeAttribute('data-src');
            img.classList.remove('lazy-image');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // Observe all lazy images
    document.querySelectorAll('.lazy-image').forEach((img) => {
      imageObserver.observe(img);
    });
  }
}
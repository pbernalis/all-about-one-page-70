import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  alt?: string;
  title?: string;
  thumbnail?: string; // for videos
}

interface ProductGalleryProps {
  data: {
    title?: string;
    subtitle?: string;
    items: MediaItem[];
    autoplay?: boolean;
    show_thumbnails?: boolean;
    max_height?: string;
  };
}

export function ProductGallery({ data }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    title = 'Gallery',
    subtitle,
    items = [],
    autoplay = false,
    show_thumbnails = true,
    max_height = '500px'
  } = data;

  const currentItem = items[currentIndex];

  // Auto-advance for images when playing
  useEffect(() => {
    if (isPlaying && currentItem?.type === 'image') {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % items.length);
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentItem?.type, items.length]);

  // Handle video play/pause
  useEffect(() => {
    if (currentItem?.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentItem?.type]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!showLightbox) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        setLightboxIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'ArrowRight':
        setLightboxIndex((prev) => (prev + 1) % items.length);
        break;
      case 'Escape':
        setShowLightbox(false);
        break;
    }
  };

  useEffect(() => {
    if (showLightbox) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showLightbox]);

  if (!items.length) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No media items to display</p>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground mt-2">{subtitle}</p>
            )}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Main Gallery */}
          <Card className="overflow-hidden">
            <div className="relative" style={{ height: max_height }}>
              {/* Main Media Display */}
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                {currentItem?.type === 'image' ? (
                  <img
                    src={currentItem.url}
                    alt={currentItem.alt || currentItem.title || 'Gallery item'}
                    className="max-w-full max-h-full object-contain cursor-zoom-in"
                    onClick={() => openLightbox(currentIndex)}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={currentItem?.url}
                    className="max-w-full max-h-full object-contain"
                    controls={false}
                    loop
                    muted={autoplay}
                    autoPlay={autoplay}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                )}

                {/* Navigation Arrows */}
                {items.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                      onClick={goToPrevious}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                      onClick={goToNext}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}

                {/* Play/Pause Controls */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/50 text-white hover:bg-black/70"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {currentItem?.type === 'image' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/50 text-white hover:bg-black/70"
                      onClick={() => openLightbox(currentIndex)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Item Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                  {currentIndex + 1} / {items.length}
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            {show_thumbnails && items.length > 1 && (
              <div className="p-4 border-t">
                <div className="flex gap-2 overflow-x-auto">
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                        index === currentIndex
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.alt || `Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center relative">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={`Video thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={item.url}
                              className="w-full h-full object-cover"
                              muted
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-4 w-4 text-white bg-black/50 rounded-full p-1" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Item Title/Description */}
          {currentItem?.title && (
            <div className="mt-4 text-center">
              <h3 className="font-semibold">{currentItem.title}</h3>
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        <Dialog open={showLightbox} onOpenChange={setShowLightbox}>
          <DialogContent className="max-w-screen-2xl w-full h-full max-h-screen p-0 bg-black/95">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                onClick={() => setShowLightbox(false)}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Lightbox Navigation */}
              {items.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-40"
                    onClick={() => setLightboxIndex((prev) => (prev - 1 + items.length) % items.length)}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-40"
                    onClick={() => setLightboxIndex((prev) => (prev + 1) % items.length)}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              {/* Lightbox Media */}
              <div className="w-full h-full flex items-center justify-center p-8">
                {items[lightboxIndex]?.type === 'image' ? (
                  <img
                    src={items[lightboxIndex].url}
                    alt={items[lightboxIndex].alt || 'Lightbox image'}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <video
                    src={items[lightboxIndex]?.url}
                    className="max-w-full max-h-full object-contain"
                    controls
                    autoPlay
                  />
                )}
              </div>

              {/* Lightbox Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded">
                {lightboxIndex + 1} / {items.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
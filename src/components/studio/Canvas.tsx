import React from 'react';
import { PageSchema } from '@/pages/StudioModern';
import { SectionRenderer } from './SectionRenderer';
import { Monitor, Smartphone, Tablet, Settings, Eye, Code, Palette, Grid3X3, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CanvasProps {
  schema: PageSchema | null;
}

export const Canvas: React.FC<CanvasProps> = ({ schema }) => {
  const [viewportSize, setViewportSize] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showGrid, setShowGrid] = React.useState(false);
  const [showLayers, setShowLayers] = React.useState(false);
  const [canvasZoom, setCanvasZoom] = React.useState(100);

  const getCanvasWidth = () => {
    switch (viewportSize) {
      case 'mobile': return 'max-w-sm mx-auto';
      case 'tablet': return 'max-w-2xl mx-auto';
      default: return 'w-full';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Professional Toolbar */}
      <div className="relative backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <div className="relative p-4 flex items-center justify-between">
          {/* Left: Page Title & Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
              <h2 className="font-semibold text-foreground/90 flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                {schema?.name || 'Design Canvas'}
              </h2>
            </div>
            <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
              {schema?.sections?.length || 0} sections
            </div>
          </div>
          
          {/* Center: Zoom & Tools */}
          <div className="flex items-center gap-3">
            {/* Zoom Control */}
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-1.5 shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCanvasZoom(Math.max(25, canvasZoom - 25))}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                -
              </Button>
              <span className="text-xs font-medium min-w-[3rem] text-center text-foreground/80">
                {canvasZoom}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCanvasZoom(Math.min(200, canvasZoom + 25))}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                +
              </Button>
            </div>

            {/* Canvas Tools */}
            <div className="flex items-center gap-1 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-1 shadow-sm">
              <Button
                variant={showGrid ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  showGrid && "bg-primary/10 text-primary shadow-sm"
                )}
                title="Toggle Grid"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={showLayers ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setShowLayers(!showLayers)}
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  showLayers && "bg-primary/10 text-primary shadow-sm"
                )}
                title="Toggle Layers"
              >
                <Layers className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                title="Canvas Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right: Viewport Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">View:</span>
            <div className="flex items-center gap-1 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-1 shadow-sm">
              <Button
                variant={viewportSize === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewportSize('desktop')}
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  viewportSize === 'desktop' && "bg-primary text-primary-foreground shadow-md scale-105"
                )}
                title="Desktop View"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewportSize === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewportSize('tablet')}
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  viewportSize === 'tablet' && "bg-primary text-primary-foreground shadow-md scale-105"
                )}
                title="Tablet View"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewportSize === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewportSize('mobile')}
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  viewportSize === 'mobile' && "bg-primary text-primary-foreground shadow-md scale-105"
                )}
                title="Mobile View"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Canvas Content */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-muted/5 to-muted/10 relative">
        {/* Grid Overlay */}
        {showGrid && (
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none z-10"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        )}
        
        <div className="p-8">
          {schema ? (
            <div 
              className={cn(
                "transition-all duration-300 mx-auto",
                getCanvasWidth()
              )}
              style={{ 
                transform: `scale(${canvasZoom / 100})`,
                transformOrigin: 'top center'
              }}
            >
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-border/20 relative group">
                {/* Canvas Border Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                
                {/* Content */}
                <div className="relative bg-white rounded-xl overflow-hidden">
                  {schema.sections?.map((section, index) => (
                    <div key={section.id} className="relative group/section">
                      {/* Section Hover Indicator */}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/section:opacity-100 transition-opacity duration-200 pointer-events-none z-10" />
                      <SectionRenderer section={section} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-lg">
                {/* Enhanced Empty State */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary via-primary/80 to-secondary rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-primary/25">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full animate-pulse" />
                    <Monitor className="h-16 w-16 text-white relative z-10" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl animate-pulse" />
                </div>
                
                <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
                  Design Canvas Ready
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Start your creative journey by selecting a template or chat with AI to generate a custom design that matches your vision.
                </p>
                
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Template Library
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    AI Generation
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  Settings,
  Palette,
  Code,
  Eye,
  EyeOff,
  Download,
  Share2,
  Zap,
  Layers,
  Grid,
  Type,
  Image,
  Layout,
  Smartphone,
  Monitor,
  Tablet,
  Undo2,
  Redo2,
  Save,
  Rocket,
  History,
  HelpCircle,
  Keyboard,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModernMenuProps {
  onViewModeChange?: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  onToggleInlineEdit?: () => void;
  onToggleGrid?: () => void;
  onSave?: () => void;
  onPublish?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isDirty?: boolean;
  inlineEditMode?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  showGrid?: boolean;
}

export const ModernMenu: React.FC<ModernMenuProps> = ({
  onViewModeChange,
  onToggleInlineEdit,
  onToggleGrid,
  onSave,
  onPublish,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  isDirty = false,
  inlineEditMode = false,
  viewMode = 'desktop',
  showGrid = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const viewModeIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  };

  const ViewModeIcon = viewModeIcons[viewMode];

  return (
    <div className="flex items-center gap-3">
      {/* Enhanced Quick Actions */}
      <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-card/90 border border-border/30 backdrop-blur-xl shadow-lg shadow-black/5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className={cn(
            "h-9 w-9 p-0 transition-all duration-300 rounded-xl",
            canUndo 
              ? "hover:bg-blue-500/10 hover:text-blue-600 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20" 
              : "text-muted-foreground/40 cursor-not-allowed"
          )}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className={cn(
            "h-9 w-9 p-0 transition-all duration-300 rounded-xl",
            canRedo 
              ? "hover:bg-blue-500/10 hover:text-blue-600 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20" 
              : "text-muted-foreground/40 cursor-not-allowed"
          )}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-5 mx-1.5 bg-border/30" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          disabled={!isDirty}
          className={cn(
            "h-9 w-9 p-0 transition-all duration-300 rounded-xl",
            isDirty 
              ? "hover:bg-emerald-500/10 hover:text-emerald-600 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/20" 
              : "text-muted-foreground/40 cursor-not-allowed"
          )}
          title="Save (Ctrl+S)"
        >
          <Save className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={onPublish}
          disabled={!isDirty}
          size="sm"
          className={cn(
            "h-9 px-4 relative overflow-hidden transition-all duration-300 font-semibold rounded-xl",
            isDirty 
              ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 hover:from-emerald-500 hover:via-emerald-400 hover:to-green-400 text-white shadow-lg shadow-emerald-500/30 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40"
              : "bg-muted/50 text-muted-foreground/60 cursor-not-allowed"
          )}
        >
          <div className="flex items-center gap-2 relative z-10">
            <Rocket className="h-3.5 w-3.5" />
            <span>Publish</span>
          </div>
          {isDirty && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          )}
        </Button>
      </div>

      {/* Enhanced View Mode Selector */}
      <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-card/90 border border-border/30 backdrop-blur-xl shadow-lg shadow-black/5">
        {(['desktop', 'tablet', 'mobile'] as const).map((mode) => {
          const Icon = viewModeIcons[mode];
          const isActive = viewMode === mode;
          return (
            <Button
              key={mode}
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange?.(mode)}
              className={cn(
                "h-9 w-10 p-0 transition-all duration-300 rounded-xl relative",
                isActive 
                  ? "bg-gradient-primary text-white shadow-lg shadow-primary/30 scale-105"
                  : "hover:bg-primary/8 hover:text-primary hover:scale-105"
              )}
              title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
            >
              <Icon className="h-4 w-4 relative z-10" />
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Button>
          );
        })}
      </div>

      {/* Enhanced Inline Edit Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleInlineEdit}
        className={cn(
          "relative overflow-hidden transition-all duration-300 font-semibold px-4 h-10 rounded-2xl border border-border/30 backdrop-blur-xl",
          inlineEditMode 
            ? "bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white shadow-lg shadow-primary/30 hover:scale-105 hover:shadow-xl hover:shadow-primary/40"
            : "bg-card/90 hover:border-primary/40 hover:bg-primary/8 hover:scale-105 shadow-lg shadow-black/5"
        )}
      >
        <div className="relative flex items-center gap-2.5 z-10">
          <div className={cn(
            "p-1 rounded-lg transition-all duration-200",
            inlineEditMode ? "bg-white/20" : "bg-primary/10"
          )}>
            {inlineEditMode ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 text-primary" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>{inlineEditMode ? "Live Editing" : "Preview Mode"}</span>
            {inlineEditMode && (
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-white/20 text-white border-white/30 font-medium">
                LIVE
              </Badge>
            )}
          </div>
        </div>
        
        {inlineEditMode && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
          />
        )}
      </Button>

      {/* Enhanced Main Menu */}
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost"
            size="sm"
            className={cn(
              "h-10 px-4 rounded-2xl border border-border/30 bg-card/90 backdrop-blur-xl transition-all duration-300 font-semibold shadow-lg shadow-black/5",
              isMenuOpen 
                ? "bg-primary/10 border-primary/30 text-primary scale-105" 
                : "hover:border-primary/40 hover:bg-primary/8 hover:scale-105"
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className={cn(
                "p-1 rounded-lg transition-all duration-200",
                isMenuOpen ? "bg-primary/20" : "bg-primary/10"
              )}>
                <Menu className="h-3.5 w-3.5" />
              </div>
              <span>Studio Menu</span>
              <ChevronDown className={cn(
                "h-3 w-3 transition-all duration-300",
                isMenuOpen && "rotate-180 text-primary"
              )} />
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <AnimatePresence>
          {isMenuOpen && (
            <DropdownMenuContent 
              className="w-80 p-3 bg-card/95 backdrop-blur-xl border border-border/30 shadow-2xl z-50"
              sideOffset={12}
              align="end"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -8 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="px-2 py-3 border-b border-border/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-primary">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Studio Pro</h3>
                      <p className="text-xs text-muted-foreground">Advanced design tools</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="group px-3 py-2.5 rounded-lg hover:bg-primary/8 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                          <Palette className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium">Theme Designer</span>
                          <p className="text-xs text-muted-foreground">Customize colors & styles</p>
                        </div>
                        <DropdownMenuShortcut className="text-xs opacity-60">⌘T</DropdownMenuShortcut>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      className="group px-3 py-2.5 rounded-lg hover:bg-primary/8 transition-all duration-200 cursor-pointer"
                      onClick={onToggleGrid}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                          <Grid className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium">Design Grid</span>
                          <p className="text-xs text-muted-foreground">Alignment assistance</p>
                        </div>
                        <Badge 
                          variant={showGrid ? "default" : "secondary"} 
                          className="text-[10px] px-2 py-0.5 font-medium"
                        >
                          {showGrid ? "ON" : "OFF"}
                        </Badge>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="group px-3 py-2.5 rounded-lg hover:bg-primary/8 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                          <Layers className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium">Layer Stack</span>
                          <p className="text-xs text-muted-foreground">Manage z-index & order</p>
                        </div>
                        <DropdownMenuShortcut className="text-xs opacity-60">⌘L</DropdownMenuShortcut>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
                
                <DropdownMenuSeparator className="my-2" />
                
                <div className="py-2">
                  <div className="px-3 py-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Content Tools</p>
                  </div>
                  
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="group px-3 py-2.5 rounded-lg hover:bg-primary/8 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-1.5 rounded-md bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                          <Type className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="text-sm font-medium">Typography</span>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="group px-3 py-2.5 rounded-lg hover:bg-primary/8 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-1.5 rounded-md bg-pink-100 dark:bg-pink-900/30 group-hover:bg-pink-200 dark:group-hover:bg-pink-900/50 transition-colors">
                          <Image className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <span className="text-sm font-medium">Media Library</span>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="group px-3 py-2.5 rounded-lg hover:bg-primary/8 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-1.5 rounded-md bg-teal-100 dark:bg-teal-900/30 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/50 transition-colors">
                          <Layout className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <span className="text-sm font-medium">Layout Tools</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
                
                <DropdownMenuSeparator className="my-2" />
                
                <div className="py-2">
                  <div className="px-3 py-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Export & Share</p>
                  </div>
                  
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="group px-3 py-2.5 rounded-lg hover:bg-primary/8 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                          <Share2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium">Share & Export</span>
                        <DropdownMenuShortcut className="text-xs opacity-60">⌘E</DropdownMenuShortcut>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="group px-3 py-2.5 rounded-lg hover:bg-primary/8 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                          <Download className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm font-medium">Download Project</span>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="group px-3 py-2.5 rounded-lg hover:bg-primary/8 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                          <History className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-sm font-medium">Version History</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
                
                <DropdownMenuSeparator className="my-2" />
                
                <div className="py-2">
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="group px-3 py-2.5 rounded-lg hover:bg-primary/8 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                          <Settings className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <span className="text-sm font-medium">Settings</span>
                        <DropdownMenuShortcut className="text-xs opacity-60">⌘,</DropdownMenuShortcut>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="group px-3 py-2.5 rounded-lg hover:bg-primary/8 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-1.5 rounded-md bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                          <Keyboard className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium">Keyboard Shortcuts</span>
                        <DropdownMenuShortcut className="text-xs opacity-60">⌘K</DropdownMenuShortcut>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="group px-3 py-2.5 rounded-lg hover:bg-primary/8 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                          <HelpCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-sm font-medium">Help & Support</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
              </motion.div>
            </DropdownMenuContent>
          )}
        </AnimatePresence>
      </DropdownMenu>
    </div>
  );
};

export default ModernMenu;
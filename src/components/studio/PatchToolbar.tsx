import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Undo2, 
  Redo2, 
  Rocket, 
  RotateCcw, 
  Eye,
  Save,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export default function PatchToolbar({
  canUndo, canRedo, onUndo, onRedo,
  onPublish, onRevert, hasPublished,
  viewPublished, setViewPublished,
  isDirty = false,
  isApplying = false,
}: {
  canUndo?: boolean; canRedo?: boolean;
  onUndo?: () => void; onRedo?: () => void;
  onPublish: () => void; onRevert: () => void;
  hasPublished: boolean;
  viewPublished: boolean; setViewPublished: (v:boolean)=>void;
  isDirty?: boolean;
  isApplying?: boolean;
}) {
  const isOnline = useNetworkStatus();
  return (
    <motion.div 
      className="flex items-center gap-3 p-1"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Status Indicator */}
      {!isOnline && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20"
        >
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs font-medium text-red-600 dark:text-red-400">
            Offline
          </span>
        </motion.div>
      )}
      
      {isDirty && isOnline && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20"
        >
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
            Unsaved
          </span>
        </motion.div>
      )}
      
      {/* Undo/Redo Controls */}
      {onUndo && onRedo && (
        <div className="flex items-center gap-1 p-1 rounded-xl bg-card/50 border border-border/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className={cn(
              "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200",
              canUndo ? "text-foreground hover:scale-110" : "text-muted-foreground/50"
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
              "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200",
              canRedo ? "text-foreground hover:scale-110" : "text-muted-foreground/50"
            )}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Main Actions */}
      <div className="flex items-center gap-2">
        {/* Publish Button */}
        <Button
          onClick={onPublish}
          disabled={!isDirty || !isOnline || isApplying}
          size="sm"
          className={cn(
            "relative overflow-hidden transition-all duration-300 font-semibold",
            isDirty && isOnline && !isApplying
              ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:scale-105"
              : "bg-muted/50 text-muted-foreground cursor-not-allowed"
          )}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: isDirty && !isApplying ? "100%" : "-100%" }}
            transition={{ duration: 1.5, repeat: isDirty && !isApplying ? Infinity : 0, repeatDelay: 2 }}
          />
          <div className="relative flex items-center gap-2">
            {isApplying ? (
              <Clock className="h-4 w-4 animate-spin" />
            ) : isDirty && isOnline ? (
              <Rocket className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <span>
              {isApplying ? "Publishing..." : isDirty ? "Publish" : "Published"}
            </span>
          </div>
        </Button>
        
        {/* Revert Button */}
        <Button
          onClick={onRevert}
          disabled={!hasPublished}
          variant="outline"
          size="sm"
          className={cn(
            "group transition-all duration-200",
            hasPublished 
              ? "border-border/30 hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-600 hover:scale-105"
              : "opacity-50 cursor-not-allowed"
          )}
        >
          <RotateCcw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
          <span className="font-medium">Revert</span>
        </Button>
      </div>
      
      {/* Preview Toggle */}
      <div className="flex items-center gap-3 p-2 rounded-xl bg-card/50 border border-border/20">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Preview</span>
        </div>
        
        <div className="relative">
          <Switch
            checked={viewPublished}
            onCheckedChange={setViewPublished}
            className="data-[state=checked]:bg-primary"
          />
          <Badge 
            variant={viewPublished ? "default" : "secondary"}
            className={cn(
              "absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 transition-all duration-200",
              viewPublished 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-muted text-muted-foreground"
            )}
          >
            {viewPublished ? "Live" : "Draft"}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}
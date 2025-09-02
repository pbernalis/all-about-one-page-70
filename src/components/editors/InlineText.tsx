// Re-export the new ProfessionalInlineEditor as the default
export { ProfessionalInlineEditor as default } from './ProfessionalInlineEditor';
export { ProfessionalInlineEditor } from './ProfessionalInlineEditor';

// Also export the old simple version for backwards compatibility with enhanced styling
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Operation } from "fast-json-patch";
import { applyPatchWithValidation } from "@/cms/patching/patch-validator";
import { Edit3, Check, X, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

type SimpleInlineTextProps = {
  path: string;
  value?: string;
  placeholder?: string;
  readOnly: boolean;
  schema: any;
  setSchema: (s: any) => void;
  className?: string;
  simple?: boolean; // Force simple mode
};

export function SimpleInlineText({
  path, value, placeholder, readOnly, schema, setSchema, className = "", simple = false
}: SimpleInlineTextProps) {
  const [local, setLocal] = useState(value ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    setLocal(value ?? "");
    setHasChanges(false);
  }, [value]);

  useEffect(() => {
    setHasChanges(local !== (value ?? ""));
  }, [local, value]);

  const commit = () => {
    if (local === value) return;
    const op: Operation = value == null
      ? { op: "add", path, value: local }
      : { op: "replace", path, value: local };
    const next = applyPatchWithValidation(schema, [op]);
    setSchema(next);
    setHasChanges(false);
  };

  const handleSave = () => {
    commit();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocal(value ?? "");
    setIsEditing(false);
    setHasChanges(false);
  };

  useEffect(() => {
    if (readOnly || local === value) return;
    const timeout = setTimeout(commit, 500);
    return () => clearTimeout(timeout);
  }, [local, readOnly, value]);

  if (readOnly) {
    return (
      <span 
        className={cn(
          "inline-block min-h-[1.2em] relative group",
          className
        )} 
        data-editable="false"
      >
        {value || (
          <span className="text-muted-foreground/60 italic">
            {placeholder || "No content"}
          </span>
        )}
      </span>
    );
  }

  return (
    <div className="relative inline-block group">
      <motion.div
        className="relative"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <input
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={(e) => {
            if (!e.relatedTarget?.closest('.inline-edit-actions')) {
              commit();
              setIsEditing(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave();
            } else if (e.key === 'Escape') {
              handleCancel();
            }
          }}
          placeholder={placeholder}
          className={cn(
            "bg-transparent outline-none border-b-2 transition-all duration-300 min-w-[100px] w-full",
            isEditing 
              ? "border-primary shadow-lg shadow-primary/20 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg border-b-0 border-2"
              : hasChanges
                ? "border-amber-500 border-dashed"
                : "border-transparent hover:border-border/40 border-dashed",
            className
          )}
          data-editable={readOnly ? "false" : "true"}
          data-inline-on={readOnly ? "false" : "true"}
        />

        {!readOnly && (
          <motion.div
            className="absolute -top-8 left-0 flex items-center gap-1"
            initial={{ opacity: 0, y: 5 }}
            animate={{ 
              opacity: isEditing || hasChanges ? 1 : 0, 
              y: isEditing || hasChanges ? 0 : 5 
            }}
            transition={{ duration: 0.2 }}
          >
            {isEditing && (
              <div className="inline-edit-actions flex items-center gap-1 px-3 py-1.5 bg-card/95 backdrop-blur-lg border border-border/50 rounded-xl shadow-2xl">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-200 shadow-lg"
                  title="Save (Enter)"
                >
                  <Check className="h-3.5 w-3.5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white transition-all duration-200 shadow-lg"
                  title="Cancel (Escape)"
                >
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            )}
            
            {!isEditing && hasChanges && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse" />
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Auto-saving...</span>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {!readOnly && !isEditing && (
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-primary/20 to-primary/30 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
          whileHover={{ scale: 1.2, rotate: 5 }}
        >
          <Edit3 className="h-2.5 w-2.5 text-primary" />
        </motion.div>
      )}
    </div>
  );
}
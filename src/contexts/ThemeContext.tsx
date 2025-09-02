// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect } from "react";
import type { ThemeTokens } from "@/cms/schema/types";

interface ThemeContextType extends ThemeTokens {}
const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: ThemeTokens;
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const themeValues: ThemeTokens = {
    brandColor: theme?.brandColor || "#6D28D9",
    radius: theme?.radius || "md",
    density: theme?.density || "normal",
  };

  useEffect(() => {
    const root = document.documentElement;

    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    root.style.setProperty("--theme-primary", hexToHsl(themeValues.brandColor));
    root.style.setProperty("--theme-primary-hex", themeValues.brandColor);

    const radiusValue = { sm: 4, md: 8, lg: 12 }[themeValues.radius];
    root.style.setProperty("--theme-radius", `${radiusValue}px`);

    const densitySpacing: Record<"compact" | "cozy" | "normal",
      { base: string; content: string; section: string }> = {
      compact: { base: "0.25rem", content: "0.5rem", section: "1rem" },
      cozy:    { base: "0.5rem",  content: "1rem",   section: "2rem" },
      normal:  { base: "0.75rem", content: "1.5rem", section: "3rem" },
    };
    const spacing = densitySpacing[themeValues.density];
    root.style.setProperty("--theme-spacing-base", spacing.base);
    root.style.setProperty("--theme-spacing-content", spacing.content);
    root.style.setProperty("--theme-spacing-section", spacing.section);

    const [h, s, l] = hexToHsl(themeValues.brandColor).split(" ");
    const L = parseInt(l);
    const lighter = `${h} ${s} ${Math.min(L + 10, 95)}%`;
    const darker  = `${h} ${s} ${Math.max(L - 10, 5)}%`;
    root.style.setProperty("--theme-primary-light", lighter);
    root.style.setProperty("--theme-primary-dark", darker);
  }, [themeValues.brandColor, themeValues.radius, themeValues.density]);

  return (
    <ThemeContext.Provider value={themeValues}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function useThemeClasses() {
  const theme = useTheme();
  
  return {
    button: `rounded-[var(--theme-radius)] px-[var(--theme-spacing-content)] py-[var(--theme-spacing-base)]`,
    card: `rounded-[var(--theme-radius)] p-[var(--theme-spacing-content)]`,
    section: `py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]`,
    primary: `bg-[hsl(var(--theme-primary))] text-white hover:bg-[hsl(var(--theme-primary-dark))]`,
    primaryLight: `bg-[hsl(var(--theme-primary-light))] text-[hsl(var(--theme-primary-dark))]`,
    border: `border-[hsl(var(--theme-primary))]`,
    text: `text-[hsl(var(--theme-primary))]`
  };
}
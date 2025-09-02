import { describe, it, expect } from "vitest";

type ThemeTokens = { brandColor: string; radius: "sm"|"md"|"lg"; density: "compact"|"cozy"|"normal" };

function themeToNormalized(t: ThemeTokens) {
  const radiusPx = { sm: 4, md: 8, lg: 12 } as const;
  const spacingByDensity = { compact: 6, cozy: 8, normal: 10 } as const;
  return { 
    colorPrimary: t.brandColor, 
    radiusPx: radiusPx[t.radius], 
    spacingBase: spacingByDensity[t.density] 
  };
}

describe("themeToNormalized", () => {
  it("maps radius correctly", () => {
    expect(themeToNormalized({ 
      brandColor: "#000", 
      radius: "lg", 
      density: "normal" 
    }).radiusPx).toBe(12);
  });

  it("maps density correctly", () => {
    expect(themeToNormalized({ 
      brandColor: "#000", 
      radius: "md", 
      density: "cozy" 
    }).spacingBase).toBe(8);
  });

  it("preserves brand color", () => {
    expect(themeToNormalized({ 
      brandColor: "#ff0000", 
      radius: "sm", 
      density: "compact" 
    }).colorPrimary).toBe("#ff0000");
  });
});
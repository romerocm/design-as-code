// src/services/designTokens.js
export const parseDesignTokens = (input) => {
  // Basic token structure
  const baseTokens = {
    colors: {},
    typography: {},
    spacing: {},
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  };

  try {
    // Simple parsing of color values
    const colorMatches = input.match(/#[0-9A-Fa-f]{6}/g) || [];
    colorMatches.forEach((color, index) => {
      baseTokens.colors[`color-${index + 1}`] = color;
    });

    // Simple parsing of spacing values
    const spacingMatches = input.match(/\d+px|\d+rem/g) || [];
    spacingMatches.forEach((spacing, index) => {
      baseTokens.spacing[`space-${index + 1}`] = spacing;
    });

    return baseTokens;
  } catch (error) {
    console.error("Token parsing failed:", error);
    return baseTokens;
  }
};

export const convertToTailwind = (tokens) => {
  // Convert tokens to Tailwind classes
  const tailwindClasses = {
    colors: {},
    spacing: {},
    typography: {},
  };

  // Basic color conversion
  Object.entries(tokens.colors).forEach(([key, value]) => {
    tailwindClasses.colors[key] = `bg-[${value}]`;
  });

  // Basic spacing conversion
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    tailwindClasses.spacing[key] = `p-[${value}]`;
  });

  return tailwindClasses;
};

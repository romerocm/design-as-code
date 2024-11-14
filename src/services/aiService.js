// src/services/aiService.js
const DESIGN_PROMPT = `You are a design-to-code expert. Analyze the design requirements and generate a React component.
Use only core Tailwind CSS classes (no arbitrary values). Ensure the component is:
1. Responsive (mobile-first approach)
2. Accessible (ARIA attributes, semantic HTML)
3. Following React best practices
4. Using proper TypeScript types
5. Including basic error handling

Return only the component code as a complete functional component, without any explanation or markdown.
Include proper imports and export statement.`;

export const generateComponent = async (designInput) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
        "anthropic-version": "2024-01-01",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `${DESIGN_PROMPT}\n\nDesign Requirements: ${designInput}`,
          },
        ],
        model: "claude-3-opus-20240229",
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedCode = data.content[0].text.trim();
    
    // Enhanced validation
    const validationResult = validateComponent(generatedCode);
    if (validationResult.valid === false) {
      throw new Error(`Invalid component: ${validationResult.error}`);
    }

    // Clean up the code
    const cleanedCode = generatedCode
      .replace(/```(jsx|tsx|javascript|js)?\n/g, '')
      .replace(/```$/g, '')
      .trim();

    return {
      success: true,
      data: {
        code: cleanedCode,
        preview: cleanedCode,
        metadata: {
          timestamp: new Date().toISOString(),
          model: "claude-3-opus-20240229",
        }
      },
    };
  } catch (error) {
    console.error("Error in generateComponent:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const reviewDesign = async (componentCode) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
        "anthropic-version": "2024-01-01",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `Review this React component and provide suggestions for improvement. Focus on accessibility, performance, and best practices. Component code:\n\n${componentCode}`,
          },
        ],
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    return {
      success: true,
      data: data.content[0].text,
    };
  } catch (error) {
    console.error("Error in reviewDesign:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

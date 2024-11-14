// src/services/aiService.js
const DESIGN_PROMPT = `You are a design-to-code expert. Analyze the design requirements and generate a React component.
Use only core Tailwind CSS classes (no arbitrary values). Ensure the component is:
1. Responsive
2. Accessible
3. Following React best practices

Return the component code without any explanation or markdown formatting.`;

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
    const generatedCode = data.content[0].text;

    return {
      success: true,
      data: {
        code: generatedCode,
        preview: generatedCode, // This will be processed by previewService
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

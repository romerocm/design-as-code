// src/services/previewService.js
export const createPreview = (component) => {
  const baseHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 1rem; }
          </style>
        </head>
        <body>
          <div id="preview-root">${component}</div>
        </body>
      </html>
    `;

  return baseHTML;
};

export const validateComponent = (code) => {
  try {
    // Basic validation
    if (!code.includes("return") || !code.includes("React")) {
      throw new Error("Invalid React component");
    }
    return true;
  } catch (error) {
    console.error("Component validation failed:", error);
    return false;
  }
};

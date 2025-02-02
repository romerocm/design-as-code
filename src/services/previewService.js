// src/services/previewService.js
export const createPreview = (component) => {
  const baseHTML = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script>
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {}
            }
          }
        </script>
        <style>
          body { 
            margin: 0; 
            padding: 1rem; 
            background: transparent;
            color-scheme: light dark;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          #preview-root { 
            flex: 1;
            width: 100%;
            color: inherit;
            display: flex;
            flex-direction: column;
          }
          @media (prefers-color-scheme: dark) {
            body {
              background: #1f2937;
              color: #f3f4f6;
            }
          }
          .preview-error { 
            color: #ef4444; 
            padding: 1rem;
            margin: 1rem;
            border: 1px solid #fee2e2;
            border-radius: 0.5rem;
            background: #fef2f2;
          }
        </style>
      </head>
      <body>
        <div id="preview-root"></div>
        <script type="text/babel">
          // Sync dark mode with parent
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.attributeName === 'class') {
                document.documentElement.classList.toggle('dark', 
                  window.parent.document.documentElement.classList.contains('dark')
                );
              }
            });
          });
          
          observer.observe(window.parent.document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
          });

          // Initial dark mode sync
          document.documentElement.classList.toggle('dark',
            window.parent.document.documentElement.classList.contains('dark')
          );

          try {
            const PreviewComponent = ${component};
            const root = ReactDOM.createRoot(document.getElementById('preview-root'));
            root.render(
              React.createElement(React.StrictMode, null,
                React.createElement(PreviewComponent)
              )
            );
          } catch (error) {
            document.getElementById('preview-root').innerHTML = 
              '<div class="preview-error">Preview Error: ' + error.message + '</div>';
          }
        </script>
      </body>
    </html>
  `;

  return baseHTML.trim();
};

export const validateComponent = (code) => {
  try {
    // More comprehensive validation
    const requiredElements = [
      { pattern: /import.*React/, message: "Missing React import" },
      { pattern: /export.*function|export.*const/, message: "Missing export statement" },
      { pattern: /return.*\(/, message: "Missing return statement" },
      { pattern: /className=/, message: "Missing Tailwind classes" },
    ];

    for (const { pattern, message } of requiredElements) {
      if (!pattern.test(code)) {
        throw new Error(message);
      }
    }

    // Check for basic syntax errors
    new Function(code); // This will throw if there's a syntax error
    
    return true;
  } catch (error) {
    console.error("Component validation failed:", error);
    return {
      valid: false,
      error: error.message
    };
  }
};

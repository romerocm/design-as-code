// src/components/Design/DesignCanvas.jsx
import React, { useRef, useEffect } from "react";
import { Maximize2, RefreshCw, Loader, Moon, Sun } from "lucide-react";

const DesignCanvas = ({ previewCode, isGenerating, error, onError }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (previewCode && iframeRef.current) {
      try {
        iframeRef.current.srcdoc = previewCode;
      } catch (err) {
        console.error("Error updating preview:", err);
      }
    }
  }, [previewCode]);

  const handleRefresh = () => {
    if (previewCode && iframeRef.current) {
      iframeRef.current.srcdoc = previewCode;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Preview Header */}
      <div className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold dark:text-gray-100">Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            disabled={isGenerating}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label="Toggle dark mode"
          >
            <Sun className="w-5 h-5 hidden dark:block" />
            <Moon className="w-5 h-5 block dark:hidden" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-4">
        {isGenerating ? (
          <div className="w-full h-full flex flex-col gap-2 items-center justify-center bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Generating preview...</p>
          </div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
            <div className="text-red-500 text-center p-4 max-w-md">
              <p className="font-medium">Preview Error</p>
              <p className="text-sm mt-2 break-words">{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-800"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
            <iframe
              ref={iframeRef}
              title="Design Preview"
              className="w-full h-full bg-white dark:bg-gray-900"
              sandbox="allow-scripts"
              srcDoc={
                previewCode ||
                `<html><body><div class="flex h-full items-center justify-center text-gray-500">Preview will appear here</div></body></html>`
              }
              onLoad={(e) => {
                try {
                  if (e.target.contentDocument?.body.innerHTML.includes("Preview Error")) {
                    onError?.("Component failed to render");
                  }
                } catch (err) {
                  console.error("Error checking iframe content:", err);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignCanvas;

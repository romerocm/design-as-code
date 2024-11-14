// src/components/Design/DesignCanvas.jsx
import React, { useRef, useEffect } from "react";
import { Maximize2, RefreshCw, Loader } from "lucide-react";

const DesignCanvas = ({ previewCode, isGenerating, error }) => {
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
              className="w-full h-full bg-white"
              sandbox="allow-scripts"
              srcDoc={
                previewCode ||
                "<html><body><div>Preview will appear here</div></body></html>"
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignCanvas;

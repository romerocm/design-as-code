// src/components/Design/DesignTools.jsx
import React, { useState } from "react";
import {
  Upload,
  Code2,
  PanelLeft,
  Download,
  Palette,
  Layout,
  Type,
  BoxSelect,
  Ruler,
} from "lucide-react";

const DesignTools = () => {
  const [activeTab, setActiveTab] = useState("layout");

  const tools = {
    layout: [
      { name: "Container", icon: BoxSelect },
      { name: "Grid", icon: Layout },
      { name: "Flex", icon: PanelLeft },
    ],
    typography: [
      { name: "Heading", icon: Type },
      { name: "Paragraph", icon: Type },
      { name: "Text", icon: Type },
    ],
    spacing: [
      { name: "Margin", icon: Ruler },
      { name: "Padding", icon: Ruler },
      { name: "Gap", icon: Ruler },
    ],
    styles: [
      { name: "Colors", icon: Palette },
      { name: "Border", icon: BoxSelect },
      { name: "Shadow", icon: BoxSelect },
    ],
  };

  const handleToolClick = (toolName) => {
    console.log("Tool clicked:", toolName);
  };

  const handleImport = () => {
    console.log("Import clicked");
  };

  const handleExport = () => {
    console.log("Export clicked");
  };

  const handleCodeView = () => {
    console.log("Code view clicked");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-700">
      {/* Top Actions */}
      <div className="p-4 border-b dark:border-gray-700 flex justify-between">
        <div className="flex gap-2">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            onClick={handleImport}
          >
            <Upload className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            onClick={handleCodeView}
          >
            <Code2 className="w-5 h-5" />
          </button>
        </div>
        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          onClick={handleExport}
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Tools Tabs */}
      <div className="flex border-b dark:border-gray-700">
        {Object.keys(tools).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 p-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-500 text-blue-500"
                : "border-transparent hover:text-blue-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-2">
          {tools[activeTab].map((tool, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleToolClick(tool.name)}
            >
              <tool.icon className="w-6 h-6 mb-2" />
              <span className="text-sm">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Properties Panel */}
      <div className="border-t dark:border-gray-700 p-4">
        <h3 className="text-sm font-medium mb-2">Properties</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Width</span>
            <input
              type="text"
              className="w-20 px-2 py-1 border dark:border-gray-700 rounded bg-transparent"
              placeholder="auto"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Height</span>
            <input
              type="text"
              className="w-20 px-2 py-1 border dark:border-gray-700 rounded bg-transparent"
              placeholder="auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignTools;

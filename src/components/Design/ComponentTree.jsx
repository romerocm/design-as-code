import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Box, Plus, Trash2 } from "lucide-react";

const ComponentTree = ({
  components = [],
  onComponentSelect,
  selectedComponent,
}) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [componentStructure, setComponentStructure] = useState([]);

  useEffect(() => {
    if (components.length > 0) {
      analyzeComponentStructure(components);
    }
  }, [components]);

  const analyzeComponentStructure = (components) => {
    // For MVP, we'll use a simple structure
    // In a full version, this would parse the component code to create a real tree
    const structure = components.map((component) => ({
      id: component.id || "root",
      name: component.name || "Root Component",
      children: component.children || [],
    }));

    if (structure.length === 0) {
      structure.push({
        id: "root",
        name: "Root Component",
        children: [],
      });
    }

    setComponentStructure(structure);
  };

  const toggleNode = (id) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const handleAddComponent = (parentId) => {
    // This would be implemented based on your component creation logic
    console.log("Adding component to parent:", parentId);
  };

  const handleDeleteComponent = (componentId, e) => {
    e.stopPropagation();
    // This would be implemented based on your component deletion logic
    console.log("Deleting component:", componentId);
  };

  const renderNode = (node, level = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedComponent === node.id;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center gap-1 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
            isSelected ? "bg-blue-50 dark:bg-blue-900" : ""
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => {
            toggleNode(node.id);
            onComponentSelect?.(node.id);
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )
          ) : (
            <Box className="w-4 h-4 text-gray-500" />
          )}
          <span className="text-sm dark:text-gray-100">{node.name}</span>

          <div className="ml-auto flex items-center gap-1">
            <button
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              onClick={(e) => {
                e.stopPropagation();
                handleAddComponent(node.id);
              }}
            >
              <Plus className="w-3 h-3" />
            </button>
            {node.id !== "root" && (
              <button
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                onClick={(e) => handleDeleteComponent(node.id, e)}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold dark:text-gray-100">Components</h2>
        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          onClick={() => handleAddComponent("root")}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="p-2">
        {componentStructure.map((component) => renderNode(component))}
      </div>
    </div>
  );
};

export default ComponentTree;

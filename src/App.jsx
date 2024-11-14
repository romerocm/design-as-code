// src/App.jsx
import React, { useState, useCallback } from "react";
import {
  Layout,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "./components/ui/Panel";
import AIAssistant from "./components/Assistant/AIAssistant";
import Suggestions from "./components/Assistant/Suggestions";
import ComponentTree from "./components/Design/ComponentTree";
import DesignCanvas from "./components/Design/DesignCanvas";
import DesignTools from "./components/Design/DesignTools";

const App = () => {
  // State management
  const [previewCode, setPreviewCode] = useState("");
  const [designTokens, setDesignTokens] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [components, setComponents] = useState([]);

  // Callback handlers
  const handleCodeGeneration = useCallback((code) => {
    setPreviewCode(code);
    // Update components list for the tree
    setComponents((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        code: code,
        name: "New Component",
      },
    ]);
  }, []);

  const handleError = useCallback((errorMessage) => {
    setError(errorMessage);
    // You might want to add a toast/notification system here
    console.error(errorMessage);
  }, []);

  const handleDesignTokensUpdate = useCallback((tokens) => {
    setDesignTokens(tokens);
  }, []);

  const handleComponentSelect = useCallback(
    (componentId) => {
      setSelectedComponent(componentId);
      // Find and load the selected component's code
      const component = components.find((c) => c.id === componentId);
      if (component) {
        setPreviewCode(component.code);
      }
    },
    [components]
  );

  const handleSuggestionApply = useCallback((suggestion) => {
    // Apply the suggestion to the current component
    // This would need to be implemented based on your needs
    console.log("Applying suggestion:", suggestion);
  }, []);

  return (
    <div className="h-screen bg-white dark:bg-gray-900">
      <Layout>
        <PanelGroup direction="horizontal">
          {/* Left Sidebar */}
          <Panel minSize={20} defaultSize={20}>
            <PanelGroup direction="vertical">
              <Panel minSize={30}>
                <ComponentTree
                  components={components}
                  selectedComponent={selectedComponent}
                  onComponentSelect={handleComponentSelect}
                />
              </Panel>
              <PanelResizeHandle />
              <Panel minSize={30}>
                <DesignTools
                  designTokens={designTokens}
                  onTokensUpdate={handleDesignTokensUpdate}
                  selectedComponent={selectedComponent}
                />
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle />

          {/* Main Content */}
          <Panel minSize={40} defaultSize={50}>
            <DesignCanvas
              previewCode={previewCode}
              isGenerating={isGenerating}
              error={error}
              selectedComponent={selectedComponent}
            />
          </Panel>

          <PanelResizeHandle />

          {/* Right Sidebar */}
          <Panel minSize={20} defaultSize={30}>
            <PanelGroup direction="vertical">
              <Panel minSize={50} defaultSize={70}>
                <AIAssistant
                  onCodeGenerated={handleCodeGeneration}
                  onError={handleError}
                  onGeneratingChange={setIsGenerating}
                  designTokens={designTokens}
                />
              </Panel>
              <PanelResizeHandle />
              <Panel minSize={30}>
                <Suggestions
                  currentCode={previewCode}
                  onSuggestionApply={handleSuggestionApply}
                />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </Layout>
    </div>
  );
};

export default App;

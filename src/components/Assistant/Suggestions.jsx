// src/components/Assistant/Suggestions.jsx
import React, { useEffect, useState } from "react";
import {
  Lightbulb,
  AlertCircle,
  Zap,
  Monitor,
  CheckCircle2,
  XCircle,
  Loader,
} from "lucide-react";
import { reviewDesign } from "../../services/aiService";

const Suggestions = ({ currentCode }) => {
  const [suggestions, setSuggestions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentCode) {
      generateSuggestions(currentCode);
    }
  }, [currentCode]);

  const generateSuggestions = async (code) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await reviewDesign(code);
      if (result.success) {
        setSuggestions(result.data);
      } else {
        setError(result.error || "Failed to generate suggestions");
      }
    } catch (error) {
      setError("Failed to generate suggestions");
      console.error("Error generating suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const SuggestionItem = ({ text, type = "info" }) => {
    const Icon =
      type === "success"
        ? CheckCircle2
        : type === "error"
        ? XCircle
        : Lightbulb;

    return (
      <div className="flex items-start gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
        <Icon
          className={`w-5 h-5 mt-0.5 ${
            type === "success"
              ? "text-green-500"
              : type === "error"
              ? "text-red-500"
              : "text-blue-500"
          }`}
        />
        <span className="text-sm">{text}</span>
      </div>
    );
  };

  const categoryIcons = {
    performance: Zap,
    accessibility: AlertCircle,
    responsiveness: Monitor,
    bestPractices: Lightbulb,
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold dark:text-gray-100 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Suggestions
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : Object.entries(suggestions).length > 0 ? (
          Object.entries(suggestions).map(([category, items]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                {categoryIcons[category] &&
                  React.createElement(categoryIcons[category], {
                    className: "w-4 h-4",
                  })}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <div className="space-y-1">
                {items.map((suggestion, index) => (
                  <SuggestionItem
                    key={index}
                    text={suggestion}
                    type={
                      suggestion.includes("Improve")
                        ? "error"
                        : suggestion.includes("Good")
                        ? "success"
                        : "info"
                    }
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            No suggestions available yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggestions;

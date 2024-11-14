import React, { useState } from "react";
import { Send, User, Bot, Loader } from "lucide-react";
import { generateComponent } from "../../services/aiService";
import { createPreview } from "../../services/previewService";
//import { parseDesignTokens } from "../../services/designTokens";

const AIAssistant = ({
  onCodeGenerated,
  onError,
  onGeneratingChange,
  //designTokens,
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    try {
      setIsProcessing(true);
      onGeneratingChange(true);

      const userMessage = {
        type: "user",
        content: input,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      const result = await generateComponent(input);

      if (!result.success) {
        throw new Error(result.error || "Failed to generate component");
      }

      const preview = createPreview(result.data.code);
      onCodeGenerated(preview);

      //const tokens = parseDesignTokens(result.data.code);

      const aiMessage = {
        type: "assistant",
        content:
          "I've generated a component based on your requirements. You can see the preview on the left.",
        timestamp: new Date().toISOString(),
        code: result.data.code,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating component:", error);
      onError(error.message);

      const errorMessage = {
        type: "assistant",
        content: `I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      onGeneratingChange(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.type === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {message.type === "user" ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === "user"
                  ? "bg-blue-500 text-white"
                  : message.isError
                  ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100"
                  : "bg-white dark:bg-gray-800 dark:text-gray-100 shadow"
              }`}
            >
              {message.content}
              {message.code && (
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded">
                  <pre className="text-sm overflow-x-auto">
                    <code>{message.code}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="border-t dark:border-gray-700 p-4"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your design requirements..."
            className="flex-1 rounded-lg border dark:border-gray-700 p-2 dark:bg-gray-800 dark:text-gray-100"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isProcessing ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIAssistant;

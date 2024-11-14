// src/components/ui/Input.jsx
import React from "react";

const Input = React.forwardRef(
  ({ className = "", type = "text", error, icon, ...props }, ref) => {
    const baseClasses =
      "w-full rounded-lg border dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 transition-colors";
    const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";

    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
          ${baseClasses}
          ${errorClasses}
          ${icon ? "pl-10" : ""}
          ${className}
        `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

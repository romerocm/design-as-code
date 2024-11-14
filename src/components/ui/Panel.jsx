// src/components/ui/Panel.jsx
import React, { createContext, useContext, useState } from "react";
import { Grip } from "lucide-react";

const PanelContext = createContext({});

export const Layout = ({ children }) => {
  return <div className="w-full h-full overflow-hidden">{children}</div>;
};

export const PanelGroup = ({ children, direction = "horizontal" }) => {
  const [sizes, setSizes] = useState([]);

  return (
    <PanelContext.Provider value={{ direction, sizes, setSizes }}>
      <div
        className={`flex ${
          direction === "horizontal" ? "flex-row" : "flex-col"
        } h-full`}
      >
        {children}
      </div>
    </PanelContext.Provider>
  );
};

export const Panel = ({ children, minSize = 0, defaultSize = 0 }) => {
  const { direction } = useContext(PanelContext);
  const style = {
    minWidth: direction === "horizontal" ? `${minSize}%` : undefined,
    minHeight: direction === "vertical" ? `${minSize}%` : undefined,
    flexBasis: defaultSize ? `${defaultSize}%` : undefined,
  };

  return (
    <div className="flex-1 overflow-hidden" style={style}>
      {children}
    </div>
  );
};

export const PanelResizeHandle = () => {
  const { direction } = useContext(PanelContext);

  return (
    <div
      className={`flex items-center justify-center 
        ${
          direction === "horizontal"
            ? "w-1 cursor-col-resize"
            : "h-1 cursor-row-resize"
        }
        hover:bg-blue-500 bg-gray-200 dark:bg-gray-700`}
    >
      <Grip className="w-4 h-4 text-gray-400" />
    </div>
  );
};

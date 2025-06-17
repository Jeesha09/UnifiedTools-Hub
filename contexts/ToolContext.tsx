"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ToolContextType {
  openTool: (toolPath: string, toolName?: string) => void;
  closeTool: () => void;
  currentTool: string | null;
  currentToolName: string | null;
  isToolOpen: boolean;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export const useToolContext = () => {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error('useToolContext must be used within a ToolProvider');
  }
  return context;
};

interface ToolProviderProps {
  children: ReactNode;
}

export const ToolProvider: React.FC<ToolProviderProps> = ({ children }) => {
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  const [currentToolName, setCurrentToolName] = useState<string | null>(null);
  const [isToolOpen, setIsToolOpen] = useState(false);

  const openTool = (toolPath: string, toolName?: string) => {
    setCurrentTool(toolPath);
    setCurrentToolName(toolName || null);
    setIsToolOpen(true);
  };

  const closeTool = () => {
    setCurrentTool(null);
    setCurrentToolName(null);
    setIsToolOpen(false);
  };

  return (
    <ToolContext.Provider value={{
      openTool,
      closeTool,
      currentTool,
      currentToolName,
      isToolOpen
    }}>
      {children}
    </ToolContext.Provider>
  );
};
"use client"
import React from 'react';
import { useToolContext } from '@/contexts/ToolContext';

interface ToolLinkProps {
  href: string;
  children: React.ReactNode;
  toolName?: string;
  className?: string;
}

const ToolLink: React.FC<ToolLinkProps> = ({ href, children, toolName, className }) => {
  const { openTool } = useToolContext();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Extract tool path from href
    const urlPath = new URL(href).pathname;
    const toolPath = urlPath.replace('/dashboard/', '');
    
    openTool(toolPath, toolName);
  };

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

export default ToolLink;
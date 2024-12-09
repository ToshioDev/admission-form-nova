"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
}

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const Tooltip: React.FC<TooltipProps> = ({ children, content, open }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {(open || isOpen) && (
        <div 
          className={cn(
            "absolute z-50 bg-black text-white text-xs px-2 py-1 rounded-md",
            "bottom-full left-1/2 transform -translate-x-1/2 translate-y-1 mb-2",
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export const TooltipTrigger: React.FC<{ children: React.ReactNode, asChild?: boolean }> = ({ children }) => (
  <>{children}</>
);

export const TooltipContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

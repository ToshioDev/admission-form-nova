'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ToastOptions } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const variantStyles = {
  default: 'bg-white text-black border border-gray-200 shadow-lg',
  destructive: 'bg-red-500 text-white shadow-lg',
  success: 'bg-green-500 text-white shadow-lg',
  warning: 'bg-yellow-500 text-black shadow-lg'
};

const variantOutlinedStyles = {
  default: 'border border-gray-300 text-gray-700 bg-transparent',
  destructive: 'border border-red-500 text-red-500 bg-transparent',
  success: 'border border-green-500 text-green-500 bg-transparent',
  warning: 'border border-yellow-500 text-yellow-500 bg-transparent'
};

const variantIcons = {
  default: '📝',
  destructive: '❌',
  success: '✅',
  warning: '⚠️'
};

interface ToastProps {
  toast: ToastOptions | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  const [copied, setCopied] = useState(false);
  const variant = toast.variant || 'default';

  const handleCopyCode = () => {
    if (toast.admissionCode) {
      navigator.clipboard.writeText(toast.admissionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className={cn(
        'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-xs w-full p-3 rounded-xl transition-all duration-300 ease-in-out',
        'animate-slide-up opacity-0 animate-fade-in',
        toast.outlined ? variantOutlinedStyles[variant] : variantStyles[variant]
      )}
    >
      <div className="flex items-center space-x-4">
        <div className="text-xl">{variantIcons[variant]}</div>
        <div className="flex-grow overflow-hidden">
          <h3 className="font-semibold text-base truncate">{toast.title}</h3>
          {toast.description && (
            <p className="text-xs opacity-80 mt-1 truncate">{toast.description}</p>
          )}
          {toast.admissionCode && (
            <div className="flex items-center mt-2 space-x-2">
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs w-full max-w-[180px] truncate">
                {toast.admissionCode}
              </span>
              <TooltipProvider>
                <Tooltip 
                  content={copied ? 'Copiado!' : 'Copiar'} 
                  open={copied}
                >
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleCopyCode}
                      className="hover:bg-gray-200 h-6 w-6"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
        <button 
          onClick={onClose} 
          className="text-lg font-bold opacity-50 hover:opacity-100 transition-opacity"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

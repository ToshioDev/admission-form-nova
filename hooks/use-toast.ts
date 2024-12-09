import { useState } from 'react';

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  admissionCode?: string;
  outlined?: boolean;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = (options: ToastOptions) => {
    setToast({
      ...options,
      variant: options.variant || 'default',
      duration: options.duration || undefined
    });
  };

  const clearToast = () => {
    setToast(null);
  };

  return { 
    toast, 
    showToast, 
    clearToast 
  };
};

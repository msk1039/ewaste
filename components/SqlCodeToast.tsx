"use client";

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prism-themes/themes/prism-vsc-dark-plus.css';

interface SqlCodeToastProps {
  title: string;
  sqlCode: string;
  duration?: number;
  onClose?: () => void;
}

export const showSqlCodeToast = ({ 
  title, 
  sqlCode, 
  duration = Infinity, 
  onClose 
}: SqlCodeToastProps) => {
  const toastId = `sql-code-${Date.now()}`;
  
  // Create the toast with proper props for Sonner
  toast(
    <div className="w-full">
      <h3 className="font-medium text-base mb-2">{title}</h3>
      <div className="rounded-md overflow-hidden">
        <pre className="language-sql" id={toastId}>
          <code className="language-sql">{sqlCode}</code>
        </pre>
      </div>
    </div>,
    {
      duration,
      id: toastId,
      className: "sql-toast",
      // Only include properties that Sonner accepts
      style: { 
        width: "auto", 
        maxWidth: "600px",
      },
      onDismiss: onClose,
    }
  );

  // Apply highlighting after a brief delay to ensure the DOM is ready
  setTimeout(() => {
    const codeElement = document.getElementById(toastId)?.querySelector('code');
    if (codeElement) Prism.highlightElement(codeElement);
  }, 100);

  return toastId;
};

// Hook to initialize Prism once in components
export const usePrismHighlighting = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Prism.highlightAll();
    }
  }, []);
};

// Add a component to use with custom rendering if needed
export const SqlCodeBlock = ({ code }: { code: string }) => {
  const blockRef = useRef<HTMLPreElement>(null);
  
  useEffect(() => {
    if (blockRef.current) {
      Prism.highlightElement(blockRef.current);
    }
  }, [code]);

  return (
    <div className="rounded-md overflow-hidden">
      <pre className="language-sql" ref={blockRef}>
        <code className="language-sql">{code}</code>
      </pre>
    </div>
  );
};
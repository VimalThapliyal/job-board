"use client";

import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-bash";

interface CodeBlockProps {
  children: string;
  className?: string;
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      // Set the content and highlight
      codeRef.current.textContent = children;
      Prism.highlightElement(codeRef.current);
    }
  }, [children]);

  // Extract language from className (e.g., "language-jsx" -> "jsx")
  const getLanguage = (className?: string) => {
    if (!className) return "javascript";
    const match = className.match(/language-(\w+)/);
    return match ? match[1] : "javascript";
  };

  const language = getLanguage(className);

  return (
    <div className="relative">
      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <code
          ref={codeRef}
          className={`language-${language}`}
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        />
      </pre>
      {language && language !== "javascript" && (
        <div className="absolute top-2 right-2">
          <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-mono">
            {language.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import type { ReactNode } from "react";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

// Function to format plain text into proper markdown
const formatPlainTextToMarkdown = (text: string): string => {
  if (!text) return text;

  // Check if content is already in markdown format
  const hasMarkdownStructure = text.includes('```') || 
                              text.includes('**') || 
                              text.includes('#') || 
                              text.includes('- ') ||
                              text.includes('1. ') ||
                              text.includes('[') && text.includes('](');

  // If content already has markdown structure, return as is
  if (hasMarkdownStructure) {
    return text;
  }

  let formatted = text;

  // Only format content that is explicitly wrapped in code block markers
  // This prevents auto-detection of keywords like useState, onClick, etc.
  if (formatted.includes('```jsx') || formatted.includes('```js') || formatted.includes('```javascript')) {
    // Content already has code block markers, return as is
    return formatted;
  }

  // Handle the specific content structure you showed
  formatted = formatted
    // Add line breaks after sentences
    .replace(/([.!?])\s+([A-Z])/g, "$1\n\n$2")

    // Format lists
    .replace(/(\n|^)\s*([•·▪▫‣⁃])\s*/g, "\n• ")
    .replace(/(\n|^)\s*(\d+\.)\s*/g, "\n$2 ")

    // Format bold text
    .replace(/\*\*([^*]+)\*\*/g, "**$1**")

    // Format inline code (but don't convert to code blocks)
    .replace(/`([^`]+)`/g, "`$1`")

    // Add proper spacing around sections
    .replace(/([.!?])\s+(\*\*)/g, "$1\n\n$2")
    .replace(/(\*\*[^*]+\*\*)\s+([A-Z])/g, "$1\n\n$2")

    // Clean up multiple line breaks
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return formatted;
};

export default function MarkdownRenderer({
  children,
  className,
}: MarkdownRendererProps) {
  // Format the content if it looks like plain text
  const formattedContent = formatPlainTextToMarkdown(children);

  return (
    <div className={className || "prose max-w-none"}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={
          {
            code({
              node,
              inline,
              className,
              children,
              ...props
            }: {
              node: unknown;
              inline?: boolean;
              className?: string;
              children: ReactNode;
            }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "javascript";

              if (inline) {
                return (
                  <code
                    className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              // Clean the content for code blocks
              const codeContent = String(children).replace(/\n$/, "");

              return <CodeBlock className={className}>{codeContent}</CodeBlock>;
            },
            pre({ node, children, ...props }) {
              return <>{children}</>;
            },
          } as Components
        }
      >
        {formattedContent}
      </ReactMarkdown>
    </div>
  );
}

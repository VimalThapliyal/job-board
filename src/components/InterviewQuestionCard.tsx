import Link from "next/link";
import { InterviewQuestion } from "@/types/interview-question";
import MarkdownRenderer from "./MarkdownRenderer";

interface InterviewQuestionCardProps {
  question: InterviewQuestion;
}

export default function InterviewQuestionCard({
  question,
}: InterviewQuestionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "🌱";
      case "intermediate":
        return "🚀";
      case "advanced":
        return "⚡";
      default:
        return "📝";
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Strip markdown for preview (remove markdown syntax)
  const stripMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/^#+\s+/gm, '') // Remove headers
      .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  const previewText = stripMarkdown(question.explanation || question.answer);
  const truncatedPreview = truncateText(previewText, 150);

  return (
    <Link href={`/interview-questions/${question.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">
              {getDifficultyIcon(question.difficulty)}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                question.difficulty
              )}`}
            >
              {question.difficulty.charAt(0).toUpperCase() +
                question.difficulty.slice(1)}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>👁️ {question.viewCount}</span>
            {question.helpfulCount > 0 && (
              <span>👍 {question.helpfulCount}</span>
            )}
          </div>
        </div>

        {/* Question */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-3">
          {question.question}
        </h3>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {question.category.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
            >
              {cat}
            </span>
          ))}
          {question.category.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
              +{question.category.length - 2} more
            </span>
          )}
        </div>

        {/* Tags */}
        {question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {question.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
              >
                #{tag}
              </span>
            ))}
            {question.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                +{question.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Preview */}
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
          {truncatedPreview}
        </p>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Read full question →
          </span>
        </div>
      </div>
    </Link>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { InterviewQuestion } from "@/types/interview-question";
import LoadingSpinner from "@/components/LoadingSpinner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownRenderer from "./MarkdownRenderer";

interface InterviewQuestionDetailProps {
  question: InterviewQuestion;
}

export default function InterviewQuestionDetail({
  question,
}: InterviewQuestionDetailProps) {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleFeedback = async (helpful: boolean) => {
    if (feedbackSubmitted) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/interview-questions/${question.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isHelpful: helpful }),
      });

      if (response.ok) {
        setIsHelpful(helpful);
        setFeedbackSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Question Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">
                {getDifficultyIcon(question.difficulty)}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                  question.difficulty
                )}`}
              >
                {question.difficulty.charAt(0).toUpperCase() +
                  question.difficulty.slice(1)}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <span className="mr-1">👁️</span>
                {question.viewCount} views
              </span>
              {question.helpfulCount > 0 && (
                <span className="flex items-center">
                  <span className="mr-1">👍</span>
                  {question.helpfulCount} helpful
                </span>
              )}
              {question.notHelpfulCount > 0 && (
                <span className="flex items-center">
                  <span className="mr-1">👎</span>
                  {question.notHelpfulCount} not helpful
                </span>
              )}
            </div>
          </div>

          {/* Question */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {question.question}
          </h1>

          {/* Categories and Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {question.category.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700"
              >
                {cat}
              </span>
            ))}
          </div>

          {question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Answer */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Answer</h2>
            <div className="prose max-w-none">
              <MarkdownRenderer>{question.answer}</MarkdownRenderer>
            </div>
          </div>

          {/* Explanation */}
          {question.explanation && question.explanation !== question.answer && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Explanation
              </h2>
              <div className="prose max-w-none">
                <MarkdownRenderer>{question.explanation}</MarkdownRenderer>
              </div>
            </div>
          )}

          {/* Code Example */}
          {question.codeExample && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Code Example
              </h2>
              <div className="prose max-w-none">
                <MarkdownRenderer>{question.codeExample}</MarkdownRenderer>
              </div>
            </div>
          )}

          {/* Feedback */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Was this question helpful?
            </h3>
            <div className="flex space-x-4">
              <button
                onClick={() => handleFeedback(true)}
                disabled={feedbackSubmitted || submitting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  isHelpful === true
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {submitting && isHelpful === true ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <span>👍</span>
                )}
                <span>Helpful</span>
              </button>
              <button
                onClick={() => handleFeedback(false)}
                disabled={feedbackSubmitted || submitting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  isHelpful === false
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {submitting && isHelpful === false ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <span>👎</span>
                )}
                <span>Not Helpful</span>
              </button>
            </div>
            {feedbackSubmitted && (
              <p className="text-green-600 text-sm mt-2">
                Thank you for your feedback!
              </p>
            )}
          </div>

          {/* Source */}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link
            href="/interview-questions"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Back to Questions
          </Link>
          <div className="flex space-x-4">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              🖨️ Print
            </button>
            <button
              onClick={() => {
                navigator
                  .share?.({
                    title: question.question,
                    text: question.answer,
                    url: window.location.href,
                  })
                  .catch(() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  });
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              📤 Share
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

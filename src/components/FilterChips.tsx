"use client";

import { useState } from "react";
import {
  InterviewQuestion,
  QuestionCategory,
} from "@/types/interview-question";

interface FilterChipsProps {
  questions: InterviewQuestion[];
  categories: QuestionCategory[];
  selectedDifficulty: string;
  selectedCategories: string[];
  selectedTags: string[];
  onDifficultyChange: (difficulty: string) => void;
  onCategoryChange: (categories: string[]) => void;
  onTagChange: (tags: string[]) => void;
  onClearAll: () => void;
}

export default function FilterChips({
  questions,
  categories,
  selectedDifficulty,
  selectedCategories,
  selectedTags,
  onDifficultyChange,
  onCategoryChange,
  onTagChange,
  onClearAll,
}: FilterChipsProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Get all unique tags from questions
  const allTags = Array.from(new Set(questions.flatMap((q) => q.tags))).sort();

  // Get difficulty counts
  const difficultyCounts = {
    beginner: questions.filter((q) => q.difficulty === "beginner").length,
    intermediate: questions.filter((q) => q.difficulty === "intermediate")
      .length,
    advanced: questions.filter((q) => q.difficulty === "advanced").length,
  };

  // Get category counts
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category.name] = questions.filter((q) =>
      q.category.includes(category.name)
    ).length;
    return acc;
  }, {} as Record<string, number>);

  // Get tag counts
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = questions.filter((q) => q.tags.includes(tag)).length;
    return acc;
  }, {} as Record<string, number>);

  const handleDifficultyClick = (difficulty: string) => {
    onDifficultyChange(selectedDifficulty === difficulty ? "all" : difficulty);
  };

  const handleCategoryClick = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    onCategoryChange(newCategories);
  };

  const handleTagClick = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagChange(newTags);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
      case "advanced":
        return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
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

  const hasActiveFilters =
    selectedDifficulty !== "all" ||
    selectedCategories.length > 0 ||
    selectedTags.length > 0;

  return (
    <div className="space-y-6">
      {/* Difficulty Filters */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">🎯</span>
          Difficulty Level
        </h3>
        <div className="flex flex-wrap gap-2">
          {["beginner", "intermediate", "advanced"].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => handleDifficultyClick(difficulty)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                selectedDifficulty === difficulty
                  ? `${getDifficultyColor(
                      difficulty
                    )} ring-2 ring-offset-2 ring-blue-500`
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="mr-2">{getDifficultyIcon(difficulty)}</span>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              <span className="ml-2 bg-white/50 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {difficultyCounts[difficulty as keyof typeof difficultyCounts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">📁</span>
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                selectedCategories.includes(category.name)
                  ? "bg-blue-100 text-blue-800 border-blue-200 ring-2 ring-offset-2 ring-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {category.name}
              <span className="ml-2 bg-white/50 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {categoryCounts[category.name] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div>
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="mr-2">🔧</span>
          Advanced Filters
          <svg
            className={`ml-2 w-4 h-4 transition-transform ${
              showAdvancedFilters ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          {/* Tags */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <span className="mr-2">🏷️</span>
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? "bg-purple-100 text-purple-800 border-purple-200 ring-2 ring-offset-2 ring-purple-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  #{tag}
                  <span className="ml-2 bg-white/50 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                    {tagCounts[tag]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Clear All Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onClearAll}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="mr-2">🗑️</span>
            Clear All Filters
          </button>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Active Filters:
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedDifficulty !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedDifficulty.charAt(0).toUpperCase() +
                  selectedDifficulty.slice(1)}
                <button
                  onClick={() => onDifficultyChange("all")}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {category}
                <button
                  onClick={() => handleCategoryClick(category)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                #{tag}
                <button
                  onClick={() => handleTagClick(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

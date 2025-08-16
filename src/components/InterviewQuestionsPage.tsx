"use client";

import { useState, useEffect, useCallback } from "react";
import {
  InterviewQuestion,
  QuestionCategory,
} from "@/types/interview-question";
import InterviewQuestionCard from "@/components/InterviewQuestionCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSearch from "@/components/EnhancedSearch";
import FilterChips from "@/components/FilterChips";

interface InterviewQuestionsPageProps {
  initialQuestions: InterviewQuestion[];
  categories: QuestionCategory[];
  stats: {
    totalQuestions: number;
    beginnerCount: number;
    intermediateCount: number;
    advancedCount: number;
    categoryStats: Record<string, number>;
  };
}

export default function InterviewQuestionsPage({
  initialQuestions,
  categories,
  stats,
}: InterviewQuestionsPageProps) {
  const [questions, setQuestions] =
    useState<InterviewQuestion[]>(initialQuestions);
  const [filteredQuestions, setFilteredQuestions] =
    useState<InterviewQuestion[]>(initialQuestions);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 12;

  // Filter questions based on search, difficulty, categories, and tags
  useEffect(() => {
    let filtered = questions;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (question) =>
          question.question.toLowerCase().includes(query) ||
          question.answer.toLowerCase().includes(query) ||
          question.explanation.toLowerCase().includes(query) ||
          question.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          question.category.some((cat) => cat.toLowerCase().includes(query))
      );
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (question) => question.difficulty === selectedDifficulty
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((question) =>
        selectedCategories.some((cat) => question.category.includes(cat))
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((question) =>
        selectedTags.some((tag) => question.tags.includes(tag))
      );
    }

    setFilteredQuestions(filtered);
    setCurrentPage(1);
  }, [
    questions,
    searchQuery,
    selectedDifficulty,
    selectedCategories,
    selectedTags,
  ]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (!query.trim()) {
            setQuestions(initialQuestions);
            return;
          }

          setLoading(true);
          fetch(`/api/interview-questions?search=${encodeURIComponent(query)}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                setQuestions(data.data.questions || data.data);
              }
            })
            .catch((error) => {
              console.error("Error searching questions:", error);
            })
            .finally(() => {
              setLoading(false);
            });
        }, 300);
      };
    })(),
    [initialQuestions]
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setQuestions(initialQuestions);
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleClearAllFilters = () => {
    setSelectedDifficulty("all");
    setSelectedCategories([]);
    setSelectedTags([]);
    setSearchQuery("");
    setQuestions(initialQuestions);
  };

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Master React Interviews
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Practice with our comprehensive collection of React interview
              questions. From fundamentals to advanced patterns, we&apos;ve got
              you covered.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {stats.totalQuestions}
                </div>
                <div className="text-xs sm:text-sm text-blue-600">
                  Total Questions
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {stats.beginnerCount}
                </div>
                <div className="text-xs sm:text-sm text-green-600">
                  Beginner
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {stats.intermediateCount}
                </div>
                <div className="text-xs sm:text-sm text-blue-600">
                  Intermediate
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">
                  {stats.advancedCount}
                </div>
                <div className="text-xs sm:text-sm text-purple-600">
                  Advanced
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          {/* Enhanced Search */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
              🔍 Search Questions
            </label>
            <EnhancedSearch
              onSearch={handleSearch}
              onClear={handleSearchClear}
              placeholder="Search for questions, answers, tags, or categories..."
              questions={questions}
            />
          </div>

          {/* Filter Chips */}
          <div className="border-t border-gray-200 pt-4 sm:pt-6">
            <FilterChips
              questions={questions}
              categories={categories}
              selectedDifficulty={selectedDifficulty}
              selectedCategories={selectedCategories}
              selectedTags={selectedTags}
              onDifficultyChange={handleDifficultyChange}
              onCategoryChange={handleCategoryChange}
              onTagChange={handleTagChange}
              onClearAll={handleClearAllFilters}
            />
          </div>
        </div>

        {/* Questions Grid */}
        {loading ? (
          <div className="flex justify-center py-8 sm:py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 sm:mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                <p className="text-sm sm:text-base text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredQuestions.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {stats.totalQuestions}
                  </span>{" "}
                  questions
                  {searchQuery && (
                    <span className="text-blue-600">
                      {" "}
                      for &quot;
                      <span className="font-medium">{searchQuery}</span>&quot;
                    </span>
                  )}
                  {selectedDifficulty !== "all" && (
                    <span className="text-green-600">
                      {" "}
                      (<span className="font-medium">
                        {selectedDifficulty}
                      </span>{" "}
                      level)
                    </span>
                  )}
                  {selectedCategories.length > 0 && (
                    <span className="text-blue-600">
                      {" "}
                      in{" "}
                      <span className="font-medium">
                        {selectedCategories.join(", ")}
                      </span>
                    </span>
                  )}
                  {selectedTags.length > 0 && (
                    <span className="text-purple-600">
                      {" "}
                      with tags{" "}
                      <span className="font-medium">
                        {selectedTags.map((tag) => `#${tag}`).join(", ")}
                      </span>
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Questions */}
            {currentQuestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentQuestions.map((question) => (
                  <InterviewQuestionCard
                    key={question.id}
                    question={question}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No questions found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters.
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

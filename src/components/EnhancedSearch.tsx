"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { InterviewQuestion } from "@/types/interview-question";

interface EnhancedSearchProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
  questions: InterviewQuestion[];
}

interface SearchSuggestion {
  type: "recent" | "question" | "tag" | "category";
  text: string;
  count?: number;
}

export default function EnhancedSearch({
  onSearch,
  onClear,
  placeholder = "Search questions, answers, tags, or categories...",
  className = "",
  questions,
}: EnhancedSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentSearches(Array.isArray(parsed) ? parsed.slice(0, 5) : []);
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback(
    (search: string) => {
      if (!search.trim()) return;

      const updated = [
        search,
        ...recentSearches.filter((s) => s !== search),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    },
    [recentSearches]
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (searchQuery: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (!searchQuery.trim()) {
            setSuggestions([]);
            return;
          }

          const suggestions: SearchSuggestion[] = [];
          const queryLower = searchQuery.toLowerCase();

          // Add recent searches
          const recentMatches = recentSearches
            .filter((search) => search.toLowerCase().includes(queryLower))
            .map((search) => ({ type: "recent" as const, text: search }));

          // Add question matches
          const questionMatches = questions
            .filter((q) => q.question.toLowerCase().includes(queryLower))
            .slice(0, 3)
            .map((q) => ({
              type: "question" as const,
              text: q.question,
              count: 1,
            }));

          // Add tag matches
          const allTags = new Set<string>();
          questions.forEach((q) => q.tags.forEach((tag) => allTags.add(tag)));
          const tagMatches = Array.from(allTags)
            .filter((tag) => tag.toLowerCase().includes(queryLower))
            .slice(0, 3)
            .map((tag) => ({
              type: "tag" as const,
              text: `#${tag}`,
              count: questions.filter((q) => q.tags.includes(tag)).length,
            }));

          // Add category matches
          const allCategories = new Set<string>();
          questions.forEach((q) =>
            q.category.forEach((cat) => allCategories.add(cat))
          );
          const categoryMatches = Array.from(allCategories)
            .filter((cat) => cat.toLowerCase().includes(queryLower))
            .slice(0, 2)
            .map((cat) => ({
              type: "category" as const,
              text: cat,
              count: questions.filter((q) => q.category.includes(cat)).length,
            }));

          suggestions.push(
            ...recentMatches,
            ...questionMatches,
            ...tagMatches,
            ...categoryMatches
          );
          setSuggestions(suggestions.slice(0, 8));
        }, 300);
      };
    })(),
    [questions, recentSearches]
  );

  // Handle input change
  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);

    if (value.trim()) {
      debouncedSearch(value);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    const searchText =
      suggestion.type === "tag" ? suggestion.text.slice(1) : suggestion.text;
    setQuery(searchText);
    setShowSuggestions(false);
    saveRecentSearch(searchText);
    onSearch(searchText);
  };

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        } else if (query.trim()) {
          saveRecentSearch(query);
          onSearch(query);
          setShowSuggestions(false);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (query.trim()) {
      saveRecentSearch(query);
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  // Handle clear
  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onClear();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSuggestionIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "recent":
        return "🕒";
      case "question":
        return "❓";
      case "tag":
        return "🏷️";
      case "category":
        return "📁";
      default:
        return "🔍";
    }
  };

  const getSuggestionText = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case "recent":
        return `Recent: ${suggestion.text}`;
      case "question":
        return suggestion.text.length > 60
          ? `${suggestion.text.substring(0, 60)}...`
          : suggestion.text;
      case "tag":
        return `${suggestion.text} (${suggestion.count} questions)`;
      case "category":
        return `${suggestion.text} (${suggestion.count} questions)`;
      default:
        return suggestion.text;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
        />

        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.text}-${index}`}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                index === selectedIndex
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : ""
              }`}
            >
              <span className="text-lg">
                {getSuggestionIcon(suggestion.type)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {getSuggestionText(suggestion)}
                </div>
                {suggestion.type === "recent" && (
                  <div className="text-xs text-gray-500">Recent search</div>
                )}
              </div>
              {suggestion.count && suggestion.count > 1 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {suggestion.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {showSuggestions &&
        query.trim() &&
        suggestions.length === 0 &&
        !isLoading && (
          <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-sm">
                No suggestions found for &quot;{query}&quot;
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

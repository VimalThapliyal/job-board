"use client";

import { useState, useEffect } from "react";
import { InterviewQuestion } from "@/types/interview-question";
import InterviewQuestionEditor from "@/components/InterviewQuestionEditor";

export default function AdminInterviewQuestions() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuestion, setSelectedQuestion] =
    useState<InterviewQuestion | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/interview-questions");
      const data = await response.json();

      if (data.success) {
        setQuestions(data.data.questions || data.data);
      } else {
        setError("Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSelect = (question: InterviewQuestion) => {
    setSelectedQuestion(question);
    setIsCreatingNew(false);
  };

  const handleCreateNew = () => {
    const newQuestion: InterviewQuestion = {
      id: "",
      question: "",
      answer: "",
      explanation: "",
      codeExample: "",
      difficulty: "beginner",
      category: [],
      tags: [],
      source: "Admin Created",
      sourceUrl: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
    };
    setSelectedQuestion(newQuestion);
    setIsCreatingNew(true);
  };

  const handleQuestionUpdate = async (updatedQuestion: InterviewQuestion) => {
    try {
      let response;

      if (isCreatingNew) {
        // Create new question
        response = await fetch("/api/interview-questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedQuestion),
        });
      } else {
        // Update existing question
        response = await fetch(
          `/api/interview-questions/${updatedQuestion.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedQuestion),
          }
        );
      }

      const data = await response.json();

      if (data.success) {
        if (isCreatingNew) {
          // Add the new question to the list
          const newQuestion = data.data;
          setQuestions([...questions, newQuestion]);
          setSelectedQuestion(newQuestion);
          setIsCreatingNew(false);
          alert("Question created successfully!");
        } else {
          // Update the questions list
          setQuestions(
            questions.map((q) =>
              q.id === updatedQuestion.id ? updatedQuestion : q
            )
          );
          setSelectedQuestion(updatedQuestion);
          alert("Question updated successfully!");
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update question");
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      question.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading interview questions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interview Questions Editor
          </h1>
          <p className="text-gray-600">
            Edit and manage React interview questions
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Questions List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Questions ({filteredQuestions.length})
                  </h2>
                  <button
                    onClick={handleCreateNew}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    + New Question
                  </button>
                </div>

                {/* Search */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Difficulty Filter */}
                <div className="mb-4">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    onClick={() => handleQuestionSelect(question)}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedQuestion?.id === question.id
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {question.question}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          question.difficulty === "beginner"
                            ? "bg-green-100 text-green-800"
                            : question.difficulty === "intermediate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {question.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">
                        {question.category[0]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            {selectedQuestion ? (
              <InterviewQuestionEditor
                question={selectedQuestion}
                onUpdate={handleQuestionUpdate}
                isCreating={isCreatingNew}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>Select a question to edit</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

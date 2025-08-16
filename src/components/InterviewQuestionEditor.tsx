"use client";

import { useState, useEffect } from "react";
import { InterviewQuestion } from "@/types/interview-question";
import MarkdownRenderer from "./MarkdownRenderer";

interface InterviewQuestionEditorProps {
  question: InterviewQuestion;
  onUpdate: (question: InterviewQuestion) => Promise<void>;
  isCreating?: boolean;
}

export default function InterviewQuestionEditor({
  question,
  onUpdate,
  isCreating = false,
}: InterviewQuestionEditorProps) {
  const [editedQuestion, setEditedQuestion] =
    useState<InterviewQuestion>(question);
  const [isEditing, setIsEditing] = useState(isCreating);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setEditedQuestion(question);
    setIsEditing(isCreating);
    setSaveMessage("");
  }, [question, isCreating]);

  const handleEdit = () => {
    setIsEditing(true);
    setSaveMessage("");
  };

  const handleCancel = () => {
    setEditedQuestion(question);
    setIsEditing(false);
    setSaveMessage("");
  };

  const handleSave = async () => {
    // Validate required fields
    if (!editedQuestion.question.trim()) {
      setSaveMessage("❌ Question is required");
      return;
    }

    if (!editedQuestion.answer.trim()) {
      setSaveMessage("❌ Answer is required");
      return;
    }

    if (!editedQuestion.explanation.trim()) {
      setSaveMessage("❌ Explanation is required");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      await onUpdate(editedQuestion);
      setIsEditing(false);
      setSaveMessage("✅ Question updated successfully!");
    } catch (error) {
      setSaveMessage("❌ Failed to update question");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof InterviewQuestion,
    value: string | string[]
  ) => {
    setEditedQuestion({ ...editedQuestion, [field]: value });
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setEditedQuestion({ ...editedQuestion, tags });
  };

  const handleCategoryChange = (categoryString: string) => {
    const categories = categoryString
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0);
    setEditedQuestion({ ...editedQuestion, category: categories });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isCreating ? "Create New Question" : "Edit Question"}
        </h2>
        <div className="flex space-x-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
              >
                {isSaving ? "Saving..." : isCreating ? "Create" : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      {saveMessage && (
        <div
          className={`mb-4 p-3 rounded-md ${
            saveMessage.includes("✅")
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {saveMessage}
        </div>
      )}

      <div className="space-y-6">
        {/* Question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          {isEditing ? (
            <textarea
              value={editedQuestion.question}
              onChange={(e) => handleInputChange("question", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
              {question.question}
            </p>
          )}
        </div>

        {/* Answer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Answer
          </label>
          {isEditing ? (
            <div>
              <textarea
                value={editedQuestion.answer}
                onChange={(e) => handleInputChange("answer", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter answer in markdown format..."
              />
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Preview:
                </h4>
                <div className="bg-gray-50 p-3 rounded-md border prose prose-sm max-w-none">
                  <MarkdownRenderer>{editedQuestion.answer}</MarkdownRenderer>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 rounded-md prose prose-sm max-w-none">
              <MarkdownRenderer>{question.answer}</MarkdownRenderer>
            </div>
          )}
        </div>

        {/* Explanation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Explanation
          </label>
          {isEditing ? (
            <div>
              <textarea
                value={editedQuestion.explanation}
                onChange={(e) =>
                  handleInputChange("explanation", e.target.value)
                }
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter explanation in markdown format..."
              />
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Preview:
                </h4>
                <div className="bg-gray-50 p-3 rounded-md border prose prose-sm max-w-none">
                  <MarkdownRenderer>
                    {editedQuestion.explanation}
                  </MarkdownRenderer>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 rounded-md prose prose-sm max-w-none">
              <MarkdownRenderer>{question.explanation}</MarkdownRenderer>
            </div>
          )}
        </div>

        {/* Code Example */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code Example
          </label>
          {isEditing ? (
            <div>
              <textarea
                value={editedQuestion.codeExample || ""}
                onChange={(e) =>
                  handleInputChange("codeExample", e.target.value)
                }
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Enter code example in markdown format..."
              />
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Preview:
                </h4>
                <div className="bg-gray-50 p-3 rounded-md border prose prose-sm max-w-none">
                  <MarkdownRenderer>
                    {editedQuestion.codeExample || "No code example provided"}
                  </MarkdownRenderer>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 rounded-md prose prose-sm max-w-none">
              <MarkdownRenderer>
                {question.codeExample || "No code example provided"}
              </MarkdownRenderer>
            </div>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          {isEditing ? (
            <select
              value={editedQuestion.difficulty}
              onChange={(e) =>
                handleInputChange(
                  "difficulty",
                  e.target.value as "beginner" | "intermediate" | "advanced"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          ) : (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                question.difficulty === "beginner"
                  ? "bg-green-100 text-green-800"
                  : question.difficulty === "intermediate"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {question.difficulty}
            </span>
          )}
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories (comma-separated)
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedQuestion.category.join(", ")}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="React Components, Hooks, State Management"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {question.category.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedQuestion.tags.join(", ")}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="react, hooks, state, components"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Metadata</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">ID:</span> {question.id}
            </div>
            <div>
              <span className="font-medium">Views:</span> {question.viewCount}
            </div>
            <div>
              <span className="font-medium">Helpful:</span>{" "}
              {question.helpfulCount}
            </div>
            <div>
              <span className="font-medium">Not Helpful:</span>{" "}
              {question.notHelpfulCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

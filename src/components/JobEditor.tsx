"use client";

import { useState } from "react";
import { Job } from "@/types/job";

interface JobEditorProps {
  jobs: Job[];
}

interface EditingJob {
  id: string;
  title: string;
  company: string;
  description: string;
}

export default function JobEditor({ jobs }: JobEditorProps) {
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [editingJob, setEditingJob] = useState<EditingJob | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleJobSelect = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      setSelectedJob(jobId);
      setEditingJob({
        id: job.id,
        title: job.title,
        company: job.company,
        description: job.description,
      });
      setIsEditing(false);
      setSaveMessage("");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaveMessage("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (editingJob) {
      const originalJob = jobs.find((j) => j.id === editingJob.id);
      if (originalJob) {
        setEditingJob({
          id: originalJob.id,
          title: originalJob.title,
          company: originalJob.company,
          description: originalJob.description,
        });
      }
    }
    setSaveMessage("");
  };

  const handleSave = async () => {
    if (!editingJob) return;

    setIsSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/admin/jobs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: editingJob.id,
          title: editingJob.title,
          company: editingJob.company,
          description: editingJob.description,
        }),
      });

      if (response.ok) {
        setSaveMessage("✅ Job updated successfully!");
        setIsEditing(false);
        // Refresh the page to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const error = await response.json();
        setSaveMessage(`❌ Error: ${error.message || "Failed to update job"}`);
      }
    } catch (error) {
      console.error("Job update error:", error);
      setSaveMessage("❌ Error: Failed to update job");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof EditingJob, value: string) => {
    if (editingJob) {
      setEditingJob({ ...editingJob, [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      {/* Job Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Job to Edit
        </label>
        <select
          value={selectedJob}
          onChange={(e) => handleJobSelect(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose a job...</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title} at {job.company}
            </option>
          ))}
        </select>
      </div>

      {/* Job Editor */}
      {editingJob && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Edit Job Description
            </h3>
            <div className="flex space-x-2">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>

          {saveMessage && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                saveMessage.includes("✅")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {saveMessage}
            </div>
          )}

          <div className="space-y-4">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={editingJob.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={editingJob.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                value={editingJob.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                disabled={!isEditing}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 font-mono text-sm"
                placeholder="Enter the job description..."
              />
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Use **text** for bold headers, and add line breaks for
                  better formatting
                </p>
              )}
            </div>
          </div>

          {/* Preview */}
          {isEditing && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Preview:
              </h4>
              <div className="bg-white border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div
                  className="text-gray-700 leading-relaxed"
                  style={{ lineHeight: "1.8", fontSize: "14px" }}
                  dangerouslySetInnerHTML={{
                    __html: editingJob.description
                      .replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="text-gray-900 font-semibold">$1</strong>'
                      )
                      .replace(/\n\n/g, "</p><p>")
                      .replace(/^/, "<p>")
                      .replace(/$/, "</p>")
                      .replace(/<p><\/p>/g, "")
                      .replace(
                        /<p>(<strong.*?<\/strong>)<\/p>/g,
                        '<div class="mt-4 mb-2">$1</div>'
                      ),
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedJob && (
        <div className="text-center py-8 text-gray-500">
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
          <p>Select a job from the dropdown above to edit its description</p>
        </div>
      )}
    </div>
  );
}

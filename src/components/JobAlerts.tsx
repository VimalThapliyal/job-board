"use client";

import { useState } from "react";

interface JobAlertsProps {
  className?: string;
  jobTitle?: string;
  location?: string;
}

interface AlertPreferences {
  email: string;
  jobType: string;
  location: string;
  experience: string;
  salary: string;
  frequency: string;
  skills: string[];
}

export default function JobAlerts({
  className = "",
  jobTitle = "",
  location = "",
}: JobAlertsProps) {
  const [preferences, setPreferences] = useState<AlertPreferences>({
    email: "",
    jobType: "all",
    location: location || "all",
    experience: "all",
    salary: "all",
    frequency: "weekly",
    skills: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const jobTypes = [
    { value: "all", label: "All Job Types" },
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "remote", label: "Remote" },
    { value: "internship", label: "Internship" },
  ];

  const experienceLevels = [
    { value: "all", label: "All Experience Levels" },
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior Level (5+ years)" },
  ];

  const salaryRanges = [
    { value: "all", label: "All Salary Ranges" },
    { value: "0-50k", label: "Up to $50k" },
    { value: "50k-100k", label: "$50k - $100k" },
    { value: "100k-150k", label: "$100k - $150k" },
    { value: "150k+", label: "$150k+" },
  ];

  const frequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
  ];

  const commonSkills = [
    "React",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Next.js",
    "Redux",
    "GraphQL",
    "AWS",
    "Docker",
    "Testing",
  ];

  const handleSkillToggle = (skill: string) => {
    setPreferences((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/job-alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...preferences,
          subscribedAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set up job alerts");
      }

      setIsSuccess(true);
      setPreferences({
        email: "",
        jobType: "all",
        location: "all",
        experience: "all",
        salary: "all",
        frequency: "weekly",
        skills: [],
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        className={`bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 sm:p-8 text-white text-center ${className}`}
      >
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM20 4v6h-2V4h2zM4 4v6h2V4H4z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">🎯 Job Alerts Set Up!</h3>
          <p className="text-blue-100">
            You&apos;ll receive personalized job alerts based on your
            preferences.
          </p>
        </div>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Set Up Another Alert
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 ${className}`}
    >
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM20 4v6h-2V4h2zM4 4v6h2V4H4z"
            />
          </svg>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Get Job Alerts
        </h3>
        <p className="text-gray-600">
          Never miss the perfect React job opportunity
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={preferences.email}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type
          </label>
          <select
            value={preferences.jobType}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, jobType: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {jobTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={preferences.location}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, location: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Remote, New York, London"
          />
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            value={preferences.experience}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                experience: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {experienceLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Range
          </label>
          <select
            value={preferences.salary}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, salary: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {salaryRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {commonSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  preferences.skills.includes(skill)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alert Frequency
          </label>
          <select
            value={preferences.frequency}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, frequency: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {frequencies.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Setting up alerts...
            </div>
          ) : (
            "Set Up Job Alerts"
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        You can unsubscribe at any time. We respect your privacy.
      </div>
    </div>
  );
}

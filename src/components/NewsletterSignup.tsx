"use client";

import { useState } from "react";

interface NewsletterSignupProps {
  className?: string;
}

export default function NewsletterSignup({
  className = "",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [jobType, setJobType] = useState("all");
  const [location, setLocation] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Call the API endpoint
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          jobType,
          location,
          subscribedAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      // Store in localStorage for demo purposes
      const subscriptions = JSON.parse(
        localStorage.getItem("jobAlerts") || "[]"
      );
      subscriptions.push({
        email,
        jobType,
        location,
        subscribedAt: new Date().toISOString(),
      });
      localStorage.setItem("jobAlerts", JSON.stringify(subscriptions));

      setIsSuccess(true);
      setEmail("");
      setJobType("all");
      setLocation("all");
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
        className={`bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white text-center ${className}`}
      >
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-green-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2">Successfully Subscribed!</h3>
        <p className="text-green-100 mb-4">
          You&apos;ll receive job alerts based on your preferences. Check your
          email for confirmation.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-white/20 hover:bg-white/30 transition-colors px-6 py-2 rounded-lg font-medium"
        >
          Subscribe Another Email
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white ${className}`}
    >
      <div className="text-center mb-6">
        <div className="mb-4">
          <svg
            className="w-12 h-12 mx-auto text-blue-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2">Get Job Alerts</h3>
        <p className="text-blue-100">
          Never miss the perfect React job opportunity. Get free alerts
          delivered to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-blue-100 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Job Type Preference */}
        <div>
          <label
            htmlFor="jobType"
            className="block text-sm font-medium text-blue-100 mb-2"
          >
            Job Type Preference
          </label>
          <select
            id="jobType"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
          >
            <option value="all">All Job Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* Location Preference */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-blue-100 mb-2"
          >
            Location Preference
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
          >
            <option value="all">All Locations</option>
            <option value="remote">Remote Only</option>
            <option value="us">United States</option>
            <option value="europe">Europe</option>
            <option value="asia">Asia</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-blue-800"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Subscribing...
            </div>
          ) : (
            "Get Free Job Alerts"
          )}
        </button>

        {error && (
          <div className="text-red-200 text-sm text-center bg-red-500/20 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* Privacy Notice */}
        <p className="text-xs text-blue-200 text-center">
          We respect your privacy. Unsubscribe anytime. No spam, just relevant
          job opportunities.
        </p>
      </form>
    </div>
  );
}

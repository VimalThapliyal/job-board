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

      // Success - no need to store in localStorage since we're using MongoDB
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
        className={`relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl p-8 text-white text-center ${className}`}
      >
        {/* Success Animation */}
        <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-3">🎉 You&apos;re All Set!</h3>
            <p className="text-green-100 text-lg mb-6">
              Welcome to the React job hunters club! You&apos;ll get the hottest
              opportunities delivered straight to your inbox.
            </p>
            <div className="bg-white/20 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium">What you&apos;ll get:</p>
              <ul className="text-sm text-green-100 mt-2 space-y-1">
                <li>✨ Fresh React jobs every week</li>
                <li>🚀 Remote opportunities first</li>
                <li>💰 Salary insights and trends</li>
                <li>🎯 Personalized job matches</li>
              </ul>
            </div>
          </div>
          <button
            onClick={() => setIsSuccess(false)}
            className="bg-white/20 hover:bg-white/30 transition-all duration-200 px-8 py-3 rounded-xl font-semibold transform hover:scale-105"
          >
            Subscribe Another Email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-8 text-white ${className}`}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-12 translate-y-12 animate-bounce"></div>
      <div className="absolute top-1/2 right-8 w-16 h-16 bg-white/5 rounded-full animate-spin"></div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-4">
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
                  d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Never Miss Your Dream Job
            </h2>
            <p className="text-xl text-slate-200 mb-4">
              Join 2,847+ React developers who get the best opportunities first
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-6 mb-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-blue-400 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-purple-400 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-slate-300">2,847+ developers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-300">⭐</span>
              <span className="text-slate-300">4.9/5 rating</span>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🚀</div>
            <p className="text-sm font-medium">Early Access</p>
            <p className="text-xs text-slate-300">Get jobs before others</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-sm font-medium">Salary Insights</p>
            <p className="text-xs text-slate-300">Know your worth</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm font-medium">Perfect Matches</p>
            <p className="text-xs text-slate-300">Tailored to your skills</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm font-medium">Weekly Updates</p>
            <p className="text-xs text-slate-300">Fresh opportunities</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input with Better Styling */}
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-200 mb-3"
            >
              📧 Your Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-xl bg-white/15 border-2 border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all duration-200 text-lg"
                placeholder="your.email@example.com"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Preferences Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="jobType"
                className="block text-sm font-semibold text-slate-200 mb-3"
              >
                💼 Job Type
              </label>
              <select
                id="jobType"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/15 border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all duration-200"
              >
                <option value="all">All Job Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-slate-200 mb-3"
              >
                🌍 Location
              </label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/15 border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all duration-200"
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote Only</option>
                <option value="us">United States</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 text-lg shadow-lg hover:shadow-xl"
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
                Setting up your alerts...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>🎯 Get My Job Alerts</span>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            )}
          </button>

          {error && (
            <div className="text-red-200 text-sm text-center bg-red-500/20 rounded-xl p-4 border border-red-500/30">
              {error}
            </div>
          )}

          {/* Trust Indicators */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-4 text-xs text-slate-300">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                No spam, ever
              </span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h6m-6 0h6"
                  />
                </svg>
                Unsubscribe anytime
              </span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Instant setup
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Join thousands of React developers finding their dream jobs
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

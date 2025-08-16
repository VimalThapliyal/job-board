"use client";

import { useState } from "react";
import { qualifyLead } from "@/lib/lead-qualification";
import { Lead } from "@/types/lead";

export default function TestLeadGeneration() {
  const [testLead, setTestLead] = useState<Partial<Lead>>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    experience:
      "5 years of React development with TypeScript, Node.js, and Next.js",
    coverLetter:
      "I am a senior React developer with extensive experience in building scalable web applications. I have worked with modern technologies like React, TypeScript, Node.js, and have experience with Redux, GraphQL, and AWS.",
    resumeUrl: "https://example.com/resume.pdf",
    jobTitle: "Senior React Developer",
    company: "Tech Corp",
    jobId: "test-job-123",
  });

  const [qualification, setQualification] = useState<any>(null);

  const testQualification = () => {
    const lead = testLead as Lead;
    const result = qualifyLead(lead);
    setQualification(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              🧪 Lead Generation System Test
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Test Lead Form */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Test Lead Data
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={testLead.name || ""}
                      onChange={(e) =>
                        setTestLead({ ...testLead, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={testLead.email || ""}
                      onChange={(e) =>
                        setTestLead({ ...testLead, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <textarea
                      value={testLead.experience || ""}
                      onChange={(e) =>
                        setTestLead({ ...testLead, experience: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe your experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter
                    </label>
                    <textarea
                      value={testLead.coverLetter || ""}
                      onChange={(e) =>
                        setTestLead({
                          ...testLead,
                          coverLetter: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write your cover letter..."
                    />
                  </div>

                  <button
                    onClick={testQualification}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    🎯 Test Lead Qualification
                  </button>
                </div>
              </div>

              {/* Qualification Results */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Qualification Results
                </h2>

                {qualification ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Score
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            qualification.score >= 80
                              ? "bg-purple-100 text-purple-800"
                              : qualification.score >= 60
                              ? "bg-blue-100 text-blue-800"
                              : qualification.score >= 40
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {qualification.score}/100
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Level
                        </span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold">
                          {qualification.level}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Price
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                          ${qualification.price}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Qualification Reasoning
                      </h3>
                      <ul className="space-y-1">
                        {qualification.reasoning.map(
                          (reason: string, index: number) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-center"
                            >
                              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                              {reason}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
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
                    <p className="text-gray-500">
                      Click "Test Lead Qualification" to see results
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                System Status
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">
                    Lead Qualification System
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">
                    Email Service (Resend)
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Next Steps:</strong> Set up your Resend API key in the
                  environment variables to enable email notifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

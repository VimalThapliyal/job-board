"use client";

import { useState } from "react";

export default function TestEmail() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const testEmail = async () => {
    if (!email || !name) {
      setStatus("Please enter both email and name");
      return;
    }

    setLoading(true);
    setStatus("Sending test email...");

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus(`✅ Test email sent successfully to ${email}!`);
      } else {
        setStatus(`❌ Failed to send email: ${data.error || data.message}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              🧪 Email Service Test
            </h1>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={testEmail}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "📧 Send Test Email"}
              </button>
              
              {status && (
                <div className={`mt-4 p-4 rounded-md ${
                  status.includes("✅") 
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : status.includes("❌")
                    ? "bg-red-50 border border-red-200 text-red-700"
                    : "bg-blue-50 border border-blue-200 text-blue-700"
                }`}>
                  {status}
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                What this test does:
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Sends a test confirmation email</li>
                <li>• Uses your Resend API key</li>
                <li>• Tests the email template</li>
                <li>• Verifies email delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useState, useEffect } from "react";

interface PlatformConfig {
  enabled: boolean;
  configured: boolean;
}

interface SafeConfig {
  linkedin: PlatformConfig;
}

export default function SocialMediaAdmin() {
  const [config, setConfig] = useState<SafeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/social-media/config");
      const data = await response.json();
      if (data.success) {
        setConfig(data.config);
      }
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (platform: string, enabled: boolean) => {
    if (!config) return;
    setSaving(true);
    try {
      const updatedConfig = {
        ...config,
        [platform]: {
          ...config[platform as keyof SafeConfig],
          enabled,
        },
      };
      const response = await fetch("/api/social-media/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: updatedConfig }),
      });
      const data = await response.json();
      if (data.success) {
        setConfig(updatedConfig);
        setMessage("Configuration updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to update configuration");
      }
    } catch (error) {
      setMessage("Failed to update configuration");
    } finally {
      setSaving(false);
    }
  };

  const testPost = async () => {
    const testJob = {
      id: "test-job",
      title: "Test React Developer Position",
      company: "Test Company",
      location: "Remote",
      type: "Full-time",
      salary: "$80,000 - $120,000",
      description: "This is a test job posting for social media automation.",
      applyUrl: "https://example.com/apply",
      postedDate: new Date().toISOString(),
    };
    try {
      const response = await fetch("/api/social-media/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job: testJob }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage(
          `Test post successful! Posted to ${
            data.results.filter(
              (r: import("@/types/social-media").PostingResult) => r.success
            ).length
          } platforms.`
        );
      } else {
        setMessage("Test post failed");
      }
    } catch (error) {
      setMessage("Test post failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">LinkedIn Automation</h2>
            <p>Failed to load configuration.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">LinkedIn Automation</h2>
          <p className="mb-6 text-gray-600">
            Enable or disable LinkedIn posting for automatic job posting. You
            can also test the integration below.
          </p>
          {message && (
            <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
              {message}
            </div>
          )}
          <div className="space-y-4">
            {Object.entries(config).map(([platform, settings]) => (
              <div
                key={platform}
                className="flex items-center justify-between border-b pb-3"
              >
                <div>
                  <span className="font-semibold capitalize">{platform}</span>
                  <span
                    className={`ml-2 text-xs px-2 py-1 rounded ${
                      settings.configured
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {settings.configured ? "Configured" : "Not Configured"}
                  </span>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    disabled={saving}
                    onChange={(e) => updateConfig(platform, e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span>{settings.enabled ? "Enabled" : "Disabled"}</span>
                </label>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button
              onClick={testPost}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Test LinkedIn Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

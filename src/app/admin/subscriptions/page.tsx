"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Subscription {
  email: string;
  jobType: string;
  location: string;
  subscribedAt: string;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load subscriptions from localStorage for demo
    const stored = localStorage.getItem("jobAlerts");
    if (stored) {
      setSubscriptions(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const getJobTypeCounts = () => {
    const counts: Record<string, number> = {};
    subscriptions.forEach((sub) => {
      counts[sub.jobType] = (counts[sub.jobType] || 0) + 1;
    });
    return counts;
  };

  const getLocationCounts = () => {
    const counts: Record<string, number> = {};
    subscriptions.forEach((sub) => {
      counts[sub.location] = (counts[sub.location] || 0) + 1;
    });
    return counts;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  const jobTypeCounts = getJobTypeCounts();
  const locationCounts = getLocationCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Email Subscriptions
              </h1>
              <p className="text-gray-600 mt-2">
                Track user engagement and subscription preferences
              </p>
            </div>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Jobs
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">
              {subscriptions.length}
            </div>
            <div className="text-sm text-gray-600">Total Subscribers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {new Set(subscriptions.map((s) => s.email)).size}
            </div>
            <div className="text-sm text-gray-600">Unique Emails</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-orange-600">
              {Object.keys(jobTypeCounts).length}
            </div>
            <div className="text-sm text-gray-600">Job Type Preferences</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(locationCounts).length}
            </div>
            <div className="text-sm text-gray-600">Location Preferences</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Job Type Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Job Type Preferences
            </h3>
            <div className="space-y-3">
              {Object.entries(jobTypeCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">
                      {type.replace("-", " ")}
                    </span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(count / subscriptions.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Location Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Location Preferences
            </h3>
            <div className="space-y-3">
              {Object.entries(locationCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([location, count]) => (
                  <div
                    key={location}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-700 capitalize">
                      {location.replace("-", " ")}
                    </span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(count / subscriptions.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Subscriptions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions
                  .sort(
                    (a, b) =>
                      new Date(b.subscribedAt).getTime() -
                      new Date(a.subscribedAt).getTime()
                  )
                  .slice(0, 20)
                  .map((subscription, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subscription.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {subscription.jobType.replace("-", " ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {subscription.location.replace("-", " ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          subscription.subscribedAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {subscriptions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📧</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No subscriptions yet
            </h3>
            <p className="text-gray-500">
              When users subscribe to job alerts, they&apos;ll appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { Job } from "@/types/job";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {job.logo && (
              <img
                src={job.logo}
                alt={`${job.company} logo`}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {job.title}
              </h3>
              <p className="text-gray-600 font-medium">{job.company}</p>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {job.location}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.861-8.96-2.545M21 13.255l-3.432-.388c-1.086-.123-2.082-.5-2.918-1.1M21 13.255l-3.432-.388c-1.086-.123-2.082-.5-2.918-1.1M21 13.255l-3.432-.388c-1.086-.123-2.082-.5-2.918-1.1"
              />
            </svg>
            {job.type}
          </div>

          {job.salary && (
            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              {job.salary}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm line-clamp-3 mb-4">
          {job.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Posted {formatDate(job.postedDate)}
          </span>

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Apply Now
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

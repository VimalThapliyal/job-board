"use client";

import { formatDistanceToNow } from "date-fns";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const getJobTypeColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("full")) return "bg-green-100 text-green-800";
    if (lowerType.includes("part")) return "bg-blue-100 text-blue-800";
    if (lowerType.includes("contract")) return "bg-orange-100 text-orange-800";
    if (lowerType.includes("remote")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  const getSalaryColor = (salary?: string) => {
    if (!salary) return "";
    const amount = parseInt(salary.replace(/[^0-9]/g, ""));
    if (amount >= 150000) return "text-green-600";
    if (amount >= 100000) return "text-blue-600";
    return "text-gray-600";
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header with subtle gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-100 transition-colors">
              {job.title}
            </h3>
            <p className="text-blue-100 font-medium">{job.company}</p>
          </div>
          {job.logo && (
            <div className="ml-4">
              <img
                src={job.logo}
                alt={`${job.company} logo`}
                className="w-12 h-12 rounded-lg bg-white/20 p-2"
              />
            </div>
          )}
        </div>

        {/* Job type badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(
              job.type
            )}`}
          >
            {job.type}
          </span>
          {job.salary && (
            <span
              className={`text-sm font-semibold ${getSalaryColor(job.salary)}`}
            >
              💰 {job.salary}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Location and posted date */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
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
            <span className="font-medium">{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {formatDistanceToNow(new Date(job.postedDate), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
          {job.description}
        </p>

        {/* Skills/Tags */}
        {job.skills && job.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Experience level */}
        {job.experience && (
          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                />
              </svg>
              {job.experience}
            </span>
          </div>
        )}

        {/* Apply Button */}
        <a
          href={`${job.applyUrl}${
            job.applyUrl.includes("?") ? "&" : "?"
          }utm_source=remote-react-jobs&utm_medium=job-board&utm_campaign=react-developer-jobs`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            // Track application clicks for analytics
            if (typeof window !== "undefined" && window.gtag) {
              window.gtag("event", "job_application", {
                job_title: job.title,
                company: job.company,
                location: job.location,
                job_type: job.type,
              });
            }
          }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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

        {/* Apply button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button className="ml-3 p-3 text-gray-400 hover:text-blue-600 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-700/0 group-hover:from-blue-600/5 group-hover:to-blue-700/5 transition-all duration-300 pointer-events-none rounded-2xl"></div>
    </div>
  );
}

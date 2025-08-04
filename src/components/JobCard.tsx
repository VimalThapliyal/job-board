"use client";

import { formatDistanceToNow } from "date-fns";
import { Job } from "@/types/job";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";

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
    try {
      const amount = parseInt(salary.replace(/[^0-9]/g, ""));
      if (isNaN(amount)) return "";
      if (amount >= 150000) return "text-green-600";
      if (amount >= 100000) return "text-blue-600";
      return "text-gray-600";
    } catch (error) {
      console.warn("Error parsing salary:", salary, error);
      return "";
    }
  };

  const isMeaningfulSalary = (salary?: string) => {
    if (!salary) return false;

    // List of generic phrases that don't provide useful salary information
    const genericPhrases = [
      "competitive salary",
      "competitive",
      "salary",
      "competitive compensation",
      "market rate",
      "market competitive",
      "attractive salary",
      "excellent salary",
      "great salary",
      "good salary",
      "fair salary",
      "reasonable salary",
      "salary commensurate",
      "salary based on experience",
      "salary depending on experience",
      "salary to be discussed",
      "salary negotiable",
      "salary tbd",
      "salary t.b.d.",
      "salary to be determined",
    ];

    const lowerSalary = salary.toLowerCase().trim();

    // Check if it's just a generic phrase
    if (genericPhrases.some((phrase) => lowerSalary.includes(phrase))) {
      return false;
    }

    // Check if it contains actual numbers (dollar amounts, ranges, etc.)
    const hasNumbers = /\d/.test(salary);
    const hasDollarSign = salary.includes("$");
    const hasRange =
      salary.includes("-") || salary.includes("to") || salary.includes("up to");

    return hasNumbers && (hasDollarSign || hasRange);
  };

  // Structured data for the job posting
  const jobStructuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedDate,
    validThrough: new Date(
      new Date(job.postedDate).getTime() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(), // 30 days from posting
    employmentType: job.type,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      url: job.applyUrl.split("/").slice(0, 3).join("/"), // Extract domain from apply URL
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "US",
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: job.location.toLowerCase().includes("remote")
        ? "Worldwide"
        : "United States",
    },
    baseSalary: job.salary
      ? {
          "@type": "MonetaryAmount",
          currency: "USD",
          value: job.salary?.replace(/[^0-9]/g, "") || "0",
        }
      : undefined,
    qualifications: job.skills?.join(", "),
    experienceRequirements: job.experience,
    responsibilities: job.description,
    benefits: "Remote work, competitive salary, health benefits",
    applicationContact: {
      "@type": "ContactPoint",
      contactType: "application",
      url: `/jobs/${job.id}`,
    },
    url: `/jobs/${job.id}`,
    identifier: {
      "@type": "PropertyValue",
      name: job.company,
      value: job.id,
    },
  };

  return (
    <>
      {/* Structured Data for this job */}
      <Script
        id={`job-structured-data-${job.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobStructuredData),
        }}
      />

      <Link href={`/jobs/${encodeURIComponent(job.id)}`} className="block">
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer">
          {/* Header with subtle gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-100 transition-colors">
                  {job.title}
                </h3>
                <p className="text-blue-100 font-medium">{job.company}</p>
              </div>
              {job.logo ? (
                <div className="ml-4">
                  <Image
                    src={job.logo}
                    alt={`${job.company} logo`}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-lg bg-white/20 p-2"
                    onError={(e) => {
                      // Hide the image if it fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="ml-4 w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {job.company.charAt(0).toUpperCase()}
                  </span>
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
              {isMeaningfulSalary(job.salary) && (
                <span
                  className={`text-sm font-semibold ${getSalaryColor(
                    job.salary
                  )}`}
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs">
                  {formatDistanceToNow(new Date(job.postedDate), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            {/* Job description */}
            <div className="mb-4">
              <p className="text-gray-700 text-sm line-clamp-3">
                {job.description}
              </p>
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Required Skills:
                </h4>
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

            {/* View Details Button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                View Details
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Like button */}
              <button className="p-3 text-gray-400 hover:text-blue-600 transition-colors">
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
      </Link>
    </>
  );
}

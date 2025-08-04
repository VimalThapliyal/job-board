"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import NewsletterSignup from "@/components/NewsletterSignup";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import { Job } from "@/types/job";
import Link from "next/link";
import Script from "next/script";

// Countdown Timer Component - Redesigned
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextUpdate = new Date();

      // Set next update to the next 6-hour mark (00:00, 06:00, 12:00, 18:00)
      const currentHour = now.getHours();
      const nextHour = Math.ceil(currentHour / 6) * 6;
      nextUpdate.setHours(nextHour, 0, 0, 0);

      // If we're past the last 6-hour mark of the day, go to next day
      if (nextHour >= 24) {
        nextUpdate.setDate(nextUpdate.getDate() + 1);
        nextUpdate.setHours(0, 0, 0, 0);
      }

      const difference = nextUpdate.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
      <div className="flex items-center gap-1">
        <svg
          className="w-4 h-4 text-blue-200"
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
        <span className="text-blue-100 text-sm font-medium">Fresh jobs in</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-white font-bold text-lg">
          {timeLeft.hours.toString().padStart(2, "0")}
        </span>
        <span className="text-blue-200 text-sm">h</span>
        <span className="text-white font-bold mx-1">:</span>
        <span className="text-white font-bold text-lg">
          {timeLeft.minutes.toString().padStart(2, "0")}
        </span>
        <span className="text-blue-200 text-sm">m</span>
        <span className="text-white font-bold mx-1">:</span>
        <span className="text-white font-bold text-lg">
          {timeLeft.seconds.toString().padStart(2, "0")}
        </span>
        <span className="text-blue-200 text-sm">s</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [visibleCount, setVisibleCount] = useState(9); // Start with 9 jobs
  const [loadingMore, setLoadingMore] = useState(false);

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://job-board-ieb1mlfcs-vimalthapliyals-projects.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "React Developer Jobs",
        item: "https://job-board-ieb1mlfcs-vimalthapliyals-projects.vercel.app",
      },
    ],
  };

  // Job collection structured data
  const jobCollectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "React Developer Jobs",
    description: "Latest React developer job opportunities from top companies",
    numberOfItems: jobs.length,
    itemListElement: jobs.slice(0, 20).map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "JobPosting",
        title: job.title,
        hiringOrganization: {
          "@type": "Organization",
          name: job.company,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location,
          },
        },
        employmentType: job.type,
        datePosted: job.postedDate,
      },
    })),
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs");
      const data = await response.json();
      setJobs(data);
      setFilteredJobs(data);
      setDisplayedJobs(data.slice(0, 9)); // Show 9 jobs initially
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  const loadMoreJobs = () => {
    if (visibleCount >= filteredJobs.length) return;

    setLoadingMore(true);
    setTimeout(() => {
      const newCount = Math.min(visibleCount + 9, filteredJobs.length); // Load 9 more jobs at once
      setVisibleCount(newCount);
      setDisplayedJobs(filteredJobs.slice(0, newCount));
      setLoadingMore(false);
    }, 500);
  };

  const generateJobTypes = () => {
    const jobTypeCounts = jobs.reduce((acc, job) => {
      const type = job.type.toLowerCase();
      if (type.includes("full")) acc.fullTime = (acc.fullTime || 0) + 1;
      else if (type.includes("part")) acc.partTime = (acc.partTime || 0) + 1;
      else if (type.includes("contract"))
        acc.contract = (acc.contract || 0) + 1;
      else if (type.includes("remote")) acc.remote = (acc.remote || 0) + 1;
      else if (type.includes("intern"))
        acc.internship = (acc.internship || 0) + 1;
      else acc.other = (acc.other || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { id: "all", label: "All Jobs", count: jobs.length },
      {
        id: "full-time",
        label: "Full Time",
        count: jobTypeCounts.fullTime || 0,
      },
      {
        id: "part-time",
        label: "Part Time",
        count: jobTypeCounts.partTime || 0,
      },
      { id: "contract", label: "Contract", count: jobTypeCounts.contract || 0 },
      { id: "remote", label: "Remote", count: jobTypeCounts.remote || 0 },
      {
        id: "internship",
        label: "Internship",
        count: jobTypeCounts.internship || 0,
      },
      { id: "other", label: "Other", count: jobTypeCounts.other || 0 },
    ].filter((type) => type.count > 0);
  };

  const jobTypes = generateJobTypes();

  const handleFooterLink = (filter: string) => {
    if (filter === "Remote Jobs") {
      setSelectedJobType("remote");
    } else if (filter === "Full Time") {
      setSelectedJobType("full-time");
    } else if (filter === "Contract") {
      setSelectedJobType("contract");
    }
  };

  const filterJobs = useCallback(() => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by job type
    if (selectedJobType !== "all") {
      filtered = filtered.filter((job) =>
        job.type.toLowerCase().includes(selectedJobType.toLowerCase())
      );
    }

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return (
            new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
          );
        case "company":
          return a.company.localeCompare(b.company);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
    setDisplayedJobs(filtered.slice(0, 9)); // Show 9 jobs after filtering
    setVisibleCount(9); // Reset to 9
  }, [jobs, searchTerm, selectedJobType, sortBy]);

  useEffect(() => {
    filterJobs();
  }, [filterJobs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">
              Loading amazing jobs for you...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Structured Data */}
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <Script
        id="job-collection-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobCollectionStructuredData),
        }}
      />

      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="absolute inset-0 bg-black opacity-5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                Find Your Dream
                <span className="block text-blue-100">React Job</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Discover the best React developer opportunities from top
                companies worldwide. Updated every 6 hours with fresh
                opportunities.
              </p>

              {/* Redesigned Countdown Timer */}
              <div className="flex justify-center mb-8">
                <CountdownTimer />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 w-full max-w-2xl">
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search jobs, companies, or skills..."
                    className="w-full text-lg py-4"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subtle floating elements */}
          <div className="absolute top-10 left-10 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-20 w-12 h-12 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-1/4 w-8 h-8 bg-white/5 rounded-full animate-spin"></div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <div className="text-2xl font-bold">{jobs.length}</div>
                <div className="text-sm opacity-90">Active Jobs</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                <div className="text-2xl font-bold">
                  {new Set(jobs.map((j) => j.company)).size}
                </div>
                <div className="text-sm opacity-90">Companies</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                <div className="text-2xl font-bold">
                  {
                    jobs.filter((j) =>
                      j.location.toLowerCase().includes("remote")
                    ).length
                  }
                </div>
                <div className="text-sm opacity-90">Remote Jobs</div>
              </div>
              <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg p-4 text-white">
                <div className="text-2xl font-bold">6h</div>
                <div className="text-sm opacity-90">Update Cycle</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Job Type Filter */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Job Type
                </h3>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedJobType(type.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedJobType === type.id
                          ? "bg-blue-600 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                      }`}
                    >
                      {type.label} ({type.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="lg:w-48">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="latest">Latest First</option>
                  <option value="company">Company Name</option>
                  <option value="title">Job Title</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
              </h2>
              {searchTerm && (
                <div className="text-sm text-gray-600">
                  Showing results for &quot;{searchTerm}&quot;
                </div>
              )}
            </div>

            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {displayedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="transform hover:scale-105 transition-all duration-300"
                    >
                      <JobCard job={job} />
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {visibleCount < filteredJobs.length && (
                  <div className="flex justify-center items-center py-8">
                    <button
                      onClick={loadMoreJobs}
                      disabled={loadingMore}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none flex items-center gap-2"
                    >
                      {loadingMore ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          Load More Jobs
                          <span className="text-sm opacity-75">
                            ({filteredJobs.length - visibleCount} more)
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* End of results */}
                {visibleCount >= filteredJobs.length &&
                  filteredJobs.length > 0 && (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-2">✨</div>
                      <p className="text-gray-500 text-sm">
                        You&apos;ve reached the end! All {filteredJobs.length}{" "}
                        jobs are displayed.
                      </p>
                    </div>
                  )}
              </>
            )}
          </div>
        </div>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Newsletter Signup Section - Full Width */}
        <div className="w-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <NewsletterSignup />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

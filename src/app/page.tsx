"use client";

import { useState, useEffect, useCallback } from "react";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import { Job } from "@/types/job";
import Link from "next/link";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetchJobs();
  }, []);

  const filterJobs = useCallback(() => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Job type filter
    if (selectedJobType !== "all") {
      filtered = filtered.filter((job) =>
        job.type.toLowerCase().includes(selectedJobType.toLowerCase())
      );
    }

    // Sort jobs
    switch (sortBy) {
      case "latest":
        filtered = filtered.sort(
          (a, b) =>
            new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
        break;
      case "company":
        filtered = filtered.sort((a, b) => a.company.localeCompare(b.company));
        break;
      case "title":
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, locationFilter, selectedJobType, sortBy]);

  useEffect(() => {
    filterJobs();
  }, [filterJobs]);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs");
      const data = await response.json();
      setJobs(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  // Generate job types from actual data
  const generateJobTypes = () => {
    const typeCounts: { [key: string]: number } = {};
    jobs.forEach((job) => {
      const type = job.type.toLowerCase();
      if (type.includes("full"))
        typeCounts["full-time"] = (typeCounts["full-time"] || 0) + 1;
      else if (type.includes("part"))
        typeCounts["part-time"] = (typeCounts["part-time"] || 0) + 1;
      else if (type.includes("contract"))
        typeCounts["contract"] = (typeCounts["contract"] || 0) + 1;
      else if (type.includes("remote"))
        typeCounts["remote"] = (typeCounts["remote"] || 0) + 1;
      else typeCounts["other"] = (typeCounts["other"] || 0) + 1;
    });

    return [
      { id: "all", label: "All Types", count: jobs.length },
      ...Object.entries(typeCounts).map(([id, count]) => ({
        id,
        label: id
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        count,
      })),
    ];
  };

  // Generate locations from actual data
  const generateLocations = () => {
    const locationCounts: { [key: string]: number } = {};
    jobs.forEach((job) => {
      const location = job.location.toLowerCase();
      if (location.includes("remote"))
        locationCounts["Remote"] = (locationCounts["Remote"] || 0) + 1;
      else if (location.includes("new york") || location.includes("nyc"))
        locationCounts["New York"] = (locationCounts["New York"] || 0) + 1;
      else if (location.includes("san francisco") || location.includes("sf"))
        locationCounts["San Francisco"] =
          (locationCounts["San Francisco"] || 0) + 1;
      else if (location.includes("london"))
        locationCounts["London"] = (locationCounts["London"] || 0) + 1;
      else if (location.includes("toronto"))
        locationCounts["Toronto"] = (locationCounts["Toronto"] || 0) + 1;
      else if (location.includes("berlin"))
        locationCounts["Berlin"] = (locationCounts["Berlin"] || 0) + 1;
      else {
        // Extract city from location (take first part before comma or parentheses)
        const city = location.split(",")[0].split("(")[0].trim();
        if (city) {
          const cityKey = city.charAt(0).toUpperCase() + city.slice(1);
          locationCounts[cityKey] = (locationCounts[cityKey] || 0) + 1;
        }
      }
    });

    return Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([location, count]) => ({ location, count }));
  };

  const jobTypes = generateJobTypes();
  const popularLocations = generateLocations();

  const handleFooterLink = (filter: string) => {
    if (filter === "remote") {
      setLocationFilter("Remote");
      setSelectedJobType("all");
    } else if (filter === "full-time") {
      setSelectedJobType("full-time");
      setLocationFilter("");
    } else if (filter === "contract") {
      setSelectedJobType("contract");
      setLocationFilter("");
    }
  };

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
              Discover the best React developer opportunities from top companies
              worldwide. Updated every 6 hours with fresh opportunities.
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

          {/* Location Filter */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Popular Locations
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {popularLocations.map((loc) => (
                <button
                  key={loc.location}
                  onClick={() => setLocationFilter(loc.location)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    locationFilter === loc.location
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  {loc.location} ({loc.count})
                </button>
              ))}
            </div>
            <FilterBar value={locationFilter} onChange={setLocationFilter} />
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"}{" "}
              Found
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="transform hover:scale-105 transition-all duration-300"
                >
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mb-4">Remote React Jobs</h3>
              <p className="text-gray-300 mb-4">
                Your go-to platform for finding the best remote React developer
                opportunities. Updated every 6 hours with fresh job listings
                from top companies worldwide.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com/intent/tweet?text=Check%20out%20these%20amazing%20remote%20React%20developer%20jobs!&url=https://job-board-nyjoo8uew-vimalthapliyals-projects.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/sharing/share-offsite/?url=https://job-board-nyjoo8uew-vimalthapliyals-projects.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/sharer/sharer.php?u=https://job-board-nyjoo8uew-vimalthapliyals-projects.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleFooterLink("Remote Jobs")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Remote Jobs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFooterLink("Full Time")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Full Time
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFooterLink("Contract")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contract
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Remote React Jobs. All rights reserved. |
              <span className="ml-2 text-gray-500">
                Jobs updated every 6 hours
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

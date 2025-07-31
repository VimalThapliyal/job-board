"use client";

import { useState, useEffect, useCallback } from "react";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import { Job } from "@/types/job";

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

  const jobTypes = [
    { id: "all", label: "All Types", count: jobs.length },
    {
      id: "full-time",
      label: "Full Time",
      count: jobs.filter((j) => j.type.toLowerCase().includes("full")).length,
    },
    {
      id: "part-time",
      label: "Part Time",
      count: jobs.filter((j) => j.type.toLowerCase().includes("part")).length,
    },
    {
      id: "contract",
      label: "Contract",
      count: jobs.filter((j) => j.type.toLowerCase().includes("contract"))
        .length,
    },
    {
      id: "remote",
      label: "Remote",
      count: jobs.filter((j) => j.location.toLowerCase().includes("remote"))
        .length,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Find Your Dream
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                React Job
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover the best React developer opportunities from top companies
              worldwide. Updated every 6 hours with fresh opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-1">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search jobs, companies, or skills..."
                  className="w-full sm:w-96"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-spin"></div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">{jobs.length}</div>
              <div className="text-sm opacity-90">Active Jobs</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">
                {new Set(jobs.map((j) => j.company)).size}
              </div>
              <div className="text-sm opacity-90">Companies</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">
                {
                  jobs.filter((j) =>
                    j.location.toLowerCase().includes("remote")
                  ).length
                }
              </div>
              <div className="text-sm opacity-90">Remote Jobs</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
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

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-blue-100 mb-6">
            Get notified about new React developer opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">React Job Board</h4>
              <p className="text-gray-400">
                The best place to find React developer opportunities from top
                companies worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Remote Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Full Time
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contract
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">
                Questions? Reach out to us at
                <br />
                <a
                  href="mailto:hello@reactjobboard.com"
                  className="text-blue-400 hover:text-blue-300"
                >
                  hello@reactjobboard.com
                </a>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 React Job Board. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

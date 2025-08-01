"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Job } from "@/types/job";

interface JobResponse {
  jobs: Job[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalJobs: number;
    jobsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    jobsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchJobs = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs?page=${page}&limit=12`);

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data: JobResponse = await response.json();
      setJobs(data.jobs);
      setFilteredJobs(data.jobs);
      setPagination(data.pagination);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, []);

  const handlePageChange = async (page: number) => {
    await fetchJobs(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterJobs(term, selectedLocation, selectedType);
  };

  const handleLocationFilter = (location: string) => {
    setSelectedLocation(location);
    filterJobs(searchTerm, location, selectedType);
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
    filterJobs(searchTerm, selectedLocation, type);
  };

  const filterJobs = (search: string, location: string, type: string) => {
    let filtered = jobs;

    if (search) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.company.toLowerCase().includes(search.toLowerCase()) ||
          job.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (type) {
      filtered = filtered.filter(
        (job) => job.type.toLowerCase() === type.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedType("");
    setFilteredJobs(jobs);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Remote React Jobs
                </h1>
                <nav className="hidden md:flex space-x-6">
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    href="/jobs"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Jobs
                  </Link>
                  <a
                    href="/about"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    About
                  </a>
                  <a
                    href="/contact"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Contact
                  </a>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Admin
                </Link>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Post a Job
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Remote React Jobs
                </h1>
                <nav className="hidden md:flex space-x-6">
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    href="/jobs"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Jobs
                  </Link>
                  <a
                    href="/about"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    About
                  </a>
                  <a
                    href="/contact"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Contact
                  </a>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Admin
                </Link>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Post a Job
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-600 text-lg font-semibold">
              Error: {error}
            </div>
            <button
              onClick={() => fetchJobs(1)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Remote React Jobs
              </h1>
              <nav className="hidden md:flex space-x-6">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/jobs"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Jobs
                </Link>
                <a
                  href="/about"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  About
                </a>
                <a
                  href="/contact"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Contact
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Admin
              </Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Post a Job
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Dream{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              React Job
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover the latest remote React developer opportunities from top
            companies worldwide. Filter by location, job type, and find your
            perfect match.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-blue-600">
                {pagination.totalJobs}
              </div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-purple-600">Remote</div>
              <div className="text-gray-600">Work from Anywhere</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-green-600">Top</div>
              <div className="text-gray-600">Companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="mb-8">
            <FilterBar
              onLocationFilter={handleLocationFilter}
              onTypeFilter={handleTypeFilter}
              onClearFilters={clearFilters}
              selectedLocation={selectedLocation}
              selectedType={selectedType}
            />
          </div>

          {/* Job Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredJobs.length === jobs.length
                ? `Showing ${pagination.totalJobs} jobs`
                : `Found ${filteredJobs.length} jobs matching your criteria`}
            </p>
          </div>

          {/* Jobs Grid */}
          {filteredJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Pagination - Only show if we have more than 12 jobs and no filters applied */}
              {pagination.totalPages > 1 &&
                filteredJobs.length === jobs.length && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      totalJobs={pagination.totalJobs}
                      jobsPerPage={pagination.jobsPerPage}
                      hasNextPage={pagination.hasNextPage}
                      hasPrevPage={pagination.hasPrevPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                {jobs.length === 0
                  ? "No jobs available at the moment."
                  : "No jobs match your criteria."}
              </div>
              {jobs.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Remote React Jobs</h3>
              <p className="text-gray-400">
                Your go-to platform for finding the best remote React developer
                opportunities.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/jobs" className="hover:text-white">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <a href="/resume" className="hover:text-white">
                    Resume Tips
                  </a>
                </li>
                <li>
                  <a href="/interview" className="hover:text-white">
                    Interview Prep
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/post-job" className="hover:text-white">
                    Post a Job
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Remote React Jobs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

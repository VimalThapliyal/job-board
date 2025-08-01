"use client";

import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
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
      <div className="min-h-screen bg-gray-50">
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
      <div className="min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600">
            Discover the latest React developer opportunities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <SearchBar onSearch={handleSearch} />
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
    </div>
  );
}

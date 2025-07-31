"use client";

import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import { Job } from "@/types/job";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    // Load jobs from JSON file (will be replaced with API call)
    const loadJobs = async () => {
      try {
        const response = await fetch("/api/jobs");
        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error("Error loading jobs:", error);
        // Fallback to sample data
        setJobs(sampleJobs);
        setFilteredJobs(sampleJobs);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    // Filter jobs based on search term and location
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation =
        !locationFilter ||
        job.location.toLowerCase().includes(locationFilter.toLowerCase());
      return matchesSearch && matchesLocation;
    });
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, locationFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Remote React Developer Jobs
          </h1>
          <p className="mt-2 text-gray-600">
            Find the best remote React developer opportunities
          </p>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search jobs by title or company..."
        />
        <FilterBar
          location={locationFilter}
          onLocationChange={setLocationFilter}
        />
      </div>

      {/* Job Listings */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}{" "}
            found
          </h2>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Sample data for development
const sampleJobs: Job[] = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechCorp",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $150k",
    description:
      "We are looking for a senior React developer to join our team...",
    applyUrl: "https://example.com/apply/1",
    postedDate: "2024-01-15",
    logo: "https://via.placeholder.com/50",
  },
  {
    id: "2",
    title: "React Frontend Engineer",
    company: "StartupXYZ",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$100k - $130k",
    description:
      "Join our fast-growing startup as a React frontend engineer...",
    applyUrl: "https://example.com/apply/2",
    postedDate: "2024-01-14",
    logo: "https://via.placeholder.com/50",
  },
  {
    id: "3",
    title: "React Developer",
    company: "BigTech Inc",
    location: "Remote",
    type: "Contract",
    salary: "$80k - $100k",
    description:
      "Contract position for React developer with 3+ years experience...",
    applyUrl: "https://example.com/apply/3",
    postedDate: "2024-01-13",
    logo: "https://via.placeholder.com/50",
  },
];

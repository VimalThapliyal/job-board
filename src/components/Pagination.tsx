"use client";

import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  jobsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalJobs,
  jobsPerPage,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: PaginationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    setIsLoading(true);
    await onPageChange(page);
    setIsLoading(false);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
      {/* Job count info */}
      <div className="text-sm text-gray-700">
        Showing {(currentPage - 1) * jobsPerPage + 1} to{" "}
        {Math.min(currentPage * jobsPerPage, totalJobs)} of {totalJobs} jobs
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrevPage || isLoading}
          className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            hasPrevPage
              ? "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
              : "text-gray-300 bg-gray-100 border border-gray-200 cursor-not-allowed"
          }`}
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && handlePageChange(page)}
              disabled={isLoading}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : page === "..."
                  ? "text-gray-500 cursor-default"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage || isLoading}
          className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            hasNextPage
              ? "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
              : "text-gray-300 bg-gray-100 border border-gray-200 cursor-not-allowed"
          }`}
        >
          Next
          <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}

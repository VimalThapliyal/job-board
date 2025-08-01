"use client";

interface FilterBarProps {
  onLocationFilter: (location: string) => void;
  onTypeFilter: (type: string) => void;
  onClearFilters: () => void;
  selectedLocation: string;
  selectedType: string;
}

export default function FilterBar({
  onLocationFilter,
  onTypeFilter,
  onClearFilters,
  selectedLocation,
  selectedType,
}: FilterBarProps) {
  const popularLocations = [
    "Remote",
    "New York",
    "San Francisco",
    "London",
    "Berlin",
    "Toronto",
  ];

  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Location Filter */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {popularLocations.map((location) => (
              <button
                key={location}
                onClick={() => onLocationFilter(location)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedLocation === location
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                {location}
              </button>
            ))}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
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
            </div>
            <input
              type="text"
              value={selectedLocation}
              onChange={(e) => onLocationFilter(e.target.value)}
              placeholder="Enter custom location..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Job Type Filter */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Type</h3>
          <div className="flex flex-wrap gap-2">
            {jobTypes.map((type) => (
              <button
                key={type}
                onClick={() => onTypeFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedType === type
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <div className="lg:w-auto">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}

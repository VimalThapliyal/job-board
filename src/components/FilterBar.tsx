"use client";

interface FilterBarProps {
  location: string;
  onLocationChange: (value: string) => void;
}

export default function FilterBar({
  location,
  onLocationChange,
}: FilterBarProps) {
  const popularLocations = [
    "Remote",
    "San Francisco",
    "New York",
    "London",
    "Berlin",
  ];

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          Filter by location:
        </span>

        {/* Popular location buttons */}
        <div className="flex flex-wrap gap-2">
          {popularLocations.map((loc) => (
            <button
              key={loc}
              onClick={() => onLocationChange(location === loc ? "" : loc)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${
                location === loc
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* Custom location input */}
        <div className="relative">
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Enter location..."
            className="px-3 py-1 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Clear filters */}
        {location && (
          <button
            onClick={() => onLocationChange("")}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

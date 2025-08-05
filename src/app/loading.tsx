import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Loading() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section Skeleton */}
          <div className="text-center mb-12">
            <div className="w-3/4 h-12 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="w-1/2 h-6 bg-gray-200 rounded mx-auto mb-8 animate-pulse"></div>
            <div className="w-64 h-12 bg-blue-600 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Search and Filter Skeleton */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-16 h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-14 h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="w-28 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-10 h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="w-22 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Job Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="w-3/4 h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="w-1/2 h-4 bg-blue-200 rounded mb-3 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="w-1/3 h-3 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-1/4 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-green-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="w-full h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-5/6 h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-4/5 h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="w-16 h-6 bg-blue-200 rounded-full animate-pulse"></div>
                  <div className="w-20 h-6 bg-blue-200 rounded-full animate-pulse"></div>
                  <div className="w-14 h-6 bg-blue-200 rounded-full animate-pulse"></div>
                </div>
                <div className="w-full h-10 bg-blue-600 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminLoading() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Page Header Skeleton */}
          <div className="mb-8">
            <div className="w-64 h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="w-96 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="w-16 h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-48 h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
            <div className="space-y-4">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

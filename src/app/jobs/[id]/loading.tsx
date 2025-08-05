import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function JobDetailLoading() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb Skeleton */}
          <nav className="mb-8">
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Details Skeleton */}
            <div className="lg:col-span-2">
              {/* Job Header Skeleton */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="w-3/4 h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
                    <div className="w-1/2 h-6 bg-blue-200 rounded mb-4 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="w-1/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-1/5 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="w-20 h-6 bg-green-200 rounded animate-pulse"></div>
                    <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Job Description Skeleton */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="w-48 h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="space-y-4">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Skills Skeleton */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="w-40 h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="w-20 h-8 bg-blue-200 rounded-full animate-pulse"></div>
                  <div className="w-24 h-8 bg-blue-200 rounded-full animate-pulse"></div>
                  <div className="w-16 h-8 bg-blue-200 rounded-full animate-pulse"></div>
                  <div className="w-28 h-8 bg-blue-200 rounded-full animate-pulse"></div>
                  <div className="w-22 h-8 bg-blue-200 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Experience Skeleton */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="w-48 h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Application Form Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <div className="w-40 h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="space-y-4">
                  <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-12 bg-blue-600 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 
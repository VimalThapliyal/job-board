import { Metadata } from "next";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface JobPageProps {
  params: Promise<{
    id: string;
  }>;
}

// This would be replaced with actual job fetching logic
async function getJob(id: string) {
  // In a real app, you'd fetch from your API or database
  return {
    id,
    title: "React Developer",
    company: "Tech Company",
    location: "Remote",
    type: "Full-time",
    description: "We are looking for a React developer...",
    applyUrl: "https://example.com/apply",
    postedDate: "2025-01-15",
    salary: "$80,000 - $120,000",
  };
}

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);

  return {
    title: `${job.title} at ${job.company} - Remote React Jobs`,
    description: `Apply for ${job.title} position at ${job.company}. ${job.location} - ${job.type}`,
    keywords: [
      "react developer",
      "remote jobs",
      "frontend developer",
      job.company.toLowerCase(),
    ],
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: `Apply for ${job.title} position at ${job.company}`,
      type: "website",
    },
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;
  const job = await getJob(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Jobs
          </Link>
        </nav>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {job.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{job.company}</p>
              <div className="flex items-center gap-4 text-gray-500">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
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
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.815-9-2.145M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.815-9-2.145"
                    />
                  </svg>
                  {job.type}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Posted{" "}
                  {formatDistanceToNow(new Date(job.postedDate), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            {job.salary && (
              <div className="text-right">
                <span className="text-2xl font-bold text-green-600">
                  {job.salary}
                </span>
              </div>
            )}
          </div>

          {/* Apply Button */}
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Apply Now
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Job Description
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>
        </div>

        {/* Related Jobs */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            More React Developer Jobs
          </h3>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Browse All Jobs
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

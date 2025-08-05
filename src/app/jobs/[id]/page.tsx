import { Metadata } from "next";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getJobById } from "@/lib/database";

import ApplicationForm from "@/components/ApplicationForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface JobPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Function to format job description text
function formatJobDescription(description: string): string {
  if (!description) return "";

  // Split by common section markers and add line breaks
  const formatted = description
    // Add line breaks before common section headers
    .replace(/(\d+,\d+)([A-Z])/g, "$1\n\n$2") // Numbers followed by capital letters
    .replace(/([.!?])\s*([A-Z][a-z]+:)/g, "$1\n\n$2") // Sentences ending with "Word:"
    .replace(/([.!?])\s*([A-Z][A-Z\s]+)/g, "$1\n\n$2") // Sentences ending with ALL CAPS
    .replace(/(Required:)/g, "\n\n**$1**")
    .replace(/(Preferred:)/g, "\n\n**$1**")
    .replace(/(Qualifications)/g, "\n\n**$1**")
    .replace(/(Benefits)/g, "\n\n**$1**")
    .replace(/(How you&apos;ll grow)/g, "\n\n**$1**")
    .replace(/(Work you&apos;ll do)/g, "\n\n**$1**")
    .replace(/(The team)/g, "\n\n**$1**")
    .replace(/(About Deloitte)/g, "\n\n**$1**")
    .replace(/(Category:)/g, "\n\n**$1**")
    .replace(/(Recruiter tips)/g, "\n\n**$1**")
    .replace(/(Corporate citizenship)/g, "\n\n**$1**")
    .replace(/(Deloitte&apos;s culture)/g, "\n\n**$1**")
    .replace(/(Job Information)/g, "\n\n**$1**")
    .replace(/(Are you a)/g, "\n\n$1") // Questions
    .replace(/(If so,)/g, "\n\n$1") // Conditional statements
    .replace(/(Join our)/g, "\n\n$1") // Action statements
    .replace(/(If you are)/g, "\n\n$1") // Conditional statements
    .replace(/(What You&apos;ll Do:)/g, "\n\n**$1**")
    .replace(/(Requirements:)/g, "\n\n**$1**")
    .replace(/(What We Offer:)/g, "\n\n**$1**")

    // Add line breaks for bullet points
    .replace(/(\n\s*)([•·▪▫‣⁃])\s*/g, "\n• ")
    .replace(/(\n\s*)(\d+\.)\s*/g, "\n$2 ")

    // Add line breaks for sentences that are too long
    .replace(/([.!?])\s+([A-Z])/g, "$1\n\n$2")

    // Clean up multiple line breaks
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return formatted;
}

// Fetch real job data from database
async function getJob(id: string) {
  try {
    // Decode the URL-encoded job ID
    const decodedId = decodeURIComponent(id);

    console.log(`🔍 Looking for job with ID: ${decodedId}`);

    const job = await getJobById(decodedId);

    if (!job) {
      console.log(`❌ Job not found with ID: ${decodedId}`);
      return null;
    }

    // Clean the job object to remove MongoDB-specific fields
    const cleanJob = {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      applyUrl: job.applyUrl,
      postedDate: job.postedDate,
      logo: job.logo,
      tags: job.tags,
      experience: job.experience,
      skills: job.skills,
    };

    return cleanJob;
  } catch (error) {
    console.error("Error fetching job:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  return {
    title: `${job.title} at ${job.company} - React Developer Jobs`,
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

  if (!job) {
    // Instead of notFound(), let's show a helpful error page
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <nav className="mb-8">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Back to Jobs
              </Link>
            </nav>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Job Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The job you&apos;re looking for (ID: {decodeURIComponent(id)})
                doesn&apos;t exist in our database.
              </p>
              <div className="space-y-4">
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse All Jobs
                </Link>
                <div className="mt-4">
                  <Link
                    href="/debug/jobs"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View all available job IDs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Format the job description
  const formattedDescription = formatJobDescription(job.description);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Jobs
            </Link>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Details */}
            <div className="lg:col-span-2">
              {/* Job Header */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h1>
                    <p className="text-xl text-blue-600 font-semibold mb-4">
                      {job.company}
                    </p>
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
                  <div className="flex flex-col items-end gap-2">
                    {job.salary && (
                      <span className="text-2xl font-bold text-green-600">
                        {job.salary}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        job.type.toLowerCase().includes("full")
                          ? "bg-green-100 text-green-800"
                          : job.type.toLowerCase().includes("part")
                          ? "bg-blue-100 text-blue-800"
                          : job.type.toLowerCase().includes("contract")
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {job.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Job Description
                </h2>
                <div className="prose prose-lg max-w-none">
                  <div
                    className="text-gray-700 leading-relaxed"
                    style={{
                      lineHeight: "1.8",
                      fontSize: "16px",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: formattedDescription
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="text-gray-900 font-semibold text-lg">$1</strong>'
                        )
                        .replace(/\n\n/g, "</p><p>")
                        .replace(/^/, "<p>")
                        .replace(/$/, "</p>")
                        .replace(/<p><\/p>/g, "")
                        .replace(
                          /<p>(<strong.*?<\/strong>)<\/p>/g,
                          '<div class="mt-6 mb-4">$1</div>'
                        ),
                    }}
                  />
                </div>
              </div>

              {/* Skills & Requirements */}
              {job.skills && job.skills.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {job.experience && (
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Experience Required
                  </h3>
                  <p className="text-gray-700">{job.experience}</p>
                </div>
              )}
            </div>

            {/* Application Form */}
            <div className="lg:col-span-1">
              <ApplicationForm job={job} />
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
      <Footer />
    </>
  );
}

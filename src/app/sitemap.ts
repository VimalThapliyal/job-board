import { MetadataRoute } from "next";
import { getInterviewQuestionsFromDatabase } from "@/lib/database";
import { getJobsFromDatabase } from "@/lib/database";

const PRODUCTION_URL = "https://job-board-nine-lyart.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = PRODUCTION_URL;
  const currentDate = new Date();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "hourly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/interview-questions`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  // Dynamic pages - Interview Questions
  let interviewQuestionPages: MetadataRoute.Sitemap = [];
  try {
    const questions = await getInterviewQuestionsFromDatabase();
    interviewQuestionPages = questions.slice(0, 100).map((question) => ({
      url: `${baseUrl}/interview-questions/${question.id}`,
      lastModified: new Date(question.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching interview questions for sitemap:", error);
  }

  // Dynamic pages - Jobs
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const jobs = await getJobsFromDatabase();
    jobPages = jobs.slice(0, 200).map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
      lastModified: new Date(job.postedDate || currentDate),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error fetching jobs for sitemap:", error);
  }

  // Category pages for interview questions
  const categoryPages = [
    {
      url: `${baseUrl}/interview-questions?difficulty=beginner`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/interview-questions?difficulty=intermediate`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/interview-questions?difficulty=advanced`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];

  // Search pages for common terms
  const searchPages = [
    {
      url: `${baseUrl}/interview-questions?search=react+hooks`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/interview-questions?search=react+performance`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/interview-questions?search=react+state+management`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/interview-questions?search=react+testing`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
  ];

  return [
    ...staticPages,
    ...categoryPages,
    ...searchPages,
    ...interviewQuestionPages,
    ...jobPages,
  ];
}

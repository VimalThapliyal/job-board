import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Job } from "@/types/job";

export async function GET(request: NextRequest) {
  try {
    const dataPath = path.join(process.cwd(), "data", "jobs.json");

    // Check if jobs.json exists and has content
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      if (fileContent.trim()) {
        const jobs: Job[] = JSON.parse(fileContent);
        console.log(`Loaded ${jobs.length} jobs from data file`);

        // Add caching headers for better performance
        const response = NextResponse.json(jobs);
        response.headers.set(
          "Cache-Control",
          "public, s-maxage=300, stale-while-revalidate=600"
        ); // 5 min cache, 10 min stale
        response.headers.set("X-Job-Count", jobs.length.toString());
        response.headers.set("X-Last-Updated", new Date().toISOString());

        return response;
      }
    }

    // Fallback to sample data
    const sampleJobs: Job[] = [
      {
        id: "sample-1",
        title: "Senior React Developer",
        company: "TechCorp",
        location: "Remote",
        type: "Full-time",
        salary: "$100,000 - $150,000",
        description:
          "We are looking for a senior React developer to join our team...",
        applyUrl: "https://example.com/apply",
        postedDate: "2025-01-15",
        logo: "https://via.placeholder.com/50x50",
        tags: ["React", "TypeScript", "Node.js"],
        experience: "5+ years",
        skills: ["React", "TypeScript", "Node.js", "AWS"],
      },
      {
        id: "sample-2",
        title: "Frontend Developer (React)",
        company: "StartupXYZ",
        location: "San Francisco, CA",
        type: "Full-time",
        salary: "$80,000 - $120,000",
        description: "Join our fast-growing startup as a React developer...",
        applyUrl: "https://example.com/apply",
        postedDate: "2025-01-14",
        logo: "https://via.placeholder.com/50x50",
        tags: ["React", "JavaScript", "CSS"],
        experience: "2+ years",
        skills: ["React", "JavaScript", "CSS", "HTML"],
      },
    ];

    console.log("Using sample data (no jobs.json found)");

    const response = NextResponse.json(sampleJobs);
    response.headers.set("Cache-Control", "public, s-maxage=60"); // 1 min cache for sample data
    response.headers.set("X-Job-Count", sampleJobs.length.toString());
    response.headers.set("X-Data-Source", "sample");

    return response;
  } catch (error) {
    console.error("Error loading jobs:", error);

    const errorResponse = NextResponse.json(
      { error: "Failed to load jobs" },
      { status: 500 }
    );
    errorResponse.headers.set("Cache-Control", "no-cache");

    return errorResponse;
  }
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Job } from "@/types/job";
import {
  getJobsFromDatabase,
  saveJobsToDatabase,
  cleanupOldJobs,
  isDatabaseAvailable,
} from "@/lib/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Check if database is available
    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
      // Use database with pagination
      const jobs = await getJobsFromDatabase();

      // Clean up old jobs in background
      cleanupOldJobs().catch(console.error);

      // Apply pagination
      const totalJobs = jobs.length;
      const totalPages = Math.ceil(totalJobs / limit);
      const paginatedJobs = jobs.slice(skip, skip + limit);

      const response = NextResponse.json({
        jobs: paginatedJobs,
        pagination: {
          currentPage: page,
          totalPages,
          totalJobs,
          jobsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });

      response.headers.set(
        "Cache-Control",
        "public, s-maxage=300, stale-while-revalidate=600"
      );
      response.headers.set("X-Job-Count", totalJobs.toString());
      response.headers.set("X-Last-Updated", new Date().toISOString());
      response.headers.set("X-Data-Source", "database");

      return response;
    } else {
      // Fallback to file system with pagination
      const dataPath = path.join(process.cwd(), "data", "jobs.json");

      if (fs.existsSync(dataPath)) {
        const fileContent = fs.readFileSync(dataPath, "utf-8");
        if (fileContent.trim()) {
          const jobs: Job[] = JSON.parse(fileContent);
          console.log(`Loaded ${jobs.length} jobs from data file`);

          // Apply pagination
          const totalJobs = jobs.length;
          const totalPages = Math.ceil(totalJobs / limit);
          const paginatedJobs = jobs.slice(skip, skip + limit);

          const response = NextResponse.json({
            jobs: paginatedJobs,
            pagination: {
              currentPage: page,
              totalPages,
              totalJobs,
              jobsPerPage: limit,
              hasNextPage: page < totalPages,
              hasPrevPage: page > 1,
            },
          });

          response.headers.set(
            "Cache-Control",
            "public, s-maxage=300, stale-while-revalidate=600"
          );
          response.headers.set("X-Job-Count", totalJobs.toString());
          response.headers.set("X-Last-Updated", new Date().toISOString());
          response.headers.set("X-Data-Source", "file");

          return response;
        }
      }

      // Fallback to sample data with pagination
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

      console.log("Using sample data (no database or jobs.json found)");

      const totalJobs = sampleJobs.length;
      const totalPages = Math.ceil(totalJobs / limit);
      const paginatedJobs = sampleJobs.slice(skip, skip + limit);

      const response = NextResponse.json({
        jobs: paginatedJobs,
        pagination: {
          currentPage: page,
          totalPages,
          totalJobs,
          jobsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });

      response.headers.set("Cache-Control", "public, s-maxage=60");
      response.headers.set("X-Job-Count", totalJobs.toString());
      response.headers.set("X-Data-Source", "sample");

      return response;
    }
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobs } = body;

    if (!jobs || !Array.isArray(jobs)) {
      return NextResponse.json(
        { error: "Jobs array is required" },
        { status: 400 }
      );
    }

    // Check if database is available
    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
      // Save to database
      await saveJobsToDatabase(jobs);
      console.log(`✅ Saved ${jobs.length} jobs to database`);
    } else {
      // Save to file system
      const dataPath = path.join(process.cwd(), "data", "jobs.json");
      const dataDir = path.dirname(dataPath);

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      fs.writeFileSync(dataPath, JSON.stringify(jobs, null, 2));
      console.log(`✅ Saved ${jobs.length} jobs to file system`);
    }

    return NextResponse.json({
      success: true,
      message: `Saved ${jobs.length} jobs`,
      dataSource: dbAvailable ? "database" : "file",
    });
  } catch (error) {
    console.error("Error saving jobs:", error);
    return NextResponse.json({ error: "Failed to save jobs" }, { status: 500 });
  }
}

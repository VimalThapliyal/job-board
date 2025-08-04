import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Job } from "@/types/job";
import {
  getJobsFromDatabase,
  addJobsToDatabase,
  cleanupOldJobs,
  isDatabaseAvailable,
} from "@/lib/database";

export async function GET() {
  try {
    console.log("🔍 API: Starting job fetch...");

    // Check if database is available
    const dbAvailable = await isDatabaseAvailable();
    console.log(`🔍 API: Database available: ${dbAvailable}`);

    if (dbAvailable) {
      // Use database
      console.log("🔍 API: Using database as data source");
      const jobs = await getJobsFromDatabase();
      console.log(`🔍 API: Retrieved ${jobs.length} jobs from database`);

      // Clean up old jobs in background
      cleanupOldJobs().catch(console.error);

      const response = NextResponse.json(jobs);
      response.headers.set(
        "Cache-Control",
        "public, s-maxage=300, stale-while-revalidate=600"
      );
      response.headers.set("X-Job-Count", jobs.length.toString());
      response.headers.set("X-Last-Updated", new Date().toISOString());
      response.headers.set("X-Data-Source", "database");

      console.log(`🔍 API: Returning ${jobs.length} jobs from database`);
      return response;
    } else {
      console.log("🔍 API: Database not available, checking file system...");
      // Fallback to file system
      const dataPath = path.join(process.cwd(), "data", "jobs.json");

      if (fs.existsSync(dataPath)) {
        const fileContent = fs.readFileSync(dataPath, "utf-8");
        if (fileContent.trim()) {
          const jobs: Job[] = JSON.parse(fileContent);
          console.log(`🔍 API: Loaded ${jobs.length} jobs from data file`);

          const response = NextResponse.json(jobs);
          response.headers.set(
            "Cache-Control",
            "public, s-maxage=300, stale-while-revalidate=600"
          );
          response.headers.set("X-Job-Count", jobs.length.toString());
          response.headers.set("X-Last-Updated", new Date().toISOString());
          response.headers.set("X-Data-Source", "file");

          console.log(`🔍 API: Returning ${jobs.length} jobs from file`);
          return response;
        }
      }

      console.log("🔍 API: No file data found, using sample data");
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

      console.log("🔍 API: Using sample data (no database or jobs.json found)");

      const response = NextResponse.json(sampleJobs);
      response.headers.set("Cache-Control", "public, s-maxage=60");
      response.headers.set("X-Job-Count", sampleJobs.length.toString());
      response.headers.set("X-Data-Source", "sample");

      console.log(`🔍 API: Returning ${sampleJobs.length} sample jobs`);
      return response;
    }
  } catch (error) {
    console.error("❌ API: Error loading jobs:", error);

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
      await addJobsToDatabase(jobs);
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

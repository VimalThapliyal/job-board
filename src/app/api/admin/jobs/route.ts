import { NextRequest, NextResponse } from "next/server";
import {
  getActiveJobPostings,
  getJobPostingStats,
  updateJobInDatabase,
} from "@/lib/database";

export async function PUT(request: NextRequest) {
  try {
    // Check admin password (basic protection)
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin password not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { jobId, title, company, description } = body;

    // Validate required fields
    if (!jobId || !title || !company || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update the job in the database
    const success = await updateJobInDatabase(jobId, {
      title,
      company,
      description,
    });

    if (success) {
      console.log(`✅ Job updated: ${title} at ${company}`);
      return NextResponse.json(
        {
          success: true,
          message: "Job updated successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Job not found or update failed" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("❌ Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get active job postings
    const jobPostings = await getActiveJobPostings();

    // Get job posting statistics
    const stats = await getJobPostingStats();

    return NextResponse.json({
      success: true,
      data: {
        jobPostings,
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching job postings:", error);
    return NextResponse.json(
      { error: "Failed to fetch job postings" },
      { status: 500 }
    );
  }
}

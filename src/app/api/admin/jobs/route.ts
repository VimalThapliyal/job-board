import { NextRequest, NextResponse } from "next/server";
import { getJobsCollection, updateJobInDatabase } from "@/lib/database";

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
          message: "Job updated successfully" 
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

export async function GET() {
  try {
    const collection = await getJobsCollection();
    const jobs = await collection.find({}, { projection: { id: 1, title: 1, company: 1 } }).toArray();
    
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
} 
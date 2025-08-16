import { NextRequest, NextResponse } from "next/server";
import { addJobPosting, JobPosting } from "@/lib/database";
import { sendJobPostedNotification } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName,
      companyWebsite,
      companyLogo,
      jobTitle,
      location,
      jobType,
      experienceLevel,
      salaryRange,
      jobDescription,
      requiredSkills,
      benefits,
      applicationDeadline,
      contactEmail,
      contactPhone,
    } = body;

    // Validate required fields
    if (
      !companyName ||
      !jobTitle ||
      !location ||
      !jobDescription ||
      !contactEmail
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create job posting
    const job: JobPosting = {
      companyName,
      companyWebsite: companyWebsite || undefined,
      companyLogo: companyLogo || undefined,
      jobTitle,
      location,
      jobType,
      experienceLevel,
      salaryRange: salaryRange || undefined,
      jobDescription,
      requiredSkills: requiredSkills || [],
      benefits: benefits || undefined,
      applicationDeadline: applicationDeadline || undefined,
      contactEmail,
      contactPhone: contactPhone || undefined,
      status: "active" as const,
      views: 0,
      applications: 0,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      postedBy: contactEmail,
    };

    // Save job posting using the new database function
    const jobId = await addJobPosting(job);

    // Send notification email
    try {
      await sendJobPostedNotification({
        ...job,
        _id: jobId,
      });
    } catch (emailError) {
      console.error("Failed to send job posted notification:", emailError);
      // Don't fail the job posting if email fails
    }

    console.log(`Job posted successfully: ${jobTitle} at ${companyName}`);

    return NextResponse.json({
      success: true,
      jobId: jobId,
      message: "Job posted successfully",
      expiresAt: job.expiresAt,
    });
  } catch (error) {
    console.error("Job posting error:", error);
    return NextResponse.json({ error: "Job posting failed" }, { status: 500 });
  }
}

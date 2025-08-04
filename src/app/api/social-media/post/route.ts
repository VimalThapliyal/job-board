import { NextRequest, NextResponse } from "next/server";
import { postJobToSocialMedia } from "@/lib/social-media";
import { Job } from "@/types/job";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { job } = body;
    if (!job || !job.id) {
      return NextResponse.json(
        { error: "Job data is required" },
        { status: 400 }
      );
    }
    const requiredFields = ["id", "title", "company", "location", "applyUrl"];
    for (const field of requiredFields) {
      if (!job[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    const results = await postJobToSocialMedia(job as Job);
    const successCount = results.filter((r) => r.success).length;
    const totalCount = results.length;
    return NextResponse.json({
      success: true,
      message: `Posted to ${successCount}/${totalCount} platforms`,
      results,
      jobId: job.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Social media posting error:", error);
    return NextResponse.json(
      { error: "Failed to post to social media" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Social media posting endpoint",
    status: "active",
    platforms: ["linkedin"],
  });
}

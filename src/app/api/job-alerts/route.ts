import { NextRequest, NextResponse } from "next/server";
import { addJobAlert } from "@/lib/database";
import { sendJobAlertConfirmation } from "@/lib/email-service";

interface JobAlertData {
  email: string;
  jobType: string;
  location: string;
  experience: string;
  salary: string;
  frequency: string;
  skills: string[];
  subscribedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: JobAlertData = await request.json();
    const { email, jobType, location, experience, salary, frequency, skills } = body;

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!jobType || !location || !experience || !salary || !frequency) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Create job alert object
    const jobAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      jobType,
      location,
      experience,
      salary,
      frequency,
      skills: skills || [],
      isActive: true,
      subscribedAt: new Date(),
      updatedAt: new Date(),
      lastSentAt: null,
      totalSent: 0,
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    // Save to database
    try {
      await addJobAlert(jobAlert);
      console.log(`✅ Job alert saved for ${email}`);
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      // Continue even if database fails
    }

    // Send confirmation email
    try {
      await sendJobAlertConfirmation(jobAlert);
      console.log(`✅ Job alert confirmation email sent to ${email}`);
    } catch (emailError) {
      console.error(`❌ Failed to send confirmation email to ${email}:`, emailError);
      // Continue even if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Job alerts set up successfully",
        alertId: jobAlert.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Job alert error:", error);
    return NextResponse.json(
      { error: "Failed to set up job alerts. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Get job alerts for the email
    const alerts = await getJobAlertsByEmail(email);

    return NextResponse.json(
      {
        success: true,
        alerts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get job alerts error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve job alerts" },
      { status: 500 }
    );
  }
}

async function getJobAlertsByEmail(email: string) {
  // This would be implemented in the database service
  // For now, return empty array
  return [];
} 
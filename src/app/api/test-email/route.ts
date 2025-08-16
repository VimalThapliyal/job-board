import { NextRequest, NextResponse } from "next/server";
import { sendLeadConfirmation } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    // Create a test lead
    const testLead = {
      id: "test-lead-123",
      jobId: "test-job-123",
      jobTitle: "Senior React Developer",
      company: "Test Company",
      name: name,
      email: email,
      phone: "+1234567890",
      experience: "5 years of React development",
      coverLetter: "This is a test cover letter for the lead generation system.",
      resumeUrl: "https://example.com/resume.pdf",
      status: "new" as const,
      qualificationScore: 75,
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: "127.0.0.1",
      userAgent: "Test User Agent",
    };

    // Send test email
    const emailSent = await sendLeadConfirmation(testLead);

    if (emailSent) {
      return NextResponse.json(
        {
          success: true,
          message: "Test email sent successfully",
          email: email,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send test email",
          error: "Email service not configured or failed",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Error sending test email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send test email",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
} 
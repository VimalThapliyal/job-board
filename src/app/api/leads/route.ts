import { NextRequest, NextResponse } from "next/server";
import { saveLeadToDatabase } from "@/lib/database";
import { uploadFileFromFormData } from "@/lib/file-upload";
import { qualifyLead } from "@/lib/lead-qualification";
import { sendLeadConfirmation } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form data with proper typing for server environment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formDataAny = formData as any;
    const jobId = String(formDataAny.get("jobId") || "");
    const jobTitle = String(formDataAny.get("jobTitle") || "");
    const company = String(formDataAny.get("company") || "");
    const name = String(formDataAny.get("name") || "");
    const email = String(formDataAny.get("email") || "");
    const phone = String(formDataAny.get("phone") || "");
    const experience = String(formDataAny.get("experience") || "");
    const coverLetter = String(formDataAny.get("coverLetter") || "");

    // Validate required fields
    if (!jobId || !name || !email || !experience) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Handle file upload using Vercel Blob
    let resumeUrl = "";
    console.log("📁 Starting file upload process...");
    
    const uploadResult = await uploadFileFromFormData(formData);
    
    if (uploadResult.success && uploadResult.url) {
      resumeUrl = uploadResult.url;
      console.log(`✅ Resume uploaded successfully: ${resumeUrl}`);
    } else {
      console.error("❌ Resume upload failed:", uploadResult.error);
      // Continue without resume if there's an error
      resumeUrl = "error_uploading";
      
      // Log the specific error for debugging
      if (uploadResult.error) {
        console.error("📋 Upload error details:", {
          error: uploadResult.error,
          timestamp: new Date().toISOString(),
          user: name,
          email: email,
          jobTitle: jobTitle,
          company: company
        });
      }
    }

    // Create lead object
    const lead = {
      jobId,
      jobTitle,
      company,
      name,
      email,
      phone: phone || "",
      experience,
      coverLetter: coverLetter || "",
      resumeUrl,
      status: "new" as const,
      qualificationScore: 0, // Will be calculated below
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    // Qualify the lead
    const qualification = qualifyLead(lead);
    lead.qualificationScore = qualification.score;

    console.log(`🎯 Lead qualified: ${name} - Score: ${qualification.score}/100 - Level: ${qualification.level} - Price: $${qualification.price}`);

    // Save to database
    await saveLeadToDatabase(lead);

    // Send confirmation email to candidate
    try {
      await sendLeadConfirmation(lead);
      console.log(`✅ Confirmation email sent to ${name} (${email})`);
    } catch (emailError) {
      console.error(`❌ Failed to send confirmation email to ${email}:`, emailError);
      // Continue even if email fails
    }

    console.log(`✅ New lead saved: ${name} for ${jobTitle} at ${company}`);

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        leadId: lead.jobId,
        resumeUploaded: resumeUrl !== "error_uploading",
        qualification: {
          score: qualification.score,
          level: qualification.level,
          price: qualification.price,
          reasoning: qualification.reasoning,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error saving lead:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // This would be used for admin dashboard to view leads
    // For now, return empty array
    return NextResponse.json([]);
  } catch (error) {
    console.error("❌ Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

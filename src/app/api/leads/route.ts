import { NextRequest, NextResponse } from "next/server";
import { saveLeadToDatabase } from "@/lib/database";

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
    const resume = formDataAny.get("resume") as File | null;

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

    // Handle file upload
    let resumeUrl = "";
    if (resume) {
      try {
        // For Vercel deployment, we'll store file info in the database
        // and handle file storage separately or use a cloud storage service
        const timestamp = Date.now();
        const sanitizedName = resume.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `${timestamp}-${sanitizedName}`;

        // For now, we'll store the file info but not the actual file
        // In production, you'd want to use a service like AWS S3, Cloudinary, or similar
        resumeUrl = `resume_${fileName}`;
        console.log(`📁 Resume info saved: ${resumeUrl}`);

        // TODO: Implement proper file storage for production
        // For now, we'll just store the filename
      } catch (fileError) {
        console.error("❌ Error processing resume:", fileError);
        // Continue without resume if there's an error
        resumeUrl = "error_uploading";
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
      qualificationScore: 0, // Will be calculated later
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    // Save to database
    await saveLeadToDatabase(lead);

    console.log(`✅ New lead saved: ${name} for ${jobTitle} at ${company}`);

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        leadId: lead.jobId,
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

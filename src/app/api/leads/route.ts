import { NextRequest, NextResponse } from "next/server";
import { saveLeadToDatabase } from "@/lib/database";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form data
    const jobId = formData.get("jobId") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const company = formData.get("company") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const experience = formData.get("experience") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const resume = formData.get("resume") as File;

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
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedName = resume.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `${timestamp}-${sanitizedName}`;
        const filePath = path.join(uploadsDir, fileName);

        // Convert File to Buffer and save
        const bytes = await resume.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Store the public URL
        resumeUrl = `/uploads/${fileName}`;
        console.log(`📁 Resume saved: ${resumeUrl}`);
      } catch (fileError) {
        console.error("❌ Error saving resume:", fileError);
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

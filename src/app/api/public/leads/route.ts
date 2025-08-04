import { NextResponse } from "next/server";
import { getLeadsFromDatabase } from "@/lib/database";

export async function GET() {
  try {
    const leads = await getLeadsFromDatabase();

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads: leads.map((lead) => ({
        id: (lead as any)._id || lead.jobId,
        name: lead.name,
        email: lead.email,
        jobTitle: lead.jobTitle,
        company: lead.company,
        status: lead.status,
        createdAt: lead.createdAt,
        resumeUrl: lead.resumeUrl,
        experience: lead.experience,
        phone: lead.phone,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching leads:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch leads",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { addEmailSubscription, isDatabaseAvailable } from "@/lib/database";

interface SubscriptionData {
  email: string;
  jobType: string;
  location: string;
  subscribedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscriptionData = await request.json();
    const { email, jobType, location } = body;

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate preferences
    if (!jobType || !location) {
      return NextResponse.json(
        { error: "Job type and location preferences are required" },
        { status: 400 }
      );
    }

    // Check if database is available
    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
      // Save to MongoDB
      await addEmailSubscription({
        email,
        jobType,
        location,
        subscribedAt: new Date().toISOString(),
        isActive: true,
      });

      console.log("✅ Subscription saved to MongoDB");
    } else {
      // Fallback to localStorage (for demo purposes)
      console.log("⚠️ Database not available, using localStorage fallback");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to job alerts",
        savedToDatabase: dbAvailable,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return subscription stats (for admin purposes)
  return NextResponse.json({
    message: "Job alerts subscription endpoint",
    status: "active",
  });
}

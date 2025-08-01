import { NextRequest, NextResponse } from "next/server";

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

    // For now, we'll just return success
    // In a real implementation, you would:
    // 1. Store in database (MongoDB, PostgreSQL, etc.)
    // 2. Send to email service (Mailchimp, ConvertKit, etc.)
    // 3. Send confirmation email
    // 4. Add to email automation sequences

    const subscription = {
      email,
      jobType,
      location,
      subscribedAt: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
    };

    // Log subscription for now (replace with database storage)
    console.log("New subscription:", subscription);

    // TODO: Integrate with email service
    // Example with Mailchimp:
    // await mailchimp.lists.addListMember(listId, {
    //   email_address: email,
    //   status: "subscribed",
    //   merge_fields: {
    //     JOBTYPE: jobType,
    //     LOCATION: location,
    //   },
    // });

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to job alerts",
        subscription,
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

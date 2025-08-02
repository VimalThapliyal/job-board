import { NextResponse } from "next/server";
import { getEmailSubscriptions, getSubscriptionStats } from "@/lib/database";

export async function GET() {
  try {
    const subscriptions = await getEmailSubscriptions();
    const stats = await getSubscriptionStats();

    return NextResponse.json({
      subscriptions,
      stats,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch subscriptions",
        subscriptions: [],
        stats: {
          totalSubscriptions: 0,
          uniqueEmails: 0,
          jobTypeCounts: {},
          locationCounts: {},
        },
      },
      { status: 500 }
    );
  }
}

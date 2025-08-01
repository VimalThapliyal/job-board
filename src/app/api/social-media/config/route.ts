import { NextRequest, NextResponse } from "next/server";
import { getSocialConfig, updateSocialConfig } from "@/lib/social-media";

export async function GET() {
  try {
    const config = getSocialConfig();
    const safeConfig = {
      linkedin: {
        enabled: config.linkedin.enabled,
        configured: !!config.linkedin.accessToken,
      },
    };
    return NextResponse.json({ success: true, config: safeConfig });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve configuration" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { config } = body;
    if (!config) {
      return NextResponse.json(
        { error: "Configuration data is required" },
        { status: 400 }
      );
    }
    updateSocialConfig(config);
    return NextResponse.json({
      success: true,
      message: "Configuration updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update configuration" },
      { status: 500 }
    );
  }
}

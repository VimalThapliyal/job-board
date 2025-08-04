import { Job } from "@/types/job";
import { SocialMediaConfig, PostingResult } from "@/types/social-media";

const socialConfig: SocialMediaConfig = {
  mastodon: { enabled: false },
  discord: { enabled: false },
  linkedin: { enabled: true },
  facebook: { enabled: false },
  reddit: { enabled: false },
  telegram: { enabled: false },
};

export function generateSocialPost(
  job: Job,
  platform:
    | "mastodon"
    | "discord"
    | "linkedin"
    | "facebook"
    | "reddit"
    | "telegram"
): string {
  const baseMessage = `🚀 New React Job Alert!\n\n${job.title} at ${
    job.company
  }\n📍 ${job.location}\n💰 ${
    job.salary || "Competitive salary"
  }\n\nApply now: ${
    job.applyUrl
  }?utm_source=social&utm_medium=${platform}&utm_campaign=job-alerts\n\n#ReactJobs #JavaScript #RemoteWork #TechJobs`;

  switch (platform) {
    case "mastodon":
      return `${baseMessage}\n\n🐘 Join the developer community on Mastodon!`;
    case "discord":
      return `${baseMessage}\n\n🎮 Join our Discord community for more job opportunities!`;
    case "linkedin":
      return `${baseMessage}\n\n🔗 Connect with us for more React developer opportunities!`;
    case "facebook":
      return `${baseMessage}\n\n💡 Looking for React developers? Check out this opportunity!`;
    case "reddit":
      return `${baseMessage}\n\n📱 Found on r/reactjobs - Join the community!`;
    case "telegram":
      return `${baseMessage}\n\n📱 Join our Telegram channel for more opportunities!`;
    default:
      return baseMessage;
  }
}

// Mastodon API Integration (Completely Free)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function postToMastodon(job: Job): Promise<PostingResult> {
  return {
    platform: "mastodon",
    success: false,
    error: "Mastodon posting disabled",
    timestamp: new Date().toISOString(),
  };
}

// Discord Webhook Integration (Free)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function postToDiscord(job: Job): Promise<PostingResult> {
  return {
    platform: "discord",
    success: false,
    error: "Discord posting disabled",
    timestamp: new Date().toISOString(),
  };
}

// LinkedIn API Integration (Free with limitations)
export async function postToLinkedIn(job: Job): Promise<PostingResult> {
  if (
    !socialConfig.linkedin.enabled ||
    !socialConfig.linkedin.accessToken ||
    !socialConfig.linkedin.organizationId
  ) {
    return {
      platform: "linkedin",
      success: false,
      error: "LinkedIn posting disabled or not configured",
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const message = generateSocialPost(job, "linkedin");

    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${socialConfig.linkedin.accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: `urn:li:organization:${socialConfig.linkedin.organizationId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: message,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        platform: "linkedin",
        success: true,
        postId: data.id,
        timestamp: new Date().toISOString(),
      };
    } else {
      const error = await response.text();
      return {
        platform: "linkedin",
        success: false,
        error: `API Error: ${error}`,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    return {
      platform: "linkedin",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}

// Facebook Graph API Integration (Free with limitations)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function postToFacebook(job: Job): Promise<PostingResult> {
  return {
    platform: "facebook",
    success: false,
    error: "Facebook posting disabled",
    timestamp: new Date().toISOString(),
  };
}

// Reddit API Integration (Free)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function postToReddit(job: Job): Promise<PostingResult> {
  return {
    platform: "reddit",
    success: false,
    error: "Reddit posting disabled",
    timestamp: new Date().toISOString(),
  };
}

// Telegram Bot API Integration (Free)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function postToTelegram(job: Job): Promise<PostingResult> {
  return {
    platform: "telegram",
    success: false,
    error: "Telegram posting disabled",
    timestamp: new Date().toISOString(),
  };
}

export async function postJobToSocialMedia(job: Job): Promise<PostingResult[]> {
  const results: PostingResult[] = [];
  const promises = [postToLinkedIn(job).then((result) => results.push(result))];
  await Promise.allSettled(promises);
  return results;
}

export function isSocialMediaConfigured(): boolean {
  return socialConfig.linkedin.enabled;
}

export function updateSocialConfig(config: Partial<SocialMediaConfig>): void {
  Object.assign(socialConfig, config);
}

export function getSocialConfig(): SocialMediaConfig {
  return { ...socialConfig };
}

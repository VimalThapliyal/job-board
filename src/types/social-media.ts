export interface SocialMediaConfig {
  mastodon: {
    enabled: boolean;
    instanceUrl?: string;
    accessToken?: string;
  };
  discord: {
    enabled: boolean;
    webhookUrl?: string;
    channelId?: string;
  };
  linkedin: {
    enabled: boolean;
    accessToken?: string;
    organizationId?: string;
  };
  facebook: {
    enabled: boolean;
    pageAccessToken?: string;
    pageId?: string;
  };
  reddit: {
    enabled: boolean;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
    subreddit?: string;
  };
  telegram: {
    enabled: boolean;
    botToken?: string;
    channelId?: string;
  };
}

export interface SocialPost {
  id: string;
  platform:
    | "mastodon"
    | "discord"
    | "linkedin"
    | "facebook"
    | "reddit"
    | "telegram";
  content: string;
  jobId: string;
  postedAt: string;
  status: "success" | "failed" | "pending";
  error?: string;
  analytics?: {
    impressions?: number;
    clicks?: number;
    engagement?: number;
  };
}

export interface PostingResult {
  platform: string;
  success: boolean;
  postId?: string;
  error?: string;
  timestamp: string;
}

export interface SocialMediaStats {
  totalPosts: number;
  successfulPosts: number;
  failedPosts: number;
  platforms: {
    [key: string]: {
      posts: number;
      success: number;
      failed: number;
    };
  };
}

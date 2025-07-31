import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap:
      "https://job-board-nq9al8dq8-vimalthapliyals-projects.vercel.app/sitemap.xml",
  };
}

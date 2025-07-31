import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap:
      "https://job-board-ieb1mlfcs-vimalthapliyals-projects.vercel.app/sitemap.xml",
  };
}

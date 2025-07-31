import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://job-board-nq9al8dq8-vimalthapliyals-projects.vercel.app",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: "https://job-board-nq9al8dq8-vimalthapliyals-projects.vercel.app/jobs",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
  ];
}

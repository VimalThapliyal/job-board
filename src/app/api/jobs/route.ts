import { NextResponse } from "next/server";
import { Job } from "@/types/job";
import * as fs from "fs";
import * as path from "path";

// Sample job data as fallback
const sampleJobs: Job[] = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechCorp",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $150k",
    description:
      "We are looking for a senior React developer to join our team. You will be responsible for building scalable web applications and mentoring junior developers.",
    applyUrl: "https://example.com/apply/1",
    postedDate: "2024-01-15",
    logo: "https://via.placeholder.com/50",
  },
  {
    id: "2",
    title: "React Frontend Engineer",
    company: "StartupXYZ",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$100k - $130k",
    description:
      "Join our fast-growing startup as a React frontend engineer. You will work on cutting-edge web applications and help shape our product.",
    applyUrl: "https://example.com/apply/2",
    postedDate: "2024-01-14",
    logo: "https://via.placeholder.com/50",
  },
  {
    id: "3",
    title: "React Developer",
    company: "BigTech Inc",
    location: "Remote",
    type: "Contract",
    salary: "$80k - $100k",
    description:
      "Contract position for React developer with 3+ years experience. You will work on various client projects and help deliver high-quality solutions.",
    applyUrl: "https://example.com/apply/3",
    postedDate: "2024-01-13",
    logo: "https://via.placeholder.com/50",
  },
  {
    id: "4",
    title: "Full Stack React Developer",
    company: "Innovation Labs",
    location: "New York, NY",
    type: "Full-time",
    salary: "$110k - $140k",
    description:
      "We are seeking a full stack React developer to join our innovation team. You will work on both frontend and backend development.",
    applyUrl: "https://example.com/apply/4",
    postedDate: "2024-01-12",
    logo: "https://via.placeholder.com/50",
  },
  {
    id: "5",
    title: "React Native Developer",
    company: "MobileFirst",
    location: "Remote",
    type: "Full-time",
    salary: "$90k - $120k",
    description:
      "Join our mobile development team as a React Native developer. You will build cross-platform mobile applications.",
    applyUrl: "https://example.com/apply/5",
    postedDate: "2024-01-11",
    logo: "https://via.placeholder.com/50",
  },
  {
    id: "6",
    title: "Senior React Engineer",
    company: "Enterprise Solutions",
    location: "London, UK",
    type: "Full-time",
    salary: "£80k - £100k",
    description:
      "Senior React engineer needed for enterprise-level applications. You will lead development teams and architect solutions.",
    applyUrl: "https://example.com/apply/6",
    postedDate: "2024-01-10",
    logo: "https://via.placeholder.com/50",
  },
];

export async function GET() {
  try {
    // Try to load jobs from the data file first
    const dataPath = path.join(process.cwd(), "data", "jobs.json");

    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      const jobs = JSON.parse(fileContent);

      if (Array.isArray(jobs) && jobs.length > 0) {
        console.log(`Loaded ${jobs.length} jobs from data file`);
        return NextResponse.json(jobs);
      }
    }

    // Fallback to sample data if no data file exists or it's empty
    console.log("Using sample job data");
    return NextResponse.json(sampleJobs);
  } catch (error) {
    console.error("Error loading jobs:", error);
    return NextResponse.json({ error: "Failed to load jobs" }, { status: 500 });
  }
}

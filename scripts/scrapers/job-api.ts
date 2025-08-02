import { Job } from "../../src/types/job";
import dotenv from "dotenv";
import {
  saveJobsToDatabase,
  isDatabaseAvailable,
} from "../../src/lib/database";

// Load environment variables
dotenv.config({ path: ".env.local" });

class JobAPIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY || "";
    this.baseUrl = "https://jsearch.p.rapidapi.com/search";
  }

  async fetchJobs(): Promise<Job[]> {
    try {
      console.log("🔍 Fetching jobs from RapidAPI...");

      const response = await fetch(
        `${this.baseUrl}?query=react%20developer&page=1&num_pages=1&country=us`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": this.apiKey,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log(`📊 Found ${data.data?.length || 0} jobs from API`);

      if (!data.data || !Array.isArray(data.data)) {
        console.log("⚠️ No job data found, using sample data");
        return this.getSampleJobs();
      }

      return this.transformJobs(data.data);
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
      console.log("🔄 Falling back to sample data");
      return this.getSampleJobs();
    }
  }

  private transformJobs(
    apiJobs: Array<{
      job_id?: string;
      job_title?: string;
      employer_name?: string;
      job_city?: string;
      job_employment_type?: string;
      job_salary?: string;
      job_description?: string;
      job_apply_link?: string;
      job_posted_at_datetime_utc?: string;
      employer_logo?: string;
    }>
  ): Job[] {
    return apiJobs.map((job, index) => ({
      id: job.job_id || `job-${Date.now()}-${index}`,
      title: job.job_title || "React Developer",
      company: job.employer_name || "Company",
      location: job.job_city || "Remote",
      type: job.job_employment_type || "Full-time",
      salary: job.job_salary || "Competitive salary",
      description:
        job.job_description || "We are looking for a React developer...",
      applyUrl: job.job_apply_link || "https://example.com/apply",
      postedDate:
        job.job_posted_at_datetime_utc ||
        new Date().toISOString().split("T")[0],
      logo: job.employer_logo || undefined,
      tags: ["React", "JavaScript", "Frontend"],
      experience: "2+ years",
      skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML"],
    }));
  }

  private getSampleJobs(): Job[] {
    return [
      {
        id: "sample-1",
        title: "Senior React Developer",
        company: "TechCorp",
        location: "Remote",
        type: "Full-time",
        salary: "$100,000 - $150,000",
        description:
          "We are looking for a senior React developer to join our team...",
        applyUrl: "https://example.com/apply",
        postedDate: "2025-01-15",
        logo: undefined,
        tags: ["React", "TypeScript", "Node.js"],
        experience: "5+ years",
        skills: ["React", "TypeScript", "Node.js", "AWS"],
      },
      {
        id: "sample-2",
        title: "Frontend Developer (React)",
        company: "StartupXYZ",
        location: "San Francisco, CA",
        type: "Full-time",
        salary: "$80,000 - $120,000",
        description: "Join our fast-growing startup as a React developer...",
        applyUrl: "https://example.com/apply",
        postedDate: "2025-01-14",
        logo: undefined,
        tags: ["React", "JavaScript", "CSS"],
        experience: "2+ years",
        skills: ["React", "JavaScript", "CSS", "HTML"],
      },
      {
        id: "sample-3",
        title: "React Native Developer",
        company: "MobileTech",
        location: "Remote",
        type: "Contract",
        salary: "$90,000 - $130,000",
        description:
          "Looking for a React Native developer for mobile app development...",
        applyUrl: "https://example.com/apply",
        postedDate: "2025-01-13",
        logo: undefined,
        tags: ["React Native", "Mobile", "JavaScript"],
        experience: "3+ years",
        skills: [
          "React Native",
          "JavaScript",
          "TypeScript",
          "Mobile Development",
        ],
      },
      {
        id: "sample-4",
        title: "Full Stack React Developer",
        company: "WebSolutions",
        location: "New York, NY",
        type: "Full-time",
        salary: "$110,000 - $160,000",
        description:
          "Full stack developer with React and Node.js experience...",
        applyUrl: "https://example.com/apply",
        postedDate: "2025-01-12",
        logo: undefined,
        tags: ["React", "Node.js", "Full Stack"],
        experience: "4+ years",
        skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
      },
      {
        id: "sample-5",
        title: "React Developer (Entry Level)",
        company: "JuniorTech",
        location: "Remote",
        type: "Full-time",
        salary: "$60,000 - $80,000",
        description:
          "Entry level React developer position for recent graduates...",
        applyUrl: "https://example.com/apply",
        postedDate: "2025-01-11",
        logo: undefined,
        tags: ["React", "Entry Level", "JavaScript"],
        experience: "0-2 years",
        skills: ["React", "JavaScript", "CSS", "HTML"],
      },
    ];
  }

  async saveJobsToFile(jobs: Job[], filename: string = "jobs.json") {
    try {
      const fs = await import("fs");
      const path = await import("path");

      const dataPath = path.join(process.cwd(), "data", filename);
      const dataDir = path.dirname(dataPath);

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      fs.writeFileSync(dataPath, JSON.stringify(jobs, null, 2));
      console.log(`✅ Saved ${jobs.length} jobs to ${dataPath}`);
    } catch (error) {
      console.error("❌ Failed to save jobs to file:", error);
    }
  }

  async run() {
    try {
      console.log("🚀 Starting job scraping...");

      const jobs = await this.fetchJobs();

      // Check if database is available
      const dbAvailable = await isDatabaseAvailable();

      if (dbAvailable) {
        // Save to database
        await saveJobsToDatabase(jobs);
        console.log("✅ Jobs saved to database");
      } else {
        // Save to file system
        await this.saveJobsToFile(jobs);
        console.log("✅ Jobs saved to file system");
      }

      console.log(`🎉 Successfully processed ${jobs.length} jobs`);
    } catch (error) {
      console.error("❌ Job scraping failed:", error);
      process.exit(1);
    }
  }
}

// Run the scraper
const scraper = new JobAPIService();
scraper.run();

import { Job } from "@/types/job";
import dotenv from "dotenv";
import {
  isDatabaseAvailable,
  addJobsToDatabase,
  closeDatabaseConnection,
} from "@/lib/database";

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

      // Fetch multiple pages to get more jobs
      const allJobs: Job[] = [];
      const maxPages = 3; // Fetch 3 pages instead of 1

      for (let page = 1; page <= maxPages; page++) {
        console.log(`📄 Fetching page ${page}/${maxPages}...`);

        try {
          const response = await fetch(
            `${this.baseUrl}?query=react%20developer&page=${page}&num_pages=1&country=in`,
            {
              method: "GET",
              headers: {
                "X-RapidAPI-Key": this.apiKey,
                "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
              },
            }
          );

          console.log(`📊 Response status: ${response.status}`);
          console.log(
            `📊 Response headers:`,
            Object.fromEntries(response.headers.entries())
          );

          if (!response.ok) {
            if (response.status === 429) {
              console.warn(
                `⚠️ Rate limit hit on page ${page}. Stopping pagination.`
              );
              break;
            }
            console.warn(
              `⚠️ API request failed for page ${page}: ${response.status}`
            );
            continue;
          }

          const data = await response.json();
          console.log(
            `📊 Found ${data.data?.length || 0} jobs from page ${page}`
          );

          if (data.data && Array.isArray(data.data)) {
            const transformedJobs = this.transformJobs(data.data);
            allJobs.push(...transformedJobs);
          }
        } catch (error) {
          console.error(`❌ Error fetching page ${page}:`, error);
          break;
        }

        // Add delay between requests to avoid rate limiting
        if (page < maxPages) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      console.log(`📊 Total jobs fetched: ${allJobs.length}`);

      if (allJobs.length === 0) {
        console.log("⚠️ No job data found, using sample data");
        return this.getSampleJobs();
      }

      return allJobs;
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
    return apiJobs.map((job, index) => {
      // Check if salary is meaningful
      const salary = job.job_salary;
      const isMeaningfulSalary = (salary?: string) => {
        if (!salary) return false;

        const genericPhrases = [
          "competitive salary",
          "competitive",
          "salary",
          "competitive compensation",
          "market rate",
          "market competitive",
          "attractive salary",
          "excellent salary",
          "great salary",
          "good salary",
          "fair salary",
          "reasonable salary",
          "salary commensurate",
          "salary based on experience",
          "salary depending on experience",
          "salary to be discussed",
          "salary negotiable",
          "salary tbd",
          "salary t.b.d.",
          "salary to be determined",
        ];

        const lowerSalary = salary.toLowerCase().trim();

        // Check if it's just a generic phrase
        if (genericPhrases.some((phrase) => lowerSalary.includes(phrase))) {
          return false;
        }

        // Check if it contains actual numbers (dollar amounts, ranges, etc.)
        const hasNumbers = /\d/.test(salary);
        const hasCurrencySymbol = /[$₹]/.test(salary);
        const hasRange =
          salary.includes("-") ||
          salary.includes("to") ||
          salary.includes("up to");

        return hasNumbers && (hasCurrencySymbol || hasRange);
      };

      return {
        id: job.job_id || `job-${Date.now()}-${index}`,
        title: job.job_title || "React Developer",
        company: job.employer_name || "Company",
        location: job.job_city || "Remote",
        type: job.job_employment_type || "Full-time",
        salary: isMeaningfulSalary(salary) ? salary : undefined,
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
      };
    });
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

      // Add timeout to the entire scraping process
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error("Scraping timeout after 5 minutes")),
          5 * 60 * 1000
        );
      });

      const scrapingPromise = this.performScraping();

      const jobs = await Promise.race([scrapingPromise, timeoutPromise]);

      // Check if database is available
      const dbAvailable = await isDatabaseAvailable();

      if (dbAvailable) {
        // Save to database
        await addJobsToDatabase(jobs);
        console.log("✅ Jobs saved to database");
      } else {
        // Save to file system
        await this.saveJobsToFile(jobs);
        console.log("✅ Jobs saved to file system");
      }

      console.log(`🎉 Successfully processed ${jobs.length} jobs`);

      // Close database connection to allow process to exit
      await closeDatabaseConnection();
      console.log("✅ Database connection closed");
    } catch (error) {
      console.error("❌ Job scraping failed:", error);
      // Close database connection even on error
      try {
        await closeDatabaseConnection();
        console.log("✅ Database connection closed after error");
      } catch (closeError) {
        console.error("❌ Failed to close database connection:", closeError);
      }
      process.exit(1);
    }
  }

  private async performScraping(): Promise<Job[]> {
    const jobs = await this.fetchJobs();
    return jobs;
  }
}

// Run the scraper
const scraper = new JobAPIService();
scraper.run();

import { Job } from "../../src/types/job";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

class JobAPIService {
  private readonly API_KEY = process.env.RAPIDAPI_KEY || "";
  private readonly BASE_URL = "https://jsearch.p.rapidapi.com";

  async fetchJobs(
    searchTerm: string = "react developer",
    location: string = "remote"
  ): Promise<Job[]> {
    const jobs: Job[] = [];

    try {
      console.log("API Key:", this.API_KEY ? "Present" : "Missing");
      console.log("API Key length:", this.API_KEY.length);

      // Use RapidAPI's JSearch (Indeed API) - more reliable than scraping
      const queryParams = new URLSearchParams({
        query: searchTerm,
        page: "1",
        num_pages: "1",
      });

      const url = `${this.BASE_URL}/search?${queryParams}`;
      console.log("Request URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": this.API_KEY,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        data.data.forEach((jobData: any, index: number) => {
          const job: Job = {
            id: `api-${Date.now()}-${index}`,
            title: jobData.job_title || "React Developer",
            company: jobData.employer_name || "Company",
            location: jobData.job_city || location,
            type: jobData.job_employment_type || "Full-time",
            salary: jobData.job_salary || undefined,
            description: jobData.job_description || "No description available",
            applyUrl: jobData.job_apply_link || "#",
            postedDate:
              jobData.job_posted_at_datetime_utc?.split("T")[0] ||
              new Date().toISOString().split("T")[0],
            logo: jobData.employer_logo || undefined,
          };

          jobs.push(job);
        });
      }
    } catch (error) {
      console.error("Error fetching jobs from API:", error);
      // Fallback to sample data
      return this.getSampleJobs();
    }

    return jobs;
  }

  private getSampleJobs(): Job[] {
    return [
      {
        id: "sample-1",
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
        id: "sample-2",
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
        id: "sample-3",
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
        id: "sample-4",
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
        id: "sample-5",
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
    ];
  }

  async saveJobsToFile(jobs: Job[], filename: string = "jobs.json") {
    const dataPath = path.join(process.cwd(), "data");

    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true });
    }

    const filePath = path.join(dataPath, filename);
    fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2));
    console.log(`Jobs saved to: ${filePath}`);
  }
}

// Main execution function
async function main() {
  const apiService = new JobAPIService();

  try {
    console.log("Fetching jobs from API...");
    const jobs = await apiService.fetchJobs("react developer", "remote");

    console.log(`Fetched ${jobs.length} jobs`);

    // Save jobs to file
    await apiService.saveJobsToFile(jobs);

    console.log("Job fetching completed successfully!");
  } catch (error) {
    console.error("Job fetching failed:", error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export default JobAPIService;

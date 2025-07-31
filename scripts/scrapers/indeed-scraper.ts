import { chromium, Browser, Page } from "playwright";
import { Job } from "../../src/types/job";
import * as fs from "fs";
import * as path from "path";

class IndeedScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async init() {
    this.browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    this.page = await this.browser.newPage();

    // Set user agent to avoid detection
    await this.page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    });
  }

  async scrapeJobs(
    searchTerm: string = "react developer",
    location: string = "remote"
  ): Promise<Job[]> {
    if (!this.page) {
      throw new Error("Scraper not initialized");
    }

    const jobs: Job[] = [];

    try {
      // Navigate to Indeed search page
      const searchUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(
        searchTerm
      )}&l=${encodeURIComponent(location)}`;
      console.log(`Scraping jobs from: ${searchUrl}`);

      await this.page.goto(searchUrl, { waitUntil: "networkidle" });

      // Wait for job cards to load - try multiple selectors
      const selectors = [
        '[data-testid="jobsearch-ResultsList"]',
        ".job_seen_beacon",
        "[data-jk]",
        ".job_seen_beacon",
      ];

      let jobElements: any[] = [];
      for (const selector of selectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 5000 });
          jobElements = await this.page.$$(selector + " > div");
          if (jobElements.length > 0) break;
        } catch (error) {
          console.log(`Selector ${selector} not found, trying next...`);
        }
      }

      if (jobElements.length === 0) {
        // Fallback: try to find any job-related elements
        jobElements = await this.page.$$(
          '[data-jk], .job_seen_beacon, [class*="job"]'
        );
      }

      console.log(`Found ${jobElements.length} potential job elements`);

      for (let i = 0; i < Math.min(jobElements.length, 10); i++) {
        try {
          const jobElement = jobElements[i];

          // Try multiple selectors for each field
          const title = await this.extractText(jobElement, [
            "h2 a",
            "h2",
            '[data-testid="jobTitle"]',
            ".jobTitle",
          ]);

          const company = await this.extractText(jobElement, [
            '[data-testid="company-name"]',
            ".companyName",
            '[class*="company"]',
          ]);

          const location = await this.extractText(jobElement, [
            '[data-testid="location"]',
            ".location",
            '[class*="location"]',
          ]);

          const salary = await this.extractText(jobElement, [
            '[data-testid="salary"]',
            ".salary",
            '[class*="salary"]',
          ]).catch(() => "");

          const description = await this.extractText(jobElement, [
            '[data-testid="job-description"]',
            ".job-description",
            '[class*="description"]',
          ]).catch(() => "");

          const applyUrl = await this.extractHref(jobElement, [
            "h2 a",
            'a[href*="/viewjob"]',
            'a[href*="/job"]',
          ]).catch(() => "");

          if (title && company) {
            const job: Job = {
              id: `indeed-${Date.now()}-${i}`,
              title: title.trim(),
              company: company.trim(),
              location: location?.trim() || "Remote",
              type: "Full-time", // Default assumption
              salary: salary?.trim() || undefined,
              description: description?.trim() || "No description available",
              applyUrl: applyUrl.startsWith("http")
                ? applyUrl
                : `https://www.indeed.com${applyUrl}`,
              postedDate: new Date().toISOString().split("T")[0],
              logo: undefined,
            };

            jobs.push(job);
            console.log(`Scraped job: ${title} at ${company}`);
          }
        } catch (error) {
          console.error(`Error scraping job ${i}:`, error);
        }
      }
    } catch (error) {
      console.error("Error during scraping:", error);
    }

    return jobs;
  }

  private async extractText(
    element: any,
    selectors: string[]
  ): Promise<string> {
    for (const selector of selectors) {
      try {
        const text = await element.$eval(
          selector,
          (el: any) => el.textContent?.trim() || ""
        );
        if (text) return text;
      } catch (error) {
        // Continue to next selector
      }
    }
    return "";
  }

  private async extractHref(
    element: any,
    selectors: string[]
  ): Promise<string> {
    for (const selector of selectors) {
      try {
        const href = await element.$eval(
          selector,
          (el: any) => el.getAttribute("href") || ""
        );
        if (href) return href;
      } catch (error) {
        // Continue to next selector
      }
    }
    return "";
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
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
  const scraper = new IndeedScraper();

  try {
    console.log("Initializing scraper...");
    await scraper.init();

    console.log("Starting job scraping...");
    const jobs = await scraper.scrapeJobs("react developer", "remote");

    console.log(`Scraped ${jobs.length} jobs`);

    // Save jobs to file
    await scraper.saveJobsToFile(jobs);

    console.log("Scraping completed successfully!");
  } catch (error) {
    console.error("Scraping failed:", error);
  } finally {
    await scraper.close();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export default IndeedScraper;

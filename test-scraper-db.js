import dotenv from "dotenv";
import { isDatabaseAvailable, saveJobsToDatabase } from "./src/lib/database.ts";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function testScraperDatabase() {
  console.log("🔍 Testing scraper database connection...");
  console.log("📡 MONGODB_URI:", process.env.MONGODB_URI ? "Found" : "Missing");

  try {
    // Test database availability
    const available = await isDatabaseAvailable();
    console.log("✅ Database available:", available);

    if (available) {
      // Test saving sample jobs
      const sampleJobs = [
        {
          id: "test-scraper-1",
          title: "Test React Developer",
          company: "Test Company",
          location: "Remote",
          type: "Full-time",
          salary: "$80,000 - $120,000",
          description: "Test job from scraper",
          applyUrl: "https://example.com/apply",
          postedDate: new Date().toISOString().split("T")[0],
          logo: "https://via.placeholder.com/50x50",
          tags: ["React", "Test"],
          experience: "2+ years",
          skills: ["React", "JavaScript"],
        },
      ];

      await saveJobsToDatabase(sampleJobs);
      console.log("✅ Successfully saved jobs via scraper database functions!");
    }
  } catch (error) {
    console.error("❌ Scraper database test failed:", error.message);
  }
}

testScraperDatabase();

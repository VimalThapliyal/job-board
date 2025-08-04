const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

async function testScraperManually() {
  console.log("🧪 Manual Scraper Test\n");

  // Check environment variables
  console.log("📋 Environment Check:");
  console.log(
    `RAPIDAPI_KEY: ${process.env.RAPIDAPI_KEY ? "✅ Set" : "❌ Not set"}`
  );
  console.log(
    `MONGODB_URI: ${process.env.MONGODB_URI ? "✅ Set" : "❌ Not set"}\n`
  );

  if (!process.env.RAPIDAPI_KEY) {
    console.log("❌ RAPIDAPI_KEY not found - scraper won't work!");
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.log("❌ MONGODB_URI not found - can't save to database!");
    return;
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to database
    console.log("🔌 Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected to MongoDB!\n");

    const db = client.db(process.env.MONGODB_DB_NAME || "job-board");
    const collection = db.collection(process.env.MONGODB_COLLECTION || "jobs");

    // Check current job count
    const beforeCount = await collection.countDocuments();
    console.log(`📊 Jobs in database before test: ${beforeCount}`);

    // Test RapidAPI manually
    console.log("\n🚀 Testing RapidAPI manually...");

    try {
      const response = await fetch(
        "https://jsearch.p.rapidapi.com/search?query=react%20developer&page=1&num_pages=1&country=us",
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log(`📝 RapidAPI returned ${data.data?.length || 0} jobs`);

      if (data.data && Array.isArray(data.data)) {
        console.log("\n📋 Sample jobs from RapidAPI:");
        data.data.slice(0, 3).forEach((job, index) => {
          console.log(`${index + 1}. ${job.job_title} at ${job.employer_name}`);
        });

        // Transform jobs to our format
        const transformedJobs = data.data.map((job, index) => ({
          id: job.job_id || `job-${Date.now()}-${index}`,
          title: job.job_title || "React Developer",
          company: job.employer_name || "Company",
          location: job.job_city || "Remote",
          type: job.job_employment_type || "Full-time",
          salary: job.job_salary || "Competitive",
          description: job.job_description || "Job description",
          applyUrl: job.job_apply_link || "https://example.com/apply",
          postedDate: job.job_posted_at_datetime_utc
            ? new Date(job.job_posted_at_datetime_utc)
                .toISOString()
                .split("T")[0]
            : new Date().toISOString().split("T")[0],
          logo: job.employer_logo || "https://via.placeholder.com/50x50",
          tags: ["React", "JavaScript"],
          experience: "2+ years",
          skills: ["React", "JavaScript"],
        }));

        console.log(
          `\n💾 Saving ${transformedJobs.length} jobs to database...`
        );

        // Get existing job IDs to avoid duplicates
        const existingJobs = await collection
          .find({}, { projection: { id: 1 } })
          .toArray();
        const existingJobIds = new Set(existingJobs.map((job) => job.id));

        // Filter out jobs that already exist
        const newJobs = transformedJobs.filter(
          (job) => !existingJobIds.has(job.id)
        );

        if (newJobs.length > 0) {
          // Add timestamps to new jobs
          const jobsWithTimestamp = newJobs.map((job) => ({
            ...job,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));

          await collection.insertMany(jobsWithTimestamp);
          console.log(`✅ Added ${newJobs.length} new jobs to database`);
        } else {
          console.log("ℹ️ No new jobs to add (all jobs already exist)");
        }

        // Check final count
        const afterCount = await collection.countDocuments();
        console.log(`📊 Jobs in database after test: ${afterCount}`);
        console.log(`📈 Jobs added: ${afterCount - beforeCount}`);

        if (afterCount > beforeCount) {
          console.log("✅ Scraper test successful!");
        } else {
          console.log("⚠️ No new jobs were added");
        }
      } else {
        console.log("❌ No job data found in RapidAPI response");
        console.log("💡 Check RapidAPI key and network connection");
      }
    } catch (error) {
      console.error("❌ RapidAPI test failed:", error.message);
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  } finally {
    await client.close();
  }
}

testScraperManually();

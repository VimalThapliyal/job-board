const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

async function testProductionScraper() {
  console.log("🌐 Production Scraper Analysis\n");

  // Test production API
  console.log("📡 Testing Production API...");
  try {
    const response = await fetch(
      "https://job-board-p9nbqda71-vimalthapliyals-projects.vercel.app/api/jobs"
    );

    console.log(`API Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get("content-type")}`);
    console.log(`X-Job-Count: ${response.headers.get("X-Job-Count")}`);
    console.log(`X-Data-Source: ${response.headers.get("X-Data-Source")}`);

    if (response.ok) {
      const data = await response.json();
      console.log(
        `Jobs returned: ${Array.isArray(data) ? data.length : "Not an array"}`
      );

      if (Array.isArray(data)) {
        console.log("\n📝 Sample jobs from production:");
        data.slice(0, 3).forEach((job, index) => {
          console.log(`${index + 1}. ${job.title} at ${job.company}`);
        });
      }
    } else {
      console.log("❌ Production API is not working");
    }
  } catch (error) {
    console.log(`❌ Production API test failed: ${error.message}`);
  }

  // Test local database
  console.log("\n🔌 Testing Local Database...");
  if (!process.env.MONGODB_URI) {
    console.log("❌ MONGODB_URI not set locally");
    return;
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");

    const db = client.db(process.env.MONGODB_DB_NAME || "job-board");
    const collection = db.collection(process.env.MONGODB_COLLECTION || "jobs");

    const totalJobs = await collection.countDocuments();
    console.log(`📊 Total jobs in database: ${totalJobs}`);

    // Check recent activity
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentJobs = await collection.countDocuments({
      createdAt: { $gte: oneDayAgo },
    });

    console.log(`🕒 Jobs added in last 24 hours: ${recentJobs}`);

    if (recentJobs === 0) {
      console.log("⚠️ No recent job activity detected!");
      console.log("💡 This suggests:");
      console.log("   - GitHub Actions scraper not running");
      console.log("   - RapidAPI key issues in production");
      console.log("   - Scraper errors");
    } else {
      console.log("✅ Recent job activity detected!");
    }

    // Check job distribution
    const allJobs = await collection.find({}).toArray();
    const jobDates = allJobs.map((job) => job.createdAt.toDateString());
    const uniqueDates = [...new Set(jobDates)];

    console.log(`📅 Jobs added on dates: ${uniqueDates.join(", ")}`);
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
  } finally {
    await client.close();
  }

  // Recommendations
  console.log("\n💡 Recommendations:");
  console.log(
    "1. Check GitHub Actions: https://github.com/VimalThapliyal/job-board/actions"
  );
  console.log("2. Check Vercel environment variables");
  console.log("3. Check Vercel deployment logs");
  console.log("4. Manually trigger GitHub Actions scraper");
}

testProductionScraper();

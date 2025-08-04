const { MongoClient } = require("mongodb");
require("dotenv").config();

async function diagnoseProduction() {
  console.log("🔍 Diagnosing Production Issues...\n");

  // Check environment variables
  console.log("📋 Environment Variables:");
  console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? "✅ Set" : "❌ Not set"}`);
  console.log(`MONGODB_DB_NAME: ${process.env.MONGODB_DB_NAME || "job-board"}`);
  console.log(`MONGODB_COLLECTION: ${process.env.MONGODB_COLLECTION || "jobs"}`);
  console.log(`RAPIDAPI_KEY: ${process.env.RAPIDAPI_KEY ? "✅ Set" : "❌ Not set"}\n`);

  if (!process.env.MONGODB_URI) {
    console.log("❌ MONGODB_URI not found - this is likely the issue!");
    console.log("💡 Make sure your Vercel environment variables are set correctly.");
    return;
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log("🔌 Testing MongoDB Connection...");
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!\n");

    const db = client.db(process.env.MONGODB_DB_NAME || "job-board");
    const collection = db.collection(process.env.MONGODB_COLLECTION || "jobs");

    // Check database stats
    console.log("📊 Database Statistics:");
    const totalJobs = await collection.countDocuments();
    console.log(`Total jobs in database: ${totalJobs}`);

    if (totalJobs === 0) {
      console.log("⚠️  No jobs found in database!");
      console.log("💡 This could mean:");
      console.log("   - Scraper hasn't run yet");
      console.log("   - Database connection issues");
      console.log("   - Jobs are being stored in a different collection");
    } else {
      // Get recent jobs
      const recentJobs = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();

      console.log("\n📝 Recent Jobs:");
      recentJobs.forEach((job, index) => {
        console.log(`${index + 1}. ${job.title} at ${job.company} (${job.createdAt})`);
      });
    }

    // Check if scraper has run recently
    console.log("\n🕒 Checking Scraper Activity:");
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentJobCount = await collection.countDocuments({
      createdAt: { $gte: oneDayAgo }
    });

    console.log(`Jobs added in last 24 hours: ${recentJobCount}`);

    if (recentJobCount === 0) {
      console.log("⚠️  No recent job activity detected!");
      console.log("💡 Possible issues:");
      console.log("   - GitHub Actions scraper not running");
      console.log("   - RapidAPI key issues");
      console.log("   - Scraper errors");
    }

    // Test API endpoint
    console.log("\n🌐 Testing API Endpoint:");
    try {
      const response = await fetch("https://job-board-p9nbqda71-vimalthapliyals-projects.vercel.app/api/jobs");
      const data = await response.json();
      
      console.log(`API Response Status: ${response.status}`);
      console.log(`Jobs returned by API: ${Array.isArray(data) ? data.length : 'Not an array'}`);
      console.log(`X-Job-Count Header: ${response.headers.get('X-Job-Count')}`);
      console.log(`X-Data-Source Header: ${response.headers.get('X-Data-Source')}`);
      
      if (Array.isArray(data) && data.length <= 10) {
        console.log("⚠️  API is returning 10 or fewer jobs - this matches your issue!");
      }
    } catch (error) {
      console.log(`❌ API test failed: ${error.message}`);
    }

  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("\n💡 Possible solutions:");
    console.log("1. Check MongoDB Atlas network access settings");
    console.log("2. Verify MONGODB_URI in Vercel environment variables");
    console.log("3. Ensure MongoDB Atlas cluster is running");
  } finally {
    await client.close();
  }
}

diagnoseProduction(); 
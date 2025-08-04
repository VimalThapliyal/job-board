const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

async function checkMongoDBStatus() {
  console.log("🔍 Comprehensive MongoDB & Job Analysis\n");

  // Check environment variables
  console.log("📋 Environment Variables Check:");
  console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? "✅ Set" : "❌ Not set"}`);
  console.log(`MONGODB_DB_NAME: ${process.env.MONGODB_DB_NAME || "job-board"}`);
  console.log(`MONGODB_COLLECTION: ${process.env.MONGODB_COLLECTION || "jobs"}`);
  console.log(`RAPIDAPI_KEY: ${process.env.RAPIDAPI_KEY ? "✅ Set" : "❌ Not set"}\n`);

  if (!process.env.MONGODB_URI) {
    console.log("❌ MONGODB_URI not found - this is the main issue!");
    console.log("💡 Check your .env.local file");
    console.log("💡 Make sure the file exists and has the correct format");
    return;
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log("🔌 Testing MongoDB Connection...");
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!\n");

    const db = client.db(process.env.MONGODB_DB_NAME || "job-board");
    const collection = db.collection(process.env.MONGODB_COLLECTION || "jobs");

    // Check total jobs
    console.log("📊 Database Statistics:");
    const totalJobs = await collection.countDocuments();
    console.log(`Total jobs in database: ${totalJobs}`);

    if (totalJobs === 0) {
      console.log("⚠️  No jobs found in database!");
      console.log("💡 Possible reasons:");
      console.log("   - Scraper hasn't run yet");
      console.log("   - Database connection issues");
      console.log("   - Jobs are being stored in a different collection");
    } else {
      // Get all jobs with details
      const allJobs = await collection.find({}).toArray();
      console.log(`\n📝 All Jobs in Database (${allJobs.length}):`);
      
      allJobs.forEach((job, index) => {
        console.log(`${index + 1}. ${job.title} at ${job.company}`);
        console.log(`   ID: ${job.id}`);
        console.log(`   Created: ${job.createdAt}`);
        console.log(`   Location: ${job.location}`);
        console.log(`   Type: ${job.type}`);
        console.log("   ---");
      });

      // Check job sources
      console.log("\n🔍 Job Source Analysis:");
      const jobSources = {};
      allJobs.forEach(job => {
        const source = job.id ? job.id.split('-')[0] : 'unknown';
        jobSources[source] = (jobSources[source] || 0) + 1;
      });
      
      Object.entries(jobSources).forEach(([source, count]) => {
        console.log(`   ${source}: ${count} jobs`);
      });

      // Check recent activity
      console.log("\n🕒 Recent Activity Check:");
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const recentJobs = await collection.countDocuments({
        createdAt: { $gte: oneDayAgo }
      });

      console.log(`Jobs added in last 24 hours: ${recentJobs}`);

      if (recentJobs === 0) {
        console.log("⚠️  No recent job activity!");
        console.log("💡 This suggests:");
        console.log("   - GitHub Actions scraper not running");
        console.log("   - RapidAPI key issues");
        console.log("   - Scraper errors");
      }

      // Check for duplicate jobs
      console.log("\n🔍 Duplicate Check:");
      const jobIds = allJobs.map(job => job.id);
      const uniqueIds = new Set(jobIds);
      console.log(`Unique job IDs: ${uniqueIds.size}`);
      console.log(`Total jobs: ${jobIds.length}`);
      
      if (uniqueIds.size !== jobIds.length) {
        console.log("⚠️  Duplicate jobs detected!");
      } else {
        console.log("✅ No duplicate jobs found");
      }
    }

    // Test API endpoint
    console.log("\n🌐 API Endpoint Test:");
    try {
      const response = await fetch("https://job-board-p9nbqda71-vimalthapliyals-projects.vercel.app/api/jobs");
      const data = await response.json();
      
      console.log(`API Response Status: ${response.status}`);
      console.log(`Jobs returned by API: ${Array.isArray(data) ? data.length : 'Not an array'}`);
      console.log(`X-Job-Count Header: ${response.headers.get('X-Job-Count')}`);
      console.log(`X-Data-Source Header: ${response.headers.get('X-Data-Source')}`);
      
      if (Array.isArray(data)) {
        console.log("\n📝 API Response Jobs:");
        data.slice(0, 5).forEach((job, index) => {
          console.log(`${index + 1}. ${job.title} at ${job.company}`);
        });
        
        if (data.length > 5) {
          console.log(`   ... and ${data.length - 5} more jobs`);
        }
      }
    } catch (error) {
      console.log(`❌ API test failed: ${error.message}`);
    }

    // Recommendations
    console.log("\n💡 Recommendations:");
    if (totalJobs === 0) {
      console.log("1. Check if GitHub Actions scraper is running");
      console.log("2. Verify RapidAPI key in Vercel environment variables");
      console.log("3. Check scraper logs for errors");
    } else if (totalJobs <= 10) {
      console.log("1. Scraper might be fetching only 1 page (should fetch 3)");
      console.log("2. Check if incremental job addition is working");
      console.log("3. Verify scraper is running every 6 hours");
    } else {
      console.log("1. Database has sufficient jobs - check frontend display logic");
      console.log("2. Verify API is returning all jobs");
      console.log("3. Check if frontend is limiting display to 10 jobs");
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

checkMongoDBStatus(); 
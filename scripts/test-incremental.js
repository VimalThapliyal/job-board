const { MongoClient } = require("mongodb");
require("dotenv").config();

async function testIncrementalJobs() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI not found in environment variables");
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("job-board");
    const collection = db.collection("jobs");

    // Get current job count
    const currentCount = await collection.countDocuments();
    console.log(`📊 Current jobs in database: ${currentCount}`);

    // Add some test jobs
    const testJobs = [
      {
        id: `test-job-${Date.now()}-1`,
        title: "Test React Developer 1",
        company: "Test Company 1",
        location: "Remote",
        type: "Full-time",
        salary: "$80,000 - $120,000",
        description: "This is a test job for incremental testing.",
        applyUrl: "https://example.com/apply",
        postedDate: new Date().toISOString().split("T")[0],
        logo: "https://via.placeholder.com/50x50",
        tags: ["React", "Test"],
        experience: "2+ years",
        skills: ["React", "JavaScript"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: `test-job-${Date.now()}-2`,
        title: "Test React Developer 2",
        company: "Test Company 2",
        location: "San Francisco",
        type: "Contract",
        salary: "$90,000 - $130,000",
        description: "This is another test job for incremental testing.",
        applyUrl: "https://example.com/apply",
        postedDate: new Date().toISOString().split("T")[0],
        logo: "https://via.placeholder.com/50x50",
        tags: ["React", "TypeScript", "Test"],
        experience: "3+ years",
        skills: ["React", "TypeScript", "Node.js"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Check for existing jobs with same IDs
    const existingJobs = await collection
      .find({}, { projection: { id: 1 } })
      .toArray();
    const existingJobIds = new Set(existingJobs.map((job) => job.id));

    const newJobs = testJobs.filter((job) => !existingJobIds.has(job.id));

    if (newJobs.length > 0) {
      await collection.insertMany(newJobs);
      console.log(`✅ Added ${newJobs.length} new test jobs`);
    } else {
      console.log("ℹ️ No new test jobs to add (all already exist)");
    }

    // Get updated count
    const newCount = await collection.countDocuments();
    console.log(`📊 Updated jobs in database: ${newCount}`);
    console.log(`📈 Jobs added: ${newCount - currentCount}`);
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await client.close();
  }
}

testIncrementalJobs();

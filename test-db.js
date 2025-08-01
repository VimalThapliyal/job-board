import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testConnection() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI not found in environment variables");
    return;
  }

  console.log("🔍 Testing MongoDB Atlas connection...");
  console.log("📡 URI:", uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")); // Hide credentials

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");

    const db = client.db("job-board");
    const collection = db.collection("jobs");

    // Test basic operations
    const count = await collection.countDocuments();
    console.log(`📊 Current jobs in database: ${count}`);

    // Test inserting a sample job
    const sampleJob = {
      id: "test-job-" + Date.now(),
      title: "Test React Developer",
      company: "Test Company",
      location: "Remote",
      type: "Full-time",
      salary: "$80,000 - $120,000",
      description: "This is a test job for database verification.",
      applyUrl: "https://example.com/apply",
      postedDate: new Date().toISOString().split("T")[0],
      logo: "https://via.placeholder.com/50x50",
      tags: ["React", "Test"],
      experience: "2+ years",
      skills: ["React", "JavaScript"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.insertOne(sampleJob);
    console.log("✅ Successfully inserted test job!");

    // Clean up test job
    await collection.deleteOne({ id: sampleJob.id });
    console.log("✅ Successfully cleaned up test job!");

    console.log("🎉 Database connection test completed successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log(
      "💡 Make sure your MongoDB Atlas cluster is running and network access is configured."
    );
  } finally {
    await client.close();
  }
}

testConnection();

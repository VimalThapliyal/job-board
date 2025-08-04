const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

async function testGitHubActionsEnvironment() {
  console.log("🧪 Testing GitHub Actions Environment\n");

  // Test 1: Environment Variables
  console.log("📋 Environment Variables Check:");
  console.log(
    `RAPIDAPI_KEY: ${process.env.RAPIDAPI_KEY ? "✅ Set" : "❌ Missing"}`
  );
  console.log(
    `MONGODB_URI: ${process.env.MONGODB_URI ? "✅ Set" : "❌ Missing"}`
  );
  console.log(
    `MONGODB_DB_NAME: ${process.env.MONGODB_DB_NAME ? "✅ Set" : "❌ Missing"}`
  );
  console.log(
    `MONGODB_COLLECTION: ${
      process.env.MONGODB_COLLECTION ? "✅ Set" : "❌ Missing"
    }`
  );

  // Test 2: RapidAPI Connection
  console.log("\n🔌 Testing RapidAPI Connection...");
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

    console.log(`📊 RapidAPI Status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`📊 Jobs returned: ${data.data?.length || 0}`);
      console.log("✅ RapidAPI connection successful");
    } else {
      console.log("❌ RapidAPI connection failed");
    }
  } catch (error) {
    console.log(`❌ RapidAPI error: ${error.message}`);
  }

  // Test 3: MongoDB Connection
  console.log("\n🗄️ Testing MongoDB Connection...");
  if (!process.env.MONGODB_URI) {
    console.log("❌ MONGODB_URI not set");
    return;
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    console.log("✅ MongoDB connection successful");

    const db = client.db(process.env.MONGODB_DB_NAME || "job-board");
    const collection = db.collection(process.env.MONGODB_COLLECTION || "jobs");

    const count = await collection.countDocuments();
    console.log(`📊 Jobs in database: ${count}`);

    // Test inserting a simple document
    const testDoc = {
      id: `test-${Date.now()}`,
      title: "Test Job",
      company: "Test Company",
      location: "Test Location",
      type: "Full-time",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.insertOne(testDoc);
    console.log("✅ MongoDB write test successful");

    // Clean up test document
    await collection.deleteOne({ id: testDoc.id });
    console.log("✅ MongoDB cleanup successful");
  } catch (error) {
    console.log(`❌ MongoDB error: ${error.message}`);
  } finally {
    await client.close();
  }

  // Test 4: Git Configuration
  console.log("\n📝 Testing Git Configuration...");
  try {
    const { execSync } = require("child_process");
    const gitUser = execSync("git config user.name", {
      encoding: "utf8",
    }).trim();
    const gitEmail = execSync("git config user.email", {
      encoding: "utf8",
    }).trim();
    console.log(`Git User: ${gitUser}`);
    console.log(`Git Email: ${gitEmail}`);
    console.log("✅ Git configuration looks good");
  } catch (error) {
    console.log(`❌ Git configuration error: ${error.message}`);
  }

  console.log("\n🎯 Test completed!");
}

testGitHubActionsEnvironment().catch(console.error);

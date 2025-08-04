require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

async function checkJobIds() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const database = client.db(process.env.MONGODB_DB_NAME);
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const jobs = await collection
      .find({}, { projection: { id: 1, title: 1, company: 1 } })
      .toArray();

    console.log(`📊 Found ${jobs.length} jobs in database`);
    console.log("\n🔍 First 5 job IDs:");
    jobs.slice(0, 5).forEach((job, index) => {
      console.log(`${index + 1}. ID: ${job.id}`);
      console.log(`   Title: ${job.title}`);
      console.log(`   Company: ${job.company}`);
      console.log("");
    });

    await client.close();
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkJobIds();

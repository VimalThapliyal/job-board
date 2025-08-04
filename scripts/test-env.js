require("dotenv").config({ path: ".env.local" });

console.log("🔍 Testing Environment Variables\n");

console.log("📋 Environment Variables:");
console.log(
  `MONGODB_URI: ${process.env.MONGODB_URI ? "✅ Set" : "❌ Not set"}`
);
console.log(`MONGODB_DB_NAME: ${process.env.MONGODB_DB_NAME || "job-board"}`);
console.log(`MONGODB_COLLECTION: ${process.env.MONGODB_COLLECTION || "jobs"}`);
console.log(
  `RAPIDAPI_KEY: ${process.env.RAPIDAPI_KEY ? "✅ Set" : "❌ Not set"}`
);

if (process.env.MONGODB_URI) {
  console.log("\n✅ MONGODB_URI is set!");
  console.log(`URI Preview: ${process.env.MONGODB_URI.substring(0, 50)}...`);
} else {
  console.log("\n❌ MONGODB_URI is not set!");
  console.log("💡 Check if .env.local file exists and has correct format");
}

if (process.env.RAPIDAPI_KEY) {
  console.log("\n✅ RAPIDAPI_KEY is set!");
  console.log(`Key Preview: ${process.env.RAPIDAPI_KEY.substring(0, 10)}...`);
} else {
  console.log("\n❌ RAPIDAPI_KEY is not set!");
  console.log("💡 Add your RapidAPI key to .env.local");
}

import { MongoClient, Db, Collection } from "mongodb";
import { Job } from "@/types/job";

interface DatabaseConfig {
  uri: string;
  dbName: string;
  collectionName: string;
}

interface EmailSubscription {
  email: string;
  jobType: string;
  location: string;
  subscribedAt: string;
  isActive: boolean;
  id?: string;
}

// Get database configuration dynamically
function getDatabaseConfig(): DatabaseConfig {
  return {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017",
    dbName: process.env.MONGODB_DB_NAME || "job-board",
    collectionName: process.env.MONGODB_COLLECTION || "jobs",
  };
}

let client: MongoClient | null = null;
let db: Db | null = null;

// Connect to MongoDB
export async function connectToDatabase(): Promise<Db> {
  if (db) return db;

  const dbConfig = getDatabaseConfig();

  try {
    client = new MongoClient(dbConfig.uri);
    await client.connect();
    db = client.db(dbConfig.dbName);
    console.log("✅ Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

// Get jobs collection
export async function getJobsCollection(): Promise<Collection<Job>> {
  const database = await connectToDatabase();
  const dbConfig = getDatabaseConfig();
  return database.collection<Job>(dbConfig.collectionName);
}

// Save jobs to database
export async function saveJobsToDatabase(jobs: Job[]): Promise<void> {
  try {
    const collection = await getJobsCollection();

    // Add timestamp to each job
    const jobsWithTimestamp = jobs.map((job) => ({
      ...job,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Clear existing jobs and insert new ones
    await collection.deleteMany({});
    if (jobsWithTimestamp.length > 0) {
      await collection.insertMany(jobsWithTimestamp);
    }

    console.log(`✅ Saved ${jobsWithTimestamp.length} jobs to database`);
  } catch (error) {
    console.error("❌ Failed to save jobs to database:", error);
    throw error;
  }
}

// Get jobs from database
export async function getJobsFromDatabase(): Promise<Job[]> {
  try {
    const collection = await getJobsCollection();
    const jobs = await collection.find({}).toArray();
    console.log(`✅ Retrieved ${jobs.length} jobs from database`);
    return jobs;
  } catch (error) {
    console.error("❌ Failed to get jobs from database:", error);
    return [];
  }
}

// Clean up old jobs (older than 1 month)
export async function cleanupOldJobs(): Promise<void> {
  try {
    const collection = await getJobsCollection();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const result = await collection.deleteMany({
      createdAt: { $lt: oneMonthAgo },
    });

    console.log(`✅ Cleaned up ${result.deletedCount} old jobs`);
  } catch (error) {
    console.error("❌ Failed to cleanup old jobs:", error);
  }
}

// Add a single job to database
export async function addJobToDatabase(job: Job): Promise<void> {
  try {
    const collection = await getJobsCollection();
    const jobWithTimestamp = {
      ...job,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.insertOne(jobWithTimestamp);
    console.log(`✅ Added job ${job.id} to database`);
  } catch (error) {
    console.error("❌ Failed to add job to database:", error);
    throw error;
  }
}

// Update a job in database
export async function updateJobInDatabase(
  jobId: string,
  updates: Partial<Job>
): Promise<void> {
  try {
    const collection = await getJobsCollection();
    await collection.updateOne(
      { id: jobId },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );
    console.log(`✅ Updated job ${jobId} in database`);
  } catch (error) {
    console.error("❌ Failed to update job in database:", error);
    throw error;
  }
}

// Delete a job from database
export async function deleteJobFromDatabase(jobId: string): Promise<void> {
  try {
    const collection = await getJobsCollection();
    await collection.deleteOne({ id: jobId });
    console.log(`✅ Deleted job ${jobId} from database`);
  } catch (error) {
    console.error("❌ Failed to delete job from database:", error);
    throw error;
  }
}

// Get database statistics
export async function getDatabaseStats(): Promise<{
  totalJobs: number;
  recentJobs: number;
  oldJobs: number;
}> {
  try {
    const collection = await getJobsCollection();
    const totalJobs = await collection.countDocuments();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const recentJobs = await collection.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    const oldJobs = await collection.countDocuments({
      createdAt: { $lt: oneMonthAgo },
    });

    return { totalJobs, recentJobs, oldJobs };
  } catch (error) {
    console.error("❌ Failed to get database stats:", error);
    return { totalJobs: 0, recentJobs: 0, oldJobs: 0 };
  }
}

// Close database connection
export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("✅ Closed MongoDB connection");
  }
}

// Check if database is available
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await connectToDatabase();
    return true;
  } catch (error) {
    console.log("❌ Database not available, will use file system");
    return false;
  }
}

// Email Subscription Functions
export async function getSubscriptionsCollection(): Promise<
  Collection<EmailSubscription>
> {
  const db = await connectToDatabase();
  return db.collection<EmailSubscription>("subscriptions");
}

export async function addEmailSubscription(
  subscription: Omit<EmailSubscription, "id">
): Promise<void> {
  try {
    const collection = await getSubscriptionsCollection();
    const subscriptionWithId = {
      ...subscription,
      id: Math.random().toString(36).substr(2, 9),
      isActive: true,
    };

    await collection.insertOne(subscriptionWithId);
    console.log(`✅ Added email subscription for ${subscription.email}`);
  } catch (error) {
    console.error("❌ Failed to add email subscription:", error);
    throw error;
  }
}

export async function getEmailSubscriptions(): Promise<EmailSubscription[]> {
  try {
    const collection = await getSubscriptionsCollection();
    const subscriptions = await collection.find({ isActive: true }).toArray();
    console.log(`✅ Retrieved ${subscriptions.length} email subscriptions`);
    return subscriptions;
  } catch (error) {
    console.error("❌ Failed to get email subscriptions:", error);
    return [];
  }
}

export async function getSubscriptionStats(): Promise<{
  totalSubscriptions: number;
  uniqueEmails: number;
  jobTypeCounts: Record<string, number>;
  locationCounts: Record<string, number>;
}> {
  try {
    const subscriptions = await getEmailSubscriptions();
    const uniqueEmails = new Set(subscriptions.map((s) => s.email)).size;

    const jobTypeCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};

    subscriptions.forEach((sub) => {
      jobTypeCounts[sub.jobType] = (jobTypeCounts[sub.jobType] || 0) + 1;
      locationCounts[sub.location] = (locationCounts[sub.location] || 0) + 1;
    });

    return {
      totalSubscriptions: subscriptions.length,
      uniqueEmails,
      jobTypeCounts,
      locationCounts,
    };
  } catch (error) {
    console.error("❌ Failed to get subscription stats:", error);
    return {
      totalSubscriptions: 0,
      uniqueEmails: 0,
      jobTypeCounts: {},
      locationCounts: {},
    };
  }
}

export async function updateSubscriptionStatus(
  email: string,
  isActive: boolean
): Promise<void> {
  try {
    const collection = await getSubscriptionsCollection();
    await collection.updateMany({ email }, { $set: { isActive } });
    console.log(`✅ Updated subscription status for ${email}`);
  } catch (error) {
    console.error("❌ Failed to update subscription status:", error);
    throw error;
  }
}

export async function deleteEmailSubscription(email: string): Promise<void> {
  try {
    const collection = await getSubscriptionsCollection();
    await collection.deleteMany({ email });
    console.log(`✅ Deleted email subscription for ${email}`);
  } catch (error) {
    console.error("❌ Failed to delete email subscription:", error);
    throw error;
  }
}

import { MongoClient, Db, Collection } from "mongodb";
import { Job } from "@/types/job";
import {
  InterviewQuestion,
  QuestionCategory,
} from "@/types/interview-question";

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

interface JobAlert {
  id: string;
  email: string;
  jobType: string;
  location: string;
  experience: string;
  salary: string;
  frequency: string;
  skills: string[];
  isActive: boolean;
  subscribedAt: Date;
  updatedAt: Date;
  lastSentAt: Date | null;
  totalSent: number;
  ipAddress: string;
  userAgent: string;
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

// Get interview questions collection
export async function getInterviewQuestionsCollection(): Promise<
  Collection<InterviewQuestion>
> {
  const database = await connectToDatabase();
  return database.collection<InterviewQuestion>("interview-questions");
}

// Get question categories collection
export async function getQuestionCategoriesCollection(): Promise<
  Collection<QuestionCategory>
> {
  const database = await connectToDatabase();
  return database.collection<QuestionCategory>("question-categories");
}

// Save jobs to database (incremental - adds new jobs without deleting existing ones)
export async function saveJobsToDatabase(jobs: Job[]): Promise<void> {
  try {
    const collection = await getJobsCollection();

    // Add timestamp to each job
    const jobsWithTimestamp = jobs.map((job) => ({
      ...job,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Get existing job IDs to avoid duplicates
    const existingJobs = await collection
      .find({}, { projection: { id: 1 } })
      .toArray();
    const existingJobIds = new Set(existingJobs.map((job) => job.id));

    // Filter out jobs that already exist
    const newJobs = jobsWithTimestamp.filter(
      (job) => !existingJobIds.has(job.id)
    );

    if (newJobs.length > 0) {
      await collection.insertMany(newJobs);
      console.log(`✅ Added ${newJobs.length} new jobs to database`);
    } else {
      console.log("ℹ️ No new jobs to add (all jobs already exist)");
    }

    console.log(
      `📊 Total jobs in database: ${await collection.countDocuments()}`
    );
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

// Interview Questions CRUD Operations

// Save interview questions to database
export async function saveInterviewQuestions(
  questions: InterviewQuestion[]
): Promise<{ saved: number; duplicates: number; total: number }> {
  try {
    const collection = await getInterviewQuestionsCollection();

    // Get existing questions for duplicate checking
    const existingQuestions = await collection.find({}).toArray();
    console.log(
      `🔍 Checking for duplicates among ${existingQuestions.length} existing questions...`
    );

    // Import duplicate checker
    const { checkForDuplicatesBeforeSaving } = await import(
      "./duplicate-checker"
    );

    // Check for duplicates - convert to ScrapingResult for compatibility
    const questionsAsScrapingResult = questions.map((q) => ({
      question: q.question,
      answer: q.answer,
      explanation: q.explanation,
      codeExample: q.codeExample,
      difficulty: q.difficulty,
      category: q.category,
      tags: q.tags || [],
      source: q.source,
      sourceUrl: q.sourceUrl || "",
    }));

    const { duplicates, uniqueQuestions } =
      await checkForDuplicatesBeforeSaving(
        questionsAsScrapingResult,
        existingQuestions
      );

    if (duplicates.length > 0) {
      console.log(`⚠️ Found ${duplicates.length} potential duplicates:`);
      duplicates.forEach(({ question, result }) => {
        console.log(
          `   - "${question.question}" (${(result.confidence * 100).toFixed(
            1
          )}% confidence)`
        );
        if (result.existingQuestion) {
          console.log(`     Similar to: "${result.existingQuestion.question}"`);
        }
      });
    }

    if (uniqueQuestions.length === 0) {
      console.log("ℹ️ No new questions to add (all questions are duplicates)");
      return {
        saved: 0,
        duplicates: duplicates.length,
        total: questions.length,
      };
    }

    // Convert back to InterviewQuestion format and add timestamps
    const questionsWithTimestamp: InterviewQuestion[] = uniqueQuestions.map(
      (question) => ({
        id: generateQuestionId(question.question),
        question: question.question,
        answer: question.answer,
        explanation: question.explanation || question.answer,
        codeExample: question.codeExample || "",
        difficulty: question.difficulty as
          | "beginner"
          | "intermediate"
          | "advanced",
        category: question.category,
        tags: question.tags || [],
        source: question.source,
        sourceUrl: question.sourceUrl || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        viewCount: 0,
        helpfulCount: 0,
        notHelpfulCount: 0,
      })
    );

    // Insert unique questions
    await collection.insertMany(questionsWithTimestamp);
    console.log(
      `✅ Added ${questionsWithTimestamp.length} new interview questions to database`
    );
    console.log(
      `📊 Total interview questions in database: ${await collection.countDocuments()}`
    );

    return {
      saved: questionsWithTimestamp.length,
      duplicates: duplicates.length,
      total: questions.length,
    };
  } catch (error) {
    console.error("❌ Failed to save interview questions to database:", error);
    throw error;
  }
}

// Helper function to generate question ID
function generateQuestionId(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 50);
}

// Get all interview questions
export async function getInterviewQuestionsFromDatabase(): Promise<
  InterviewQuestion[]
> {
  try {
    const collection = await getInterviewQuestionsCollection();
    const questions = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    console.log(
      `✅ Retrieved ${questions.length} interview questions from database`
    );
    return questions;
  } catch (error) {
    console.error("❌ Failed to get interview questions from database:", error);
    return [];
  }
}

// Get a single job by ID (optimized for performance)
export async function getJobById(jobId: string): Promise<Job | null> {
  try {
    const collection = await getJobsCollection();
    const job = await collection.findOne({ id: jobId });

    if (job) {
      console.log(`✅ Retrieved job: ${job.title} at ${job.company}`);
    } else {
      console.log(`❌ Job not found with ID: ${jobId}`);
    }

    return job;
  } catch (error) {
    console.error("❌ Failed to get job by ID:", error);
    return null;
  }
}

// Get questions by difficulty
export async function getQuestionsByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced"
): Promise<InterviewQuestion[]> {
  try {
    const collection = await getInterviewQuestionsCollection();
    const questions = await collection
      .find({ difficulty })
      .sort({ createdAt: -1 })
      .toArray();
    console.log(
      `✅ Retrieved ${questions.length} ${difficulty} questions from database`
    );
    return questions;
  } catch (error) {
    console.error("❌ Failed to get questions by difficulty:", error);
    return [];
  }
}

// Get questions by category
export async function getQuestionsByCategory(
  category: string
): Promise<InterviewQuestion[]> {
  try {
    const collection = await getInterviewQuestionsCollection();
    const questions = await collection
      .find({ category: { $in: [category] } })
      .sort({ createdAt: -1 })
      .toArray();
    console.log(
      `✅ Retrieved ${questions.length} questions from category: ${category}`
    );
    return questions;
  } catch (error) {
    console.error("❌ Failed to get questions by category:", error);
    return [];
  }
}

// Get single question by ID
export async function getQuestionById(
  id: string
): Promise<InterviewQuestion | null> {
  try {
    const collection = await getInterviewQuestionsCollection();
    const question = await collection.findOne({ id });

    if (question) {
      // Increment view count
      await collection.updateOne({ id }, { $inc: { viewCount: 1 } });
      console.log(
        `✅ Retrieved question: ${question.question.substring(0, 50)}...`
      );
    } else {
      console.log(`❌ Question not found with ID: ${id}`);
    }

    return question;
  } catch (error) {
    console.error("❌ Failed to get question by ID:", error);
    return null;
  }
}

// Search questions
export async function searchQuestions(
  query: string
): Promise<InterviewQuestion[]> {
  try {
    const collection = await getInterviewQuestionsCollection();
    const questions = await collection
      .find({
        $or: [
          { question: { $regex: query, $options: "i" } },
          { answer: { $regex: query, $options: "i" } },
          { explanation: { $regex: query, $options: "i" } },
          { tags: { $in: [new RegExp(query, "i")] } },
        ],
      })
      .sort({ viewCount: -1 })
      .toArray();
    console.log(`✅ Found ${questions.length} questions matching: "${query}"`);
    return questions;
  } catch (error) {
    console.error("❌ Failed to search questions:", error);
    return [];
  }
}

// Update question helpful/not helpful counts
export async function updateQuestionFeedback(
  questionId: string,
  isHelpful: boolean
): Promise<void> {
  try {
    const collection = await getInterviewQuestionsCollection();
    const updateField = isHelpful ? "helpfulCount" : "notHelpfulCount";

    await collection.updateOne(
      { id: questionId },
      { $inc: { [updateField]: 1 } }
    );

    console.log(`✅ Updated feedback for question: ${questionId}`);
  } catch (error) {
    console.error("❌ Failed to update question feedback:", error);
  }
}

// Update interview question
export async function updateInterviewQuestion(
  questionId: string,
  updates: Partial<InterviewQuestion>
): Promise<boolean> {
  try {
    const collection = await getInterviewQuestionsCollection();

    // Add updatedAt timestamp
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    const result = await collection.updateOne(
      { id: questionId },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Updated question ${questionId} in database`);
      return true;
    } else {
      console.log(`ℹ️ Question ${questionId} not found or no changes made`);
      return false;
    }
  } catch (error) {
    console.error("❌ Failed to update question in database:", error);
    return false;
  }
}

// Get question statistics
export async function getQuestionStats(): Promise<{
  totalQuestions: number;
  beginnerCount: number;
  intermediateCount: number;
  advancedCount: number;
  categoryStats: Record<string, number>;
}> {
  try {
    const collection = await getInterviewQuestionsCollection();

    const totalQuestions = await collection.countDocuments();
    const beginnerCount = await collection.countDocuments({
      difficulty: "beginner",
    });
    const intermediateCount = await collection.countDocuments({
      difficulty: "intermediate",
    });
    const advancedCount = await collection.countDocuments({
      difficulty: "advanced",
    });

    // Get category statistics
    const categoryStats = await collection
      .aggregate([
        { $unwind: "$category" },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    const categoryStatsMap = categoryStats.reduce((acc, cat) => {
      acc[cat._id] = cat.count;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalQuestions,
      beginnerCount,
      intermediateCount,
      advancedCount,
      categoryStats: categoryStatsMap,
    };
  } catch (error) {
    console.error("❌ Failed to get question statistics:", error);
    return {
      totalQuestions: 0,
      beginnerCount: 0,
      intermediateCount: 0,
      advancedCount: 0,
      categoryStats: {},
    };
  }
}

// Save question categories
export async function saveQuestionCategories(
  categories: QuestionCategory[]
): Promise<void> {
  try {
    const collection = await getQuestionCategoriesCollection();

    // Clear existing categories and insert new ones
    await collection.deleteMany({});
    await collection.insertMany(categories);

    console.log(`✅ Saved ${categories.length} question categories`);
  } catch (error) {
    console.error("❌ Failed to save question categories:", error);
    throw error;
  }
}

// Get question categories
export async function getQuestionCategories(): Promise<QuestionCategory[]> {
  try {
    const collection = await getQuestionCategoriesCollection();
    const categories = await collection.find({}).sort({ name: 1 }).toArray();
    console.log(`✅ Retrieved ${categories.length} question categories`);
    return categories;
  } catch (error) {
    console.error("❌ Failed to get question categories:", error);
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

// Add multiple jobs to database (incremental)
export async function addJobsToDatabase(jobs: Job[]): Promise<void> {
  try {
    const collection = await getJobsCollection();

    // Get existing job IDs to avoid duplicates
    const existingJobs = await collection
      .find({}, { projection: { id: 1 } })
      .toArray();
    const existingJobIds = new Set(existingJobs.map((job) => job.id));

    // Filter out jobs that already exist and add timestamps
    const newJobs = jobs
      .filter((job) => !existingJobIds.has(job.id))
      .map((job) => ({
        ...job,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    if (newJobs.length > 0) {
      await collection.insertMany(newJobs);
      console.log(`✅ Added ${newJobs.length} new jobs to database`);
    } else {
      console.log("ℹ️ No new jobs to add (all jobs already exist)");
    }

    console.log(
      `📊 Total jobs in database: ${await collection.countDocuments()}`
    );
  } catch (error) {
    console.error("❌ Failed to add jobs to database:", error);
    throw error;
  }
}

// Add a single job to database
export async function addJobToDatabase(job: Job): Promise<void> {
  try {
    const collection = await getJobsCollection();

    // Check if job already exists
    const existingJob = await collection.findOne({ id: job.id });
    if (existingJob) {
      console.log(`ℹ️ Job ${job.id} already exists in database`);
      return;
    }

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
  updates: {
    title?: string;
    company?: string;
    description?: string;
  }
): Promise<boolean> {
  try {
    const collection = await getJobsCollection();
    const result = await collection.updateOne(
      { id: jobId },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Updated job ${jobId} in database`);
      return true;
    } else {
      console.log(`ℹ️ Job ${jobId} not found or no changes made`);
      return false;
    }
  } catch (error) {
    console.error("❌ Failed to update job in database:", error);
    return false;
  }
}

// Delete a job from database
export async function deleteJobFromDatabase(jobId: string): Promise<void> {
  try {
    const collection = await getJobsCollection();
    const result = await collection.deleteOne({ id: jobId });

    if (result.deletedCount > 0) {
      console.log(`✅ Deleted job ${jobId} from database`);
    } else {
      console.log(`ℹ️ Job ${jobId} not found in database`);
    }
  } catch (error) {
    console.error("❌ Failed to delete job from database:", error);
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

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentJobs = await collection.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const oldJobs = await collection.countDocuments({
      createdAt: { $lt: oneMonthAgo },
    });

    return {
      totalJobs,
      recentJobs,
      oldJobs,
    };
  } catch (error) {
    console.error("❌ Failed to get database stats:", error);
    return {
      totalJobs: 0,
      recentJobs: 0,
      oldJobs: 0,
    };
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
    console.error("❌ Database not available:", error);
    return false;
  }
}

// Email subscriptions functions
export async function getSubscriptionsCollection(): Promise<
  Collection<EmailSubscription>
> {
  const database = await connectToDatabase();
  return database.collection<EmailSubscription>("subscriptions");
}

export async function addEmailSubscription(
  subscription: Omit<EmailSubscription, "id">
): Promise<void> {
  try {
    const collection = await getSubscriptionsCollection();
    await collection.insertOne(subscription);
    console.log(`✅ Added email subscription: ${subscription.email}`);
  } catch (error) {
    console.error("❌ Failed to add email subscription:", error);
    throw error;
  }
}

export async function getEmailSubscriptions(): Promise<EmailSubscription[]> {
  try {
    const collection = await getSubscriptionsCollection();
    const subscriptions = await collection.find({}).toArray();
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
    const collection = await getSubscriptionsCollection();
    const subscriptions = await collection.find({}).toArray();

    const totalSubscriptions = subscriptions.length;
    const uniqueEmails = new Set(subscriptions.map((s) => s.email)).size;

    const jobTypeCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};

    subscriptions.forEach((sub) => {
      jobTypeCounts[sub.jobType] = (jobTypeCounts[sub.jobType] || 0) + 1;
      locationCounts[sub.location] = (locationCounts[sub.location] || 0) + 1;
    });

    return {
      totalSubscriptions,
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
    await collection.updateOne({ email }, { $set: { isActive } });
    console.log(`✅ Updated subscription status for: ${email}`);
  } catch (error) {
    console.error("❌ Failed to update subscription status:", error);
  }
}

export async function deleteEmailSubscription(email: string): Promise<void> {
  try {
    const collection = await getSubscriptionsCollection();
    await collection.deleteOne({ email });
    console.log(`✅ Deleted email subscription: ${email}`);
  } catch (error) {
    console.error("❌ Failed to delete email subscription:", error);
  }
}

interface Lead {
  jobId: string;
  jobTitle: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter: string;
  resumeUrl: string;
  status: "new" | "qualified" | "contacted" | "sold" | "rejected";
  qualificationScore: number;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string;
  userAgent: string;
}

// Save lead to database
export async function saveLeadToDatabase(lead: Lead): Promise<void> {
  try {
    const collection = await getLeadsCollection();

    // Check if lead already exists (same email for same job)
    const existingLead = await collection.findOne({
      email: lead.email,
      jobId: lead.jobId,
    });

    if (existingLead) {
      console.log(
        `ℹ️ Lead already exists for ${lead.email} and job ${lead.jobId}`
      );
      return;
    }

    await collection.insertOne(lead);
    console.log(
      `✅ Lead saved: ${lead.name} for ${lead.jobTitle} at ${lead.company}`
    );
  } catch (error) {
    console.error("❌ Failed to save lead to database:", error);
    throw error;
  }
}

// Get leads collection
export async function getLeadsCollection(): Promise<Collection<Lead>> {
  const database = await connectToDatabase();
  return database.collection<Lead>("leads");
}

// Get all leads
export async function getLeadsFromDatabase(): Promise<Lead[]> {
  try {
    const collection = await getLeadsCollection();
    const leads = await collection.find({}).sort({ createdAt: -1 }).toArray();
    console.log(`✅ Retrieved ${leads.length} leads from database`);
    return leads;
  } catch (error) {
    console.error("❌ Failed to get leads from database:", error);
    return [];
  }
}

// Get lead statistics
export async function getLeadStats(): Promise<{
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  soldLeads: number;
  recentLeads: number;
}> {
  try {
    const collection = await getLeadsCollection();
    const totalLeads = await collection.countDocuments();
    const newLeads = await collection.countDocuments({ status: "new" });
    const qualifiedLeads = await collection.countDocuments({
      status: "qualified",
    });
    const soldLeads = await collection.countDocuments({ status: "sold" });
    const recentLeads = await collection.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    return {
      totalLeads,
      newLeads,
      qualifiedLeads,
      soldLeads,
      recentLeads,
    };
  } catch (error) {
    console.error("Error getting lead stats:", error);
    return {
      totalLeads: 0,
      newLeads: 0,
      qualifiedLeads: 0,
      soldLeads: 0,
      recentLeads: 0,
    };
  }
}

// Job Alerts Functions
export async function getJobAlertsCollection(): Promise<Collection<JobAlert>> {
  const database = await connectToDatabase();
  return database.collection<JobAlert>("job-alerts");
}

export async function addJobAlert(jobAlert: JobAlert): Promise<void> {
  try {
    const collection = await getJobAlertsCollection();
    await collection.insertOne(jobAlert);
    console.log(`✅ Job alert saved for ${jobAlert.email}`);
  } catch (error) {
    console.error("Error saving job alert:", error);
    throw error;
  }
}

export async function getJobAlertsByEmail(email: string): Promise<JobAlert[]> {
  try {
    const collection = await getJobAlertsCollection();
    return await collection.find({ email, isActive: true }).toArray();
  } catch (error) {
    console.error("Error getting job alerts:", error);
    return [];
  }
}

export async function getAllActiveJobAlerts(): Promise<JobAlert[]> {
  try {
    const collection = await getJobAlertsCollection();
    return await collection.find({ isActive: true }).toArray();
  } catch (error) {
    console.error("Error getting all job alerts:", error);
    return [];
  }
}

export async function updateJobAlertLastSent(alertId: string): Promise<void> {
  try {
    const collection = await getJobAlertsCollection();
    await collection.updateOne(
      { id: alertId },
      {
        $set: {
          lastSentAt: new Date(),
          updatedAt: new Date(),
        },
        $inc: { totalSent: 1 },
      }
    );
  } catch (error) {
    console.error("Error updating job alert last sent:", error);
  }
}

export async function deactivateJobAlert(alertId: string): Promise<void> {
  try {
    const collection = await getJobAlertsCollection();
    await collection.updateOne(
      { id: alertId },
      {
        $set: {
          isActive: false,
          updatedAt: new Date(),
        },
      }
    );
  } catch (error) {
    console.error("Error deactivating job alert:", error);
  }
}

export async function getJobAlertStats(): Promise<{
  totalAlerts: number;
  activeAlerts: number;
  totalEmails: number;
  recentAlerts: number;
}> {
  try {
    const collection = await getJobAlertsCollection();
    const totalAlerts = await collection.countDocuments();
    const activeAlerts = await collection.countDocuments({ isActive: true });
    const recentAlerts = await collection.countDocuments({
      subscribedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // Calculate total emails sent
    const alerts = await collection.find({}).toArray();
    const totalEmails = alerts.reduce(
      (sum, alert) => sum + (alert.totalSent || 0),
      0
    );

    return {
      totalAlerts,
      activeAlerts,
      totalEmails,
      recentAlerts,
    };
  } catch (error) {
    console.error("Error getting job alert stats:", error);
    return {
      totalAlerts: 0,
      activeAlerts: 0,
      totalEmails: 0,
      recentAlerts: 0,
    };
  }
}

export interface JobPosting {
  _id?: string;
  companyName: string;
  companyWebsite?: string;
  companyLogo?: string;
  jobTitle: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salaryRange?: string;
  jobDescription: string;
  requiredSkills: string[];
  benefits?: string;
  applicationDeadline?: string;
  contactEmail: string;
  contactPhone?: string;
  status: "draft" | "pending" | "active" | "expired" | "archived";
  views: number;
  applications: number;
  createdAt: Date;
  expiresAt: Date;
  postedBy: string;
}

export async function getJobPostingsCollection() {
  const db = await connectToDatabase();
  return db.collection<JobPosting>("job-postings");
}

export async function addJobPosting(job: JobPosting): Promise<string> {
  const collection = await getJobPostingsCollection();
  const result = await collection.insertOne(job);
  return result.insertedId.toString();
}

export async function getJobPostingById(
  jobId: string
): Promise<JobPosting | null> {
  const collection = await getJobPostingsCollection();
  return await collection.findOne({ _id: jobId });
}

export async function updateJobPosting(
  jobId: string,
  updates: Partial<JobPosting>
): Promise<boolean> {
  const collection = await getJobPostingsCollection();
  const result = await collection.updateOne({ _id: jobId }, { $set: updates });
  return result.modifiedCount > 0;
}

export async function getActiveJobPostings(): Promise<JobPosting[]> {
  const collection = await getJobPostingsCollection();
  return await collection
    .find({
      status: "active",
      expiresAt: { $gt: new Date() },
    })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getJobPostingsByEmail(
  email: string
): Promise<JobPosting[]> {
  const collection = await getJobPostingsCollection();
  return await collection
    .find({ postedBy: email })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function incrementJobViews(jobId: string): Promise<boolean> {
  const collection = await getJobPostingsCollection();
  const result = await collection.updateOne(
    { _id: jobId },
    { $inc: { views: 1 } }
  );
  return result.modifiedCount > 0;
}

export async function getJobPostingStats(): Promise<{
  total: number;
  active: number;
  expired: number;
  totalViews: number;
  totalApplications: number;
}> {
  const collection = await getJobPostingsCollection();

  const [total, active, expired, viewsResult, applicationsResult] =
    await Promise.all([
      collection.countDocuments({}),
      collection.countDocuments({
        status: "active",
        expiresAt: { $gt: new Date() },
      }),
      collection.countDocuments({
        expiresAt: { $lt: new Date() },
      }),
      collection
        .aggregate([{ $group: { _id: null, totalViews: { $sum: "$views" } } }])
        .toArray(),
      collection
        .aggregate([
          {
            $group: { _id: null, totalApplications: { $sum: "$applications" } },
          },
        ])
        .toArray(),
    ]);

  return {
    total,
    active,
    expired,
    totalViews: viewsResult[0]?.totalViews || 0,
    totalApplications: applicationsResult[0]?.totalApplications || 0,
  };
}

#!/usr/bin/env tsx

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

import { connectToDatabase } from "../src/lib/database";
import {
  generateDuplicateReport,
  formatDuplicateReport,
} from "../src/lib/duplicate-checker";
import { InterviewQuestion } from "../src/types/interview-question";

async function checkDuplicates() {
  try {
    console.log("🔍 Starting duplicate check for interview questions...");

    // Connect to database
    const db = await connectToDatabase();
    const collection = db.collection("interview-questions");

    // Get all questions
    const questions = (await collection
      .find({})
      .toArray()) as unknown as InterviewQuestion[];
    console.log(`📊 Found ${questions.length} questions in database`);

    if (questions.length === 0) {
      console.log("ℹ️ No questions found in database");
      return;
    }

    // Generate duplicate report
    const report = generateDuplicateReport(questions);

    // Display the report
    console.log("\n" + formatDuplicateReport(report));

    // Additional analysis
    console.log("\n🔍 Additional Analysis:");
    console.log("=====================");

    // Check for exact duplicate questions (case-insensitive)
    const questionTexts = questions.map((q) => q.question.toLowerCase().trim());
    const uniqueTexts = new Set(questionTexts);
    const exactDuplicates = questionTexts.length - uniqueTexts.size;

    if (exactDuplicates > 0) {
      console.log(
        `⚠️ Found ${exactDuplicates} exact duplicate questions (case-insensitive)`
      );
    } else {
      console.log("✅ No exact duplicate questions found");
    }

    // Check for duplicate IDs
    const ids = questions.map((q) => q.id);
    const uniqueIds = new Set(ids);
    const duplicateIds = ids.length - uniqueIds.size;

    if (duplicateIds > 0) {
      console.log(`⚠️ Found ${duplicateIds} duplicate IDs`);
    } else {
      console.log("✅ No duplicate IDs found");
    }

    // Check for questions with same content but different IDs
    const contentMap = new Map<string, InterviewQuestion[]>();
    questions.forEach((question) => {
      const content = `${question.question
        .toLowerCase()
        .trim()}|${question.answer.toLowerCase().trim()}`;
      if (!contentMap.has(content)) {
        contentMap.set(content, []);
      }
      contentMap.get(content)!.push(question);
    });

    const contentDuplicates = Array.from(contentMap.values()).filter(
      (group) => group.length > 1
    );
    if (contentDuplicates.length > 0) {
      console.log(
        `⚠️ Found ${contentDuplicates.length} groups with identical content but different IDs`
      );
      contentDuplicates.forEach((group, index) => {
        console.log(`   Group ${index + 1}:`);
        group.forEach((q) =>
          console.log(
            `     - ID: ${q.id}, Question: "${q.question.substring(0, 50)}..."`
          )
        );
      });
    } else {
      console.log("✅ No content duplicates found");
    }

    // Summary
    console.log("\n📋 Summary:");
    console.log("===========");
    console.log(`Total Questions: ${questions.length}`);
    console.log(`Unique Questions: ${uniqueTexts.size}`);
    console.log(`Exact Duplicates: ${exactDuplicates}`);
    console.log(`Duplicate IDs: ${duplicateIds}`);
    console.log(`Content Duplicates: ${contentDuplicates.length}`);
    console.log(`Similar Questions: ${report.duplicatesFound}`);

    if (
      exactDuplicates === 0 &&
      duplicateIds === 0 &&
      contentDuplicates.length === 0 &&
      report.duplicatesFound === 0
    ) {
      console.log("\n🎉 Database is clean! No duplicates found.");
    } else {
      console.log("\n⚠️ Database has some duplicates that should be reviewed.");
    }
  } catch (error) {
    console.error("❌ Error checking duplicates:", error);
  } finally {
    process.exit(0);
  }
}

// Run the check
checkDuplicates();

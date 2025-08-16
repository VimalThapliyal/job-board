#!/usr/bin/env tsx

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

import { connectToDatabase } from "../src/lib/database";
import { InterviewQuestion } from "../src/types/interview-question";

async function cleanupDuplicates() {
  try {
    console.log("🧹 Starting cleanup of duplicate questions...");
    
    // Connect to database
    const db = await connectToDatabase();
    const collection = db.collection("interview-questions");
    
    // Get all questions
    const questions = await collection.find({}).toArray() as unknown as InterviewQuestion[];
    console.log(`📊 Found ${questions.length} questions in database`);
    
    // Questions to remove
    const questionsToRemove: string[] = [];
    
    // 1. Remove React Documentation questions (16 questions)
    console.log("\n🔍 Removing React Documentation questions...");
    const docQuestions = questions.filter(q => q.source === "React Documentation");
    docQuestions.forEach(q => {
      questionsToRemove.push(q.id);
      console.log(`   - Removing: "${q.question}" (ID: ${q.id})`);
    });
    
    // 2. Remove Context API question (1 question)
    console.log("\n🔍 Removing redundant Context API question...");
    const contextApiQuestion = questions.find(q => 
      q.question.toLowerCase().includes('context api') && 
      !q.question.toLowerCase().includes('react context')
    );
    if (contextApiQuestion) {
      questionsToRemove.push(contextApiQuestion.id);
      console.log(`   - Removing: "${contextApiQuestion.question}" (ID: ${contextApiQuestion.id})`);
    }
    
    // 3. Remove questions by ID
    if (questionsToRemove.length > 0) {
      console.log(`\n🗑️ Removing ${questionsToRemove.length} questions...`);
      
      const result = await collection.deleteMany({
        id: { $in: questionsToRemove }
      });
      
      console.log(`✅ Successfully removed ${result.deletedCount} questions`);
    } else {
      console.log("\n✅ No questions to remove");
    }
    
    // 4. Verify cleanup
    console.log("\n🔍 Verifying cleanup...");
    const remainingQuestions = await collection.find({}).toArray() as unknown as InterviewQuestion[];
    console.log(`📊 Remaining questions: ${remainingQuestions.length}`);
    
    // 5. Check for any remaining duplicates
    const remainingDocQuestions = remainingQuestions.filter(q => q.source === "React Documentation");
    const remainingContextQuestions = remainingQuestions.filter(q => 
      q.question.toLowerCase().includes('context api') && 
      !q.question.toLowerCase().includes('react context')
    );
    
    if (remainingDocQuestions.length > 0) {
      console.log(`⚠️ Warning: ${remainingDocQuestions.length} React Documentation questions still remain`);
    } else {
      console.log("✅ All React Documentation questions removed");
    }
    
    if (remainingContextQuestions.length > 0) {
      console.log(`⚠️ Warning: ${remainingContextQuestions.length} Context API questions still remain`);
    } else {
      console.log("✅ All redundant Context API questions removed");
    }
    
    // 6. Summary
    console.log("\n📋 Cleanup Summary");
    console.log("==================");
    console.log(`Total Questions Before: ${questions.length}`);
    console.log(`Questions Removed: ${questionsToRemove.length}`);
    console.log(`Total Questions After: ${remainingQuestions.length}`);
    console.log(`Net Reduction: ${questions.length - remainingQuestions.length} questions`);
    
    if (questionsToRemove.length > 0) {
      console.log("\n🎉 Cleanup completed successfully!");
      console.log("✅ Database is now cleaner and more focused on high-quality interview questions");
    } else {
      console.log("\nℹ️ No cleanup needed - database is already clean");
    }
    
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  } finally {
    process.exit(0);
  }
}

// Run the cleanup
cleanupDuplicates(); 
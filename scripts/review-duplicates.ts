#!/usr/bin/env tsx

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

import { connectToDatabase } from "../src/lib/database";
import { InterviewQuestion } from "../src/types/interview-question";

async function reviewDuplicates() {
  try {
    console.log("🔍 Reviewing duplicate questions in detail...");
    
    // Connect to database
    const db = await connectToDatabase();
    const collection = db.collection("interview-questions");
    
    // Get all questions
    const questions = await collection.find({}).toArray() as unknown as InterviewQuestion[];
    console.log(`📊 Found ${questions.length} questions in database`);
    
    // Group 1: Context API questions
    console.log("\n🔍 GROUP 1: Context API Questions");
    console.log("=================================");
    const contextQuestions = questions.filter(q => 
      q.question.toLowerCase().includes('context') && 
      q.question.toLowerCase().includes('api')
    );
    
    contextQuestions.forEach((q, index) => {
      console.log(`\n${index + 1}. "${q.question}"`);
      console.log(`   ID: ${q.id}`);
      console.log(`   Difficulty: ${q.difficulty}`);
      console.log(`   Categories: ${q.category.join(", ")}`);
      console.log(`   Tags: ${q.tags.join(", ")}`);
      console.log(`   Source: ${q.source}`);
      console.log(`   Answer Preview: ${q.answer.substring(0, 100)}...`);
    });
    
    // Group 2: React documentation questions
    console.log("\n🔍 GROUP 2: React Documentation Questions");
    console.log("=========================================");
    const docQuestions = questions.filter(q => 
      q.source === "React Documentation" || 
      q.tags.includes("documentation")
    );
    
    docQuestions.forEach((q, index) => {
      console.log(`\n${index + 1}. "${q.question}"`);
      console.log(`   ID: ${q.id}`);
      console.log(`   Difficulty: ${q.difficulty}`);
      console.log(`   Categories: ${q.category.join(", ")}`);
      console.log(`   Tags: ${q.tags.join(", ")}`);
      console.log(`   Source: ${q.source}`);
    });
    
    // Group 3: useMemo/useCallback questions
    console.log("\n🔍 GROUP 3: useMemo/useCallback Questions");
    console.log("=========================================");
    const memoQuestions = questions.filter(q => 
      q.question.toLowerCase().includes('usememo') || 
      q.question.toLowerCase().includes('usecallback')
    );
    
    memoQuestions.forEach((q, index) => {
      console.log(`\n${index + 1}. "${q.question}"`);
      console.log(`   ID: ${q.id}`);
      console.log(`   Difficulty: ${q.difficulty}`);
      console.log(`   Categories: ${q.category.join(", ")}`);
      console.log(`   Tags: ${q.tags.join(", ")}`);
      console.log(`   Source: ${q.source}`);
      console.log(`   Answer Preview: ${q.answer.substring(0, 100)}...`);
    });
    
    // Recommendations
    console.log("\n💡 RECOMMENDATIONS");
    console.log("==================");
    
    if (contextQuestions.length > 1) {
      console.log("\n1. CONTEXT API QUESTIONS:");
      console.log("   - Keep: 'What is React Context and when should you use it?' (more comprehensive)");
      console.log("   - Remove: 'What is the Context API and when should you use it?' (redundant)");
      console.log("   - Reason: Both ask the same thing, but 'React Context' is more commonly used terminology");
    }
    
    if (docQuestions.length > 0) {
      console.log("\n2. REACT DOCUMENTATION QUESTIONS:");
      console.log("   - These appear to be from React documentation and may not be suitable for interview questions");
      console.log("   - Consider removing all questions with source 'React Documentation'");
      console.log("   - These questions are more like documentation examples than interview questions");
      console.log("   - Total to remove: " + docQuestions.length + " questions");
    }
    
    if (memoQuestions.length > 1) {
      console.log("\n3. USEMEMO/USECALLBACK QUESTIONS:");
      console.log("   - Keep both: 'What is the useMemo hook and how does it work?'");
      console.log("   - Keep both: 'What is the useCallback hook and when should you use it?'");
      console.log("   - Reason: These are different hooks with different purposes, both are valuable");
      console.log("   - Consider: Merge into a single question about 'React memoization hooks'");
    }
    
    console.log("\n📋 SUMMARY");
    console.log("===========");
    console.log(`Total Questions: ${questions.length}`);
    console.log(`Context Questions: ${contextQuestions.length}`);
    console.log(`Documentation Questions: ${docQuestions.length}`);
    console.log(`Memo Questions: ${memoQuestions.length}`);
    
    const totalToReview = contextQuestions.length + docQuestions.length + memoQuestions.length;
    console.log(`\nTotal Questions to Review: ${totalToReview}`);
    
  } catch (error) {
    console.error("❌ Error reviewing duplicates:", error);
  } finally {
    process.exit(0);
  }
}

// Run the review
reviewDuplicates(); 
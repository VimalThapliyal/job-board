#!/usr/bin/env tsx

import { config } from "dotenv";
import { resolve } from "path";
import * as fs from "fs";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

import { connectToDatabase } from "../src/lib/database";
import { InterviewQuestion } from "../src/types/interview-question";

interface ParsedQuestion {
  question: string;
  answer: string;
  explanation?: string;
  codeExample?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string[];
  tags: string[];
  source: string;
  sourceUrl: string;
}

function parseQuestionsFile(filePath: string): ParsedQuestion[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const questions: ParsedQuestion[] = [];
  
  // Split content into sections
  const sections = content.split(/(?=React Interview Questions for|^\d+\.)/m);
  
  let currentDifficulty: "beginner" | "intermediate" | "advanced" = "beginner";
  
  for (const section of sections) {
    if (section.trim() === '') continue;
    
    // Determine difficulty based on section header
    if (section.includes("React Interview Questions for Freshers")) {
      currentDifficulty = "beginner";
    } else if (section.includes("React Interview Questions for Experienced")) {
      currentDifficulty = "intermediate";
    }
    
    // Extract questions from section
    const questionBlocks = section.split(/(?=^\d+\.)/m).filter(block => block.trim() !== '');
    
    for (const block of questionBlocks) {
      if (!block.match(/^\d+\./)) continue;
      
      const lines = block.split('\n').filter(line => line.trim() !== '');
      if (lines.length < 2) continue;
      
      // Extract question number and text
      const questionMatch = lines[0].match(/^\d+\.\s*(.+)/);
      if (!questionMatch) continue;
      
      const questionText = questionMatch[1].trim();
      
      // Extract answer (everything after the question until the next question or end)
      let answerLines: string[] = [];
      let codeExampleLines: string[] = [];
      let inCodeBlock = false;
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines and course advertisements
        if (line === '' || line.includes('course') || line.includes('enrollemnts') || 
            line.includes('rupee') || line.includes('star') || line.includes('Get Access') ||
            line.includes('logo') || line.includes('Play Store') || line.includes('Create a free') ||
            line.includes('Advance your career') || line.includes('Mock Assessments') ||
            line.includes('Useful References') || line.includes('Conclusion')) {
          continue;
        }
        
        // Check if we've hit the next question
        if (line.match(/^\d+\./)) break;
        
        // Check for code blocks
        if (line.includes('```') || line.includes('Example:') || line.includes('codeExample:')) {
          inCodeBlock = !inCodeBlock;
          if (inCodeBlock) {
            codeExampleLines.push(line);
          }
          continue;
        }
        
        if (inCodeBlock) {
          codeExampleLines.push(line);
        } else {
          answerLines.push(line);
        }
      }
      
      const answer = answerLines.join(' ').trim();
      const codeExample = codeExampleLines.length > 0 ? codeExampleLines.join('\n') : undefined;
      
      if (answer && answer.length > 10) {
        // Determine category based on question content
        const category = determineCategory(questionText, answer);
        const tags = extractTags(questionText, answer);
        
        questions.push({
          question: questionText,
          answer: answer,
          explanation: answer.length > 200 ? answer.substring(0, 200) + '...' : answer,
          codeExample: codeExample,
          difficulty: currentDifficulty,
          category: [category],
          tags: tags,
          source: "Questions.txt Import",
          sourceUrl: "",
        });
      }
    }
  }
  
  return questions;
}

function determineCategory(question: string, answer: string): string {
  const text = (question + ' ' + answer).toLowerCase();
  
  if (text.includes('hook') || text.includes('useState') || text.includes('useEffect') || 
      text.includes('useContext') || text.includes('useReducer') || text.includes('useMemo') || 
      text.includes('useCallback')) {
    return "React Hooks";
  }
  
  if (text.includes('component') || text.includes('functional') || text.includes('class')) {
    return "React Components";
  }
  
  if (text.includes('state') || text.includes('props') || text.includes('data flow')) {
    return "State Management";
  }
  
  if (text.includes('virtual dom') || text.includes('dom') || text.includes('rendering')) {
    return "React Performance";
  }
  
  if (text.includes('router') || text.includes('routing') || text.includes('navigation')) {
    return "React Routing";
  }
  
  if (text.includes('error') || text.includes('boundary') || text.includes('catch')) {
    return "Error Handling";
  }
  
  if (text.includes('lifecycle') || text.includes('mount') || text.includes('unmount')) {
    return "React Lifecycle";
  }
  
  if (text.includes('jsx') || text.includes('syntax')) {
    return "React Fundamentals";
  }
  
  if (text.includes('optimization') || text.includes('performance') || text.includes('memo')) {
    return "React Performance";
  }
  
  if (text.includes('context') || text.includes('provider') || text.includes('consumer')) {
    return "State Management";
  }
  
  return "React Fundamentals";
}

function extractTags(question: string, answer: string): string[] {
  const text = (question + ' ' + answer).toLowerCase();
  const tags: string[] = [];
  
  // Extract common React terms
  const reactTerms = [
    'react', 'jsx', 'component', 'hook', 'state', 'props', 'virtual-dom', 'dom',
    'usestate', 'useeffect', 'usecontext', 'usereducer', 'usememo', 'usecallback',
    'router', 'routing', 'lifecycle', 'error-boundary', 'performance', 'optimization',
    'functional-component', 'class-component', 'context', 'provider', 'consumer'
  ];
  
  for (const term of reactTerms) {
    if (text.includes(term.replace('-', ' ')) || text.includes(term)) {
      tags.push(term);
    }
  }
  
  // Add difficulty-based tags
  if (text.includes('beginner') || text.includes('basic')) {
    tags.push('beginner');
  } else if (text.includes('advanced') || text.includes('complex')) {
    tags.push('advanced');
  } else {
    tags.push('intermediate');
  }
  
  return tags.slice(0, 8); // Limit to 8 tags
}

function generateQuestionId(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

async function importQuestionsFromFile() {
  try {
    console.log("📚 Starting import of questions from questions.txt...");
    
    // Parse questions from file
    const parsedQuestions = parseQuestionsFile('questions.txt');
    console.log(`📊 Found ${parsedQuestions.length} questions in questions.txt`);
    
    if (parsedQuestions.length === 0) {
      console.log("❌ No questions found in questions.txt");
      return;
    }
    
    // Connect to database
    const db = await connectToDatabase();
    const collection = db.collection("interview-questions");
    
    // Get existing questions for duplicate checking
    const existingQuestions = await collection.find({}).toArray() as unknown as InterviewQuestion[];
    console.log(`🔍 Checking for duplicates among ${existingQuestions.length} existing questions...`);
    
    // Check for duplicates
    const questionsToAdd: ParsedQuestion[] = [];
    const duplicates: string[] = [];
    
    for (const question of parsedQuestions) {
      const isDuplicate = existingQuestions.some(existing => 
        existing.question.toLowerCase().trim() === question.question.toLowerCase().trim() ||
        existing.answer.toLowerCase().trim().includes(question.question.toLowerCase().trim()) ||
        question.answer.toLowerCase().trim().includes(existing.question.toLowerCase().trim())
      );
      
      if (isDuplicate) {
        duplicates.push(question.question);
      } else {
        questionsToAdd.push(question);
      }
    }
    
    console.log(`✅ Found ${questionsToAdd.length} new questions to add`);
    console.log(`⚠️ Found ${duplicates.length} duplicate questions (skipping)`);
    
    if (duplicates.length > 0) {
      console.log("\n🔍 Duplicate questions found:");
      duplicates.slice(0, 5).forEach(dup => console.log(`   - ${dup}`));
      if (duplicates.length > 5) {
        console.log(`   ... and ${duplicates.length - 5} more`);
      }
    }
    
    if (questionsToAdd.length === 0) {
      console.log("ℹ️ No new questions to add");
      return;
    }
    
    // Convert to InterviewQuestion format
    const questionsToInsert: InterviewQuestion[] = questionsToAdd.map(question => ({
      id: generateQuestionId(question.question),
      question: question.question,
      answer: question.answer,
      explanation: question.explanation || question.answer,
      codeExample: question.codeExample || "",
      difficulty: question.difficulty,
      category: question.category,
      tags: question.tags,
      source: question.source,
      sourceUrl: question.sourceUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
    }));
    
    // Insert questions
    await collection.insertMany(questionsToInsert);
    console.log(`✅ Successfully added ${questionsToInsert.length} new questions to database`);
    
    // Get updated count
    const totalQuestions = await collection.countDocuments();
    console.log(`📊 Total questions in database: ${totalQuestions}`);
    
    // Summary
    console.log("\n📋 Import Summary");
    console.log("==================");
    console.log(`Questions in file: ${parsedQuestions.length}`);
    console.log(`New questions added: ${questionsToInsert.length}`);
    console.log(`Duplicate questions skipped: ${duplicates.length}`);
    console.log(`Total questions in database: ${totalQuestions}`);
    
    if (questionsToInsert.length > 0) {
      console.log("\n🎉 Import completed successfully!");
      console.log("✅ Database has been updated with new questions from questions.txt");
    } else {
      console.log("\nℹ️ No new questions were added (all were duplicates)");
    }
    
  } catch (error) {
    console.error("❌ Error importing questions:", error);
  } finally {
    process.exit(0);
  }
}

// Run the import
importQuestionsFromFile(); 
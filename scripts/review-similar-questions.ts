import { connectToDatabase } from "../src/lib/database";
import { InterviewQuestion } from "../src/types/interview-question";

interface SimilarQuestionGroup {
  groupId: number;
  questions: InterviewQuestion[];
  reason: string;
  confidence: number;
}

async function reviewSimilarQuestions() {
  try {
    console.log("🔍 Reviewing similar questions for content quality improvement...");
    
    // Connect to database
    const db = await connectToDatabase();
    const collection = db.collection("interview-questions");
    
    // Get all questions
    const questions = await collection.find({}).toArray() as unknown as InterviewQuestion[];
    console.log(`📊 Found ${questions.length} questions in database`);
    
    // Define similar question groups based on the duplicate report
    const similarGroups: SimilarQuestionGroup[] = [
      {
        groupId: 1,
        questions: questions.filter(q => 
          q.id === "what-is-the-usememo-hook-and-how-does-it-work" ||
          q.id === "what-is-the-usecallback-hook-and-when-should-you-u"
        ),
        reason: "useMemo vs useCallback - both are performance optimization hooks",
        confidence: 90.0
      },
      {
        groupId: 2,
        questions: questions.filter(q => 
          q.id === "what-is-react" ||
          q.id === "what-are-the-advantages-of-using-react"
        ),
        reason: "React basics vs React advantages",
        confidence: 90.0
      },
      {
        groupId: 3,
        questions: questions.filter(q => 
          q.question.toLowerCase().includes("usestate") ||
          q.question.toLowerCase().includes("react hooks") ||
          q.question.toLowerCase().includes("functional") && q.question.toLowerCase().includes("class")
        ),
        reason: "useState and React Hooks related questions",
        confidence: 90.0
      }
    ];
    
    console.log("\n📋 SIMILAR QUESTIONS REVIEW");
    console.log("==========================");
    
    for (const group of similarGroups) {
      if (group.questions.length === 0) continue;
      
      console.log(`\n🔍 GROUP ${group.groupId}: ${group.reason}`);
      console.log("=".repeat(50));
      
      for (const question of group.questions) {
        console.log(`\n📝 Question: ${question.question}`);
        console.log(`   ID: ${question.id}`);
        console.log(`   Difficulty: ${question.difficulty}`);
        console.log(`   Categories: ${question.category.join(", ")}`);
        console.log(`   Tags: ${question.tags.join(", ")}`);
        console.log(`   Answer Preview: ${question.answer.substring(0, 150)}...`);
        console.log(`   Explanation Preview: ${question.explanation.substring(0, 150)}...`);
        
        // Check for code examples
        if (question.codeExample) {
          console.log(`   Code Example: ${question.codeExample.substring(0, 100)}...`);
        } else {
          console.log(`   Code Example: ❌ Missing`);
        }
      }
    }
    
    // Generate improvement recommendations
    console.log("\n💡 IMPROVEMENT RECOMMENDATIONS");
    console.log("=============================");
    
    const recommendations = [
      "1. Merge useMemo and useCallback questions into a single comprehensive question",
      "2. Enhance React basics question with more detailed explanations",
      "3. Add code examples to questions that are missing them",
      "4. Standardize difficulty levels across similar questions",
      "5. Improve tag organization for better searchability",
      "6. Add more detailed explanations to beginner questions",
      "7. Ensure consistent categorization across similar questions"
    ];
    
    recommendations.forEach(rec => console.log(rec));
    
    console.log("\n✅ Review completed!");
    
  } catch (error) {
    console.error("❌ Error reviewing similar questions:", error);
  } finally {
    process.exit(0);
  }
}

reviewSimilarQuestions(); 
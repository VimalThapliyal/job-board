import { NextResponse } from "next/server";
import { getInterviewQuestionsFromDatabase } from "@/lib/database";
import { generateDuplicateReport } from "@/lib/duplicate-checker";

export async function GET() {
  try {
    console.log("🔍 Checking for duplicates in interview questions...");

    // Get all questions from database
    const questions = await getInterviewQuestionsFromDatabase();

    if (questions.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalQuestions: 0,
          duplicatesFound: 0,
          duplicateGroups: [],
          recommendations: ["No questions found in database"],
          summary: "Database is empty",
        },
      });
    }

    // Generate duplicate report
    const report = generateDuplicateReport(questions);

    // Additional analysis
    const questionTexts = questions.map((q) => q.question.toLowerCase().trim());
    const uniqueTexts = new Set(questionTexts);
    const exactDuplicates = questionTexts.length - uniqueTexts.size;

    const ids = questions.map((q) => q.id);
    const uniqueIds = new Set(ids);
    const duplicateIds = ids.length - uniqueIds.size;

    // Check for content duplicates
    const contentMap = new Map<string, typeof questions>();
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

    return NextResponse.json({
      success: true,
      data: {
        ...report,
        additionalAnalysis: {
          exactDuplicates,
          duplicateIds,
          contentDuplicates: contentDuplicates.length,
          uniqueQuestions: uniqueTexts.size,
          totalQuestions: questions.length,
        },
        summary: {
          isClean:
            exactDuplicates === 0 &&
            duplicateIds === 0 &&
            contentDuplicates.length === 0 &&
            report.duplicatesFound === 0,
          totalIssues:
            exactDuplicates +
            duplicateIds +
            contentDuplicates.length +
            report.duplicatesFound,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error checking duplicates:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check for duplicates",
      },
      { status: 500 }
    );
  }
}

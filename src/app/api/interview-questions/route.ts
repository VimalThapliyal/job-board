import { NextRequest, NextResponse } from "next/server";
import {
  getInterviewQuestionsFromDatabase,
  getQuestionsByDifficulty,
  getQuestionsByCategory,
  searchQuestions,
  getQuestionStats,
} from "@/lib/database";
import { InterviewQuestion } from "@/types/interview-question";

// Helper function to serialize MongoDB objects
function serializeQuestion(question: InterviewQuestion & { _id?: unknown }) {
  const { _id, ...questionWithoutId } = question;
  return {
    ...questionWithoutId,
    createdAt:
      question.createdAt instanceof Date
        ? question.createdAt.toISOString()
        : question.createdAt,
    updatedAt:
      question.updatedAt instanceof Date
        ? question.updatedAt.toISOString()
        : question.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const stats = searchParams.get("stats") === "true";

    let questions = [];

    // Handle different query types
    if (search) {
      // Search questions
      questions = await searchQuestions(search);
    } else if (difficulty) {
      // Filter by difficulty
      questions = await getQuestionsByDifficulty(
        difficulty as "beginner" | "intermediate" | "advanced"
      );
    } else if (category) {
      // Filter by category
      questions = await getQuestionsByCategory(category);
    } else {
      // Get all questions
      questions = await getInterviewQuestionsFromDatabase();
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedQuestions = questions.slice(startIndex, endIndex);

    // Serialize questions to remove MongoDB _id fields
    const serializedQuestions = paginatedQuestions.map(serializeQuestion);

    // Get statistics if requested
    let statistics = null;
    if (stats) {
      statistics = await getQuestionStats();
    }

    return NextResponse.json({
      success: true,
      data: {
        questions: serializedQuestions,
        pagination: {
          total: questions.length,
          page,
          limit,
          totalPages: Math.ceil(questions.length / limit),
          hasNext: endIndex < questions.length,
          hasPrev: page > 1,
        },
        statistics,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching interview questions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch interview questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      question,
      answer,
      explanation,
      difficulty,
      category,
      tags,
      codeExample,
    } = body;

    // Validate required fields
    if (!question || !answer || !difficulty || !category) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: question, answer, difficulty, category",
        },
        { status: 400 }
      );
    }

    // Validate difficulty
    const validDifficulties = ["beginner", "intermediate", "advanced"];
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid difficulty. Must be one of: beginner, intermediate, advanced",
        },
        { status: 400 }
      );
    }

    // Create new question
    const newQuestion = {
      id: question
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50),
      question: question.trim(),
      answer: answer.trim(),
      explanation: explanation?.trim() || answer.trim(),
      codeExample: codeExample?.trim() || "",
      difficulty: difficulty.toLowerCase(),
      category: Array.isArray(category) ? category : [category],
      tags: Array.isArray(tags) ? tags : [],
      source: "Manual Submission",
      sourceUrl: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
    };

    // Save to database
    const { saveInterviewQuestions } = await import("@/lib/database");
    await saveInterviewQuestions([newQuestion]);

    return NextResponse.json({
      success: true,
      data: newQuestion,
      message: "Question added successfully",
    });
  } catch (error) {
    console.error("❌ Error adding interview question:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add interview question",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

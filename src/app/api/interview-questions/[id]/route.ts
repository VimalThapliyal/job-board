import { NextRequest, NextResponse } from "next/server";
import {
  getQuestionById,
  updateQuestionFeedback,
  updateInterviewQuestion,
} from "@/lib/database";
import { InterviewQuestion } from "@/types/interview-question";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Question ID is required",
        },
        { status: 400 }
      );
    }

    const question = await getQuestionById(id);

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error: "Question not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("❌ Error fetching interview question:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch interview question",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Question ID is required",
        },
        { status: 400 }
      );
    }

    // Validate the update data
    const allowedFields = [
      "question",
      "answer",
      "explanation",
      "codeExample",
      "difficulty",
      "tags",
      "category",
    ];

    const updateData: Partial<InterviewQuestion> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updateData as Record<string, unknown>)[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid fields to update",
        },
        { status: 400 }
      );
    }

    // Update the question
    const success = await updateInterviewQuestion(id, updateData);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Question updated successfully",
        data: updateData,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Question not found or update failed",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("❌ Error updating interview question:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update interview question",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isHelpful } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Question ID is required",
        },
        { status: 400 }
      );
    }

    if (typeof isHelpful !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "isHelpful must be a boolean",
        },
        { status: 400 }
      );
    }

    // Update feedback
    await updateQuestionFeedback(id, isHelpful);

    return NextResponse.json({
      success: true,
      message: "Feedback updated successfully",
    });
  } catch (error) {
    console.error("❌ Error updating question feedback:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update question feedback",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

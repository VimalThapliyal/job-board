import { NextResponse } from "next/server";
import { getQuestionCategories } from "@/lib/database";
import { QuestionCategory } from "@/types/interview-question";

// Helper function to serialize MongoDB objects
function serializeCategory(category: QuestionCategory & { _id?: unknown }) {
  const { _id, ...categoryWithoutId } = category;
  return categoryWithoutId;
}

export async function GET() {
  try {
    const categories = await getQuestionCategories();

    // Serialize categories to remove MongoDB _id fields
    const serializedCategories = categories.map(serializeCategory);

    return NextResponse.json({
      success: true,
      data: serializedCategories,
    });
  } catch (error) {
    console.error("❌ Error fetching question categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch question categories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

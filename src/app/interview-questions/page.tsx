import { Metadata } from "next";
import {
  getInterviewQuestionsFromDatabase,
  getQuestionCategories,
  getQuestionStats,
} from "@/lib/database";
import InterviewQuestionsPage from "@/components/InterviewQuestionsPage";

export const metadata: Metadata = {
  title: "React Interview Questions - Master React Interviews",
  description:
    "Practice with 100+ curated React interview questions covering fundamentals, hooks, performance, testing, and advanced patterns. Ace your React developer interviews with comprehensive answers and code examples.",
  keywords: [
    "React interview questions",
    "React developer interview",
    "React hooks interview questions",
    "React components interview",
    "React state management interview",
    "React performance interview",
    "React testing interview questions",
    "React advanced patterns",
    "React developer career",
    "React interview prep"
  ].join(", "),
  openGraph: {
    title: "React Interview Questions - Master React Interviews",
    description: "Practice with 100+ curated React interview questions covering fundamentals, hooks, performance, testing, and advanced patterns.",
    type: "website",
    url: "https://job-board-nine-lyart.vercel.app/interview-questions",
    siteName: "React Developer Jobs & Interview Prep",
    images: [
      {
        url: "https://job-board-nine-lyart.vercel.app/og-interview-questions.jpg",
        width: 1200,
        height: 630,
        alt: "React Interview Questions - Master React Interviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "React Interview Questions - Master React Interviews",
    description: "Practice with 100+ curated React interview questions covering fundamentals, hooks, performance, testing, and advanced patterns.",
    images: ["https://job-board-nine-lyart.vercel.app/og-interview-questions.jpg"],
  },
  alternates: {
    canonical: "https://job-board-nine-lyart.vercel.app/interview-questions",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function InterviewQuestions() {
  try {
    // Fetch data in parallel
    const [questions, categories, stats] = await Promise.all([
      getInterviewQuestionsFromDatabase(),
      getQuestionCategories(),
      getQuestionStats(),
    ]);

    // Convert MongoDB objects to plain objects for client components
    const serializedQuestions = questions.map((question) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      const { _id, ...questionWithoutId } = question as any;
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
    });

    const serializedCategories = categories.map((category) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      const { _id, ...categoryWithoutId } = category as any;
      return categoryWithoutId;
    });

    return (
      <InterviewQuestionsPage
        initialQuestions={serializedQuestions}
        categories={serializedCategories}
        stats={stats}
      />
    );
  } catch (error) {
    console.error("❌ Error loading interview questions:", error);
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              React Interview Questions
            </h1>
            <p className="text-gray-600">
              Sorry, we couldn&apos;t load the interview questions at the
              moment. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

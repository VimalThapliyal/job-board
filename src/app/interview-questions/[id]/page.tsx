import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQuestionById } from "@/lib/database";
import InterviewQuestionDetail from "@/components/InterviewQuestionDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const question = await getQuestionById(id);

  if (!question) {
    return {
      title: "Question Not Found - React Interview Questions",
      description: "The requested interview question could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const questionTitle = question.question.length > 60 
    ? question.question.substring(0, 60) + "..." 
    : question.question;
  const questionDescription = question.explanation 
    ? question.explanation.substring(0, 160) + "..." 
    : question.answer.substring(0, 160) + "...";
  const questionUrl = `https://job-board-nine-lyart.vercel.app/interview-questions/${id}`;

  return {
    title: `${questionTitle} - React Interview Questions`,
    description: questionDescription,
    keywords: [
      "react interview questions",
      "react developer interview",
      "react hooks interview",
      "react components interview",
      "react state management",
      "react performance",
      question.difficulty,
      ...question.category,
      ...question.tags,
    ].join(", "),
    openGraph: {
      title: questionTitle,
      description: questionDescription,
      type: "article",
      url: questionUrl,
      siteName: "React Developer Jobs & Interview Prep",
      images: [
        {
          url: "https://job-board-nine-lyart.vercel.app/og-interview-question.jpg",
          width: 1200,
          height: 630,
          alt: `${questionTitle} - React Interview Questions`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: questionTitle,
      description: questionDescription,
      images: ["https://job-board-nine-lyart.vercel.app/og-interview-question.jpg"],
    },
    alternates: {
      canonical: questionUrl,
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
}

export default async function InterviewQuestionPage({ params }: PageProps) {
  const { id } = await params;
  const question = await getQuestionById(id);

  if (!question) {
    notFound();
  }

  // Convert MongoDB object to plain object for client component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const { _id, ...questionWithoutId } = question as any;
  const serializedQuestion = {
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

  return <InterviewQuestionDetail question={serializedQuestion} />;
}

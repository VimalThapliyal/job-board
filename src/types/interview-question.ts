export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  codeExample?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string[];
  tags: string[];
  source: string;
  sourceUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
}

export interface QuestionCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  questionCount: number;
}

export interface ScrapingResult {
  question: string;
  answer: string;
  difficulty: string;
  category: string[];
  source: string;
  sourceUrl: string;
  explanation?: string;
  codeExample?: string;
  tags?: string[];
} 
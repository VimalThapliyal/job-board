import { InterviewQuestion, ScrapingResult } from "@/types/interview-question";

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  confidence: number; // 0-1, where 1 is exact match
  reason: string;
  existingQuestion?: InterviewQuestion;
  similarityScore?: number;
}

export interface DuplicateReport {
  totalQuestions: number;
  duplicatesFound: number;
  duplicateGroups: Array<{
    questions: InterviewQuestion[];
    reason: string;
    confidence: number;
  }>;
  recommendations: string[];
}

/**
 * Check if a question is a duplicate of existing questions
 */
export function checkQuestionDuplicate(
  newQuestion: ScrapingResult | InterviewQuestion,
  existingQuestions: InterviewQuestion[]
): DuplicateCheckResult {
  const questionText = newQuestion.question.toLowerCase().trim();
  
  // Check for exact matches first
  const exactMatch = existingQuestions.find(
    (q) => q.question.toLowerCase().trim() === questionText
  );
  
  if (exactMatch) {
    return {
      isDuplicate: true,
      confidence: 1.0,
      reason: "Exact question match",
      existingQuestion: exactMatch,
    };
  }

  // Check for similar questions using multiple strategies
  let bestMatch: InterviewQuestion | undefined;
  let highestConfidence = 0;
  let bestReason = "";

  for (const existing of existingQuestions) {
    const existingText = existing.question.toLowerCase().trim();
    
    // Strategy 1: Check if one question is contained within the other
    if (questionText.includes(existingText) || existingText.includes(questionText)) {
      const confidence = Math.min(questionText.length, existingText.length) / 
                        Math.max(questionText.length, existingText.length);
      
      if (confidence > highestConfidence && confidence > 0.7) {
        highestConfidence = confidence;
        bestMatch = existing;
        bestReason = "Question contains or is contained in existing question";
      }
    }

    // Strategy 2: Check for similar words (excluding common words)
    const similarityScore = calculateTextSimilarity(questionText, existingText);
    if (similarityScore > highestConfidence && similarityScore > 0.8) {
      highestConfidence = similarityScore;
      bestMatch = existing;
      bestReason = "High text similarity";
    }

    // Strategy 3: Check for same topic/keywords
    const topicSimilarity = calculateTopicSimilarity(newQuestion, existing);
    if (topicSimilarity > highestConfidence && topicSimilarity > 0.85) {
      highestConfidence = topicSimilarity;
      bestMatch = existing;
      bestReason = "Same topic/keywords";
    }
  }

  return {
    isDuplicate: highestConfidence > 0.8,
    confidence: highestConfidence,
    reason: bestReason,
    existingQuestion: bestMatch,
    similarityScore: highestConfidence,
  };
}

/**
 * Calculate text similarity between two strings
 */
function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.split(/\s+/).filter(word => word.length > 3));
  const words2 = new Set(text2.split(/\s+/).filter(word => word.length > 3));
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Calculate topic similarity based on tags, categories, and content
 */
function calculateTopicSimilarity(
  question1: ScrapingResult | InterviewQuestion,
  question2: InterviewQuestion
): number {
  let score = 0;
  let totalChecks = 0;

  // Check tags similarity
  if (question1.tags && question2.tags) {
    const tags1 = new Set(question1.tags.map(t => t.toLowerCase()));
    const tags2 = new Set(question2.tags.map(t => t.toLowerCase()));
    const tagIntersection = new Set([...tags1].filter(x => tags2.has(x)));
    const tagUnion = new Set([...tags1, ...tags2]);
    
    if (tagUnion.size > 0) {
      score += tagIntersection.size / tagUnion.size;
      totalChecks++;
    }
  }

  // Check categories similarity
  if (question1.category && question2.category) {
    const categories1 = new Set(question1.category.map(c => c.toLowerCase()));
    const categories2 = new Set(question2.category.map(c => c.toLowerCase()));
    const catIntersection = new Set([...categories1].filter(x => categories2.has(x)));
    const catUnion = new Set([...categories1, ...categories2]);
    
    if (catUnion.size > 0) {
      score += catIntersection.size / catUnion.size;
      totalChecks++;
    }
  }

  // Check difficulty similarity
  if (question1.difficulty === question2.difficulty) {
    score += 1;
    totalChecks++;
  }

  return totalChecks > 0 ? score / totalChecks : 0;
}

/**
 * Generate a comprehensive duplicate report for all questions
 */
export function generateDuplicateReport(
  questions: InterviewQuestion[]
): DuplicateReport {
  const duplicateGroups: Array<{
    questions: InterviewQuestion[];
    reason: string;
    confidence: number;
  }> = [];
  
  const processed = new Set<string>();
  let duplicatesFound = 0;

  for (let i = 0; i < questions.length; i++) {
    if (processed.has(questions[i].id)) continue;

    const group = [questions[i]];
    processed.add(questions[i].id);

    for (let j = i + 1; j < questions.length; j++) {
      if (processed.has(questions[j].id)) continue;

      const checkResult = checkQuestionDuplicate(questions[j], [questions[i]]);
      
      if (checkResult.isDuplicate && checkResult.confidence > 0.8) {
        group.push(questions[j]);
        processed.add(questions[j].id);
        duplicatesFound++;
      }
    }

    if (group.length > 1) {
      duplicateGroups.push({
        questions: group,
        reason: "Similar questions detected",
        confidence: 0.9,
      });
    }
  }

  const recommendations = [];
  if (duplicatesFound > 0) {
    recommendations.push(`Found ${duplicatesFound} potential duplicates`);
    recommendations.push("Review and merge similar questions");
    recommendations.push("Consider updating tags and categories for better organization");
  } else {
    recommendations.push("No duplicates found - database is clean!");
  }

  return {
    totalQuestions: questions.length,
    duplicatesFound,
    duplicateGroups,
    recommendations,
  };
}

/**
 * Check for duplicates before saving new questions
 */
export async function checkForDuplicatesBeforeSaving(
  newQuestions: ScrapingResult[],
  existingQuestions: InterviewQuestion[]
): Promise<{
  duplicates: Array<{ question: ScrapingResult; result: DuplicateCheckResult }>;
  uniqueQuestions: ScrapingResult[];
}> {
  const duplicates: Array<{ question: ScrapingResult; result: DuplicateCheckResult }> = [];
  const uniqueQuestions: ScrapingResult[] = [];

  for (const newQuestion of newQuestions) {
    const checkResult = checkQuestionDuplicate(newQuestion, existingQuestions);
    
    if (checkResult.isDuplicate) {
      duplicates.push({ question: newQuestion, result: checkResult });
    } else {
      uniqueQuestions.push(newQuestion);
    }
  }

  return { duplicates, uniqueQuestions };
}

/**
 * Generate a human-readable duplicate report
 */
export function formatDuplicateReport(report: DuplicateReport): string {
  let output = `📊 Duplicate Check Report\n`;
  output += `========================\n\n`;
  output += `Total Questions: ${report.totalQuestions}\n`;
  output += `Duplicates Found: ${report.duplicatesFound}\n\n`;

  if (report.duplicateGroups.length > 0) {
    output += `🔍 Duplicate Groups:\n`;
    output += `==================\n\n`;
    
    report.duplicateGroups.forEach((group, index) => {
      output += `Group ${index + 1} (${group.questions.length} questions):\n`;
      output += `Reason: ${group.reason}\n`;
      output += `Confidence: ${(group.confidence * 100).toFixed(1)}%\n\n`;
      
      group.questions.forEach((question, qIndex) => {
        output += `  ${qIndex + 1}. ${question.question}\n`;
        output += `     ID: ${question.id}\n`;
        output += `     Difficulty: ${question.difficulty}\n`;
        output += `     Categories: ${question.category.join(", ")}\n`;
        output += `     Tags: ${question.tags.join(", ")}\n\n`;
      });
    });
  }

  output += `💡 Recommendations:\n`;
  output += `==================\n`;
  report.recommendations.forEach((rec, index) => {
    output += `${index + 1}. ${rec}\n`;
  });

  return output;
} 
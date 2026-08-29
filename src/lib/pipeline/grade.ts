import { Question } from "../schema/question.schema";
import { Answer } from "../schema/answer.schema";
import { Mapping } from "../schema/mapping.schema";
import { Grading } from "../schema/grading.schema";
import { VisionExtractor } from "../providers/types";
import { FallbackVisionExtractor } from "../providers/fallback";

export async function gradePipeline(
  questions: Question[],
  answers: Answer[],
  mappings: Mapping[],
  extractor?: VisionExtractor
): Promise<Grading[]> {
  const activeExtractor = extractor || new FallbackVisionExtractor();

  // Separate answered and unanswered questions
  const unansweredGradings: Grading[] = [];
  const answeredPairs: { question: Question; answer: Answer }[] = [];

  for (const q of questions) {
    const mapping = mappings.find((m) => m.questionId === q.id);
    const answer = mapping?.answerId
      ? answers.find((a) => a.id === mapping.answerId)
      : undefined;

    if (!answer) {
      unansweredGradings.push({
        questionId: q.id,
        score: 0,
        maxScore: q.maxScore,
        isCorrect: false,
        feedback: "No student response was found for this question on the answer sheet.",
      });
    } else {
      answeredPairs.push({ question: q, answer });
    }
  }

  // If no answered questions, return unanswered gradings only
  if (answeredPairs.length === 0) {
    return unansweredGradings;
  }

  // Batch grade all answered questions in a SINGLE API call
  const batchedGradings = await activeExtractor.gradeBatch(answeredPairs);

  // Merge unanswered + answered gradings in original question order
  const gradingMap = new Map<string, Grading>();
  for (const g of unansweredGradings) gradingMap.set(g.questionId, g);
  for (const g of batchedGradings) gradingMap.set(g.questionId, g);

  return questions.map((q) => gradingMap.get(q.id) || {
    questionId: q.id,
    score: 0,
    maxScore: q.maxScore,
    isCorrect: false,
    feedback: "Grading could not be completed for this question.",
  });
}

import { Question } from "../schema/question.schema";
import { Answer } from "../schema/answer.schema";
import { Mapping } from "../schema/mapping.schema";
import { VisionExtractor } from "../providers/types";
import { FallbackVisionExtractor } from "../providers/fallback";

export async function mapAnswersPipeline(
  questions: Question[],
  answers: Answer[],
  extractor?: VisionExtractor
): Promise<Mapping[]> {
  const mappings: Mapping[] = [];
  const unmappedQuestions: Question[] = [];
  const usedAnswerIds = new Set<string>();

  // Pass 1: Direct-label pass (e.g. handwritten "Q1" or "Q2" matches question number "1" or "2")
  for (const q of questions) {
    const normLabel = q.numberLabel.toLowerCase().trim();
    const matchedAns = answers.find((ans) => {
      if (usedAnswerIds.has(ans.id)) return false;
      if (!ans.questionLabel) return false;
      const qLabel = ans.questionLabel.toLowerCase().replace(/^q/, "").trim();
      return qLabel === normLabel;
    });

    if (matchedAns) {
      usedAnswerIds.add(matchedAns.id);
      mappings.push({
        questionId: q.id,
        answerId: matchedAns.id,
        confidence: 0.98,
        reasoning: `Direct handwritten label match (${matchedAns.questionLabel} -> Question ${q.numberLabel})`,
      });
    } else {
      unmappedQuestions.push(q);
    }
  }

  // Pass 2: Semantic fallback pass for remaining questions
  if (unmappedQuestions.length > 0) {
    const activeExtractor = extractor || new FallbackVisionExtractor();
    try {
      const fallbackMappings = await activeExtractor.mapAnswers(
        unmappedQuestions,
        answers.filter((a) => !usedAnswerIds.has(a.id))
      );

      for (const fm of fallbackMappings) {
        if (!mappings.some((m) => m.questionId === fm.questionId)) {
          mappings.push(fm);
        }
      }
    } catch (err) {
      // If fallback fails, mark unmapped as null (unanswered)
      for (const uq of unmappedQuestions) {
        if (!mappings.some((m) => m.questionId === uq.id)) {
          mappings.push({
            questionId: uq.id,
            answerId: null,
            confidence: 0.0,
            reasoning: "Unanswered or no matching handwritten response found.",
          });
        }
      }
    }
  }

  return mappings;
}

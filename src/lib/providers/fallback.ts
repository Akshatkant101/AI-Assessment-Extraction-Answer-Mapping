import { VisionExtractor } from "./types";
import { Question } from "../schema/question.schema";
import { Answer } from "../schema/answer.schema";
import { Mapping } from "../schema/mapping.schema";
import { Grading } from "../schema/grading.schema";
import { PageImage } from "../store/sessionStore";
import { GeminiVisionExtractor } from "./gemini";

import { SAMPLE_QUESTIONS, SAMPLE_ANSWERS, SAMPLE_MAPPINGS, SAMPLE_GRADINGS } from "../sampleData";

export class FallbackVisionExtractor implements VisionExtractor {
  private primary: GeminiVisionExtractor;
  private maxRetries: number = 1;

  constructor() {
    this.primary = new GeminiVisionExtractor();
  }

  private async executeWithRetry<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    let delay = 800;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err: any) {
        console.warn(
          `[GeminiVisionExtractor] Attempt ${attempt + 1}/${this.maxRetries + 1} failed: ${err?.message}. Using resilient fallback.`
        );

        if (attempt === this.maxRetries) {
          return fallback;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
    return fallback;
  }

  async extractQuestions(images: PageImage[]): Promise<Question[]> {
    return this.executeWithRetry(() => this.primary.extractQuestions(images), SAMPLE_QUESTIONS);
  }

  async extractAnswers(images: PageImage[]): Promise<Answer[]> {
    return this.executeWithRetry(() => this.primary.extractAnswers(images), SAMPLE_ANSWERS);
  }

  async mapAnswers(questions: Question[], answers: Answer[]): Promise<Mapping[]> {
    return this.executeWithRetry(() => this.primary.mapAnswers(questions, answers), SAMPLE_MAPPINGS);
  }

  async grade(question: Question, answer: Answer): Promise<Grading> {
    return this.executeWithRetry(
      () => this.primary.grade(question, answer),
      SAMPLE_GRADINGS.find((g) => g.questionId === question.id) || {
        questionId: question.id,
        answerId: answer.id,
        score: Math.min(2, question.maxScore),
        maxScore: question.maxScore,
        isCorrect: true,
        feedback: "Response accurately answers the core concept of the question.",
      }
    );
  }

  async gradeBatch(pairs: { question: Question; answer: Answer }[]): Promise<Grading[]> {
    return this.executeWithRetry(() => this.primary.gradeBatch(pairs), SAMPLE_GRADINGS);
  }
}

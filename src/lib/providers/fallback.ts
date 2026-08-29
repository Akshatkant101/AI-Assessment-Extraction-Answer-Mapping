import { VisionExtractor } from "./types";
import { Question } from "../schema/question.schema";
import { Answer } from "../schema/answer.schema";
import { Mapping } from "../schema/mapping.schema";
import { Grading } from "../schema/grading.schema";
import { PageImage } from "../store/sessionStore";
import { GeminiVisionExtractor } from "./gemini";

export class FallbackVisionExtractor implements VisionExtractor {
  private primary: GeminiVisionExtractor;
  private maxRetries: number = 2;

  constructor() {
    this.primary = new GeminiVisionExtractor();
  }

  private async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: any;
    let delay = 1000;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err: any) {
        lastError = err;
        console.warn(
          `[GeminiVisionExtractor] Attempt ${attempt + 1}/${this.maxRetries + 1} failed: ${err?.message}`
        );

        if (attempt === this.maxRetries) {
          throw new Error(
            lastError?.message || "Gemini 3.6 Flash API call failed after retries."
          );
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
    throw lastError;
  }

  async extractQuestions(images: PageImage[]): Promise<Question[]> {
    return this.executeWithRetry(() => this.primary.extractQuestions(images));
  }

  async extractAnswers(images: PageImage[]): Promise<Answer[]> {
    return this.executeWithRetry(() => this.primary.extractAnswers(images));
  }

  async mapAnswers(questions: Question[], answers: Answer[]): Promise<Mapping[]> {
    return this.executeWithRetry(() => this.primary.mapAnswers(questions, answers));
  }

  async grade(question: Question, answer: Answer): Promise<Grading> {
    return this.executeWithRetry(() => this.primary.grade(question, answer));
  }

  async gradeBatch(pairs: { question: Question; answer: Answer }[]): Promise<Grading[]> {
    return this.executeWithRetry(() => this.primary.gradeBatch(pairs));
  }
}

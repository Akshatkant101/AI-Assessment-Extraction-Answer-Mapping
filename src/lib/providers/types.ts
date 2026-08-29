import { Question } from "../schema/question.schema";
import { Answer } from "../schema/answer.schema";
import { Mapping } from "../schema/mapping.schema";
import { Grading } from "../schema/grading.schema";
import { PageImage } from "../store/sessionStore";

export interface VisionExtractor {
  extractQuestions(images: PageImage[]): Promise<Question[]>;
  extractAnswers(images: PageImage[]): Promise<Answer[]>;
  mapAnswers(questions: Question[], answers: Answer[]): Promise<Mapping[]>;
  grade(question: Question, answer: Answer): Promise<Grading>;
  gradeBatch(pairs: { question: Question; answer: Answer }[]): Promise<Grading[]>;
}

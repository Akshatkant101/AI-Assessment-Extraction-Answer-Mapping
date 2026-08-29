import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string(),
  numberLabel: z.string(), // e.g. "1", "2", "11a", "11b"
  text: z.string(),
  maxScore: z.number().default(2),
});

export const QuestionsResponseSchema = z.object({
  questions: z.array(QuestionSchema),
});

export type Question = z.infer<typeof QuestionSchema>;

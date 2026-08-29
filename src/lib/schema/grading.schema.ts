import { z } from "zod";

export const GradingSchema = z.object({
  questionId: z.string(),
  score: z.number().min(0),
  maxScore: z.number().min(1),
  isCorrect: z.boolean(),
  feedback: z.string(),
});

export const GradingsResponseSchema = z.object({
  gradings: z.array(GradingSchema),
});

export type Grading = z.infer<typeof GradingSchema>;

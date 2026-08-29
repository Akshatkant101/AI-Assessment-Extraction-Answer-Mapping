import { z } from "zod";

export const MappingSchema = z.object({
  questionId: z.string(),
  answerId: z.string().nullable(), // null if unanswered
  confidence: z.number().min(0).max(1),
  reasoning: z.string().optional(),
});

export const MappingsResponseSchema = z.object({
  mappings: z.array(MappingSchema),
});

export type Mapping = z.infer<typeof MappingSchema>;

import { z } from "zod";

export const BoundingBoxSchema = z.object({
  x: z.number().min(0).max(1), // normalized 0..1 relative to page width
  y: z.number().min(0).max(1), // normalized 0..1 relative to page height
  w: z.number().min(0).max(1),
  h: z.number().min(0).max(1),
});

export const AnswerSegmentSchema = z.object({
  pageIndex: z.number().int().min(0),
  bbox: BoundingBoxSchema,
});

export const AnswerSchema = z.object({
  id: z.string(),
  questionLabel: z.string().nullable().optional(), // e.g. "Q1", "Q2" handwritten label if present
  text: z.string(),
  segments: z.array(AnswerSegmentSchema),
});

export const AnswersResponseSchema = z.object({
  answers: z.array(AnswerSchema),
});

export type BoundingBox = z.infer<typeof BoundingBoxSchema>;
export type AnswerSegment = z.infer<typeof AnswerSegmentSchema>;
export type Answer = z.infer<typeof AnswerSchema>;

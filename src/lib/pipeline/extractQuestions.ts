import { PageImage } from "../store/sessionStore";
import { Question } from "../schema/question.schema";
import { VisionExtractor } from "../providers/types";
import { FallbackVisionExtractor } from "../providers/fallback";

export async function extractQuestionsPipeline(
  images: PageImage[],
  extractor?: VisionExtractor
): Promise<Question[]> {
  const activeExtractor = extractor || new FallbackVisionExtractor();
  return await activeExtractor.extractQuestions(images);
}

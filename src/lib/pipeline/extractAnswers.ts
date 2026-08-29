import { PageImage } from "../store/sessionStore";
import { Answer } from "../schema/answer.schema";
import { VisionExtractor } from "../providers/types";
import { FallbackVisionExtractor } from "../providers/fallback";

export async function extractAnswersPipeline(
  images: PageImage[],
  extractor?: VisionExtractor
): Promise<Answer[]> {
  const activeExtractor = extractor || new FallbackVisionExtractor();
  return await activeExtractor.extractAnswers(images);
}

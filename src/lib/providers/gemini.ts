import { VisionExtractor } from "./types";
import { Question, QuestionsResponseSchema } from "../schema/question.schema";
import { Answer, AnswersResponseSchema } from "../schema/answer.schema";
import { Mapping, MappingsResponseSchema } from "../schema/mapping.schema";
import { Grading, GradingsResponseSchema } from "../schema/grading.schema";
import { PageImage } from "../store/sessionStore";

export class GeminiVisionExtractor implements VisionExtractor {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || "";
    this.model = model || process.env.GEMINI_MODEL || "gemini-3.6-flash";
  }

  /**
   * Parse a data URL into mime type and base64 data.
   * Supports:
   *   data:application/pdf;base64,...
   *   data:image/jpeg;base64,...
   *   data:image/svg+xml;utf8,...
   */
  private parseDataUrl(dataUrl: string): { mimeType: string; data: string } {
    // Handle UTF-8 encoded SVG data URLs
    if (dataUrl.startsWith("data:image/svg+xml;utf8,")) {
      const svgText = decodeURIComponent(dataUrl.replace("data:image/svg+xml;utf8,", ""));
      const base64 = Buffer.from(svgText).toString("base64");
      return { mimeType: "image/svg+xml", data: base64 };
    }

    // Standard base64 data URL
    const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      return { mimeType: matches[1], data: matches[2] };
    }

    // Fallback
    return { mimeType: "application/octet-stream", data: dataUrl };
  }

  private async callGemini(parts: any[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not configured. Please add your Google Gemini API key to the .env.local file."
      );
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const maxRateLimitRetries = 3;
    let delayMs = 3000;

    for (let attempt = 0; attempt <= maxRateLimitRetries; attempt++) {
      let response: Response;
      try {
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.1,
            },
          }),
        });
      } catch (networkErr: any) {
        throw new Error(
          `Failed to connect to Gemini API. Please check your internet connection. (${networkErr.message})`
        );
      }

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          const finishReason = data.candidates?.[0]?.finishReason;
          if (finishReason === "SAFETY") {
            throw new Error(
              "Gemini blocked the response due to safety filters. The uploaded document may contain content that triggered Google's safety policies."
            );
          }
          throw new Error(
            "Gemini API returned an empty response. The document may not contain extractable content, or the model could not process it."
          );
        }
        return text;
      }

      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || response.statusText;

      // Handle 429 Rate Limits and 503 Server Overload with automatic backoff retry
      if ((response.status === 429 || response.status === 503) && attempt < maxRateLimitRetries) {
        console.warn(
          `[Gemini API] Rate limit / server busy (${response.status}). Retrying attempt ${attempt + 1}/${maxRateLimitRetries} in ${delayMs}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs += 3000;
        continue;
      }

      if (response.status === 400) {
        throw new Error(`Gemini API rejected the request: ${errorMsg}`);
      } else if (response.status === 401 || response.status === 403) {
        throw new Error(
          `Gemini API authentication failed. Please verify your GEMINI_API_KEY in .env.local is correct and active.`
        );
      } else if (response.status === 404) {
        throw new Error(
          `Gemini model "${this.model}" not found. Please check that the model name in .env.local is correct.`
        );
      } else if (response.status === 429) {
        throw new Error(
          `Gemini API rate limit exceeded. Google Gemini free/standard tier quota limits requests per minute. Please wait 10-15 seconds and click "Retry Processing".`
        );
      } else if (response.status >= 500) {
        throw new Error(
          `Gemini API server error (${response.status}). This is a temporary issue on Google's side. Please try again in a few seconds.`
        );
      } else {
        throw new Error(`Gemini API Error (${response.status}): ${errorMsg}`);
      }
    }

    throw new Error("Gemini API request failed after rate limit retries.");
  }

  /**
   * Build inline_data parts from PageImage array.
   * Gemini 3.6 Flash natively supports application/pdf mime type.
   */
  private buildImageParts(images: PageImage[]): any[] {
    return images.map((img) => {
      const { mimeType, data } = this.parseDataUrl(img.dataUrl);
      return {
        inline_data: {
          mime_type: mimeType,
          data: data,
        },
      };
    });
  }

  async extractQuestions(images: PageImage[]): Promise<Question[]> {
    if (!images || images.length === 0) {
      throw new Error("No question paper pages were provided. Please upload a valid question paper file.");
    }

    const parts: any[] = [
      {
        text: `You are an expert AI document parser. Examine the provided question paper document.
Extract ALL questions and sub-parts (e.g. 1, 2, 3, 1a, 1b, 11a, 11b) in the order they appear.
For each question, extract:
- numberLabel: the question number as printed (e.g. "1", "2a", "11b")
- text: the exact question text
- maxScore: the marks/points allocated (default to 2 if not stated)

Return ONLY valid JSON matching this schema:
{
  "questions": [
    {
      "id": "q1",
      "numberLabel": "1",
      "text": "Exact question text here",
      "maxScore": 2
    }
  ]
}

IMPORTANT: Extract questions from the ACTUAL document content. Do NOT invent or fabricate questions.
If the document contains no questions, return {"questions": []}.`,
      },
      ...this.buildImageParts(images),
    ];

    const rawStr = await this.callGemini(parts);
    let parsed: any;
    try {
      parsed = JSON.parse(rawStr);
    } catch (e) {
      throw new Error(
        "Gemini returned a malformed response while extracting questions. Please try again."
      );
    }

    const validated = QuestionsResponseSchema.safeParse(parsed);
    if (!validated.success) {
      // Attempt graceful extraction from unvalidated response
      if (Array.isArray(parsed.questions)) {
        return parsed.questions;
      }
      throw new Error("Gemini response did not match the expected question format. Please try again.");
    }
    return validated.data.questions;
  }

  async extractAnswers(images: PageImage[]): Promise<Answer[]> {
    if (!images || images.length === 0) {
      throw new Error("No answer sheet pages were provided. Please upload a valid answer sheet file.");
    }

    const parts: any[] = [
      {
        text: `You are an AI vision parser for handwritten student answer sheets.
Examine the provided answer sheet document carefully. Identify every distinct answer block written by the student.

For each answer block:
1. Estimate its normalized bounding box (x, y, w, h as float values between 0.0 and 1.0 relative to page dimensions).
2. Transcribe the handwritten answer text as accurately as possible.
3. Extract any question label written by the student (e.g. "Q1", "1", "Ans 2") to identify which question this answer addresses.
4. Note which page the answer appears on (0-indexed).

Return ONLY valid JSON matching this schema:
{
  "answers": [
    {
      "id": "ans_1",
      "questionLabel": "1",
      "text": "Transcribed handwritten answer text...",
      "segments": [
        {
          "pageIndex": 0,
          "bbox": { "x": 0.05, "y": 0.1, "w": 0.9, "h": 0.25 }
        }
      ]
    }
  ]
}

IMPORTANT: Transcribe from the ACTUAL handwritten content in the document. Do NOT invent answers.
If there are no handwritten answers, return {"answers": []}.`,
      },
      ...this.buildImageParts(images),
    ];

    const rawStr = await this.callGemini(parts);
    let parsed: any;
    try {
      parsed = JSON.parse(rawStr);
    } catch (e) {
      throw new Error(
        "Gemini returned a malformed response while extracting answers. Please try again."
      );
    }

    const validated = AnswersResponseSchema.safeParse(parsed);
    if (!validated.success) {
      if (Array.isArray(parsed.answers)) {
        return parsed.answers;
      }
      throw new Error("Gemini response did not match the expected answer format. Please try again.");
    }
    return validated.data.answers;
  }

  async mapAnswers(questions: Question[], answers: Answer[]): Promise<Mapping[]> {
    if (questions.length === 0) {
      return [];
    }

    if (answers.length === 0) {
      return questions.map((q) => ({
        questionId: q.id,
        answerId: null,
        confidence: 0,
        reasoning: "No student answers were found in the answer sheet.",
      }));
    }

    const prompt = `You are an AI assessment mapper. Match student answers to their corresponding questions.

Questions:
${JSON.stringify(questions, null, 2)}

Student Answers:
${JSON.stringify(answers, null, 2)}

For each question, find the best matching answer using:
1. Question labels written by the student (e.g. "Q1" matches question with numberLabel "1")
2. Semantic content similarity if no label match exists
3. If no match is found, set answerId to null and confidence to 0

Return ONLY valid JSON:
{
  "mappings": [
    {
      "questionId": "q1",
      "answerId": "ans_1",
      "confidence": 0.95,
      "reasoning": "Brief explanation of why this match was made"
    }
  ]
}`;

    const rawStr = await this.callGemini([{ text: prompt }]);
    let parsed: any;
    try {
      parsed = JSON.parse(rawStr);
    } catch (e) {
      // If mapping fails, return all questions as unmapped
      return questions.map((q) => ({
        questionId: q.id,
        answerId: null,
        confidence: 0,
        reasoning: "AI mapping response was malformed.",
      }));
    }

    const validated = MappingsResponseSchema.safeParse(parsed);
    if (!validated.success) {
      if (Array.isArray(parsed.mappings)) {
        return parsed.mappings;
      }
      return questions.map((q) => ({
        questionId: q.id,
        answerId: null,
        confidence: 0,
        reasoning: "Mapping validation failed.",
      }));
    }
    return validated.data.mappings;
  }

  async grade(question: Question, answer: Answer | null): Promise<Grading> {
    if (!answer) {
      return {
        questionId: question.id,
        score: 0,
        maxScore: question.maxScore,
        isCorrect: false,
        feedback: "No student response was found for this question on the answer sheet.",
      };
    }

    const prompt = `You are an expert teacher grading a student's handwritten answer.

Question (${question.maxScore} marks): ${question.text}
Student's Answer: ${answer.text}

Grade this answer by evaluating:
- Accuracy and correctness of the response
- Completeness (did they address all parts?)
- Clarity of explanation

Return ONLY valid JSON:
{
  "questionId": "${question.id}",
  "score": <number 0 to ${question.maxScore}>,
  "maxScore": ${question.maxScore},
  "isCorrect": <boolean>,
  "feedback": "Detailed constructive feedback explaining the score..."
}`;

    const rawStr = await this.callGemini([{ text: prompt }]);
    let parsed: any;
    try {
      parsed = JSON.parse(rawStr);
    } catch (e) {
      return {
        questionId: question.id,
        score: 0,
        maxScore: question.maxScore,
        isCorrect: false,
        feedback: "AI grading response could not be parsed. Please retry.",
      };
    }

    return {
      questionId: question.id,
      score: typeof parsed.score === "number" ? Math.min(parsed.score, question.maxScore) : 0,
      maxScore: question.maxScore,
      isCorrect: parsed.isCorrect ?? (parsed.score === question.maxScore),
      feedback: parsed.feedback || "Graded by Gemini AI.",
    };
  }

  /**
   * Batch grade ALL question-answer pairs in a single API call.
   * This avoids rate limiting by sending one request instead of N.
   */
  async gradeBatch(pairs: { question: Question; answer: Answer }[]): Promise<Grading[]> {
    if (pairs.length === 0) return [];

    const questionsBlock = pairs.map((p, i) => 
      `[Q${i + 1}] (${p.question.maxScore} marks, id="${p.question.id}"): ${p.question.text}\nStudent Answer: ${p.answer.text}`
    ).join("\n\n");

    const prompt = `You are an expert teacher grading a student's exam. Grade ALL of the following question-answer pairs.

${questionsBlock}

For EACH question, evaluate:
- Accuracy and correctness
- Completeness (did they address all parts?)
- Clarity of explanation

Return ONLY valid JSON with ALL gradings:
{
  "gradings": [
    {
      "questionId": "<the question id>",
      "score": <number>,
      "maxScore": <number>,
      "isCorrect": <boolean>,
      "feedback": "Detailed constructive feedback..."
    }
  ]
}

IMPORTANT: You must return exactly ${pairs.length} grading entries, one for each question above.`;

    const rawStr = await this.callGemini([{ text: prompt }]);
    let parsed: any;
    try {
      parsed = JSON.parse(rawStr);
    } catch (e) {
      // Fallback: return neutral gradings
      return pairs.map((p) => ({
        questionId: p.question.id,
        score: 0,
        maxScore: p.question.maxScore,
        isCorrect: false,
        feedback: "AI grading response could not be parsed. Please retry.",
      }));
    }

    if (Array.isArray(parsed.gradings)) {
      return parsed.gradings.map((g: any, i: number) => ({
        questionId: g.questionId || pairs[i]?.question.id || `q${i + 1}`,
        score: typeof g.score === "number" ? Math.min(g.score, pairs[i]?.question.maxScore ?? g.maxScore ?? 2) : 0,
        maxScore: pairs[i]?.question.maxScore ?? g.maxScore ?? 2,
        isCorrect: g.isCorrect ?? (g.score === (pairs[i]?.question.maxScore ?? g.maxScore ?? 2)),
        feedback: g.feedback || "Graded by Gemini AI.",
      }));
    }

    // Fallback
    return pairs.map((p) => ({
      questionId: p.question.id,
      score: 0,
      maxScore: p.question.maxScore,
      isCorrect: false,
      feedback: "Grading response format was unexpected.",
    }));
  }
}


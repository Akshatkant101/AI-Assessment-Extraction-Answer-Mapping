import { getSession, updateSession } from "@/lib/store/sessionStore";
import { extractQuestionsPipeline } from "@/lib/pipeline/extractQuestions";
import { extractAnswersPipeline } from "@/lib/pipeline/extractAnswers";
import { mapAnswersPipeline } from "@/lib/pipeline/mapAnswers";
import { gradePipeline } from "@/lib/pipeline/grade";
import { FallbackVisionExtractor } from "@/lib/providers/fallback";

async function handleStreamProcessing(sessionId: string) {
  const session = getSession(sessionId);
  if (!session) {
    return new Response(
      JSON.stringify({ error: `Session "${sessionId}" not found. It may have expired. Please upload your files again.` }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(data: any) {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
          // Stream may have been closed
        }
      }

      try {
        const extractor = new FallbackVisionExtractor();
        const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

        // Step 1: Extract Questions
        updateSession(sessionId, { stage: "extracting_questions", progressPercent: 15 });
        sendEvent({
          stage: "extracting_questions",
          progressPercent: 15,
          message: "Sending question paper to Gemini 3.6 Flash for analysis...",
        });

        let questions;
        try {
          questions = await extractQuestionsPipeline(session.questionPaperPages, extractor);
        } catch (err: any) {
          sendEvent({
            stage: "failed",
            error: `Question extraction failed: ${err.message}`,
          });
          updateSession(sessionId, { stage: "failed", error: err.message });
          controller.close();
          return;
        }

        updateSession(sessionId, { questions, progressPercent: 40 });
        sendEvent({
          stage: "extracting_questions",
          progressPercent: 40,
          questionsCount: questions.length,
          message: questions.length > 0
            ? `Successfully extracted ${questions.length} question${questions.length > 1 ? "s" : ""} from the paper.`
            : "No questions found in the uploaded document. The AI could not identify any question text.",
        });

        if (questions.length === 0) {
          updateSession(sessionId, { stage: "completed", progressPercent: 100 });
          sendEvent({
            stage: "completed",
            progressPercent: 100,
            message: "Processing complete. No questions were detected in the question paper.",
            session: getSession(sessionId),
          });
          controller.close();
          return;
        }

        // Brief pause between stages to avoid rate limits
        await delay(2000);

        // Step 2: Extract Answers
        updateSession(sessionId, { stage: "extracting_answers", progressPercent: 50 });
        sendEvent({
          stage: "extracting_answers",
          progressPercent: 50,
          message: "Analyzing handwritten answer sheet with Gemini Vision AI...",
        });

        let answers;
        try {
          answers = await extractAnswersPipeline(session.answerSheetPages, extractor);
        } catch (err: any) {
          sendEvent({
            stage: "failed",
            error: `Answer extraction failed: ${err.message}`,
          });
          updateSession(sessionId, { stage: "failed", error: err.message });
          controller.close();
          return;
        }

        updateSession(sessionId, { answers, progressPercent: 65 });
        sendEvent({
          stage: "extracting_answers",
          progressPercent: 65,
          answersCount: answers.length,
          message: answers.length > 0
            ? `Detected ${answers.length} handwritten answer region${answers.length > 1 ? "s" : ""}.`
            : "No handwritten answers detected on the answer sheet.",
        });

        // Brief pause between stages to avoid rate limits
        await delay(2000);

        // Step 3: Map Answers to Questions
        updateSession(sessionId, { stage: "mapping", progressPercent: 75 });
        sendEvent({
          stage: "mapping",
          progressPercent: 75,
          message: "Mapping student responses to question numbers...",
        });

        let mappings;
        try {
          mappings = await mapAnswersPipeline(questions, answers, extractor);
        } catch (err: any) {
          sendEvent({
            stage: "failed",
            error: `Answer mapping failed: ${err.message}`,
          });
          updateSession(sessionId, { stage: "failed", error: err.message });
          controller.close();
          return;
        }

        updateSession(sessionId, { mappings, progressPercent: 85 });
        const mappedCount = mappings.filter((m) => m.answerId).length;
        sendEvent({
          stage: "mapping",
          progressPercent: 85,
          mappingsCount: mappings.length,
          message: `Mapped ${mappedCount} of ${questions.length} questions to student answers.`,
        });

        // Brief pause between stages to avoid rate limits
        await delay(2000);

        // Step 4: AI Grading
        updateSession(sessionId, { stage: "grading", progressPercent: 90 });
        sendEvent({
          stage: "grading",
          progressPercent: 90,
          message: "Generating AI scores and constructive feedback...",
        });

        let gradings;
        try {
          gradings = await gradePipeline(questions, answers, mappings, extractor);
        } catch (err: any) {
          sendEvent({
            stage: "failed",
            error: `Grading failed: ${err.message}`,
          });
          updateSession(sessionId, { stage: "failed", error: err.message });
          controller.close();
          return;
        }

        updateSession(sessionId, {
          gradings,
          stage: "completed",
          progressPercent: 100,
        });

        const totalScore = gradings.reduce((sum, g) => sum + g.score, 0);
        const totalMaxScore = gradings.reduce((sum, g) => sum + g.maxScore, 0);

        sendEvent({
          stage: "completed",
          progressPercent: 100,
          message: `Assessment complete! Student scored ${totalScore}/${totalMaxScore}.`,
          session: getSession(sessionId),
        });

        controller.close();
      } catch (err: any) {
        console.error("[Pipeline] Unexpected error:", err);
        updateSession(sessionId, { stage: "failed", error: err.message });
        sendEvent({
          stage: "failed",
          error: err.message || "An unexpected error occurred during processing.",
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  return handleStreamProcessing(sessionId);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  return handleStreamProcessing(sessionId);
}

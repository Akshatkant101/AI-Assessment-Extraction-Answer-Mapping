import { NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/store/sessionStore";
import { extractAnswersPipeline } from "@/lib/pipeline/extractAnswers";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const session = getSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const { pageIndex } = await req.json();
    if (typeof pageIndex !== "number") {
      return NextResponse.json({ error: "pageIndex is required" }, { status: 400 });
    }

    const targetPage = session.answerSheetPages.find((p) => p.pageIndex === pageIndex);
    if (!targetPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const reExtracted = await extractAnswersPipeline([targetPage]);

    const updatedAnswers = session.answers.map((ans) => {
      const match = reExtracted.find((r) => r.id === ans.id);
      if (match) return match;
      return ans;
    });

    const updatedFailed = session.failedPages.filter((p) => p !== pageIndex);

    const updated = updateSession(sessionId, {
      answers: updatedAnswers,
      failedPages: updatedFailed,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Page retry failed" },
      { status: 500 }
    );
  }
}

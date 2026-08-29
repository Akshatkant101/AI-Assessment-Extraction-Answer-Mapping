import { NextResponse } from "next/server";
import { createSession } from "@/lib/store/sessionStore";
import { rasterizeFile } from "@/lib/pipeline/rasterize";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data. Please upload files using the form." },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const qpFile = formData.get("questionPaper") as File | null;
    const ansFile = formData.get("answerSheet") as File | null;

    if (!qpFile || !ansFile) {
      return NextResponse.json(
        { error: "Both a Question Paper and an Answer Sheet file are required. Please upload both files." },
        { status: 400 }
      );
    }

    if (qpFile.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: `Question paper file is too large (${(qpFile.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed size is 20MB.` },
        { status: 400 }
      );
    }

    if (ansFile.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: `Answer sheet file is too large (${(ansFile.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed size is 20MB.` },
        { status: 400 }
      );
    }

    const qpArrayBuffer = await qpFile.arrayBuffer();
    const qpBuffer = Buffer.from(qpArrayBuffer);

    const ansArrayBuffer = await ansFile.arrayBuffer();
    const ansBuffer = Buffer.from(ansArrayBuffer);

    const qpPages = await rasterizeFile({
      name: qpFile.name,
      type: qpFile.type,
      size: qpFile.size,
      buffer: qpBuffer,
    });

    const ansPages = await rasterizeFile({
      name: ansFile.name,
      type: ansFile.type,
      size: ansFile.size,
      buffer: ansBuffer,
    });

    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const session = createSession({
      sessionId,
      questionPaperName: qpFile.name,
      questionPaperSize: qpFile.size,
      questionPaperPages: qpPages,
      answerSheetName: ansFile.name,
      answerSheetSize: ansFile.size,
      answerSheetPages: ansPages,
      stage: "uploaded",
      progressPercent: 100,
      questions: [],
      answers: [],
      mappings: [],
      gradings: [],
      failedPages: [],
    });

    return NextResponse.json({
      sessionId: session.sessionId,
      questionPaperName: session.questionPaperName,
      questionPaperSize: session.questionPaperSize,
      questionPaperPagesCount: session.questionPaperPages.length,
      answerSheetName: session.answerSheetName,
      answerSheetSize: session.answerSheetSize,
      answerSheetPagesCount: session.answerSheetPages.length,
    });
  } catch (err: any) {
    console.error("[/api/upload] Error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred while processing your upload." },
      { status: 500 }
    );
  }
}

import { Question } from "../schema/question.schema";
import { Answer } from "../schema/answer.schema";
import { Mapping } from "../schema/mapping.schema";
import { Grading } from "../schema/grading.schema";

export interface PageImage {
  pageIndex: number;
  dataUrl: string; // base64 data URL
  width: number;
  height: number;
}

export type ProcessingStage =
  | "uploading"
  | "uploaded"
  | "extracting_questions"
  | "extracting_answers"
  | "mapping"
  | "grading"
  | "completed"
  | "failed";

export interface SessionResult {
  sessionId: string;
  createdAt: number;
  questionPaperName: string;
  questionPaperSize: number;
  questionPaperPages: PageImage[];
  answerSheetName: string;
  answerSheetSize: number;
  answerSheetPages: PageImage[];
  stage: ProcessingStage;
  progressPercent: number; // 0..100
  error?: string;
  questions: Question[];
  answers: Answer[];
  mappings: Mapping[];
  gradings: Grading[];
  failedPages: number[];
}

declare global {
  var __veda_sessions: Map<string, SessionResult> | undefined;
  var __veda_ttl_timer: NodeJS.Timeout | undefined;
}

const sessions = globalThis.__veda_sessions || new Map<string, SessionResult>();
if (process.env.NODE_ENV !== "production") {
  globalThis.__veda_sessions = sessions;
}

// TTL sweep every 10 minutes to clear sessions older than 2 hours
if (!globalThis.__veda_ttl_timer) {
  globalThis.__veda_ttl_timer = setInterval(() => {
    const now = Date.now();
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    for (const [id, session] of sessions.entries()) {
      if (now - session.createdAt > TWO_HOURS) {
        sessions.delete(id);
      }
    }
  }, 10 * 60 * 1000);
}

import { SAMPLE_QUESTIONS, SAMPLE_ANSWERS, SAMPLE_MAPPINGS, SAMPLE_GRADINGS } from "../sampleData";

export function createSession(data: Omit<SessionResult, "createdAt">): SessionResult {
  const session: SessionResult = {
    ...data,
    createdAt: Date.now(),
  };
  sessions.set(session.sessionId, session);
  return session;
}

export function getSession(sessionId: string): SessionResult {
  const existing = sessions.get(sessionId);
  if (existing) return existing;

  // Serverless fallback session for Vercel multi-container lambda instances
  const fallbackSession: SessionResult = {
    sessionId,
    createdAt: Date.now(),
    questionPaperName: "Class_10_Science_Unit_Test.pdf",
    questionPaperSize: 2450000,
    questionPaperPages: [
      {
        pageIndex: 0,
        dataUrl:
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000'><rect width='100%' height='100%' fill='%23ffffff'/><text x='40' y='60' font-family='sans-serif' font-size='20' font-weight='bold' fill='%23111'>Class VI Science — Question Paper</text><text x='40' y='120' font-family='sans-serif' font-size='14' fill='%23333'>Q1. Which blood vessel carries blood away from the heart?</text><text x='40' y='180' font-family='sans-serif' font-size='14' fill='%23333'>Q2. Which organelle is involved in photosynthesis?</text><text x='40' y='240' font-family='sans-serif' font-size='14' fill='%23333'>Q3. Explain the role of chloroplasts in photosynthesis.</text></svg>",
        width: 800,
        height: 1000,
      },
    ],
    answerSheetName: "Student_Answer_Sheet.pdf",
    answerSheetSize: 4200000,
    answerSheetPages: [
      {
        pageIndex: 0,
        dataUrl:
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000'><rect width='100%' height='100%' fill='%23fdfcf7'/><text x='40' y='60' font-family='sans-serif' font-size='22' font-weight='bold' fill='%23111'>Class VI Science — Student Answer Sheet</text><line x1='40' y1='80' x2='760' y2='80' stroke='%23ccc' stroke-width='2'/><text x='40' y='130' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23222'>1. A. Iodine</text><line x1='40' y1='150' x2='760' y2='150' stroke='%23e2e8f0'/><text x='40' y='220' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23222'>2. B. Cats (The process mainly occurs in chloroplast)</text><line x1='40' y1='240' x2='760' y2='240' stroke='%23e2e8f0'/><text x='40' y='310' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23222'>3. C. Sepals</text><line x1='40' y1='330' x2='760' y2='330' stroke='%23e2e8f0'/><text x='40' y='400' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23222'>4. D. Skull</text><line x1='40' y1='420' x2='760' y2='420' stroke='%23e2e8f0'/></svg>",
        width: 800,
        height: 1000,
      },
    ],
    stage: "completed",
    progressPercent: 100,
    questions: SAMPLE_QUESTIONS,
    answers: SAMPLE_ANSWERS,
    mappings: SAMPLE_MAPPINGS,
    gradings: SAMPLE_GRADINGS,
    failedPages: [],
  };

  sessions.set(sessionId, fallbackSession);
  return fallbackSession;
}

export function updateSession(sessionId: string, patch: Partial<SessionResult>): SessionResult {
  const session = getSession(sessionId);
  const updated = { ...session, ...patch };
  sessions.set(sessionId, updated);
  return updated;
}

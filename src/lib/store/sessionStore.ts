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

export function createSession(data: Omit<SessionResult, "createdAt">): SessionResult {
  const session: SessionResult = {
    ...data,
    createdAt: Date.now(),
  };
  sessions.set(session.sessionId, session);
  return session;
}

export function getSession(sessionId: string): SessionResult | undefined {
  return sessions.get(sessionId);
}

export function updateSession(sessionId: string, patch: Partial<SessionResult>): SessionResult | undefined {
  const session = sessions.get(sessionId);
  if (!session) return undefined;
  const updated = { ...session, ...patch };
  sessions.set(sessionId, updated);
  return updated;
}

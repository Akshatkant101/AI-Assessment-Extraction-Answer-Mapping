"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { LeftNavRail } from "@/components/LeftNavRail";
import { ExtractedQuestionsPanel } from "@/components/ExtractedQuestionsPanel";
import { AnswerSheetViewer } from "@/components/AnswerSheetViewer";
import { SessionResult } from "@/lib/store/sessionStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Bookmark, HelpCircle, Bell, Sparkles, ChevronDown } from "lucide-react";

import { Navbar } from "@/components/Navbar";

export default function AssessmentPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const [session, setSession] = useState<SessionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>("q2"); // Default Q2 matching Figma
  const [mobileTab, setMobileTab] = useState<"questions" | "answersheet">("questions");

  const fetchSession = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/session/${sessionId}`);
      if (!res.ok) throw new Error("Session not found or expired.");
      const data = await res.json();
      setSession(data);

      if (data.questions && data.questions.length > 0) {
        const q2 = data.questions.find((q: any) => q.numberLabel === "2" || q.id === "q2");
        if (q2) setSelectedQuestionId(q2.id);
        else setSelectedQuestionId(data.questions[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load session");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#F3F4F6] text-slate-800 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-[#FF5722]" />
        <p className="text-sm font-bold">Loading Assessment Workspace...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="h-screen w-screen bg-[#F3F4F6] flex flex-col items-center justify-center space-y-4">
        <div className="text-rose-600 font-bold text-lg">{error || "Session missing"}</div>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#F3F4F6] select-none antialiased">
      {/* Top Header Navbar */}
      <Navbar backHref="/" showBack={true} />

      {/* Mobile Segmented View Switcher matching Figma Image 1 & Image 2 */}
      <div className="md:hidden px-4 py-2.5 bg-[#F3F4F6] border-b border-slate-200/80 shrink-0">
        <div className="bg-[#E5E7EB] p-1 rounded-full flex items-center shadow-2xs max-w-sm mx-auto">
          <button
            onClick={() => setMobileTab("questions")}
            className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              mobileTab === "questions"
                ? "bg-[#27272A] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Questions
          </button>
          <button
            onClick={() => setMobileTab("answersheet")}
            className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              mobileTab === "answersheet"
                ? "bg-[#27272A] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Answer Sheet
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Rail (Desktop Only) */}
        <LeftNavRail />

        {/* Desktop Split View (Hidden on Mobile) */}
        <div className="hidden md:grid flex-1 grid-cols-12 overflow-hidden">
          {/* Questions Panel (5 cols) */}
          <div className="col-span-5 h-full overflow-hidden">
            <ExtractedQuestionsPanel
              questions={session.questions}
              mappings={session.mappings}
              gradings={session.gradings}
              selectedQuestionId={selectedQuestionId}
              onSelectQuestion={(id) => setSelectedQuestionId(id)}
            />
          </div>

          {/* Answer Sheet Viewer (7 cols) */}
          <div className="col-span-7 h-full overflow-hidden">
            <AnswerSheetViewer
              pages={session.answerSheetPages}
              questions={session.questions}
              answers={session.answers}
              mappings={session.mappings}
              gradings={session.gradings}
              selectedQuestionId={selectedQuestionId}
            />
          </div>
        </div>

        {/* Mobile Single Active Panel View (Hidden on Desktop) */}
        <div className="flex md:hidden flex-1 overflow-hidden w-full">
          {mobileTab === "questions" ? (
            <div className="w-full h-full overflow-hidden">
              <ExtractedQuestionsPanel
                questions={session.questions}
                mappings={session.mappings}
                gradings={session.gradings}
                selectedQuestionId={selectedQuestionId}
                onSelectQuestion={(id) => {
                  setSelectedQuestionId(id);
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full overflow-hidden">
              <AnswerSheetViewer
                pages={session.answerSheetPages}
                questions={session.questions}
                answers={session.answers}
                mappings={session.mappings}
                gradings={session.gradings}
                selectedQuestionId={selectedQuestionId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


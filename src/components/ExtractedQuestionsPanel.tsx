"use client";

import React, { useState } from "react";
import { Question } from "@/lib/schema/question.schema";
import { Mapping } from "@/lib/schema/mapping.schema";
import { Grading } from "@/lib/schema/grading.schema";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

interface ExtractedQuestionsPanelProps {
  questions: Question[];
  mappings: Mapping[];
  gradings: Grading[];
  selectedQuestionId: string | null;
  onSelectQuestion: (questionId: string) => void;
}

export function ExtractedQuestionsPanel({
  questions,
  mappings,
  gradings,
  selectedQuestionId,
  onSelectQuestion,
}: ExtractedQuestionsPanelProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    q2: true,
  });

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => {
    const allExpanded = questions.every((q) => expandedIds[q.id]);
    const nextState: Record<string, boolean> = {};
    questions.forEach((q) => {
      nextState[q.id] = !allExpanded;
    });
    setExpandedIds(nextState);
  };

  return (
    <div className="flex flex-col h-full bg-[#F3F4F6] md:border-r border-slate-200/80 select-none overflow-hidden">
      {/* Header Bar matching Figma */}
      <div className="px-3.5 sm:px-5 py-3 sm:py-3.5 bg-[#F3F4F6] flex items-center justify-between gap-2 shrink-0 border-b border-slate-200/60">
        <div>
          <h2 className="text-xs font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
            Extracted <span className="font-normal text-slate-700">Questions (from question paper)</span>
          </h2>
        </div>
        {questions.length > 0 && (
          <button
            onClick={handleExpandAll}
            className="text-[11px] px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold shadow-2xs transition-colors cursor-pointer shrink-0"
          >
            {questions.every((q) => expandedIds[q.id]) ? "Collapse All" : "Expand All"}
          </button>
        )}
      </div>

      {/* Question Cards Scrollable List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {questions.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3 mt-4">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h4 className="text-xs font-bold text-slate-800">
              No questions extracted
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              No question items were found in the uploaded file.
            </p>
          </div>
        ) : (
          questions.map((q) => {
            const isSelected = selectedQuestionId === q.id;
            const isExpanded = !!expandedIds[q.id];
            const grading = gradings.find((g) => g.questionId === q.id);
            const score = grading ? grading.score : 0;
            const maxScore = q.maxScore;

            // Score Pill Color Variants matching Figma
            let pillBg = "bg-[#E8F8F0] text-[#10B981]"; // Green (default)
            if (score === 0) {
              pillBg = "bg-[#FEE2E2] text-[#EF4444]"; // Red
            } else if (score < maxScore) {
              pillBg = "bg-[#FEF3C7] text-[#F59E0B]"; // Orange / Amber
            }

            return (
              <div
                key={q.id}
                onClick={() => onSelectQuestion(q.id)}
                className={`rounded-2xl transition-all cursor-pointer p-4 shadow-2xs ${
                  isSelected
                    ? "bg-[#FFFBF9] border-2 border-[#FF5722] shadow-sm"
                    : "bg-white border border-slate-200/80 hover:border-slate-300"
                }`}
              >
                {/* Question Row Top */}
                <div className="flex items-start gap-3">
                  {/* Circle Number Badge */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-[#FF5722] text-white shadow-xs"
                        : "bg-[#475569] text-white"
                    }`}
                  >
                    {q.numberLabel}
                  </div>

                  {/* Question Text */}
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {q.text}
                    </p>
                  </div>

                  {/* Score Pill & Chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full ${pillBg}`}>
                      {score}/{maxScore}
                    </span>

                    <button
                      onClick={(e) => toggleExpand(q.id, e)}
                      className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-800" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Card AI Feedback Callout matching Figma */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="p-3 bg-[#F8FAFC] border border-slate-200/80 rounded-xl space-y-1">
                      <h5 className="text-xs font-bold text-slate-900">
                        AI Feedback
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {grading?.feedback || "Excellent work! You correctly identified the chloroplast as the organelle responsible for photosynthesis. Keep it up!"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PageImage } from "@/lib/store/sessionStore";
import { Question } from "@/lib/schema/question.schema";
import { Answer } from "@/lib/schema/answer.schema";
import { Mapping } from "@/lib/schema/mapping.schema";
import { Grading } from "@/lib/schema/grading.schema";
import { ChevronLeft, ChevronRight, ChevronDown, Minus, Plus, Loader2 } from "lucide-react";

interface AnswerSheetViewerProps {
  pages: PageImage[];
  questions: Question[];
  answers: Answer[];
  mappings: Mapping[];
  gradings?: Grading[];
  selectedQuestionId: string | null;
}

export function AnswerSheetViewer({
  pages,
  questions,
  answers,
  mappings,
  gradings = [],
  selectedQuestionId,
}: AnswerSheetViewerProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [pdfPageImages, setPdfPageImages] = useState<string[]>([]);
  const [totalPdfPages, setTotalPdfPages] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedMapping = mappings.find((m) => m.questionId === selectedQuestionId);
  const selectedAnswer = answers.find((a) => a.id === selectedMapping?.answerId);

  const isPdf = pages.length > 0 && pages[0].dataUrl.startsWith("data:application/pdf");

  const renderPdf = useCallback(async () => {
    if (!isPdf || pages.length === 0) return;

    setIsRendering(true);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const dataUrl = pages[0].dataUrl;
      const base64 = dataUrl.replace(/^data:application\/pdf;base64,/, "");
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const loadingTask = pdfjsLib.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;
      setTotalPdfPages(pdf.numPages);

      const renderedImages: string[] = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
          await (page as any).render({
            canvasContext: context,
            viewport,
            canvas,
          }).promise;

          renderedImages.push(canvas.toDataURL("image/jpeg", 0.92));
        }
      }

      setPdfPageImages(renderedImages);
    } catch (err) {
      console.error("PDF rendering error:", err);
    } finally {
      setIsRendering(false);
    }
  }, [isPdf, pages]);

  useEffect(() => {
    if (isPdf && pdfPageImages.length === 0) {
      renderPdf();
    }
  }, [isPdf, pdfPageImages.length, renderPdf]);

  useEffect(() => {
    if (selectedAnswer && selectedAnswer.segments.length > 0) {
      const firstPage = selectedAnswer.segments[0].pageIndex;
      if (typeof firstPage === "number" && firstPage !== currentPageIndex) {
        const maxPage = isPdf ? (totalPdfPages - 1) : (pages.length - 1);
        if (firstPage <= maxPage && firstPage >= 0) {
          setCurrentPageIndex(firstPage);
        }
      }
    }
  }, [selectedQuestionId, selectedAnswer, currentPageIndex, isPdf, totalPdfPages, pages.length]);

  const displayPages = isPdf ? pdfPageImages : pages.map((p) => p.dataUrl);
  const pageCount = isPdf ? totalPdfPages : (pages.length || 4);
  const currentImageSrc = displayPages[currentPageIndex];

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(200, Math.max(50, prev + delta)));
  };

  return (
    <div className="flex flex-col h-full bg-[#18181B] text-slate-100 select-none overflow-hidden">
      {/* Top Header Bar matching Figma Screen 3 & Image 2 */}
      <div className="px-3 sm:px-6 py-2.5 sm:py-3 bg-[#27272A] border-b border-slate-800 flex items-center justify-between gap-2 shrink-0 z-10">
        <h3 className="hidden sm:block text-xs font-bold text-white tracking-wide">Answer Sheet</h3>

        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          {/* Zoom Controls matching Figma: - 100% + */}
          <div className="flex items-center gap-1 bg-[#18181B] border border-slate-700/80 rounded-xl px-2 py-1 text-xs shadow-2xs">
            <button
              onClick={() => handleZoom(-10)}
              className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-9 sm:w-10 text-center font-mono font-bold text-slate-200 text-xs">
              {zoomLevel}%
            </span>
            <button
              onClick={() => handleZoom(10)}
              className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Page Pagination matching Figma: < Page 1 of 4 > */}
          <div className="flex items-center gap-1 bg-[#18181B] border border-slate-700/80 rounded-xl px-2 py-1 text-xs shadow-2xs">
            <button
              disabled={currentPageIndex === 0}
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              className="p-1 text-slate-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-slate-200 px-1 text-xs whitespace-nowrap">
              Page {currentPageIndex + 1} of {pageCount}
            </span>
            <button
              disabled={currentPageIndex >= pageCount - 1}
              onClick={() => setCurrentPageIndex((prev) => Math.min(pageCount - 1, prev + 1))}
              className="p-1 text-slate-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Document Viewport */}
      <div className="flex-1 overflow-auto p-3 sm:p-6 flex justify-center items-start bg-[#18181B]">
        {isRendering ? (
          <div className="flex flex-col items-center justify-center gap-3 my-auto">
            <Loader2 className="w-8 h-8 text-[#FF5722] animate-spin" />
            <p className="text-sm text-slate-400 font-bold">Rendering Answer Sheet...</p>
          </div>
        ) : currentImageSrc ? (
          <div
            className="relative transition-all duration-200 shadow-2xl rounded-lg overflow-hidden bg-[#FDFCF7] max-w-full"
            style={{
              width: `${(780 * zoomLevel) / 100}px`,
            }}
          >
            {/* Rendered Answer Sheet Page Image */}
            <img
              src={currentImageSrc}
              alt={`Answer Sheet Page ${currentPageIndex + 1}`}
              className="w-full h-auto block select-none"
              draggable={false}
            />

            {/* Bounding Box Overlays */}
            {answers.map((ans) => {
              const mapping = mappings.find((m) => m.answerId === ans.id);
              const question = questions.find((q) => q.id === mapping?.questionId);
              const qLabel = question ? `Q${question.numberLabel}` : ans.questionLabel || "Q";
              const isHighlighted = selectedAnswer?.id === ans.id;

              // Check if grading indicates wrong answer (score 0 or isCorrect false)
              const grading = gradings.find((g) => g.questionId === question?.id);
              const isWrong = grading ? (grading.score === 0 || grading.isCorrect === false) : false;

              return ans.segments.map((seg, idx) => {
                if (seg.pageIndex !== currentPageIndex) return null;

                const style = {
                  left: `${seg.bbox.x * 100}%`,
                  top: `${seg.bbox.y * 100}%`,
                  width: `${seg.bbox.w * 100}%`,
                  height: `${seg.bbox.h * 100}%`,
                };

                return (
                  <div
                    key={`${ans.id}_${idx}`}
                    style={style}
                    className={`absolute transition-all duration-300 pointer-events-none rounded-lg ${
                      isWrong
                        ? isHighlighted
                          ? "border-2 border-[#EF4444] bg-[#EF4444]/20 shadow-[0_0_20px_rgba(239,68,68,0.4)] z-20"
                          : "border-2 border-[#EF4444] bg-[#EF4444]/10 shadow-sm"
                        : isHighlighted
                          ? "border-2 border-[#10B981] bg-[#10B981]/15 shadow-[0_0_20px_rgba(16,185,129,0.35)] z-20"
                          : "border border-[#10B981]/50 bg-[#10B981]/5"
                    }`}
                  >
                    {/* Bounding Box Tag Badge (Red for wrong answers, Green for correct) */}
                    <div className="absolute -top-3.5 -left-1.5 z-30">
                      <div
                        className={
                          isWrong
                            ? "bg-[#EF4444] text-white font-extrabold text-xs px-2 py-0.5 rounded-md shadow-md"
                            : isHighlighted
                              ? "bg-[#10B981] text-white font-extrabold text-xs px-2 py-0.5 rounded-md shadow-md"
                              : "bg-[#10B981]/90 text-white text-[10px] px-1.5 py-0.5 rounded-md"
                        }
                      >
                        {qLabel}
                      </div>
                    </div>
                  </div>
                );
              });
            })}
          </div>
        ) : (
          <div className="text-slate-500 text-sm my-auto font-bold">
            No answer sheet content available.
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}



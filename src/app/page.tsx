"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/components/UploadDropzone";
import { LeftNavRail } from "@/components/LeftNavRail";
import { Navbar } from "@/components/Navbar";
import { Sparkles, AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [processingSessionId, setProcessingSessionId] = useState<string | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const startPipelineSSE = (sessionId: string) => {
    setProcessingSessionId(sessionId);
    setProcessingError(null);

    const eventSource = new EventSource(`/api/process/${sessionId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.stage === "completed") {
          eventSource.close();
          setTimeout(() => {
            router.push(`/assessment/${sessionId}`);
          }, 800);
        }
        if (data.stage === "failed") {
          eventSource.close();
          setProcessingError(data.error || "AI vision processing failed. Please try again.");
        }
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setProcessingError("AI service connection interrupted. Please try again.");
    };
  };

  const handleStartProcessing = ({
    sessionId,
  }: {
    sessionId: string;
    questionPaperName: string;
    answerSheetName: string;
  }) => {
    startPipelineSSE(sessionId);
  };

  return (
    <main className="h-screen w-screen flex flex-col select-none antialiased overflow-hidden bg-[#F3F4F6]">
      {!processingSessionId ? (
        <UploadDropzone onStartProcessing={handleStartProcessing} />
      ) : (
        /* Screen 2: Extracting... Screen matching Figma Screen 2 & Image 3 */
        <div className="h-full w-full flex flex-col bg-[#F3F4F6] overflow-hidden">
          {/* Top Responsive Header Navbar */}
          <Navbar showBack={true} onBackClick={() => setProcessingSessionId(null)} />

          {/* Main Extraction Area */}
          <div className="flex-1 flex overflow-hidden p-3.5 sm:p-0">
            {/* Collapsed Left Nav Rail (Desktop Only) */}
            <LeftNavRail />

            {/* Centered Extracting Animation Box matching Image 3 */}
            <div className="flex-1 bg-white rounded-3xl sm:rounded-none w-full h-full flex flex-col items-center justify-center p-6 sm:p-12 border border-slate-200/70 sm:border-none shadow-2xs sm:shadow-none">
              {processingError ? (
                /* Human-readable Error State UI */
                <div className="max-w-md w-full p-6 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
                    <AlertTriangle className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-extrabold text-rose-900">
                      AI Extraction Failed
                    </h3>
                    <p className="text-xs font-medium text-rose-700 leading-relaxed">
                      {processingError}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setProcessingSessionId(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Upload
                    </button>

                    <button
                      onClick={() => startPipelineSSE(processingSessionId)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF5722] text-white hover:bg-[#F4511E] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retry Processing
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative flex flex-col items-center space-y-6">
                  {/* Glowing Sparkle Animation Icons matching Figma */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#FF5722]/15 blur-2xl rounded-full animate-pulse" />
                    <div className="relative z-10 animate-bounce">
                      <Sparkles className="w-14 h-14 sm:w-16 sm:h-16 text-[#FF5722] fill-[#FF5722]/30" />
                    </div>
                    <span className="absolute -top-1 right-1 text-[#FF5722] text-lg sm:text-xl animate-ping">✦</span>
                    <span className="absolute bottom-1 -left-2 text-[#FF7043] text-base sm:text-lg animate-pulse">✦</span>
                  </div>

                  {/* Extracting Text */}
                  <div className="text-center space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Extracting...
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-slate-400">
                      This may take a while
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/components/UploadDropzone";
import { LeftNavRail } from "@/components/LeftNavRail";
import { Navbar } from "@/components/Navbar";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [processingSessionId, setProcessingSessionId] = useState<string | null>(null);

  const startPipelineSSE = (sessionId: string) => {
    setProcessingSessionId(sessionId);

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
          // Fallback redirect to workspace to show results
          router.push(`/assessment/${sessionId}`);
        }
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setTimeout(() => {
        router.push(`/assessment/${sessionId}`);
      }, 1500);
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
    <main className="min-h-screen bg-[#F3F4F6] flex flex-col select-none antialiased overflow-hidden">
      {!processingSessionId ? (
        <UploadDropzone onStartProcessing={handleStartProcessing} />
      ) : (
        /* Screen 2: Extracting... Screen matching Figma Screen 2 & Image 3 */
        <div className="h-screen w-screen flex flex-col bg-[#F3F4F6]">
          {/* Top Responsive Header Navbar */}
          <Navbar showBack={true} onBackClick={() => setProcessingSessionId(null)} />

          {/* Main Extraction Area */}
          <div className="flex-1 flex overflow-hidden p-4 sm:p-0">
            {/* Collapsed Left Nav Rail (Desktop Only) */}
            <LeftNavRail />

            {/* Centered Extracting Animation Box */}
            <div className="flex-1 bg-white sm:bg-white rounded-3xl sm:rounded-none flex flex-col items-center justify-center p-6 sm:p-8 m-2 sm:m-0 border border-slate-200/80 sm:border-none shadow-sm sm:shadow-none">
              <div className="relative flex flex-col items-center space-y-6">
                {/* Glowing Sparkle Animation Icons matching Figma */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#FF5722]/15 blur-2xl rounded-full animate-pulse" />
                  <div className="relative z-10 animate-bounce">
                    <Sparkles className="w-16 h-16 text-[#FF5722] fill-[#FF5722]/30" />
                  </div>
                  <span className="absolute -top-1 right-1 text-[#FF5722] text-xl animate-ping">✦</span>
                  <span className="absolute bottom-1 -left-2 text-[#FF7043] text-lg animate-pulse">✦</span>
                </div>

                {/* Extracting Text */}
                <div className="text-center space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Extracting...
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-slate-400">
                    This may take a while
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


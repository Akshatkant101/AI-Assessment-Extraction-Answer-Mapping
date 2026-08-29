"use client";

import React, { useState } from "react";
import {
  Upload,
  ArrowRight,
  Sparkles,
  Loader2,
  LayoutGrid,
  Users,
  FileText,
  Bookmark,
  Clock,
  ChevronDown,
  Bell,
  HelpCircle,
  ArrowLeft,
  Settings,
  PanelLeftClose,
  AlertTriangle,
} from "lucide-react";
import { FileChip } from "./FileChip";
import { Progress } from "./ui/progress";
import { Navbar } from "./Navbar";

interface UploadDropzoneProps {
  onStartProcessing: (data: {
    sessionId: string;
    questionPaperName: string;
    answerSheetName: string;
  }) => void;
}

export function UploadDropzone({ onStartProcessing }: UploadDropzoneProps) {
  const [qpFile, setQpFile] = useState<File | null>(null);
  const [ansFile, setAnsFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "qp" | "ans"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg(`File "${file.name}" is too large. Maximum allowed size is 20MB.`);
      return;
    }

    setErrorMsg(null);
    if (type === "qp") {
      setQpFile(file);
    } else {
      setAnsFile(file);
    }
  };

  const handleStartMapping = async () => {
    if (!qpFile || !ansFile) {
      setErrorMsg("Please upload both a Question Paper and an Answer Sheet before starting.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(30);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("questionPaper", qpFile);
      formData.append("answerSheet", ansFile);

      setUploadProgress(60);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(90);

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(data.error || `Upload failed (${res.status})`);
      }

      setUploadProgress(100);
      const sessionData = await res.json();

      onStartProcessing({
        sessionId: sessionData.sessionId,
        questionPaperName: sessionData.questionPaperName,
        answerSheetName: sessionData.answerSheetName,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload files. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const canStart = !!qpFile && !!ansFile && !isUploading;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col md:flex-row text-slate-900 select-none antialiased">
      {/* Left Sidebar (Desktop Only) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/80 p-5 flex-col justify-between shrink-0 shadow-2xs">
        <div className="space-y-6">
          {/* Logo & Sidebar Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#18181B] text-white flex items-center justify-center font-black text-xl shadow-xs">
                V
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                VedaAI
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer">
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* AI Teacher's Toolkit CTA */}
          <button className="w-full bg-[#27272A] border-2 border-[#FF5722] hover:bg-[#18181B] text-white rounded-full py-2.5 px-4 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Sparkles className="w-4 h-4 text-white" />
            ✦ AI Teacher&apos;s Toolkit
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-1">
            <a href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              <LayoutGrid className="w-4 h-4 text-slate-500" /> Home
            </a>
            <a href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              <Users className="w-4 h-4 text-slate-500" /> My Classroom
            </a>
            <a href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              <FileText className="w-4 h-4 text-slate-500" /> Assignments
            </a>
            <a href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#F3F4F6] text-slate-900 shadow-2xs">
              <Bookmark className="w-4 h-4 text-slate-800" /> Exams
            </a>
            <a href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              <Clock className="w-4 h-4 text-slate-500" /> My Library
            </a>
          </nav>
        </div>

        {/* Bottom Sidebar Section */}
        <div className="space-y-4">
          <a href="#" className="flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
            <Settings className="w-4 h-4 text-slate-500" /> Settings
          </a>

          {/* School Card */}
          <div className="p-3 bg-[#F8FAFC] rounded-2xl flex items-center gap-3 border border-slate-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
              <span className="text-sm font-bold">🏫</span>
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-bold text-slate-900 truncate">Delhi Public School</h5>
              <p className="text-[11px] text-slate-500 truncate">Bokaro Steel City</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen md:min-h-0">
        {/* Responsive Navbar */}
        <Navbar showBack={true} />

        {/* Upload Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-12 flex flex-col items-center justify-center">
          <div className="max-w-3xl w-full flex flex-col items-center">
            {/* Title Banner */}
            <div className="text-center space-y-3 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-snug">
                Upload{" "}
                <span className="bg-[#FFEBE4] text-[#FF5722] px-3 sm:px-4 py-1 rounded-2xl inline-block border border-[#FFD7CC]/80 mt-1 sm:mt-0">
                  Question Paper &amp; Answer Sheets
                </span>
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Upload both files to get started
              </p>
            </div>

            {/* Central Teacher Avatar Illustration */}
            <div className="relative mb-8 flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-[#FFEBE4]/80 flex items-center justify-center border-2 border-[#FFD7CC] relative shadow-xs">
                {/* Floating Orange Icon Badges */}
                <div className="absolute -top-1 right-2 w-6 h-6 rounded-full bg-[#FF5722] text-white flex items-center justify-center text-[10px] shadow-sm">⏰</div>
                <div className="absolute top-8 -right-3 w-5 h-5 rounded-full bg-[#FF5722] text-white flex items-center justify-center text-[9px] shadow-sm">☁️</div>
                <div className="absolute bottom-1 -left-2 w-6 h-6 rounded-full bg-[#FF5722] text-white flex items-center justify-center text-[10px] shadow-sm">⚙️</div>
                
                {/* Teacher Avatar Image / Icon */}
                <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-3xl overflow-hidden shadow-md">
                  👩‍🏫
                </div>
              </div>
            </div>

            {/* Dropzone Container Grid */}
            <div className="bg-[#EFEFEF]/60 p-4 sm:p-6 rounded-3xl w-full mb-8 border border-slate-200/60 shadow-2xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                {/* Question Paper Card */}
                <div className="p-8 border-2 border-dashed border-slate-300/90 hover:border-[#FF5722] transition-colors flex flex-col items-center justify-center min-h-[190px] rounded-2xl bg-white shadow-2xs">
                  {qpFile ? (
                    <FileChip
                      fileName={qpFile.name}
                      fileSize={qpFile.size}
                      pagesCount={qpFile.type === "application/pdf" ? undefined : 1}
                      onRemove={() => setQpFile(null)}
                    />
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer w-full h-full text-center py-2">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                        <Upload className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Upload <span className="text-[#FF5722]">Question Paper</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Max 10MB</p>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => handleFileSelect(e, "qp")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Answer Sheet Card */}
                <div className="p-8 border-2 border-dashed border-slate-300/90 hover:border-[#FF5722] transition-colors flex flex-col items-center justify-center min-h-[190px] rounded-2xl bg-white shadow-2xs">
                  {ansFile ? (
                    <FileChip
                      fileName={ansFile.name}
                      fileSize={ansFile.size}
                      pagesCount={ansFile.type === "application/pdf" ? undefined : 1}
                      onRemove={() => setAnsFile(null)}
                    />
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer w-full h-full text-center py-2">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                        <Upload className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Upload <span className="text-[#FF5722]">Answer Sheet</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Max 10MB</p>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => handleFileSelect(e, "ans")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="w-full max-w-md space-y-2 mb-6 text-center">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Uploading files to VedaAI...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2.5" />
              </div>
            )}

            {/* Error Display */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 max-w-lg w-full flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-800 mb-1">Upload Error</p>
                  <p className="text-rose-600 leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Start Mapping Button */}
            <button
              onClick={handleStartMapping}
              disabled={!canStart}
              className={`rounded-full px-8 py-3.5 text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                canStart
                  ? "bg-[#27272A] hover:bg-[#18181B] text-white shadow-lg cursor-pointer"
                  : "bg-slate-400 text-white cursor-not-allowed opacity-70"
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  Start Mapping
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Helper Subtext */}
            <p className="text-xs text-slate-400 mt-4 text-center">
              Once both files are uploaded, you&apos;ll able to map answers with questions
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}


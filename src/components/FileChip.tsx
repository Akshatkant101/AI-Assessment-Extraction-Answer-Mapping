"use client";

import React from "react";
import { FileText, X } from "lucide-react";

interface FileChipProps {
  fileName: string;
  fileSize: number;
  pagesCount?: number;
  onRemove?: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileChip({
  fileName,
  fileSize,
  pagesCount,
  onRemove,
}: FileChipProps) {
  const ext = fileName.split(".").pop()?.toUpperCase() || "FILE";
  const isPdf = ext === "PDF";

  return (
    <div className="relative flex items-center gap-4 p-3.5 bg-[#f8fafc] border border-slate-200 rounded-2xl shadow-2xs min-w-[260px] max-w-full">
      {/* File Icon Badge */}
      <div className={`w-9 h-10 ${isPdf ? "bg-[#ef4444]" : "bg-[#3b82f6]"} text-white rounded-lg flex flex-col items-center justify-center font-bold text-[9px] shrink-0 shadow-2xs`}>
        <FileText className="w-4 h-4 mb-0.5" />
        {ext}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pr-5">
        <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
          {fileName}
        </h4>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">
          {formatFileSize(fileSize)}
          {pagesCount !== undefined && ` • ${pagesCount} ${pagesCount === 1 ? "Page" : "Pages"}`}
        </p>
      </div>

      {/* Remove Cross Button */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-slate-700 text-white hover:bg-slate-900 flex items-center justify-center text-xs transition-colors cursor-pointer"
          title="Remove file"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

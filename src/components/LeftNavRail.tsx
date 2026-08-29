"use client";

import React from "react";
import {
  LayoutGrid,
  Users,
  FileText,
  Bookmark,
  Clock,
  ChevronsRight,
  Sparkles,
} from "lucide-react";
import { Tooltip } from "./ui/tooltip";

export function LeftNavRail() {
  return (
    <aside className="hidden md:flex w-[56px] bg-white border-r border-slate-200/80 flex-col items-center justify-between py-4 select-none shrink-0 z-20 shadow-xs">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-5">
        {/* VedaAI Logo Icon */}
        <Tooltip content="VedaAI Dashboard">
          <div className="w-9 h-9 rounded-xl bg-[#18181B] text-white flex items-center justify-center font-black text-lg shadow-sm hover:scale-105 transition-transform cursor-pointer">
            V
          </div>
        </Tooltip>

        {/* AI Toolkit Sparkle Button */}
        <Tooltip content="AI Teacher's Toolkit">
          <button className="w-8 h-8 rounded-full bg-[#18181B] border-2 border-[#FF5722] text-[#FF5722] flex items-center justify-center shadow-xs hover:scale-105 transition-transform cursor-pointer">
            <Sparkles className="w-4 h-4 text-[#FF5722]" />
          </button>
        </Tooltip>

        {/* Navigation Rail Buttons */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <Tooltip content="Home">
            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
              <LayoutGrid className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip content="My Classroom">
            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
              <Users className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip content="Assignments">
            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
              <FileText className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip content="Exams (Active)">
            <button className="p-2 text-slate-900 bg-slate-100 rounded-xl transition-colors cursor-pointer shadow-2xs">
              <Bookmark className="w-4 h-4 text-slate-800" />
            </button>
          </Tooltip>

          <Tooltip content="My Library">
            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
              <Clock className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-3">
        {/* School Logo Badge */}
        <Tooltip content="Delhi Public School">
          <div className="w-8 h-8 rounded-xl bg-emerald-50/80 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-2xs">
            <span className="text-xs font-bold">🏫</span>
          </div>
        </Tooltip>

        {/* Expand Sidebar Button */}
        <Tooltip content="Expand Sidebar">
          <button className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <ChevronsRight className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}


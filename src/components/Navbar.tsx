"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  HelpCircle,
  Bell,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  LayoutGrid,
  Users,
  FileText,
  Clock,
  Settings,
} from "lucide-react";

interface NavbarProps {
  onBackClick?: () => void;
  backHref?: string;
  showBack?: boolean;
}

export function Navbar({ onBackClick, backHref = "/", showBack = true }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Header Navbar */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-2xs z-30 select-none">
        {/* Desktop Left: Back Arrow + Exams */}
        <div className="hidden sm:flex items-center gap-3 text-slate-600">
          {showBack && (
            backHref ? (
              <Link href={backHref}>
                <ArrowLeft className="w-4 h-4 cursor-pointer hover:text-slate-900 transition-colors" />
              </Link>
            ) : (
              <ArrowLeft
                onClick={onBackClick}
                className="w-4 h-4 cursor-pointer hover:text-slate-900 transition-colors"
              />
            )
          )}
          <Bookmark className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-800">Exams</span>
        </div>

        {/* Mobile Left: Back Arrow + VedaAI Logo matching Figma Mobile */}
        <div className="flex sm:hidden items-center gap-2.5 text-slate-900">
          {showBack && (
            backHref ? (
              <Link href={backHref} className="p-1 text-slate-700 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            ) : (
              <button onClick={onBackClick} className="p-1 text-slate-700 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )
          )}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center font-black text-xs shadow-xs">
              V
            </div>
            <span className="text-sm font-extrabold tracking-tight text-slate-900">
              VedaAI
            </span>
          </Link>
        </div>

        {/* Desktop Right Header Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <button className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <HelpCircle className="w-4 h-4" />
          </button>

          <div className="relative cursor-pointer">
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#EF4444]" />
          </div>

          <button className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <Sparkles className="w-4 h-4 text-slate-800" />
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
              <span className="text-[10px] font-extrabold">MR</span>
            </div>
            <span className="text-xs font-bold text-slate-800">Madhur Rastogi</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Mobile Right Header Actions matching Figma Mobile */}
        <div className="flex sm:hidden items-center gap-3">
          <div className="relative cursor-pointer p-1">
            <Bell className="w-5 h-5 text-slate-700" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#EF4444]" />
          </div>

          <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs overflow-hidden cursor-pointer shadow-xs">
            <span className="text-[10px] font-extrabold">MR</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-slate-800 hover:text-slate-900 cursor-pointer transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-top duration-200">
          <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center font-black text-xs">
                V
              </div>
              <span className="text-sm font-extrabold text-slate-900">VedaAI</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-slate-600 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            <button className="w-full bg-[#27272A] border border-[#FF5722] text-white rounded-full py-2.5 px-4 font-bold text-xs flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF5722]" />
              ✦ AI Teacher&apos;s Toolkit
            </button>

            <nav className="space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <LayoutGrid className="w-5 h-5 text-slate-500" /> Home
              </Link>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Users className="w-5 h-5 text-slate-500" /> My Classroom
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <FileText className="w-5 h-5 text-slate-500" /> Assignments
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-[#F3F4F6] text-slate-900"
              >
                <Bookmark className="w-5 h-5 text-slate-800" /> Exams
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Clock className="w-5 h-5 text-slate-500" /> My Library
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Settings className="w-5 h-5 text-slate-500" /> Settings
              </a>
            </nav>

            <div className="pt-4 border-t border-slate-100">
              <div className="p-3 bg-[#F8FAFC] rounded-2xl flex items-center gap-3 border border-slate-200/80">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
                  <span className="text-sm font-bold">🏫</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-slate-900 truncate">Delhi Public School</h5>
                  <p className="text-[11px] text-slate-500 truncate">Bokaro Steel City</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VedaAI - AI Assessment Extraction & Answer Mapping",
  description: "Teacher tool for extracting questions, mapping handwritten student answers, and AI grading.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="light bg-[#f1f3f7] text-slate-900">
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#f1f3f7] text-slate-900 antialiased font-sans flex flex-col"
      >
        {children}
      </body>
    </html>
  );
}

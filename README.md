# 🧠 VedaAI — AI Assessment Question & Answer Sheet Extraction Platform

VedaAI is an enterprise-grade AI vision application built with **Next.js 16**, **React 19**, and **TypeScript**. It automatically extracts structured questions from Question Papers, processes handwritten/printed Answer Sheets using Google Gemini Vision, and renders interactive side-by-side assessment mapping with bounding boxes.

---

## 🚀 Features

- **📄 Dual PDF / Image Upload**: Drag-and-drop or select Question Paper and Answer Sheet documents.
- **👁️ AI Vision Pipeline**: Powered by Google Gemini 3.6 Flash API with fallback providers.
- **🎯 Visual Bounding Box Mapping**: Interactive canvas highlighting extracted answers with color-coded bounding boxes.
- **⚡ Real-time SSE Streaming**: Server-Sent Events notify the client during multi-stage processing (`Rasterize -> Extract -> Map -> Complete`).
- **📱 Fully Responsive UI**: Custom modern interface built with Tailwind CSS v4, custom themes, mobile drawers, and smooth transitions.
- **🔒 Production Architecture Ready**: Designed for horizontal scaling using Redis, Kafka, and distributed BullMQ worker nodes.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Logic**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons
- **PDF Processing**: PDF.js (`pdfjs-dist`) & HTML5 Canvas Rasterization
- **AI Models**: Google Gemini 3.6 Flash (`@google/genai` / REST API) with Zod structured output validation
- **State Management**: Zustand / Custom Session Store

---

## 📂 Project Structure

```
├── public/
│   ├── pdf.worker.mjs      # PDF.js worker bundle
│   └── pdf.worker.min.mjs  # PDF.js minified worker bundle
├── src/
│   ├── app/                # Next.js App Router (Pages & API Routes)
│   │   ├── api/            # Process pipeline, SSE, and render streams
│   │   ├── assessment/     # Interactive Assessment Mapping Workspace
│   │   └── page.tsx        # Upload & Progress Pipeline Landing Page
│   ├── components/         # React UI Components (Dropzone, Viewer, Panels)
│   └── lib/                # PDF Rasterizer, Gemini Providers, Pipeline & Store
├── .gitattributes          # Linguist language statistics configuration
├── package.json
└── tsconfig.json
```

---

## 🏷️ Note on Repository Language Breakdown (TypeScript vs JavaScript)

If you see GitHub reporting this repository as **JavaScript** in the language statistics sidebar, this is because GitHub's Linguist scanner counts total raw code bytes tracked in Git.

The PDF processing engine requires pre-compiled PDF worker scripts (`public/pdf.worker.mjs` and `public/pdf.worker.min.mjs`) which total ~3.5 MB of JavaScript vendor code. 

A `.gitattributes` file is included in this repository to mark vendor worker files with `linguist-vendored`:

```gitattributes
public/pdf.worker.mjs linguist-vendored
public/pdf.worker.min.mjs linguist-vendored
public/*.mjs linguist-vendored
```

This ensures GitHub Linguist accurately reflects **TypeScript** as the primary language of the codebase.

---

## ⚡ Getting Started

### 1. Prerequisites

- Node.js (v18+ recommended)
- npm, yarn, or pnpm

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 3. Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to test the application.

---

## 📜 License

MIT License. Built for technical assessment & production AI workflows.

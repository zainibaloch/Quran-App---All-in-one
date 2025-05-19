# 📖 Quran-App — All-in-One

A fully-featured, responsive Quran web app built using **Next.js 13 (App Router)**, **TypeScript**, and **Tailwind CSS**. This modern Islamic platform includes Quran reading with translation and tafsir, audio recitation, OCR image recognition, audio transcription, **Kids Mode**, search, bookmarks, memorization tracking, and more — all built with love for Muslims around the world.

---

## 🚀 Features Overview

✅ **Full Quran Reader**
✅ **Multi-language Translations** (English, Urdu, etc.)
✅ **Tafsir Viewer** (e.g., Ibn Kathir)
✅ **Audio Recitations** by famous Qaris
✅ **Ayah-by-Ayah Playback**
✅ **Audio Transcription API** – Get text from Quranic audio
✅ **Quran OCR Recognition API** – Extract verses from image uploads
✅ **Search** Surahs, Ayahs & keywords
✅ **Bookmark System**
✅ **Memorization Progress Tracker**
✅ **Theme Toggle** – Dark & Light modes
✅ **Kids Mode** – Child-friendly interface with simpler design and engaging UX
✅ **Responsive UI** – Mobile & desktop optimized
✅ **Built with TypeScript** and reusable components

---

## 🧠 Unique Functionalities

### 🧠 Quran OCR Recognition

Upload any image containing Quranic text, and the app will recognize and return the corresponding Arabic verse using a custom **OCR engine** connected via API.

### 🔊 Audio Transcription

Record or upload a Quranic recitation, and the app transcribes it to Arabic text. Helpful for recitation verification, Tajweed learners, or accessibility.

### 🎈 Kids Mode

A simplified, colorful, and engaging reading experience specially designed for children:

* Easy navigation
* Bigger fonts
* Friendly interface
* Safe content only
  Helps introduce young users to the Quran with fun and ease.

---

## 🛠 Tech Stack

* **Framework**: Next.js 13 (App Directory)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **APIs**:

  * [AlQuran Cloud API](https://alquran.cloud) for Quran data
  * Custom OCR & Transcription APIs
* **State**: React Hooks & Context API
* **Audio**: Native HTML5 + Custom Controls
* **Deployment**: Fully portable for Node.js environments

---

## 🧾 Project Structure

```
📁 app/                 # Next.js App router
  ├── page.tsx         # Home Page
  ├── layout.tsx       # Root layout & global styling
  └── surah/[id]/      # Dynamic Surah pages

📁 components/          # All reusable UI components
  ├── AudioPlayer.tsx
  ├── BookmarkButton.tsx
  ├── OCRUploader.tsx
  ├── Transcriber.tsx
  └── KidsModeCard.tsx

📁 lib/                 # Quran data and utilities
📁 hooks/               # Custom hooks
📁 public/              # Static assets
📁 styles/              # Global CSS / Tailwind
📁 pages/api/           # API routes for OCR & Audio

📝 tsconfig.json
📝 next.config.mjs
📝 tailwind.config.ts
📝 .eslintrc.cjs
```

---

## 📦 Installation

### 📋 Prerequisites

* Node.js ≥ 18
* pnpm or npm

### 🔧 Setup

```bash
git clone https://github.com/zainibaloch/Quran-App---All-in-one
pnpm install  # or npm install
```

### 🌐 Environment Variables

Create a `.env.local` file and configure:

```env
NEXT_PUBLIC_QURAN_API=https://api.alquran.cloud/v1
OCR_API_URL= local
TRANSCRIBE_API_URL= local
```

###  Run

```bash
pnpm dev      # Dev server
pnpm build    # Production build
pnpm start    # Start prod server
```

---

## 🧪 Key Components

* `AudioPlayer.tsx`: Stream & control recitation per Ayah.
* `OCRUploader.tsx`: Upload image → get Ayah text.
* `Transcriber.tsx`: Upload audio → get transcription.
* `SearchBar.tsx`: Global intelligent search.
* `BookmarkButton.tsx`: Save your favorite Ayahs.
* `KidsModeCard.tsx`: Entry point to the fun & safe Kids Mode.

---

## 📱 Deployment

You can deploy this app on any platform that supports Node.js (like Railway, Render, Heroku, etc.).

```bash
pnpm build
pnpm start
```

---

## ❤️ Contribute

Pull requests are welcome! Here's how:

```bash
git checkout -b feature/MyNewFeature
git commit -m "Add new feature"
git push origin feature/MyNewFeature
```

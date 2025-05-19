## Quran-App — All-in-one

[![npm version](https://img.shields.io/npm/v/your-package-name.svg?style=flat)]() [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)]()

An **all-in-one**, **Next.js 13** Quran web application built from the ground up with **TypeScript**, **Tailwind CSS**, and the official **AlQuran Cloud API**. Browse the entire Mushaf, search by Surah/Ayah, read translations, view tafsīr, play recitations, bookmark favorites, track your memorization, and switch between light/dark themes—all in one place.

---

### 🔎 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)

   * [Prerequisites](#prerequisites)
   * [Installation](#installation)
   * [Environment Variables](#environment-variables)
   * [Running Locally](#running-locally)
4. [Project Structure](#project-structure)
5. [Core Components](#core-components)
6. [Deployment](#deployment)
7. [Contributing](#contributing)
8. [License](#license)

---

### 🎯 Features

* **Complete Quran Text**: Navigate all 114 Surahs and their Ayahs.
* **Surah/Ayah Routing**: Dynamic Next.js routes for every Surah and Ayah.
* **Translations**: Multi-language translations (English, Urdu, etc.).
* **Tafsīr**: View classic tafsīr (e.g. Ibn Kathir) alongside the text.
* **Audio Recitation**: Stream recitations from multiple Qāri’ voices with a custom audio player.
* **Search**: Full-text search across Quran text and translations.
* **Bookmarks & Notes**: Bookmark your favorite Ayahs and add personal notes.
* **Memorization Tracker**: Mark Ayahs as “memorized” and track your progress.
* **Dark & Light Themes**: Seamless toggle with Tailwind’s dark mode.
* **Responsive**: Mobile-first design that adapts to any screen size.
* **Performance**: Static generation & ISR for lightning-fast page loads.

---

### 🛠 Tech Stack

* **Framework**: Next.js 13 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **State Management**: React Context & custom hooks
* **Data Fetching**: `fetch` + Next.js `app/` data fetching (static & dynamic routes)
* **API**: AlQuran Cloud ([https://alquran.cloud/](https://alquran.cloud/))
* **Audio**: HTML5 Audio + custom React AudioPlayer component
* **Linting & Formatting**: ESLint, Prettier

---

### 🚀 Getting Started

#### Prerequisites

* **Node.js** ≥ 18
* **pnpm** or **npm**

#### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/Quran-App-All-in-one.git
cd Quran-App-All-in-one

# Install dependencies
pnpm install   # or `npm install`
```

#### Environment Variables

Create a `.env.local` in the root and add your API endpoint (optional: you can use the public AlQuran Cloud by default):

```dotenv
NEXT_PUBLIC_QURAN_API=https://api.alquran.cloud/v1
# (Optional) If you have a custom endpoint/key, add it here
```

#### Running Locally

```bash
# Start dev server
pnpm dev      # or `npm run dev`

# Build for production
pnpm build    # or `npm run build`

# Preview production build
pnpm start    # or `npm run start`
```

Now open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 📁 Project Structure

```
/
├── app/                   # Next.js App-Router pages & layouts
│   ├── layout.tsx         # Global app layout (header, theme toggle)
│   ├── page.tsx           # Home / Surah list
│   └── surah/
│       └── [id]/page.tsx  # Dynamic Surah + Ayah pages
├── components/            # Reusable React components
│   ├── AudioPlayer.tsx
│   ├── SearchBar.tsx
│   ├── BookmarkButton.tsx
│   ├── ThemeSwitcher.tsx
│   └── …                  
├── hooks/                 # Custom React hooks
│   └── useBookmarks.ts
├── lib/                   # API wrappers & utilities
│   └── quranApi.ts        # fetchSurah, fetchTafsir, fetchTranslation
├── public/                # Static assets (icons, fonts)
│   └── images/
├── styles/                # Tailwind overrides & globals
│   └── globals.css
├── .eslintrc.cjs
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md              # ← You are here
```

---

### 💡 Core Components

* **`AudioPlayer`**
  Custom hook + component for play/pause/seeking with progress bar.

* **`SearchBar`**
  Debounced full-text search over in-memory Surah data.

* **`BookmarkButton`**
  Toggle bookmark state in `localStorage`, sync with UI.

* **`ThemeSwitcher`**
  Tailwind-powered dark/light toggle with OS-preference detection.


### 📦 Deployment

This app is framework-agnostic and can be deployed to any Node.js-capable host:

1. Build the app: `pnpm build`
2. Serve the build: `pnpm start`
3. Ensure your host passes through environment variables to `NEXT_PUBLIC_QURAN_API`.


### 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request and describe your changes

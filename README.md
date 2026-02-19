# MCE — Maicel’s Carousel Engine

MCE is an offline-first Progressive Web App to design technical LinkedIn carousels from Markdown with local persistence, quality audits, and high-performance export.

## What changed in the redesign
- **State architecture upgraded** with a dedicated Zustand editor store.
- **Persistence hardened** with Dexie schema versioning and migration hooks.
- **Markdown pipeline hardened** with sanitization (`DOMPurify`) + richer layout heuristics.
- **Export engine improved** with chunked rendering pipeline, quality modes, and progress tracking.
- **Premium template engine** with designer-style families (Clinical Pro, AI Futurist, Minimal Research, Data Storytelling, Executive Insight).
- **UI split into modules** (`Editor`, `ProjectManager`, `SlideManager`, `Preview`, `Sidebar`) for better maintainability.

## Stack
- React 18 + Vite
- Tailwind CSS
- Zustand (state domain)
- Dexie.js (IndexedDB local persistence)
- marked + DOMPurify (safe Markdown parsing)
- SortableJS (drag-and-drop order)
- html2canvas + pdf-lib export pipeline
- PWA via vite-plugin-pwa (installable + offline cache)

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

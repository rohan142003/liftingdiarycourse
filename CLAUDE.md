# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation-First Rule

**Before generating or modifying any code, always check the `/docs` directory for relevant documentation files.** The docs may contain architecture decisions, API references, implementation guides, or constraints that must be followed. Read and adhere to any applicable docs before writing code.


## Project Overview

Lifting Diary Course — a Next.js 16 web application using React 19, TypeScript 5, and Tailwind CSS v4. Currently in early development (scaffolded with `create-next-app`).

## Commands

- `npm run dev` — Start development server at http://localhost:3000
- `npm run build` — Production build
- `npm start` — Serve production build
- `npm run lint` — Run ESLint (flat config, Next.js core web vitals + TypeScript rules)

- /docs/data-fetching.md
- /docs/data-mutation.md
-/docs/auth.md
## Architecture

- **Next.js App Router** (`app/` directory) with file-based routing
- **React Server Components by default** — use `"use client"` directive only when client interactivity is needed
- **Root layout** at `app/layout.tsx` applies Geist fonts via `next/font/google` and global metadata
- **Styling**: Tailwind CSS v4 via PostCSS plugin; dark mode supported via `dark:` prefix classes and CSS custom properties in `globals.css`
- **Path alias**: `@/*` maps to the project root (configured in `tsconfig.json`)
- **TypeScript strict mode** is enabled
- **No testing framework** is configured yet

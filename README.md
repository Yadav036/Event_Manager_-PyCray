# Next.js Event Manager

This is a basic Next.js Event Manager built using **Next-Forge Turbo template** (monorepo with Turborepo + pnpm).

## Features
- Event creation page (`/events`) with:
  - Event Name (text, required)
  - Date (required)
  - Local in-memory event list with delete
- Client-side state using **Zustand** or **useState**
- Optional: **React Hook Form** for form handling
- TailwindCSS for styling

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- pnpm
- Zustand / React Hook Form (optional)

## Setup
```bash
git clone <your-repo-url>
cd apps/web
pnpm install
pnpm run dev

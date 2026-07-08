---
name: codebase-structure
description: Explains the strict architecture, patterns, and styling rules for this Next.js codebase. Use when creating new features, components, or services to ensure they match existing conventions.
---

# Codebase Architecture & Conventions

This codebase is a production-grade Next.js App Router application integrated with Supabase and Zustand. 

## When to use this skill
- When planning the architecture for a new feature.
- When creating new UI components, services, or models.
- When you need to understand how styling or state management is handled.

## 1. Directory Structure

- `app/`: Next.js App Router. Use for page routing, server components, and layout wrappers.
- `components/`: Pure presentation and logic components.
  - `canvas/`: All editor/canvas related components (e.g., `TextEditorSheet`, `ProjectPreview`).
  - `globals/`: App-wide overlays like Modals and Sheets (e.g., `GlobalSheet.tsx`, `GlobalModal.tsx`).
  - `layout/`: Shared structural components (Navbars, SidePanels).
  - `workspace/`: Dashboard and project-listing components (e.g., `ProjectCard`, `NewProjectButton`).
- `lib/models/`: TypeScript interfaces/types mapping to database schema (e.g., `user.model.ts`, `project.model.ts`).
- `lib/services/`: Abstraction layer for all external API/Database calls (e.g., `project.service.ts`). **UI components should rarely use Supabase directly; they should call these services.**
- `lib/store/`: Global client state managed via Zustand (e.g., `modal-store.ts`, `canvas-store.ts`).
- `lib/supabase/`: Supabase client implementations. Includes `client.ts` for browser usage and `server.ts` for server-side operations (App Router cookies).

## 2. Styling (Neobrutalism)
The entire application follows a strict **Neobrutalist** aesthetic. 
- **Corners**: Always sharp (`rounded-none`). No border-radius.
- **Borders**: Thick, high-contrast zinc borders (`border-2` or `border-4 border-zinc-900`).
- **Shadows**: Hard, solid, non-blurred offset shadows. Use tailwind arbitrary values like `shadow-[4px_4px_0px_rgba(24,24,27,1)]` or `rgba(244,114,182,1)` for pink.
- **Interactions**: Hover and active states should physically move the element up and left (`-translate-y-1 -translate-x-1`) to simulate mechanical buttons.
- **Typography**: Bold, uppercase typography for labels and buttons. High contrast text.

## 3. Data Flow & State
- **Server Data**: Use Server Components where possible to fetch initial data.
- **Client State**: Use Zustand (`lib/store/*`) for complex interactive client state (like the Canvas or Modals). Ensure Zustand stores use the `"use client"` directive in the files that consume or declare them if utilizing `useSyncExternalStore` internally.
- **Database Calls**: UI components should trigger functions in `lib/services/*.service.ts`. The service handles interacting with the Supabase client.

## 4. Auth
- Auth is managed through Supabase.
- A Postgres trigger automatically replicates `auth.users` creations into a `public.users` table for relational foreign keys (see `lib/models/user.model.ts`).
- Server-side auth checks (middleware or server components) use `@supabase/ssr` methods found in `lib/supabase/server.ts`. Client components use `lib/supabase/client.ts`.

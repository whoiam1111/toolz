# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server (Turbopack) on localhost:3000
- `npm run build` — production build, fails on type errors; `postbuild` runs `next-sitemap`, which regenerates `public/sitemap*.xml` and `public/robots.txt` (these generated files are committed)
- `npm run lint` — runs `eslint .` directly (Next 16 removed `next lint`, and builds no longer lint)
- `npm test` — Vitest unit tests; single file: `npx vitest run app/lib/scoring.test.ts`

Requires `.env.local` (see `.env.example`). `ADMIN_EMAILS` and `PROMO_CODES` are server-only — never give them a `NEXT_PUBLIC_` prefix.

## Architecture

Next.js App Router site (toolz.co.kr) for psychological/personality assessments, Korean-language UI. All code lives under `app/` (no `src/`). Backend is Supabase only (auth + Postgres + storage), always with the **anon key** — there is no service-role client, so data access ultimately relies on Supabase RLS policies. The intended policies live in `supabase/migrations/` and may not be applied to the live project yet; code is written to work both before and after.

Supabase client entry points — pick by execution context:
- `app/lib/supabase.ts` — browser client (`'use client'`), used by client pages.
- `app/lib/supabase-server.ts` — cookie-based server client plus `requireUser('user' | 'admin')` for API routes.
- `app/api/supabaseApi.ts` — client-side auth wrappers and `save*Test` helpers. Despite its folder, it is not a route.
- `app/db/index.ts` — server-side helpers for the trial `responses` table.

### Auth and access control
- `proxy.ts` (root; Next 16's renamed middleware) blocks `/dashboard`, `/trial/dashboard` without login and `/admins` for non-admins. `layout.tsx` files in those folders add a client-side `AuthGuard` for UX only.
- Admin status is decided server-side only (`app/lib/admin.ts`: `ADMIN_EMAILS` env or `admins` table). Clients read it via `/api/me` → `useAuth().isAdmin`. Do not reintroduce email checks in client code — they end up in the public bundle.
- `AuthContext` forces logout 12h after login (`localStorage.login_time`). `session` and `isAdmin` are tri-state: `undefined` means still loading — don't redirect on it.

### Product areas
- **`/dashboard/participant/[id]/<test>`** — counselor ("코치") flow; each assessment has `page.tsx` + `results/page.tsx` and its own table keyed by `participant_id`. Tables can hold duplicate submissions, so always read via `fetchLatestResult`/`hasResult` (`app/lib/results.ts`), never bare `.maybeSingle()` (errors on >1 row).
- Drawing tests share `app/components/ShapeDrawingTest.tsx` / `DrawingResult.tsx`. Personal images (signatures, drawings) are uploaded with UUID paths and displayed through signed URLs (`app/lib/storage.ts`) so their buckets can be private.
- **`/admins/*`** — admin console (counselors, organizations, content).
- **`/trial/*`** — public emotion quiz per `[zone]` (plus a `book` variant sharing `app/components/EmotionQuiz.tsx`). `clientid` is `"<name>#<6 chars>"` from `app/lib/trialClient.ts` (older rows are bare names); show it with `trialDisplayName`.
- **`/minitest/*`** — standalone client-only mini-tests.
- Scoring logic is pure and unit-tested in `app/lib/scoring.ts`; keep new scoring there rather than inside pages. Assessment content is static data in `app/lib/` (`context.ts`, `question.ts`, `data.ts`).

### Styling
Tailwind v3 with brand colors in `tailwind.config.js` (`Byellow`, `Bgreen`, `Bbeige`, …); prefer these over raw hex values.

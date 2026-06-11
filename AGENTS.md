# AGENTS.md

Operating guide for AI agents (Google Jules and others) working in this repository.
Read this file in full before planning or editing. When it conflicts with a stale comment or
assumption, **this file and the linked source-of-truth documents win.**

---

## 1. Project Overview

**Blackberry Space** is a platform for developers to share code snippets (and, soon, solve
programming challenges). Authenticated users publish, edit, favorite, and share syntax-highlighted
snippets; the public can browse and search them.

| Aspect | Detail |
|--------|--------|
| Framework | **Next.js 16** (App Router, React Server Components) |
| Language | **TypeScript** (strict mode) on **React 19** |
| Styling | **Tailwind CSS v4** (CSS-first `@theme` config, no `tailwind.config.js`) |
| Backend | **Supabase** — Postgres + Auth (GitHub & Discord OAuth) via `@supabase/ssr` |
| Syntax highlight | **shiki** (dynamically imported) |
| Image export | **html-to-image** |
| Icons | **lucide-react** |
| Package manager | **bun** (`bun.lock` is the source of truth) |
| Lint / Format | **Biome** (`@biomejs/biome`, config in `biome.json`) |
| Deploy target | `output: 'standalone'` (containerized; runs behind a proxy) |

---

## 2. Commands

Use **bun**. Do not introduce npm/pnpm/yarn lockfiles.

```bash
bun install            # install dependencies
bun run dev            # start dev server (http://localhost:3000)
bun run build          # production build — MUST pass before any PR
bun run start          # run the production build

bun run check          # Biome: lint + format + safe autofixes (writes files)
bun run lint           # Biome: lint/format check only (no writes) — CI gate
bun run format         # Biome: format only (writes files)
```

**Quality gate (run before finishing any task):**
```bash
bun run check && bun run build
```
Both must be clean. `next build` runs the TypeScript type-checker (`typescript.ignoreBuildErrors`
is `false` in `next.config.ts`) and ESLint via `eslint-config-next`, so type and Next lint errors
fail the build.

---

## 3. Project Structure

```
src/
├── app/                         # App Router routes
│   ├── layout.tsx               # Root layout: Outfit + JetBrains_Mono fonts, <Navbar>, metadata
│   ├── globals.css              # Tailwind v4 @theme tokens + component utility classes
│   ├── page.tsx                 # "/"  Discover feed (search + pagination, server component)
│   ├── login/page.tsx           # "/login" GitHub + Discord OAuth (client component)
│   ├── profile/page.tsx         # "/profile?tab=snippets|favorites"
│   ├── favorites/page.tsx       # "/favorites"
│   ├── snippets/new/page.tsx    # create snippet (client form)
│   ├── snippets/[id]/view/page.tsx
│   ├── snippets/[id]/edit/page.tsx
│   ├── coming-soon/ , coming-soon.tsx , not-found.tsx
│   └── auth/callback/route.ts   # OAuth code exchange → session
├── components/
│   ├── navbar.tsx               # top nav + mobile sidebar (client)
│   ├── snippet-card.tsx         # full card (used on view page)
│   ├── snippet-card-compact.tsx # grid card — CANONICAL themed reference component
│   ├── code-block.tsx           # shiki-highlighted block + copy/export-to-PNG
│   └── search-bar.tsx           # debounced search input
├── utils/supabase/
│   ├── client.ts                # createBrowserClient() — for client components
│   ├── server.ts                # createServerClient() — for server components/route handlers
│   └── middleware.ts            # updateSession() — session refresh + route protection
└── lib/utils.ts                 # cn() = clsx + tailwind-merge
middleware.ts                    # wires updateSession into Next middleware
supabase/schema.sql              # database schema, RLS policies, profile trigger
DESIGN.md                        # Digital Verdance design system (UI source of truth)
.jules/                          # accumulated engineering learnings (see §8)
```

---

## 4. Environment & Database

### Environment variables (`.env.local`, see `.env.example`)
```bash
NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key>"
# APP_URL is used by the OAuth callback to build absolute redirects behind a proxy.
```
The Supabase clients fall back to placeholder values when env vars are missing so `bun run build`
still succeeds without secrets — **do not** remove those fallbacks.

### Database (`supabase/schema.sql` — run in Supabase SQL editor)
Three tables, all with **Row Level Security enabled**:
- `profiles` — one row per `auth.users` id; world-readable, self-writable. Auto-created on signup by
  the `handle_new_user()` trigger (pulls `full_name` / `avatar_url` / `user_name` from OAuth metadata).
- `snippets` — `user_id → profiles(id)`; world-readable, owner-writable. PostgREST embeds
  `profiles(...)` via this FK.
- `favorites` — join table `(user_id, snippet_id)` unique; private to the owner.

If you change a query's shape, embed, or column, update `schema.sql` (and its RLS policies) to match.

---

## 5. Authentication & Authorization

- **Auth providers:** GitHub and Discord OAuth (`src/app/login/page.tsx`). The login page is the only
  public entry point.
- **Whole app is gated.** `src/utils/supabase/middleware.ts` redirects unauthenticated users to
  `/login` for every route except `/login` and `/auth/callback`. Logged-in users hitting `/login` are
  bounced to `/`. Keep this invariant when adding routes.
- **Client vs server Supabase:** use `@/utils/supabase/client` in `'use client'` components and
  `@/utils/supabase/server` in server components / route handlers. Never import the server client into
  a client component.
- **Cookie nuance:** `SameSite=None; Secure` in production (HTTPS/iframe), `Lax`/insecure in local
  HTTP dev. This logic is duplicated across the three supabase util files on purpose — keep them in sync.

---

## 6. Design System — NON-NEGOTIABLE

**`DESIGN.md` is the single source of truth for all UI.** The system is **Digital Verdance**:
rigid zero-radius geometry + a single bioluminescent green signal accent on deep forest darkness.

Hard rules (read `DESIGN.md` for the full spec):
- **Use semantic tokens only.** Every color comes from the `@theme` tokens in `src/app/globals.css`
  (e.g. `bg-surface-container`, `text-on-surface`, `border-outline-variant`, `text-primary`). **Never**
  use raw Tailwind palette classes (`neutral-*`, `red-*`, `green-*`, …) or ad-hoc hex values.
- **Never use white** (`#fff`, `text-white`, `bg-white`) for app surfaces or text — use `on-surface`
  (`#dde5da`). *(Only documented exception: third-party OAuth brand buttons, e.g. Discord blurple.)*
- **Border radius: 0 everywhere.** `globals.css` enforces `border-radius: 0 !important` globally; do
  not add rounded corners or fight it.
- **No drop shadows.** Convey depth with darker surface tokens + 1px borders. The only allowed glow is
  the spec's primary hover/active glow.
- **Primary green = signal, not decoration.** Reserve `primary` for active / interactive / success
  state (e.g. favorited heart, active tab). Destructive/error uses the `error*` tokens.
- **Typography:** `Outfit` is the only typeface (loaded in `layout.tsx`); labels/chips are uppercase
  with letter-spacing. Code uses the `--font-mono` (JetBrains Mono) stack.
- **Reusable utilities** live in `globals.css`: `.btn-primary`, `.btn-secondary`, `.btn-ghost`,
  `.input-default`, `.card-container`, `.custom-scrollbar`. Prefer these over re-deriving styles.

**Canonical reference component:** `src/components/snippet-card-compact.tsx` is fully compliant —
mirror its token choices when building or restyling UI.

---

## 7. Code Conventions

- **TypeScript strict.** Avoid `any` where practical (Biome allows it but prefer real types).
- **Formatting (enforced by Biome, `biome.json`):** 2-space indent, single quotes (double for JSX
  attributes), semicolons, trailing commas, ~100 col width. Run `bun run check` rather than formatting
  by hand.
- **Imports:** path alias `@/*` → `src/*` (see `tsconfig.json`).
- **Server components by default;** add `'use client'` only when you need state/effects/handlers.
- **Data fetching pages** set `export const revalidate = 0` to always reflect latest auth/data.
- **Accessibility:** icon-only buttons need `aria-label`; decorative SVGs/icons need `aria-hidden`;
  inputs without a visible `<label>` need `aria-label`; interactive elements get visible
  `focus-visible:ring-2 focus-visible:ring-primary` (use `ring-error` for destructive actions).

---

## 8. Security & Performance Invariants (from `.jules/`)

The `.jules/` directory holds hard-won learnings. **Preserve these guarantees:**

- **IDOR defense-in-depth** (`.jules/sentinel.md`): every client-side `update`/`delete` on
  `snippets`/`favorites` MUST chain `.eq('user_id', currentUser.id)` in addition to RLS. Never remove
  these ownership filters.
- **XSS** (`.jules/sentinel.md`): when rendering user code via `dangerouslySetInnerHTML` (shiki
  fallback in `code-block.tsx`), HTML-escape the input manually. Prefer text nodes / React escaping.
- **Lazy-load heavy deps** (`.jules/bolt.md`): import `shiki` **dynamically** inside the effect that
  uses it (`const { codeToHtml } = await import('shiki')`), never as a top-level import — it bloats the
  first-load bundle.
- **Accessibility** (`.jules/palette.md`): see §7.

When you discover a new non-obvious learning (a security fix, a perf gotcha, a tooling quirk), add a
dated entry to the appropriate `.jules/*.md` file.

---

## 9. Pre-PR Checklist

1. `bun run check` — Biome clean (lint + format).
2. `bun run build` — completes with **no** type or lint errors.
3. UI changes use **only** Digital Verdance tokens (`grep -rE 'neutral-|red-[0-9]|text-white' src/`
   returns nothing except the documented OAuth brand exception).
4. All client `update`/`delete` mutations still carry `.eq('user_id', …)`.
5. New routes respect the "everything requires login" middleware rule.
6. `schema.sql` updated if query shapes/columns changed.
7. Keep changes scoped; do not reformat unrelated files or churn the lockfile.

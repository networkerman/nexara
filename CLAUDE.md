# OneXtel — Claude Working Guide
**Branch: `main` | PM: Udayan Das Chowdhury | May 2026**

---

## What This Repo Is

- **Product:** OneXtel — a CPaaS engagement platform (superset of Onextel's existing Aura product)
- **Codebase name:** Nexara (internal engine name, not visible to users)
- **`main` branch** = the product. There is no separate `onextel` branch anymore.
- **Dev server:** `http://localhost:8080` via `npm run dev`
- **Production:** Vercel — auto-deploys on every push to `main`

---

## Architecture in 8 Lines

```
src/pages/          → One file per route. Thin wrappers — import layout + feature component, nothing else.
src/components/     → Feature components. Heavy logic lives here.
  layout/           → AppLayout.tsx — sidebar + topbar shell used by every authenticated page
  campaigns/        → Campaign list, create wizard, row components
  content/          → Template editor, media library
  ui/               → shadcn/ui components. DO NOT edit these unless fixing a shadcn bug.
src/contexts/       → AuthContext (Supabase auth), DevModeContext (sandbox toggle)
src/types/          → Shared TypeScript types (campaign.ts, database.ts)
src/lib/utils.ts    → cn() only. Before writing any utility, check here first.
```

---

## Conventions — Follow These Exactly

**Styling**
- Tailwind only. No inline styles except `fontFamily: 'var(--font-heading)'` for heading font
- Design tokens: `text-primary` / `bg-primary` = `#FF3535` (brand red). Never hardcode the hex except in AppLayout logo.
- Spacing: cards use `rounded-brand-xl` (12px), buttons/inputs use `rounded-brand-md` (6px)
- Shadows: `shadow-el-1` at rest, `shadow-el-2` on hover
- `cn()` from `@/lib/utils` for conditional classes — never string concatenation
- **Page content width:** data/dashboard pages wrap content in `p-6 max-w-[1400px] mx-auto` (Home, Analytics, Reports, Credits, Account Health, Journeys). Sidebar-nav pages (Content, Audiences, Channels, Governance) use `flex flex-1 min-h-0` to fill fluidly. This keeps content scaling in step with the L1 sidebar expand/collapse. Settings (`max-w-[800px]`) and legal pages (`max-w-4xl`) stay intentionally narrow — do not widen.

**Components**
- shadcn/ui components live in `src/components/ui/` — use them for primitives (Dialog, Select, Input, etc.)
- Our custom components do NOT use shadcn Dialog/Sheet for full-page modals — they use fixed-position divs with backdrop
- Icons: `lucide-react` for UI/utility icons. **Channel brand icons** (WhatsApp, RCS, SMS, Email, Voice) → always use `src/components/icons/ChannelIcons.tsx`. Never use generic Lucide icons as channel substitutes. Import Lucide individually, never `* from lucide-react`.

**State**
- Server state: TanStack Query (`@tanstack/react-query`)
- Local/ephemeral UI state: `useState` / `useReducer`
- Wizard/canvas state: Zustand (used in Journeys)
- Global app state: React Context (AuthContext, DevModeContext)
- Never use localStorage directly — go through the context that owns that concern

**Routing**
- React Router v6. All routes defined in `src/App.tsx`.
- Page routes use `/*` suffix to allow sub-routes (e.g. `/campaigns/*`)
- `AppLayout` reads `location.pathname` to derive the topbar title

**TypeScript**
- Strict. No `any`. If you genuinely need escape hatch, use `unknown` + guard.
- Props interfaces defined inline above the component they belong to (not in a separate types file unless shared across 3+ files)

---

## DO NOT TOUCH

- `src/components/ui/` — shadcn scaffolded files. Edit only to fix a shadcn-specific bug.
- `src/components/ui/sidebar.tsx` — legacy shadcn sidebar, unused. Do not delete (referenced in older pages).
- `public/fonts/` — self-hosted Pluto font files. Never modify.
- `tailwind.config.ts` — design tokens are locked. Ask before adding new tokens.
- `src/contexts/AuthContext.tsx` — Supabase auth wiring. Fragile, don't refactor without full session context.

---

## Key Files — Check Before Writing New Code

| Need | File |
|---|---|
| Add a new page route | `src/App.tsx` + new file in `src/pages/` |
| Change sidebar nav items | `src/components/layout/AppLayout.tsx` — `primaryNav` array |
| Add a new channel | Check `src/pages/Channels.tsx` pattern first, add icon to `src/components/icons/ChannelIcons.tsx` |
| Shared class helper | `src/lib/utils.ts` → `cn()` |
| New form with validation | Use `react-hook-form` + `zod` (see CreateCampaignModal.tsx for reference) |
| Date formatting | Use `luxon` — `DateTime` from `luxon`. NOT `date-fns` (both exist; prefer luxon for new code) |
| Campaign wizard reference | `src/components/campaigns/CreateCampaignModal.tsx` (3003 lines — read before touching) |
| Template editor reference | `src/components/content/CreateTemplate.tsx` |
| Auth guard | `src/components/ProtectedRoute.tsx` |

---

## Mock Data Policy

All data is currently mocked (no live Supabase reads in the UI). Mock data lives inline in each page/component file. Task #12 (Supabase schema wiring) will replace these. When adding new features, continue the mock pattern — don't try to wire live data until #12 is actioned.

---

## Known Gotchas — Read Before Debugging

- **`bun.lockb` + `package-lock.json` both exist** — Vercel uses npm (ignores bun.lockb). If Vercel fails with "Rollup failed to resolve import X", the package is missing from `package.json`. Fix: `npm install <pkg>`, commit `package.json` + `package-lock.json`.
- **`CreateCampaignModal` exports both a component and `fmt`** — causes a Vite HMR "fmt export incompatible" warning. Pre-existing, not a bug. Do not split the file to fix this.
- **Mid-file `import` statements crash React silently** — always put imports at the top of the file. A blank `#root` with no console errors = check for misplaced imports.
- **Channel icon colours** — use muted shades: `text-indigo-400` (SMS), `text-emerald-500` (WhatsApp), `text-blue-400` (RCS), `text-sky-400` (Email), `text-violet-400` (Voice). Never vivid `-600` shades for channel badges.

---

## Commands

```bash
npm run dev        # Start dev server on :8080
npm run build      # Production build
npm run lint       # ESLint
npx tsc --noEmit   # Type-check without building (run before every commit)
```

**Git push:**
```bash
git -c credential.helper='!gh auth git-credential' push origin main
```
GitHub account: `networkerman`. Never use `--no-verify` or amend pushed commits.

---

## Completed Modules (don't re-build these)

Home · Campaigns (list + CreateCampaignModal wizard) · Audiences · Content (Templates + DLT + Media) · Journeys (canvas) · Analytics · Reports · Channels (SMS/WA/RCS/Email/Voice) · Governance (RBAC + Maker-Checker + Audit) · Credits · Account Health · Transaction Health · Settings (Team/Billing/Developers/Integrations/Config) · Developer Mode (Settings → Developers)

## Pending Modules

\#12 Supabase schema · #22 Live Activity Feed · #23 Integration Hub · #24 Support Centre · #25 What's New · #26 Enterprise Onboarding Wizard

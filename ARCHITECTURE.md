# OneXtel Architecture Decisions
*Living document — update when a pattern is introduced or retired*

---

## Why These Decisions Were Made

### No Next.js — Vite + React Router
Onextel's infra team deploys to Netlify with simple SPA config. Next.js SSR adds ops complexity for no user benefit (this is an authenticated app, not a public site). All routes are client-side. If SSR becomes a requirement, this is the main thing to revisit.

### shadcn/ui as primitive layer
shadcn components are copied into `src/components/ui/` — they're our code, not a black-box dependency. This means we can override anything without forking a library. Tradeoff: we own maintenance. Convention: only touch `ui/` files to fix a bug in that specific primitive.

### No Redux / No Zustand for global state (except Journeys)
The app is session-scoped with a single user context. TanStack Query owns server state. Local UI state is `useState`. We introduced Zustand only for the Journey canvas because React Flow requires an external store for node/edge management. Don't introduce Zustand elsewhere without a strong reason.

### Tailwind design tokens (not CSS variables directly)
`rounded-brand-xl`, `shadow-el-1`, `text-primary` etc. are all defined in `tailwind.config.ts`. This means the design system is enforced at the class level, not through a theme file or CSS vars. Changing a token in one place propagates everywhere. Do not define new one-off values inline — add to the config.

### AppLayout owns the shell; pages own nothing structural
Every authenticated page wraps in `<AppLayout>`. AppLayout renders the sidebar, topbar, and content wrapper. Pages should never render their own header or nav. The topbar title is derived automatically from `location.pathname` via the `routeTitles` map in AppLayout — add new routes there when adding pages.

### Mock-first, Supabase-later
The entire UI was built with inline mock data. Supabase schema (Task #12) is written but not yet applied. This was intentional — it let us move fast on UI without blocking on DB schema decisions. When Task #12 is actioned, replace mocks with TanStack Query hooks. The mock data shapes are the contract for what the DB queries should return.

### CreateCampaignModal is a monolith (intentionally)
At 3003 lines, it looks like a problem. It isn't — yet. The wizard has complex inter-step state (validation, persistence, conditional branching) that makes splitting painful without a proper state machine. It uses localStorage persistence with TTL so users don't lose work. Before splitting it, build the state machine first (Zustand or XState). Don't break it into components just to reduce file size.

### Two campaign page components exist (`CampaignsPage` + `CampaignsPageNew`)
`CampaignsPage.tsx` is the legacy Aura-style list (uses shadcn Badge/Button, WhatsApp-only). `CampaignsPageNew.tsx` is the OneXtel multi-channel list. `Campaigns.tsx` (the route page) imports `CampaignsPageNew`. `CampaignsPage` is kept for reference only — do not route to it. It will be deleted when the new list is fully validated.

### Font strategy: Pluto → Montserrat fallback
Pluto (Onextel brand font) is self-hosted in `public/fonts/`. `font-heading` uses Pluto first, Montserrat second. `font-sans` (body/UI) is Montserrat only. Never remove the self-hosted Pluto files — they're a brand requirement. Google Fonts is loaded for Montserrat.

### Developer Mode is a runtime toggle, not a build flag
Dev Mode (Settings → Developers) persists to localStorage and surfaces a SANDBOX badge in the topbar. It is NOT a build-time env flag. This was a deliberate product decision — enterprise customers need to switch between live and test contexts without deploying a different build. The `DevModeContext` owns this concern.

### Channels are not abstracted into a generic interface
SMS, WhatsApp, RCS, Email, Voice each have meaningfully different config surfaces (DLT for SMS, WABA for WhatsApp, RCS aggregators, SMTP/ESP for Email). An attempt to abstract them into a generic `Channel` interface would paper over real differences. Each channel section in `Channels.tsx` is intentionally independent. Share only config patterns (step-by-step onboarding UI), not data models.

---

## Deprecated Patterns (don't copy these)

| Pattern | Where it appears | Why deprecated |
|---|---|---|
| Direct `fetch()` calls | Some legacy pages | Use TanStack Query hooks instead |
| `className` string concatenation | Old campaign components | Use `cn()` from `@/lib/utils` |
| `date-fns` for date formatting | Some campaign form fields | New code uses `luxon` |
| shadcn `Sheet` for slide-overs | Was proposed for Campaign detail | We use fixed-position divs with backdrop instead — more control |

---

## Decisions Still Open

- **Supabase RLS policy design** — multi-tenant (enterprise + reseller) RLS is non-trivial. Document when Task #12 is actioned.
- **Real-time delivery updates** — Supabase Realtime vs polling. Depends on volume. Decide when Live Activity Feed (#22) is built.
- **Journey execution engine** — the canvas is built; the server-side trigger/execution layer is not. Will need a separate service (not Supabase Edge Functions alone).
- **Email channel backend** — marketed, UI built, no ESP wired. Decision pending on SendGrid vs AWS SES vs direct SMTP.

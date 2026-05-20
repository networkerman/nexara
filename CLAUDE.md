# OneXtel — Project Context for Claude
**Branch: `onextel` | PM: Udayan Das Chowdhury | May 2026**

---

## What This Project Is

This is the `onextel` branch of the Nexara codebase. The product being built is **OneXtel** — a new engagement platform that is a superset of Onextel's existing Aura product.

- **Aura** = current production platform (onexaura.com). Telecoms operator console — SMS/WhatsApp/RCS broadcast tool. Java + React V2.
- **OneXtel** = new product layer built on top of Nexara (React + Vite + Supabase + Tailwind). Solves the problems Aura never solved.
- **Nexara** = the codebase/engine name. Not visible to end users.
- The `main` branch is the Nexara baseline. The `onextel` branch is the product.

---

## Design System

All UI follows the **Onextel Design System** — defined in `/AI Projects/onextel/DESIGN.md`.

Key tokens:
- Primary red: `#FF3535` (Tailwind: `text-primary`, `bg-primary`, or `text-brand-red`)
- Charcoal: `#2E2E2E` (sidebar background, dark text)
- Font headings: Pluto → Montserrat fallback (`font-heading`)
- Font body/UI: Montserrat (`font-sans`)
- Card shadow at rest: `shadow-el-1` → `0 1px 4px rgba(0,0,0,0.08)`
- Card shadow on hover: `shadow-el-2` → `0 4px 16px rgba(0,0,0,0.12)`
- Border radius standard: `rounded-brand-xl` (12px for cards), `rounded-brand-md` (6px for buttons/inputs)
- Button primary: red fill, white Montserrat Bold 17px, 6px radius, 12px 24px padding

---

## The Problem We Are Solving

Full detail in `PROBLEMS.md`. Summary of the 8 problems in priority order:

1. **Data trust** — Delivery counts are wrong. Customers can't trust the platform. "Awaited" transactions get stuck and require manual DB fixes.
2. **Reporting self-serve** — 1,126 support tickets about reports. Customers call support because the product can't give them their own data.
3. **Enterprise governance** — No RBAC, no Maker-Checker, no audit log. Blocking every BFSI and Govt deal.
4. **Failure visibility** — Campaigns fail silently. No alerts, no failure reasons, no template sync status.
5. **Journey Automation** — Aura is a broadcast tool. No trigger-based, conditional, multi-step sequences.
6. **Audience Management** — Contacts are a flat phonebook. No segmentation, no event history.
7. **Unified Content / Templates** — Templates siloed per channel (DLT for SMS, WARCS for WA/RCS). No unified library.
8. **Channel onboarding** — RCS generated 339 onboarding support tickets. Setup is not self-serve.

---

## Current Product Structure (Aura Today)

What exists in Aura (onexaura.com) that OneXtel must be a superset of:

**Sidebar:** Dashboard · Campaign · User Management · Credits · Channels · Reports · Telco Reports · DLT · API · Phonebook · Config

**What's shipped and working:**
- SMS: DLT template management, bulk campaigns, scheduling, Sender ID mapping, reports
- WhatsApp/RCS: Templates (LTO/Carousel/Catalog/Flows), campaigns, URL shortener, frequency capping, plugins
- CRM integrations: CleverTap, MoEngage, WebEngage live; Shopify + LeadSquared in progress
- Reseller/whitelabel mode (partial)
- Multi-provider setup (multiple WA + RCS vendors)

**What's NOT in Aura:**
- Journey automation (entirely absent)
- Audience segments (only flat phonebook)
- Unified cross-channel reporting
- Email channel (marketed, not built)
- Voice channel (marketed, not built)
- RBAC (in every platform's P0 backlog)
- Maker-Checker (being built, currently buggy — PROD-311)
- Audit log (absent everywhere)
- AI features (marketed as "AI orchestration", nothing built)

---

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **Backend:** Supabase (auth + database + realtime)
- **Payments:** Razorpay (already integrated)
- **State:** TanStack Query for server state
- **Charts:** Recharts (for dashboards/analytics)
- **Journey builder:** React Flow + Zustand (planned)
- **Deploy:** Netlify

---

## Task List (17 tasks)

See task manager for live status. Dependency order:

**Unblocked now:** #1 Rebrand · #2 Pluto font · #12 Supabase schema · #13 Governance · #14 Credits · #15 Reporting

**Blocked by #1:** #3 Sidebar redesign
**Blocked by #3:** #4 Dashboard · #5 Campaigns · #6 Audiences · #7 Content · #9 Channels · #11 On-site · #16 Transaction Health

**Blocked by #3 + #12:** #6 Audiences · #7 Content
**Blocked by #7 + #6 + #12:** #8 Journey Builder
**Blocked by #5 + #8 + #15:** #10 Analytics
**Blocked by #3 + #15:** #17 Account Health

---

## Key Customers to Design For

- **SBI** — 1,295 support tickets. Needs: reliable delivery counts, SFTP report push, RBAC
- **DMI Finance / Credgenics** — BFSI, needs Maker-Checker
- **CRIS / NICSI** — Government, needs DLT compliance, template sync, VAPT
- **KPN** — Fallback routing issues (PROD-345, PROD-389)
- **Hero FinCorp / OYO / Growtele** — Automated SFTP report delivery

---

## Source Documents

- `/AI Projects/onextel/DESIGN.md` — Full Onextel design system
- `/AI Projects/nexara/PROBLEMS.md` — Full problem analysis with data sources
- `/Documents/OneXtel Visions/OneXtel-Product-Teardown-Phase1.docx` — Phase 1 audit
- `/Documents/OneXtel Visions/onexaura_v2_architecture.html` — V2 architecture diagram
- `/AI Projects/CPaaS-Competitive-Brief.docx` — Competitive landscape
- JIRA AURA project — feature backlog (auth: udayan.chowdhury@onextel.com)
- JIRA PROD project — production issues (376 tickets, Apr–May 2026)

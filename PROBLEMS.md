# OneXtel — Problems We Are Solving
**Branch: `onextel` | Stage: Identification | Last updated: May 2026**

> This document is the foundation for every product decision in OneXtel.
> It exists to answer one question: **what pain, exactly, are we building against?**
> Sources: Product Teardown Phase 1, Support Ticket Analysis (7,139 tickets), PROD JIRA (376 tickets, Apr–May 2026), AURA dashboard screenshot, JIRA AURA project samples.

---

## The One-Line Problem Statement

Onextel's current platform (Aura) is a **telecoms operator console** — built for ops teams checking delivery logs, not for marketers building customer relationships. It handles SMS, WhatsApp, and RCS well at the infrastructure level, but it does not give customers the tools to understand, act on, or improve their communications. **OneXtel is the product layer that Aura never built.**

---

## Problem 1 — Customers Cannot Trust Their Own Data
**Signal strength: CRITICAL across all three data sources**

### What's happening
- Submitted vs. Delivered counts are wrong. Customers see one number on the dashboard and a different number when they reconcile with their own systems.
- "Awaited" transactions get stuck permanently. Engineers manually run DB commands to "Mark Awaited to Failed/Delivered" — this is a recurring ops ritual (8+ PROD tickets: PROD-200, PROD-291, PROD-378, PROD-183, PROD-228, PROD-94, PROD-164, PROD-213).
- Two data centres (Ocean DC and Ocean DR) show different counts for the same traffic.
- Reports take 30–40 seconds to load (PROD-301). Customers give up and call support.

### The numbers
- 1,841 "Delivery Concern" support tickets — single largest category
- 1,126 "Reports" support tickets — second largest category
- 97 PROD tickets in 7 weeks categorised as Reports/MIS — the #1 PROD category
- 58 PROD tickets categorised as Delivery/Status

### What we solve for in OneXtel
- Accurate, real-time delivery funnel: Submitted → Dispatched → Delivered → Read → Clicked → Converted
- Self-serve "stuck transaction" repair UI — no more PROD tickets for manual DB fixes
- Single source of truth across DC/DR — no more count discrepancies visible to customers
- Reports load in <3 seconds or stream progressively

---

## Problem 2 — The Platform Is Invisible When Things Go Wrong
**Signal strength: HIGH**

### What's happening
- Campaign failures show no reason. Operators can't self-debug (AURA-11390).
- Callback failures arrive with no error context (PROD-308, PROD-340, PROD-382).
- Content/template mismatch errors kill live campaigns silently (PROD-173 CRIS, PROD-390 INFI, PROD-396).
- No email alerts on campaign failures — customers find out from their own users (AURA-11542).
- The platform goes down with no customer-facing status (PROD-206 Onexaura portal down, PROD-398 HTTP 502).

### What we solve for in OneXtel
- Every failure surfaces a human-readable reason with a suggested fix
- Campaign health alerts: email + in-app notification on failure, delivery drop, or budget threshold
- Template sync status visible at all times — customers know if their WhatsApp/RCS templates are approved
- Platform status page (public) + in-app banner on degradation

---

## Problem 3 — Enterprise Customers Cannot Use the Platform Safely
**Signal strength: CRITICAL — actively blocking deals**

### What's happening
- No RBAC. Every user in an organisation has the same permissions. A junior operator can delete campaigns, export contact lists, or change API keys.
- No Maker-Checker. Banks, NBFCs, and government agencies require dual approval before any campaign goes live. This is a regulatory requirement, not a preference. Deals are being lost because of this.
- No audit log. No way to know who did what, when. Compliance teams cannot sign off.
- Maker-Checker is being built but already generating bugs in production (PROD-311: Multiple Issues in Maker Checker Workflow).

### The numbers
- RBAC and Maker-Checker listed as P0 on every single Aura platform (SMS, WhatsApp/RCS, I2I, Govt, UAE)
- Top customers: SBI (1,295 support tickets), DMI Finance (129), Credgenics (73) — all BFSI, all require governance
- PROD-305: Critical bug in User Management / Roles and Access Control

### What we solve for in OneXtel
- RBAC: six roles minimum (Super Admin, Admin, Campaign Manager, Analyst, Viewer, API User), configurable per module
- Maker-Checker: configurable approval gate on campaign launch, template creation, contact import, large sends
- Audit log: every action logged, searchable, exportable — immutable
- These three ship as a single "Governance" module, positioned as the enterprise unlock

---

## Problem 4 — Reporting Is a Support Burden, Not a Product Feature
**Signal strength: CRITICAL**

### What's happening
- Customers cannot get the data they need from the product. They raise a support ticket instead.
- Custom report downloads don't exist — customers have to take whatever columns the system gives them (AURA-11614).
- No scheduled report delivery (SFTP/email) — enterprise customers need daily reports pushed to their systems (PROD-137 Hero FinCorp, PROD-363 ILDO, PROD-376 OYO, PROD-380 Growtele).
- AM (Account Manager) Report Dashboard absent — AMs have no visibility into their accounts without manually pulling data (P0 gap from Teardown).
- All reports are in IST. UAE customers and global senders cannot use them (AURA-9233).

### What we solve for in OneXtel
- Self-serve report builder: pick channels, date range, dimensions, metrics — download on demand
- Scheduled delivery: configure reports to arrive via email or SFTP on a schedule
- Account Manager view: dedicated dashboard showing every account's health at a glance
- Timezone-aware: all reports respect the user's configured timezone

---

## Problem 5 — The Platform Has No Channels Beyond SMS/WhatsApp/RCS
**Signal strength: HIGH — positioned but not built**

### What's happening
- Email is marketed on the Onextel website. There is no email roadmap.
- Voice/IVR is marketed on the Onextel website. There is no voice roadmap.
- The Teardown confirms: "Email Channel — Medium urgency — Email is marketed as a channel — no email platform roadmap found."
- Without Email and Voice, "omnichannel" is a marketing claim, not a product truth.

### What we solve for in OneXtel
- Email as a first-class channel: from domain setup, DKIM/SPF, template editor, delivery reporting
- Voice as a first-class channel: caller ID, IVR script attachment, recording config, delivery reporting
- All channels surfaced in a single campaign, journey, and analytics interface

---

## Problem 6 — There Is No Journey Automation
**Signal strength: HIGH — entirely absent from Aura**

### What's happening
- Aura is a broadcast tool. You pick a list, pick a template, send. That's it.
- There is no way to send a message based on what a user did (trigger-based).
- There is no way to send a follow-up based on whether the first message was read.
- There is no multi-step sequence, no conditional branching, no wait step.
- Competitors — Infobip (Moments), CleverTap, MoEngage — all have this. Aura's plugin integrations with CleverTap and MoEngage are a workaround for this exact gap.

### What we solve for in OneXtel
- Visual journey builder: drag-drop canvas with Trigger → Message → Condition → Wait → Goal nodes
- Trigger types: event-based (purchase, form submit, URL visit), segment entry, API, schedule
- Multi-channel within one journey: WhatsApp → wait 2 hours → if not read → SMS fallback
- This is the feature that moves OneXtel from "broadcast tool" to "engagement platform"

---

## Problem 7 — Onboarding New Channels Is Too Hard
**Signal strength: HIGH — 339 RCS onboarding tickets alone**

### What's happening
- RCS generated 339 support tickets in the onboarding category. A new channel that customers want to use is creating a support tsunami because the setup process isn't self-serve.
- API key generation requires ops involvement — no in-UI API key generator (AURA-11608).
- Timezone defaults to IST — blocks non-Indian customers from setting up correctly.
- WhatsApp Embedded Signup flow has a live Data Localization API failure (PROD-341, Critical, open).
- No language selector on the UI — non-English operators cannot use the platform (AURA-11610).

### What we solve for in OneXtel
- Self-serve channel connection: guided setup wizard for each channel (WhatsApp, RCS, SMS, Email, Voice)
- In-UI API key generator with scoped permissions
- Timezone selection on account setup — default to user's locale, not IST
- UI internationalisation foundation (English first, Hindi + Arabic ready)

---

## Problem 8 — Contacts Are a Flat List, Not an Audience
**Signal strength: MEDIUM — structurally limiting all of the above**

### What's happening
- Aura's "Phonebook" is a flat contact list. No segmentation, no properties, no event history.
- You cannot send a campaign to "customers who received a message in the last 7 days but didn't click."
- You cannot build a journey that triggers when "a contact's tag changes to 'churned'."
- Without audience management, journey automation and personalisation are impossible.

### What we solve for in OneXtel
- Contacts with properties: name, phone, email, tags, custom fields, channel opt-in status per channel
- Segment builder: rule-based (field + operator + value), with AND/OR logic and live count preview
- Event history per contact: every message sent, delivered, read, clicked — queryable
- Import with deduplication, column mapping, and validation

---

## Priority Order (What to Solve First)

These are ordered by: **trust restoration → deal unblocking → growth surface**.

| # | Problem | Why This Order |
|---|---|---|
| 1 | **Data trust** (accurate counts, stuck transactions) | Every other feature is undermined if the numbers are wrong |
| 2 | **Reporting self-serve** (builder, scheduled, AM view) | Converts 1,000+ support tickets into product usage |
| 3 | **Governance** (RBAC, Maker-Checker, Audit Log) | Unlocks BFSI and Govt deals currently blocked |
| 4 | **Failure visibility** (alerts, error reasons, template sync) | Reduces PROD ticket volume immediately |
| 5 | **Journey Automation** | Moves category from broadcast tool to engagement platform |
| 6 | **Audience Management** | Prerequisite for Journey and advanced segmentation |
| 7 | **Content / Templates unified** | Prerequisite for Journey and multi-channel campaigns |
| 8 | **Channel onboarding** (self-serve setup wizards) | Reduces RCS/WA onboarding support load |
| 9 | **Email + Voice** | Completes the omnichannel story |

---

## What OneXtel Is Not Solving (Scope Boundaries)

- **I2I / ILDO carrier routing** — this is infrastructure, not product UI. PROD tickets here are backend engineering work, not a OneXtel feature.
- **Ocean DC/DR synchronisation** — infrastructure problem. OneXtel surfaces the symptom (count discrepancy) but doesn't fix the underlying replication.
- **DLT compliance engine** — Aura handles DLT well. OneXtel wraps it, doesn't replace it.
- **Telco-grade SMPP** — existing backend. OneXtel does not touch the routing layer.

---

*Source data: Aura Product Teardown Phase 1 (May 2026) · Support Ticket Analysis (7,139 tickets) · PROD JIRA (376 tickets, Apr–May 2026) · AURA JIRA samples · onexaura.com dashboard screenshot · V2 architecture diagram*

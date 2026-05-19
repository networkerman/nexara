# oneXtel — Product State & Direction Report
**Prepared for: Leon & Tarik**
**From: Udayan Das Chowdhury, Director of Products**
**Date: May 2026 | Confidential**

---

## Executive Summary

This report consolidates findings from four independent data sources: a full product teardown of the Aura platform, analysis of 7,139 customer support tickets, 376 production incident tickets raised in the last 7 weeks, and a competitive landscape review of the $21–23B global CPaaS market.

**Three findings define the situation:**

1. **Aura is a strong infrastructure business with a weak product surface.** The routing, delivery, and operator connectivity layer is genuinely world-class. The customer-facing product on top of it is not. Customers interact with Aura to send messages; they do not use it to understand, improve, or automate their communications.

2. **The product is losing enterprise deals it should be winning.** RBAC, Maker-Checker, and Audit Logs are absent from every platform. These are not feature requests — they are procurement requirements for every BFSI and Government customer. Deals are being lost because of their absence, not because of pricing or channel coverage.

3. **The path forward is clear.** oneXtel is not a redesign of Aura. It is the product layer that Aura never built — built on Aura's infrastructure, surfacing it through an engagement platform that customers actually want to use daily.

---

## Part 1 — What Aura Is Today

### The Product in One Sentence
Aura is a **telecoms operator console** — built for ops teams verifying SMS delivery, not for marketers building customer relationships.

The current UI (`onexaura.com`) reflects this. The sidebar reads: Dashboard · Campaign · User Management · Credits · Channels · Reports · Telco Reports · DLT · API · Phonebook · Config. The dashboard shows a bar chart of Submitted/Delivered/Failed/Awaited counts by day of week. It is a monitoring tool, not an engagement tool.

### Platform Architecture
Aura V2 is technically well-designed. The core stack:

- **Input layer:** Campaign UI (Java + React), gRPC API (Erlang, high-throughput), SMPP operator connections, Plugin integrations (MoEngage, CleverTap)
- **Core:** Distributed Docker Hubs with horizontal scaling and no single bottleneck → Routing Engine → Kafka event streaming (MO/MT/DLR)
- **Channels:** Meta WhatsApp Business API, Jio RCS, Vi RCS, SMS Operators (Airtel, Jio, Vi, BSNL)
- **Data:** Doris OLAP (analytics, separated from transactional DB), PostgreSQL (transactions), Apache RocksDB (persistent KV), Redis (session cache)
- **Support services:** Media Server, WARCS-Auth, Callback Server, Billing

The architecture shows maturity. Kafka-based event streaming and separated OLAP are the right choices at scale. The infrastructure is not the problem.

### What's Actually Shipped and Working

**SMS Platform (V2)**
- Full DLT compliance: PE-TM chain binding, Sender ID and Entity ID mapping — a genuine India-market differentiator
- Single Endpoint API
- Campaigns: bulk file upload, dynamic campaigns, scheduling
- Reports: Summary, Detailed, Sender ID-wise, Template, Campaign, Latency, Clicker
- CRM plugins live: CleverTap, MoEngage, WebEngage; Shopify and LeadSquared in progress
- 2FA login, global blacklist/whitelist, data masking, error code mapping

**WhatsApp and RCS (WARCS)**
- Template breadth: ~90–95% of Meta/Jio/Vi spec shipped — LTO, Carousel, Product Catalog, Flows
- Campaigns: multi-file, exclude file, duplicate check, scheduling, test send, batching, clone
- Link tracking and URL shortener
- Reporting: Summary + Detailed + Download Centre + button click + URL click tracking
- Frequency capping, time windows
- Multi-provider setup: multiple WhatsApp and RCS vendors, including resellers
- Billing: category/region-wise for WhatsApp; Basic/Rich-wise for RCS
- Reseller/whitelabel mode: domain, short URL, logo, embedded signup
- Plugins: CleverTap and MoEngage integrations live

**Platform**
- Four concurrent deployments: Aura Domestic (V2), I2I (International-to-International), ILDO (International Long Distance), Government SMS
- Active government clients: NICSI, IOCL BSNL, CRIS, ICSI, Indian Bank — strong public-sector position
- UAE Phase 1 live — first international market deployment

---

## Part 2 — What's Broken (Evidence-Based)

This section is grounded in production incident data. These are not hypothetical risks.

### 2.1 Customers Cannot Trust Their Own Numbers
**Source: 1,841 support tickets (Delivery Concern) + 97 PROD tickets (Reports/MIS) in 7 weeks**

The Submitted vs. Delivered count mismatch is the single most-reported problem across every data source. Customers reconcile their send records against Aura's dashboard and see different numbers. The platform's delivery data cannot be independently verified.

The symptom surfaces as a recurring operational pattern: engineers are manually running database commands every few days to update stuck "Awaited" transactions to Delivered or Failed. At least 8 production tickets in the last 7 weeks are exactly this manual intervention (PROD-200, PROD-291, PROD-378, PROD-183, PROD-228, PROD-94, PROD-164, PROD-213). This is not a bug that will be fixed once — it is a broken automated process being patched by hand, indefinitely.

Two data centres (Ocean DC and Ocean DR) show different counts for the same traffic, compounding the confusion for enterprise customers who see inconsistent numbers depending on which DC they hit.

### 2.2 Reporting Is a Support Burden, Not a Product Feature
**Source: 1,126 support tickets (Reports category) + 97 PROD tickets**

1,126 customers raised support tickets in the reporting category. This means customers are calling support to get their own data — the product is not giving it to them. Reports take 30–40 seconds to load (PROD-301). There is no custom column selection, no scheduled delivery to SFTP or email, no timezone support (everything runs on IST, blocking UAE and global customers). Account Managers have no dashboard to view their accounts without manually pulling data.

The practical consequence: enterprise customers — SBI, Hero FinCorp, OYO, Growtele — are on recurring manual report requests that generate PROD tickets (PROD-137, PROD-363, PROD-376, PROD-380) and consume engineering time weekly.

### 2.3 Campaigns Fail Silently
**Source: PROD tickets — AURA-11390, AURA-11542, PROD-308, PROD-340, PROD-173, PROD-390, PROD-396**

When a campaign fails, the current platform does not tell the customer why. Failure reasons are not visible in the UI (AURA-11390). There are no email alerts on campaign failures (AURA-11542). Template content mismatches are killing live campaigns for regulated customers — CRIS (government), INFI portal, and others — with no in-product explanation (PROD-173, PROD-390, PROD-396). The only signal customers have is that their messages did not arrive.

### 2.4 Platform Performance Is Degrading
**Source: PROD-300, PROD-301, PROD-398**

Login to Ocean DC takes 35–40 seconds (PROD-300, Priority: Highest). WhatsApp and RCS report pages take 30–40 seconds to load (PROD-301). The platform returned HTTP 502 (PROD-398). These are not isolated incidents — they indicate systemic load or configuration problems at the data centre level.

### 2.5 Enterprise Governance Is Absent — Deals Are Blocked
**Source: Product Teardown + PROD-305, PROD-311**

RBAC and Maker-Checker appear as P0 items on every single Aura platform. They are not gaps in a roadmap — they are active blockers on enterprise deals. Banks, NBFCs, and government agencies have procurement requirements mandating role-based access, dual approval workflows, and audit trails before any external communications platform can be deployed.

Maker-Checker is currently being built but already generating critical bugs in production (PROD-311: Multiple Issues in Maker Checker Workflow for Campaign Approval and Scheduling Time Validation). RBAC also has a critical open bug (PROD-305: Multiple Issues in TUC User Management Roles and Access Control).

### 2.6 I2I and ILDO Are in a Sustained Crisis
**Source: Product Teardown + 18 PROD tickets**

The international routing platforms (I2I and ILDO) have the most open critical issues of any platform. The billing query takes 8–10 hours — finance cannot get daily reconciliation. Indian carriers are incorrectly showing in international routing consoles. Report data is wrong. CDR logs are missing for at least one major client (revenue reconciliation impossible). The '+' symbol routing issue puts ₹0.5 Cr revenue at risk. These are not new bugs — several have been open for multiple sprints.

---

## Part 3 — What's Missing Entirely

These capabilities are not on any current roadmap. They represent the gap between Onextel's public positioning and what the product actually delivers.

### AI / OneX Aura Intelligence
Onextel markets "AI orchestration" as a primary product differentiator. There are zero AI feature work items in the current roadmap. No LLM integration, no AI-based routing, no conversational flows, no send-time optimisation. In the competitive landscape, Infobip has launched AgentOS — a mature AI agent orchestration layer across all channels. Telnyx is positioning as agent-native. Twilio has Conversational Relay for Voice AI. The gap between Onextel's AI positioning and its AI delivery is the single largest credibility risk.

### Journey Automation
Aura is a broadcast tool. You pick a list, pick a template, send. There is no trigger-based sending (send this message when a customer does X), no conditional branching (if they read it, do this; if they don't, do that), no multi-step sequences, no wait steps. The plugin integrations with CleverTap and MoEngage exist specifically because customers need journey automation and Aura cannot provide it — they go to third-party tools instead. Every competitor in Tier 1 and Tier 2 (Infobip Moments, Twilio Studio, Sinch Engage) has this built.

### Email Channel
Email is listed as a channel on the Onextel website. There is no email platform, no email roadmap, and no email architecture documented anywhere.

### Voice / IVR
Voice is listed as a channel on the Onextel website. There is no voice roadmap. A separate Voice team may exist but it does not surface in the product documentation or JIRA roadmap.

### Audience Management
Aura has a "Phonebook" — a flat list of contacts. There is no segmentation, no contact properties, no event history, no rule-based audience builder. Without audience management, journey automation is impossible and campaign personalisation is limited to variable substitution in templates.

### Developer Portal
There is no unified API documentation, no SDK, no sandbox environment, and no API key generator in the product UI (AURA-11608). Multiple API versions exist across platforms. Developer experience is not in the current roadmap. For a company that markets itself as a CPaaS, this is a significant gap.

### 365cx.io Contact Centre
365cx.io is referenced as a flagship product with customer testimonials on the website. It does not appear in the product roadmap. Its maintenance status, rebuild status, or separate roadmap is unknown from the available data.

### Unified Cross-Channel Dashboard
Every channel is siloed. There is no view that shows a customer's communications across SMS, WhatsApp, RCS, Email, and Voice in a single place. Competitors have had this for two to three years.

---

## Part 4 — The Competitive Position

The global CPaaS market is valued at $21–23B in 2026 and growing at 19–33% CAGR. The four Gartner Magic Quadrant Leaders are Twilio, Infobip, Sinch, and Vonage. The challengers gaining ground fastest are Telnyx and Plivo on price and AI-first positioning.

**Where Onextel has a real advantage:**
- DLT compliance and TRAI alignment — this is an India-specific moat that global players do not have
- Carrier-direct operator relationships (Airtel, Jio, Vi, BSNL) — delivery rates that international aggregators cannot match
- Government contract base (NICSI, CRIS) — validates enterprise trust and creates reference customers
- WhatsApp and RCS feature breadth at ~90–95% of the Meta/Jio/Vi spec

**Where Onextel is behind:**
- AI: Infobip's AgentOS is the current benchmark — generative AI integrated into communication flows. Onextel has nothing.
- Journey orchestration: every Tier 1 player has this. Onextel's customers go to CleverTap and MoEngage instead.
- Developer experience: Twilio and Telnyx set the standard. Onextel has fragmented API versions and no sandbox.
- RCS at scale: Sinch and Infobip have carrier partnerships that deliver higher RCS reach. Onextel's RCS coverage is limited to Jio and Vi.

**The window:** Onextel's India-market infrastructure advantage is real and durable. The risk is that global players are now investing heavily in India (Infobip, Sinch both have India offices and local carrier partnerships). The window to build the product layer on top of the infrastructure advantage is 12–18 months.

---

## Part 5 — What oneXtel Must Be

oneXtel is not a visual refresh of Aura. It is the engagement platform that Aura's infrastructure makes possible but never delivered. The relationship is: **Aura handles messages. oneXtel handles outcomes.**

### The Superset Definition

| Capability | Aura Today | oneXtel |
|---|---|---|
| **Channels** | SMS, WhatsApp, RCS | + Email, + Voice |
| **Campaigns** | Bulk broadcast, scheduling | + Journey automation, + A/B testing |
| **Templates** | Per-channel silos (DLT for SMS, WARCS for WA/RCS) | Unified library across all channels |
| **Contacts** | Flat phonebook | Segments, event history, rule builder |
| **Reporting** | Per-channel, often wrong, IST only | Unified, accurate, self-serve, timezone-aware |
| **Governance** | None (RBAC and Maker-Checker in development, buggy) | RBAC + Maker-Checker + Audit Log as a stable, complete module |
| **Failure visibility** | Silent failures | Every failure surfaced with reason + suggested fix |
| **Delivery trust** | Counts wrong, manual DB fixes | Accurate funnel, self-serve transaction repair |
| **AI** | Zero features | Intelligent routing, send-time optimisation, conversational flows |
| **Developer** | Fragmented APIs, no sandbox | Unified API, one SDK, API key generator in UI |
| **Billing** | Per-channel credits | Unified wallet, cross-channel spend dashboard |
| **Onboarding** | 339 RCS onboarding support tickets | Self-serve setup wizard per channel |

### The 8 Problems in Priority Order

These are ordered by business impact — trust restoration first, deal unblocking second, growth surface third.

**Priority 1 — Data trust**
Accurate delivery counts and a self-serve "stuck transaction" repair tool. Until this is fixed, every other feature is undermined by customers who cannot trust the numbers the platform shows them.

**Priority 2 — Reporting self-serve**
A report builder, scheduled delivery (SFTP/email), timezone support, and an Account Manager view. This converts over 1,000 recurring support tickets into product usage.

**Priority 3 — Enterprise governance**
RBAC, Maker-Checker, and Audit Log as a single, stable module. This directly unlocks BFSI and Government deals currently blocked by their absence.

**Priority 4 — Failure visibility**
Alerts on campaign failures, human-readable error reasons, template sync status indicators. This reduces PROD ticket volume immediately and restores customer confidence in the platform's reliability.

**Priority 5 — Journey Automation**
Trigger-based, multi-channel, conditional journey builder. This moves oneXtel from broadcast tool to engagement platform and removes the dependency on CleverTap and MoEngage for automation.

**Priority 6 — Audience Management**
Contact properties, segment rule builder, event history. Prerequisite for Journey Automation and campaign personalisation.

**Priority 7 — Unified Content and Templates**
Single template library across SMS (DLT), WhatsApp, RCS, Email, and Voice. Prerequisite for Journey Automation and multi-channel campaigns.

**Priority 8 — Channel onboarding and Email/Voice**
Self-serve setup wizards for each channel. Email and Voice as first-class channels. Completes the omnichannel story.

---

## Part 6 — What Has Changed Since the Initial Analysis

The initial analysis was directionally correct. The data has since quantified and sharpened every finding.

**What strengthened:**
- Reporting as the #1 problem is now triple-confirmed: Product Teardown identified it, 1,126 support tickets measure it, 97 PROD tickets in 7 weeks prove it is not improving.
- The manual "Mark Awaited" operation — initially identified as a broken process — is now confirmed as an ongoing weekly ritual with at least 8 recurring PROD tickets. This is more severe than initially assessed.
- SBI's operational complexity is now visible: 1,295 support tickets and multiple PROD-priority incidents make them the highest-maintenance enterprise customer, and a signal for what enterprise-grade tooling must look like.

**What is new:**
- The internal name for the V2 UI is **"OMNI"** — visible in PROD ticket prefixes (OMNI|Reports|..., OMNI|New SMS|...). This has branding implications for oneXtel's positioning.
- Maker-Checker is already in active development, not absent — but it is already generating critical bugs (PROD-311). The task is stabilisation and product-quality delivery, not greenfield build.
- The PROD backlog open rate is **43%** across 376 tickets raised in 7 weeks. The support system shows 13% open — a misleading headline. PROD is where the hard, unresolved issues live.
- RCS onboarding friction is quantified: **339 support tickets** in onboarding category for a channel that has been live less than 2 years. Self-serve setup is not a nice-to-have.
- Ocean DC vs Ocean DR discrepancy is a live production issue causing customer-visible count differences — not in the initial teardown.

**What is confirmed but had no data before:**
- Voice has 431 support tickets — it is real and active, not just a website claim. The lack of a voice roadmap in JIRA is a gap, not an indicator of low demand.
- Credits/billing generated 484 support tickets — the wallet and billing experience needs significant improvement beyond what the current Credits page provides.

---

## Summary for Leon and Tarik

Onextel's infrastructure is an asset. Aura's customer-facing product is a liability — not because it is poorly built, but because it was built for the wrong user. It is an operator console in a market that is moving toward engagement platforms.

The support and production data make the cost of the status quo concrete: over a thousand customers raising tickets every week because the product cannot show them their own data; enterprise deals blocked by absent governance features; engineering teams running manual database fixes as a weekly ritual; a platform that goes silent when things go wrong.

oneXtel addresses this with a clear, sequenced product plan. The first three priorities — data trust, reporting self-serve, and enterprise governance — do not require new infrastructure. They require product. The infrastructure to deliver accurate counts, flexible reports, and role-based access already exists in Aura's backend. What is missing is the surface that exposes it to customers in a way they can actually use.

The market window is real. Onextel's DLT compliance, carrier relationships, and government customer base are advantages that no global player can replicate quickly. The question is whether oneXtel gets built before Infobip, Sinch, or a well-funded Indian challenger closes the gap on the product layer.

---

*Sources: OneXtel Product Teardown Phase 1 (May 2026) · Customer Support Ticket Analysis (7,139 tickets) · JIRA PROD project (376 tickets, April–May 2026) · JIRA AURA project samples · V2 architecture diagram · CPaaS Competitive Landscape Brief (May 2026) · onexaura.com live product*

*Prepared by Udayan Das Chowdhury, Director of Products, Onextel · May 2026*

# oneXtel — Product State & Direction Report
**Prepared for: Leon & Tarik**
**From: Udayan Das Chowdhury, Director of Products**
**Date: May 2026 | Confidential**

---

## Executive Summary

This report consolidates findings from four independent data sources: a full product teardown of the Aura platform, analysis of 7,139 customer support tickets, 376 production incident tickets raised in the last 7 weeks, and a competitive landscape review of the $21–23B global CPaaS market.

**Three findings define the situation:**

1. **Aura is a strong infrastructure business with a weak product surface.** The routing, delivery, and operator connectivity layer is genuinely world-class. The customer-facing product on top of it is not. Customers use Aura to send messages — they do not use it to understand, improve, or automate their communications.

2. **The product is losing enterprise deals it should be winning.** RBAC, Maker-Checker, and Audit Logs are absent from every platform. These are not feature requests — they are procurement requirements for every BFSI and Government customer. Deals are being lost because of their absence, not because of pricing or channel coverage.

3. **The path forward is clear.** oneXtel is not a redesign of Aura. It is the product layer that Aura never built — surfacing Aura's infrastructure through an engagement platform that customers actually want to use daily.

---

## Part 1 — What Aura Is Today

### The Product in One Sentence
Aura is a **telecoms operator console** built for ops teams verifying SMS delivery, not for marketers building customer relationships. The current UI (`onexaura.com`) reflects this — the sidebar reads: Dashboard · Campaign · User Management · Credits · Channels · Reports · Telco Reports · DLT · API · Phonebook · Config. The dashboard is a bar chart of Submitted/Delivered/Failed/Awaited counts by day of week. It is a monitoring tool, not an engagement tool.

---

### Full Feature Inventory — What's Actually Shipped

**SMS Platform (V2)**
- DLT Template Management (full PE-TM chain binding)
- Single Endpoint API, Sender ID + Entity ID mapping
- Bulk campaigns: file upload, dynamic, scheduling
- Reports: Summary, Detailed, Sender ID-wise, Template, Campaign, Latency, Clicker
- CRM Plugins: CleverTap, MoEngage, WebEngage live; Shopify + LeadSquared in progress
- 2FA login, Global Number Blacklist/Whitelist, Data Masking
- Error Code Mapping (customer + platform level), Pull API

**WhatsApp + RCS Platform (WARCS)**
- Embedded Signup, OBO (On-Behalf-Of), RCS Bots, auto credit-line attach
- Templates: LTO, Carousel, Product Catalog, Flows (~90–95% of Meta/VI/Jio spec)
- Campaigns: multi-file, exclude file, duplicate check, scheduling, test, repeat, batching, clone
- Link Tracking + URL Shortener (web + API, button + body)
- APIs: Send Template, Non-Template, Create/Fetch Template, Status Check, Media Upload
- Multi-provider setup (WA + RCS vendors + resellers)
- Reporting: Summary + Detailed + Download Centre + button click + URL click
- Frequency Capping, Time Window (discard/next-day)
- Billing: Category/region-wise WA; Basic/Rich-wise RCS; OneX Currency
- Reseller mode: domain, short URL, logo, embedded signup

**Government & International**
- Four concurrent deployments: Aura Domestic (V2), I2I (International-to-International), ILDO (International Long Distance Operator), Government SMS
- Active government clients: NICSI, IOCL BSNL, CRIS, ICSI, Indian Bank
- UAE Phase 1 live — first international market deployment
- Plugins: CleverTap, MoEngage integrations live

---

### The V2 Architecture Backbone

```
Inputs:   Campaign UI (Java + React) + gRPC API (Erlang, high throughput) + SMPP + Plugins (MoEngage / CleverTap)
Core:     Distributed Docker Hubs → Routing Engine → Gateway
Stream:   Kafka (MO / MT / DLR event streaming)
Channels: Meta WhatsApp + Jio RCS + Vi RCS + SMS Operators (Airtel / Jio / Vi / BSNL)
Data:     Doris OLAP (analytics, separated from transactional DB) + PostgreSQL (transactions) + ODP
Support:  Redis (session cache) + RocksDB (persistent KV) + Media Server + Callback Server + Billing
```

The architecture is technically sound. Kafka-based event streaming and separated OLAP are the right choices at scale. Distributed Docker Hubs with horizontal scaling remove the single bottleneck risk. **The infrastructure is not the problem.**

---

## Part 2 — What's Broken (Now Quantified)

*This section was initially identified from the product teardown. It is now confirmed and quantified by 7,139 support tickets and 376 PROD incident tickets raised in the last 7 weeks.*

### 2.1 Customers Cannot Trust Their Own Data
**1,841 support tickets (Delivery Concern) + 97 PROD tickets (Reports/MIS) + 58 PROD tickets (Delivery/Status)**

The Submitted vs. Delivered count mismatch is the single most-reported problem across every data source — teardown, support tickets, and PROD. Previously identified as a P0 bug (AURA-8895, AURA-9418), it is now confirmed as an ongoing operational failure, not a discrete bug awaiting a fix.

The concrete evidence: engineers are manually running database commands every few days to update stuck "Awaited" transactions to Delivered or Failed. At least 8 production tickets in the last 7 weeks are exactly this manual ritual — PROD-200, PROD-291, PROD-378, PROD-183, PROD-228, PROD-94, PROD-164, PROD-213. This will not be resolved by a one-time fix; it is a broken automated process being patched by hand indefinitely.

Additionally: two data centres (Ocean DC and Ocean DR) show different counts for the same traffic, compounding the confusion for enterprise customers.

### 2.2 Reporting Is a Support Cost, Not a Product Feature
**1,126 support tickets (Reports) + 97 PROD tickets in 7 weeks**

Previously identified as "the most-complained-about area across ALL platforms." Now quantified. Customers raise support tickets to get their own data because the product does not give it to them self-serve:
- No custom column selection (AURA-11614)
- No scheduled delivery to SFTP or email (generating recurring PROD tickets: PROD-137 Hero FinCorp, PROD-363 ILDO, PROD-376 OYO, PROD-380 Growtele)
- Reports load in 30–40 seconds (PROD-301)
- All reports run on IST — blocks UAE and global customers (AURA-9233)
- Account Managers have no visibility into their accounts (P0 gap from teardown, still open)

### 2.3 Active P0 Issues Confirmed Still Open
The following P0 bugs from the teardown remain unresolved in production:

| Issue | Jira | PROD Confirmation |
|---|---|---|
| Customer-facing fallback absent | AURA-10023 | PROD-345, PROD-397, PROD-400 |
| Report masking broken | AURA-11388 | Still open |
| Submitted vs Received counts wrong | AURA-9418, AURA-8895 | PROD-111, PROD-122, PROD-219 |
| Blacklist/Whitelist granularity | AURA-11548 | PROD-175 |
| Campaign failure reason not shown | AURA-11390 | PROD-308 |
| Encryption incomplete on WARCS | AURA-11444 | Still open |

### 2.4 Enterprise Governance — In Development but Unstable
Previously identified as entirely absent. Now confirmed: Maker-Checker and RBAC are being built, but have generated critical bugs immediately upon deployment.
- PROD-311 (Critical): Multiple Issues in Maker Checker Workflow for Campaign Approval and Scheduling Time Validation
- PROD-305 (Critical): Multiple Issues in TUC User Management Roles and Access Control

The task is not greenfield build — it is stabilisation and product-quality delivery of something that already exists in a fragile state.

### 2.5 Platform Performance
- Login to Ocean DC: 35–40 seconds (PROD-300, Priority: Highest)
- WA/RCS reports page: 30–40 seconds to load (PROD-301, Priority: Highest)
- HTTP 502 — full platform down (PROD-206, PROD-398)
- SMPP WaitTime delays on Ocean DR (PROD-412)

### 2.6 I2I and ILDO Remain in Sustained Crisis
Previously identified as "most technical debt, most open P0 bugs." Confirmed by PROD data: 18 I2I/ILDO tickets in 7 weeks, several Critical and open. The 8–10 hour billing query has not been resolved. Multiple routing errors, wrong report data, and missing CDR logs remain open.

---

## Part 3 — What's Missing Entirely

*Unchanged from the initial analysis. Confirmed by support ticket data where noted.*

| Capability | Status | Evidence |
|---|---|---|
| **AI / OneX Aura Intelligence** | Zero features built despite being the primary marketing claim | No JIRA items, no roadmap |
| **Journey Automation** | Entirely absent — CleverTap/MoEngage integrations exist as a workaround | Plugin integrations confirm customers need this |
| **Email Channel** | On the website, not in the product or roadmap | — |
| **Voice / IVR** | On the website, not in the roadmap | 431 support tickets — real demand exists |
| **Audience Segments** | Only flat phonebook — no rule builder, no event history | Limits every campaign to broadcast |
| **Developer Portal** | No unified docs, no SDK, no sandbox, no in-UI API key gen | AURA-11608 |
| **Unified Cross-Channel Dashboard** | Every channel is siloed | Competitors have had this for 2–3 years |
| **365cx.io Contact Centre** | Flagship in marketing, absent from roadmap | Unknown maintenance status |
| **Webhook Reliability** | No retry logic, no monitoring, no dead-letter queues | PROD-382, PROD-392 |
| **Platform SLA Monitoring** | Listed as P0, no Jira, not being tracked | Teardown finding |

---

## Part 4 — The Competitive Position

The global CPaaS market is valued at $21–23B in 2026, growing at 19–33% CAGR. The 2025 Gartner Magic Quadrant Leaders are Twilio, Infobip, Sinch, and Vonage.

**Where Onextel has a real, durable advantage:**
- DLT compliance and TRAI alignment — India-specific moat that global players cannot replicate
- Carrier-direct relationships (Airtel, Jio, Vi, BSNL) — delivery rates that international aggregators cannot match
- Government contract base (NICSI, CRIS) — validates enterprise trust
- WhatsApp and RCS feature breadth at ~90–95% of the Meta/Jio/Vi spec
- Multi-provider and reseller architecture — commercially flexible

**Where Onextel is behind and the gap is widening:**
- **AI:** Infobip has AgentOS — generative AI integrated into communication flows. Telnyx is agent-native. Twilio has Conversational Relay for Voice AI. Onextel has nothing.
- **Journey orchestration:** Every Tier 1 player has this. Customers go to CleverTap and MoEngage instead of using Onextel for automation.
- **Developer experience:** Twilio and Telnyx set the standard. Onextel has fragmented API versions and no sandbox.
- **RCS at scale:** Sinch and Infobip have broader carrier RCS coverage. Onextel is limited to Jio and Vi.

**The window:** Onextel's India-market infrastructure advantage is real. The risk is that Infobip and Sinch are investing in India directly. The window to build the product layer on top of the infrastructure moat is 12–18 months.

---

## Part 5 — What oneXtel Must Be

oneXtel is the engagement platform that Aura's infrastructure makes possible but never delivered. **Aura handles messages. oneXtel handles outcomes.**

### The Superset

| Capability | Aura Today | oneXtel Adds |
|---|---|---|
| Channels | SMS, WhatsApp, RCS | + Email, + Voice |
| Campaigns | Bulk broadcast, scheduling | + Journey automation, + A/B testing, + frequency capping UI |
| Templates | Per-channel silos (DLT / WARCS) | Unified library across all channels |
| Contacts | Flat phonebook | Segments, rule builder, event history |
| Reporting | Per-channel, often wrong, IST only | Unified, accurate, self-serve, timezone-aware, scheduled delivery |
| Governance | In development, currently unstable | RBAC + Maker-Checker + Audit Log as a stable, complete module |
| Failure visibility | Silent failures | Every failure surfaced with reason + suggested fix + alerts |
| Delivery trust | Counts wrong, manual DB fixes | Accurate funnel, self-serve transaction repair tool |
| Billing | Per-channel credits | Unified wallet, cross-channel spend dashboard |
| Onboarding | 339 RCS onboarding tickets | Self-serve setup wizard per channel |
| AI | Zero features | Intelligent routing, send-time optimisation (Phase 2) |
| Developer | Fragmented APIs, no sandbox | Unified API, in-UI API key generator |

### Priority Order

| # | Problem | Why This Order |
|---|---|---|
| 1 | **Data trust** — accurate counts, self-serve transaction repair | Every other feature is undermined if the numbers are wrong |
| 2 | **Reporting self-serve** — builder, scheduled delivery, AM view | Converts 1,000+ recurring support tickets into product usage |
| 3 | **Enterprise governance** — stabilise RBAC, Maker-Checker, add Audit Log | Directly unlocks BFSI and Govt deals currently blocked |
| 4 | **Failure visibility** — alerts, error reasons, template sync status | Reduces PROD ticket volume immediately |
| 5 | **Journey Automation** — trigger-based, multi-channel, conditional | Moves oneXtel from broadcast tool to engagement platform |
| 6 | **Audience Management** — contact properties, segments, event history | Prerequisite for Journey and campaign personalisation |
| 7 | **Unified Content + Templates** — across SMS/WA/RCS/Email/Voice | Prerequisite for Journey and multi-channel campaigns |
| 8 | **Channel onboarding + Email + Voice** — self-serve wizards, new channels | Completes the omnichannel story |

---

## Part 6 — What Is New Since the Initial Analysis

The initial analysis was directionally correct. The data has since quantified and sharpened every finding.

**Confirmed and quantified:**
- Reporting as #1 problem: triple-confirmed across teardown, 1,126 support tickets, and 97 PROD tickets in 7 weeks
- Delivery counts wrong: 1,841 support tickets + the "Mark Awaited" manual fix ritual now confirmed as an ongoing weekly operation
- Voice demand is real: 431 support tickets — not just a website claim

**New — not in the initial analysis:**
1. **"OMNI" is the internal name for the V2 UI** — visible across PROD ticket prefixes (OMNI|Reports|..., OMNI|New SMS|...). Has branding implications for oneXtel positioning.
2. **Maker-Checker is already in flight, not absent** — PROD-311 and PROD-305 show it is being built but generating critical bugs immediately. The task is stabilisation, not greenfield build.
3. **PROD backlog open rate is 43%** across 376 tickets in 7 weeks — versus 13% shown in the support system. PROD is where the hard, unresolved issues live.
4. **Ocean DC / Ocean DR discrepancy** is a live production issue causing customer-visible count differences. Not in the initial teardown.
5. **SBI is the highest-maintenance enterprise customer** — 1,295 support tickets, recurring PROD incidents, specific SBI UUID failures. Shapes what enterprise-grade tooling must look like.
6. **RCS onboarding friction quantified** — 339 onboarding support tickets for a channel live less than 2 years. Self-serve setup is not optional.

---

## Summary

Onextel's infrastructure is an asset. Aura's customer-facing product is a liability — not because it is poorly built, but because it was built for the wrong user.

The support and production data make the cost of the current state concrete: over a thousand customers raising weekly tickets because the product cannot show them their own data; enterprise deals blocked by absent governance features; engineering teams running manual database fixes as a weekly ritual; campaigns failing silently with no customer notification.

oneXtel addresses this with a clear, sequenced plan. The first three priorities — data trust, reporting self-serve, and enterprise governance — do not require new infrastructure. The infrastructure to deliver accurate counts, flexible reports, and role-based access already exists in Aura's backend. What is missing is the product surface that exposes it in a way customers can actually use.

The market window is real. Onextel's DLT compliance, carrier relationships, and government customer base are advantages no global player can replicate quickly. The question is whether oneXtel gets built before Infobip, Sinch, or a well-funded Indian challenger closes the gap on the product layer.

---

*Sources: OneXtel Product Teardown Phase 1 · Customer Support Ticket Analysis (7,139 tickets) · JIRA PROD (376 tickets, April–May 2026) · JIRA AURA project samples · V2 architecture diagram · CPaaS Competitive Landscape Brief · onexaura.com live product*

*Prepared by Udayan Das Chowdhury, Director of Products, Onextel · May 2026*

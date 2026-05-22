# OneXtel — Information Architecture Mapping
**Task #18 | Aura → OneXtel IA | May 2026**
**Updated: Full coverage audit against OneXAura_IA_Mapping.docx + Phase 1 Product Teardown**

---

## The Core Shift

Aura is organised **by channel** — you go to the SMS section for SMS, the WA/RCS section for WhatsApp, the DLT section for compliance. Every feature is siloed behind its channel.

OneXtel is organised **by outcome** — you go to Campaigns to run a campaign (any channel), to Journeys to automate, to Audiences to manage contacts, to Reports to understand results. The channel is a property of the thing you're doing, not a navigation destination.

---

## Aura Today → OneXtel Mapping

| Aura Sidebar | Aura What It Does | OneXtel Destination | Decision |
|---|---|---|---|
| **Dashboard** | Bar chart of Submitted/Delivered/Failed/Awaited by day | **Home** | Renamed + rebuilt as unified cross-channel view |
| **Campaign** | Create/manage SMS / WA / RCS / Voice broadcast campaigns | **Campaigns** | Kept, massively expanded — all channels unified |
| **Channel → WhatsApp** | Embedded Signup, Assets, Reports, Config, Routing | **Channels → WhatsApp** | Kept — expanded with OBO, routing rules |
| **Channel → SMS** | DLT, Reports, Telco Report | **Content → DLT** + **Reports** | DLT moves to Content; reports unified |
| **Channel → Voice** | Phone No, SIP, Templates, Reports | **Channels → Voice** + **Content → Templates** | Phase 2; sub-sections mapped |
| **Channel → RCS** | Vendor Mgmt, Assets, Config, Reports, Routing | **Channels → RCS** | Kept — expanded with routing rules |
| **API** | API key display, documentation links | **Settings → Developers** | Moved into Settings, expanded |
| **Phonebook** | Flat contact list upload/manage | **Audiences** | Replaced — Audiences has contacts, segments, suppression |
| **Notification** | Platform alerts (campaign status, credit warnings) | **Header bell + drawer** | Not a nav section — bell icon + notification drawer only |
| **User Management** | Basic user list (no RBAC) | **Settings → Team** + **Governance** | Split: roster → Settings, RBAC → Governance |
| **Credits** | Per-channel credit balance | **Settings → Billing** | Moved into Settings as unified wallet |
| **Config** | Platform config, timezone, sender IDs | **Settings → Config** | Absorbed into Settings |

---

## OneXtel Navigation Structure

### Primary Sidebar (9 sections)

```
OneXtel
├── Home                    ← Unified dashboard: delivery health, campaign perf, channel summary
├── Campaigns               ← All broadcast campaigns: SMS, WhatsApp, RCS, Voice, Email (Phase 2)
├── Journeys                ← NEW: Trigger-based multi-step automation (React Flow canvas)
├── Audiences               ← Contacts + Segments + Import + Suppression Lists
├── Content                 ← Templates (all channels) + Media Library + DLT
├── Reports                 ← Unified analytics: campaign, delivery, channel, AM view
├── Channels                ← Connect & manage: SMS operators, WA, RCS, Email, Voice
├── Governance              ← NEW: RBAC + Maker-Checker + Audit Log
└── Settings                ← Team · Billing · API/Developers · Integrations · Config · Security
```

### Secondary (within Settings)
```
Settings
├── Team                    ← User roster + role assignment (feeds Governance RBAC)
├── Billing & Credits       ← Unified wallet + per-channel spend breakdown + limits
├── Developers              ← API key generator + sandbox + webhook config + docs
├── Integrations            ← CRM plugins: CleverTap, MoEngage, WebEngage, Shopify, LeadSquared
├── Config                  ← Timezone, Sender IDs, DLT entity config, volume limits, platform prefs
└── Security                ← 2FA · Data Masking · SSO/AD Login (Phase 2) · OAuth 2.0 (Phase 2)
```

---

## Feature-Level Mapping (Detailed)

### Campaigns (from Aura's Campaign section)
| Aura Feature | OneXtel Location | Notes |
|---|---|---|
| Bulk SMS campaigns (file upload, dynamic, scheduling) | Campaigns → New Campaign → SMS | Keep all; add channel selector upfront |
| WA campaign (multi-file, exclude, batching, clone) | Campaigns → New Campaign → WhatsApp | Merge into same campaign builder |
| RCS campaign | Campaigns → New Campaign → RCS | Same builder, RCS config tab |
| **Voice campaign (TTS / audio to contact list)** | Campaigns → New Campaign → Voice | **ADDED — was gap. Phase 2 channel but same builder pattern.** |
| Campaign scheduling | Campaigns (all types) | Unified scheduler component |
| Frequency capping | Campaigns → Settings panel | Per-campaign config |
| Time Window (discard/next-day) | Campaigns → Settings panel | Per-campaign config |
| Test campaign | Campaigns → Send Test | Available on all channel types |
| Repeat / Clone campaign | Campaigns → Clone | Rename "Repeat" to "Clone" for clarity |
| **Repush Campaign (retry failed sends)** | Campaigns → [Campaign] → Repush | **ADDED — was gap. AURA-11615. No way to retry failed sends currently.** |
| URL Shortener / Link Tracking | Campaigns → Content step | Inline in campaign builder |
| Campaign reports (per-campaign) | Campaigns → [Campaign] → Analytics | Drill-down from campaign row |
| Daily/Monthly volume limits | Campaigns → Settings panel | **Phase 2 — AURA-11079. Customer-configurable spend caps.** |

### Content (new — consolidates DLT + per-channel templates)

**Reference design:** Netcore Customer Engagement content section (Figma prototype, May 2026)
Structure: Channel sub-nav + Template gallery / Saved templates + Media gallery

| Aura Feature | OneXtel Location | Notes |
|---|---|---|
| DLT Template Management (PE-TM binding) | Content → DLT | Same function, better UI, status visible |
| SMS Sender ID mapping | Content → DLT → Sender IDs | Grouped with DLT compliance |
| **SMS Templates (gallery + saved)** | Content → Templates → SMS | **ADDED — was implicit. Aura /sms flows have templates; must exist in Content.** |
| WA Templates (LTO, Carousel, Catalog, Flows) | Content → Templates → WhatsApp | Unified template library; Text / Media / Catalogue / Multi-Product creation flows |
| RCS Bots / Templates | Content → Templates → RCS | Same library; rich cards, carousels |
| **Voice Templates (TTS scripts / audio files)** | Content → Templates → Voice | **ADDED — was gap. Aura /voice/Template. Phase 2.** |
| Email Templates (HTML, AMP) | Content → Templates → Email | **Phase 2. HTML + AMP creation flows.** |
| Template approval status | Content → Templates | Live sync status per template |
| Media upload | Content → Media Library | Shared across all channels; filter by media type |

### Audiences (from Phonebook — major upgrade)
| Aura Feature | OneXtel Location | Notes |
|---|---|---|
| Phonebook (flat contact list) | Audiences → Contacts | Same data, new capabilities on top |
| File upload / import | Audiences → Import | Deduplication + column mapping |
| Global Blacklist / Whitelist | Audiences → Suppression Lists | Renamed for clarity |
| **TUC-wise granular blacklist** | Audiences → Suppression Lists | **ADDED — Phase 2. BFSI needs per-template-category blacklisting, not just global.** |
| Number validation | Audiences → Import (built in) | Run on upload |
| — | Audiences → Segments | NEW: rule-based segments |
| — | Audiences → Contact detail view | NEW: event history per contact |

### Reports (rebuilt, not extended)
| Aura Feature | OneXtel Location | Notes |
|---|---|---|
| Summary report (per channel) | Reports → Overview | Unified across channels |
| Detailed report (per message) | Reports → Drill-down | Filterable, downloadable |
| Sender ID-wise report | Reports → Filters | Filter by Sender ID |
| Template report | Reports → Filters | Filter by template |
| Campaign report | Campaigns → [Campaign] → Analytics | Lives on the campaign, not in Reports |
| Latency report | Reports → Delivery Health | Surfaced as P0 metric |
| Clicker report | Reports → Engagement | URL click tracking |
| Telco Reports | Reports → Telco (tab) | Same data, same page |
| **Custom field report download** | Reports → Export | **ADDED — was gap. AURA-11614. No custom field selection currently.** |
| **Voice call reports (Connected / Not Answered / Failed)** | Reports (unified) | **ADDED — was gap. Aura /voice/Report. Phase 2.** |
| Download Centre | Reports → Export | Scheduled + on-demand |
| — | Reports → Account Manager view | NEW: AM sees all accounts |
| — | Reports → Scheduled delivery | NEW: SFTP/email push |

### Channels (same concept, expanded)
| Aura Feature | OneXtel Location | Notes |
|---|---|---|
| SMS operator config (Airtel/Jio/Vi/BSNL) | Channels → SMS | Same, better UX |
| WhatsApp Embedded Signup / OBO | Channels → WhatsApp | Self-serve wizard |
| **OBO (On-Behalf-Of) multi-vendor setup** | Channels → WhatsApp | **ADDED — was gap. Teardown confirms shipped. Must be in IA.** |
| **WA Routing Rules** | Channels → WhatsApp → Routing | **ADDED — was gap. Aura /whatsapp/routing. PROD-345/389 KPN fallback failures.** |
| WA Config (phone numbers, WABA, webhooks) | Channels → WhatsApp | Self-serve config |
| RCS Bot setup | Channels → RCS | Self-serve wizard |
| RCS Vendor Management (Jio, Vi) | Channels → RCS → Providers | Per-operator credentials + status |
| **RCS Routing Rules** | Channels → RCS → Routing | **ADDED — was gap. Aura /rcs/routing. Which vendor wins under what conditions.** |
| Multi-provider setup | Channels → [Channel] → Providers | Per-channel provider management |
| Reseller mode / whitelabel | Settings → Reseller | Moved to Settings |
| **Voice: Phone Number Management** | Channels → Voice → Phone Numbers | **ADDED — was gap. Aura /voice/phoneno. Phase 2.** |
| Voice SIP Configuration | ~~Channels → Voice~~  | **DROPPED — ops infrastructure. Configured by OneXtel infra team, not customers.** |
| — | Channels → Email | NEW — Phase 2 |
| — | Channels → Voice | NEW — Phase 2 |

### Governance (new section — deals unblocked here)
| Aura Feature | OneXtel Location | Notes |
|---|---|---|
| User list (no RBAC) | Governance → Roles | Full RBAC: 6 roles min |
| Maker-Checker (in-flight, buggy) | Governance → Approvals | Stabilised from PROD-311 state |
| — | Governance → Audit Log | NEW: immutable, searchable, exportable |

### Settings
| Aura Feature | OneXtel Location | Notes |
|---|---|---|
| User Management (basic) | Settings → Team | Roster + role assignment |
| Credits (per-channel) | Settings → Billing | Unified wallet |
| API key display | Settings → Developers → API Keys | In-UI key generator |
| Sandbox / test mode | Settings → Developers | NEW: test sends without hitting real networks |
| Webhook config | Settings → Developers → Webhooks | Retry logic included |
| CRM Plugins (CT/ME/WE/Shopify/LeadSquared) | Settings → Integrations | Unified integration hub |
| Config (timezone, sender prefs, volume limits) | Settings → Config | Same, cleaned up |
| Data Masking | Settings → Security | Grouped with security config |
| 2FA | Settings → Security | Same |
| **SSO / Active Directory Login** | Settings → Security | **ADDED — Phase 2. UAT POC done. Enterprise blocker.** |
| **OAuth 2.0 token auth** | Settings → Security | **ADDED — Phase 2. Modern API security. POC stage.** |

---

## Notification Strategy (not a nav section)

Aura has `/notification` as a top-level sidebar item. This is wrong UX. OneXtel uses:
- **Header bell icon** — badge count, click to open drawer
- **Notification drawer** — campaign failure alerts, credit warnings, template sync status, system alerts
- **Notification preferences** — in Settings → Config (email/SMS delivery of platform alerts)

No dedicated route. No sidebar item. The drawer is the notification centre.

---

## What Is New (Not in Aura at All)

| Section | Feature | Priority |
|---|---|---|
| **Journeys** | Full visual automation builder | #5 in product priority |
| **Audiences** | Segment builder, event history | #6 in product priority |
| **Home** | Unified cross-channel dashboard | #4 (failure visibility) |
| **Reports** | Scheduled delivery (SFTP/email) | #2 in product priority |
| **Reports** | Account Manager view | #2 in product priority |
| **Governance** | Full RBAC module | #3 in product priority |
| **Governance** | Audit Log | #3 in product priority |
| **Channels** | Email channel (end-to-end) | #8 in product priority |
| **Channels** | Voice/IVR channel | #8 in product priority |
| **Home** | Transaction Health tool | #16 (task) |
| **Home** | Account Health dashboard | #17 (task) |
| **Campaigns** | Repush (retry failed sends) | From teardown AURA-11615 |
| **Content** | Unified template gallery with pre-built templates | Netcore CE reference |
| **Settings** | Sandbox / test mode | Developer experience |

---

## What Is Deferred (Not in OneXtel v1)

| Feature | Reason |
|---|---|
| I2I / ILDO carrier routing UI | Infrastructure, not product surface |
| Ocean DC/DR sync visibility | Backend engineering, not a UI feature |
| Telco-grade SMPP configuration | Ops tooling, not customer-facing |
| 365cx.io Contact Centre | Unknown maintenance state; separate product |
| Full AI features (routing, anomaly detection) | Phase 2 — after core platform is stable |
| Voice IVR script builder | Phase 2 |
| Voice SIP configuration | Ops infrastructure — not customer-facing |
| Country Blacklist (I2I) | Carrier platform ops, not customer-facing |
| HLR / MNP routing | Backend engineering, no UI needed |
| Arabic UI / Language selector | Phase 3 — UAE Phase 2 is Q4 2026 |
| SSO / AD Login | Phase 2 — UAT POC done, not yet production |
| OAuth 2.0 | Phase 2 — POC stage only |
| TUC-wise granular blacklist | Phase 2 — BFSI-specific, after core audiences module |
| Government Edition bespoke configs | Future packaging decision |
| Meta Reports (WA) | Dropped — iframe to Meta Business Suite, link externally |
| Notification as sidebar nav | Dropped — bell icon + drawer is correct UX |
| Platform SLA monitoring | Internal ops (Grafana), not customer-facing |

---

## Decisions Made Here (Implications for Sidebar Build)

1. **9 top-level sections** — not 11 like Aura. Fewer, cleaner, outcome-oriented.
2. **No "Telco Reports" at the top level** — merged into Reports as a tab. Frees up nav space.
3. **DLT lives inside Content** — not a standalone section. Compliance is a layer on templates.
4. **Governance is a standalone section** — not buried in User Management or Settings. It's a deal-unlocker; it needs visibility.
5. **Journeys is top-level** — even though it's Phase 2 to build. The nav slot should exist from day one (locked/coming soon state) so the IA doesn't need to change when it ships.
6. **Settings consolidates 4 Aura sections** — Credits, API, Config, and parts of User Management all move here. Reduces clutter at the top level.
7. **Campaigns is channel-agnostic** — you start a campaign, then pick the channel. Not "go to WhatsApp campaigns" vs "go to SMS campaigns."
8. **Notifications are not a nav section** — bell icon + drawer only. Notification preferences go in Settings → Config.
9. **Voice and Email are Phase 2 channels** — IA slots exist but features are locked on day one.
10. **Content section follows Netcore CE reference design** — channel sub-nav, template gallery + saved templates tabs, unified media gallery at the bottom.

---

*Output of Task #18 (updated post coverage audit) — used as input for all module builds.*
*Author: Udayan Das Chowdhury | May 2026*

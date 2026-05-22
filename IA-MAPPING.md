# OneXtel — Information Architecture Mapping
**Task #18 | Aura → OneXtel IA | May 2026**

---

## The Core Shift

Aura is organised **by channel** — you go to the SMS section for SMS, the WA/RCS section for WhatsApp, the DLT section for compliance. Every feature is siloed behind its channel.

OneXtel is organised **by outcome** — you go to Campaigns to run a campaign (any channel), to Journeys to automate, to Audiences to manage contacts, to Reports to understand results. The channel is a property of the thing you're doing, not a navigation destination.

This is the single most important structural decision. Everything else follows from it.

---

## Aura Today → OneXtel Mapping

| Aura Sidebar | Aura What It Does | OneXtel Destination | Decision |
|---|---|---|---|
| **Dashboard** | Bar chart of Submitted/Delivered/Failed/Awaited by day | **Home** | Renamed + rebuilt as unified cross-channel view |
| **Campaign** | Create/manage SMS + WA/RCS broadcast campaigns | **Campaigns** | Kept, massively expanded — all channels unified |
| **User Management** | Basic user list (no RBAC) | **Settings → Team** + **Governance** | Split: team roster goes to Settings, RBAC/permissions go to Governance |
| **Credits** | Per-channel credit balance | **Settings → Billing** | Moved into Settings as unified wallet |
| **Channels** | Connect WA/RCS providers, SMS operators | **Channels** | Kept as top-level — expanded to include Email + Voice setup |
| **Reports** | Per-channel delivery reports (SMS / WA / RCS) | **Reports** | Rebuilt as unified cross-channel, timezone-aware, self-serve |
| **Telco Reports** | Operator-level traffic summaries (SMPP, I2I, ILDO) | **Reports → Telco** | Merged into Reports as a filtered view — not a top-level item |
| **DLT** | PE/TM entity management, template binding | **Content → DLT** | Embedded within Content — DLT is a compliance layer on templates |
| **API** | API key display, documentation links | **Settings → Developers** | Moved into Settings, expanded with sandbox + key generator |
| **Phonebook** | Flat contact list upload/manage | **Audiences** | Replaced — Audiences has contacts, segments, properties, event history |
| **Config** | Platform config, timezone, sender IDs | **Settings** | Absorbed into Settings |

---

## OneXtel Navigation Structure

### Primary Sidebar (9 sections)

```
OneXtel
├── Home                    ← Unified dashboard: delivery health, campaign perf, channel summary
├── Campaigns               ← All broadcast campaigns: SMS, WhatsApp, RCS, Email, Voice
├── Journeys                ← NEW: Trigger-based multi-step automation (React Flow canvas)
├── Audiences               ← Contacts + Segments + Import (replaces Phonebook)
├── Content                 ← Templates (all channels) + Media Library + DLT
├── Reports                 ← Unified analytics: campaign, delivery, channel, AM view
├── Channels                ← Connect & manage: SMS operators, WA, RCS, Email, Voice
├── Governance              ← NEW: RBAC + Maker-Checker + Audit Log
└── Settings                ← Team · Billing · API/Developers · Integrations · Config
```

### Secondary (within Settings)
```
Settings
├── Team                    ← User roster + role assignment (feeds Governance RBAC)
├── Billing & Credits       ← Unified wallet + per-channel spend breakdown
├── Developers              ← API key generator + sandbox + webhook config + docs
├── Integrations            ← CRM plugins: CleverTap, MoEngage, WebEngage, Shopify
└── Config                  ← Timezone, Sender IDs, DLT entity config, platform prefs
```

---

## Feature-Level Mapping (Detailed)

### Campaigns (from Aura's Campaign section)
| Aura Feature | OneXtel Location | Notes |
|---|---|---|
| Bulk SMS campaigns (file upload, dynamic, scheduling) | Campaigns → New Campaign → SMS | Keep all; add channel selector upfront |
| WA campaign (multi-file, exclude, batching, clone) | Campaigns → New Campaign → WhatsApp | Merge into same campaign builder |
| RCS campaign | Campaigns → New Campaign → RCS | Same builder, RCS config tab |
| Campaign scheduling | Campaigns (all types) | Unified scheduler component |
| Frequency capping | Campaigns → Settings panel | Per-campaign config |
| Time Window (discard/next-day) | Campaigns → Settings panel | Per-campaign config |
| Test campaign | Campaigns → Send Test | Available on all channel types |
| Repeat campaign | Campaigns → Clone | Rename "Repeat" to "Clone" for clarity |
| URL Shortener / Link Tracking | Campaigns → Content step | Inline in campaign builder |
| Campaign reports (per-campaign) | Campaigns → [Campaign] → Analytics | Drill-down from campaign row |

### Content (new — consolidates DLT + per-channel templates)
| Aura Feature | OneXtel Location | Notes |
|---|---|---|
| DLT Template Management (PE-TM binding) | Content → DLT | Same function, better UI, status visible |
| SMS Sender ID mapping | Content → DLT → Sender IDs | Grouped with DLT compliance |
| WA Templates (LTO, Carousel, Catalog, Flows) | Content → Templates → WhatsApp | Unified template library |
| RCS Bots / Templates | Content → Templates → RCS | Same library |
| Template approval status | Content → Templates | Live sync status per template |
| Media upload | Content → Media Library | Shared across all channels |

### Audiences (from Phonebook — major upgrade)
| Aura Feature | OneXtel Location | Notes |
|---|---|---|
| Phonebook (flat contact list) | Audiences → Contacts | Same data, new capabilities on top |
| File upload / import | Audiences → Import | Deduplication + column mapping |
| Global Blacklist / Whitelist | Audiences → Suppression Lists | Renamed for clarity |
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
| Download Centre | Reports → Export | Scheduled + on-demand |
| — | Reports → Account Manager view | NEW: AM sees all accounts |
| — | Reports → Scheduled delivery | NEW: SFTP/email push |

### Channels (same concept, expanded)
| Aura Feature | OneXtel Location | Notes |
|---|---|---|
| SMS operator config (Airtel/Jio/Vi/BSNL) | Channels → SMS | Same, better UX |
| WhatsApp Embedded Signup / OBO | Channels → WhatsApp | Self-serve wizard |
| RCS Bot setup | Channels → RCS | Self-serve wizard |
| Multi-provider setup | Channels → [Channel] → Providers | Per-channel provider management |
| Reseller mode / whitelabel | Settings → Reseller | Moved to Settings |
| — | Channels → Email | NEW |
| — | Channels → Voice | NEW |

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
| CRM Plugins (CT/ME/WE/Shopify) | Settings → Integrations | Unified integration hub |
| Config (timezone, sender prefs) | Settings → Config | Same, cleaned up |
| Data Masking | Settings → Security | Grouped with security config |
| 2FA | Settings → Security | Same |

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

---

## Decisions Made Here (Implications for Sidebar Build)

1. **9 top-level sections** — not 11 like Aura. Fewer, cleaner, outcome-oriented.
2. **No "Telco Reports" at the top level** — merged into Reports as a tab. Frees up nav space.
3. **DLT lives inside Content** — not a standalone section. Compliance is a layer on templates.
4. **Governance is a standalone section** — not buried in User Management or Settings. It's a deal-unlocker; it needs visibility.
5. **Journeys is top-level** — even though it's Phase 2 to build. The nav slot should exist from day one (locked/coming soon state) so the IA doesn't need to change when it ships.
6. **Settings consolidates 4 Aura sections** — Credits, API, Config, and parts of User Management all move here. Reduces clutter at the top level.
7. **Campaigns is channel-agnostic** — you start a campaign, then pick the channel. Not "go to WhatsApp campaigns" vs "go to SMS campaigns."

---

*Output of Task #18 — used as input for Task #3 (Sidebar Redesign) and all module builds.*
*Author: Udayan Das Chowdhury | May 2026*

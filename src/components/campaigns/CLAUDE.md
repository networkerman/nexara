# Campaigns — Claude Working Guide

## Files in this folder

| File | Role |
|---|---|
| `CampaignsPageNew.tsx` | **Active** multi-channel campaign list. This is what `/campaigns` renders. |
| `CampaignsPage.tsx` | Legacy Aura-style list. **Not routed.** Keep for reference, do not edit. |
| `CreateCampaignModal.tsx` | Full multi-step campaign wizard (3003 lines). WhatsApp-focused. Row clicks open this. |
| `CampaignRow.tsx` / `CampaignTable.tsx` | Used only by the legacy `CampaignsPage`. Not active. |
| `RepushModal` | Inline in `CampaignsPageNew.tsx` — modal for retrying failed sends |
| `ChannelPickerModal` | Inline in `CampaignsPageNew.tsx` — channel selection before launching wizard |

## Critical: Row click behaviour
Clicking a campaign row in `CampaignsPageNew` opens `CreateCampaignModal` (the full wizard).
Do NOT add a detail slide-over or separate panel — the wizard IS the campaign detail view.

## CreateCampaignModal — Before You Touch It
- 3003 lines. Has complex inter-step validation, localStorage persistence (TTL-based), and conditional branching per channel.
- Steps: `start → channels → setup → audience → content → schedule → preview`
- Wizard state is in `wizardProgress` (WizardProgress type). Step status: `idle | editing | valid | invalid`.
- Form data persists to `localStorage` key `WIZARD_STORAGE_KEY` with a TTL. This is intentional — don't remove it.
- Validation runs per-step in `validateSetupStep`, `validateAudienceStep`, etc. Add new validation there.
- Do NOT split this file until a proper state machine (Zustand/XState) is in place.

## Mock data
`mockCampaigns` array is inline in `CampaignsPageNew.tsx`. When Supabase wiring (Task #12) lands, replace with a TanStack Query hook. The shape of `Campaign` interface is the contract.

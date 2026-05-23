-- =============================================================================
-- OneXtel — Full Supabase Schema
-- Version: 2.0  |  May 2026
-- Covers: multi-tenant orgs, campaigns, journeys, contacts/segments,
--         templates, channels, governance, credits, account health
-- =============================================================================
-- Run order matters — tables with FK deps come after their parent tables.
-- Safe to run multiple times (IF NOT EXISTS / OR REPLACE throughout).
-- =============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- SECTION 1 — ORGANIZATIONS & MULTI-TENANCY
-- =============================================================================

-- Root tenant table. Every resource belongs to an org.
CREATE TABLE IF NOT EXISTS public.organizations (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT        NOT NULL,
  slug         TEXT        UNIQUE, -- URL-safe identifier
  domain       TEXT,               -- primary email domain (e.g. sbi.co.in)
  plan         TEXT        NOT NULL DEFAULT 'enterprise'
                CHECK (plan IN ('starter', 'growth', 'enterprise')),
  billing_mode TEXT        NOT NULL DEFAULT 'postpaid'
                CHECK (billing_mode IN ('prepaid', 'postpaid')),
  credit_balance NUMERIC(14, 4) DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- RBAC: links users to orgs with a role
CREATE TABLE IF NOT EXISTS public.organization_members (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id       UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT        NOT NULL DEFAULT 'viewer'
                CHECK (role IN ('owner', 'admin', 'maker', 'checker', 'analyst', 'viewer')),
  invited_by   UUID        REFERENCES auth.users(id),
  joined_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_members_org_id  ON public.organization_members(org_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON public.organization_members(user_id);

-- =============================================================================
-- SECTION 2 — CHANNELS CONFIGURATION
-- =============================================================================

-- Per-org channel toggle + provider config (stored as JSONB)
CREATE TABLE IF NOT EXISTS public.channel_configs (
  id         UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id     UUID    NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  channel    TEXT    NOT NULL CHECK (channel IN ('SMS', 'WhatsApp', 'RCS', 'Email', 'Voice')),
  is_active  BOOLEAN DEFAULT true,
  -- Stores provider creds, routing, limits — avoids schema changes per provider
  config     JSONB   DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, channel)
);

CREATE INDEX IF NOT EXISTS idx_channel_configs_org_id ON public.channel_configs(org_id);

-- Email sending domains (DKIM / SPF / DMARC status per domain)
CREATE TABLE IF NOT EXISTS public.sending_domains (
  id             UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id         UUID    NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  domain         TEXT    NOT NULL,
  type           TEXT    NOT NULL DEFAULT 'Transactional'
                  CHECK (type IN ('Transactional', 'Marketing')),
  dkim_verified  BOOLEAN DEFAULT false,
  spf_verified   BOOLEAN DEFAULT false,
  dmarc_verified BOOLEAN DEFAULT false,
  status         TEXT    NOT NULL DEFAULT 'Pending'
                  CHECK (status IN ('Verified', 'Partial', 'Pending', 'Failed')),
  daily_limit    INTEGER DEFAULT 100000,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, domain)
);

-- Voice DID numbers
CREATE TABLE IF NOT EXISTS public.did_numbers (
  id         UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id     UUID    NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  number     TEXT    NOT NULL,
  type       TEXT    NOT NULL DEFAULT 'Local'
              CHECK (type IN ('Local', 'Toll-Free', 'Mobile')),
  operator   TEXT,
  purpose    TEXT,
  status     TEXT    NOT NULL DEFAULT 'Active'
              CHECK (status IN ('Active', 'Flagged', 'Inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_did_numbers_org_id ON public.did_numbers(org_id);

-- =============================================================================
-- SECTION 3 — CONTACTS & AUDIENCES
-- =============================================================================

-- Master contact record. Phone and/or email required.
-- Custom attributes stored in JSONB (flexible per customer).
CREATE TABLE IF NOT EXISTS public.contacts (
  id                  UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id              UUID    NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  phone               TEXT,
  email               TEXT,
  first_name          TEXT,
  last_name           TEXT,
  attributes          JSONB   DEFAULT '{}',
  -- Global opt-out (cross-channel suppression)
  opted_out           BOOLEAN DEFAULT false,
  opted_out_at        TIMESTAMPTZ,
  opted_out_channel   TEXT,   -- which channel triggered the opt-out
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT contact_has_identifier CHECK (phone IS NOT NULL OR email IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_contacts_org_id ON public.contacts(org_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone  ON public.contacts(org_id, phone);
CREATE INDEX IF NOT EXISTS idx_contacts_email  ON public.contacts(org_id, email);

-- Contact event stream — feeds Journey triggers and dynamic segment conditions
CREATE TABLE IF NOT EXISTS public.contact_events (
  id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id       UUID    NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  contact_id   UUID    NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  event_name   TEXT    NOT NULL,   -- e.g. 'loan_applied', 'page_view', 'sms_clicked'
  source       TEXT    DEFAULT 'api', -- 'api', 'campaign', 'journey', 'integration'
  properties   JSONB   DEFAULT '{}',
  occurred_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_events_contact_id  ON public.contact_events(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_events_event_name  ON public.contact_events(org_id, event_name);
CREATE INDEX IF NOT EXISTS idx_contact_events_occurred_at ON public.contact_events(occurred_at DESC);

-- Audience segments (static = list, dynamic = SQL-like filter conditions)
CREATE TABLE IF NOT EXISTS public.segments (
  id                 UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id             UUID    NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name               TEXT    NOT NULL,
  description        TEXT,
  type               TEXT    NOT NULL DEFAULT 'static'
                      CHECK (type IN ('static', 'dynamic')),
  filter_conditions  JSONB   DEFAULT '{}',  -- AST for dynamic filter
  contact_count      INTEGER DEFAULT 0,
  created_by         UUID    REFERENCES auth.users(id),
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_segments_org_id ON public.segments(org_id);

-- Junction table for static segments
CREATE TABLE IF NOT EXISTS public.segment_contacts (
  segment_id UUID NOT NULL REFERENCES public.segments(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (segment_id, contact_id)
);

CREATE INDEX IF NOT EXISTS idx_segment_contacts_contact_id ON public.segment_contacts(contact_id);

-- =============================================================================
-- SECTION 4 — CONTENT & TEMPLATES
-- =============================================================================

-- Unified template library across all channels.
-- Channel-specific fields (DLT ID for SMS, Meta template ID for WA) live here.
CREATE TABLE IF NOT EXISTS public.templates (
  id              UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id          UUID    NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name            TEXT    NOT NULL,
  channel         TEXT    NOT NULL CHECK (channel IN ('SMS', 'WhatsApp', 'RCS', 'Email', 'Voice')),
  category        TEXT    NOT NULL DEFAULT 'transactional'
                   CHECK (category IN ('transactional', 'promotional', 'otp', 'service')),
  body            TEXT    NOT NULL,
  header          JSONB,           -- image/video/doc header (WhatsApp / RCS)
  footer          TEXT,
  buttons         JSONB   DEFAULT '[]',
  variables       JSONB   DEFAULT '[]',  -- variable definitions {{1}}, {{2}}
  language        TEXT    DEFAULT 'en',
  -- Channel-specific registration IDs
  dlt_template_id TEXT,            -- TRAI DLT template ID (SMS)
  dlt_expiry_at   TIMESTAMPTZ,     -- DLT template expiry date
  wa_template_id  TEXT,            -- Meta / BSP template ID (WhatsApp)
  -- Approval workflow
  status          TEXT    NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'expired')),
  rejection_reason TEXT,
  created_by      UUID    REFERENCES auth.users(id),
  approved_by     UUID    REFERENCES auth.users(id),
  approved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_org_id  ON public.templates(org_id);
CREATE INDEX IF NOT EXISTS idx_templates_channel ON public.templates(org_id, channel);
CREATE INDEX IF NOT EXISTS idx_templates_status  ON public.templates(org_id, status);

-- Media assets (images, videos, documents used in templates)
CREATE TABLE IF NOT EXISTS public.media_assets (
  id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id       UUID    NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name         TEXT    NOT NULL,
  type         TEXT    NOT NULL CHECK (type IN ('image', 'video', 'document', 'audio')),
  url          TEXT    NOT NULL,   -- Supabase Storage URL
  size_bytes   INTEGER,
  mime_type    TEXT,
  uploaded_by  UUID    REFERENCES auth.users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_org_id ON public.media_assets(org_id);

-- =============================================================================
-- SECTION 5 — CAMPAIGNS
-- =============================================================================

-- Full multi-channel campaign with delivery metrics + maker-checker support.
-- Replaces the old minimal campaigns table.
CREATE TABLE IF NOT EXISTS public.campaigns (
  id               UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id           UUID    NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by       UUID    NOT NULL REFERENCES auth.users(id),
  name             TEXT    NOT NULL,
  channel          TEXT    NOT NULL CHECK (channel IN ('SMS', 'WhatsApp', 'RCS', 'Email', 'Voice')),
  type             TEXT    NOT NULL DEFAULT 'broadcast'
                    CHECK (type IN ('broadcast', 'triggered', 'journey_step')),
  status           TEXT    NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'pending_approval', 'scheduled', 'running', 'sent', 'failed', 'suspended', 'cancelled')),
  template_id      UUID    REFERENCES public.templates(id),
  segment_id       UUID    REFERENCES public.segments(id),
  audience_size    INTEGER DEFAULT 0,
  -- Schedule
  scheduled_at     TIMESTAMPTZ,
  sent_at          TIMESTAMPTZ,
  -- Delivery metrics (updated async by delivery worker)
  total_sent       INTEGER DEFAULT 0,
  total_delivered  INTEGER DEFAULT 0,
  total_failed     INTEGER DEFAULT 0,
  total_opened     INTEGER DEFAULT 0,
  total_clicked    INTEGER DEFAULT 0,
  total_bounced    INTEGER DEFAULT 0,
  total_opted_out  INTEGER DEFAULT 0,
  -- Maker-checker
  requires_approval BOOLEAN DEFAULT false,
  approved_by      UUID    REFERENCES auth.users(id),
  approved_at      TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_org_id      ON public.campaigns(org_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status       ON public.campaigns(org_id, status);
CREATE INDEX IF NOT EXISTS idx_campaigns_channel      ON public.campaigns(org_id, channel);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled_at ON public.campaigns(scheduled_at);

-- =============================================================================
-- SECTION 6 — JOURNEYS
-- =============================================================================

-- Journey definition. Canvas state (nodes + edges) stored as JSONB
-- so we avoid schema migrations every time the canvas UX evolves.
CREATE TABLE IF NOT EXISTS public.journeys (
  id               UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id           UUID    NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by       UUID    NOT NULL REFERENCES auth.users(id),
  name             TEXT    NOT NULL,
  description      TEXT,
  status           TEXT    NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  trigger_type     TEXT    NOT NULL DEFAULT 'segment_entry'
                    CHECK (trigger_type IN ('segment_entry', 'event', 'api', 'schedule', 'inaction')),
  trigger_config   JSONB   DEFAULT '{}',   -- trigger-specific params
  canvas_nodes     JSONB   DEFAULT '[]',   -- ReactFlow node array
  canvas_edges     JSONB   DEFAULT '[]',   -- ReactFlow edge array
  -- Aggregate stats (refreshed periodically)
  enrolled_count   INTEGER DEFAULT 0,
  active_count     INTEGER DEFAULT 0,
  completed_count  INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journeys_org_id ON public.journeys(org_id);
CREATE INDEX IF NOT EXISTS idx_journeys_status ON public.journeys(org_id, status);

-- Per-contact journey enrollment + current node tracking
CREATE TABLE IF NOT EXISTS public.journey_enrollments (
  id               UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id       UUID    NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  contact_id       UUID    NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  current_node_id  TEXT,           -- node id within the canvas
  status           TEXT    NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'waiting', 'completed', 'exited', 'failed')),
  exit_reason      TEXT,
  enrolled_at      TIMESTAMPTZ DEFAULT NOW(),
  next_step_at     TIMESTAMPTZ,    -- when Wait node delay expires
  completed_at     TIMESTAMPTZ,
  UNIQUE(journey_id, contact_id)
);

CREATE INDEX IF NOT EXISTS idx_journey_enrollments_journey_id  ON public.journey_enrollments(journey_id);
CREATE INDEX IF NOT EXISTS idx_journey_enrollments_contact_id  ON public.journey_enrollments(contact_id);
CREATE INDEX IF NOT EXISTS idx_journey_enrollments_next_step   ON public.journey_enrollments(next_step_at)
  WHERE status = 'waiting';

-- =============================================================================
-- SECTION 7 — ENTERPRISE GOVERNANCE
-- =============================================================================

-- Immutable audit log. Never update or delete rows here.
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id            UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id        UUID    NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id       UUID    NOT NULL REFERENCES auth.users(id),
  -- Structured action: '<resource>.<verb>'  e.g. 'campaign.launched', 'template.rejected'
  action        TEXT    NOT NULL,
  resource_type TEXT    NOT NULL,  -- 'campaign', 'template', 'segment', 'journey', 'user', 'channel'
  resource_id   UUID,
  resource_name TEXT,
  old_value     JSONB,
  new_value     JSONB,
  ip_address    TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id       ON public.audit_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id      ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource     ON public.audit_logs(org_id, resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at   ON public.audit_logs(created_at DESC);

-- Maker-Checker approval queue
CREATE TABLE IF NOT EXISTS public.maker_checker_requests (
  id            UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id        UUID    NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  requested_by  UUID    NOT NULL REFERENCES auth.users(id),
  reviewed_by   UUID    REFERENCES auth.users(id),
  resource_type TEXT    NOT NULL,  -- 'campaign', 'template', 'segment'
  resource_id   UUID    NOT NULL,
  resource_name TEXT,
  action        TEXT    NOT NULL,  -- 'launch', 'approve_template', 'import_contacts'
  payload       JSONB   DEFAULT '{}',  -- snapshot of resource at time of request
  status        TEXT    NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'cancelled')),
  notes         TEXT,
  expires_at    TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours'),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_mc_requests_org_id  ON public.maker_checker_requests(org_id);
CREATE INDEX IF NOT EXISTS idx_mc_requests_status  ON public.maker_checker_requests(org_id, status);

-- =============================================================================
-- SECTION 8 — CREDITS & BILLING
-- =============================================================================

-- Double-entry ledger for credit movements.
-- Every debit (spend) and credit (topup / promo grant) is a row.
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id            UUID      DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id        UUID      NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  type          TEXT      NOT NULL CHECK (type IN ('debit', 'credit', 'refund', 'promotional')),
  amount        NUMERIC(14, 4) NOT NULL,  -- positive for credit, negative for debit
  balance_after NUMERIC(14, 4),
  channel       TEXT      CHECK (channel IN ('SMS', 'WhatsApp', 'RCS', 'Email', 'Voice')),
  campaign_id   UUID      REFERENCES public.campaigns(id),
  journey_id    UUID      REFERENCES public.journeys(id),
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_tx_org_id     ON public.credit_transactions(org_id);
CREATE INDEX IF NOT EXISTS idx_credit_tx_created_at ON public.credit_transactions(org_id, created_at DESC);

-- Monthly invoice snapshots (generated by billing worker at month end)
CREATE TABLE IF NOT EXISTS public.invoices (
  id              UUID      DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id          UUID      NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  invoice_number  TEXT      UNIQUE NOT NULL,
  period_start    DATE      NOT NULL,
  period_end      DATE      NOT NULL,
  status          TEXT      NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'issued', 'paid', 'overdue', 'disputed')),
  subtotal        NUMERIC(14, 4) DEFAULT 0,
  credits_applied NUMERIC(14, 4) DEFAULT 0,
  total_due       NUMERIC(14, 4) DEFAULT 0,
  line_items      JSONB     DEFAULT '[]',  -- per-channel breakdown
  issued_at       TIMESTAMPTZ,
  due_at          TIMESTAMPTZ,
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_org_id ON public.invoices(org_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(org_id, status);

-- =============================================================================
-- SECTION 9 — ACCOUNT HEALTH
-- =============================================================================

-- Periodic health score snapshots per org (generated by health worker).
-- Separate from live data so historical trending is possible.
CREATE TABLE IF NOT EXISTS public.account_health_snapshots (
  id                 UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id             UUID    NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  overall_score      SMALLINT NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  delivery_score     SMALLINT NOT NULL CHECK (delivery_score BETWEEN 0 AND 100),
  compliance_score   SMALLINT NOT NULL CHECK (compliance_score BETWEEN 0 AND 100),
  integration_score  SMALLINT NOT NULL CHECK (integration_score BETWEEN 0 AND 100),
  support_score      SMALLINT NOT NULL CHECK (support_score BETWEEN 0 AND 100),
  open_tickets       INTEGER  DEFAULT 0,
  critical_alerts    INTEGER  DEFAULT 0,
  detail             JSONB    DEFAULT '{}',  -- full breakdown of sub-scores
  snapshot_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_snapshots_org_id ON public.account_health_snapshots(org_id);
CREATE INDEX IF NOT EXISTS idx_health_snapshots_time   ON public.account_health_snapshots(org_id, snapshot_at DESC);

-- =============================================================================
-- SECTION 10 — HELPER FUNCTIONS & TRIGGERS
-- =============================================================================

-- Generic updated_at trigger function (reused across tables)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Wire updated_at triggers to every table that has the column
DO $$ DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'organizations', 'channel_configs', 'contacts', 'segments',
    'templates', 'campaigns', 'journeys'
  ] LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%I_updated_at ON public.%I;
       CREATE TRIGGER trg_%I_updated_at
         BEFORE UPDATE ON public.%I
         FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();',
      tbl, tbl, tbl, tbl
    );
  END LOOP;
END $$;

-- Auto-maintain segment contact_count when segment_contacts changes
CREATE OR REPLACE FUNCTION public.refresh_segment_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.segments
  SET contact_count = (
    SELECT COUNT(*) FROM public.segment_contacts WHERE segment_id = COALESCE(NEW.segment_id, OLD.segment_id)
  )
  WHERE id = COALESCE(NEW.segment_id, OLD.segment_id);
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_segment_contacts_count ON public.segment_contacts;
CREATE TRIGGER trg_segment_contacts_count
  AFTER INSERT OR DELETE ON public.segment_contacts
  FOR EACH ROW EXECUTE FUNCTION public.refresh_segment_count();

-- Auto-log audit entry for campaigns (example — extend per resource as needed)
CREATE OR REPLACE FUNCTION public.audit_campaign_changes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs(org_id, user_id, action, resource_type, resource_id, resource_name, new_value)
    VALUES (NEW.org_id, NEW.created_by, 'campaign.created', 'campaign', NEW.id, NEW.name, to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' AND OLD.status <> NEW.status THEN
    INSERT INTO public.audit_logs(org_id, user_id, action, resource_type, resource_id, resource_name, old_value, new_value)
    VALUES (NEW.org_id, NEW.created_by,
            'campaign.' || NEW.status,
            'campaign', NEW.id, NEW.name,
            jsonb_build_object('status', OLD.status),
            jsonb_build_object('status', NEW.status));
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_campaigns ON public.campaigns;
CREATE TRIGGER trg_audit_campaigns
  AFTER INSERT OR UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.audit_campaign_changes();

-- =============================================================================
-- SECTION 11 — ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- Pattern: every table is scoped to org_id, and users can only access orgs
-- they are a member of (via organization_members).
-- Exceptions: audit_logs is SELECT-only for members; admin/service_role bypasses all.
-- =============================================================================

-- Helper: returns org IDs the current user belongs to
CREATE OR REPLACE FUNCTION public.my_org_ids()
RETURNS SETOF UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT org_id FROM public.organization_members WHERE user_id = auth.uid();
$$;

-- Helper: returns the role of the current user within a given org
CREATE OR REPLACE FUNCTION public.my_org_role(p_org_id UUID)
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.organization_members
  WHERE org_id = p_org_id AND user_id = auth.uid()
  LIMIT 1;
$$;

-- Enable RLS on all tables
DO $$ DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'organizations', 'organization_members', 'channel_configs', 'sending_domains',
    'did_numbers', 'contacts', 'contact_events', 'segments', 'segment_contacts',
    'templates', 'media_assets', 'campaigns', 'journeys', 'journey_enrollments',
    'audit_logs', 'maker_checker_requests', 'credit_transactions', 'invoices',
    'account_health_snapshots'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    -- service_role always bypasses RLS
    EXECUTE format('DROP POLICY IF EXISTS "service_role_bypass" ON public.%I;', tbl);
  END LOOP;
END $$;

-- organizations — member can read their own orgs; owner/admin can update
CREATE POLICY "orgs_select" ON public.organizations
  FOR SELECT USING (id IN (SELECT public.my_org_ids()));

CREATE POLICY "orgs_update" ON public.organizations
  FOR UPDATE USING (public.my_org_role(id) IN ('owner', 'admin'));

-- organization_members — members can read; admin/owner can insert/delete
CREATE POLICY "org_members_select" ON public.organization_members
  FOR SELECT USING (org_id IN (SELECT public.my_org_ids()));

CREATE POLICY "org_members_insert" ON public.organization_members
  FOR INSERT WITH CHECK (public.my_org_role(org_id) IN ('owner', 'admin'));

CREATE POLICY "org_members_delete" ON public.organization_members
  FOR DELETE USING (public.my_org_role(org_id) IN ('owner', 'admin'));

-- Generic org-scoped RLS macro for read/write tables
-- (contacts, segments, templates, campaigns, journeys, channel_configs, etc.)
DO $$ DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'channel_configs', 'sending_domains', 'did_numbers',
    'contacts', 'contact_events', 'segments', 'segment_contacts',
    'templates', 'media_assets', 'campaigns', 'journeys', 'journey_enrollments',
    'maker_checker_requests', 'credit_transactions', 'invoices',
    'account_health_snapshots'
  ] LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS "%I_select" ON public.%I;
       CREATE POLICY "%I_select" ON public.%I
         FOR SELECT USING (org_id IN (SELECT public.my_org_ids()));',
      tbl, tbl, tbl, tbl
    );
    EXECUTE format(
      'DROP POLICY IF EXISTS "%I_insert" ON public.%I;
       CREATE POLICY "%I_insert" ON public.%I
         FOR INSERT WITH CHECK (org_id IN (SELECT public.my_org_ids()));',
      tbl, tbl, tbl, tbl
    );
    EXECUTE format(
      'DROP POLICY IF EXISTS "%I_update" ON public.%I;
       CREATE POLICY "%I_update" ON public.%I
         FOR UPDATE USING (org_id IN (SELECT public.my_org_ids()));',
      tbl, tbl, tbl, tbl
    );
    EXECUTE format(
      'DROP POLICY IF EXISTS "%I_delete" ON public.%I;
       CREATE POLICY "%I_delete" ON public.%I
         FOR DELETE USING (org_id IN (SELECT public.my_org_ids()));',
      tbl, tbl, tbl, tbl
    );
  END LOOP;
END $$;

-- audit_logs — SELECT only for members, INSERT via SECURITY DEFINER trigger
CREATE POLICY "audit_logs_select" ON public.audit_logs
  FOR SELECT USING (org_id IN (SELECT public.my_org_ids()));
-- No direct INSERT policy — inserts go through the trigger (SECURITY DEFINER)

-- =============================================================================
-- SECTION 12 — PERMISSIONS
-- =============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

DO $$ DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'organizations', 'organization_members', 'channel_configs', 'sending_domains',
    'did_numbers', 'contacts', 'contact_events', 'segments', 'segment_contacts',
    'templates', 'media_assets', 'campaigns', 'journeys', 'journey_enrollments',
    'audit_logs', 'maker_checker_requests', 'credit_transactions', 'invoices',
    'account_health_snapshots'
  ] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated;', tbl);
    EXECUTE format('GRANT ALL ON public.%I TO service_role;', tbl);
  END LOOP;
END $$;

-- =============================================================================
-- DONE
-- =============================================================================
SELECT
  'OneXtel schema v2.0 created successfully.' AS message,
  NOW() AS created_at,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') AS table_count;

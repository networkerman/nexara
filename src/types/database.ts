// =============================================================================
// OneXtel — Supabase Database Types
// Keep in sync with supabase-schema-onextel.sql
// =============================================================================

/* ─── Shared enums ────────────────────────────────────────────────────────── */

export type Channel          = 'SMS' | 'WhatsApp' | 'RCS' | 'Email' | 'Voice';
export type OrgPlan          = 'starter' | 'growth' | 'enterprise';
export type BillingMode      = 'prepaid' | 'postpaid';
export type OrgRole          = 'owner' | 'admin' | 'maker' | 'checker' | 'analyst' | 'viewer';
export type CampaignStatus   = 'draft' | 'pending_approval' | 'scheduled' | 'running' | 'sent' | 'failed' | 'suspended' | 'cancelled';
export type CampaignType     = 'broadcast' | 'triggered' | 'journey_step';
export type JourneyStatus    = 'draft' | 'active' | 'paused' | 'archived';
export type JourneyTrigger   = 'segment_entry' | 'event' | 'api' | 'schedule' | 'inaction';
export type EnrollmentStatus = 'active' | 'waiting' | 'completed' | 'exited' | 'failed';
export type TemplateStatus   = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'expired';
export type TemplateCategory = 'transactional' | 'promotional' | 'otp' | 'service';
export type SegmentType      = 'static' | 'dynamic';
export type DomainStatus     = 'Verified' | 'Partial' | 'Pending' | 'Failed';
export type DomainType       = 'Transactional' | 'Marketing';
export type DidType          = 'Local' | 'Toll-Free' | 'Mobile';
export type DidStatus        = 'Active' | 'Flagged' | 'Inactive';
export type MediaType        = 'image' | 'video' | 'document' | 'audio';
export type McStatus         = 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled';
export type CreditTxType     = 'debit' | 'credit' | 'refund' | 'promotional';
export type InvoiceStatus    = 'draft' | 'issued' | 'paid' | 'overdue' | 'disputed';
export type OrganizationSize = 'small' | 'medium' | 'large'; // legacy compat

/* ─── Database interface ──────────────────────────────────────────────────── */

export interface Database {
  public: {
    Tables: {

      /* ── Organizations ──────────────────────────────────────────── */
      organizations: {
        Row: {
          id:             string;
          name:           string;
          slug:           string | null;
          domain:         string | null;
          plan:           OrgPlan;
          billing_mode:   BillingMode;
          credit_balance: number;
          created_at:     string;
          updated_at:     string;
        };
        Insert: {
          id?:             string;
          name:            string;
          slug?:           string | null;
          domain?:         string | null;
          plan?:           OrgPlan;
          billing_mode?:   BillingMode;
          credit_balance?: number;
          created_at?:     string;
          updated_at?:     string;
        };
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>;
      };

      /* ── Organization members ───────────────────────────────────── */
      organization_members: {
        Row: {
          id:         string;
          org_id:     string;
          user_id:    string;
          role:       OrgRole;
          invited_by: string | null;
          joined_at:  string;
        };
        Insert: {
          id?:         string;
          org_id:      string;
          user_id:     string;
          role?:       OrgRole;
          invited_by?: string | null;
          joined_at?:  string;
        };
        Update: Partial<Database['public']['Tables']['organization_members']['Insert']>;
      };

      /* ── Channel configs ────────────────────────────────────────── */
      channel_configs: {
        Row: {
          id:         string;
          org_id:     string;
          channel:    Channel;
          is_active:  boolean;
          config:     Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?:         string;
          org_id:      string;
          channel:     Channel;
          is_active?:  boolean;
          config?:     Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['channel_configs']['Insert']>;
      };

      /* ── Sending domains (Email) ────────────────────────────────── */
      sending_domains: {
        Row: {
          id:             string;
          org_id:         string;
          domain:         string;
          type:           DomainType;
          dkim_verified:  boolean;
          spf_verified:   boolean;
          dmarc_verified: boolean;
          status:         DomainStatus;
          daily_limit:    number;
          created_at:     string;
        };
        Insert: {
          id?:             string;
          org_id:          string;
          domain:          string;
          type?:           DomainType;
          dkim_verified?:  boolean;
          spf_verified?:   boolean;
          dmarc_verified?: boolean;
          status?:         DomainStatus;
          daily_limit?:    number;
          created_at?:     string;
        };
        Update: Partial<Database['public']['Tables']['sending_domains']['Insert']>;
      };

      /* ── DID numbers (Voice) ────────────────────────────────────── */
      did_numbers: {
        Row: {
          id:         string;
          org_id:     string;
          number:     string;
          type:       DidType;
          operator:   string | null;
          purpose:    string | null;
          status:     DidStatus;
          created_at: string;
        };
        Insert: {
          id?:        string;
          org_id:     string;
          number:     string;
          type?:      DidType;
          operator?:  string | null;
          purpose?:   string | null;
          status?:    DidStatus;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['did_numbers']['Insert']>;
      };

      /* ── Contacts ───────────────────────────────────────────────── */
      contacts: {
        Row: {
          id:                 string;
          org_id:             string;
          phone:              string | null;
          email:              string | null;
          first_name:         string | null;
          last_name:          string | null;
          attributes:         Record<string, unknown>;
          opted_out:          boolean;
          opted_out_at:       string | null;
          opted_out_channel:  string | null;
          created_at:         string;
          updated_at:         string;
        };
        Insert: {
          id?:                string;
          org_id:             string;
          phone?:             string | null;
          email?:             string | null;
          first_name?:        string | null;
          last_name?:         string | null;
          attributes?:        Record<string, unknown>;
          opted_out?:         boolean;
          opted_out_at?:      string | null;
          opted_out_channel?: string | null;
          created_at?:        string;
          updated_at?:        string;
        };
        Update: Partial<Database['public']['Tables']['contacts']['Insert']>;
      };

      /* ── Contact events ─────────────────────────────────────────── */
      contact_events: {
        Row: {
          id:          string;
          org_id:      string;
          contact_id:  string;
          event_name:  string;
          source:      string;
          properties:  Record<string, unknown>;
          occurred_at: string;
        };
        Insert: {
          id?:          string;
          org_id:       string;
          contact_id:   string;
          event_name:   string;
          source?:      string;
          properties?:  Record<string, unknown>;
          occurred_at?: string;
        };
        Update: Partial<Database['public']['Tables']['contact_events']['Insert']>;
      };

      /* ── Segments ───────────────────────────────────────────────── */
      segments: {
        Row: {
          id:                string;
          org_id:            string;
          name:              string;
          description:       string | null;
          type:              SegmentType;
          filter_conditions: Record<string, unknown>;
          contact_count:     number;
          created_by:        string | null;
          created_at:        string;
          updated_at:        string;
        };
        Insert: {
          id?:               string;
          org_id:            string;
          name:              string;
          description?:      string | null;
          type?:             SegmentType;
          filter_conditions?: Record<string, unknown>;
          contact_count?:    number;
          created_by?:       string | null;
          created_at?:       string;
          updated_at?:       string;
        };
        Update: Partial<Database['public']['Tables']['segments']['Insert']>;
      };

      /* ── Segment contacts ───────────────────────────────────────── */
      segment_contacts: {
        Row: {
          segment_id: string;
          contact_id: string;
          added_at:   string;
        };
        Insert: {
          segment_id: string;
          contact_id: string;
          added_at?:  string;
        };
        Update: Partial<Database['public']['Tables']['segment_contacts']['Insert']>;
      };

      /* ── Templates ──────────────────────────────────────────────── */
      templates: {
        Row: {
          id:               string;
          org_id:           string;
          name:             string;
          channel:          Channel;
          category:         TemplateCategory;
          body:             string;
          header:           Record<string, unknown> | null;
          footer:           string | null;
          buttons:          unknown[];
          variables:        unknown[];
          language:         string;
          dlt_template_id:  string | null;
          dlt_expiry_at:    string | null;
          wa_template_id:   string | null;
          status:           TemplateStatus;
          rejection_reason: string | null;
          created_by:       string | null;
          approved_by:      string | null;
          approved_at:      string | null;
          created_at:       string;
          updated_at:       string;
        };
        Insert: {
          id?:               string;
          org_id:            string;
          name:              string;
          channel:           Channel;
          category?:         TemplateCategory;
          body:              string;
          header?:           Record<string, unknown> | null;
          footer?:           string | null;
          buttons?:          unknown[];
          variables?:        unknown[];
          language?:         string;
          dlt_template_id?:  string | null;
          dlt_expiry_at?:    string | null;
          wa_template_id?:   string | null;
          status?:           TemplateStatus;
          rejection_reason?: string | null;
          created_by?:       string | null;
          approved_by?:      string | null;
          approved_at?:      string | null;
          created_at?:       string;
          updated_at?:       string;
        };
        Update: Partial<Database['public']['Tables']['templates']['Insert']>;
      };

      /* ── Media assets ───────────────────────────────────────────── */
      media_assets: {
        Row: {
          id:          string;
          org_id:      string;
          name:        string;
          type:        MediaType;
          url:         string;
          size_bytes:  number | null;
          mime_type:   string | null;
          uploaded_by: string | null;
          created_at:  string;
        };
        Insert: {
          id?:          string;
          org_id:       string;
          name:         string;
          type:         MediaType;
          url:          string;
          size_bytes?:  number | null;
          mime_type?:   string | null;
          uploaded_by?: string | null;
          created_at?:  string;
        };
        Update: Partial<Database['public']['Tables']['media_assets']['Insert']>;
      };

      /* ── Campaigns ──────────────────────────────────────────────── */
      campaigns: {
        Row: {
          id:                string;
          org_id:            string;
          created_by:        string;
          name:              string;
          channel:           Channel;
          type:              CampaignType;
          status:            CampaignStatus;
          template_id:       string | null;
          segment_id:        string | null;
          audience_size:     number;
          scheduled_at:      string | null;
          sent_at:           string | null;
          total_sent:        number;
          total_delivered:   number;
          total_failed:      number;
          total_opened:      number;
          total_clicked:     number;
          total_bounced:     number;
          total_opted_out:   number;
          requires_approval: boolean;
          approved_by:       string | null;
          approved_at:       string | null;
          rejection_reason:  string | null;
          created_at:        string;
          updated_at:        string;
        };
        Insert: {
          id?:               string;
          org_id:            string;
          created_by:        string;
          name:              string;
          channel:           Channel;
          type?:             CampaignType;
          status?:           CampaignStatus;
          template_id?:      string | null;
          segment_id?:       string | null;
          audience_size?:    number;
          scheduled_at?:     string | null;
          sent_at?:          string | null;
          total_sent?:       number;
          total_delivered?:  number;
          total_failed?:     number;
          total_opened?:     number;
          total_clicked?:    number;
          total_bounced?:    number;
          total_opted_out?:  number;
          requires_approval?: boolean;
          approved_by?:      string | null;
          approved_at?:      string | null;
          rejection_reason?: string | null;
          created_at?:       string;
          updated_at?:       string;
        };
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>;
      };

      /* ── Journeys ───────────────────────────────────────────────── */
      journeys: {
        Row: {
          id:              string;
          org_id:          string;
          created_by:      string;
          name:            string;
          description:     string | null;
          status:          JourneyStatus;
          trigger_type:    JourneyTrigger;
          trigger_config:  Record<string, unknown>;
          canvas_nodes:    unknown[];
          canvas_edges:    unknown[];
          enrolled_count:  number;
          active_count:    number;
          completed_count: number;
          created_at:      string;
          updated_at:      string;
        };
        Insert: {
          id?:              string;
          org_id:           string;
          created_by:       string;
          name:             string;
          description?:     string | null;
          status?:          JourneyStatus;
          trigger_type?:    JourneyTrigger;
          trigger_config?:  Record<string, unknown>;
          canvas_nodes?:    unknown[];
          canvas_edges?:    unknown[];
          enrolled_count?:  number;
          active_count?:    number;
          completed_count?: number;
          created_at?:      string;
          updated_at?:      string;
        };
        Update: Partial<Database['public']['Tables']['journeys']['Insert']>;
      };

      /* ── Journey enrollments ────────────────────────────────────── */
      journey_enrollments: {
        Row: {
          id:              string;
          journey_id:      string;
          contact_id:      string;
          current_node_id: string | null;
          status:          EnrollmentStatus;
          exit_reason:     string | null;
          enrolled_at:     string;
          next_step_at:    string | null;
          completed_at:    string | null;
        };
        Insert: {
          id?:              string;
          journey_id:       string;
          contact_id:       string;
          current_node_id?: string | null;
          status?:          EnrollmentStatus;
          exit_reason?:     string | null;
          enrolled_at?:     string;
          next_step_at?:    string | null;
          completed_at?:    string | null;
        };
        Update: Partial<Database['public']['Tables']['journey_enrollments']['Insert']>;
      };

      /* ── Audit logs ─────────────────────────────────────────────── */
      audit_logs: {
        Row: {
          id:            string;
          org_id:        string;
          user_id:       string;
          action:        string;
          resource_type: string;
          resource_id:   string | null;
          resource_name: string | null;
          old_value:     Record<string, unknown> | null;
          new_value:     Record<string, unknown> | null;
          ip_address:    string | null;
          user_agent:    string | null;
          created_at:    string;
        };
        Insert: {
          id?:            string;
          org_id:         string;
          user_id:        string;
          action:         string;
          resource_type:  string;
          resource_id?:   string | null;
          resource_name?: string | null;
          old_value?:     Record<string, unknown> | null;
          new_value?:     Record<string, unknown> | null;
          ip_address?:    string | null;
          user_agent?:    string | null;
          created_at?:    string;
        };
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
      };

      /* ── Maker-Checker requests ─────────────────────────────────── */
      maker_checker_requests: {
        Row: {
          id:            string;
          org_id:        string;
          requested_by:  string;
          reviewed_by:   string | null;
          resource_type: string;
          resource_id:   string;
          resource_name: string | null;
          action:        string;
          payload:       Record<string, unknown>;
          status:        McStatus;
          notes:         string | null;
          expires_at:    string | null;
          created_at:    string;
          reviewed_at:   string | null;
        };
        Insert: {
          id?:            string;
          org_id:         string;
          requested_by:   string;
          reviewed_by?:   string | null;
          resource_type:  string;
          resource_id:    string;
          resource_name?: string | null;
          action:         string;
          payload?:       Record<string, unknown>;
          status?:        McStatus;
          notes?:         string | null;
          expires_at?:    string | null;
          created_at?:    string;
          reviewed_at?:   string | null;
        };
        Update: Partial<Database['public']['Tables']['maker_checker_requests']['Insert']>;
      };

      /* ── Credit transactions ────────────────────────────────────── */
      credit_transactions: {
        Row: {
          id:            string;
          org_id:        string;
          type:          CreditTxType;
          amount:        number;
          balance_after: number | null;
          channel:       Channel | null;
          campaign_id:   string | null;
          journey_id:    string | null;
          description:   string | null;
          created_at:    string;
        };
        Insert: {
          id?:            string;
          org_id:         string;
          type:           CreditTxType;
          amount:         number;
          balance_after?:  number | null;
          channel?:       Channel | null;
          campaign_id?:   string | null;
          journey_id?:    string | null;
          description?:   string | null;
          created_at?:    string;
        };
        Update: Partial<Database['public']['Tables']['credit_transactions']['Insert']>;
      };

      /* ── Invoices ───────────────────────────────────────────────── */
      invoices: {
        Row: {
          id:              string;
          org_id:          string;
          invoice_number:  string;
          period_start:    string;
          period_end:      string;
          status:          InvoiceStatus;
          subtotal:        number;
          credits_applied: number;
          total_due:       number;
          line_items:      unknown[];
          issued_at:       string | null;
          due_at:          string | null;
          paid_at:         string | null;
          created_at:      string;
        };
        Insert: {
          id?:              string;
          org_id:           string;
          invoice_number:   string;
          period_start:     string;
          period_end:       string;
          status?:          InvoiceStatus;
          subtotal?:        number;
          credits_applied?: number;
          total_due?:       number;
          line_items?:      unknown[];
          issued_at?:       string | null;
          due_at?:          string | null;
          paid_at?:         string | null;
          created_at?:      string;
        };
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
      };

      /* ── Account health snapshots ───────────────────────────────── */
      account_health_snapshots: {
        Row: {
          id:                string;
          org_id:            string;
          overall_score:     number;
          delivery_score:    number;
          compliance_score:  number;
          integration_score: number;
          support_score:     number;
          open_tickets:      number;
          critical_alerts:   number;
          detail:            Record<string, unknown>;
          snapshot_at:       string;
        };
        Insert: {
          id?:               string;
          org_id:            string;
          overall_score:     number;
          delivery_score:    number;
          compliance_score:  number;
          integration_score: number;
          support_score:     number;
          open_tickets?:     number;
          critical_alerts?:  number;
          detail?:           Record<string, unknown>;
          snapshot_at?:      string;
        };
        Update: Partial<Database['public']['Tables']['account_health_snapshots']['Insert']>;
      };

      /* ── clients (legacy — onboarding) ─────────────────────────── */
      clients: {
        Row: {
          id:                string;
          user_id:           string;
          full_name:         string;
          company_name:      string;
          company_domain:    string;
          employee_count:    number;
          organization_size: OrganizationSize;
          user_role:         string;
          created_at:        string;
        };
        Insert: {
          id?:               string;
          user_id:           string;
          full_name:         string;
          company_name:      string;
          company_domain:    string;
          employee_count:    number;
          organization_size: OrganizationSize;
          user_role:         string;
          created_at?:       string;
        };
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
    };

    Views: { [_ in never]: never };

    Functions: {
      my_org_ids:  { Args: Record<never, never>; Returns: string[] };
      my_org_role: { Args: { p_org_id: string };  Returns: OrgRole | null };
    };

    Enums: { [_ in never]: never };
  };
}

/* ─── Convenience type aliases ────────────────────────────────────────────── */

type Tables = Database['public']['Tables'];

export type Organization            = Tables['organizations']['Row'];
export type OrganizationInsert      = Tables['organizations']['Insert'];
export type OrganizationUpdate      = Tables['organizations']['Update'];

export type OrgMember               = Tables['organization_members']['Row'];
export type OrgMemberInsert         = Tables['organization_members']['Insert'];

export type ChannelConfig           = Tables['channel_configs']['Row'];
export type ChannelConfigInsert     = Tables['channel_configs']['Insert'];

export type SendingDomain           = Tables['sending_domains']['Row'];
export type SendingDomainInsert     = Tables['sending_domains']['Insert'];

export type DidNumber               = Tables['did_numbers']['Row'];
export type DidNumberInsert         = Tables['did_numbers']['Insert'];

export type Contact                 = Tables['contacts']['Row'];
export type ContactInsert           = Tables['contacts']['Insert'];
export type ContactUpdate           = Tables['contacts']['Update'];

export type ContactEvent            = Tables['contact_events']['Row'];
export type ContactEventInsert      = Tables['contact_events']['Insert'];

export type Segment                 = Tables['segments']['Row'];
export type SegmentInsert           = Tables['segments']['Insert'];
export type SegmentUpdate           = Tables['segments']['Update'];

export type Template                = Tables['templates']['Row'];
export type TemplateInsert          = Tables['templates']['Insert'];
export type TemplateUpdate          = Tables['templates']['Update'];

export type MediaAsset              = Tables['media_assets']['Row'];
export type MediaAssetInsert        = Tables['media_assets']['Insert'];

export type Campaign                = Tables['campaigns']['Row'];
export type CampaignInsert          = Tables['campaigns']['Insert'];
export type CampaignUpdate          = Tables['campaigns']['Update'];

export type Journey                 = Tables['journeys']['Row'];
export type JourneyInsert           = Tables['journeys']['Insert'];
export type JourneyUpdate           = Tables['journeys']['Update'];

export type JourneyEnrollment       = Tables['journey_enrollments']['Row'];
export type JourneyEnrollmentInsert = Tables['journey_enrollments']['Insert'];

export type AuditLog                = Tables['audit_logs']['Row'];
export type AuditLogInsert          = Tables['audit_logs']['Insert'];

export type MakerCheckerRequest     = Tables['maker_checker_requests']['Row'];
export type MakerCheckerInsert      = Tables['maker_checker_requests']['Insert'];
export type MakerCheckerUpdate      = Tables['maker_checker_requests']['Update'];

export type CreditTransaction       = Tables['credit_transactions']['Row'];
export type CreditTransactionInsert = Tables['credit_transactions']['Insert'];

export type Invoice                 = Tables['invoices']['Row'];
export type InvoiceInsert           = Tables['invoices']['Insert'];

export type AccountHealthSnapshot       = Tables['account_health_snapshots']['Row'];
export type AccountHealthSnapshotInsert = Tables['account_health_snapshots']['Insert'];

// Legacy compat
export type Client       = Tables['clients']['Row'];
export type ClientInsert = Tables['clients']['Insert'];
export type ClientUpdate = Tables['clients']['Update'];

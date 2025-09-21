// Supabase Database Types for Nexara
// Generated types for the clients and campaigns tables

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          company_name: string;
          company_domain: string;
          employee_count: number;
          organization_size: 'small' | 'medium' | 'large';
          user_role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          company_name: string;
          company_domain: string;
          employee_count: number;
          organization_size: 'small' | 'medium' | 'large';
          user_role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          company_name?: string;
          company_domain?: string;
          employee_count?: number;
          organization_size?: 'small' | 'medium' | 'large';
          user_role?: string;
          created_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          audience_size: number;
          template_count: number;
          status: 'draft' | 'scheduled' | 'sent';
          scheduled_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          audience_size?: number;
          template_count?: number;
          status?: 'draft' | 'scheduled' | 'sent';
          scheduled_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          audience_size?: number;
          template_count?: number;
          status?: 'draft' | 'scheduled' | 'sent';
          scheduled_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Type aliases for easier usage
export type Client = Database['public']['Tables']['clients']['Row'];
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];
export type CampaignUpdate = Database['public']['Tables']['campaigns']['Update'];

// Organization size enum
export type OrganizationSize = 'small' | 'medium' | 'large';

// Campaign status enum
export type CampaignStatus = 'draft' | 'scheduled' | 'sent';

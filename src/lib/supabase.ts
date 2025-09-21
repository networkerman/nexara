import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://htqhqkmwpqrgvqbrhzwd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cWhxa213cHFyZ3ZxYnJoendkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NTQ3MTgsImV4cCI6MjA3NDAzMDcxOH0.SSIJd2Le1xf82Vn5HJ5kwmGv5XOnaW-qdC-x3a5WXMA';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types (you can generate these from your Supabase schema)
export type Database = {
  public: {
    Tables: {
      campaigns: {
        Row: {
          id: string;
          name: string;
          status: 'DRAFT' | 'SENT' | 'SCHEDULED' | 'SUSPENDED' | 'RUNNING' | 'FAILED';
          channel: 'WhatsApp' | 'Email' | 'SMS' | 'Push';
          sent_on: string | null;
          published: number;
          sent: number;
          opened: number;
          clicked: number;
          bounce: string;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          status?: 'DRAFT' | 'SENT' | 'SCHEDULED' | 'SUSPENDED' | 'RUNNING' | 'FAILED';
          channel: 'WhatsApp' | 'Email' | 'SMS' | 'Push';
          sent_on?: string | null;
          published?: number;
          sent?: number;
          opened?: number;
          clicked?: number;
          bounce?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          status?: 'DRAFT' | 'SENT' | 'SCHEDULED' | 'SUSPENDED' | 'RUNNING' | 'FAILED';
          channel?: 'WhatsApp' | 'Email' | 'SMS' | 'Push';
          sent_on?: string | null;
          published?: number;
          sent?: number;
          opened?: number;
          clicked?: number;
          bounce?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
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
};

// Helper functions for common operations
export const supabaseHelpers = {
  // Test connection
  async testConnection() {
    try {
      const { data, error } = await supabase.from('campaigns').select('count').limit(1);
      if (error) throw error;
      return { success: true, message: 'Connected to Supabase successfully!' };
    } catch (error) {
      return { success: false, message: `Connection failed: ${error}` };
    }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Sign in with email
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign up with email
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }
};

export default supabase;

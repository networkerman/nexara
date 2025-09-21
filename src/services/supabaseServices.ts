import { supabase } from '@/lib/supabase';
import { Client, ClientInsert, ClientUpdate, Campaign, CampaignInsert, CampaignUpdate } from '@/types/database';

// ==============================================
// CLIENTS SERVICE
// ==============================================

export const clientsService = {
  // Create a new client profile
  async createClient(clientData: ClientInsert): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      throw error;
    }

    return data;
  },

  // Get client profile by user ID
  async getClientByUserId(userId: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching client:', error);
      throw error;
    }

    return data;
  },

  // Update client profile
  async updateClient(userId: string, updates: ClientUpdate): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating client:', error);
      throw error;
    }

    return data;
  },

  // Delete client profile
  async deleteClient(userId: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },

  // Check if user has completed onboarding
  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    const client = await this.getClientByUserId(userId);
    return !!client;
  },

  // Get all clients (admin only - requires service role)
  async getAllClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all clients:', error);
      throw error;
    }

    return data || [];
  }
};

// ==============================================
// CAMPAIGNS SERVICE
// ==============================================

export const campaignsService = {
  // Create a new campaign
  async createCampaign(campaignData: CampaignInsert): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaignData)
      .select()
      .single();

    if (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }

    return data;
  },

  // Get campaigns by user ID
  async getCampaignsByUserId(userId: string): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }

    return data || [];
  },

  // Get campaign by ID
  async getCampaignById(campaignId: string): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching campaign:', error);
      throw error;
    }

    return data;
  },

  // Update campaign
  async updateCampaign(campaignId: string, updates: CampaignUpdate): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', campaignId)
      .select()
      .single();

    if (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }

    return data;
  },

  // Delete campaign
  async deleteCampaign(campaignId: string): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId);

    if (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  },

  // Get campaigns by status
  async getCampaignsByStatus(userId: string, status: 'draft' | 'scheduled' | 'sent'): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns by status:', error);
      throw error;
    }

    return data || [];
  },

  // Get campaign statistics for a user
  async getCampaignStats(userId: string): Promise<{
    total: number;
    draft: number;
    scheduled: number;
    sent: number;
    totalAudience: number;
    totalTemplates: number;
  }> {
    const campaigns = await this.getCampaignsByUserId(userId);
    
    const stats = campaigns.reduce((acc, campaign) => {
      acc.total++;
      acc[campaign.status]++;
      acc.totalAudience += campaign.audience_size;
      acc.totalTemplates += campaign.template_count;
      return acc;
    }, {
      total: 0,
      draft: 0,
      scheduled: 0,
      sent: 0,
      totalAudience: 0,
      totalTemplates: 0
    });

    return stats;
  },

  // Get all campaigns (admin only - requires service role)
  async getAllCampaigns(): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all campaigns:', error);
      throw error;
    }

    return data || [];
  }
};

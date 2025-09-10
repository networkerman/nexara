import { supabase, Database } from '@/lib/supabase';
import { Campaign, CampaignListOptions } from '@/types/campaign';

type CampaignRow = Database['public']['Tables']['campaigns']['Row'];
type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];
type CampaignUpdate = Database['public']['Tables']['campaigns']['Update'];

export class SupabaseCampaignService {
  /**
   * Convert Supabase row to Campaign type
   */
  private static mapRowToCampaign(row: CampaignRow): Campaign {
    return {
      id: row.id,
      name: row.name,
      status: row.status,
      sentOn: row.sent_on,
      published: row.published,
      sent: row.sent,
      opened: row.opened,
      clicked: row.clicked,
      bounce: row.bounce,
      channel: row.channel,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /**
   * Fetch all campaigns from Supabase
   */
  static async getCampaigns(options: CampaignListOptions = {}): Promise<Campaign[]> {
    try {
      let query = supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters if needed
      if (options.activeTab && options.activeTab !== 'all') {
        switch (options.activeTab) {
          case 'drafts':
            query = query.eq('status', 'DRAFT');
            break;
          case 'sent':
            query = query.eq('status', 'SENT');
            break;
          case 'scheduled':
            query = query.eq('status', 'SCHEDULED');
            break;
          case 'suspended':
            query = query.eq('status', 'SUSPENDED');
            break;
          case 'running':
            query = query.eq('status', 'RUNNING');
            break;
          case 'failed':
            query = query.eq('status', 'FAILED');
            break;
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      let campaigns = data?.map(this.mapRowToCampaign) || [];

      // Apply search filter
      if (options.searchQuery) {
        campaigns = campaigns.filter(campaign =>
          campaign.name.toLowerCase().includes(options.searchQuery!.toLowerCase()) ||
          campaign.id.includes(options.searchQuery!)
        );
      }

      // Add newly published campaign if exists
      if (options.publishedCampaignId) {
        const newCampaign: Campaign = {
          id: options.publishedCampaignId,
          name: 'New WhatsApp Campaign',
          status: 'SENT',
          sentOn: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short'
          }),
          published: 1,
          sent: 1,
          opened: 0,
          clicked: 0,
          bounce: 'NA',
          channel: 'WhatsApp'
        };
        
        campaigns.unshift(newCampaign);
      }

      return campaigns;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw new Error(`Failed to fetch campaigns: ${error}`);
    }
  }

  /**
   * Create a new campaign
   */
  static async createCampaign(campaign: Omit<CampaignInsert, 'user_id'>): Promise<Campaign> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          ...campaign,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapRowToCampaign(data);
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw new Error(`Failed to create campaign: ${error}`);
    }
  }

  /**
   * Update an existing campaign
   */
  static async updateCampaign(id: string, updates: CampaignUpdate): Promise<Campaign> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return this.mapRowToCampaign(data);
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw new Error(`Failed to update campaign: ${error}`);
    }
  }

  /**
   * Delete a campaign
   */
  static async deleteCampaign(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw new Error(`Failed to delete campaign: ${error}`);
    }
  }

  /**
   * Get campaign statistics
   */
  static async getCampaignStats() {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('status');

      if (error) throw error;

      const campaigns = data || [];
      
      return {
        all: campaigns.length,
        drafts: campaigns.filter(c => c.status === 'DRAFT').length,
        sent: campaigns.filter(c => c.status === 'SENT').length,
        scheduled: campaigns.filter(c => c.status === 'SCHEDULED').length,
        suspended: campaigns.filter(c => c.status === 'SUSPENDED').length,
        running: campaigns.filter(c => c.status === 'RUNNING').length,
        failed: campaigns.filter(c => c.status === 'FAILED').length,
      };
    } catch (error) {
      console.error('Error getting campaign stats:', error);
      throw new Error(`Failed to get campaign stats: ${error}`);
    }
  }

  /**
   * Test database connection
   */
  static async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('count')
        .limit(1);

      if (error) throw error;

      return { 
        success: true, 
        message: 'Successfully connected to Supabase database!' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Database connection failed: ${error}` 
      };
    }
  }
}

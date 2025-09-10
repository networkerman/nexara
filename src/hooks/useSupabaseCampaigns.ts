import { useState, useEffect, useMemo } from 'react';
import { Campaign, StatusTab } from '@/types/campaign';
import { SupabaseCampaignService } from '@/services/supabaseCampaignService';

export function useSupabaseCampaigns(publishedCampaignId?: string | null) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // Test Supabase connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const result = await SupabaseCampaignService.testConnection();
        setIsConnected(result.success);
        if (!result.success) {
          setError(result.message);
        }
      } catch (err) {
        setIsConnected(false);
        setError('Failed to test database connection');
      }
    };

    testConnection();
  }, []);

  // Fetch campaigns from Supabase
  const fetchCampaigns = async () => {
    if (isConnected === false) return; // Don't fetch if not connected

    try {
      setIsLoading(true);
      setError(null);
      const data = await SupabaseCampaignService.getCampaigns({ publishedCampaignId });
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
      setCampaigns([]); // Fallback to empty array
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected === true) {
      fetchCampaigns();
    }
  }, [publishedCampaignId, isConnected]);

  // Calculate status tabs with dynamic counts
  const statusTabs: StatusTab[] = useMemo(() => {
    const stats = {
      all: campaigns.length,
      drafts: campaigns.filter(c => c.status === 'DRAFT').length,
      sent: campaigns.filter(c => c.status === 'SENT').length,
      scheduled: campaigns.filter(c => c.status === 'SCHEDULED').length,
      suspended: campaigns.filter(c => c.status === 'SUSPENDED').length,
      running: campaigns.filter(c => c.status === 'RUNNING').length,
      failed: campaigns.filter(c => c.status === 'FAILED').length,
    };
    
    return [
      { id: 'all', label: 'All', count: stats.all },
      { id: 'drafts', label: 'Drafts', count: stats.drafts },
      { id: 'sent', label: 'Sent', count: stats.sent },
      { id: 'scheduled', label: 'Scheduled', count: stats.scheduled },
      { id: 'suspended', label: 'Suspended', count: stats.suspended },
      { id: 'running', label: 'Running', count: stats.running },
      { id: 'failed', label: 'Failed', count: stats.failed },
    ];
  }, [campaigns]);

  // Create a new campaign
  const createCampaign = async (campaignData: {
    name: string;
    channel: 'WhatsApp' | 'Email' | 'SMS' | 'Push';
    status?: 'DRAFT' | 'SENT' | 'SCHEDULED' | 'SUSPENDED' | 'RUNNING' | 'FAILED';
  }) => {
    try {
      setIsLoading(true);
      const newCampaign = await SupabaseCampaignService.createCampaign({
        name: campaignData.name,
        channel: campaignData.channel,
        status: campaignData.status || 'DRAFT',
        published: 0,
        sent: 0,
        opened: 0,
        clicked: 0,
        bounce: 'NA'
      });
      
      // Refresh campaigns list
      await fetchCampaigns();
      
      return newCampaign;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    campaigns,
    statusTabs,
    isLoading,
    error,
    isConnected,
    refetch: fetchCampaigns,
    createCampaign
  };
}

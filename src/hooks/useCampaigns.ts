import { useState, useEffect, useMemo } from 'react';
import { Campaign, CampaignFilters, StatusTab } from '@/types/campaign';
import { CampaignService } from '@/services/campaignService';

export function useCampaigns(publishedCampaignId?: string | null) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await CampaignService.fetchCampaigns({ publishedCampaignId });
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [publishedCampaignId]);

  // Calculate status tabs with dynamic counts
  const statusTabs: StatusTab[] = useMemo(() => {
    const stats = CampaignService.getCampaignStats(campaigns);
    
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

  return {
    campaigns,
    statusTabs,
    isLoading,
    error,
    refetch: fetchCampaigns
  };
}

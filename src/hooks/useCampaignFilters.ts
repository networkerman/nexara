import { useState, useMemo } from 'react';
import { Campaign, CampaignFilters } from '@/types/campaign';
import { CampaignService } from '@/services/campaignService';

export function useCampaignFilters(campaigns: Campaign[]) {
  const [filters, setFilters] = useState<CampaignFilters>({
    searchQuery: '',
    activeTab: 'all',
    activeChannelFilter: 'WhatsApp'
  });

  // Filter campaigns based on current filters
  const filteredCampaigns = useMemo(() => {
    return CampaignService.filterCampaigns(
      campaigns, 
      filters.searchQuery, 
      filters.activeTab
    );
  }, [campaigns, filters.searchQuery, filters.activeTab]);

  // Update individual filter values
  const updateSearchQuery = (searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  };

  const updateActiveTab = (activeTab: string) => {
    setFilters(prev => ({ ...prev, activeTab }));
  };

  const updateChannelFilter = (activeChannelFilter: string) => {
    setFilters(prev => ({ ...prev, activeChannelFilter }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      activeTab: 'all',
      activeChannelFilter: ''
    });
  };

  return {
    filters,
    filteredCampaigns,
    updateSearchQuery,
    updateActiveTab,
    updateChannelFilter,
    resetFilters
  };
}

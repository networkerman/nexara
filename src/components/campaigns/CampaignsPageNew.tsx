import React, { useState } from 'react';
import { CampaignHeader } from './CampaignHeader';
import { SuccessBanner } from './SuccessBanner';
import { CampaignFilters } from './CampaignFilters';
import { CampaignTableNew } from './CampaignTableNew';
import { CampaignTableSkeleton } from './CampaignTableSkeleton';
import { CreateCampaignModal } from './CreateCampaignModal';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useCampaignFilters } from '@/hooks/useCampaignFilters';
import { useSuccessBanner } from '@/hooks/useSuccessBanner';
import { useScrollPreservation } from '@/hooks/useScrollPreservation';

export function CampaignsPageNew() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Custom hooks for state management
  const { bannerState } = useSuccessBanner();
  const { campaigns, statusTabs, isLoading, error } = useCampaigns(bannerState.campaignId);
  const { 
    filters, 
    filteredCampaigns, 
    updateSearchQuery, 
    updateActiveTab, 
    updateChannelFilter 
  } = useCampaignFilters(campaigns);
  const { containerRef, preserveScrollPosition } = useScrollPreservation();

  const handleCreateCampaign = () => {
    setShowCreateModal(true);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading campaigns: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Page Header */}
      <CampaignHeader onCreateCampaign={handleCreateCampaign} />

      {/* Success Banner */}
      <SuccessBanner bannerState={bannerState} />

      {/* Filters and Tabs */}
      <CampaignFilters
        statusTabs={statusTabs}
        filters={filters}
        onSearchChange={updateSearchQuery}
        onTabChange={updateActiveTab}
        onChannelFilterChange={updateChannelFilter}
        onPreserveScroll={preserveScrollPosition}
      />

      {/* Scrollable Table Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="pt-4">
          {isLoading ? (
            <CampaignTableSkeleton />
          ) : (
            <CampaignTableNew 
              campaigns={filteredCampaigns}
              publishedCampaignId={bannerState.campaignId}
            />
          )}
        </div>
      </div>

      {/* Create Campaign Modal */}
      <CreateCampaignModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
}

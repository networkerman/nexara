import React, { useState } from 'react';
import { Campaign, CampaignTableProps } from '@/types/campaign';
import { usePagination } from '@/hooks/usePagination';
import { CampaignTableHeader } from './CampaignTableHeader';
import { CampaignRow } from './CampaignRow';
import { TablePagination } from './TablePagination';

interface CampaignTableNewProps extends CampaignTableProps {
  campaigns: Campaign[];
}

export function CampaignTableNew({ 
  campaigns, 
  publishedCampaignId 
}: CampaignTableNewProps) {
  const [selectedCampaigns, setSelectedCampaigns] = useState<Set<string>>(new Set());
  
  const {
    currentItems: currentCampaigns,
    paginationState,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    changeItemsPerPage,
    canGoNext,
    canGoPrevious
  } = usePagination(campaigns, 10);

  const handleSelectCampaign = (campaignId: string) => {
    setSelectedCampaigns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedCampaigns(new Set(currentCampaigns.map(c => c.id)));
    } else {
      setSelectedCampaigns(new Set());
    }
  };

  const allSelected = currentCampaigns.length > 0 && 
    currentCampaigns.every(campaign => selectedCampaigns.has(campaign.id));

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <CampaignTableHeader 
              onSelectAll={handleSelectAll}
              allSelected={allSelected}
            />
            <tbody>
              {currentCampaigns.map((campaign) => (
                <CampaignRow
                  key={campaign.id}
                  campaign={campaign}
                  isHighlighted={campaign.id === publishedCampaignId}
                  onSelect={handleSelectCampaign}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <TablePagination
        paginationState={paginationState}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={goToPage}
        onItemsPerPageChange={changeItemsPerPage}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        onNext={nextPage}
        onPrevious={previousPage}
      />
    </div>
  );
}

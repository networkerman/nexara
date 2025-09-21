import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DownloadSplitButton } from '@/components/ui/download-split-button';
import { 
  Search, 
  Filter, 
  Hash, 
  Percent, 
  Settings,
  X
} from 'lucide-react';
import { StatusTab, CampaignFilters as CampaignFiltersType } from '@/types/campaign';

interface CampaignFiltersProps {
  statusTabs: StatusTab[];
  filters: CampaignFiltersType;
  onSearchChange: (query: string) => void;
  onTabChange: (tab: string) => void;
  onChannelFilterChange: (filter: string) => void;
  onPreserveScroll: () => void;
}

export function CampaignFilters({
  statusTabs,
  filters,
  onSearchChange,
  onTabChange,
  onChannelFilterChange,
  onPreserveScroll
}: CampaignFiltersProps) {
  const handleTabChange = (newTab: string) => {
    onPreserveScroll();
    onTabChange(newTab);
  };

  const handleChannelFilterChange = (filter: string) => {
    onPreserveScroll();
    onChannelFilterChange(filter);
  };

  return (
    <div className="sticky top-30 z-30 bg-background border-b border-border px-4 sm:px-6 py-4 space-y-4">
      {/* Channel Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Channel:</span>
        <div className="flex items-center space-x-1">
          {filters.activeChannelFilter && (
            <Badge 
              variant="secondary" 
              className="bg-primary/10 text-primary border-primary/20 flex items-center space-x-1"
            >
              <span>{filters.activeChannelFilter}</span>
              <button 
                onClick={() => handleChannelFilterChange('')}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" className="text-primary">
            Clear All
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filters.activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <DownloadSplitButton />
          <Button variant="outline" size="sm">
            <Hash className="w-4 h-4 mr-2" />
          </Button>
          <Button variant="outline" size="sm">
            <Percent className="w-4 h-4 mr-2" />
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative basis-1/4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={filters.searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
    </div>
  );
}

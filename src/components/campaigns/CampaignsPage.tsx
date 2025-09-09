import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Filter, 
  Download, 
  Hash, 
  Percent, 
  Settings,
  Plus,
  X,
  Info
} from 'lucide-react';
import { CampaignTable } from './CampaignTable';
import { CreateCampaignModal } from './CreateCampaignModal';

const statusTabs = [
  { id: 'all', label: 'All', count: 196 },
  { id: 'drafts', label: 'Drafts', count: 32 },
  { id: 'sent', label: 'Sent', count: 158 },
  { id: 'scheduled', label: 'Scheduled', count: 0 },
  { id: 'suspended', label: 'Suspended', count: 6 },
  { id: 'running', label: 'Running', count: 0 },
  { id: 'failed', label: 'Failed', count: 0 },
];

export function CampaignsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeChannelFilter, setActiveChannelFilter] = useState('WhatsApp');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [publishedCampaignId, setPublishedCampaignId] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Handle post-publish success state
  useEffect(() => {
    const published = searchParams.get('published');
    const campaignId = searchParams.get('campaignId');
    const channel = searchParams.get('channel');
    
    if (published === 'true') {
      setShowSuccessBanner(true);
      setPublishedCampaignId(campaignId);
      
      if (channel) {
        setActiveChannelFilter(channel);
      }
      
      // Auto-scroll to newly published campaign after data loads
      if (campaignId) {
        setTimeout(() => {
          const campaignRow = document.getElementById(`campaign-${campaignId}`);
          if (campaignRow) {
            campaignRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
      
      // Hide banner after 10 seconds
      setTimeout(() => {
        setShowSuccessBanner(false);
        setPublishedCampaignId(null);
      }, 10000);
      
      // Clear URL params
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('published');
      newSearchParams.delete('campaignId');
      newSearchParams.delete('channel');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Simulate data refresh on page load
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [activeTab, activeChannelFilter]);

  // Preserve scroll position on tab/filter change
  const handleTabChange = (newTab: string) => {
    if (tableContainerRef.current) {
      setScrollPosition(tableContainerRef.current.scrollTop);
    }
    setActiveTab(newTab);
  };

  const handleChannelFilterChange = (filter: string) => {
    if (tableContainerRef.current) {
      setScrollPosition(tableContainerRef.current.scrollTop);
    }
    setActiveChannelFilter(filter);
  };

  useEffect(() => {
    if (tableContainerRef.current && scrollPosition > 0) {
      tableContainerRef.current.scrollTop = scrollPosition;
    }
  }, [activeTab, activeChannelFilter, scrollPosition]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Page Header - Sticky */}
      <div className="sticky top-0 z-40 bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Campaigns</h2>
            <p className="text-muted-foreground">
              View and manage your campaigns. To better understand these data points,{' '}
              <button className="text-primary hover:underline">click here</button>.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              CREATE
            </Button>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="px-6 pt-4">
          <Alert className="border-success bg-success/10">
            <Info className="h-4 w-4 text-success" />
            <AlertDescription className="text-success-foreground">
              <strong>Published.</strong> Execution handed off to Adobe; metrics will sync back to Adobe. No customer data stored on Netcore.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Filters and Tabs - Sticky */}
      <div className="sticky top-[120px] z-30 bg-background border-b border-border px-6 py-4 space-y-4">
        {/* Channel Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Channel:</span>
          <div className="flex items-center space-x-1">
            <Badge 
              variant="secondary" 
              className="bg-primary/10 text-primary border-primary/20 flex items-center space-x-1"
            >
              <span>WhatsApp</span>
              <button 
                onClick={() => handleChannelFilterChange('')}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
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
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
            </Button>
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
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Scrollable Table Container */}
      <div 
        ref={tableContainerRef}
        className="flex-1 overflow-y-auto px-6 pb-6" 
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="pt-4">
          {isLoading ? (
            <CampaignTableSkeleton />
          ) : (
            <CampaignTable 
              publishedCampaignId={publishedCampaignId}
              searchQuery={searchQuery}
              activeTab={activeTab}
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

// Skeleton loading component
function CampaignTableSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 px-4 py-3">
                <Skeleton className="w-4 h-4" />
              </th>
              <th className="text-left px-4 py-3">
                <Skeleton className="w-24 h-4" />
              </th>
              <th className="text-left px-4 py-3">
                <Skeleton className="w-16 h-4" />
              </th>
              <th className="text-center px-4 py-3">
                <Skeleton className="w-16 h-4" />
              </th>
              <th className="text-center px-4 py-3">
                <Skeleton className="w-12 h-4" />
              </th>
              <th className="text-center px-4 py-3">
                <Skeleton className="w-20 h-4" />
              </th>
              <th className="text-center px-4 py-3">
                <Skeleton className="w-16 h-4" />
              </th>
              <th className="text-center px-4 py-3">
                <Skeleton className="w-16 h-4" />
              </th>
              <th className="w-12 px-4 py-3">
                <Skeleton className="w-4 h-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-4 py-4">
                  <Skeleton className="w-4 h-4" />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="w-4 h-4 mt-0.5" />
                    <div className="space-y-2">
                      <Skeleton className="w-40 h-4" />
                      <Skeleton className="w-24 h-3" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="w-32 h-4" />
                </td>
                <td className="px-4 py-4 text-center">
                  <Skeleton className="w-8 h-4" />
                </td>
                <td className="px-4 py-4 text-center">
                  <Skeleton className="w-8 h-4" />
                </td>
                <td className="px-4 py-4 text-center">
                  <Skeleton className="w-8 h-4" />
                </td>
                <td className="px-4 py-4 text-center">
                  <Skeleton className="w-8 h-4" />
                </td>
                <td className="px-4 py-4 text-center">
                  <Skeleton className="w-8 h-4" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="w-4 h-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
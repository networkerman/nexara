import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  Hash, 
  Percent, 
  Settings,
  Plus,
  X
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

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-border">
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

      {/* Filters and Tabs */}
      <div className="px-6 py-4 space-y-4">
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
                onClick={() => setActiveChannelFilter('')}
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
                onClick={() => setActiveTab(tab.id)}
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

      {/* Campaign Table */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <CampaignTable />
      </div>

      {/* Create Campaign Modal */}
      <CreateCampaignModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
}
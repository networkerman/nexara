import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, MoreHorizontal } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'DRAFT' | 'SENT';
  sentOn: string | null;
  published: number;
  sent: number;
  opened: number;
  clicked: number;
  bounce: string;
  channel: 'WhatsApp' | 'Email' | 'SMS';
}

const baseCampaigns: Campaign[] = [
  {
    id: '246',
    name: 'Copy:2 Sep 2025 @1:35pm- la...',
    status: 'DRAFT',
    sentOn: null,
    published: 0,
    sent: 0,
    opened: 0,
    clicked: 0,
    bounce: 'NA',
    channel: 'WhatsApp'
  },
  {
    id: '262',
    name: 'Copy:4 Sep 2025 @9:31pm-cra...',
    status: 'SENT',
    sentOn: 'Sep 04, 2025 09:31 PM (GMT +05:30)',
    published: 219,
    sent: 219,
    opened: 1,
    clicked: 1,
    bounce: 'NA',
    channel: 'WhatsApp'
  },
  {
    id: '261',
    name: 'crawer event',
    status: 'SENT',
    sentOn: 'Sep 04, 2025 09:28 PM (GMT +05:30)',
    published: 219,
    sent: 219,
    opened: 1,
    clicked: 0,
    bounce: 'NA',
    channel: 'WhatsApp'
  },
  {
    id: '260',
    name: 'testing_verification',
    status: 'SENT',
    sentOn: 'Sep 04, 2025 06:23 PM (GMT +05:30)',
    published: 1,
    sent: 1,
    opened: 0,
    clicked: 0,
    bounce: 'NA',
    channel: 'WhatsApp'
  },
  {
    id: '257',
    name: 'test campaign',
    status: 'SENT',
    sentOn: 'Sep 03, 2025 07:38 PM (GMT +05:30)',
    published: 1,
    sent: 1,
    opened: 0,
    clicked: 0,
    bounce: 'NA',
    channel: 'WhatsApp'
  }
];

interface CampaignTableProps {
  publishedCampaignId?: string | null;
  searchQuery?: string;
  activeTab?: string;
}

export function CampaignTable({ publishedCampaignId, searchQuery = '', activeTab = 'all' }: CampaignTableProps) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Create campaigns list with newly published campaign at top (if exists)
  const campaigns = useMemo(() => {
    const campaignList = [...baseCampaigns];
    
    // Add newly published campaign to the top
    if (publishedCampaignId) {
      const newCampaign: Campaign = {
        id: publishedCampaignId,
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
      
      // Pin to top for 10 seconds, then sort by latest
      campaignList.unshift(newCampaign);
    }
    
    return campaignList;
  }, [publishedCampaignId]);

  // Filter campaigns based on search and tab
  const filteredCampaigns = useMemo(() => {
    let filtered = campaigns;
    
    if (searchQuery) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.id.includes(searchQuery)
      );
    }
    
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'drafts':
          filtered = filtered.filter(c => c.status === 'DRAFT');
          break;
        case 'sent':
          filtered = filtered.filter(c => c.status === 'SENT');
          break;
        // Add more filters as needed
      }
    }
    
    return filtered;
  }, [campaigns, searchQuery, activeTab]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCampaigns = filteredCampaigns.slice(startIndex, endIndex);
  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Sticky Header */}
            <thead className="bg-muted/50 sticky top-0 z-10">
              <tr>
                <th className="w-12 px-4 py-3">
                  <Checkbox />
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                  Campaign name
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                  Sent on
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">
                  Published
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">
                  Sent
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">
                  Opened / Read
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">
                  Clicked
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">
                  Bounce
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {currentCampaigns.map((campaign) => (
                <tr 
                  key={campaign.id} 
                  id={`campaign-${campaign.id}`}
                  className={`border-t border-border hover:bg-muted/25 ${
                    campaign.id === publishedCampaignId ? 'bg-success/10 ring-1 ring-success/20' : ''
                  }`}
                >
                  <td className="px-4 py-4">
                    <Checkbox />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <MessageCircle className="w-4 h-4 text-success mt-0.5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {campaign.name}
                          {campaign.id === publishedCampaignId && (
                            <Badge variant="outline" className="ml-2 text-xs border-success text-success">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            ID - {campaign.id}
                          </span>
                          <Badge 
                            variant={campaign.status === 'SENT' ? 'default' : 'secondary'}
                            className={campaign.status === 'SENT' ? 'bg-success text-success-foreground' : ''}
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-foreground">
                      {campaign.sentOn || 'NA'}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="text-sm text-foreground">{campaign.published}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="text-sm text-foreground">{campaign.sent}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="text-sm text-foreground">{campaign.opened}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="text-sm text-foreground">{campaign.clicked}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="text-sm text-foreground">{campaign.bounce}</div>
                  </td>
                  <td className="px-4 py-4">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select 
            value={itemsPerPage.toString()} 
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {startIndex + 1}–{Math.min(endIndex, filteredCampaigns.length)} of {filteredCampaigns.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {/* Page Numbers */}
          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2) {
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8"
                  >
                    {page}
                  </Button>
                );
              } else if (Math.abs(page - currentPage) === 3) {
                return <span key={page} className="px-2">...</span>;
              }
              return null;
            })}
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
import { Campaign, CampaignListOptions } from '@/types/campaign';

// Mock campaign data - in a real app, this would come from an API
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

export class CampaignService {
  /**
   * Get campaigns with optional filtering and newly published campaign
   */
  static getCampaigns(options: CampaignListOptions = {}): Campaign[] {
    const { publishedCampaignId, searchQuery, activeTab } = options;
    let campaigns = [...baseCampaigns];
    
    // Add newly published campaign to the top if exists
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
      
      campaigns.unshift(newCampaign);
    }
    
    return campaigns;
  }

  /**
   * Filter campaigns based on search query and active tab
   */
  static filterCampaigns(campaigns: Campaign[], searchQuery: string, activeTab: string): Campaign[] {
    let filtered = campaigns;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.id.includes(searchQuery)
      );
    }
    
    // Apply tab filter
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'drafts':
          filtered = filtered.filter(c => c.status === 'DRAFT');
          break;
        case 'sent':
          filtered = filtered.filter(c => c.status === 'SENT');
          break;
        case 'scheduled':
          filtered = filtered.filter(c => c.status === 'SCHEDULED');
          break;
        case 'suspended':
          filtered = filtered.filter(c => c.status === 'SUSPENDED');
          break;
        case 'running':
          filtered = filtered.filter(c => c.status === 'RUNNING');
          break;
        case 'failed':
          filtered = filtered.filter(c => c.status === 'FAILED');
          break;
      }
    }
    
    return filtered;
  }

  /**
   * Get campaign statistics for status tabs
   */
  static getCampaignStats(campaigns: Campaign[]) {
    const stats = {
      all: campaigns.length,
      drafts: campaigns.filter(c => c.status === 'DRAFT').length,
      sent: campaigns.filter(c => c.status === 'SENT').length,
      scheduled: campaigns.filter(c => c.status === 'SCHEDULED').length,
      suspended: campaigns.filter(c => c.status === 'SUSPENDED').length,
      running: campaigns.filter(c => c.status === 'RUNNING').length,
      failed: campaigns.filter(c => c.status === 'FAILED').length,
    };
    
    return stats;
  }

  /**
   * Simulate API call delay
   */
  static async fetchCampaigns(options: CampaignListOptions = {}): Promise<Campaign[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.getCampaigns(options);
  }
}

// Centralized campaign types and interfaces

export type CampaignStatus = 'DRAFT' | 'SENT' | 'SCHEDULED' | 'SUSPENDED' | 'RUNNING' | 'FAILED';
export type CampaignChannel = 'WhatsApp' | 'Email' | 'SMS' | 'Push';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  sentOn: string | null;
  published: number;
  sent: number;
  opened: number;
  clicked: number;
  bounce: string;
  channel: CampaignChannel;
  createdAt?: string;
  updatedAt?: string;
}

export interface StatusTab {
  id: string;
  label: string;
  count: number;
}

export interface CampaignFilters {
  searchQuery: string;
  activeTab: string;
  activeChannelFilter: string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface CampaignTableProps {
  publishedCampaignId?: string | null;
  searchQuery?: string;
  activeTab?: string;
}

export interface CampaignRowProps {
  campaign: Campaign;
  isHighlighted?: boolean;
  onSelect?: (campaignId: string) => void;
}

// Campaign data preparation utilities
export interface CampaignListOptions {
  publishedCampaignId?: string | null;
  searchQuery?: string;
  activeTab?: string;
  sortBy?: 'name' | 'date' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// Success banner state
export interface SuccessBannerState {
  show: boolean;
  campaignId: string | null;
  message?: string;
}

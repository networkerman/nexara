import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CampaignHeaderProps {
  onCreateCampaign: () => void;
}

export function CampaignHeader({ onCreateCampaign }: CampaignHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-background border-b border-border px-4 sm:px-6 py-4">
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
            onClick={onCreateCampaign}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            CREATE
          </Button>
        </div>
      </div>
    </div>
  );
}

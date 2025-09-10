import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface CampaignTableHeaderProps {
  onSelectAll?: (selected: boolean) => void;
  allSelected?: boolean;
}

export function CampaignTableHeader({ onSelectAll, allSelected = false }: CampaignTableHeaderProps) {
  return (
    <thead className="bg-muted/50 sticky top-0 z-10">
      <tr>
        <th className="w-12 px-4 py-3">
          <Checkbox 
            checked={allSelected}
            onCheckedChange={(checked) => onSelectAll?.(checked as boolean)}
          />
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
  );
}

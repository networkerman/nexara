import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageCircle, MoreHorizontal } from 'lucide-react';
import { CampaignRowProps } from '@/types/campaign';

export function CampaignRow({ campaign, isHighlighted = false, onSelect }: CampaignRowProps) {
  return (
    <tr 
      id={`campaign-${campaign.id}`}
      className={`border-t border-border hover:bg-muted/25 ${
        isHighlighted ? 'bg-success/10 ring-1 ring-success/20' : ''
      }`}
    >
      <td className="px-4 py-4">
        <Checkbox onChange={() => onSelect?.(campaign.id)} />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <MessageCircle className="w-4 h-4 text-success mt-0.5" />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">
              {campaign.name}
              {isHighlighted && (
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
  );
}

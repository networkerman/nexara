import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

const campaigns: Campaign[] = [
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

export function CampaignTable() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
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
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="border-t border-border hover:bg-muted/25">
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
  );
}
import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  MessageSquare,
  MessageCircle,
  Radio,
  Phone,
  Mail,
  ChevronRight,
  RefreshCw,
  Copy,
  BarChart2,
  X,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlayCircle,
  PauseCircle,
  CalendarClock,
  FileEdit,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Types ─────────────────────────────────────────────────────────────────── */

type Channel = 'SMS' | 'WhatsApp' | 'RCS' | 'Voice' | 'Email';
type CampaignStatus = 'Running' | 'Scheduled' | 'Sent' | 'Paused' | 'Failed' | 'Draft';

interface Campaign {
  id: string;
  name: string;
  channel: Channel;
  status: CampaignStatus;
  template: string;
  sentOn: string | null;
  recipients: number;
  delivered: number;
  failed: number;
  awaited: number;
  clicked: number;
}

/* ─── Mock data ──────────────────────────────────────────────────────────────── */

const mockCampaigns: Campaign[] = [
  {
    id: 'C-1042',
    name: 'SBI Credit Card Offer — Jul 2026',
    channel: 'SMS',
    status: 'Running',
    template: 'CC_OFFER_JUL26',
    sentOn: null,
    recipients: 120000,
    delivered: 84200,
    failed: 2100,
    awaited: 33700,
    clicked: 4820,
  },
  {
    id: 'C-1041',
    name: 'Diwali Flash Sale — All Users',
    channel: 'WhatsApp',
    status: 'Running',
    template: 'DIWALI_SALE_V2',
    sentOn: null,
    recipients: 75000,
    delivered: 52100,
    failed: 1800,
    awaited: 21100,
    clicked: 8640,
  },
  {
    id: 'C-1040',
    name: 'OYO Weekend Push',
    channel: 'RCS',
    status: 'Running',
    template: 'OYO_WEEKEND_BOT',
    sentOn: null,
    recipients: 40000,
    delivered: 14800,
    failed: 620,
    awaited: 24580,
    clicked: 2310,
  },
  {
    id: 'C-1039',
    name: 'KPN Transactional Alert — Jun',
    channel: 'WhatsApp',
    status: 'Paused',
    template: 'KPN_TXN_ALERT',
    sentOn: null,
    recipients: 10000,
    delivered: 6200,
    failed: 420,
    awaited: 3380,
    clicked: 0,
  },
  {
    id: 'C-1038',
    name: 'Hero FinCorp EMI Reminder — Q2',
    channel: 'SMS',
    status: 'Sent',
    template: 'EMI_REMINDER_Q2',
    sentOn: '21 May 26, 10:30 AM',
    recipients: 28400,
    delivered: 28400,
    failed: 0,
    awaited: 0,
    clicked: 1920,
  },
  {
    id: 'C-1037',
    name: 'Credgenics Loan Recovery Batch 4',
    channel: 'SMS',
    status: 'Sent',
    template: 'LOAN_RECOVERY_B4',
    sentOn: '20 May 26, 2:15 PM',
    recipients: 15600,
    delivered: 14980,
    failed: 420,
    awaited: 200,
    clicked: 3200,
  },
  {
    id: 'C-1036',
    name: 'CRIS Passenger Alert — 19 May',
    channel: 'SMS',
    status: 'Sent',
    template: 'CRIS_PASSENGER',
    sentOn: '19 May 26, 6:00 AM',
    recipients: 420000,
    delivered: 417800,
    failed: 1200,
    awaited: 1000,
    clicked: 0,
  },
  {
    id: 'C-1035',
    name: 'DMI Finance Welcome Series',
    channel: 'WhatsApp',
    status: 'Scheduled',
    template: 'DMI_WELCOME_V1',
    sentOn: '25 May 26, 9:00 AM',
    recipients: 8000,
    delivered: 0,
    failed: 0,
    awaited: 0,
    clicked: 0,
  },
  {
    id: 'C-1034',
    name: 'Growtele Reactivation Push',
    channel: 'RCS',
    status: 'Scheduled',
    template: 'REACTIVATION_V2',
    sentOn: '24 May 26, 11:00 AM',
    recipients: 22000,
    delivered: 0,
    failed: 0,
    awaited: 0,
    clicked: 0,
  },
  {
    id: 'C-1033',
    name: 'OYO Flash Deal — Failed Batch',
    channel: 'SMS',
    status: 'Failed',
    template: 'OYO_FLASH_DEAL',
    sentOn: '18 May 26, 3:45 PM',
    recipients: 50000,
    delivered: 12400,
    failed: 37600,
    awaited: 0,
    clicked: 820,
  },
  {
    id: 'C-1032',
    name: 'SBI Net Banking Alert Draft',
    channel: 'SMS',
    status: 'Draft',
    template: '—',
    sentOn: null,
    recipients: 0,
    delivered: 0,
    failed: 0,
    awaited: 0,
    clicked: 0,
  },
  {
    id: 'C-1031',
    name: 'Flipkart Big Billion Days Teaser',
    channel: 'WhatsApp',
    status: 'Draft',
    template: 'BBD_TEASER_V1',
    sentOn: null,
    recipients: 0,
    delivered: 0,
    failed: 0,
    awaited: 0,
    clicked: 0,
  },
];

/* ─── Channel config ─────────────────────────────────────────────────────────── */

const channelConfig: Record<Channel, { icon: React.ElementType; color: string; bg: string }> = {
  SMS:      { icon: MessageSquare, color: 'text-info',    bg: 'bg-info/10'    },
  WhatsApp: { icon: MessageCircle, color: 'text-success', bg: 'bg-success/10' },
  RCS:      { icon: Radio,         color: 'text-primary', bg: 'bg-primary/10' },
  Voice:    { icon: Phone,         color: 'text-warning', bg: 'bg-warning/10' },
  Email:    { icon: Mail,          color: 'text-purple-500', bg: 'bg-purple-50' },
};

/* ─── Status config ──────────────────────────────────────────────────────────── */

const statusConfig: Record<CampaignStatus, { icon: React.ElementType; chip: string; dot: string }> = {
  Running:   { icon: PlayCircle,   chip: 'bg-success/10 text-success',     dot: 'bg-success'     },
  Scheduled: { icon: CalendarClock,chip: 'bg-info/10 text-info',           dot: 'bg-info'        },
  Sent:      { icon: CheckCircle2, chip: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' },
  Paused:    { icon: PauseCircle,  chip: 'bg-warning/10 text-warning',     dot: 'bg-warning'     },
  Failed:    { icon: XCircle,      chip: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
  Draft:     { icon: FileEdit,     chip: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' },
};

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function fmtNum(n: number) {
  if (n === 0) return '—';
  return n.toLocaleString('en-IN');
}

function deliveryRate(c: Campaign): number | null {
  if (c.status === 'Draft' || c.status === 'Scheduled') return null;
  if (c.recipients === 0) return null;
  return Math.round((c.delivered / c.recipients) * 100);
}

/* ─── Channel picker modal ───────────────────────────────────────────────────── */

const channelOptions: { channel: Channel; label: string; desc: string; phase2?: boolean }[] = [
  { channel: 'SMS',      label: 'SMS',       desc: 'Bulk text messages via DLT-registered Sender IDs' },
  { channel: 'WhatsApp', label: 'WhatsApp',  desc: 'Rich messages, carousels, buttons and catalogues' },
  { channel: 'RCS',      label: 'RCS',       desc: 'Rich cards and branded messages on Android' },
  { channel: 'Voice',    label: 'Voice',     desc: 'TTS or recorded audio sent to contact lists', phase2: true },
  { channel: 'Email',    label: 'Email',     desc: 'HTML and AMP emails at scale', phase2: true },
];

function ChannelPickerModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-brand-xl shadow-el-4 w-[520px] p-6">
        <div className="flex items-center justify-between mb-1">
          <h2
            className="text-heading-md font-semibold text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            New Campaign
          </h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <p className="text-body-sm text-muted-foreground mb-5">Choose the channel for this campaign</p>

        <div className="flex flex-col gap-2">
          {channelOptions.map(({ channel, label, desc, phase2 }) => {
            const cfg = channelConfig[channel];
            const Icon = cfg.icon;
            return (
              <button
                key={channel}
                disabled={phase2}
                className={cn(
                  'flex items-center gap-4 px-4 py-3.5 rounded-brand-lg border text-left transition-all',
                  phase2
                    ? 'border-border opacity-50 cursor-not-allowed bg-muted/30'
                    : 'border-border hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-el-1 cursor-pointer'
                )}
              >
                <div className={cn('w-9 h-9 rounded-brand-md flex items-center justify-center flex-shrink-0', cfg.bg)}>
                  <Icon className={cn('w-4.5 h-4.5', cfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground">{label}</p>
                  <p className="text-[12px] text-muted-foreground">{desc}</p>
                </div>
                {phase2
                  ? <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground bg-muted px-1.5 py-0.5 rounded-brand-xs">Phase 2</span>
                  : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                }
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Repush confirm ─────────────────────────────────────────────────────────── */

function RepushModal({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-brand-xl shadow-el-4 w-[440px] p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 bg-warning/10 rounded-brand-md flex items-center justify-center flex-shrink-0 mt-0.5">
            <RefreshCw className="w-4 h-4 text-warning" />
          </div>
          <div>
            <h3
              className="text-heading-sm font-semibold text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Repush Failed Sends
            </h3>
            <p className="text-body-sm text-muted-foreground mt-0.5">
              Retry the <span className="font-semibold text-destructive">{campaign.failed.toLocaleString('en-IN')} failed</span> messages from "{campaign.name}".
            </p>
          </div>
        </div>
        <div className="bg-muted/50 rounded-brand-md px-4 py-3 mb-5 text-[12px] text-muted-foreground">
          Only contacts who did not receive the original message will be retried. Contacts who received and failed due to DND will be excluded.
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-brand-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-semibold bg-primary text-white rounded-brand-md hover:bg-primary/90 transition-colors"
          >
            Repush {campaign.failed.toLocaleString('en-IN')} messages
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Row action menu ────────────────────────────────────────────────────────── */

function RowActions({ campaign, onRepush }: { campaign: Campaign; onRepush: (c: Campaign) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors"
      >
        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 bg-card border border-border rounded-brand-md shadow-el-3 py-1 w-44 text-[13px]">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted text-foreground transition-colors">
              <BarChart2 className="w-3.5 h-3.5 text-muted-foreground" />
              Analytics
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted text-foreground transition-colors">
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              Clone
            </button>
            {campaign.status === 'Failed' && campaign.failed > 0 && (
              <button
                onClick={() => { setOpen(false); onRepush(campaign); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted text-warning transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Repush failed
              </button>
            )}
            {(campaign.status === 'Running' || campaign.status === 'Scheduled') && (
              <button className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted text-warning transition-colors">
                <PauseCircle className="w-3.5 h-3.5" />
                Pause
              </button>
            )}
            <div className="my-1 border-t border-border" />
            <button className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted text-destructive transition-colors">
              <X className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Campaign row ───────────────────────────────────────────────────────────── */

function CampaignRowItem({ campaign, onRepush }: { campaign: Campaign; onRepush: (c: Campaign) => void }) {
  const chCfg = channelConfig[campaign.channel];
  const ChIcon = chCfg.icon;
  const stCfg = statusConfig[campaign.status];
  const rate = deliveryRate(campaign);

  return (
    <tr className="border-b border-border hover:bg-muted/25 transition-colors group">
      {/* Name + channel */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className={cn('w-8 h-8 rounded-brand-md flex items-center justify-center flex-shrink-0', chCfg.bg)}>
            <ChIcon className={cn('w-3.5 h-3.5', chCfg.color)} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate max-w-[260px]">{campaign.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-muted-foreground">{campaign.id}</span>
              {campaign.template !== '—' && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-[11px] text-muted-foreground font-mono">{campaign.template}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Channel badge */}
      <td className="px-4 py-3.5">
        <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-brand-xs', chCfg.bg, chCfg.color)}>
          {campaign.channel}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-brand-full', stCfg.chip)}>
          <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', stCfg.dot)} />
          {campaign.status}
        </span>
      </td>

      {/* Sent on */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="text-[12px] text-muted-foreground">{campaign.sentOn ?? '—'}</span>
      </td>

      {/* Recipients */}
      <td className="px-4 py-3.5 text-right">
        <span className="text-[13px] font-medium text-foreground">{fmtNum(campaign.recipients)}</span>
      </td>

      {/* Delivered */}
      <td className="px-4 py-3.5 text-right">
        <span className="text-[13px] text-success font-medium">{fmtNum(campaign.delivered)}</span>
      </td>

      {/* Failed */}
      <td className="px-4 py-3.5 text-right">
        <span className={cn('text-[13px] font-medium', campaign.failed > 0 ? 'text-destructive' : 'text-muted-foreground')}>
          {fmtNum(campaign.failed)}
        </span>
      </td>

      {/* Delivery rate */}
      <td className="px-4 py-3.5">
        {rate !== null ? (
          <div className="flex items-center gap-2 min-w-[80px]">
            <div className="flex-1 h-1.5 bg-muted rounded-brand-full overflow-hidden">
              <div
                className={cn('h-full rounded-brand-full', rate >= 95 ? 'bg-success' : rate >= 80 ? 'bg-warning' : 'bg-destructive')}
                style={{ width: `${rate}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground w-8 text-right">{rate}%</span>
          </div>
        ) : (
          <span className="text-[12px] text-muted-foreground">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <RowActions campaign={campaign} onRepush={onRepush} />
      </td>
    </tr>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────────── */

const ALL_CHANNELS: Array<Channel | 'All'> = ['All', 'SMS', 'WhatsApp', 'RCS', 'Voice', 'Email'];
const ALL_STATUSES: Array<CampaignStatus | 'All'> = ['All', 'Running', 'Scheduled', 'Draft', 'Sent', 'Paused', 'Failed'];

export function CampaignsPageNew() {
  const [activeChannel, setActiveChannel] = useState<Channel | 'All'>('All');
  const [activeStatus, setActiveStatus]   = useState<CampaignStatus | 'All'>('All');
  const [search, setSearch]               = useState('');
  const [showNewModal, setShowNewModal]   = useState(false);
  const [repushTarget, setRepushTarget]   = useState<Campaign | null>(null);

  const filtered = useMemo(() => {
    return mockCampaigns.filter(c => {
      if (activeChannel !== 'All' && c.channel !== activeChannel) return false;
      if (activeStatus !== 'All' && c.status !== activeStatus)   return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.id.includes(search)) return false;
      return true;
    });
  }, [activeChannel, activeStatus, search]);

  // KPI summary
  const kpis = useMemo(() => ({
    total:     mockCampaigns.length,
    running:   mockCampaigns.filter(c => c.status === 'Running').length,
    scheduled: mockCampaigns.filter(c => c.status === 'Scheduled').length,
    failed:    mockCampaigns.filter(c => c.status === 'Failed').length,
  }), []);

  // Tab counts
  const statusCounts = useMemo(() => {
    const map: Record<string, number> = { All: mockCampaigns.length };
    ALL_STATUSES.forEach(s => { if (s !== 'All') map[s] = mockCampaigns.filter(c => c.status === s).length; });
    return map;
  }, []);

  const channelCounts = useMemo(() => {
    const map: Record<string, number> = { All: mockCampaigns.length };
    ALL_CHANNELS.forEach(ch => { if (ch !== 'All') map[ch] = mockCampaigns.filter(c => c.channel === ch).length; });
    return map;
  }, []);

  return (
    <>
      <div className="flex flex-col h-full">

        {/* ── Top bar ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card flex-shrink-0">
          <div>
            <p className="text-body-sm text-muted-foreground">
              {mockCampaigns.length} campaigns across all channels
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-brand-md transition-colors border border-border">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-[13px] font-semibold rounded-brand-md hover:bg-primary/90 transition-colors shadow-el-1"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </button>
          </div>
        </div>

        {/* ── KPI row ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3 px-6 py-4 bg-muted/20 border-b border-border flex-shrink-0">
          {[
            { label: 'Total Campaigns', value: kpis.total,     color: 'text-foreground'   },
            { label: 'Running',         value: kpis.running,   color: 'text-success'      },
            { label: 'Scheduled',       value: kpis.scheduled, color: 'text-info'         },
            { label: 'Failed',          value: kpis.failed,    color: 'text-destructive'  },
          ].map(k => (
            <div key={k.label} className="bg-card border border-border rounded-brand-lg px-4 py-3 shadow-el-1">
              <p className="text-body-sm text-muted-foreground">{k.label}</p>
              <p className={cn('text-[24px] font-bold leading-tight mt-0.5', k.color)} style={{ fontFamily: 'var(--font-heading)' }}>
                {k.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Channel tabs ─────────────────────────────────────────── */}
        <div className="flex items-center gap-1 px-6 py-3 border-b border-border bg-card flex-shrink-0 overflow-x-auto">
          {ALL_CHANNELS.map(ch => {
            const count = channelCounts[ch] ?? 0;
            const cfg = ch !== 'All' ? channelConfig[ch] : null;
            const isActive = activeChannel === ch;
            return (
              <button
                key={ch}
                onClick={() => setActiveChannel(ch as Channel | 'All')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-brand-md text-[12px] font-semibold transition-colors whitespace-nowrap',
                  isActive
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {cfg && <cfg.icon className="w-3 h-3" />}
                {ch}
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-brand-full font-semibold',
                  isActive ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Status tabs + search ──────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-1">
            {ALL_STATUSES.map(s => {
              const count = statusCounts[s] ?? 0;
              const isActive = activeStatus === s;
              return (
                <button
                  key={s}
                  onClick={() => setActiveStatus(s as CampaignStatus | 'All')}
                  className={cn(
                    'px-3 py-1.5 rounded-brand-md text-[12px] font-semibold transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {s} <span className="ml-0.5 opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search campaigns…"
                className="pl-9 pr-3 py-1.5 text-[13px] bg-muted border border-border rounded-brand-md focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 w-[220px] placeholder:text-muted-foreground/60"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-brand-md transition-colors border border-border">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
          </div>
        </div>

        {/* ── Table ────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Search className="w-8 h-8 text-muted-foreground mb-3 opacity-50" />
              <p className="text-[14px] font-medium text-foreground">No campaigns found</p>
              <p className="text-body-sm text-muted-foreground mt-1">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Campaign', 'Channel', 'Status', 'Sent On', 'Recipients', 'Delivered', 'Failed', 'Delivery Rate', ''].map(h => (
                    <th
                      key={h}
                      className={cn(
                        'px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide',
                        h === 'Campaign' ? 'px-5 text-left' :
                        h === '' ? 'w-10' :
                        ['Recipients', 'Delivered', 'Failed'].includes(h) ? 'text-right' : 'text-left'
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <CampaignRowItem key={c.id} campaign={c} onRepush={setRepushTarget} />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Footer count ─────────────────────────────────────────── */}
        <div className="px-6 py-2.5 border-t border-border bg-muted/20 flex-shrink-0">
          <p className="text-[11px] text-muted-foreground">
            Showing {filtered.length} of {mockCampaigns.length} campaigns
          </p>
        </div>

      </div>

      {/* Modals */}
      {showNewModal  && <ChannelPickerModal onClose={() => setShowNewModal(false)} />}
      {repushTarget  && <RepushModal campaign={repushTarget} onClose={() => setRepushTarget(null)} />}
    </>
  );
}

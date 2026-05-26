import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CreateTemplate } from '@/components/content/CreateTemplate';
import { WhatsAppIcon, RCSIcon, SMSIcon, EmailIcon, VoiceIcon } from '@/components/icons/ChannelIcons';
import {
  Image,
  Plus,
  Search,
  Upload,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  FileText,
  Tag,
  Eye,
  Copy,
  Trash2,
  Download,
  Film,
  File,
  Grid3X3,
  List,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Types ──────────────────────────────────────────────────────────────────── */

type Channel = 'Email' | 'SMS' | 'WhatsApp' | 'RCS' | 'Voice' | 'DLT' | 'Media';
type TemplateStatus = 'Approved' | 'Pending' | 'Rejected' | 'Draft';
type MediaType = 'Image' | 'Video' | 'Document' | 'Audio';

interface Template {
  id: string;
  name: string;
  channel: Exclude<Channel, 'DLT' | 'Media'>;
  category: string;
  status: TemplateStatus;
  language: string;
  lastUpdated: string;
  usedIn: number;
  preview: string;
  subType?: string;
}

interface MediaFile {
  id: string;
  name: string;
  type: MediaType;
  size: string;
  url: string;
  uploadedOn: string;
  usedIn: number;
}

/* ─── Mock templates ─────────────────────────────────────────────────────────── */

const mockTemplates: Template[] = [
  // SMS
  { id: 'T-1001', name: 'OTP Verification',        channel: 'SMS', category: 'Transactional', status: 'Approved', language: 'English', lastUpdated: '20 May 26', usedIn: 14, preview: 'Your OTP for login is {#var#}. Valid for 10 minutes. Do not share.' },
  { id: 'T-1002', name: 'EMI Due Reminder',         channel: 'SMS', category: 'Transactional', status: 'Approved', language: 'English', lastUpdated: '18 May 26', usedIn: 8,  preview: 'Dear {#var#}, your EMI of Rs.{#var#} is due on {#var#}. Pay now: {#var#}' },
  { id: 'T-1003', name: 'Festival Offer — Diwali',  channel: 'SMS', category: 'Promotional',   status: 'Approved', language: 'English', lastUpdated: '15 May 26', usedIn: 3,  preview: 'Celebrate Diwali with up to 40% off! Shop now at {#var#}. Offer valid till {#var#}.' },
  { id: 'T-1004', name: 'Loan Approval Alert',      channel: 'SMS', category: 'Transactional', status: 'Pending',  language: 'English', lastUpdated: '22 May 26', usedIn: 0,  preview: 'Congratulations {#var#}! Your loan of Rs.{#var#} has been approved. Disbursal in 24 hrs.' },
  { id: 'T-1005', name: 'Account Statement',        channel: 'SMS', category: 'Service',       status: 'Draft',    language: 'English', lastUpdated: '22 May 26', usedIn: 0,  preview: 'Your {#var#} account statement for {#var#} is ready. Download: {#var#}' },

  // WhatsApp
  { id: 'T-2001', name: 'Welcome Message',          channel: 'WhatsApp', category: 'Utility',      status: 'Approved', language: 'English', lastUpdated: '19 May 26', usedIn: 12, preview: 'Welcome to {#var#}! 👋 Your account is ready. Here\'s what you can do…', subType: 'Text' },
  { id: 'T-2002', name: 'Order Confirmation',       channel: 'WhatsApp', category: 'Utility',      status: 'Approved', language: 'English', lastUpdated: '17 May 26', usedIn: 6,  preview: 'Your order #{#var#} has been confirmed! Expected delivery: {#var#}', subType: 'Media' },
  { id: 'T-2003', name: 'Product Catalogue',        channel: 'WhatsApp', category: 'Marketing',    status: 'Approved', language: 'English', lastUpdated: '14 May 26', usedIn: 4,  preview: 'Browse our latest collection! Tap to explore →', subType: 'Catalogue' },
  { id: 'T-2004', name: 'Feedback Collection',      channel: 'WhatsApp', category: 'Utility',      status: 'Pending',  language: 'English', lastUpdated: '21 May 26', usedIn: 0,  preview: 'How was your experience with us? Rate on a scale of 1-5', subType: 'Text' },
  { id: 'T-2005', name: 'Flash Sale — Paused',      channel: 'WhatsApp', category: 'Marketing',    status: 'Rejected', language: 'English', lastUpdated: '20 May 26', usedIn: 0,  preview: 'FLASH SALE! 50% off everything for the next 2 hours only!', subType: 'Text' },

  // RCS
  { id: 'T-3001', name: 'Rich Product Card',        channel: 'RCS', category: 'Promotional',   status: 'Approved', language: 'English', lastUpdated: '16 May 26', usedIn: 5, preview: 'Check out our latest offers with rich media cards and action buttons.' },
  { id: 'T-3002', name: 'Payment Reminder',         channel: 'RCS', category: 'Transactional', status: 'Approved', language: 'English', lastUpdated: '12 May 26', usedIn: 3, preview: 'Your payment of Rs.{#var#} is due. Tap below to pay instantly.' },

  // Email
  { id: 'T-4001', name: 'Monthly Newsletter',       channel: 'Email', category: 'Marketing',    status: 'Draft',    language: 'English', lastUpdated: '22 May 26', usedIn: 0, preview: 'HTML newsletter template with header, body blocks and footer.' },
  { id: 'T-4002', name: 'Password Reset',           channel: 'Email', category: 'Transactional', status: 'Approved', language: 'English', lastUpdated: '10 May 26', usedIn: 22, preview: 'Click the link below to reset your password. Link expires in 24 hours.' },
];

const mockMedia: MediaFile[] = [
  { id: 'M-001', name: 'hero-banner-diwali.jpg',   type: 'Image',    size: '842 KB',  url: '', uploadedOn: '20 May 26', usedIn: 4 },
  { id: 'M-002', name: 'product-launch.mp4',       type: 'Video',    size: '12.4 MB', url: '', uploadedOn: '18 May 26', usedIn: 2 },
  { id: 'M-003', name: 'emi-schedule.pdf',          type: 'Document', size: '128 KB',  url: '', uploadedOn: '15 May 26', usedIn: 6 },
  { id: 'M-004', name: 'logo-white.png',            type: 'Image',    size: '24 KB',   url: '', uploadedOn: '10 May 26', usedIn: 18 },
  { id: 'M-005', name: 'promo-card-rcs.jpg',        type: 'Image',    size: '480 KB',  url: '', uploadedOn: '08 May 26', usedIn: 3 },
  { id: 'M-006', name: 'account-opening.pdf',      type: 'Document', size: '256 KB',  url: '', uploadedOn: '05 May 26', usedIn: 1 },
  { id: 'M-007', name: 'brand-jingle.mp3',          type: 'Audio',    size: '3.2 MB',  url: '', uploadedOn: '02 May 26', usedIn: 0 },
  { id: 'M-008', name: 'cashback-offer.jpg',        type: 'Image',    size: '320 KB',  url: '', uploadedOn: '01 May 26', usedIn: 7 },
];

/* ─── Channel nav config ─────────────────────────────────────────────────────── */

const channelNav: { id: Channel; label: string; icon: React.ElementType; phase2?: boolean }[] = [
  { id: 'SMS',      label: 'SMS',           icon: SMSIcon      },
  { id: 'WhatsApp', label: 'WhatsApp',      icon: WhatsAppIcon },
  { id: 'RCS',      label: 'RCS',           icon: RCSIcon      },
  { id: 'Email',    label: 'Email',         icon: EmailIcon    },
  { id: 'Voice',    label: 'Voice',         icon: VoiceIcon,   phase2: true },
  { id: 'DLT',      label: 'DLT',           icon: FileText     },
  { id: 'Media',    label: 'Media gallery', icon: Image        },
];

/* ─── Status config ──────────────────────────────────────────────────────────── */

const statusConfig: Record<TemplateStatus, { chip: string; icon: React.ElementType; dot: string }> = {
  Approved: { chip: 'bg-success/10 text-success',           icon: CheckCircle2,   dot: 'bg-success'     },
  Pending:  { chip: 'bg-warning/10 text-warning',           icon: Clock,          dot: 'bg-warning'     },
  Rejected: { chip: 'bg-destructive/10 text-destructive',   icon: XCircle,        dot: 'bg-destructive' },
  Draft:    { chip: 'bg-muted text-muted-foreground',        icon: FileText,       dot: 'bg-muted-foreground' },
};

const categoryColors: Record<string, string> = {
  Transactional: 'bg-info/10 text-info',
  Promotional:   'bg-primary/10 text-primary',
  Marketing:     'bg-primary/10 text-primary',
  Utility:       'bg-success/10 text-success',
  Service:       'bg-purple-100 text-purple-600',
};

/* ─── WA scratch options ─────────────────────────────────────────────────────── */

const waScratchOptions = [
  { label: 'Text',          desc: 'Simple text message with optional buttons' },
  { label: 'Media',         desc: 'Image, video or document with caption' },
  { label: 'Catalogue',     desc: 'Product catalogue with up to 30 items' },
  { label: 'Multi-Product', desc: 'Multiple products in a single message' },
];

/* ─── Template card ──────────────────────────────────────────────────────────── */

function TemplateCard({ tpl }: { tpl: Template }) {
  const st = statusConfig[tpl.status];
  const StIcon = st.icon;
  const catColor = categoryColors[tpl.category] ?? 'bg-muted text-muted-foreground';

  return (
    <div className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1 hover:shadow-el-2 transition-shadow flex flex-col gap-3 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-foreground truncate">{tpl.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{tpl.id} · {tpl.language}</p>
        </div>
        <button className="w-6 h-6 flex items-center justify-center rounded-brand-md hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Preview */}
      <div className="bg-muted/40 rounded-brand-md px-3 py-2.5 min-h-[56px]">
        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">{tpl.preview}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-brand-xs', catColor)}>
            {tpl.category}
          </span>
          {tpl.subType && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-brand-xs bg-muted text-muted-foreground">
              {tpl.subType}
            </span>
          )}
        </div>
        <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-brand-full', st.chip)}>
          <StIcon className="w-2.5 h-2.5" />
          {tpl.status}
        </span>
      </div>

      {/* Used in */}
      {tpl.usedIn > 0 && (
        <p className="text-[11px] text-muted-foreground border-t border-border pt-2 mt-auto">
          Used in <span className="font-semibold text-foreground">{tpl.usedIn}</span> campaigns
        </p>
      )}
    </div>
  );
}

/* ─── Start from scratch bar ─────────────────────────────────────────────────── */

function ScratchBar({ channel }: { channel: Channel }) {
  if (channel === 'WhatsApp') {
    return (
      <div className="flex items-center gap-3 p-4 bg-muted/30 border border-border rounded-brand-xl mb-5">
        <p className="text-[13px] font-semibold text-foreground flex-shrink-0">Start from scratch:</p>
        <div className="flex items-center gap-2 flex-wrap">
          {waScratchOptions.map(opt => (
            <button
              key={opt.label}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-brand-md text-[12px] font-semibold text-foreground hover:border-primary/40 hover:bg-primary/[0.03] transition-all shadow-el-1"
            >
              <Plus className="w-3 h-3 text-primary" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (channel === 'Email') {
    return (
      <div className="flex items-center gap-3 p-4 bg-muted/30 border border-border rounded-brand-xl mb-5">
        <p className="text-[13px] font-semibold text-foreground flex-shrink-0">Start from scratch:</p>
        <div className="flex items-center gap-2">
          {['HTML', 'AMP'].map(t => (
            <button key={t} className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-brand-md text-[12px] font-semibold text-foreground hover:border-primary/40 hover:bg-primary/[0.03] transition-all shadow-el-1">
              <Plus className="w-3 h-3 text-primary" />
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-muted/30 border border-border rounded-brand-xl mb-5">
      <p className="text-[13px] font-semibold text-foreground flex-shrink-0">Start from scratch:</p>
      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-brand-md text-[12px] font-semibold text-foreground hover:border-primary/40 hover:bg-primary/[0.03] transition-all shadow-el-1">
        <Plus className="w-3 h-3 text-primary" />
        Create new
      </button>
    </div>
  );
}

/* ─── Templates view ─────────────────────────────────────────────────────────── */

function TemplatesView({ channel }: { channel: Exclude<Channel, 'DLT' | 'Media'> }) {
  const [activeTab, setActiveTab] = useState<'gallery' | 'saved'>('gallery');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TemplateStatus | 'All'>('All');

  const channelTemplates = mockTemplates.filter(t => t.channel === channel);
  const filtered = channelTemplates.filter(t => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusCounts = {
    All: channelTemplates.length,
    Approved: channelTemplates.filter(t => t.status === 'Approved').length,
    Pending:  channelTemplates.filter(t => t.status === 'Pending').length,
    Rejected: channelTemplates.filter(t => t.status === 'Rejected').length,
    Draft:    channelTemplates.filter(t => t.status === 'Draft').length,
  };

  // WA rejected warning
  const hasRejected = channel === 'WhatsApp' && channelTemplates.some(t => t.status === 'Rejected');

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border px-6 flex-shrink-0">
        {(['gallery', 'saved'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors -mb-px',
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === 'gallery' ? 'Template gallery' : 'Saved templates'}
            {tab === 'saved' && (
              <span className="ml-1.5 text-[11px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-brand-full">
                {channelTemplates.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-6 py-5">
        {/* WA category change warning */}
        {hasRejected && (
          <div className="flex items-center justify-between bg-warning/8 border border-warning/30 rounded-brand-xl px-4 py-3 mb-5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
              <p className="text-[13px] text-foreground">
                <span className="font-semibold">Some templates paused</span> — Meta reclassified Utility templates to Marketing. Review and re-submit.
              </p>
            </div>
            <button className="text-[12px] font-semibold text-warning hover:text-warning/80 flex-shrink-0 ml-4">
              Review →
            </button>
          </div>
        )}

        {activeTab === 'gallery' ? (
          <>
            <ScratchBar channel={channel} />
            {/* Pre-built gallery placeholder */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'OTP / Authentication', count: 12 },
                { label: 'Payment & Billing',     count: 8  },
                { label: 'Order Updates',          count: 15 },
                { label: 'Promotional Offers',     count: 20 },
                { label: 'Welcome & Onboarding',   count: 6  },
                { label: 'Reminders',              count: 10 },
              ].map(cat => (
                <button
                  key={cat.label}
                  className="flex items-center justify-between bg-card border border-border rounded-brand-xl px-4 py-4 hover:border-primary/40 hover:shadow-el-1 transition-all text-left"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">{cat.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{cat.count} templates</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Search + filter bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {(['All', 'Approved', 'Pending', 'Rejected', 'Draft'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      'px-3 py-1 rounded-brand-md text-[12px] font-semibold transition-colors',
                      statusFilter === s
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {s} <span className="opacity-60">({statusCounts[s] ?? 0})</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search templates…"
                    className="pl-9 pr-3 py-1.5 text-[13px] bg-muted border border-border rounded-brand-md focus:outline-none focus:ring-1 focus:ring-primary/50 w-[200px] placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
            </div>

            {/* Template grid */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <FileText className="w-8 h-8 text-muted-foreground mb-3 opacity-40" />
                <p className="text-[14px] font-medium text-foreground">No templates found</p>
                <p className="text-body-sm text-muted-foreground mt-1">Try a different filter or create a new template</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filtered.map(t => <TemplateCard key={t.id} tpl={t} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── DLT view ───────────────────────────────────────────────────────────────── */

const dltTemplates = [
  { id: 'DLT-1042', name: 'OTP_VERIFY_V2',    peId: '1101156789012345', tmId: '1107165789012300', status: 'Active',   type: 'Transactional', senderIds: ['SBISMS', 'CREDMS'] },
  { id: 'DLT-1041', name: 'EMI_REMINDER_Q2',  peId: '1101156789012345', tmId: '1107165789012301', status: 'Active',   type: 'Transactional', senderIds: ['HEROMS'] },
  { id: 'DLT-1040', name: 'LOAN_APPROVAL',    peId: '1101156789012346', tmId: '1107165789012302', status: 'Pending',  type: 'Transactional', senderIds: [] },
  { id: 'DLT-1039', name: 'PROMO_DIWALI_V1',  peId: '1101156789012345', tmId: '1107165789012303', status: 'Active',   type: 'Promotional',   senderIds: ['SBISMS'] },
  { id: 'DLT-1038', name: 'FLASH_SALE_AUG',   peId: '1101156789012347', tmId: '1107165789012304', status: 'Rejected', type: 'Promotional',   senderIds: [] },
];

function DLTView() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="text-[14px] font-semibold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>DLT Template Management</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">TRAI-registered templates — PE-TM binding required for all SMS sends</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-primary text-white text-[12px] font-semibold rounded-brand-md hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add DLT Template
        </button>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        {/* Sender IDs section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[13px] font-semibold text-foreground">Sender IDs</h4>
            <button className="text-[12px] font-semibold text-primary hover:text-primary/80">+ Add Sender ID</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['SBISMS', 'CREDMS', 'HEROMS', 'KPNTXT', 'CRISIN'].map(sid => (
              <div key={sid} className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-brand-md">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                <span className="text-[12px] font-mono font-semibold text-foreground">{sid}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Template table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Template ID', 'Name', 'PE ID', 'TM ID', 'Type', 'Sender IDs', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dltTemplates.map(t => {
              const statusStyle = t.status === 'Active' ? 'bg-success/10 text-success' : t.status === 'Pending' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive';
              return (
                <tr key={t.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3"><span className="text-[12px] font-mono text-muted-foreground">{t.id}</span></td>
                  <td className="px-4 py-3"><span className="text-[13px] font-medium text-foreground">{t.name}</span></td>
                  <td className="px-4 py-3"><span className="text-[11px] font-mono text-muted-foreground">{t.peId}</span></td>
                  <td className="px-4 py-3"><span className="text-[11px] font-mono text-muted-foreground">{t.tmId}</span></td>
                  <td className="px-4 py-3"><span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-brand-xs', categoryColors[t.type] ?? 'bg-muted text-muted-foreground')}>{t.type}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {t.senderIds.length > 0
                        ? t.senderIds.map(s => <span key={s} className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded-brand-xs">{s}</span>)
                        : <span className="text-[11px] text-muted-foreground">—</span>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-brand-full', statusStyle)}>{t.status}</span></td>
                  <td className="px-4 py-3"><button className="w-6 h-6 flex items-center justify-center rounded-brand-md hover:bg-muted"><MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Media gallery ──────────────────────────────────────────────────────────── */

const mediaTypeIcons: Record<MediaType, React.ElementType> = {
  Image: Image, Video: Film, Document: File, Audio: FileText,
};
const mediaTypeColors: Record<MediaType, string> = {
  Image: 'text-info bg-info/10', Video: 'text-primary bg-primary/10', Document: 'text-warning bg-warning/10', Audio: 'text-success bg-success/10',
};

function MediaGallery() {
  const [typeFilter, setTypeFilter] = useState<MediaType | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = mockMedia.filter(m => typeFilter === 'All' || m.type === typeFilter);
  const counts: Record<string, number> = {
    All: mockMedia.length,
    Image: mockMedia.filter(m => m.type === 'Image').length,
    Video: mockMedia.filter(m => m.type === 'Video').length,
    Document: mockMedia.filter(m => m.type === 'Document').length,
    Audio: mockMedia.filter(m => m.type === 'Audio').length,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-1">
          {(['All', 'Image', 'Video', 'Document', 'Audio'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                'px-3 py-1.5 rounded-brand-md text-[12px] font-semibold transition-colors',
                typeFilter === t ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {t} <span className="opacity-60">({counts[t]})</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className={cn('w-7 h-7 flex items-center justify-center rounded-brand-md transition-colors', viewMode === 'grid' ? 'bg-muted' : 'hover:bg-muted')}>
            <Grid3X3 className="w-3.5 h-3.5 text-muted-foreground" onClick={() => setViewMode('grid')} />
          </button>
          <button className={cn('w-7 h-7 flex items-center justify-center rounded-brand-md transition-colors', viewMode === 'list' ? 'bg-muted' : 'hover:bg-muted')}>
            <List className="w-3.5 h-3.5 text-muted-foreground" onClick={() => setViewMode('list')} />
          </button>
          <div className="w-px h-4 bg-border" />
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-brand-md transition-colors border border-border">
            <Download className="w-3.5 h-3.5" />
            Import
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-[12px] font-semibold rounded-brand-md hover:bg-primary/90 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Upload
          </button>
        </div>
      </div>

      {/* Upload drop zone */}
      <div className="mx-6 mt-4 mb-4 border-2 border-dashed border-border rounded-brand-xl py-5 flex items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer flex-shrink-0">
        <Upload className="w-4 h-4 text-muted-foreground" />
        <p className="text-[13px] text-muted-foreground">
          Drop files here or <span className="text-primary font-semibold">browse</span> to upload
          <span className="text-muted-foreground/60 ml-1">· Images, Videos, Documents, Audio</span>
        </p>
      </div>

      {/* Grid / list */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-4">
            {filtered.map(file => {
              const Icon = mediaTypeIcons[file.type];
              const iconStyle = mediaTypeColors[file.type];
              return (
                <div key={file.id} className="bg-card border border-border rounded-brand-xl overflow-hidden shadow-el-1 hover:shadow-el-2 transition-shadow group">
                  {/* Preview area */}
                  <div className="h-32 bg-muted/40 flex items-center justify-center relative">
                    <div className={cn('w-12 h-12 rounded-brand-xl flex items-center justify-center', iconStyle)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-brand-md flex items-center justify-center hover:bg-white/30">
                        <Eye className="w-3.5 h-3.5 text-white" />
                      </button>
                      <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-brand-md flex items-center justify-center hover:bg-white/30">
                        <Copy className="w-3.5 h-3.5 text-white" />
                      </button>
                      <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-brand-md flex items-center justify-center hover:bg-white/30">
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <p className="text-[12px] font-medium text-foreground truncate">{file.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-muted-foreground">{file.size}</span>
                      <span className="text-[11px] text-muted-foreground">{file.uploadedOn}</span>
                    </div>
                    {file.usedIn > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-1">Used in {file.usedIn} templates</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Name', 'Type', 'Size', 'Uploaded', 'Used in', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(file => {
                const Icon = mediaTypeIcons[file.type];
                const iconStyle = mediaTypeColors[file.type];
                return (
                  <tr key={file.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={cn('w-7 h-7 rounded-brand-md flex items-center justify-center flex-shrink-0', iconStyle)}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[13px] font-medium text-foreground">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-[12px] text-muted-foreground">{file.type}</span></td>
                    <td className="px-4 py-3"><span className="text-[12px] text-muted-foreground">{file.size}</span></td>
                    <td className="px-4 py-3"><span className="text-[12px] text-muted-foreground">{file.uploadedOn}</span></td>
                    <td className="px-4 py-3"><span className="text-[12px] text-muted-foreground">{file.usedIn > 0 ? `${file.usedIn} templates` : '—'}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="w-6 h-6 flex items-center justify-center rounded-brand-md hover:bg-muted"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button className="w-6 h-6 flex items-center justify-center rounded-brand-md hover:bg-muted"><Copy className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button className="w-6 h-6 flex items-center justify-center rounded-brand-md hover:bg-muted"><Trash2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ─── Phase 2 placeholder ────────────────────────────────────────────────────── */

function Phase2Placeholder({ channel }: { channel: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="w-12 h-12 bg-muted rounded-brand-xl flex items-center justify-center mb-4">
        <Clock className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-[15px] font-semibold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
        {channel} Templates — Coming Soon
      </p>
      <p className="text-body-sm text-muted-foreground mt-2 max-w-[320px]">
        {channel} template management is on the roadmap. Templates and scripts will appear here once ready.
      </p>
      <span className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground bg-muted px-2.5 py-1 rounded-brand-full">
        Coming Soon
      </span>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────────── */

const Content = () => {
  const [activeChannel, setActiveChannel] = useState<Channel>('SMS');
  const [view, setView] = useState<'list' | 'create'>('list');
  const [createChannel, setCreateChannel] = useState<Exclude<Channel, 'DLT' | 'Media'>>('SMS');

  const openCreate = () => {
    setCreateChannel(activeChannel as Exclude<Channel, 'DLT' | 'Media'>);
    setView('create');
  };

  // Full-screen create view — replaces layout entirely
  if (view === 'create') {
    return (
      <AppLayout>
        <div className="h-full">
          <CreateTemplate
            channel={createChannel}
            onBack={() => setView('list')}
          />
        </div>
      </AppLayout>
    );
  }

  const renderContent = () => {
    if (activeChannel === 'DLT')   return <DLTView />;
    if (activeChannel === 'Media') return <MediaGallery />;
    if (activeChannel === 'Voice') return <Phase2Placeholder channel={activeChannel} />;
    return <TemplatesView channel={activeChannel as Exclude<Channel, 'DLT' | 'Media'>} />;
  };

  return (
    <AppLayout>
      <div className="flex h-full">

        {/* ── Left sub-nav ────────────────────────────────────────── */}
        <aside className="w-[200px] flex-shrink-0 border-r border-border bg-muted/20 flex flex-col py-4">
          <p className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Channels</p>

          {channelNav.filter(c => c.id !== 'DLT' && c.id !== 'Media').map(ch => {
            const Icon = ch.icon;
            const isActive = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => !ch.phase2 && setActiveChannel(ch.id)}
                className={cn(
                  'flex items-center justify-between px-4 py-2.5 text-[13px] font-medium transition-colors mx-2 rounded-brand-md',
                  isActive
                    ? 'bg-background text-foreground shadow-el-1 border border-border'
                    : ch.phase2
                    ? 'text-muted-foreground/50 cursor-not-allowed'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', isActive ? 'text-primary' : 'text-current')} />
                  {ch.label}
                </div>
                {ch.phase2 && (
                  <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground/50 bg-muted px-1 py-0.5 rounded-brand-xs">Soon</span>
                )}
              </button>
            );
          })}

          <div className="my-3 mx-4 border-t border-border" />
          <p className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Compliance</p>

          {channelNav.filter(c => c.id === 'DLT').map(ch => {
            const Icon = ch.icon;
            const isActive = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={cn(
                  'flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition-colors mx-2 rounded-brand-md',
                  isActive
                    ? 'bg-background text-foreground shadow-el-1 border border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-primary' : 'text-current')} />
                {ch.label}
              </button>
            );
          })}

          <div className="mt-auto mx-4 border-t border-border pt-3">
            {channelNav.filter(c => c.id === 'Media').map(ch => {
              const Icon = ch.icon;
              const isActive = activeChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition-colors w-full rounded-brand-md',
                    isActive
                      ? 'bg-background text-foreground shadow-el-1 border border-border'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                  )}
                >
                  <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-primary' : 'text-current')} />
                  {ch.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Main content area ────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Section header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card flex-shrink-0">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                {activeChannel === 'Media' ? 'Media Library' : activeChannel === 'DLT' ? 'DLT Templates' : `${activeChannel} Templates`}
              </h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                {activeChannel === 'Media'     ? 'Shared media assets across all channels'
                : activeChannel === 'DLT'       ? 'TRAI DLT registered templates and Sender IDs'
                : activeChannel === 'WhatsApp'  ? 'Meta-approved WhatsApp Business templates'
                : activeChannel === 'SMS'       ? 'DLT-registered SMS templates'
                : activeChannel === 'RCS'       ? 'Rich Communication Services templates'
                : 'Channel templates'}
              </p>
            </div>
            {activeChannel !== 'Media' && activeChannel !== 'DLT' && activeChannel !== 'Voice' && activeChannel !== 'Email' && (
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-white text-[12px] font-semibold rounded-brand-md hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                New Template
              </button>
            )}
          </div>

          {/* Channel content */}
          <div className="flex-1 overflow-hidden">
            {renderContent()}
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default Content;

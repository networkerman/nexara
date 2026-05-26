import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Upload,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Tag,
  MessageSquare,
  Layers,
  Ban,
  Phone,
  Mail,
  Trash2,
  Edit2,
  Eye,
  ArrowRight,
  FileText,
  Zap,
  Database,
  ShieldOff,
  X,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { cn } from '@/lib/utils';

/* ─── Types ──────────────────────────────────────────────────────────────── */

type AudienceView = 'segments' | 'contacts' | 'import' | 'suppression';
type SegmentType = 'dynamic' | 'static' | 'system';
type ContactStatus = 'active' | 'opted_out' | 'dnd' | 'blacklisted';
type ImportStatus = 'completed' | 'running' | 'failed' | 'queued';
type SuppressionTab = 'dnd' | 'optout' | 'blacklist';

interface Segment {
  id: string;
  name: string;
  type: SegmentType;
  count: number;
  channels: ('SMS' | 'WhatsApp' | 'RCS')[];
  conditions: string[];
  lastUpdated: string;
  usedInCampaigns: number;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  channels: ('SMS' | 'WhatsApp' | 'RCS')[];
  tags: string[];
  status: ContactStatus;
  lastActivity: string;
  segments: number;
}

interface ImportJob {
  id: string;
  filename: string;
  status: ImportStatus;
  totalRows: number;
  imported: number;
  failed: number;
  skipped: number;
  startedAt: string;
  duration?: string;
}

interface SuppressionEntry {
  phone: string;
  channel: 'SMS' | 'WhatsApp' | 'RCS' | 'All';
  reason: string;
  source: 'TRAI DND' | 'User Opt-out' | 'Manual' | 'Import';
  addedAt: string;
}

/* ─── Mock data ──────────────────────────────────────────────────────────── */

const segments: Segment[] = [
  {
    id: 'SEG-001', name: 'High Value Customers', type: 'dynamic', count: 48230,
    channels: ['SMS', 'WhatsApp'], conditions: ['LTV > ₹50,000', 'Last active < 90 days', 'Opted in WA'],
    lastUpdated: '23 May 2026, 08:00', usedInCampaigns: 14,
  },
  {
    id: 'SEG-002', name: 'BFSI Opted-in Users', type: 'dynamic', count: 12450,
    channels: ['WhatsApp', 'RCS'], conditions: ['Tag = BFSI', 'WA opt-in = true', 'DND = false'],
    lastUpdated: '22 May 2026, 14:30', usedInCampaigns: 7,
  },
  {
    id: 'SEG-003', name: 'SBI Active Customers', type: 'dynamic', count: 8920,
    channels: ['SMS', 'WhatsApp'], conditions: ['Source = SBI', 'Last transaction < 30 days'],
    lastUpdated: '22 May 2026, 11:00', usedInCampaigns: 22,
  },
  {
    id: 'SEG-004', name: 'KPN Test Group', type: 'static', count: 250,
    channels: ['RCS'], conditions: ['Manually uploaded 18 May 2026'],
    lastUpdated: '18 May 2026, 16:00', usedInCampaigns: 3,
  },
  {
    id: 'SEG-005', name: 'Diwali Campaign Responders', type: 'static', count: 31870,
    channels: ['WhatsApp'], conditions: ['Clicked CTA in C-1041', 'Responded within 48h'],
    lastUpdated: '23 May 2026, 10:15', usedInCampaigns: 2,
  },
  {
    id: 'SEG-006', name: 'Unreachable Numbers', type: 'system', count: 4120,
    channels: ['SMS', 'WhatsApp', 'RCS'], conditions: ['3+ consecutive failed deliveries', 'Auto-managed'],
    lastUpdated: '23 May 2026, 06:00', usedInCampaigns: 0,
  },
];

const contacts: Contact[] = [
  { id: 'C-001', name: 'Rahul Sharma',    phone: '+91 98201 45678', email: 'rahul.sharma@gmail.com',    channels: ['SMS', 'WhatsApp'], tags: ['BFSI', 'High Value'], status: 'active',     lastActivity: '23 May 2026', segments: 3 },
  { id: 'C-002', name: 'Priya Mehta',     phone: '+91 97302 81234', email: undefined,                    channels: ['SMS'],             tags: ['SBI'],               status: 'active',     lastActivity: '22 May 2026', segments: 2 },
  { id: 'C-003', name: 'Arjun Nair',      phone: '+91 80103 62345', email: 'arjun.nair@outlook.com',    channels: ['WhatsApp', 'RCS'], tags: ['BFSI', 'KPN'],       status: 'active',     lastActivity: '21 May 2026', segments: 2 },
  { id: 'C-004', name: 'Sneha Kapoor',    phone: '+91 70004 93456', email: undefined,                    channels: ['SMS'],             tags: [],                    status: 'opted_out',  lastActivity: '15 May 2026', segments: 0 },
  { id: 'C-005', name: 'Vikram Singh',    phone: '+91 91205 14567', email: 'vikram.singh@ymail.com',    channels: ['SMS', 'WhatsApp'], tags: ['High Value'],        status: 'active',     lastActivity: '23 May 2026', segments: 1 },
  { id: 'C-006', name: 'Anita Desai',     phone: '+91 88106 25678', email: undefined,                    channels: ['SMS'],             tags: [],                    status: 'dnd',        lastActivity: '10 Apr 2026', segments: 0 },
  { id: 'C-007', name: 'Kiran Bose',      phone: '+91 99207 36789', email: 'kiran.bose@hotmail.com',    channels: ['WhatsApp'],        tags: ['BFSI', 'SBI'],       status: 'active',     lastActivity: '22 May 2026', segments: 2 },
  { id: 'C-008', name: 'Deepa Iyer',      phone: '+91 70308 47890', email: undefined,                    channels: ['SMS', 'RCS'],      tags: ['KPN'],               status: 'active',     lastActivity: '20 May 2026', segments: 1 },
  { id: 'C-009', name: 'Mohan Pillai',    phone: '+91 85409 58901', email: 'mohan.pillai@gmail.com',    channels: ['SMS'],             tags: [],                    status: 'blacklisted', lastActivity: '02 Mar 2026', segments: 0 },
  { id: 'C-010', name: 'Fatima Khan',     phone: '+91 93510 69012', email: 'fatima.khan@outlook.com',   channels: ['WhatsApp', 'SMS'], tags: ['High Value', 'BFSI'],status: 'active',     lastActivity: '23 May 2026', segments: 3 },
];

const importJobs: ImportJob[] = [
  { id: 'IMP-041', filename: 'sbi_customers_may23.csv',      status: 'completed', totalRows: 45000,  imported: 44231, failed: 512,  skipped: 257,  startedAt: '23 May, 09:15', duration: '4m 12s' },
  { id: 'IMP-040', filename: 'hero_fincorp_leads.xlsx',      status: 'completed', totalRows: 12800,  imported: 12650, failed: 89,   skipped: 61,   startedAt: '22 May, 14:30', duration: '1m 58s' },
  { id: 'IMP-039', filename: 'kpn_test_group.csv',           status: 'completed', totalRows: 250,    imported: 250,   failed: 0,    skipped: 0,    startedAt: '18 May, 16:00', duration: '8s' },
  { id: 'IMP-038', filename: 'dmi_finance_contacts.csv',     status: 'failed',    totalRows: 8400,   imported: 0,     failed: 8400, skipped: 0,    startedAt: '20 May, 09:00', duration: '23s' },
  { id: 'IMP-037', filename: 'oyo_campaign_responders.xlsx', status: 'completed', totalRows: 31870,  imported: 31870, failed: 0,    skipped: 0,    startedAt: '23 May, 10:10', duration: '3m 04s' },
];

const suppressionEntries: SuppressionEntry[] = [
  { phone: '+91 70004 93456', channel: 'SMS',      reason: 'User replied STOP', source: 'User Opt-out', addedAt: '15 May 2026' },
  { phone: '+91 88106 25678', channel: 'All',      reason: 'TRAI DND registry', source: 'TRAI DND',    addedAt: '01 Jan 2026' },
  { phone: '+91 85409 58901', channel: 'All',      reason: 'Fraud complaint',   source: 'Manual',      addedAt: '02 Mar 2026' },
  { phone: '+91 91205 14567', channel: 'WhatsApp', reason: 'User blocked',      source: 'User Opt-out', addedAt: '10 May 2026' },
  { phone: '+91 80103 62345', channel: 'RCS',      reason: 'Opted out via CTA', source: 'User Opt-out', addedAt: '19 May 2026' },
];

/* ─── Shared helpers ─────────────────────────────────────────────────────── */

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

function ChannelDot({ channel }: { channel: 'SMS' | 'WhatsApp' | 'RCS' }) {
  const map = { SMS: 'bg-indigo-500', WhatsApp: 'bg-green-500', RCS: 'bg-primary' };
  const label = { SMS: 'SMS', WhatsApp: 'WA', RCS: 'RCS' };
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
      <span className={cn('w-1.5 h-1.5 rounded-full', map[channel])} />
      {label[channel]}
    </span>
  );
}

function StatusBadge({ status }: { status: ContactStatus }) {
  const map: Record<ContactStatus, { label: string; cls: string }> = {
    active:      { label: 'Active',      cls: 'text-success bg-success/10'           },
    opted_out:   { label: 'Opted out',   cls: 'text-warning bg-warning/10'           },
    dnd:         { label: 'DND',         cls: 'text-destructive bg-destructive/10'   },
    blacklisted: { label: 'Blacklisted', cls: 'text-destructive bg-destructive/10'   },
  };
  const { label, cls } = map[status];
  return <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', cls)}>{label}</span>;
}

function SegmentTypeBadge({ type }: { type: SegmentType }) {
  const map: Record<SegmentType, { label: string; cls: string; icon: React.ElementType }> = {
    dynamic: { label: 'Dynamic', cls: 'text-blue-700 bg-blue-100',      icon: Zap      },
    static:  { label: 'Static',  cls: 'text-purple-700 bg-purple-100',  icon: Database },
    system:  { label: 'System',  cls: 'text-muted-foreground bg-muted', icon: Layers   },
  };
  const { label, cls, icon: Icon } = map[type];
  return (
    <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full', cls)}>
      <Icon className="w-3 h-3" />{label}
    </span>
  );
}

/* ─── Segments View ──────────────────────────────────────────────────────── */

function SegmentsView() {
  const [showBuilder, setShowBuilder] = useState(false);

  const totalContacts = segments.filter(s => s.type !== 'system').reduce((a, s) => a + s.count, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[15px] font-semibold text-foreground">Segments</p>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {segments.length} segments · {fmt(totalContacts)} reachable contacts
          </p>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-4 py-2 rounded-brand-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create segment
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Dynamic segments', value: segments.filter(s=>s.type==='dynamic').length, sub: 'Auto-refresh on data change', icon: Zap,      cls: 'text-blue-600' },
          { label: 'Static segments',  value: segments.filter(s=>s.type==='static').length,  sub: 'Fixed lists, manual update',  icon: Database, cls: 'text-purple-600' },
          { label: 'System segments',  value: segments.filter(s=>s.type==='system').length,  sub: 'Auto-managed by platform',    icon: Layers,   cls: 'text-muted-foreground' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1 flex items-center gap-3">
            <div className="w-9 h-9 rounded-brand-md bg-muted flex items-center justify-center flex-shrink-0">
              <s.icon className={cn('w-4 h-4', s.cls)} />
            </div>
            <div>
              <p className="text-[20px] font-bold font-heading text-foreground">{s.value}</p>
              <p className="text-[11px] font-semibold text-muted-foreground">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Segments list */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search segments..."
              className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-muted border border-border rounded-brand-md focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="flex-1" />
          <button className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground px-3 py-1.5 border border-border rounded-brand-md transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
        </div>

        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Segment</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Type</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Contacts</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Channels</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Conditions</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Campaigns</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Updated</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {segments.map((seg, i) => (
              <tr key={seg.id} className={cn('border-b border-border last:border-0 hover:bg-muted/30 transition-colors', i % 2 !== 0 && 'bg-muted/10')}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{seg.name}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">{seg.id}</p>
                </td>
                <td className="px-4 py-3"><SegmentTypeBadge type={seg.type} /></td>
                <td className="px-4 py-3 text-right font-bold tabular-nums text-foreground">{fmt(seg.count)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {seg.channels.map(ch => <ChannelDot key={ch} channel={ch} />)}
                  </div>
                </td>
                <td className="px-4 py-3 max-w-[220px]">
                  <div className="flex flex-wrap gap-1">
                    {seg.conditions.slice(0, 2).map(c => (
                      <span key={c} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">{c}</span>
                    ))}
                    {seg.conditions.length > 2 && (
                      <span className="text-[10px] text-muted-foreground">+{seg.conditions.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{seg.usedInCampaigns}</td>
                <td className="px-4 py-3 text-muted-foreground text-[12px]">{seg.lastUpdated.split(',')[0]}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    {seg.type === 'dynamic' && (
                      <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors text-muted-foreground" title="Refresh count">
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors text-muted-foreground" title="View contacts">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {seg.type !== 'system' && (
                      <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors text-muted-foreground" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors text-muted-foreground">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Segment builder panel */}
      {showBuilder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end">
          <div className="w-[480px] h-full bg-card border-l border-border flex flex-col shadow-el-2">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-[15px] font-semibold text-foreground">Create segment</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">Build a rule-based audience</p>
              </div>
              <button onClick={() => setShowBuilder(false)} className="w-8 h-8 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Name */}
              <div>
                <label className="text-[12px] font-semibold text-foreground block mb-1.5">Segment name</label>
                <input
                  type="text"
                  placeholder="e.g. BFSI High Value Q2"
                  className="w-full px-3 py-2 text-[13px] bg-muted border border-border rounded-brand-md focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-[12px] font-semibold text-foreground block mb-1.5">Segment type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'dynamic', label: 'Dynamic', desc: 'Auto-updates when contact data changes', icon: Zap },
                    { id: 'static',  label: 'Static',  desc: 'Fixed list, updated manually',          icon: Database },
                  ].map(t => (
                    <button
                      key={t.id}
                      className={cn(
                        'border rounded-brand-md p-3 text-left transition-colors',
                        t.id === 'dynamic' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
                      )}
                    >
                      <t.icon className={cn('w-4 h-4 mb-1.5', t.id === 'dynamic' ? 'text-primary' : 'text-muted-foreground')} />
                      <p className="text-[13px] font-semibold text-foreground">{t.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Channel */}
              <div>
                <label className="text-[12px] font-semibold text-foreground block mb-1.5">Target channels</label>
                <div className="flex gap-2">
                  {(['SMS', 'WhatsApp', 'RCS'] as const).map(ch => (
                    <label key={ch} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked={ch !== 'RCS'} className="w-3.5 h-3.5 accent-primary" />
                      <span className="text-[12px] text-foreground">{ch}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[12px] font-semibold text-foreground">Conditions</label>
                  <span className="text-[11px] text-muted-foreground">Match ALL conditions</span>
                </div>
                <div className="space-y-2">
                  {[
                    { attr: 'Tag', op: 'is', val: 'BFSI' },
                    { attr: 'WhatsApp opt-in', op: 'is', val: 'true' },
                  ].map((cond, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded-brand-md border border-border">
                      <select className="text-[12px] bg-card border border-border rounded px-2 py-1 focus:outline-none">
                        <option>{cond.attr}</option>
                        <option>Tag</option>
                        <option>Last active</option>
                        <option>LTV</option>
                        <option>DND</option>
                        <option>Source</option>
                      </select>
                      <select className="text-[12px] bg-card border border-border rounded px-2 py-1 focus:outline-none">
                        <option>{cond.op}</option>
                        <option>is not</option>
                        <option>contains</option>
                        <option>greater than</option>
                        <option>less than</option>
                      </select>
                      <input
                        defaultValue={cond.val}
                        className="flex-1 text-[12px] bg-card border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                      <button className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button className="flex items-center gap-1.5 text-[12px] text-primary hover:underline mt-1">
                    <Plus className="w-3.5 h-3.5" /> Add condition
                  </button>
                </div>
              </div>

              {/* Preview count */}
              <div className="bg-blue-50 border border-blue-200 rounded-brand-xl p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-blue-700 font-medium">Estimated contacts matching</span>
                  <button className="text-[11px] text-blue-600 hover:underline flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Preview
                  </button>
                </div>
                <p className="text-[24px] font-bold font-heading text-blue-800 mt-1">12,450</p>
                <p className="text-[11px] text-blue-600">of 101,822 total contacts</p>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
              <button className="flex-1 bg-primary text-white text-[13px] font-semibold py-2.5 rounded-brand-md hover:bg-primary/90 transition-colors">
                Create segment
              </button>
              <button onClick={() => setShowBuilder(false)} className="px-4 py-2.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── All Contacts View ──────────────────────────────────────────────────── */

function ContactsView({ onImport }: { onImport: () => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ContactStatus>('all');

  const filtered = contacts.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[15px] font-semibold text-foreground">All Contacts</p>
          <p className="text-[13px] text-muted-foreground mt-0.5">101,822 total · 97,702 reachable</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-[13px] text-muted-foreground border border-border px-3 py-2 rounded-brand-md hover:bg-muted transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button
            onClick={onImport}
            className="flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-4 py-2 rounded-brand-md hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-4 h-4" /> Import
          </button>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Active',      count: contacts.filter(c=>c.status==='active').length,      pct: 70, cls: 'text-success' },
          { label: 'Opted out',   count: contacts.filter(c=>c.status==='opted_out').length,   pct: 5,  cls: 'text-warning' },
          { label: 'DND',         count: contacts.filter(c=>c.status==='dnd').length,         pct: 4,  cls: 'text-destructive' },
          { label: 'Blacklisted', count: contacts.filter(c=>c.status==='blacklisted').length, pct: 1,  cls: 'text-destructive' },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(statusFilter === s.label.toLowerCase().replace(' ', '_') as ContactStatus ? 'all' : s.label.toLowerCase().replace(' ', '_') as ContactStatus)}
            className={cn(
              'bg-card border border-border rounded-brand-xl p-3 shadow-el-1 text-left hover:shadow-el-2 transition-shadow',
              statusFilter === s.label.toLowerCase().replace(' ', '_') && 'ring-1 ring-primary',
            )}
          >
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{s.label}</p>
            <p className={cn('text-[22px] font-bold font-heading mt-0.5', s.cls)}>{s.count}</p>
          </button>
        ))}
      </div>

      {/* Contacts table */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-muted border border-border rounded-brand-md focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="flex-1" />
          <span className="text-[12px] text-muted-foreground">{filtered.length} contacts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Contact</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Channels</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Tags</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Segments</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Last active</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className={cn('border-b border-border last:border-0 hover:bg-muted/30 transition-colors', i % 2 !== 0 && 'bg-muted/10')}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] font-bold text-primary">{c.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{c.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {c.channels.map(ch => <ChannelDot key={ch} channel={ch} />)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.length === 0
                        ? <span className="text-muted-foreground">—</span>
                        : c.tags.map(t => (
                            <span key={t} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">{t}</span>
                          ))
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{c.segments}</td>
                  <td className="px-4 py-3 text-muted-foreground text-[12px]">{c.lastActivity}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors text-muted-foreground">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors text-muted-foreground">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
          <span className="text-[12px] text-muted-foreground">Showing {filtered.length} of 101,822 contacts</span>
          <button className="text-[12px] text-primary hover:underline">Load more</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Import View ─────────────────────────────────────────────────────────── */

function ImportView() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[15px] font-semibold text-foreground">Import Contacts</p>
          <p className="text-[13px] text-muted-foreground mt-0.5">Upload CSV or XLSX · max 500,000 rows per file</p>
        </div>
        <a href="#" className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-brand-md transition-colors">
          <Download className="w-3.5 h-3.5" /> Download template
        </a>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 bg-card border border-border rounded-brand-xl overflow-hidden shadow-el-1">
        {[
          { n: 1, label: 'Upload file'   },
          { n: 2, label: 'Map columns'   },
          { n: 3, label: 'Review & import' },
        ].map((s, i) => (
          <React.Fragment key={s.n}>
            <div className={cn(
              'flex-1 flex items-center gap-2 px-4 py-3',
              step === s.n ? 'bg-primary/5 border-b-2 border-primary' : step > s.n ? 'bg-success/5' : '',
            )}>
              <div className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0',
                step > s.n ? 'bg-success text-white' : step === s.n ? 'bg-primary text-white' : 'bg-muted text-muted-foreground',
              )}>
                {step > s.n ? '✓' : s.n}
              </div>
              <span className={cn('text-[12px] font-medium', step === s.n ? 'text-primary' : step > s.n ? 'text-success' : 'text-muted-foreground')}>
                {s.label}
              </span>
            </div>
            {i < 2 && <div className="w-px h-full bg-border self-stretch" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="space-y-4">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); setFile('contacts.csv'); }}
            className={cn(
              'border-2 border-dashed rounded-brand-xl p-12 text-center transition-colors',
              dragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50',
              file && 'border-success bg-success/5',
            )}
          >
            {file ? (
              <div>
                <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" />
                <p className="text-[14px] font-semibold text-foreground">{file}</p>
                <p className="text-[12px] text-muted-foreground mt-1">Ready to map columns</p>
                <button onClick={() => setFile(null)} className="text-[12px] text-muted-foreground hover:text-destructive mt-2 flex items-center gap-1 mx-auto">
                  <X className="w-3 h-3" /> Remove
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-[14px] font-semibold text-foreground">Drop your file here</p>
                <p className="text-[12px] text-muted-foreground mt-1">or <span className="text-primary cursor-pointer hover:underline" onClick={() => setFile('contacts.csv')}>browse to upload</span></p>
                <p className="text-[11px] text-muted-foreground mt-3">Supported: CSV, XLSX · Max 500K rows · Max 50MB</p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-brand-xl p-3">
            <p className="text-[12px] font-semibold text-blue-900 mb-1.5">Required columns</p>
            <div className="flex items-center gap-4 text-[11px] text-blue-700">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> phone (mandatory)</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> name (optional)</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> email (optional)</span>
              <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> tags (optional, comma-separated)</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => file && setStep(2)}
              disabled={!file}
              className="flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-5 py-2.5 rounded-brand-md hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next: Map columns <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Map columns */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/40">
              <p className="text-[13px] font-semibold text-foreground">Column mapping</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Map your file's columns to OneXtel contact fields</p>
            </div>
            <div className="divide-y divide-border">
              {[
                { source: 'mobile_number', target: 'phone',  status: 'mapped'   },
                { source: 'full_name',     target: 'name',   status: 'mapped'   },
                { source: 'email_id',      target: 'email',  status: 'mapped'   },
                { source: 'customer_type', target: '—',      status: 'unmapped' },
                { source: 'city',          target: '—',      status: 'skip'     },
              ].map(col => (
                <div key={col.source} className="px-4 py-3 flex items-center gap-4">
                  <div className="w-[180px] flex-shrink-0">
                    <span className="text-[12px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">{col.source}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <select className="w-full text-[13px] bg-muted border border-border rounded-brand-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50">
                      <option value="">{col.target}</option>
                      <option>phone</option>
                      <option>name</option>
                      <option>email</option>
                      <option>tag</option>
                      <option>— Skip column —</option>
                    </select>
                  </div>
                  <div className="w-24 flex-shrink-0">
                    {col.status === 'mapped'   && <span className="text-[11px] text-success font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Mapped</span>}
                    {col.status === 'unmapped' && <span className="text-[11px] text-warning font-semibold flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Unmapped</span>}
                    {col.status === 'skip'     && <span className="text-[11px] text-muted-foreground font-semibold">Skip</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1">
            <p className="text-[13px] font-semibold text-foreground mb-3">Deduplication</p>
            <div className="space-y-2">
              {[
                { id: 'phone', label: 'Deduplicate by phone number (recommended)', checked: true },
                { id: 'update', label: 'Update existing contacts with new data', checked: true },
                { id: 'skip', label: 'Skip duplicates (do not update)', checked: false },
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked={opt.checked} className="w-3.5 h-3.5 accent-primary" />
                  <span className="text-[13px] text-foreground">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setStep(1)} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">← Back</button>
            <button onClick={() => setStep(3)} className="flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-5 py-2.5 rounded-brand-md hover:bg-primary/90 transition-colors">
              Next: Review <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Rows to import', value: '45,000', cls: 'text-foreground' },
              { label: 'Estimated new contacts', value: '~38,200', cls: 'text-success' },
              { label: 'Estimated updates', value: '~6,800', cls: 'text-blue-600' },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1 text-center">
                <p className={cn('text-[24px] font-bold font-heading', s.cls)}>{s.value}</p>
                <p className="text-[12px] text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-brand-xl p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-amber-800">
              <strong>Opt-in confirmation:</strong> By importing these contacts you confirm they have consented to receive messages via the selected channels. Imported numbers will be scrubbed against the TRAI DND registry automatically.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setStep(2)} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">← Back</button>
            <button className="flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-5 py-2.5 rounded-brand-md hover:bg-primary/90 transition-colors">
              <Upload className="w-4 h-4" /> Start import
            </button>
          </div>
        </div>
      )}

      {/* Import history */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-[13px] font-semibold text-foreground">Import history</p>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">File</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Total</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Imported</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Failed</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Skipped</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Started</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {importJobs.map((job, i) => (
              <tr key={job.id} className={cn('border-b border-border last:border-0 hover:bg-muted/30 transition-colors', i % 2 !== 0 && 'bg-muted/10')}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{job.filename}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{job.id} {job.duration && `· ${job.duration}`}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{job.totalRows.toLocaleString()}</td>
                <td className="px-4 py-3 text-right tabular-nums text-success font-medium">{job.imported.toLocaleString()}</td>
                <td className="px-4 py-3 text-right tabular-nums text-destructive font-medium">{job.failed.toLocaleString()}</td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{job.skipped.toLocaleString()}</td>
                <td className="px-4 py-3 text-muted-foreground text-[12px]">{job.startedAt}</td>
                <td className="px-4 py-3">
                  {job.status === 'completed' && <span className="text-[11px] font-semibold text-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Completed</span>}
                  {job.status === 'running'   && <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1"><Clock className="w-3 h-3 animate-spin" />Running</span>}
                  {job.status === 'failed'    && <span className="text-[11px] font-semibold text-destructive flex items-center gap-1"><XCircle className="w-3 h-3" />Failed</span>}
                  {job.status === 'queued'    && <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />Queued</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Suppression View ───────────────────────────────────────────────────── */

function SuppressionView() {
  const [tab, setTab] = useState<SuppressionTab>('dnd');

  const dndEntries   = suppressionEntries.filter(e => e.source === 'TRAI DND');
  const optoutEntries = suppressionEntries.filter(e => e.source === 'User Opt-out');
  const blacklist    = suppressionEntries.filter(e => e.source === 'Manual');

  const currentEntries = tab === 'dnd' ? dndEntries : tab === 'optout' ? optoutEntries : blacklist;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[15px] font-semibold text-foreground">Suppression Lists</p>
          <p className="text-[13px] text-muted-foreground mt-0.5">Manage opt-outs, DND numbers, and blacklists</p>
        </div>
        <button className="flex items-center gap-2 text-[13px] text-muted-foreground border border-border px-3 py-2 rounded-brand-md hover:bg-muted transition-colors">
          <Upload className="w-3.5 h-3.5" /> Upload suppression list
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'TRAI DND',    count: '4,120',  sub: 'Auto-scrubbed from TRAI registry',  icon: ShieldOff, cls: 'text-blue-600',       bg: 'bg-blue-50 border-blue-200'  },
          { label: 'Opted out',   count: '3,890',  sub: 'Channel-specific user opt-outs',    icon: Ban,       cls: 'text-warning',         bg: 'bg-amber-50 border-amber-200'},
          { label: 'Blacklisted', count: '230',    sub: 'Manually blocked numbers',          icon: XCircle,   cls: 'text-destructive',     bg: 'bg-red-50 border-red-200'   },
        ].map(s => (
          <div key={s.label} className={cn('border rounded-brand-xl p-4 flex items-center gap-3', s.bg)}>
            <div className="w-9 h-9 rounded-brand-md bg-white/60 flex items-center justify-center flex-shrink-0">
              <s.icon className={cn('w-4 h-4', s.cls)} />
            </div>
            <div>
              <p className={cn('text-[22px] font-bold font-heading', s.cls)}>{s.count}</p>
              <p className="text-[11px] font-semibold text-foreground">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* DND sync info */}
      <div className="bg-muted/60 border border-border rounded-brand-xl p-3 flex items-center gap-3">
        <RefreshCw className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <p className="text-[12px] text-muted-foreground">
          TRAI DND registry is auto-synced daily at 02:00 IST. Last sync: <strong>23 May 2026, 02:00</strong> — 4,120 numbers scrubbed from all outgoing campaigns.
        </p>
        <button className="ml-auto text-[12px] text-primary hover:underline whitespace-nowrap">Force sync</button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-muted p-1 rounded-brand-md w-fit">
        {([
          { id: 'dnd',     label: `DND (${dndEntries.length})`       },
          { id: 'optout',  label: `Opt-out (${optoutEntries.length})` },
          { id: 'blacklist', label: `Blacklist (${blacklist.length})` },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'text-[13px] font-medium px-4 py-1.5 rounded-brand-sm transition-colors',
              tab === t.id ? 'bg-card text-foreground shadow-el-1' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Entries table */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search phone number..."
              className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-muted border border-border rounded-brand-md focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="flex-1" />
          {tab === 'blacklist' && (
            <button className="flex items-center gap-1.5 text-[13px] bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1.5 rounded-brand-md hover:bg-destructive/20 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add number
            </button>
          )}
          <button className="flex items-center gap-1.5 text-[13px] text-muted-foreground border border-border px-3 py-1.5 rounded-brand-md hover:bg-muted transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>

        {currentEntries.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-[13px] font-semibold text-foreground">No entries in this list</p>
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Phone</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Channel</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Reason</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Source</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Added</th>
                {tab === 'blacklist' && <th className="px-4 py-2.5" />}
              </tr>
            </thead>
            <tbody>
              {currentEntries.map((entry, i) => (
                <tr key={entry.phone} className={cn('border-b border-border last:border-0 hover:bg-muted/30 transition-colors', i % 2 !== 0 && 'bg-muted/10')}>
                  <td className="px-4 py-3 font-mono font-medium text-foreground">{entry.phone}</td>
                  <td className="px-4 py-3">
                    {entry.channel === 'All'
                      ? <span className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">All channels</span>
                      : <ChannelDot channel={entry.channel} />
                    }
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{entry.reason}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-[11px] font-semibold px-2 py-0.5 rounded-full',
                      entry.source === 'TRAI DND'    ? 'bg-blue-100 text-blue-700' :
                      entry.source === 'User Opt-out' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700',
                    )}>
                      {entry.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-[12px]">{entry.addedAt}</td>
                  {tab === 'blacklist' && (
                    <td className="px-4 py-3">
                      <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ─── Audiences Page ─────────────────────────────────────────────────────── */

const navItems: { id: AudienceView; label: string; icon: React.ElementType; sub: string }[] = [
  { id: 'segments',    label: 'Segments',          icon: Layers,   sub: `${segments.length} segments` },
  { id: 'contacts',   label: 'All Contacts',       icon: Users,    sub: '101,822 contacts'             },
  { id: 'import',     label: 'Import',             icon: Upload,   sub: '5 recent imports'             },
  { id: 'suppression',label: 'Suppression Lists',  icon: Ban,      sub: '8,240 suppressed'             },
];

const Audiences = () => {
  const [activeView, setActiveView] = useState<AudienceView>('segments');

  const viewMeta: Record<AudienceView, { title: string; sub: string }> = {
    segments:    { title: 'Segments',         sub: 'Rule-based audience groups for targeting'             },
    contacts:    { title: 'All Contacts',     sub: 'Full contact database with channel preferences'       },
    import:      { title: 'Import Contacts',  sub: 'Upload CSV / XLSX · auto DND scrub · dedup'          },
    suppression: { title: 'Suppression Lists',sub: 'DND, opt-outs, and blacklisted numbers'               },
  };

  return (
    <AppLayout>
      <div className="flex flex-1 min-h-0">

        {/* Left sub-nav */}
        <aside className="w-[240px] flex-shrink-0 bg-card border-r border-border flex flex-col overflow-y-auto">
          <div className="px-4 pt-5 pb-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Audience</p>
          </div>
          <nav className="flex-1 px-2 space-y-0.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-brand-md text-left transition-colors',
                  activeView === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <item.icon className={cn('w-4 h-4 flex-shrink-0', activeView === item.id ? 'text-primary' : 'text-muted-foreground')} />
                <div className="min-w-0">
                  <p className={cn('text-[13px] font-medium leading-tight', activeView === item.id ? 'text-primary' : 'text-foreground')}>
                    {item.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">{item.sub}</p>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {/* Section header */}
          <div className="px-6 py-4 border-b border-border bg-card flex-shrink-0">
            <p className="text-[16px] font-bold text-foreground font-heading">{viewMeta[activeView].title}</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">{viewMeta[activeView].sub}</p>
          </div>

          <div className="p-6 max-w-[1300px]">
            {activeView === 'segments'    && <SegmentsView />}
            {activeView === 'contacts'    && <ContactsView onImport={() => setActiveView('import')} />}
            {activeView === 'import'      && <ImportView />}
            {activeView === 'suppression' && <SuppressionView />}
          </div>
        </main>

      </div>
    </AppLayout>
  );
};

export default Audiences;

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Minus,
  MessageSquare, Phone, Layers,
  Users, Target, MousePointerClick,
  Download, Filter, ChevronDown,
  ArrowUpRight, ArrowDownRight,
  CheckCircle2, Zap, Route,
  BarChart2, Activity,
  Mail,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type DateRange = '7d' | '30d' | '90d';
type Tab = 'overview' | 'campaigns' | 'channels' | 'journeys' | 'audiences';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const volumeTrend = [
  { day: '14 May', SMS: 420000, WA: 185000, RCS: 62000 },
  { day: '15 May', SMS: 398000, WA: 201000, RCS: 58000 },
  { day: '16 May', SMS: 445000, WA: 193000, RCS: 71000 },
  { day: '17 May', SMS: 467000, WA: 214000, RCS: 68000 },
  { day: '18 May', SMS: 412000, WA: 198000, RCS: 74000 },
  { day: '19 May', SMS: 389000, WA: 178000, RCS: 52000 },
  { day: '20 May', SMS: 501000, WA: 231000, RCS: 89000 },
  { day: '21 May', SMS: 523000, WA: 249000, RCS: 93000 },
  { day: '22 May', SMS: 478000, WA: 222000, RCS: 81000 },
  { day: '23 May', SMS: 544000, WA: 261000, RCS: 97000 },
];

const channelMix = [
  { name: 'SMS',       value: 58, color: '#6366f1' },
  { name: 'WhatsApp',  value: 29, color: '#22c55e' },
  { name: 'RCS',       value: 10, color: '#ef4444' },
  { name: 'Email',     value: 3,  color: '#0ea5e9' },
];

const engagementFunnel = [
  { stage: 'Sent',      value: 4823000, pct: 100,  color: '#6366f1' },
  { stage: 'Delivered', value: 4581850, pct: 95.0, color: '#22c55e' },
  { stage: 'Opened',    value: 1603648, pct: 33.3, color: '#f59e0b' },
  { stage: 'Clicked',   value: 481498,  pct: 9.98, color: '#ec4899' },
];

const topCampaigns = [
  { id: 'C-1041', name: 'Loan EMI Reminder — May Wave 3', channel: 'WA',  sent: 412000, delivRate: 97.1, openRate: 68.4, ctr: 22.3, status: 'completed' },
  { id: 'C-1038', name: 'SBI Credit Card Offer',          channel: 'SMS', sent: 820000, delivRate: 94.8, openRate: 31.2, ctr:  8.1, status: 'completed' },
  { id: 'C-1044', name: 'RCS Welcome Onboarding — KPN',   channel: 'RCS', sent:  18400, delivRate: 91.2, openRate: 74.6, ctr: 38.7, status: 'active'    },
  { id: 'C-1036', name: 'Diwali Flash Sale',               channel: 'WA',  sent: 290000, delivRate: 96.3, openRate: 54.1, ctr: 19.8, status: 'completed' },
  { id: 'C-1029', name: 'OTP Delivery Batch — CRIS',       channel: 'SMS', sent: 145230, delivRate: 99.1, openRate:   0,  ctr:  0,   status: 'completed' },
];

const channelComparison = [
  { metric: 'Delivery Rate', SMS: 94.2, WA: 96.8, RCS: 91.4 },
  { metric: 'Open Rate',     SMS: 28.4, WA: 61.3, RCS: 72.1 },
  { metric: 'CTR',           SMS:  7.2, WA: 18.9, RCS: 31.4 },
  { metric: 'Opt-out Rate',  SMS:  1.4, WA:  0.8, RCS:  0.3 },
];

const channelStats = [
  {
    channel: 'SMS', icon: Phone, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200',
    volume: '2.8M', delivRate: '94.2%', openRate: '28.4%', ctr: '7.2%',
    delivDelta: +0.3, openDelta: -1.1, ctrDelta: +0.4,
    cost: '₹0.12/msg',
  },
  {
    channel: 'WhatsApp', icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200',
    volume: '1.4M', delivRate: '96.8%', openRate: '61.3%', ctr: '18.9%',
    delivDelta: +1.2, openDelta: +3.4, ctrDelta: +2.1,
    cost: '₹0.48/msg',
  },
  {
    channel: 'RCS', icon: Layers, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200',
    volume: '481K', delivRate: '91.4%', openRate: '72.1%', ctr: '31.4%',
    delivDelta: -0.8, openDelta: +5.7, ctrDelta: +4.2,
    cost: '₹0.34/msg',
  },
  {
    channel: 'Email', icon: Mail, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200',
    volume: '142K', delivRate: '88.1%', openRate: '22.7%', ctr: '4.3%',
    delivDelta: -2.1, openDelta: -0.5, ctrDelta: -0.3,
    cost: '₹0.04/msg',
  },
];

const channelTrend = [
  { day: '20 May', SMS: 94.1, WA: 96.2, RCS: 91.8 },
  { day: '21 May', SMS: 94.4, WA: 96.5, RCS: 90.9 },
  { day: '22 May', SMS: 93.8, WA: 97.1, RCS: 92.1 },
  { day: '23 May', SMS: 94.2, WA: 96.8, RCS: 91.4 },
];

const journeyFunnel = [
  { step: 'Entered',          n: 8412,  pct: 100,   channel: '' },
  { step: 'Send WA',          n: 8412,  pct: 100,   channel: 'WA' },
  { step: 'WA Opened',        n: 6162,  pct: 73.2,  channel: 'WA' },
  { step: 'Tag: EMI_ENGAGED', n: 6162,  pct: 73.2,  channel: '' },
  { step: 'Timeout → SMS',    n: 2250,  pct: 26.7,  channel: 'SMS' },
  { step: 'SMS Delivered',    n: 2137,  pct: 25.4,  channel: 'SMS' },
  { step: 'Timeout → RCS',    n: 113,   pct:  1.3,  channel: 'RCS' },
  { step: 'Completed',        n: 8362,  pct: 99.4,  channel: '' },
];

const topJourneys = [
  { id: 'J-001', name: 'Loan EMI Reminder Cascade',  active: 8412,  completions: 24310, conv: '73.2%', channels: ['WA','SMS','RCS'] },
  { id: 'J-002', name: 'Welcome & Onboarding Flow',  active: 1203,  completions:  9870, conv: '81.5%', channels: ['WA','SMS'] },
  { id: 'J-003', name: 'OTP Delivery Fallback',      active:  312,  completions: 145230,conv: '99.1%', channels: ['WA','SMS'] },
];

const segmentPerformance = [
  { segment: 'High-Value BFSI', size: 42800, delivRate: 97.4, openRate: 64.1, ctr: 24.3, optOut: 0.4 },
  { segment: 'Loan Overdue 30d', size: 18200, delivRate: 94.8, openRate: 71.3, ctr: 31.2, optOut: 0.9 },
  { segment: 'New Signups',      size: 31400, delivRate: 96.1, openRate: 58.7, ctr: 19.4, optOut: 1.2 },
  { segment: 'Dormant 60d',      size: 89200, delivRate: 91.2, openRate: 28.4, ctr:  6.1, optOut: 2.8 },
  { segment: 'OYO Travellers',   size: 14100, delivRate: 95.3, openRate: 52.1, ctr: 17.8, optOut: 0.6 },
];

const optOutTrend = [
  { day: '17 May', rate: 1.42 },
  { day: '18 May', rate: 1.38 },
  { day: '19 May', rate: 1.51 },
  { day: '20 May', rate: 1.44 },
  { day: '21 May', rate: 1.29 },
  { day: '22 May', rate: 1.33 },
  { day: '23 May', rate: 1.27 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const channelDot: Record<string, string> = {
  WA: 'bg-green-500', SMS: 'bg-indigo-500', RCS: 'bg-red-500', Email: 'bg-sky-500',
};

function Delta({ v, unit = '%' }: { v: number; unit?: string }) {
  if (v === 0) return <span className="text-muted-foreground text-[11px] flex items-center gap-0.5"><Minus className="w-3 h-3" /> —</span>;
  const up = v > 0;
  return (
    <span className={cn('text-[11px] flex items-center gap-0.5 font-semibold', up ? 'text-emerald-600' : 'text-red-500')}>
      {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {Math.abs(v)}{unit}
    </span>
  );
}

function KpiCard({ label, value, delta, sub, icon: Icon, iconCls }: {
  label: string; value: string; delta?: number; sub?: string;
  icon: React.ElementType; iconCls: string;
}) {
  return (
    <div className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1 hover:shadow-el-2 transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] text-muted-foreground font-medium">{label}</span>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', iconCls)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-[26px] font-bold text-foreground font-heading leading-none">{value}</p>
      <div className="flex items-center gap-2 mt-1.5">
        {delta !== undefined && <Delta v={delta} />}
        {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-el-2 p-3 text-[12px] min-w-[140px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold text-foreground">{(p.value / 1000).toFixed(0)}K</span>
        </div>
      ))}
    </div>
  );
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-5 gap-4">
        <KpiCard label="Messages Sent"  value="4.82M"  delta={+8.4}  sub="vs last period" icon={MessageSquare}    iconCls="bg-indigo-50 text-indigo-600" />
        <KpiCard label="Delivery Rate"  value="95.0%"  delta={+0.6}                        icon={CheckCircle2}    iconCls="bg-emerald-50 text-emerald-600" />
        <KpiCard label="Open Rate"      value="33.3%"  delta={+2.1}                        icon={Activity}        iconCls="bg-amber-50 text-amber-600" />
        <KpiCard label="Click Rate"     value="9.98%"  delta={+1.3}                        icon={MousePointerClick} iconCls="bg-pink-50 text-pink-600" />
        <KpiCard label="Opt-out Rate"   value="1.27%"  delta={-0.15} sub="↓ improving"    icon={TrendingDown}    iconCls="bg-red-50 text-red-500" />
      </div>

      {/* Volume chart + channel mix */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[14px] font-semibold text-foreground">Message Volume by Channel</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">Last 10 days · stacked area</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={volumeTrend} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gSMS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gWA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gRCS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="SMS" stroke="#6366f1" fill="url(#gSMS)" strokeWidth={2} />
              <Area type="monotone" dataKey="WA"  stroke="#22c55e" fill="url(#gWA)"  strokeWidth={2} />
              <Area type="monotone" dataKey="RCS" stroke="#ef4444" fill="url(#gRCS)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 justify-center">
            {[['SMS','#6366f1'],['WhatsApp','#22c55e'],['RCS','#ef4444']].map(([n,c]) => (
              <span key={n} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />{n}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
          <p className="text-[14px] font-semibold text-foreground mb-1">Channel Mix</p>
          <p className="text-[12px] text-muted-foreground mb-4">Share of total volume</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={channelMix} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                {channelMix.map(e => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {channelMix.map(e => (
              <div key={e.name} className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />{e.name}
                </span>
                <span className="font-semibold text-foreground">{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement funnel */}
      <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
        <p className="text-[14px] font-semibold text-foreground mb-4">Engagement Funnel — All Channels</p>
        <div className="flex items-end gap-3">
          {engagementFunnel.map((s, i) => (
            <div key={s.stage} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center">
                <p className="text-[11px] text-muted-foreground mb-1">{s.stage}</p>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{ height: `${Math.max(s.pct * 1.6, 12)}px`, background: s.color, opacity: 0.85 - i * 0.08 }}
                />
              </div>
              <div className="text-center">
                <p className="text-[14px] font-bold text-foreground">{s.value >= 1000000 ? `${(s.value/1000000).toFixed(2)}M` : `${(s.value/1000).toFixed(0)}K`}</p>
                <p className="text-[11px] text-muted-foreground">{s.pct}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top campaigns */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-[14px] font-semibold text-foreground">Top Campaigns</p>
          <Button variant="outline" size="sm" className="text-[12px] gap-1.5">
            <Download className="w-3.5 h-3.5" />Export
          </Button>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {['Campaign','Channel','Sent','Delivered','Opened','CTR','Status'].map(h => (
                <th key={h} className={cn('py-2.5 px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide', h === 'Sent' || h === 'Delivered' || h === 'Opened' || h === 'CTR' ? 'text-right' : 'text-left')}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topCampaigns.map((c, i) => (
              <tr key={c.id} className={cn('border-b border-border last:border-0 hover:bg-muted/20 transition-colors', i % 2 === 0 ? 'bg-white' : 'bg-muted/5')}>
                <td className="py-3 px-4">
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.id}</p>
                </td>
                <td className="py-3 px-4">
                  <span className={cn('w-5 h-5 rounded-full inline-flex items-center justify-center text-[8px] font-bold text-white', channelDot[c.channel])}>{c.channel[0]}</span>
                </td>
                <td className="py-3 px-4 text-right text-muted-foreground">{(c.sent/1000).toFixed(0)}K</td>
                <td className="py-3 px-4 text-right">
                  <span className={cn('font-semibold', c.delivRate >= 96 ? 'text-emerald-600' : c.delivRate >= 93 ? 'text-amber-600' : 'text-red-500')}>{c.delivRate}%</span>
                </td>
                <td className="py-3 px-4 text-right text-muted-foreground">{c.openRate > 0 ? `${c.openRate}%` : '—'}</td>
                <td className="py-3 px-4 text-right text-muted-foreground">{c.ctr > 0 ? `${c.ctr}%` : '—'}</td>
                <td className="py-3 px-4">
                  <Badge className={cn('text-[10px] border', c.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200')}>
                    {c.status === 'active' ? 'Active' : 'Completed'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CampaignAnalyticsTab() {
  const [sortBy, setSortBy] = useState<'sent' | 'delivRate' | 'openRate' | 'ctr'>('sent');

  const sorted = [...topCampaigns].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center gap-3">
        {[['Channel','All channels'],['Status','All statuses'],['Date','Last 30 days']].map(([label, val]) => (
          <button key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-brand-md border border-border bg-white text-[12px] text-foreground hover:bg-muted/40 transition-colors">
            <Filter className="w-3 h-3 text-muted-foreground" />
            {val}
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[12px] text-muted-foreground">Sort by:</span>
          {(['sent','delivRate','openRate','ctr'] as const).map(k => (
            <button
              key={k}
              onClick={() => setSortBy(k)}
              className={cn('px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors',
                sortBy === k ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {k === 'delivRate' ? 'Delivery' : k === 'openRate' ? 'Open' : k === 'ctr' ? 'CTR' : 'Volume'}
            </button>
          ))}
        </div>
      </div>

      {/* Perf chart */}
      <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
        <p className="text-[14px] font-semibold text-foreground mb-4">Campaign Performance — Delivery vs Open Rate</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={topCampaigns.map(c => ({ name: c.name.split('—')[0].trim().slice(0, 18), delivRate: c.delivRate, openRate: c.openRate }))} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} width={38} />
            <Tooltip formatter={(v: number) => [`${v}%`]} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="delivRate" name="Delivery Rate" fill="#22c55e" radius={[4,4,0,0]} />
            <Bar dataKey="openRate"  name="Open Rate"     fill="#f59e0b" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Full table */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <p className="text-[14px] font-semibold text-foreground">All Campaigns</p>
          <Button variant="outline" size="sm" className="text-[12px] gap-1.5">
            <Download className="w-3.5 h-3.5" />Export CSV
          </Button>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {['Campaign','Ch','Sent','Delivery','Open','CTR','Opt-out','Status'].map(h => (
                <th key={h} className={cn('py-2.5 px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide', ['Sent','Delivery','Open','CTR','Opt-out'].includes(h) ? 'text-right' : 'text-left')}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((c, i) => (
              <tr key={c.id} className={cn('border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer', i % 2 === 0 ? 'bg-white' : 'bg-muted/5')}>
                <td className="py-3 px-4">
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.id}</p>
                </td>
                <td className="py-3 px-4">
                  <span className={cn('w-5 h-5 rounded-full inline-flex items-center justify-center text-[8px] font-bold text-white', channelDot[c.channel])}>{c.channel[0]}</span>
                </td>
                <td className="py-3 px-4 text-right text-muted-foreground">{(c.sent/1000).toFixed(0)}K</td>
                <td className="py-3 px-4 text-right font-semibold">{c.delivRate}%</td>
                <td className="py-3 px-4 text-right text-muted-foreground">{c.openRate > 0 ? `${c.openRate}%` : '—'}</td>
                <td className="py-3 px-4 text-right text-muted-foreground">{c.ctr > 0 ? `${c.ctr}%` : '—'}</td>
                <td className="py-3 px-4 text-right text-muted-foreground">—</td>
                <td className="py-3 px-4">
                  <Badge className={cn('text-[10px] border', c.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200')}>
                    {c.status === 'active' ? 'Active' : 'Done'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChannelComparisonTab() {
  return (
    <div className="space-y-5">
      {/* Channel stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {channelStats.map(ch => {
          const Icon = ch.icon;
          return (
            <div key={ch.channel} className={cn('bg-white border rounded-brand-xl p-4 shadow-el-1 hover:shadow-el-2 transition-shadow', ch.border)}>
              <div className="flex items-center gap-2 mb-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', ch.bg)}>
                  <Icon className={cn('w-4 h-4', ch.color)} />
                </div>
                <p className="font-semibold text-foreground text-[14px]">{ch.channel}</p>
              </div>
              <p className="text-[22px] font-bold text-foreground font-heading">{ch.volume}</p>
              <p className="text-[11px] text-muted-foreground mb-3">messages sent</p>
              <div className="space-y-1.5 border-t border-border pt-3">
                {[
                  { label: 'Delivery', val: ch.delivRate, delta: ch.delivDelta },
                  { label: 'Open',     val: ch.openRate,  delta: ch.openDelta  },
                  { label: 'CTR',      val: ch.ctr,       delta: ch.ctrDelta   },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">{m.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">{m.val}</span>
                      <Delta v={m.delta} />
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between text-[12px] pt-1 border-t border-border">
                  <span className="text-muted-foreground">Cost</span>
                  <span className="font-semibold text-foreground">{ch.cost}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grouped bar — metric comparison */}
      <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
        <p className="text-[14px] font-semibold text-foreground mb-4">Side-by-side Metric Comparison</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={channelComparison} barCategoryGap="25%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="metric" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} width={38} />
            <Tooltip formatter={(v: number) => [`${v}%`]} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="SMS" fill="#6366f1" radius={[4,4,0,0]} />
            <Bar dataKey="WA"  fill="#22c55e" radius={[4,4,0,0]} />
            <Bar dataKey="RCS" fill="#ef4444" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Delivery rate trend */}
      <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
        <p className="text-[14px] font-semibold text-foreground mb-4">Delivery Rate Trend — Last 4 days</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={channelTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[88, 100]} tickFormatter={v => `${v}%`} width={38} />
            <Tooltip formatter={(v: number) => [`${v}%`]} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="SMS" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="WA"  stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="RCS" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Cost efficiency callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-brand-xl p-4 flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-amber-900">RCS delivers 4.4× the CTR of SMS at 2.8× the cost</p>
          <p className="text-[12px] text-amber-700 mt-0.5">For high-intent audiences (BFSI, loan reminders), RCS has a lower effective cost-per-click. Consider shifting 15% of SMS budget to RCS for Tier-1 segments.</p>
        </div>
      </div>
    </div>
  );
}

function JourneyAnalyticsTab() {
  const maxN = journeyFunnel[0].n;
  return (
    <div className="space-y-5">
      {/* Journey selector */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-brand-md border border-border bg-white text-[13px] font-medium text-foreground hover:bg-muted/40 transition-colors min-w-[260px] justify-between">
          <span className="flex items-center gap-1.5"><Route className="w-3.5 h-3.5 text-primary" />Loan EMI Reminder Cascade</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px]">Active</Badge>
        <span className="text-[12px] text-muted-foreground">8,412 contacts in-flight · 24,310 completions</span>
      </div>

      {/* Funnel visualisation */}
      <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
        <p className="text-[14px] font-semibold text-foreground mb-5">Step-by-step Funnel</p>
        <div className="space-y-2">
          {journeyFunnel.map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-32 text-right text-[12px] text-muted-foreground shrink-0">{s.step}</div>
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1 bg-muted/30 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center pl-2 transition-all"
                    style={{ width: `${Math.max((s.n / maxN) * 100, 2)}%`, background: s.channel === 'WA' ? '#22c55e' : s.channel === 'SMS' ? '#6366f1' : s.channel === 'RCS' ? '#ef4444' : '#94a3b8' }}
                  >
                    {s.n > 500 && <span className="text-[10px] font-bold text-white">{s.n.toLocaleString()}</span>}
                  </div>
                </div>
                <div className="w-14 text-right">
                  <span className={cn('text-[12px] font-semibold', s.pct === 100 ? 'text-foreground' : s.pct >= 70 ? 'text-emerald-600' : s.pct >= 25 ? 'text-amber-600' : 'text-red-500')}>
                    {s.pct}%
                  </span>
                </div>
                {s.channel && (
                  <span className={cn('text-[10px] font-bold text-white px-1.5 py-0.5 rounded w-10 text-center', channelDot[s.channel])}>
                    {s.channel}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground"><span className="w-3 h-3 rounded-sm bg-green-500" />WhatsApp path</div>
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground"><span className="w-3 h-3 rounded-sm bg-indigo-500" />SMS fallback</div>
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground"><span className="w-3 h-3 rounded-sm bg-red-500" />RCS escalation</div>
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground"><span className="w-3 h-3 rounded-sm bg-slate-400" />Logic / action</div>
        </div>
      </div>

      {/* Top journeys table */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-[14px] font-semibold text-foreground">All Journeys — Performance</p>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {['Journey','Channels','Active','Completions','Conversion'].map(h => (
                <th key={h} className={cn('py-2.5 px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide', ['Active','Completions','Conversion'].includes(h) ? 'text-right' : 'text-left')}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topJourneys.map((j, i) => (
              <tr key={j.id} className={cn('border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer', i % 2 === 0 ? 'bg-white' : 'bg-muted/5')}>
                <td className="py-3 px-4">
                  <p className="font-medium text-foreground">{j.name}</p>
                  <p className="text-[11px] text-muted-foreground">{j.id}</p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    {j.channels.map(ch => <span key={ch} className={cn('w-5 h-5 rounded-full inline-flex items-center justify-center text-[8px] font-bold text-white', channelDot[ch])}>{ch[0]}</span>)}
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-medium">{j.active.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-muted-foreground">{j.completions.toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-semibold text-emerald-600">{j.conv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AudienceInsightsTab() {
  return (
    <div className="space-y-5">
      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Contacts',   value: '2.84M',   icon: Users,         cls: 'bg-indigo-50 text-indigo-600' },
          { label: 'Active Segments',  value: '18',      icon: Zap,           cls: 'bg-amber-50 text-amber-600' },
          { label: 'Opt-out Rate',     value: '1.27%',   icon: TrendingDown,  cls: 'bg-red-50 text-red-500' },
          { label: 'DND / Blacklist',  value: '48.2K',   icon: Target,        cls: 'bg-gray-50 text-gray-500' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', s.cls)}><Icon className="w-3.5 h-3.5" /></div>
                <span className="text-[12px] text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-[22px] font-bold text-foreground font-heading">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Segment performance */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-[14px] font-semibold text-foreground">Segment Performance</p>
          <Button variant="outline" size="sm" className="text-[12px] gap-1.5"><Download className="w-3.5 h-3.5" />Export</Button>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {['Segment','Size','Delivery','Open Rate','CTR','Opt-out'].map(h => (
                <th key={h} className={cn('py-2.5 px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide', h === 'Segment' ? 'text-left' : 'text-right')}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {segmentPerformance.map((s, i) => (
              <tr key={s.segment} className={cn('border-b border-border last:border-0 hover:bg-muted/20 transition-colors', i % 2 === 0 ? 'bg-white' : 'bg-muted/5')}>
                <td className="py-3 px-4 font-medium text-foreground">{s.segment}</td>
                <td className="py-3 px-4 text-right text-muted-foreground">{s.size.toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-semibold text-emerald-600">{s.delivRate}%</td>
                <td className="py-3 px-4 text-right text-muted-foreground">{s.openRate}%</td>
                <td className="py-3 px-4 text-right text-muted-foreground">{s.ctr}%</td>
                <td className="py-3 px-4 text-right">
                  <span className={cn('text-[12px] font-semibold', s.optOut > 2 ? 'text-red-500' : s.optOut > 1 ? 'text-amber-600' : 'text-emerald-600')}>{s.optOut}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Opt-out trend */}
      <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[14px] font-semibold text-foreground">Opt-out Rate Trend</p>
            <p className="text-[12px] text-muted-foreground">All channels · last 7 days</p>
          </div>
          <span className="flex items-center gap-1 text-[12px] text-emerald-600 font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5" />-0.15pp this week
          </span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={optOutTrend} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gOptOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[1.0, 1.7]} tickFormatter={v => `${v}%`} width={38} />
            <Tooltip formatter={(v: number) => [`${v}%`, 'Opt-out']} />
            <Area type="monotone" dataKey="rate" stroke="#ef4444" fill="url(#gOptOut)" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',   label: 'Overview',           icon: BarChart2 },
  { id: 'campaigns',  label: 'Campaign Analytics',  icon: Megaphone2 },
  { id: 'channels',   label: 'Channel Comparison',  icon: Layers },
  { id: 'journeys',   label: 'Journey Analytics',   icon: Route2 },
  { id: 'audiences',  label: 'Audience Insights',   icon: Users },
];

// icon aliases (avoid name clash with lucide imports)
function Megaphone2(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 11l19-9-9 19-2-8-8-2z" />
    </svg>
  );
}
function Route2(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" />
    </svg>
  );
}

const dateRangeLabels: Record<DateRange, string> = { '7d': 'Last 7 days', '30d': 'Last 30 days', '90d': 'Last 90 days' };

const Analytics = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  return (
    <AppLayout>
      <div className="p-6 max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-heading-xl font-bold text-foreground font-heading">Analytics</h1>
            <p className="text-body-sm text-muted-foreground mt-0.5">
              Cross-channel performance, campaign intelligence, journey funnels
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(['7d','30d','90d'] as DateRange[]).map(r => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors',
                  dateRange === r ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {dateRangeLabels[r]}
              </button>
            ))}
            <Button variant="outline" size="sm" className="text-[12px] gap-1.5 ml-2">
              <Download className="w-3.5 h-3.5" />Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border mb-6">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors -mb-px',
                  tab === t.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === 'overview'  && <OverviewTab />}
        {tab === 'campaigns' && <CampaignAnalyticsTab />}
        {tab === 'channels'  && <ChannelComparisonTab />}
        {tab === 'journeys'  && <JourneyAnalyticsTab />}
        {tab === 'audiences' && <AudienceInsightsTab />}
      </div>
    </AppLayout>
  );
};

export default Analytics;

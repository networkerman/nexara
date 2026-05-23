import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  RefreshCw,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Mail,
  HardDrive,
  Plus,
  Eye,
  Trash2,
  MoreHorizontal,
  Wifi,
  WifiOff,
  ArrowUpRight,
  Info,
  Wrench,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AppLayout } from '@/components/layout/AppLayout';
import { cn } from '@/lib/utils';

/* ─── Types ──────────────────────────────────────────────────────────────── */

type ReportTab = 'overview' | 'delivery' | 'engagement' | 'telco' | 'exports';
type Channel = 'All' | 'SMS' | 'WhatsApp' | 'RCS';
type DateRange = '7d' | '30d' | '90d' | 'custom';
type CampaignHealth = 'healthy' | 'degraded' | 'stuck' | 'failed';

interface CampaignRow {
  id: string;
  name: string;
  channel: 'SMS' | 'WhatsApp' | 'RCS';
  sent: number;
  delivered: number;
  failed: number;
  awaited: number;
  deliveryPct: number;
  health: CampaignHealth;
  launchedAt: string;
  prodRef?: string;
}

interface TelcoRow {
  operator: string;
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
  deliveryPct: number;
  avgLatencyMs: number;
  health: 'healthy' | 'degraded' | 'down';
}

interface ScheduledExport {
  id: string;
  name: string;
  type: 'sftp' | 'email';
  frequency: string;
  channels: string[];
  lastRun: string;
  nextRun: string;
  status: 'active' | 'paused' | 'failed';
}

/* ─── Mock data ──────────────────────────────────────────────────────────── */

const trendData = [
  { date: 'May 17', sms: 820000, wa: 210000, rcs: 42000 },
  { date: 'May 18', sms: 940000, wa: 185000, rcs: 38000 },
  { date: 'May 19', sms: 760000, wa: 230000, rcs: 51000 },
  { date: 'May 20', sms: 1050000, wa: 275000, rcs: 63000 },
  { date: 'May 21', sms: 890000, wa: 190000, rcs: 44000 },
  { date: 'May 22', sms: 1120000, wa: 310000, rcs: 71000 },
  { date: 'May 23', sms: 980000, wa: 295000, rcs: 67000 },
];

const deliveryRateData = [
  { date: 'May 17', rate: 91.2 },
  { date: 'May 18', rate: 89.8 },
  { date: 'May 19', rate: 92.4 },
  { date: 'May 20', rate: 88.1 },
  { date: 'May 21', rate: 93.7 },
  { date: 'May 22', rate: 90.5 },
  { date: 'May 23', rate: 92.1 },
];

const channelMixData = [
  { name: 'SMS',       value: 68, color: '#6366F1' },
  { name: 'WhatsApp',  value: 24, color: '#22C55E' },
  { name: 'RCS',       value: 8,  color: '#FF3535' },
];

const campaigns: CampaignRow[] = [
  { id: 'C-1041', name: 'SBI Diwali Festival Offer',      channel: 'WhatsApp', sent: 2400000, delivered: 2256000, failed: 72000,  awaited: 72000, deliveryPct: 94.0, health: 'healthy',  launchedAt: '23 May 09:41' },
  { id: 'C-1040', name: 'KPN Monthly Statement May 2026', channel: 'RCS',      sent: 185000,  delivered: 162800,  failed: 12950,  awaited: 9250,  deliveryPct: 88.0, health: 'degraded', launchedAt: '22 May 14:10', prodRef: 'PROD-345' },
  { id: 'C-1039', name: 'Hero FinCorp EMI Reminder',      channel: 'SMS',      sent: 450000,  delivered: 414000,  failed: 27000,  awaited: 9000,  deliveryPct: 92.0, health: 'healthy',  launchedAt: '22 May 11:00' },
  { id: 'C-1038', name: 'CRIS Train Alert Broadcast',     channel: 'SMS',      sent: 1200000, delivered: 1068000, failed: 96000,  awaited: 36000, deliveryPct: 89.0, health: 'healthy',  launchedAt: '21 May 08:00' },
  { id: 'C-1037', name: 'DMI Finance Pre-approved Loan',  channel: 'SMS',      sent: 320000,  delivered: 0,       failed: 0,      awaited: 320000,deliveryPct: 0,    health: 'stuck',    launchedAt: '20 May 09:00' },
  { id: 'C-1036', name: 'OYO Weekend Deal Push',          channel: 'WhatsApp', sent: 680000,  delivered: 598400,  failed: 47600,  awaited: 34000, deliveryPct: 88.0, health: 'healthy',  launchedAt: '19 May 15:00' },
  { id: 'C-1035', name: 'Growtele Partner Newsletter',    channel: 'SMS',      sent: 95000,   delivered: 0,       failed: 12000,  awaited: 83000, deliveryPct: 0,    health: 'stuck',    launchedAt: '18 May 16:00' },
];

const engagementData = [
  { name: 'WhatsApp', openRate: 62.4, clickRate: 8.3, optOut: 0.9 },
  { name: 'RCS',      openRate: 58.1, clickRate: 11.2, optOut: 0.6 },
  { name: 'SMS',      openRate: 28.5, clickRate: 2.1, optOut: 0.3 },
];

const templatePerf = [
  { name: 'OTP Verification v3',       channel: 'SMS',      sent: 840000,  openRate: null, clickRate: null, deliveryPct: 98.2 },
  { name: 'Loan Disbursal Confirm',    channel: 'WhatsApp', sent: 210000,  openRate: 71.4, clickRate: 12.1, deliveryPct: 94.8 },
  { name: 'Festival Offer Carousel',   channel: 'WhatsApp', sent: 2400000, openRate: 58.3, clickRate: 7.2,  deliveryPct: 94.0 },
  { name: 'Account Statement Rich',    channel: 'RCS',      sent: 185000,  openRate: 61.7, clickRate: 14.3, deliveryPct: 88.0 },
  { name: 'Promotional Bulk SMS',      channel: 'SMS',      sent: 450000,  openRate: null, clickRate: null, deliveryPct: 92.1 },
];

const telcoRows: TelcoRow[] = [
  { operator: 'Airtel', sent: 2100000, delivered: 1953000, failed: 84000,  pending: 63000,  deliveryPct: 93.0, avgLatencyMs: 420,  health: 'healthy'  },
  { operator: 'Jio',    sent: 1850000, delivered: 1702000, failed: 74000,  pending: 74000,  deliveryPct: 92.0, avgLatencyMs: 380,  health: 'healthy'  },
  { operator: 'Vi',     sent: 980000,  delivered: 764400,  failed: 156800, pending: 58800,  deliveryPct: 78.0, avgLatencyMs: 1840, health: 'degraded' },
  { operator: 'BSNL',   sent: 320000,  delivered: 275200,  failed: 25600,  pending: 19200,  deliveryPct: 86.0, avgLatencyMs: 610,  health: 'healthy'  },
  { operator: 'Others', sent: 185000,  delivered: 163600,  failed: 12950,  pending: 8450,   deliveryPct: 88.5, avgLatencyMs: 510,  health: 'healthy'  },
];

const scheduledExports: ScheduledExport[] = [
  { id: 'EXP-1', name: 'SBI Daily Delivery Report',      type: 'sftp',  frequency: 'Daily 06:00',  channels: ['SMS', 'WhatsApp'], lastRun: '23 May 06:00', nextRun: '24 May 06:00', status: 'active' },
  { id: 'EXP-2', name: 'Hero FinCorp Campaign Summary',  type: 'sftp',  frequency: 'Weekly Mon',   channels: ['SMS'],             lastRun: '19 May 06:00', nextRun: '26 May 06:00', status: 'active' },
  { id: 'EXP-3', name: 'OYO Engagement Report',         type: 'email', frequency: 'Weekly Fri',   channels: ['WhatsApp'],        lastRun: '16 May 09:00', nextRun: '23 May 09:00', status: 'paused' },
  { id: 'EXP-4', name: 'Growtele Partner Monthly',      type: 'sftp',  frequency: 'Monthly 1st',  channels: ['SMS'],             lastRun: '01 May 06:00', nextRun: '01 Jun 06:00', status: 'failed' },
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

function pct(n: number): string {
  return n.toFixed(1) + '%';
}

function HealthBadge({ health }: { health: CampaignHealth }) {
  const map: Record<CampaignHealth, { label: string; cls: string; icon: React.ElementType }> = {
    healthy:  { label: 'Healthy',  cls: 'text-success bg-success/10',               icon: CheckCircle2 },
    degraded: { label: 'Degraded', cls: 'text-warning bg-warning/10',               icon: AlertTriangle },
    stuck:    { label: 'Stuck',    cls: 'text-destructive bg-destructive/10',        icon: Clock        },
    failed:   { label: 'Failed',   cls: 'text-destructive bg-destructive/10',        icon: XCircle      },
  };
  const { label, cls, icon: Icon } = map[health];
  return (
    <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full', cls)}>
      <Icon className="w-3 h-3" />{label}
    </span>
  );
}

function ChannelDot({ channel }: { channel: 'SMS' | 'WhatsApp' | 'RCS' }) {
  const map = { SMS: 'bg-indigo-500', WhatsApp: 'bg-green-500', RCS: 'bg-primary' };
  const label = { SMS: 'SMS', WhatsApp: 'WA', RCS: 'RCS' };
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground">
      <span className={cn('w-2 h-2 rounded-full flex-shrink-0', map[channel])} />
      {label[channel]}
    </span>
  );
}

function MiniBar({ pct, health }: { pct: number; health: CampaignHealth }) {
  const color = health === 'stuck' || health === 'failed' ? 'bg-destructive' :
                health === 'degraded' ? 'bg-warning' : 'bg-success';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className="text-[12px] font-medium text-foreground tabular-nums">{pct.toFixed(1)}%</span>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-brand-md shadow-el-2 px-3 py-2 text-[12px]">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-muted-foreground">
          <span style={{ color: p.color }}>●</span> {p.name}: <span className="font-semibold text-foreground">{fmt(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

/* ─── Overview Tab ───────────────────────────────────────────────────────── */

function OverviewTab() {
  const totalSent      = 5_435_000;
  const totalDelivered = 4_957_200;
  const totalFailed    = 263_550;
  const totalAwaited   = 214_250;
  const deliveryRate   = (totalDelivered / totalSent * 100);

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Sent',      value: fmt(totalSent),      sub: '+12% vs last week',  trend: 'up',      cls: '' },
          { label: 'Delivered',       value: fmt(totalDelivered), sub: pct(deliveryRate) + ' rate', trend: 'up', cls: 'text-success' },
          { label: 'Failed',          value: fmt(totalFailed),    sub: pct(totalFailed/totalSent*100) + ' of sent', trend: 'down', cls: 'text-destructive' },
          { label: 'Awaited / Stuck', value: fmt(totalAwaited),   sub: '2 campaigns stuck',  trend: 'warn',    cls: 'text-warning' },
        ].map(k => (
          <div key={k.label} className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">{k.label}</p>
            <p className={cn('text-[26px] font-bold font-heading', k.cls || 'text-foreground')}>{k.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {k.trend === 'up'   && <TrendingUp   className="w-3 h-3 text-success" />}
              {k.trend === 'down' && <TrendingDown  className="w-3 h-3 text-destructive" />}
              {k.trend === 'warn' && <AlertTriangle className="w-3 h-3 text-warning" />}
              <span className="text-[11px] text-muted-foreground">{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Volume trend */}
        <div className="col-span-2 bg-card border border-border rounded-brand-xl p-4 shadow-el-1">
          <p className="text-[13px] font-semibold text-foreground mb-1">Messages sent — last 7 days</p>
          <p className="text-[11px] text-muted-foreground mb-4">All channels combined</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trendData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="smsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="waGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rcsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#FF3535" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#FF3535" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={fmt} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sms" name="SMS"       stroke="#6366F1" fill="url(#smsGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="wa"  name="WhatsApp"  stroke="#22C55E" fill="url(#waGrad)"  strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="rcs" name="RCS"       stroke="#FF3535" fill="url(#rcsGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            {[{ label: 'SMS', color: '#6366F1' }, { label: 'WhatsApp', color: '#22C55E' }, { label: 'RCS', color: '#FF3535' }].map(c => (
              <span key={c.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-3 h-0.5 rounded-full inline-block" style={{ backgroundColor: c.color }} />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        {/* Channel mix pie */}
        <div className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1">
          <p className="text-[13px] font-semibold text-foreground mb-1">Channel mix</p>
          <p className="text-[11px] text-muted-foreground mb-2">By volume, last 7 days</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={channelMixData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                {channelMixData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-1">
            {channelMixData.map(c => (
              <div key={c.name} className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="font-semibold text-foreground">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery rate sparkline */}
      <div className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[13px] font-semibold text-foreground">Overall delivery rate — last 7 days</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Across all channels and operators</p>
          </div>
          <div className="text-right">
            <p className="text-[22px] font-bold text-foreground font-heading">92.1%</p>
            <p className="text-[11px] text-success flex items-center gap-1 justify-end"><TrendingUp className="w-3 h-3" /> +0.4% vs last week</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={deliveryRateData}>
            <defs>
              <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis domain={[85, 96]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => v + '%'} width={40} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="rate" stroke="#22C55E" fill="url(#rateGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top campaigns */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <p className="text-[13px] font-semibold text-foreground">Top campaigns by volume</p>
          <button className="text-[12px] text-primary hover:underline">View all →</button>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Campaign</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Channel</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Sent</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Delivered</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Rate</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.slice(0, 5).map((c, i) => (
              <tr key={c.id} className={cn('border-b border-border last:border-0 hover:bg-muted/30 transition-colors', i % 2 === 0 ? '' : 'bg-muted/10')}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">{c.id} · {c.launchedAt}</p>
                </td>
                <td className="px-4 py-3"><ChannelDot channel={c.channel} /></td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">{fmt(c.sent)}</td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">{fmt(c.delivered)}</td>
                <td className="px-4 py-3"><MiniBar pct={c.deliveryPct} health={c.health} /></td>
                <td className="px-4 py-3"><HealthBadge health={c.health} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Delivery Health Tab ────────────────────────────────────────────────── */

function DeliveryTab() {
  const [healthFilter, setHealthFilter] = useState<'all' | CampaignHealth>('all');
  const [markingId, setMarkingId] = useState<string | null>(null);

  const stuckCount = campaigns.filter(c => c.health === 'stuck').length;
  const filtered = healthFilter === 'all' ? campaigns : campaigns.filter(c => c.health === healthFilter);

  return (
    <div className="space-y-5">
      {/* Stuck transactions alert — folds in #16 */}
      {stuckCount > 0 && (
        <div className="bg-destructive/[0.06] border border-destructive/20 rounded-brand-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-destructive">
              {stuckCount} campaigns have stuck "Awaited" transactions — messages that sent but never got a DLR.
            </p>
            <p className="text-[12px] text-destructive/80 mt-0.5">
              In Aura, these required a manual DB fix. You can now self-serve repair directly from this page.
            </p>
          </div>
          <span className="text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20 px-2 py-1 rounded-full whitespace-nowrap">#16 Transaction Health</span>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Healthy',  count: campaigns.filter(c=>c.health==='healthy').length,  cls: 'text-success' },
          { label: 'Degraded', count: campaigns.filter(c=>c.health==='degraded').length, cls: 'text-warning' },
          { label: 'Stuck',    count: campaigns.filter(c=>c.health==='stuck').length,    cls: 'text-destructive' },
          { label: 'Failed',   count: campaigns.filter(c=>c.health==='failed').length,   cls: 'text-destructive' },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setHealthFilter(healthFilter === s.label.toLowerCase() as CampaignHealth ? 'all' : s.label.toLowerCase() as CampaignHealth)}
            className={cn(
              'bg-card border border-border rounded-brand-xl p-3 shadow-el-1 text-left hover:shadow-el-2 transition-shadow',
              healthFilter === s.label.toLowerCase() && 'ring-1 ring-primary',
            )}
          >
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{s.label}</p>
            <p className={cn('text-[22px] font-bold font-heading mt-0.5', s.cls)}>{s.count}</p>
          </button>
        ))}
      </div>

      {/* Campaigns table */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-3">
          <p className="text-[13px] font-semibold text-foreground flex-1">
            {filtered.length} campaign{filtered.length !== 1 ? 's' : ''}
            {healthFilter !== 'all' && <span className="text-muted-foreground font-normal"> — filtered: {healthFilter}</span>}
          </p>
          <button className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground px-3 py-1.5 border border-border rounded-brand-md transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Campaign</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Ch</th>
                <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Sent</th>
                <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Delivered</th>
                <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Failed</th>
                <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Awaited</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Rate</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className={cn('border-b border-border last:border-0 hover:bg-muted/30 transition-colors', i % 2 === 0 ? '' : 'bg-muted/10')}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{c.id} · {c.launchedAt}</p>
                      </div>
                      {c.prodRef && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full">{c.prodRef}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3"><ChannelDot channel={c.channel} /></td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium">{fmt(c.sent)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-success font-medium">{fmt(c.delivered)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-destructive font-medium">{fmt(c.failed)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className={cn('font-medium', c.awaited > 0 ? 'text-warning' : 'text-muted-foreground')}>{fmt(c.awaited)}</span>
                  </td>
                  <td className="px-4 py-3"><MiniBar pct={c.deliveryPct} health={c.health} /></td>
                  <td className="px-4 py-3"><HealthBadge health={c.health} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {c.health === 'stuck' && (
                        <button
                          onClick={() => setMarkingId(markingId === c.id ? null : c.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 px-2 py-1 rounded-brand-sm transition-colors whitespace-nowrap"
                        >
                          <Wrench className="w-3 h-3" /> Mark Awaited
                        </button>
                      )}
                      <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors text-muted-foreground">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors text-muted-foreground">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Mark Awaited inline panel */}
                    {markingId === c.id && (
                      <div className="mt-2 p-3 bg-destructive/[0.05] border border-destructive/20 rounded-brand-md">
                        <p className="text-[12px] font-semibold text-destructive mb-1">Mark {fmt(c.awaited)} transactions as Awaited?</p>
                        <p className="text-[11px] text-muted-foreground mb-2">This updates DLR status to "Awaited" and triggers a re-query from the operator. Cannot be undone.</p>
                        <div className="flex gap-2">
                          <button className="text-[12px] font-semibold bg-destructive text-white px-3 py-1.5 rounded-brand-sm hover:bg-destructive/90 transition-colors">Confirm repair</button>
                          <button onClick={() => setMarkingId(null)} className="text-[12px] text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors">Cancel</button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Engagement Tab ─────────────────────────────────────────────────────── */

function EngagementTab() {
  return (
    <div className="space-y-5">
      {/* SMS note */}
      <div className="bg-muted/60 border border-border rounded-brand-xl p-3 flex items-center gap-2">
        <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <p className="text-[12px] text-muted-foreground">
          Open and click rates are only available for <strong>WhatsApp</strong> and <strong>RCS</strong>. SMS delivery is confirmed via DLR only.
        </p>
      </div>

      {/* Channel engagement bars */}
      <div className="grid grid-cols-3 gap-4">
        {engagementData.map(ch => (
          <div key={ch.name} className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1">
            <p className="text-[13px] font-semibold text-foreground mb-3">{ch.name}</p>
            <div className="space-y-3">
              {[
                { label: 'Open rate',   value: ch.openRate,  color: 'bg-indigo-500', na: ch.openRate === null },
                { label: 'Click rate',  value: ch.clickRate, color: 'bg-primary',    na: ch.clickRate === null },
                { label: 'Opt-out',     value: ch.optOut,    color: 'bg-destructive', na: false },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-muted-foreground">{m.label}</span>
                    <span className="text-[13px] font-bold text-foreground">{m.na ? '—' : pct(m.value!)}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    {!m.na && (
                      <div className={cn('h-full rounded-full', m.color)} style={{ width: `${Math.min((m.value! / 80) * 100, 100)}%` }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Engagement chart */}
      <div className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1">
        <p className="text-[13px] font-semibold text-foreground mb-1">Channel engagement comparison</p>
        <p className="text-[11px] text-muted-foreground mb-4">Open rate and click rate by channel — last 7 days</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={engagementData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => v + '%'} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="openRate"  name="Open rate"  fill="#6366F1" radius={[3, 3, 0, 0]} />
            <Bar dataKey="clickRate" name="Click rate" fill="#FF3535" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Template performance table */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-[13px] font-semibold text-foreground">Template performance</p>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Template</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Channel</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Sent</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Open rate</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Click rate</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Delivery</th>
            </tr>
          </thead>
          <tbody>
            {templatePerf.map((t, i) => (
              <tr key={t.name} className={cn('border-b border-border last:border-0 hover:bg-muted/30 transition-colors', i % 2 === 0 ? '' : 'bg-muted/10')}>
                <td className="px-4 py-3 font-medium text-foreground">{t.name}</td>
                <td className="px-4 py-3"><ChannelDot channel={t.channel as 'SMS' | 'WhatsApp' | 'RCS'} /></td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{fmt(t.sent)}</td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">{t.openRate != null ? pct(t.openRate) : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">{t.clickRate != null ? pct(t.clickRate) : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-4 py-3">
                  <MiniBar pct={t.deliveryPct} health={t.deliveryPct > 90 ? 'healthy' : 'degraded'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Telco Tab ──────────────────────────────────────────────────────────── */

function TelcoTab() {
  return (
    <div className="space-y-5">
      {/* Vi degradation alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-brand-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-amber-900">
            Vi route degraded — Kaleyra throughput at 60% since 19 May. Fallback to Infobip active.
          </p>
          <p className="text-[12px] text-amber-700 mt-0.5">
            Delivery rate on Vi has dropped to 78%. Average latency up to 1.84s vs normal 0.4s. PROD-345 open.
          </p>
        </div>
        <span className="text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-300 px-2 py-1 rounded-full">PROD-345</span>
      </div>

      {/* Operator stats */}
      <div className="grid grid-cols-5 gap-3">
        {telcoRows.map(op => (
          <div key={op.operator} className={cn(
            'bg-card border rounded-brand-xl p-3 shadow-el-1',
            op.health === 'degraded' ? 'border-warning/40 bg-warning/[0.02]' : 'border-border',
          )}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-bold text-foreground">{op.operator}</p>
              {op.health === 'healthy'  && <Wifi      className="w-4 h-4 text-success" />}
              {op.health === 'degraded' && <WifiOff   className="w-4 h-4 text-warning" />}
              {op.health === 'down'     && <WifiOff   className="w-4 h-4 text-destructive" />}
            </div>
            <p className={cn('text-[20px] font-bold font-heading', op.health === 'degraded' ? 'text-warning' : 'text-foreground')}>
              {pct(op.deliveryPct)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">delivery rate</p>
            <p className="text-[11px] text-muted-foreground mt-2">{op.avgLatencyMs}ms avg</p>
          </div>
        ))}
      </div>

      {/* Operator breakdown table */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <p className="text-[13px] font-semibold text-foreground">Operator-wise delivery breakdown</p>
          <button className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground px-3 py-1.5 border border-border rounded-brand-md transition-colors">
            <Download className="w-3.5 h-3.5" /> Export for TRAI
          </button>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Operator</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Sent</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Delivered</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Failed</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Pending</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Rate</th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Avg latency</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Health</th>
            </tr>
          </thead>
          <tbody>
            {telcoRows.map((op, i) => (
              <tr key={op.operator} className={cn(
                'border-b border-border last:border-0 hover:bg-muted/30 transition-colors',
                op.health === 'degraded' ? 'bg-warning/[0.03]' : i % 2 !== 0 ? 'bg-muted/10' : '',
              )}>
                <td className="px-4 py-3 font-semibold text-foreground">{op.operator}</td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{fmt(op.sent)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-success font-medium">{fmt(op.delivered)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-destructive font-medium">{fmt(op.failed)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-warning font-medium">{fmt(op.pending)}</td>
                <td className="px-4 py-3">
                  <MiniBar pct={op.deliveryPct} health={op.health === 'degraded' ? 'degraded' : 'healthy'} />
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{op.avgLatencyMs}ms</td>
                <td className="px-4 py-3">
                  {op.health === 'healthy'  && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success"><Wifi className="w-3 h-3" />Healthy</span>}
                  {op.health === 'degraded' && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-warning"><WifiOff className="w-3 h-3" />Degraded</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2.5 border-t border-border bg-muted/20">
          <p className="text-[11px] text-muted-foreground">Data reflects SMS channel only. WhatsApp and RCS use BSP-level delivery confirmation, not operator-reported DLR.</p>
        </div>
      </div>

      {/* DLT compliance summary */}
      <div className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1">
        <p className="text-[13px] font-semibold text-foreground mb-3">DLT submission compliance — this week</p>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Templates submitted', value: '2,847', sub: 'to TRAI DLT'      },
            { label: 'Approved',            value: '2,791', sub: '98.0% approval'   },
            { label: 'Rejected',            value: '56',    sub: 'Missing PE mapping'},
            { label: 'Pending sync',        value: '0',     sub: 'All clear'         },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-[22px] font-bold font-heading text-foreground">{s.value}</p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Exports Tab ────────────────────────────────────────────────────────── */

function ExportsTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[15px] font-semibold text-foreground">Scheduled Exports</p>
          <p className="text-[13px] text-muted-foreground mt-0.5">Automatically push reports to SFTP or email on a schedule</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-4 py-2 rounded-brand-md hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> New schedule
        </button>
      </div>

      {/* SFTP / Email note */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-brand-xl p-3 flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-[12px] font-semibold text-blue-900">SFTP push supported</p>
            <p className="text-[11px] text-blue-700">Configure your SFTP credentials in Settings → Integrations</p>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-brand-xl p-3 flex items-center gap-3">
          <Mail className="w-5 h-5 text-purple-600 flex-shrink-0" />
          <div>
            <p className="text-[12px] font-semibold text-purple-900">Email delivery supported</p>
            <p className="text-[11px] text-purple-700">Reports sent as CSV attachments to configured recipients</p>
          </div>
        </div>
      </div>

      {/* Scheduled exports list */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Channels</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Frequency</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Last run</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Next run</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {scheduledExports.map((exp, i) => (
              <tr key={exp.id} className={cn('border-b border-border last:border-0 hover:bg-muted/30 transition-colors', i % 2 === 0 ? '' : 'bg-muted/10')}>
                <td className="px-4 py-3 font-medium text-foreground">{exp.name}</td>
                <td className="px-4 py-3">
                  {exp.type === 'sftp'
                    ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"><HardDrive className="w-3 h-3" />SFTP</span>
                    : <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full"><Mail className="w-3 h-3" />Email</span>
                  }
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {exp.channels.map(ch => (
                      <span key={ch} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{ch}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{exp.frequency}</td>
                <td className="px-4 py-3 text-muted-foreground">{exp.lastRun}</td>
                <td className="px-4 py-3 text-muted-foreground">{exp.nextRun}</td>
                <td className="px-4 py-3">
                  {exp.status === 'active' && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success"><span className="w-1.5 h-1.5 rounded-full bg-success" />Active</span>}
                  {exp.status === 'paused' && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />Paused</span>}
                  {exp.status === 'failed' && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive"><XCircle className="w-3 h-3" />Failed</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors text-muted-foreground" title="Run now">
                      <ArrowUpRight className="w-3.5 h-3.5" />
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

      {/* On-demand export */}
      <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
        <p className="text-[14px] font-semibold text-foreground mb-1">On-demand export</p>
        <p className="text-[12px] text-muted-foreground mb-4">Download a one-time report for a specific date range and channel</p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select className="text-[13px] border border-border bg-muted rounded-brand-md px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/50">
              <option>All channels</option>
              <option>SMS</option>
              <option>WhatsApp</option>
              <option>RCS</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select className="text-[13px] border border-border bg-muted rounded-brand-md px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/50">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Custom range</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select className="text-[13px] border border-border bg-muted rounded-brand-md px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/50">
              <option>Delivery report</option>
              <option>Engagement report</option>
              <option>Telco summary</option>
              <option>Transaction log</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
          <button className="flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-4 py-2 rounded-brand-md hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" /> Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Reports Page ───────────────────────────────────────────────────────── */

const tabs: { id: ReportTab; label: string }[] = [
  { id: 'overview',  label: 'Overview'        },
  { id: 'delivery',  label: 'Delivery Health' },
  { id: 'engagement',label: 'Engagement'      },
  { id: 'telco',     label: 'Telco'           },
  { id: 'exports',   label: 'Exports'         },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('overview');
  const [channel, setChannel] = useState<Channel>('All');
  const [dateRange, setDateRange] = useState<DateRange>('7d');

  return (
    <AppLayout>
      <div className="flex flex-col h-full">

        {/* Top bar — filters */}
        <div className="bg-card border-b border-border px-6 py-3 flex items-center gap-3 flex-shrink-0">
          {/* Date range */}
          <div className="flex gap-0.5 bg-muted p-0.5 rounded-brand-md">
            {(['7d', '30d', '90d'] as const).map(r => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={cn(
                  'text-[12px] font-medium px-3 py-1.5 rounded-brand-sm transition-colors',
                  dateRange === r ? 'bg-card text-foreground shadow-el-1' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {r === '7d' ? 'Last 7 days' : r === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </button>
            ))}
            <button
              onClick={() => setDateRange('custom')}
              className={cn(
                'text-[12px] font-medium px-3 py-1.5 rounded-brand-sm transition-colors flex items-center gap-1.5',
                dateRange === 'custom' ? 'bg-card text-foreground shadow-el-1' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Calendar className="w-3.5 h-3.5" /> Custom
            </button>
          </div>

          {/* Channel filter */}
          <div className="flex gap-0.5 bg-muted p-0.5 rounded-brand-md">
            {(['All', 'SMS', 'WhatsApp', 'RCS'] as const).map(ch => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={cn(
                  'text-[12px] font-medium px-3 py-1.5 rounded-brand-sm transition-colors',
                  channel === ch ? 'bg-card text-foreground shadow-el-1' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {ch}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          <button className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Tab bar */}
        <div className="bg-card border-b border-border px-6 flex items-center gap-1 flex-shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-3 text-[13px] font-medium border-b-2 -mb-px transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
              {tab.id === 'delivery' && campaigns.filter(c => c.health === 'stuck').length > 0 && (
                <span className="ml-1.5 w-4 h-4 bg-destructive text-white text-[10px] font-bold rounded-full inline-flex items-center justify-center">
                  {campaigns.filter(c => c.health === 'stuck').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-[1400px] mx-auto">
            {activeTab === 'overview'   && <OverviewTab />}
            {activeTab === 'delivery'   && <DeliveryTab />}
            {activeTab === 'engagement' && <EngagementTab />}
            {activeTab === 'telco'      && <TelcoTab />}
            {activeTab === 'exports'    && <ExportsTab />}
          </div>
        </main>

      </div>
    </AppLayout>
  );
};

export default Reports;

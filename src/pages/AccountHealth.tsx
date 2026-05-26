import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  CheckCircle2, AlertTriangle, XCircle,
  TrendingUp, TrendingDown,
  Phone, Mail,
  Shield, Plug2, FileText, HeartPulse,
  ChevronDown, Download, RefreshCw,
  Clock, ArrowUpRight, ArrowDownRight,
  Building2, User, Headphones, Zap,
  Wifi, WifiOff, Activity,
  Bell, ExternalLink,
  ServerCrash, CheckCheck,
} from 'lucide-react';
import { WhatsAppIcon, RCSIcon, SMSIcon, EmailIcon, VoiceIcon } from '@/components/icons/ChannelIcons';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'delivery' | 'compliance' | 'integrations' | 'account';
type HealthLevel = 'healthy' | 'warning' | 'critical';

// ─── Mock accounts ────────────────────────────────────────────────────────────

const accounts = [
  { id: 'SBI',       name: 'State Bank of India',       tier: 'Enterprise', score: 82 },
  { id: 'DMI',       name: 'DMI Finance',                tier: 'Enterprise', score: 94 },
  { id: 'CRIS',      name: 'CRIS / Indian Railways',     tier: 'Government', score: 76 },
  { id: 'CREDGEN',   name: 'Credgenics',                 tier: 'Business',   score: 91 },
  { id: 'KPN',       name: 'KPN Towers',                 tier: 'Business',   score: 68 },
];

const accountDetail = {
  SBI: {
    csm: 'Priya Mehta', csmEmail: 'priya.mehta@onextel.com', csmPhone: '+91 98100 22301',
    contractStart: '1 Apr 2025', contractEnd: '31 Mar 2027', tier: 'Enterprise',
    contractedSMS: 50000000, contractedWA: 10000000, contractedRCS: 2000000,
    usedSMS: 38400000, usedWA: 5810000, usedRCS: 971000,
    openTickets: 4, slaBreaches: 1,
    score: 82,
    pillars: {
      delivery:     { score: 88, level: 'healthy'  as HealthLevel, label: 'Delivery'     },
      compliance:   { score: 74, level: 'warning'  as HealthLevel, label: 'Compliance'   },
      integrations: { score: 91, level: 'healthy'  as HealthLevel, label: 'Integrations' },
      support:      { score: 72, level: 'warning'  as HealthLevel, label: 'Support'      },
    },
    channels: [
      { ch: 'SMS',      level: 'healthy'  as HealthLevel, delivRate: 94.8, note: 'Normal operations' },
      { ch: 'WhatsApp', level: 'healthy'  as HealthLevel, delivRate: 97.1, note: 'Normal operations' },
      { ch: 'RCS',      level: 'warning'  as HealthLevel, delivRate: 91.2, note: 'Jio delivery 4% below SLA' },
      { ch: 'Email',    level: 'critical' as HealthLevel, delivRate: 71.4, note: 'SPF misconfiguration — action needed' },
    ],
    alerts: [
      { id: 'A-1', level: 'critical' as HealthLevel, title: 'Email SPF record missing on sbi.co.in',       time: '2 hours ago',  action: 'Fix now' },
      { id: 'A-2', level: 'warning'  as HealthLevel, title: '3 DLT templates expire in 14 days',           time: '1 day ago',    action: 'Renew templates' },
      { id: 'A-3', level: 'warning'  as HealthLevel, title: 'RCS delivery on Jio below 92% SLA threshold', time: '6 hours ago',  action: 'View report' },
      { id: 'A-4', level: 'warning'  as HealthLevel, title: '1 open support ticket past SLA (> 48 hrs)',   time: '3 days ago',   action: 'View ticket' },
    ],
    deliveryTrend: [
      { day: '17 May', SMS: 94.6, WA: 97.0, RCS: 92.8 },
      { day: '18 May', SMS: 93.8, WA: 96.8, RCS: 90.4 },
      { day: '19 May', SMS: 94.2, WA: 97.4, RCS: 91.6 },
      { day: '20 May', SMS: 94.9, WA: 97.2, RCS: 91.0 },
      { day: '21 May', SMS: 95.1, WA: 96.9, RCS: 89.8 },
      { day: '22 May', SMS: 94.7, WA: 97.3, RCS: 91.4 },
      { day: '23 May', SMS: 94.8, WA: 97.1, RCS: 91.2 },
    ],
    stuckTx: { count: 12, oldestAge: '4h 22m', totalValue: '12,400 msgs' },
    dltTemplates: [
      { id: 'DLT-8810041', name: 'OTP Delivery',        status: 'active',  expiry: '15 Aug 2026' },
      { id: 'DLT-8810042', name: 'Account Alert',       status: 'active',  expiry: '15 Jun 2026' },
      { id: 'DLT-8810055', name: 'EMI Reminder',        status: 'expiring', expiry: '6 Jun 2026'  },
      { id: 'DLT-8810061', name: 'Promo — Credit Card', status: 'expiring', expiry: '4 Jun 2026'  },
      { id: 'DLT-8810088', name: 'Fraud Alert',         status: 'expiring', expiry: '1 Jun 2026'  },
    ],
    integrations: [
      { name: 'SFTP Report Push',    status: 'healthy'  as HealthLevel, detail: 'Last delivered 23 May 06:00', latency: '—' },
      { name: 'Webhook — Delivery',  status: 'healthy'  as HealthLevel, detail: '99.7% success last 24h',       latency: '142ms' },
      { name: 'Webhook — Optout',    status: 'healthy'  as HealthLevel, detail: '100% success last 24h',        latency: '98ms' },
      { name: 'MoEngage CRM sync',   status: 'warning'  as HealthLevel, detail: 'Lag 18 min · SLA is 5 min',    latency: '18m lag' },
      { name: 'REST API (v2)',        status: 'healthy'  as HealthLevel, detail: 'Uptime 99.98% last 30 days',   latency: '210ms' },
    ],
    tickets: [
      { id: 'PROD-389', title: 'RCS delivery failure on Jio for SBI cards batch', priority: 'high',   age: '3d 4h',  sla: 'breach' },
      { id: 'PROD-401', title: 'SFTP report not received for 22 May',              priority: 'medium', age: '18h',    sla: 'ok'     },
      { id: 'PROD-407', title: 'WA template WABA_SBI_LOAN_02 rejected by Meta',   priority: 'high',   age: '6h',     sla: 'ok'     },
      { id: 'PROD-412', title: 'Email SPF record validation failing',              priority: 'urgent', age: '2h',     sla: 'ok'     },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const healthCfg: Record<HealthLevel, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  healthy:  { label: 'Healthy',  color: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-200', icon: CheckCircle2 },
  warning:  { label: 'Warning',  color: 'text-amber-600',   bg: 'bg-amber-50',    border: 'border-amber-200',   icon: AlertTriangle },
  critical: { label: 'Critical', color: 'text-red-600',     bg: 'bg-red-50',      border: 'border-red-200',     icon: XCircle },
};

const channelIcon: Record<string, React.ElementType> = {
  SMS: SMSIcon, WhatsApp: WhatsAppIcon, RCS: RCSIcon, Email: EmailIcon, Voice: VoiceIcon,
};
const channelColor: Record<string, string> = {
  SMS: 'text-indigo-400', WhatsApp: 'text-emerald-500', RCS: 'text-blue-400', Email: 'text-sky-400', Voice: 'text-violet-400',
};
const channelBg: Record<string, string> = {
  SMS: 'bg-indigo-50', WhatsApp: 'bg-emerald-50', RCS: 'bg-blue-50', Email: 'bg-sky-50', Voice: 'bg-violet-50',
};

function ScoreRing({ score, size = 96 }: { score: number; size?: number }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 85 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={8} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${size/2}px ${size/2}px`,
          fontSize: size > 80 ? 22 : 14, fontWeight: 700, fill: color }}>
        {score}
      </text>
    </svg>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-el-2 p-3 text-[12px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />{p.name}
          </span>
          <span className="font-semibold text-foreground">{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab({ data }: { data: typeof accountDetail.SBI }) {
  const overallLevel: HealthLevel = data.score >= 85 ? 'healthy' : data.score >= 70 ? 'warning' : 'critical';
  const hc = healthCfg[overallLevel];

  return (
    <div className="space-y-5">
      {/* Score hero + pillars */}
      <div className="grid grid-cols-5 gap-4">
        {/* Overall score */}
        <div className={cn('col-span-1 bg-white border-2 rounded-brand-xl p-5 shadow-el-1 flex flex-col items-center justify-center gap-3', hc.border)}>
          <ScoreRing score={data.score} size={100} />
          <div className="text-center">
            <p className="text-[13px] font-bold text-foreground">Account Health</p>
            <Badge className={cn('border text-[11px] mt-1', hc.bg, hc.color, hc.border)}>
              <hc.icon className="w-3 h-3 mr-1" />{hc.label}
            </Badge>
          </div>
        </div>

        {/* 4 pillars */}
        {Object.values(data.pillars).map(p => {
          const pc = healthCfg[p.level];
          const Icon = pc.icon;
          const pillarIcon = p.label === 'Delivery' ? HeartPulse : p.label === 'Compliance' ? Shield : p.label === 'Integrations' ? Plug2 : Headphones;
          return (
            <div key={p.label} className={cn('bg-white border rounded-brand-xl p-4 shadow-el-1 hover:shadow-el-2 transition-shadow', pc.border)}>
              <div className="flex items-center justify-between mb-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', pc.bg)}>
                  {(() => { const PI = pillarIcon; return <PI className={cn('w-4 h-4', pc.color)} />; })()}
                </div>
                <ScoreRing score={p.score} size={44} />
              </div>
              <p className="text-[13px] font-semibold text-foreground">{p.label}</p>
              <Badge className={cn('border text-[10px] mt-1.5', pc.bg, pc.color, pc.border)}>
                <Icon className="w-3 h-3 mr-1" />{pc.label}
              </Badge>
            </div>
          );
        })}
      </div>

      {/* Active alerts */}
      {data.alerts.length > 0 && (
        <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <p className="text-[14px] font-semibold text-foreground">Active Alerts</p>
              <span className="text-[11px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">
                {data.alerts.filter(a => a.level === 'critical').length} critical
              </span>
            </div>
            <Button variant="outline" size="sm" className="text-[12px]">View all</Button>
          </div>
          <div className="divide-y divide-border">
            {data.alerts.map(a => {
              const ac = healthCfg[a.level];
              const AI = ac.icon;
              return (
                <div key={a.id} className={cn('flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors', a.level === 'critical' && 'bg-red-50/40')}>
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', ac.bg)}>
                    <AI className={cn('w-4 h-4', ac.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate">{a.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                  <Button size="sm" variant="outline" className={cn('text-[11px] flex-shrink-0', a.level === 'critical' && 'border-red-200 text-red-600 hover:bg-red-50')}>
                    {a.action}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Channel health grid */}
      <div>
        <p className="text-[14px] font-semibold text-foreground mb-3">Channel Status</p>
        <div className="grid grid-cols-4 gap-3">
          {data.channels.map(ch => {
            const cc = healthCfg[ch.level];
            const Icon = channelIcon[ch.ch] ?? Phone;
            const CI = cc.icon;
            return (
              <div key={ch.ch} className={cn('bg-white border-2 rounded-brand-xl p-4 shadow-el-1', cc.border)}>
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', channelBg[ch.ch])}>
                    <Icon className={cn('w-4 h-4', channelColor[ch.ch])} />
                  </div>
                  <CI className={cn('w-4 h-4', cc.color)} />
                </div>
                <p className="text-[14px] font-bold text-foreground">{ch.ch}</p>
                <p className="text-[22px] font-bold font-heading mt-1">{ch.delivRate}%</p>
                <p className="text-[11px] text-muted-foreground">delivery rate</p>
                <p className={cn('text-[11px] mt-2 font-medium', cc.color)}>{ch.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery trend */}
      <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
        <p className="text-[14px] font-semibold text-foreground mb-1">Delivery Rate — Last 7 Days</p>
        <p className="text-[12px] text-muted-foreground mb-4">Per-channel · SLA threshold 92%</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data.deliveryTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            {/* SLA reference line at 92% */}
            <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[88, 100]} tickFormatter={v => `${v}%`} width={38} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="SMS" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="WA"  stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="RCS" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 justify-center mt-2">
          {[['SMS','#6366f1'],['WhatsApp','#22c55e'],['RCS (Jio dip)','#ef4444']].map(([n,c]) => (
            <span key={n} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />{n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Delivery ────────────────────────────────────────────────────────────

function DeliveryTab({ data }: { data: typeof accountDetail.SBI }) {
  return (
    <div className="space-y-5">
      {/* Stuck transactions */}
      {data.stuckTx.count > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-brand-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[13px] font-semibold text-amber-900">
                {data.stuckTx.count} stuck "Awaited" transactions
              </p>
              <p className="text-[12px] text-amber-700 mt-0.5">
                Oldest: {data.stuckTx.oldestAge} · Affected volume: {data.stuckTx.totalValue}
              </p>
            </div>
          </div>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-[12px] gap-1.5 flex-shrink-0">
            <Zap className="w-3.5 h-3.5" />Mark Awaited
          </Button>
        </div>
      )}

      {/* Per-channel delivery cards */}
      <div className="grid grid-cols-4 gap-3">
        {data.channels.map(ch => {
          const cc = healthCfg[ch.level];
          const Icon = channelIcon[ch.ch] ?? Phone;
          return (
            <div key={ch.ch} className={cn('bg-white border rounded-brand-xl p-4 shadow-el-1', cc.border)}>
              <div className="flex items-center gap-2 mb-3">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', channelBg[ch.ch])}>
                  <Icon className={cn('w-3.5 h-3.5', channelColor[ch.ch])} />
                </div>
                <span className="font-semibold text-[13px] text-foreground">{ch.ch}</span>
              </div>
              <p className="text-[24px] font-bold font-heading text-foreground">{ch.delivRate}%</p>
              <p className="text-[11px] text-muted-foreground">delivery rate</p>
              <div className="mt-2 w-full bg-muted/40 rounded-full h-1.5">
                <div className={cn('h-1.5 rounded-full', ch.level === 'healthy' ? 'bg-emerald-500' : ch.level === 'warning' ? 'bg-amber-500' : 'bg-red-500')}
                  style={{ width: `${ch.delivRate}%` }} />
              </div>
              <p className={cn('text-[11px] mt-2', cc.color)}>{ch.note}</p>
            </div>
          );
        })}
      </div>

      {/* 7-day delivery trend (bigger) */}
      <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[14px] font-semibold text-foreground">Delivery Rate Trend</p>
            <p className="text-[12px] text-muted-foreground">Last 7 days · dashed red line = SLA threshold 92%</p>
          </div>
          <Button variant="outline" size="sm" className="text-[12px] gap-1.5">
            <Download className="w-3.5 h-3.5" />Export
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data.deliveryTrend}>
            <defs>
              <linearGradient id="gSMS2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="gWA2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[88, 100]} tickFormatter={v => `${v}%`} width={38} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="SMS" stroke="#6366f1" fill="url(#gSMS2)" strokeWidth={2} dot={{ r: 3 }} />
            <Area type="monotone" dataKey="WA"  stroke="#22c55e" fill="url(#gWA2)"  strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="RCS" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Tab: Compliance ──────────────────────────────────────────────────────────

function ComplianceTab({ data }: { data: typeof accountDetail.SBI }) {
  const dltStatusCfg: Record<string, { cls: string; label: string }> = {
    active:   { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Active'   },
    expiring: { cls: 'bg-amber-100 text-amber-700 border-amber-200',       label: 'Expiring' },
    expired:  { cls: 'bg-red-100 text-red-600 border-red-200',             label: 'Expired'  },
  };

  return (
    <div className="space-y-5">
      {/* Compliance score cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'DLT Templates',      value: '5 active',   sub: '3 expiring in 14 days', level: 'warning'  as HealthLevel },
          { label: 'TRAI NDNC Sync',     value: 'Synced',     sub: 'Last sync: 23 May 02:00', level: 'healthy' as HealthLevel },
          { label: 'VAPT Certification', value: 'Valid',       sub: 'Expires 31 Dec 2026',     level: 'healthy' as HealthLevel },
        ].map(s => {
          const sc = healthCfg[s.level];
          const SI = sc.icon;
          return (
            <div key={s.label} className={cn('bg-white border rounded-brand-xl p-4 shadow-el-1', sc.border)}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] text-muted-foreground font-medium">{s.label}</p>
                <SI className={cn('w-4 h-4', sc.color)} />
              </div>
              <p className="text-[20px] font-bold text-foreground font-heading">{s.value}</p>
              <p className={cn('text-[11px] mt-1', s.level === 'warning' ? 'text-amber-600 font-medium' : 'text-muted-foreground')}>{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* DLT templates */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-[14px] font-semibold text-foreground">DLT Template Registry</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-[12px] gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />Sync from TRAI
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-[12px]">
              Renew expiring
            </Button>
          </div>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {['Template ID','Name','Status','Expiry',''].map(h => (
                <th key={h} className="py-2.5 px-5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.dltTemplates.map((t, i) => {
              const sc = dltStatusCfg[t.status];
              return (
                <tr key={t.id} className={cn('border-b border-border last:border-0 hover:bg-muted/20 transition-colors', i % 2 === 0 ? 'bg-white' : 'bg-muted/5')}>
                  <td className="py-3 px-5 font-mono text-[12px] text-muted-foreground">{t.id}</td>
                  <td className="py-3 px-5 font-medium text-foreground">{t.name}</td>
                  <td className="py-3 px-5"><Badge className={cn('border text-[10px]', sc.cls)}>{sc.label}</Badge></td>
                  <td className="py-3 px-5 text-muted-foreground">{t.expiry}</td>
                  <td className="py-3 px-5">
                    {t.status === 'expiring' && (
                      <Button size="sm" variant="outline" className="text-[11px] border-amber-200 text-amber-600 hover:bg-amber-50">Renew</Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Opt-out compliance */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-brand-xl p-4 flex items-center gap-3">
        <CheckCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-emerald-900">NDNC / DND compliance — Clean</p>
          <p className="text-[12px] text-emerald-700 mt-0.5">All outbound SMS screened against TRAI NDNC registry. Last full sync: 23 May 2026 02:00 AM · 0 violations in last 30 days.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Integrations ────────────────────────────────────────────────────────

function IntegrationsTab({ data }: { data: typeof accountDetail.SBI }) {
  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-[14px] font-semibold text-foreground">Integration Health</p>
          <Button variant="outline" size="sm" className="text-[12px] gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />Refresh status
          </Button>
        </div>
        <div className="divide-y divide-border">
          {data.integrations.map(intg => {
            const ic = healthCfg[intg.status];
            const II = intg.status === 'healthy' ? Wifi : WifiOff;
            return (
              <div key={intg.name} className={cn('flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors', intg.status === 'warning' && 'bg-amber-50/40')}>
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', ic.bg)}>
                  <II className={cn('w-4 h-4', ic.color)} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-foreground">{intg.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{intg.detail}</p>
                </div>
                <div className="text-right">
                  <Badge className={cn('border text-[10px]', ic.bg, ic.color, ic.border)}>
                    <ic.icon className="w-3 h-3 mr-1" />{ic.label}
                  </Badge>
                  {intg.latency !== '—' && (
                    <p className="text-[11px] text-muted-foreground mt-1">{intg.latency}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MoEngage CRM warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-brand-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-amber-900">MoEngage CRM sync lag exceeds SLA</p>
          <p className="text-[12px] text-amber-700 mt-0.5">Current lag: 18 minutes · SLA: 5 minutes. This may cause delayed segment updates affecting time-sensitive campaigns. Contact support or check MoEngage API credentials.</p>
          <Button size="sm" variant="outline" className="mt-2 text-[12px] border-amber-300 text-amber-700 hover:bg-amber-100 gap-1.5">
            <ExternalLink className="w-3 h-3" />View in Channels
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Account ─────────────────────────────────────────────────────────────

function AccountTab({ data, account }: { data: typeof accountDetail.SBI; account: typeof accounts[0] }) {
  const ticketPriorityCfg: Record<string, { cls: string }> = {
    urgent: { cls: 'bg-red-100 text-red-600 border-red-200' },
    high:   { cls: 'bg-orange-100 text-orange-600 border-orange-200' },
    medium: { cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    low:    { cls: 'bg-gray-100 text-gray-500 border-gray-200' },
  };

  const usageChannels = [
    { label: 'SMS',      used: data.contractedSMS ? (data.usedSMS / data.contractedSMS) * 100 : 0,      contracted: data.contractedSMS,  used_n: data.usedSMS },
    { label: 'WhatsApp', used: data.contractedWA  ? (data.usedWA  / data.contractedWA)  * 100 : 0,      contracted: data.contractedWA,   used_n: data.usedWA  },
    { label: 'RCS',      used: data.contractedRCS ? (data.usedRCS / data.contractedRCS) * 100 : 0,      contracted: data.contractedRCS,  used_n: data.usedRCS },
  ];

  return (
    <div className="space-y-5">
      {/* Account info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Account Details</p>
          <div className="space-y-3">
            {[
              { label: 'Account',        value: account.name },
              { label: 'Tier',           value: account.tier },
              { label: 'Contract start', value: data.contractStart },
              { label: 'Contract end',   value: data.contractEnd },
              { label: 'Open tickets',   value: `${data.openTickets} (${data.slaBreaches} SLA breach)` },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium text-foreground">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Your Account Manager</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[16px]">
              PM
            </div>
            <div>
              <p className="font-semibold text-foreground">{data.csm}</p>
              <p className="text-[12px] text-muted-foreground">Customer Success Manager</p>
            </div>
          </div>
          <div className="space-y-2 text-[13px]">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-3.5 h-3.5" />{data.csmEmail}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-3.5 h-3.5" />{data.csmPhone}
            </p>
          </div>
          <Button size="sm" className="mt-4 w-full bg-primary hover:bg-primary/90 text-white text-[12px] gap-1.5">
            <Headphones className="w-3.5 h-3.5" />Contact CSM
          </Button>
        </div>
      </div>

      {/* Usage vs contracted */}
      <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
        <p className="text-[14px] font-semibold text-foreground mb-4">Usage vs Contracted Volume — May 2026</p>
        <div className="space-y-4">
          {usageChannels.map(u => (
            <div key={u.label}>
              <div className="flex items-center justify-between text-[12px] mb-1.5">
                <span className="font-medium text-foreground">{u.label}</span>
                <span className="text-muted-foreground">
                  {(u.used_n / 1000000).toFixed(2)}M / {(u.contracted / 1000000).toFixed(0)}M
                  <span className={cn('ml-2 font-semibold', u.used >= 90 ? 'text-red-500' : u.used >= 75 ? 'text-amber-600' : 'text-emerald-600')}>
                    {u.used.toFixed(0)}%
                  </span>
                </span>
              </div>
              <div className="w-full bg-muted/40 rounded-full h-2">
                <div
                  className={cn('h-2 rounded-full transition-all', u.used >= 90 ? 'bg-red-500' : u.used >= 75 ? 'bg-amber-500' : 'bg-emerald-500')}
                  style={{ width: `${Math.min(u.used, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Open tickets */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-[14px] font-semibold text-foreground">Open Support Tickets</p>
          <Button variant="outline" size="sm" className="text-[12px] gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" />View all in portal
          </Button>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {['Ticket','Subject','Priority','Age','SLA'].map(h => (
                <th key={h} className="py-2.5 px-5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.tickets.map((t, i) => {
              const pc = ticketPriorityCfg[t.priority];
              return (
                <tr key={t.id} className={cn('border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer', i % 2 === 0 ? 'bg-white' : 'bg-muted/5')}>
                  <td className="py-3 px-5 font-mono text-[12px] text-muted-foreground">{t.id}</td>
                  <td className="py-3 px-5 font-medium text-foreground max-w-[320px] truncate">{t.title}</td>
                  <td className="py-3 px-5"><Badge className={cn('border text-[10px] capitalize', pc.cls)}>{t.priority}</Badge></td>
                  <td className="py-3 px-5 text-muted-foreground">{t.age}</td>
                  <td className="py-3 px-5">
                    {t.sla === 'breach'
                      ? <span className="flex items-center gap-1 text-red-600 text-[12px] font-semibold"><XCircle className="w-3.5 h-3.5" />Breached</span>
                      : <span className="flex items-center gap-1 text-emerald-600 text-[12px]"><CheckCircle2 className="w-3.5 h-3.5" />On track</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',      label: 'Overview',      icon: HeartPulse },
  { id: 'delivery',      label: 'Delivery',       icon: Activity   },
  { id: 'compliance',    label: 'Compliance',     icon: Shield     },
  { id: 'integrations',  label: 'Integrations',   icon: Plug2      },
  { id: 'account',       label: 'Account',        icon: Building2  },
];

const AccountHealth = () => {
  const [tab, setTab]               = useState<Tab>('overview');
  const [selectedId, setSelectedId] = useState('SBI');

  const account = accounts.find(a => a.id === selectedId)!;
  const data    = accountDetail[selectedId as keyof typeof accountDetail];

  const overallLevel: HealthLevel = account.score >= 85 ? 'healthy' : account.score >= 70 ? 'warning' : 'critical';
  const hc = healthCfg[overallLevel];

  return (
    <AppLayout>
      <div className="p-6 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-heading-xl font-bold text-foreground font-heading">Account Health</h1>
            <p className="text-body-sm text-muted-foreground mt-0.5">
              Enterprise customer health — delivery, compliance, integrations, support
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Account selector */}
            <div className="relative">
              <select
                value={selectedId}
                onChange={e => { setSelectedId(e.target.value); setTab('overview'); }}
                className="appearance-none pl-3 pr-8 py-2 text-[13px] font-medium border border-border rounded-brand-md bg-white text-foreground cursor-pointer hover:bg-muted/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
            <Badge className={cn('border text-[11px] px-2.5 py-1', hc.bg, hc.color, hc.border)}>
              <hc.icon className="w-3 h-3 mr-1" />Score: {account.score}
            </Badge>
            <Button variant="outline" size="sm" className="text-[12px] gap-1.5">
              <Download className="w-3.5 h-3.5" />Health report
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

        {/* Content */}
        {tab === 'overview'     && <OverviewTab     data={data} />}
        {tab === 'delivery'     && <DeliveryTab     data={data} />}
        {tab === 'compliance'   && <ComplianceTab   data={data} />}
        {tab === 'integrations' && <IntegrationsTab data={data} />}
        {tab === 'account'      && <AccountTab      data={data} account={account} />}
      </div>
    </AppLayout>
  );
};

export default AccountHealth;

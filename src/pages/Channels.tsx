import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  MessageSquare, MessageCircle, Radio, Phone, Mail,
  Plus, MoreHorizontal, CheckCircle2, AlertTriangle, XCircle,
  Clock, RefreshCw, Shield, Zap, Link, Settings,
  ChevronDown, ToggleLeft, ToggleRight, Info, ArrowRight,
  Wifi, WifiOff, Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Channel = 'SMS' | 'WhatsApp' | 'RCS' | 'Voice' | 'Email';
type QualityRating = 'HIGH' | 'MEDIUM' | 'LOW';
type WaNumStatus  = 'CONNECTED' | 'FLAGGED' | 'PAUSED';
type SenderStatus = 'Active' | 'Pending' | 'Rejected';
type RoutingStrategy = 'ROUND_ROBIN' | 'SENDER_AFFINITY' | 'FALLBACK_CASCADE';

/* ─── Mock data — WhatsApp ──────────────────────────────────────────────── */

const waNumbers = [
  {
    id: 'WN-001',
    number: '+91 22 4890 0001',
    displayName: 'Onextel Business',
    wabaId: 'WABA-118765432',
    provider: 'Infobip',
    status: 'CONNECTED' as WaNumStatus,
    quality: 'HIGH' as QualityRating,
    dailyLimit: 100000,
    messagesToday: 42318,
    connectedOn: '12 Jan 2026',
  },
  {
    id: 'WN-002',
    number: '+91 22 4890 0002',
    displayName: 'Onextel Alerts',
    wabaId: 'WABA-118765433',
    provider: 'Gupshup',
    status: 'FLAGGED' as WaNumStatus,
    quality: 'MEDIUM' as QualityRating,
    dailyLimit: 1000,
    messagesToday: 874,
    connectedOn: '28 Feb 2026',
  },
  {
    id: 'WN-003',
    number: '+91 22 4890 0003',
    displayName: 'Onextel OTP',
    wabaId: 'WABA-118765434',
    provider: 'Kaleyra',
    status: 'CONNECTED' as WaNumStatus,
    quality: 'HIGH' as QualityRating,
    dailyLimit: 250000,
    messagesToday: 118423,
    connectedOn: '03 Mar 2026',
  },
];

const waPools = [
  {
    id: 'POOL-001',
    name: 'Marketing Pool',
    strategy: 'ROUND_ROBIN' as RoutingStrategy,
    numbers: ['WN-001', 'WN-002'],
    messagesToday: 43192,
    isDefault: false,
  },
  {
    id: 'POOL-002',
    name: 'Transactional Pool',
    strategy: 'SENDER_AFFINITY' as RoutingStrategy,
    numbers: ['WN-003'],
    messagesToday: 118423,
    isDefault: true,
  },
];

/* ─── Mock data — SMS ───────────────────────────────────────────────────── */

const smsSenders = [
  { id: 'SBISMS',  type: 'Transactional', peId: '1101156789012345', registered: '14 Jan 2023', status: 'Active' as SenderStatus,  routes: ['Airtel', 'Jio', 'Vi', 'BSNL'] },
  { id: 'CREDMS',  type: 'Transactional', peId: '1101156789012345', registered: '14 Jan 2023', status: 'Active' as SenderStatus,  routes: ['Airtel', 'Jio'] },
  { id: 'HEROMS',  type: 'Transactional', peId: '1101156789012346', registered: '02 Mar 2023', status: 'Active' as SenderStatus,  routes: ['Airtel', 'Vi'] },
  { id: 'KPNTXT',  type: 'Promotional',   peId: '1101156789012347', registered: '19 Jun 2023', status: 'Active' as SenderStatus,  routes: ['Airtel', 'Jio', 'Vi'] },
  { id: 'CRISIN',  type: 'Transactional', peId: '1101156789012348', registered: '07 Sep 2023', status: 'Pending' as SenderStatus, routes: [] },
];

const smsProviders = ['Infobip', 'Gupshup', 'Kaleyra', 'Tanla', 'Route Mobile'];

const operatorRouting = [
  { operator: 'Airtel', primary: 'Infobip',      fallback: 'Gupshup',       tps: 500,  status: 'ok' },
  { operator: 'Jio',    primary: 'Gupshup',       fallback: 'Tanla',         tps: 400,  status: 'ok' },
  { operator: 'Vi',     primary: 'Kaleyra',        fallback: 'Infobip',       tps: 300,  status: 'warn' },
  { operator: 'BSNL',   primary: 'Route Mobile',   fallback: 'Infobip',       tps: 100,  status: 'ok' },
  { operator: 'Others', primary: 'Infobip',        fallback: 'Route Mobile',  tps: 200,  status: 'ok' },
];

/* ─── Mock data — RCS ───────────────────────────────────────────────────── */

const rcsAgents = [
  {
    id: 'RCS-001',
    name: 'OXAgent_JioRBM',
    brandName: 'Onextel',
    botId: 'onextel_jio_rbm_v1',
    provider: 'Jio RBM',
    status: 'Verified' as const,
    features: ['Rich Cards', 'Carousel', 'Suggested Replies', 'URL Actions'],
    dailyLimit: 500000,
    messagesToday: 89234,
  },
  {
    id: 'RCS-002',
    name: 'OXAgent_VIRCS',
    brandName: 'Onextel',
    botId: 'onextel_vi_rcs_v1',
    provider: 'Vi RCS',
    status: 'Verified' as const,
    features: ['Rich Cards', 'Suggested Replies'],
    dailyLimit: 200000,
    messagesToday: 12847,
  },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const qualityConfig: Record<QualityRating, { label: string; chip: string; dot: string }> = {
  HIGH:   { label: 'High',   chip: 'bg-success/10 text-success',        dot: 'bg-success' },
  MEDIUM: { label: 'Medium', chip: 'bg-warning/10 text-warning',        dot: 'bg-warning' },
  LOW:    { label: 'Low',    chip: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
};

const statusConfig: Record<WaNumStatus, { label: string; chip: string; icon: React.ElementType }> = {
  CONNECTED: { label: 'Connected', chip: 'bg-success/10 text-success',        icon: CheckCircle2 },
  FLAGGED:   { label: 'Flagged',   chip: 'bg-warning/10 text-warning',        icon: AlertTriangle },
  PAUSED:    { label: 'Paused',    chip: 'bg-muted text-muted-foreground',     icon: Clock },
};

const strategyConfig: Record<RoutingStrategy, { label: string; desc: string; color: string }> = {
  ROUND_ROBIN:       { label: 'Round Robin',       desc: 'Distribute evenly across all numbers',   color: 'bg-blue-100 text-blue-700' },
  SENDER_AFFINITY:   { label: 'Sender Affinity',   desc: 'Same user always gets same number',      color: 'bg-purple-100 text-purple-700' },
  FALLBACK_CASCADE:  { label: 'Fallback Cascade',  desc: 'Try numbers in order on failure',        color: 'bg-amber-100 text-amber-700' },
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0',
        checked ? 'bg-primary' : 'bg-muted-foreground/30',
      )}
    >
      <span className={cn(
        'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
        checked ? 'translate-x-4' : 'translate-x-0.5',
      )} />
    </button>
  );
}

function SectionCard({ title, subtitle, badge, action, children }: {
  title: string; subtitle?: string; badge?: React.ReactNode;
  action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-brand-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
              {badge}
            </div>
            {subtitle && <p className="text-[12px] text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function NewBadge() {
  return (
    <span className="text-[9px] font-bold uppercase tracking-wide bg-primary text-white px-1.5 py-0.5 rounded-brand-xs">
      New
    </span>
  );
}

function GapBadge({ jira }: { jira: string }) {
  return (
    <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-brand-xs">
      {jira}
    </span>
  );
}

/* ─── WhatsApp view ─────────────────────────────────────────────────────── */

function WhatsAppView() {
  const [freqCapEnabled, setFreqCapEnabled] = useState(true);
  const [timeWindowEnabled, setTimeWindowEnabled] = useState(false);
  const [urlShortenerEnabled, setUrlShortenerEnabled] = useState(true);
  const [smsFallbackEnabled, setSmsFallbackEnabled] = useState(false);

  return (
    <div className="space-y-5">
      {/* Flagged number warning */}
      <div className="flex items-center gap-3 bg-warning/8 border border-warning/30 rounded-brand-xl px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
        <p className="text-[13px] text-foreground flex-1">
          <span className="font-semibold">+91 22 4890 0002 is flagged</span> — Meta has downgraded the quality rating.
          High block rates detected. Reduce marketing volume on this number.
        </p>
        <button className="text-[12px] font-semibold text-warning whitespace-nowrap">View details →</button>
      </div>

      {/* Connected numbers */}
      <SectionCard
        title="Connected numbers"
        subtitle={`${waNumbers.length} WABA numbers connected across ${[...new Set(waNumbers.map(n => n.provider))].length} providers`}
        action={
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-[12px] font-semibold rounded-brand-md hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Connect number
          </button>
        }
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Phone number', 'Display name', 'WABA ID', 'Provider', 'Quality', 'Daily limit', 'Today', 'Status', ''].map(h => (
                <th key={h} className="pb-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {waNumbers.map(num => {
              const q = qualityConfig[num.quality];
              const s = statusConfig[num.status];
              const SIcon = s.icon;
              const pct = Math.round((num.messagesToday / num.dailyLimit) * 100);
              return (
                <tr key={num.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="py-3 pr-4">
                    <span className="text-[13px] font-mono font-medium text-foreground">{num.number}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-[13px] text-foreground">{num.displayName}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-[11px] font-mono text-muted-foreground">{num.wabaId}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-[12px] text-foreground">{num.provider}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-brand-full', q.chip)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', q.dot)} />
                      {q.label}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-[12px] text-foreground">{num.dailyLimit.toLocaleString()}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="space-y-1 min-w-[80px]">
                      <span className="text-[12px] text-foreground">{num.messagesToday.toLocaleString()}</span>
                      <div className="w-full bg-muted rounded-full h-1">
                        <div
                          className={cn('h-1 rounded-full', pct > 80 ? 'bg-warning' : 'bg-success')}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-brand-full', s.chip)}>
                      <SIcon className="w-2.5 h-2.5" />
                      {s.label}
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SectionCard>

      {/* Number pools */}
      <SectionCard
        title="Number pools"
        subtitle="Group numbers for intelligent routing — round-robin, sender affinity, or fallback cascade"
        badge={<><NewBadge /><GapBadge jira="AURA-13575" /></>}
        action={
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-[12px] font-semibold rounded-brand-md hover:bg-muted transition-colors text-foreground">
            <Plus className="w-3.5 h-3.5" />
            Create pool
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          {waPools.map(pool => {
            const strategy = strategyConfig[pool.strategy];
            const poolNumbers = waNumbers.filter(n => pool.numbers.includes(n.id));
            return (
              <div key={pool.id} className="border border-border rounded-brand-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-semibold text-foreground">{pool.name}</p>
                      {pool.isDefault && (
                        <span className="text-[9px] font-bold bg-success/10 text-success px-1.5 py-0.5 rounded-brand-xs">Default</span>
                      )}
                    </div>
                    <span className={cn('inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-brand-xs mt-1', strategy.color)}>
                      {strategy.label}
                    </span>
                  </div>
                  <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted">
                    <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">{strategy.desc}</p>
                <div className="space-y-1.5">
                  {poolNumbers.map(n => (
                    <div key={n.id} className="flex items-center justify-between bg-muted/30 rounded-brand-md px-3 py-1.5">
                      <span className="text-[11px] font-mono text-foreground">{n.number}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={cn('w-1.5 h-1.5 rounded-full', qualityConfig[n.quality].dot)} />
                        <span className="text-[10px] text-muted-foreground">{n.provider}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className="text-[11px] text-muted-foreground">Today</span>
                  <span className="text-[12px] font-semibold text-foreground">{pool.messagesToday.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Advanced config */}
      <SectionCard title="Advanced configuration" subtitle="Compliance, delivery controls, and integrations">
        <div className="space-y-0 divide-y divide-border">

          {/* Frequency capping */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex-1 pr-8">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold text-foreground">Frequency capping</p>
              </div>
              <p className="text-[12px] text-muted-foreground mt-0.5">Limit how many Marketing messages a user can receive</p>
              {freqCapEnabled && (
                <div className="flex items-center gap-2 mt-2">
                  <select className="text-[12px] border border-border rounded-brand-md px-2 py-1 bg-background appearance-none">
                    {[1,2,3,5,7,10].map(n => <option key={n} value={n}>{n} messages</option>)}
                  </select>
                  <span className="text-[12px] text-muted-foreground">per</span>
                  <select className="text-[12px] border border-border rounded-brand-md px-2 py-1 bg-background appearance-none">
                    {['7 days', '14 days', '30 days'].map(d => <option key={d}>{d}</option>)}
                  </select>
                  <span className="text-[11px] text-muted-foreground">per recipient</span>
                </div>
              )}
            </div>
            <Toggle checked={freqCapEnabled} onChange={setFreqCapEnabled} />
          </div>

          {/* Time window */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex-1 pr-8">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold text-foreground">Delivery time window</p>
                <NewBadge />
                <GapBadge jira="AURA-8806" />
              </div>
              <p className="text-[12px] text-muted-foreground mt-0.5">Only send messages within allowed hours. Queued messages wait for the next window.</p>
              {timeWindowEnabled && (
                <div className="flex items-center gap-2 mt-2">
                  <select className="text-[12px] border border-border rounded-brand-md px-2 py-1 bg-background appearance-none">
                    {['08:00', '09:00', '10:00'].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <span className="text-[12px] text-muted-foreground">to</span>
                  <select className="text-[12px] border border-border rounded-brand-md px-2 py-1 bg-background appearance-none">
                    {['20:00', '21:00', '22:00'].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <select className="text-[12px] border border-border rounded-brand-md px-2 py-1 bg-background appearance-none">
                    <option>Asia/Kolkata</option>
                  </select>
                </div>
              )}
            </div>
            <Toggle checked={timeWindowEnabled} onChange={setTimeWindowEnabled} />
          </div>

          {/* URL shortener */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex-1 pr-8">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold text-foreground">URL shortener & click tracking</p>
                <NewBadge />
                <GapBadge jira="AURA-3841" />
              </div>
              <p className="text-[12px] text-muted-foreground mt-0.5">Shorten links in templates and track click-through rates per campaign</p>
              {urlShortenerEnabled && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[12px] text-muted-foreground">Domain:</span>
                  <code className="text-[11px] bg-muted px-2 py-0.5 rounded font-mono text-foreground">lnk.onextel.in</code>
                  <button className="text-[11px] text-primary hover:underline">Change</button>
                </div>
              )}
            </div>
            <Toggle checked={urlShortenerEnabled} onChange={setUrlShortenerEnabled} />
          </div>

          {/* SMS fallback */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex-1 pr-8">
              <p className="text-[13px] font-semibold text-foreground">SMS fallback</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">Automatically retry undelivered WhatsApp messages via SMS after 24 hours</p>
            </div>
            <Toggle checked={smsFallbackEnabled} onChange={setSmsFallbackEnabled} />
          </div>

          {/* OBO Config */}
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-foreground">On-Behalf-Of (OBO) configuration</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">Allow resellers to send from customer WABA accounts via your BSP partnership</p>
              </div>
              <button className="text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors">Configure →</button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[
                { label: 'BSP Partner ID',     value: 'BSP-INFOBIP-001' },
                { label: 'Partnership status', value: 'Active' },
                { label: 'OBO accounts',       value: '7 connected' },
              ].map(item => (
                <div key={item.label} className="bg-muted/30 rounded-brand-md px-3 py-2.5">
                  <p className="text-[11px] text-muted-foreground">{item.label}</p>
                  <p className="text-[12px] font-semibold text-foreground mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── SMS view ──────────────────────────────────────────────────────────── */

function SmsView() {
  return (
    <div className="space-y-5">

      {/* Sender IDs */}
      <SectionCard
        title="Sender IDs"
        subtitle="DLT-registered Sender IDs mapped to your PE registration"
        action={
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-[12px] font-semibold rounded-brand-md hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Register Sender ID
          </button>
        }
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Sender ID', 'Type', 'DLT PE ID', 'Registered', 'Operator routes', 'Status', ''].map(h => (
                <th key={h} className="pb-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {smsSenders.map(s => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="py-3 pr-4">
                  <code className="text-[13px] font-mono font-bold text-foreground">{s.id}</code>
                </td>
                <td className="py-3 pr-4">
                  <span className={cn(
                    'text-[10px] font-semibold px-1.5 py-0.5 rounded-brand-xs',
                    s.type === 'Transactional' ? 'bg-info/10 text-info' : 'bg-primary/10 text-primary',
                  )}>
                    {s.type}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <code className="text-[11px] font-mono text-muted-foreground">{s.peId}</code>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-[12px] text-muted-foreground">{s.registered}</span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex gap-1 flex-wrap">
                    {s.routes.length > 0
                      ? s.routes.map(r => (
                          <span key={r} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-brand-xs font-medium">{r}</span>
                        ))
                      : <span className="text-[11px] text-muted-foreground">—</span>
                    }
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className={cn(
                    'inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-brand-full',
                    s.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning',
                  )}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', s.status === 'Active' ? 'bg-success' : 'bg-warning')} />
                    {s.status}
                  </span>
                </td>
                <td className="py-3">
                  <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors">
                    <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {/* Provider routing */}
      <SectionCard
        title="Operator routing"
        subtitle="Configure primary and fallback providers per telecom operator"
      >
        {/* PROD issue callout */}
        <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-brand-md px-3 py-2.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <p className="text-[12px] text-amber-800">
            <span className="font-semibold">Vi route degraded</span> — Kaleyra Vi throughput at 60% since 19 May. PROD-345 open. Fallback to Infobip active.
          </p>
          <a href="#" className="text-[12px] font-semibold text-amber-700 whitespace-nowrap ml-auto">PROD-345 →</a>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Operator', 'Primary provider', 'Fallback provider', 'TPS limit', 'Status'].map(h => (
                <th key={h} className="pb-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {operatorRouting.map(row => (
              <tr key={row.operator} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="py-3 pr-4">
                  <span className="text-[13px] font-semibold text-foreground">{row.operator}</span>
                </td>
                <td className="py-3 pr-4">
                  <select
                    defaultValue={row.primary}
                    className="text-[12px] border border-border rounded-brand-md px-2.5 py-1.5 bg-background appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
                  >
                    {smsProviders.map(p => <option key={p}>{p}</option>)}
                  </select>
                </td>
                <td className="py-3 pr-4">
                  <select
                    defaultValue={row.fallback}
                    className="text-[12px] border border-border rounded-brand-md px-2.5 py-1.5 bg-background appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
                  >
                    {smsProviders.map(p => <option key={p}>{p}</option>)}
                  </select>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-mono text-foreground">{row.tps}</span>
                    <span className="text-[11px] text-muted-foreground">msg/s</span>
                  </div>
                </td>
                <td className="py-3">
                  {row.status === 'ok' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success bg-success/10 px-1.5 py-0.5 rounded-brand-full">
                      <Wifi className="w-2.5 h-2.5" /> Healthy
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-warning bg-warning/10 px-1.5 py-0.5 rounded-brand-full">
                      <WifiOff className="w-2.5 h-2.5" /> Degraded
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex items-center justify-end">
          <button className="px-4 py-2 bg-primary text-white text-[12px] font-semibold rounded-brand-md hover:bg-primary/90 transition-colors">
            Save routing changes
          </button>
        </div>
      </SectionCard>

      {/* DLT registration */}
      <SectionCard title="DLT PE registration" subtitle="Your TRAI-registered Principal Entity details">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Entity name',      value: 'Onextel Limited' },
            { label: 'PE ID',            value: '1101156789012345' },
            { label: 'Registered with',  value: 'Jio, Airtel, Vi, BSNL' },
            { label: 'Status',           value: 'Active' },
          ].map(item => (
            <div key={item.label} className="bg-muted/30 rounded-brand-md px-4 py-3">
              <p className="text-[11px] text-muted-foreground">{item.label}</p>
              <p className="text-[13px] font-semibold text-foreground mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── RCS view ──────────────────────────────────────────────────────────── */

function RcsView() {
  const [carouselEnabled, setCarouselEnabled] = useState(true);
  const [suggestedReplies, setSuggestedReplies] = useState(true);
  const [autoApproveJio, setAutoApproveJio] = useState(false);
  const [smsFallback, setSmsFallback] = useState(true);

  return (
    <div className="space-y-5">

      {/* Registered agents */}
      <SectionCard
        title="RCS agents"
        subtitle="Verified sender profiles for Jio RBM and Vi RCS"
        action={
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-[12px] font-semibold rounded-brand-md hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Register agent
          </button>
        }
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Agent name', 'Brand', 'Bot ID', 'Provider', 'Features', 'Daily limit', 'Today', 'Status', ''].map(h => (
                <th key={h} className="pb-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rcsAgents.map(agent => (
              <tr key={agent.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="py-3 pr-4">
                  <code className="text-[12px] font-mono font-semibold text-foreground">{agent.name}</code>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-[12px] text-foreground">{agent.brandName}</span>
                </td>
                <td className="py-3 pr-4">
                  <code className="text-[11px] font-mono text-muted-foreground">{agent.botId}</code>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-[12px] text-foreground">{agent.provider}</span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex gap-1 flex-wrap">
                    {agent.features.slice(0, 2).map(f => (
                      <span key={f} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-brand-xs">{f}</span>
                    ))}
                    {agent.features.length > 2 && (
                      <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-brand-xs">+{agent.features.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-[12px] text-foreground">{agent.dailyLimit.toLocaleString()}</span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-[12px] text-foreground">{agent.messagesToday.toLocaleString()}</span>
                </td>
                <td className="py-3 pr-4">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success bg-success/10 px-1.5 py-0.5 rounded-brand-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    {agent.status}
                  </span>
                </td>
                <td className="py-3">
                  <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors">
                    <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {/* Sender pool — GAP ITEM */}
      <SectionCard
        title="Sender profile pool"
        subtitle="Distribute RCS traffic across multiple agents for scale and redundancy"
        badge={<><NewBadge /><GapBadge jira="AURA-15295" /></>}
      >
        <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-border rounded-brand-xl">
          <Layers className="w-8 h-8 text-muted-foreground mb-3 opacity-40" />
          <p className="text-[13px] font-semibold text-foreground">No pools configured</p>
          <p className="text-[12px] text-muted-foreground mt-1 max-w-[360px]">
            Create a sender pool to enable round-robin distribution, sender consistency per user, and automatic failover between Jio RBM and Vi RCS agents.
          </p>
          <button className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-[12px] font-semibold rounded-brand-md hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Create sender pool
          </button>
        </div>
      </SectionCard>

      {/* Feature toggles */}
      <SectionCard title="Features & fallback" subtitle="Per-agent capability configuration and SMS fallback">
        <div className="space-y-0 divide-y divide-border">
          {[
            { label: 'Carousel templates', desc: 'Multi-card rich messages with horizontal scroll', value: carouselEnabled,     set: setCarouselEnabled },
            { label: 'Suggested replies',  desc: 'Quick reply chips below messages',               value: suggestedReplies,    set: setSuggestedReplies },
            { label: 'Auto-approve (Jio)', desc: 'Automatically approve Jio RBM templates on upload', value: autoApproveJio, set: setAutoApproveJio, badge: <GapBadge jira="AURA-11077" /> },
            { label: 'SMS fallback',       desc: 'Send via SMS when RCS is undeliverable (device not RCS-capable)', value: smsFallback, set: setSmsFallback },
          ].map(item => (
            <div key={item.label} className="py-4 flex items-center justify-between">
              <div className="flex-1 pr-8">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-foreground">{item.label}</p>
                  {item.badge}
                </div>
                <p className="text-[12px] text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Toggle checked={item.value} onChange={item.set} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── Phase 2 placeholder ────────────────────────────────────────────────── */

function Phase2({ channel }: { channel: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="w-12 h-12 bg-muted rounded-brand-xl flex items-center justify-center mb-4">
        <Clock className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-[15px] font-semibold text-foreground">{channel} channel</p>
      <p className="text-[13px] text-muted-foreground mt-1 max-w-[320px]">
        {channel === 'Voice'
          ? 'IVR, click-to-call, and outbound dialler configuration coming in Phase 2.'
          : 'SMTP/ESP integration, domain authentication, and sending domain config coming in Phase 2.'}
      </p>
      <span className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground bg-muted px-2.5 py-1 rounded-brand-full">
        Phase 2
      </span>
    </div>
  );
}

/* ─── Left nav config ────────────────────────────────────────────────────── */

const channelNav: {
  id: Channel; label: string; icon: React.ElementType;
  phase2?: boolean; status?: 'live' | 'warn';
}[] = [
  { id: 'SMS',       label: 'SMS',       icon: MessageSquare, status: 'warn' },
  { id: 'WhatsApp',  label: 'WhatsApp',  icon: MessageCircle, status: 'warn' },
  { id: 'RCS',       label: 'RCS',       icon: Radio },
  { id: 'Voice',     label: 'Voice',     icon: Phone,         phase2: true },
  { id: 'Email',     label: 'Email',     icon: Mail,          phase2: true },
];

/* ─── Main page ──────────────────────────────────────────────────────────── */

const Channels = () => {
  const [activeChannel, setActiveChannel] = useState<Channel>('WhatsApp');

  const renderContent = () => {
    if (activeChannel === 'WhatsApp') return <WhatsAppView />;
    if (activeChannel === 'SMS')      return <SmsView />;
    if (activeChannel === 'RCS')      return <RcsView />;
    return <Phase2 channel={activeChannel} />;
  };

  const subTitle: Record<Channel, string> = {
    WhatsApp: 'WABA numbers, number pools, routing & compliance',
    SMS:      'Sender IDs, operator routing & DLT registration',
    RCS:      'Sender profiles, agent config & SMS fallback',
    Voice:    'IVR, click-to-call & outbound dialler',
    Email:    'SMTP/ESP integration & domain authentication',
  };

  return (
    <AppLayout>
      <div className="flex h-full">

        {/* ── Left sub-nav ──────────────────────────────────────── */}
        <aside className="w-[200px] flex-shrink-0 border-r border-border bg-muted/20 flex flex-col py-4">
          <p className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Messaging</p>

          {channelNav.filter(c => !c.phase2 && c.id !== 'Email' && c.id !== 'Voice').map(ch => {
            const Icon = ch.icon;
            const isActive = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={cn(
                  'flex items-center justify-between px-4 py-2.5 text-[13px] font-medium transition-colors mx-2 rounded-brand-md',
                  isActive
                    ? 'bg-background text-foreground shadow-el-1 border border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/60',
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', isActive ? 'text-primary' : 'text-current')} />
                  {ch.label}
                </div>
                {ch.status === 'warn' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0" title="Attention needed" />
                )}
              </button>
            );
          })}

          <div className="my-3 mx-4 border-t border-border" />
          <p className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Coming Soon</p>

          {channelNav.filter(c => c.phase2).map(ch => {
            const Icon = ch.icon;
            return (
              <button
                key={ch.id}
                disabled
                className="flex items-center justify-between px-4 py-2.5 text-[13px] font-medium mx-2 rounded-brand-md text-muted-foreground/50 cursor-not-allowed"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {ch.label}
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-wide bg-muted px-1 py-0.5 rounded-brand-xs">P2</span>
              </button>
            );
          })}
        </aside>

        {/* ── Main content area ──────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card flex-shrink-0">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                {activeChannel}
              </h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">{subTitle[activeChannel]}</p>
            </div>
            {activeChannel === 'WhatsApp' && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-[12px] font-semibold rounded-brand-md hover:bg-muted transition-colors text-foreground">
                <RefreshCw className="w-3.5 h-3.5" />
                Sync from Meta
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto px-6 py-5">
            {renderContent()}
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default Channels;

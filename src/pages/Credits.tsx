import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { WhatsAppIcon, RCSIcon, SMSIcon, EmailIcon, VoiceIcon } from '@/components/icons/ChannelIcons';
import {
  Wallet, Receipt, Gift, Bell,
  TrendingUp, TrendingDown,
  Download, ChevronRight, Info,
  CheckCircle2, AlertTriangle, Clock,
  ArrowUpRight, ArrowDownRight,
  Building2,
  IndianRupee,
  FileText,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'balance' | 'invoices' | 'credits' | 'alerts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const billingMode = 'postpaid'; // Set by Onextel — not customer-editable

const currentCycle = {
  start: '1 May 2026',
  end:   '31 May 2026',
  daysLeft: 8,
  creditBalance: 12480,       // promotional credits (₹)
  estimatedBill: 284320,      // current cycle estimated (₹)
  lastBill: 261450,
  creditLimit: 500000,
  usedPct: 56.9,
};

const channelUsage = [
  { channel: 'SMS',      icon: SMSIcon,      color: 'text-indigo-400',  bg: 'bg-indigo-50',  border: 'border-indigo-100',
    msgs: 2840000, rate: '₹0.12', spend: 340800, creditsUsed: 8200 },
  { channel: 'WhatsApp', icon: WhatsAppIcon, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100',
    msgs:  481000, rate: '₹0.48', spend: 231000, creditsUsed: 3100 },
  { channel: 'RCS',      icon: RCSIcon,      color: 'text-blue-400',    bg: 'bg-blue-50',    border: 'border-blue-100',
    msgs:   97000, rate: '₹0.34', spend:  32980, creditsUsed: 1180 },
  { channel: 'Email',    icon: EmailIcon,    color: 'text-sky-400',     bg: 'bg-sky-50',     border: 'border-sky-100',
    msgs:  142000, rate: '₹0.04', spend:   5680, creditsUsed:    0 },
  { channel: 'Voice',    icon: VoiceIcon,    color: 'text-violet-400',  bg: 'bg-violet-50',  border: 'border-violet-100',
    msgs:    8400, rate: '₹1.20', spend:  10080, creditsUsed:    0 },
];

const dailySpend = [
  { day: '1 May',  spend: 9100 },
  { day: '3 May',  spend: 8400 },
  { day: '5 May',  spend: 11200 },
  { day: '7 May',  spend: 9800 },
  { day: '9 May',  spend: 12400 },
  { day: '11 May', spend: 10100 },
  { day: '13 May', spend: 8700 },
  { day: '15 May', spend: 11900 },
  { day: '17 May', spend: 13200 },
  { day: '19 May', spend: 9600 },
  { day: '21 May', spend: 10800 },
  { day: '23 May', spend: 12100 },
];

const invoices = [
  { id: 'INV-2026-04', period: 'April 2026',   amount: 261450, status: 'paid',    due: '15 May 2026', paid: '10 May 2026' },
  { id: 'INV-2026-03', period: 'March 2026',   amount: 238800, status: 'paid',    due: '15 Apr 2026', paid: '11 Apr 2026' },
  { id: 'INV-2026-02', period: 'February 2026', amount: 194200, status: 'paid',   due: '15 Mar 2026', paid: '12 Mar 2026' },
  { id: 'INV-2026-01', period: 'January 2026', amount: 211600, status: 'paid',    due: '15 Feb 2026', paid: '9 Feb 2026'  },
  { id: 'INV-2025-12', period: 'December 2025', amount: 248900, status: 'paid',   due: '15 Jan 2026', paid: '13 Jan 2026' },
];

const creditHistory = [
  { date: '1 May 2026',  type: 'promotional', desc: 'Monthly promotional credit top-up',     amount: +5000,  balance: 12480 },
  { date: '23 Apr 2026', type: 'used',        desc: 'Applied to April invoice',               amount: -8200,  balance:  7480 },
  { date: '1 Apr 2026',  type: 'promotional', desc: 'Q2 campaign bonus credits — SBI deal',   amount: +10000, balance: 15680 },
  { date: '15 Mar 2026', type: 'used',        desc: 'Applied to March invoice',               amount: -6400,  balance:  5680 },
  { date: '1 Mar 2026',  type: 'referral',    desc: 'Referral credit — OYO account',          amount: +2000,  balance: 12080 },
  { date: '1 Mar 2026',  type: 'promotional', desc: 'Monthly promotional credit top-up',      amount: +5000,  balance: 10080 },
];

const spendByMonth = [
  { month: 'Dec', spend: 248900 },
  { month: 'Jan', spend: 211600 },
  { month: 'Feb', spend: 194200 },
  { month: 'Mar', spend: 238800 },
  { month: 'Apr', spend: 261450 },
  { month: 'May', spend: 284320 },
];

const alertConfig = [
  { label: '80% of credit limit used',     threshold: 80, enabled: true,  channel: 'Email + SMS' },
  { label: '95% of credit limit used',     threshold: 95, enabled: true,  channel: 'Email + SMS + WhatsApp' },
  { label: 'Daily spend > ₹15,000',        threshold: null, enabled: true,  channel: 'Email' },
  { label: 'Promotional credits < ₹2,000', threshold: null, enabled: false, channel: 'Email' },
  { label: 'Invoice generated',            threshold: null, enabled: true,  channel: 'Email' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN').format(n);
}

function fmtCr(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

const invoiceStatusCfg: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  paid:    { label: 'Paid',    cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  pending: { label: 'Due',     cls: 'bg-amber-100 text-amber-700 border-amber-200',       icon: Clock },
  overdue: { label: 'Overdue', cls: 'bg-red-100 text-red-600 border-red-200',             icon: AlertTriangle },
};

const creditTypeCfg: Record<string, { label: string; cls: string }> = {
  promotional: { label: 'Promo',    cls: 'bg-purple-100 text-purple-700 border-purple-200' },
  referral:    { label: 'Referral', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  used:        { label: 'Applied',  cls: 'bg-gray-100 text-gray-500 border-gray-200' },
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-el-2 p-3 text-[12px]">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground">Spend: <span className="font-bold text-foreground">{fmtCr(payload[0].value)}</span></p>
    </div>
  );
};

// ─── Balance & Usage tab ──────────────────────────────────────────────────────

function BalanceTab() {
  const totalSpend = channelUsage.reduce((s, c) => s + c.spend, 0);

  return (
    <div className="space-y-5">
      {/* Billing mode badge */}
      <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-brand-xl px-4 py-3">
        <Building2 className="w-4 h-4 text-muted-foreground" />
        <span className="text-[13px] text-muted-foreground">
          Billing mode: <strong className="text-foreground capitalize">{billingMode}</strong>
          {' '}— usage is billed at end of each calendar month.
        </span>
        <span className="ml-auto text-[11px] text-muted-foreground italic flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />Set by Onextel
        </span>
      </div>

      {/* Top KPI row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1 col-span-1">
          <p className="text-[11px] text-muted-foreground font-medium mb-2">Promotional Credits</p>
          <div className="flex items-end gap-1">
            <IndianRupee className="w-4 h-4 text-purple-600 mb-1" />
            <p className="text-[28px] font-bold text-foreground font-heading leading-none">{fmt(currentCycle.creditBalance)}</p>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Available balance</p>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-[11px] text-muted-foreground">Applied this cycle</p>
            <p className="text-[14px] font-semibold text-purple-600 mt-0.5">₹{fmt(channelUsage.reduce((s,c) => s + c.creditsUsed, 0))}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1">
          <p className="text-[11px] text-muted-foreground font-medium mb-2">Current Cycle Spend</p>
          <div className="flex items-end gap-1">
            <IndianRupee className="w-4 h-4 text-foreground mb-1" />
            <p className="text-[28px] font-bold text-foreground font-heading leading-none">{fmtCr(currentCycle.estimatedBill).replace('₹','')}</p>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">{currentCycle.daysLeft} days remaining</p>
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-1 text-[11px]">
            <ArrowUpRight className="w-3 h-3 text-amber-500" />
            <span className="text-amber-600 font-semibold">+8.7%</span>
            <span className="text-muted-foreground">vs April</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1">
          <p className="text-[11px] text-muted-foreground font-medium mb-2">Credit Limit</p>
          <div className="flex items-end gap-1">
            <IndianRupee className="w-4 h-4 text-foreground mb-1" />
            <p className="text-[28px] font-bold text-foreground font-heading leading-none">{fmtCr(currentCycle.creditLimit).replace('₹','')}</p>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">{currentCycle.usedPct}% utilised</p>
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className={cn('h-1.5 rounded-full', currentCycle.usedPct > 90 ? 'bg-red-500' : currentCycle.usedPct > 75 ? 'bg-amber-500' : 'bg-emerald-500')}
                style={{ width: `${currentCycle.usedPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1">
          <p className="text-[11px] text-muted-foreground font-medium mb-2">Last Invoice</p>
          <div className="flex items-end gap-1">
            <IndianRupee className="w-4 h-4 text-foreground mb-1" />
            <p className="text-[28px] font-bold text-foreground font-heading leading-none">{fmtCr(currentCycle.lastBill).replace('₹','')}</p>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">April 2026</p>
          <div className="mt-3 pt-3 border-t border-border">
            <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px]">
              <CheckCircle2 className="w-3 h-3 mr-1" />Paid 10 May
            </Badge>
          </div>
        </div>
      </div>

      {/* Channel breakdown */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-[14px] font-semibold text-foreground">May 2026 — Spend by Channel</p>
          <p className="text-[12px] text-muted-foreground mt-0.5">Promotional credits applied where available · net spend = gross − credits</p>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {['Channel','Messages','Rate','Gross Spend','Credits Applied','Net Spend'].map(h => (
                <th key={h} className={cn('py-2.5 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide', h === 'Channel' ? 'text-left' : 'text-right')}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {channelUsage.map((c, i) => {
              const Icon = c.icon;
              const net = c.spend - c.creditsUsed;
              return (
                <tr key={c.channel} className={cn('border-b border-border last:border-0 hover:bg-muted/20 transition-colors', i % 2 === 0 ? 'bg-white' : 'bg-muted/5')}>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', c.bg)}>
                        <Icon className={cn('w-3.5 h-3.5', c.color)} />
                      </div>
                      <span className="font-medium text-foreground">{c.channel}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-right text-muted-foreground">{fmt(c.msgs)}</td>
                  <td className="py-3.5 px-5 text-right text-muted-foreground">{c.rate}</td>
                  <td className="py-3.5 px-5 text-right font-medium">₹{fmt(c.spend)}</td>
                  <td className="py-3.5 px-5 text-right">
                    {c.creditsUsed > 0
                      ? <span className="text-purple-600 font-semibold">−₹{fmt(c.creditsUsed)}</span>
                      : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="py-3.5 px-5 text-right font-semibold text-foreground">₹{fmt(net)}</td>
                </tr>
              );
            })}
            <tr className="bg-muted/30 border-t-2 border-border">
              <td className="py-3 px-5 font-bold text-foreground" colSpan={3}>Total</td>
              <td className="py-3 px-5 text-right font-bold text-foreground">₹{fmt(totalSpend)}</td>
              <td className="py-3 px-5 text-right font-semibold text-purple-600">−₹{fmt(channelUsage.reduce((s,c) => s + c.creditsUsed, 0))}</td>
              <td className="py-3 px-5 text-right font-bold text-foreground">₹{fmt(totalSpend - channelUsage.reduce((s,c) => s + c.creditsUsed, 0))}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Daily spend chart */}
      <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
        <p className="text-[14px] font-semibold text-foreground mb-1">Daily Spend — May 2026</p>
        <p className="text-[12px] text-muted-foreground mb-4">Gross spend across all channels</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={dailySpend} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={2} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => fmtCr(v)} width={48} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="spend" stroke="#6366f1" fill="url(#gSpend)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Invoices tab ─────────────────────────────────────────────────────────────

function InvoicesTab() {
  return (
    <div className="space-y-5">
      {/* Month-over-month trend */}
      <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
        <p className="text-[14px] font-semibold text-foreground mb-1">Monthly Billing Trend</p>
        <p className="text-[12px] text-muted-foreground mb-4">Last 6 months · gross invoice amount</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={spendByMonth} barCategoryGap="40%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => fmtCr(v)} width={52} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="spend" fill="#6366f1" radius={[6,6,0,0]}
              label={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Invoice table */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-[14px] font-semibold text-foreground">Invoice History</p>
          <Button variant="outline" size="sm" className="text-[12px] gap-1.5">
            <Download className="w-3.5 h-3.5" />Download all
          </Button>
        </div>

        {/* Current cycle row (estimate) */}
        <div className="flex items-center justify-between px-5 py-4 bg-indigo-50/50 border-b border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">May 2026 — Current cycle</p>
              <p className="text-[11px] text-muted-foreground">{currentCycle.start} – {currentCycle.end} · {currentCycle.daysLeft} days left</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[16px] font-bold text-foreground">~₹{fmt(currentCycle.estimatedBill)}</p>
            <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px] mt-1">Estimated</Badge>
          </div>
        </div>

        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {['Invoice','Period','Amount','Status','Due Date','Paid On',''].map(h => (
                <th key={h} className={cn('py-2.5 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide', h === 'Amount' ? 'text-right' : 'text-left')}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => {
              const sc = invoiceStatusCfg[inv.status];
              const Icon = sc.icon;
              return (
                <tr key={inv.id} className={cn('border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer', i % 2 === 0 ? 'bg-white' : 'bg-muted/5')}>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{inv.id}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground">{inv.period}</td>
                  <td className="py-3.5 px-5 text-right font-semibold text-foreground">₹{fmt(inv.amount)}</td>
                  <td className="py-3.5 px-5">
                    <Badge className={cn('border text-[10px] gap-1', sc.cls)}>
                      <Icon className="w-3 h-3" />{sc.label}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground">{inv.due}</td>
                  <td className="py-3.5 px-5 text-muted-foreground">{inv.paid ?? '—'}</td>
                  <td className="py-3.5 px-5">
                    <button className="flex items-center gap-1 text-[12px] text-primary hover:underline">
                      <Download className="w-3.5 h-3.5" />PDF
                    </button>
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

// ─── Credits tab ──────────────────────────────────────────────────────────────

function CreditsTab() {
  return (
    <div className="space-y-5">
      {/* Credit wallet card */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-brand-xl p-6 text-white shadow-el-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] font-medium text-purple-200 uppercase tracking-wide">Promotional Credit Wallet</p>
            <p className="text-[40px] font-bold font-heading mt-1 leading-none">₹{fmt(currentCycle.creditBalance)}</p>
            <p className="text-[13px] text-purple-200 mt-1">Available balance · expires 31 Dec 2026</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Used this cycle', val: `₹${fmt(12480)}` },
            { label: 'Total earned',    val: `₹${fmt(22000)}` },
            { label: 'Next top-up',     val: '1 Jun 2026' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-[11px] text-purple-200">{s.label}</p>
              <p className="text-[15px] font-bold mt-0.5">{s.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How credits work */}
      <div className="bg-purple-50 border border-purple-200 rounded-brand-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="text-[13px] text-purple-900 space-y-1">
            <p className="font-semibold">How promotional credits work</p>
            <p className="text-purple-700">Credits are applied automatically at the start of each billing cycle before any chargeable spend. Unused credits carry forward up to 90 days. Credits cannot be redeemed for cash and are non-transferable.</p>
          </div>
        </div>
      </div>

      {/* Credit history */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-[14px] font-semibold text-foreground">Credit History</p>
          <Button variant="outline" size="sm" className="text-[12px] gap-1.5">
            <Download className="w-3.5 h-3.5" />Export
          </Button>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {['Date','Description','Type','Amount','Balance'].map(h => (
                <th key={h} className={cn('py-2.5 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide', ['Amount','Balance'].includes(h) ? 'text-right' : 'text-left')}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {creditHistory.map((e, i) => {
              const tc = creditTypeCfg[e.type];
              return (
                <tr key={i} className={cn('border-b border-border last:border-0', i % 2 === 0 ? 'bg-white' : 'bg-muted/5')}>
                  <td className="py-3 px-5 text-muted-foreground whitespace-nowrap">{e.date}</td>
                  <td className="py-3 px-5 text-foreground">{e.desc}</td>
                  <td className="py-3 px-5">
                    <Badge className={cn('border text-[10px]', tc.cls)}>{tc.label}</Badge>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <span className={cn('font-semibold', e.amount > 0 ? 'text-emerald-600' : 'text-muted-foreground')}>
                      {e.amount > 0 ? `+₹${fmt(e.amount)}` : `−₹${fmt(Math.abs(e.amount))}`}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right font-medium text-foreground">₹{fmt(e.balance)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Request top-up */}
      <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
        <p className="text-[14px] font-semibold text-foreground mb-1">Request Credit Top-up</p>
        <p className="text-[12px] text-muted-foreground mb-4">Submit a request to your Onextel account manager. Top-ups are typically processed within 1 business day.</p>
        <div className="flex gap-3">
          <Input placeholder="Amount (₹)" className="text-[13px] w-40" type="number" />
          <Input placeholder="Reason / campaign reference" className="text-[13px] flex-1" />
          <Button className="bg-primary hover:bg-primary/90 text-white text-[13px]">Send request</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Alerts tab ───────────────────────────────────────────────────────────────

function AlertsTab() {
  const [alerts, setAlerts] = useState(alertConfig);

  const toggle = (i: number) => {
    setAlerts(prev => prev.map((a, idx) => idx === i ? { ...a, enabled: !a.enabled } : a));
  };

  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-[14px] font-semibold text-foreground">Usage Alerts</p>
          <p className="text-[12px] text-muted-foreground mt-0.5">Get notified before you hit limits or overspend</p>
        </div>
        <div className="divide-y divide-border">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', a.enabled ? 'bg-primary/10' : 'bg-muted')}>
                  <Bell className={cn('w-4 h-4', a.enabled ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-foreground">{a.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Notify via: {a.channel}</p>
                </div>
              </div>
              <button
                onClick={() => toggle(i)}
                className={cn(
                  'relative w-10 h-5.5 rounded-full transition-colors duration-200 flex-shrink-0',
                  a.enabled ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
                style={{ height: '22px' }}
              >
                <span
                  className={cn(
                    'absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200',
                    a.enabled ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                  style={{ width: '18px', height: '18px' }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom alert */}
      <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
        <p className="text-[14px] font-semibold text-foreground mb-4">Add Custom Alert</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Condition</label>
            <select className="w-full text-[13px] border border-border rounded-brand-md px-3 py-2 bg-background">
              <option>Daily spend exceeds</option>
              <option>Credit limit % used exceeds</option>
              <option>Promotional credits below</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Value</label>
            <Input placeholder="e.g. 20000" type="number" className="text-[13px]" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Notify via</label>
            <select className="w-full text-[13px] border border-border rounded-brand-md px-3 py-2 bg-background">
              <option>Email</option>
              <option>SMS</option>
              <option>Email + SMS</option>
              <option>Email + SMS + WhatsApp</option>
            </select>
          </div>
        </div>
        <Button className="mt-3 bg-primary hover:bg-primary/90 text-white text-[13px]">Add alert</Button>
      </div>

      {/* Billing contact */}
      <div className="bg-muted/30 border border-border rounded-brand-xl p-4 flex items-center gap-4">
        <Building2 className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <div className="flex-1">
          <p className="text-[13px] font-medium text-foreground">Billing contact</p>
          <p className="text-[12px] text-muted-foreground mt-0.5">finance@yourdomain.com · +91 98765 43210</p>
        </div>
        <Button variant="outline" size="sm" className="text-[12px]">Edit</Button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'balance',  label: 'Balance & Usage', icon: Wallet  },
  { id: 'invoices', label: 'Invoices',         icon: Receipt },
  { id: 'credits',  label: 'Credits',          icon: Gift   },
  { id: 'alerts',   label: 'Usage Alerts',     icon: Bell   },
];

const Credits = () => {
  const [tab, setTab] = useState<Tab>('balance');

  return (
    <AppLayout>
      <div className="w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-heading-xl font-bold text-foreground font-heading">Credits & Wallet</h1>
            <p className="text-body-sm text-muted-foreground mt-0.5">
              Postpaid billing · promotional credit wallet · invoices · spend alerts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-[12px] gap-1.5">
              <Download className="w-3.5 h-3.5" />Download invoice
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-[12px] gap-1.5">
              <Receipt className="w-3.5 h-3.5" />View current bill
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
        {tab === 'balance'  && <BalanceTab />}
        {tab === 'invoices' && <InvoicesTab />}
        {tab === 'credits'  && <CreditsTab />}
        {tab === 'alerts'   && <AlertsTab />}
      </div>
    </AppLayout>
  );
};

export default Credits;

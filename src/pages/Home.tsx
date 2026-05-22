import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Megaphone,
  Users,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Activity,
  MessageSquare,
  Wifi,
  WifiOff,
  ChevronRight,
  Bell,
  RefreshCw,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Mock data ────────────────────────────────────────────────────────────── */

const deliveryData = [
  { day: 'Mon', submitted: 142800, delivered: 136400, failed: 3200, awaited: 3200 },
  { day: 'Tue', submitted: 168500, delivered: 161200, failed: 4100, awaited: 3200 },
  { day: 'Wed', submitted: 155300, delivered: 149800, failed: 2900, awaited: 2600 },
  { day: 'Thu', submitted: 189400, delivered: 180700, failed: 5200, awaited: 3500 },
  { day: 'Fri', submitted: 210600, delivered: 201300, failed: 5800, awaited: 3500 },
  { day: 'Sat', submitted: 98200,  delivered: 94100,  failed: 2400, awaited: 1700 },
  { day: 'Sun', submitted: 76400,  delivered: 71800,  failed: 2100, awaited: 2500 },
];

const kpiCards = [
  {
    label: 'Messages Delivered',
    value: '9,95,300',
    delta: '+12.4%',
    deltaUp: true,
    sub: 'Last 7 days',
    icon: TrendingUp,
    iconColor: 'text-info',
    iconBg: 'bg-info/10',
  },
  {
    label: 'Active Campaigns',
    value: '14',
    delta: '+3',
    deltaUp: true,
    sub: 'Running now',
    icon: Megaphone,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
  },
  {
    label: 'Total Contacts',
    value: '28,41,006',
    delta: '+8,421',
    deltaUp: true,
    sub: 'In audiences',
    icon: Users,
    iconColor: 'text-success',
    iconBg: 'bg-success/10',
  },
  {
    label: 'Awaited',
    value: '16,200',
    delta: 'Needs attention',
    deltaUp: false,
    sub: 'Stuck transactions',
    icon: Clock,
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10',
    alert: true,
  },
];

const channels = [
  { name: 'SMS',       status: 'live',    deliveries: '4,12,800', failRate: '1.8%' },
  { name: 'WhatsApp',  status: 'live',    deliveries: '3,84,200', failRate: '2.1%' },
  { name: 'RCS',       status: 'live',    deliveries: '1,98,300', failRate: '1.4%' },
  { name: 'Email',     status: 'coming',  deliveries: '—',        failRate: '—'    },
  { name: 'Voice',     status: 'coming',  deliveries: '—',        failRate: '—'    },
];

const activeCampaigns = [
  { name: 'SBI Credit Card Offer — Jul',  channel: 'SMS',       sent: 84200,  total: 120000, status: 'running' },
  { name: 'Diwali Flash Sale',            channel: 'WhatsApp',  sent: 52100,  total: 75000,  status: 'running' },
  { name: 'Hero FinCorp EMI Reminder',    channel: 'SMS',       sent: 28400,  total: 28400,  status: 'completed' },
  { name: 'OYO Weekend Push',             channel: 'RCS',       sent: 14800,  total: 40000,  status: 'running' },
  { name: 'KPN Transactional Alert',      channel: 'WhatsApp',  sent: 6200,   total: 10000,  status: 'paused' },
];

const alerts = [
  { type: 'warning', message: 'Template sync pending — 3 DLT templates awaiting approval', time: '14 min ago' },
  { type: 'error',   message: 'WhatsApp WABA fallback triggered for KPN (PROD-389)', time: '1 hr ago' },
  { type: 'warning', message: 'Credit balance below 20% threshold — SMS channel', time: '3 hr ago' },
  { type: 'success', message: 'RCS bot "Onextel Alerts" approved by Jio', time: '5 hr ago' },
];

/* ─── Sub-components ───────────────────────────────────────────────────────── */

function PeriodTab({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-brand-md text-[12px] font-semibold transition-colors',
        active
          ? 'bg-primary text-white'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      )}
    >
      {children}
    </button>
  );
}

function ChannelStatusDot({ status }: { status: string }) {
  if (status === 'live') return <span className="w-2 h-2 rounded-full bg-success flex-shrink-0" />;
  if (status === 'degraded') return <span className="w-2 h-2 rounded-full bg-warning flex-shrink-0" />;
  return <span className="w-2 h-2 rounded-full bg-border flex-shrink-0" />;
}

function CampaignStatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    running:   'bg-success/10 text-success',
    completed: 'bg-muted text-muted-foreground',
    paused:    'bg-warning/10 text-warning',
    failed:    'bg-destructive/10 text-destructive',
  };
  return (
    <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-brand-xs uppercase tracking-wide', styles[status] ?? styles.paused)}>
      {status}
    </span>
  );
}

function AlertIcon({ type }: { type: string }) {
  if (type === 'error')   return <XCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />;
  if (type === 'warning') return <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />;
  return <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />;
}

/* Custom tooltip for the delivery chart */
function DeliveryTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-brand-md shadow-el-2 p-3 text-[12px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            {entry.name}
          </span>
          <span className="font-semibold text-foreground">{entry.value.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Home page ────────────────────────────────────────────────────────────── */

const Home = () => {
  const [period, setPeriod] = React.useState<'today' | '7d' | '30d'>('7d');

  const awaitedTotal = deliveryData.reduce((sum, d) => sum + d.awaited, 0);

  return (
    <AppLayout>
      <div className="p-6 max-w-[1280px] mx-auto space-y-6">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex items-end justify-between">
          <div>
            <h2
              className="text-heading-xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Good morning, Udayan
            </h2>
            <p className="text-body-md text-muted-foreground mt-0.5">
              Here's how your channels are performing across all accounts.
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-card border border-border rounded-brand-md px-1.5 py-1">
            <PeriodTab active={period === 'today'} onClick={() => setPeriod('today')}>Today</PeriodTab>
            <PeriodTab active={period === '7d'}    onClick={() => setPeriod('7d')}>7 Days</PeriodTab>
            <PeriodTab active={period === '30d'}   onClick={() => setPeriod('30d')}>30 Days</PeriodTab>
          </div>
        </div>

        {/* ── Awaited alert banner ────────────────────────────────────────── */}
        {awaitedTotal > 0 && (
          <div className="flex items-center justify-between bg-warning/8 border border-warning/30 rounded-brand-xl px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-warning/15 rounded-brand-md flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">
                  {awaitedTotal.toLocaleString('en-IN')} messages stuck in "Awaited"
                </p>
                <p className="text-body-sm text-muted-foreground">
                  These transactions haven't received a delivery status from the operator. Manual repair needed.
                </p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-[12px] font-semibold text-warning hover:text-warning/80 transition-colors flex-shrink-0 ml-6">
              Fix with Transaction Health
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── KPI row ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4">
          {kpiCards.map((card) => (
            <div
              key={card.label}
              className={cn(
                'bg-card border rounded-brand-xl p-5 shadow-el-1 hover:shadow-el-2 transition-shadow',
                card.alert ? 'border-warning/40' : 'border-border'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn('w-9 h-9 rounded-brand-md flex items-center justify-center', card.iconBg)}>
                  <card.icon className={cn('w-4.5 h-4.5', card.iconColor)} />
                </div>
                <span
                  className={cn(
                    'text-[11px] font-semibold px-2 py-0.5 rounded-brand-full',
                    card.deltaUp
                      ? 'bg-success/10 text-success'
                      : 'bg-warning/10 text-warning'
                  )}
                >
                  {card.delta}
                </span>
              </div>
              <p
                className="text-[28px] font-bold text-foreground leading-none mb-1"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {card.value}
              </p>
              <p className="text-body-sm text-muted-foreground">{card.label}</p>
            </div>
          ))}
        </div>

        {/* ── Delivery health chart + Channel summary ─────────────────────── */}
        <div className="grid grid-cols-[1fr_320px] gap-4">

          {/* Delivery health chart */}
          <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3
                  className="text-heading-sm font-semibold text-foreground"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Delivery Health
                </h3>
                <p className="text-body-sm text-muted-foreground mt-0.5">Submitted vs Delivered vs Failed vs Awaited</p>
              </div>
              <button className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={deliveryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={8} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: 'hsl(220 9% 65%)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'hsl(220 9% 65%)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                />
                <Tooltip content={<DeliveryTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                />
                <Bar dataKey="submitted" name="Submitted" fill="hsl(214 32% 82%)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="delivered" name="Delivered"  fill="#22C55E"          radius={[3, 3, 0, 0]} />
                <Bar dataKey="failed"    name="Failed"     fill="#FF3535"          radius={[3, 3, 0, 0]} />
                <Bar dataKey="awaited"   name="Awaited"    fill="#F59E0B"          radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Channel summary */}
          <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-heading-sm font-semibold text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Channel Status
              </h3>
              <span className="text-[11px] text-muted-foreground">3 of 5 live</span>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {channels.map((ch) => (
                <div
                  key={ch.name}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-brand-md',
                    ch.status === 'live' ? 'bg-muted/40' : 'bg-muted/20 opacity-60'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <ChannelStatusDot status={ch.status} />
                    <span className="text-[13px] font-medium text-foreground">{ch.name}</span>
                  </div>
                  <div className="text-right">
                    {ch.status === 'live' ? (
                      <>
                        <p className="text-[12px] font-semibold text-foreground leading-none">{ch.deliveries}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{ch.failRate} fail</p>
                      </>
                    ) : (
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide bg-muted px-1.5 py-0.5 rounded-brand-xs">
                        Phase 2
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 text-[12px] font-semibold text-primary hover:bg-primary/5 rounded-brand-md transition-colors border border-primary/20">
              Manage Channels
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Active campaigns + Alerts ───────────────────────────────────── */}
        <div className="grid grid-cols-[1fr_320px] gap-4">

          {/* Active campaigns */}
          <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-heading-sm font-semibold text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Active Campaigns
              </h3>
              <button className="flex items-center gap-1 text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors">
                View all
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-col gap-0">
              {activeCampaigns.map((c, i) => {
                const pct = Math.round((c.sent / c.total) * 100);
                return (
                  <div
                    key={c.name}
                    className={cn(
                      'flex items-center gap-4 py-3',
                      i < activeCampaigns.length - 1 && 'border-b border-border'
                    )}
                  >
                    {/* Channel badge */}
                    <div className="w-8 h-8 rounded-brand-md bg-muted flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>

                    {/* Name + channel */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[13px] font-medium text-foreground truncate">{c.name}</p>
                        <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-brand-xs flex-shrink-0">
                          {c.channel}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-brand-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-brand-full transition-all',
                              c.status === 'completed' ? 'bg-success' :
                              c.status === 'paused'    ? 'bg-warning'  : 'bg-primary'
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground flex-shrink-0 w-8 text-right">{pct}%</span>
                      </div>
                    </div>

                    {/* Sent count + status */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-[13px] font-semibold text-foreground leading-none">
                        {c.sent.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        of {c.total.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <CampaignStatusChip status={c.status} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent alerts */}
          <div className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-heading-sm font-semibold text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Recent Alerts
              </h3>
              <Bell className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {alerts.map((alert, i) => (
                <div key={i} className="flex gap-2.5">
                  <AlertIcon type={alert.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-foreground leading-snug">{alert.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 text-[12px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-brand-md transition-colors">
              View all notifications
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default Home;

import { AppLayout } from '@/components/layout/AppLayout';
import { BarChart3, Megaphone, Users, Radio, TrendingUp, AlertCircle } from 'lucide-react';

const summaryCards = [
  { label: 'Messages Delivered',  value: '—',   delta: null, icon: BarChart3,  color: 'text-info'    },
  { label: 'Active Campaigns',    value: '—',   delta: null, icon: Megaphone,  color: 'text-primary' },
  { label: 'Total Contacts',      value: '—',   delta: null, icon: Users,      color: 'text-success' },
  { label: 'Active Channels',     value: '—',   delta: null, icon: Radio,      color: 'text-warning' },
];

const Home = () => (
  <AppLayout>
    <div className="p-8 max-w-[1200px] mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-heading-xl font-bold text-foreground font-heading">
          Good morning, Udayan
        </h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Here's what's happening across your channels today.
        </p>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1 hover:shadow-el-2 transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-body-sm text-muted-foreground font-medium">{card.label}</span>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <p className="text-display-md font-bold text-foreground leading-none">{card.value}</p>
            <p className="text-body-sm text-muted-foreground mt-1">Connect a channel to see data</p>
          </div>
        ))}
      </div>

      {/* Placeholder state */}
      <div className="bg-card border border-border rounded-brand-xl p-10 text-center shadow-el-1">
        <div className="w-12 h-12 bg-muted rounded-brand-xl flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-heading-md font-semibold text-foreground font-heading mb-2">
          Dashboard is being built
        </h3>
        <p className="text-body-md text-muted-foreground max-w-[420px] mx-auto">
          The unified cross-channel dashboard will show delivery health, campaign performance,
          and channel summaries in one view. This is Task #4.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-body-sm text-warning">
          <AlertCircle className="w-4 h-4" />
          <span>Task #4 — Pending</span>
        </div>
      </div>
    </div>
  </AppLayout>
);

export default Home;

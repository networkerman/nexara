import { AppLayout } from '@/components/layout/AppLayout';
import { BarChart3, AlertCircle } from 'lucide-react';

const Reports = () => (
  <AppLayout>
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="mb-8">
        <h2 className="text-heading-xl font-bold text-foreground font-heading">Reports</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Unified cross-channel delivery analytics, campaign performance, and Telco summaries.
        </p>
      </div>

      {/* Tab bar placeholder */}
      <div className="flex items-center gap-1 border-b border-border mb-6">
        {['Overview', 'Delivery Health', 'Engagement', 'Telco', 'Export'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2.5 text-body-sm font-medium border-b-2 -mb-px transition-colors ${
              i === 0
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-brand-xl p-10 text-center shadow-el-1">
        <div className="w-12 h-12 bg-muted rounded-brand-xl flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-heading-md font-semibold text-foreground font-heading mb-2">
          Reports are being rebuilt
        </h3>
        <p className="text-body-md text-muted-foreground max-w-[480px] mx-auto">
          The current Aura reports (per-channel, non-filterable) will be replaced with a unified,
          timezone-aware, self-serve reporting layer with scheduled SFTP/email delivery.
          This is Task #15.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-body-sm text-warning">
          <AlertCircle className="w-4 h-4" />
          <span>Task #15 — Pending</span>
        </div>
      </div>
    </div>
  </AppLayout>
);

export default Reports;

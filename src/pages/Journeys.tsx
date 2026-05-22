import { AppLayout } from '@/components/layout/AppLayout';
import { Route, Clock } from 'lucide-react';

const Journeys = () => (
  <AppLayout>
    <div className="p-8 max-w-[800px] mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-muted rounded-brand-2xl flex items-center justify-center mb-6">
        <Route className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="inline-flex items-center gap-1.5 bg-warning/10 text-warning text-ui-label px-3 py-1.5 rounded-full mb-4">
        <Clock className="w-3.5 h-3.5" />
        Coming Soon — Task #8
      </div>
      <h2 className="text-heading-xl font-bold text-foreground font-heading mb-3">
        Journey Automation
      </h2>
      <p className="text-body-lg text-muted-foreground max-w-[480px]">
        Build trigger-based, multi-step automation flows across SMS, WhatsApp, RCS, Email, and Voice
        using a visual canvas. Replaces manual follow-up sequences with intelligent routing.
      </p>
      <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-[480px] text-left">
        {[
          ['Visual canvas', 'React Flow drag-and-drop builder'],
          ['Multi-channel steps', 'Mix SMS, WA, RCS, Email, Voice in one flow'],
          ['Smart branching', 'Conditional logic based on delivery + engagement'],
        ].map(([title, desc]) => (
          <div key={title} className="bg-card border border-border rounded-brand-lg p-3 shadow-el-1">
            <p className="text-body-sm font-semibold text-foreground mb-0.5">{title}</p>
            <p className="text-ui-caption text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </AppLayout>
);

export default Journeys;

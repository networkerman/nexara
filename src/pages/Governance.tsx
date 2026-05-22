import { AppLayout } from '@/components/layout/AppLayout';
import { Shield, Users2, ClipboardCheck, ScrollText, AlertCircle } from 'lucide-react';

const modules = [
  {
    icon: Users2,
    title: 'Roles & Permissions',
    description: '6 built-in roles: Admin, Manager, Analyst, Campaign Manager, Approver, Viewer. Full RBAC with custom role builder.',
    tag: 'RBAC',
  },
  {
    icon: ClipboardCheck,
    title: 'Maker-Checker Approvals',
    description: 'Campaign and template submissions require a second reviewer before going live. Fixes PROD-311.',
    tag: 'Approvals',
  },
  {
    icon: ScrollText,
    title: 'Audit Log',
    description: 'Immutable, searchable record of every action — who changed what, when. Exportable for compliance.',
    tag: 'Audit',
  },
];

const Governance = () => (
  <AppLayout>
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="mb-8">
        <h2 className="text-heading-xl font-bold text-foreground font-heading">Governance</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Enterprise controls: RBAC, Maker-Checker approvals, and immutable Audit Log.
          Required for BFSI and Government customers.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {modules.map((mod) => (
          <div
            key={mod.title}
            className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary rounded-brand-lg flex items-center justify-center flex-shrink-0">
                <mod.icon className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full self-center">
                {mod.tag}
              </span>
            </div>
            <h3 className="text-heading-sm font-semibold text-foreground font-heading mb-1.5">
              {mod.title}
            </h3>
            <p className="text-body-sm text-muted-foreground">{mod.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-brand-xl p-8 text-center shadow-el-1">
        <div className="w-12 h-12 bg-muted rounded-brand-xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-heading-md font-semibold text-foreground font-heading mb-2">
          Governance module is being built
        </h3>
        <p className="text-body-md text-muted-foreground max-w-[480px] mx-auto">
          This is the #3 priority item. Blocking BFSI (DMI Finance, Credgenics) and Government
          (CRIS, NICSI) deals. Full RBAC, stabilised Maker-Checker, and new Audit Log.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-body-sm text-warning">
          <AlertCircle className="w-4 h-4" />
          <span>Task #13 — Pending</span>
        </div>
      </div>
    </div>
  </AppLayout>
);

export default Governance;

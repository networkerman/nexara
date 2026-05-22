import { AppLayout } from '@/components/layout/AppLayout';
import { Radio, MessageSquare, Phone, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

const channels = [
  {
    name: 'SMS',
    description: 'Airtel, Jio, Vi, BSNL operator config + DLT Sender IDs',
    icon: MessageSquare,
    status: 'live' as const,
  },
  {
    name: 'WhatsApp',
    description: 'Embedded Signup, OBO multi-provider, template sync',
    icon: Phone,
    status: 'live' as const,
  },
  {
    name: 'RCS',
    description: 'Bot setup, rich card templates, multi-provider',
    icon: Radio,
    status: 'live' as const,
  },
  {
    name: 'Email',
    description: 'SMTP / ESP integration, domain authentication',
    icon: Mail,
    status: 'coming' as const,
  },
  {
    name: 'Voice',
    description: 'IVR, click-to-call, outbound dialler integration',
    icon: Phone,
    status: 'coming' as const,
  },
];

const Channels = () => (
  <AppLayout>
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-heading-xl font-bold text-foreground font-heading">Channels</h2>
          <p className="text-body-md text-muted-foreground mt-1">
            Connect and configure your messaging channels. Each channel has its own provider management.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {channels.map((ch) => (
          <div
            key={ch.name}
            className="bg-card border border-border rounded-brand-xl p-5 shadow-el-1 hover:shadow-el-2 transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-secondary rounded-brand-lg flex items-center justify-center">
                <ch.icon className="w-5 h-5 text-foreground" />
              </div>
              {ch.status === 'live' ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  Coming
                </span>
              )}
            </div>
            <h3 className="text-heading-sm font-semibold text-foreground font-heading mb-1">
              {ch.name}
            </h3>
            <p className="text-body-sm text-muted-foreground">{ch.description}</p>
            {ch.status === 'live' && (
              <button className="mt-4 w-full text-ui-btn-sm font-bold text-primary hover:underline text-left transition-colors">
                Configure →
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 bg-accent/30 border border-accent rounded-brand-xl px-5 py-4 text-body-sm text-foreground/70">
        <strong className="text-foreground">Task #9</strong> — Channel management is being built. Configuration
        for SMS, WhatsApp, and RCS will be migrated from Aura. Email and Voice are new additions.
      </div>
    </div>
  </AppLayout>
);

export default Channels;

import { AppLayout } from '@/components/layout/AppLayout';
import { Users, CreditCard, Code2, Plug2, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const settingsSections = [
  {
    icon: Users,
    title: 'Team',
    description: 'User roster, role assignment, invite members',
    href: '/settings/team',
  },
  {
    icon: CreditCard,
    title: 'Billing & Credits',
    description: 'Unified wallet, per-channel spend, recharge',
    href: '/settings/billing',
  },
  {
    icon: Code2,
    title: 'Developers',
    description: 'API key generator, sandbox, webhook config, docs',
    href: '/settings/developers',
  },
  {
    icon: Plug2,
    title: 'Integrations',
    description: 'CleverTap, MoEngage, WebEngage, Shopify, LeadSquared',
    href: '/settings/integrations',
  },
  {
    icon: SlidersHorizontal,
    title: 'Config',
    description: 'Timezone, Sender IDs, DLT entity config, platform prefs',
    href: '/settings/config',
  },
];

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-8 max-w-[800px] mx-auto">
        <div className="mb-8">
          <h2 className="text-heading-xl font-bold text-foreground font-heading">Settings</h2>
          <p className="text-body-md text-muted-foreground mt-1">
            Manage your account, team, billing, API access, and platform configuration.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          {settingsSections.map((section) => (
            <button
              key={section.title}
              onClick={() => navigate(section.href)}
              className="flex items-center gap-4 px-5 py-4 bg-card border border-border rounded-brand-xl shadow-el-1 hover:shadow-el-2 transition-shadow text-left group"
            >
              <div className="w-10 h-10 bg-secondary rounded-brand-lg flex items-center justify-center flex-shrink-0">
                <section.icon className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-heading-sm font-semibold text-foreground font-heading">
                  {section.title}
                </p>
                <p className="text-body-sm text-muted-foreground mt-0.5">{section.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;

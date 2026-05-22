import React from 'react';
import {
  Home,
  Megaphone,
  Route,
  Users,
  FileText,
  BarChart3,
  Radio,
  Shield,
  Settings,
  ChevronRight,
  Bell,
  ChevronsUpDown,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Footer from './Footer';

/* ─── Navigation definition ──────────────────────────────────────────────── */

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  locked?: boolean;
}

const primaryNav: NavItem[] = [
  { name: 'Home',       href: '/',           icon: Home      },
  { name: 'Campaigns',  href: '/campaigns',  icon: Megaphone },
  { name: 'Journeys',   href: '/journeys',   icon: Route,    locked: true },
  { name: 'Audiences',  href: '/audiences',  icon: Users     },
  { name: 'Content',    href: '/content',    icon: FileText  },
  { name: 'Reports',    href: '/reports',    icon: BarChart3 },
  { name: 'Channels',   href: '/channels',   icon: Radio     },
  { name: 'Governance', href: '/governance', icon: Shield    },
];

const bottomNav: NavItem[] = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

const routeTitles: Record<string, string> = {
  '/':           'Home',
  '/campaigns':  'Campaigns',
  '/journeys':   'Journeys',
  '/audiences':  'Audiences',
  '/content':    'Content',
  '/reports':    'Reports',
  '/channels':   'Channels',
  '/governance': 'Governance',
  '/settings':   'Settings',
};

/* ─── Sidebar nav item ────────────────────────────────────────────────────── */

function SidebarItem({ item }: { item: NavItem }) {
  if (item.locked) {
    return (
      <div
        className="flex items-center justify-between px-3 py-2.5 rounded-brand-md cursor-not-allowed select-none"
        title="Coming soon"
      >
        <div className="flex items-center gap-3">
          <item.icon className="w-[18px] h-[18px] text-white/25 flex-shrink-0" />
          <span className="text-[13px] font-medium text-white/25 leading-none">
            {item.name}
          </span>
        </div>
        <span className="text-[10px] font-semibold tracking-wide uppercase text-white/30 bg-white/[0.06] px-1.5 py-0.5 rounded-brand-xs">
          Soon
        </span>
      </div>
    );
  }

  return (
    <NavLink
      to={item.href}
      end={item.href === '/'}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 px-3 py-2.5 rounded-brand-md transition-colors duration-150 relative',
          isActive
            ? 'bg-white/[0.09] text-white'
            : 'text-white/55 hover:text-white/90 hover:bg-white/[0.05]'
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator bar */}
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#FF3535] rounded-r-full" />
          )}
          <item.icon
            className={cn(
              'w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150',
              isActive ? 'text-[#FF3535]' : 'text-current'
            )}
          />
          <span className="text-[13px] font-medium leading-none">{item.name}</span>
        </>
      )}
    </NavLink>
  );
}

/* ─── AppLayout ───────────────────────────────────────────────────────────── */

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  // Resolve page title from pathname (handles sub-routes too)
  const pageTitle = React.useMemo(() => {
    const exact = routeTitles[location.pathname];
    if (exact) return exact;
    const segment = '/' + location.pathname.split('/')[1];
    return routeTitles[segment] ?? 'OneXtel';
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex">

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside className="w-[232px] flex-shrink-0 flex flex-col bg-[#2E2E2E] min-h-screen">

          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.08]">
            <div className="w-8 h-8 bg-[#FF3535] rounded-brand-md flex items-center justify-center flex-shrink-0">
              <span
                className="text-white font-black text-[15px] leading-none"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                X
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="text-white font-bold text-[15px] leading-tight tracking-[0.2px]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                OneXtel
              </span>
              <span className="text-white/35 text-[9px] font-semibold tracking-[1.2px] uppercase mt-0.5">
                Intelligent CPaaS
              </span>
            </div>
          </div>

          {/* Primary navigation */}
          <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
            {primaryNav.map((item) => (
              <SidebarItem key={item.name} item={item} />
            ))}
          </nav>

          {/* Divider */}
          <div className="mx-4 border-t border-white/[0.08]" />

          {/* Bottom navigation (Settings) */}
          <div className="px-3 py-3 flex flex-col gap-0.5">
            {bottomNav.map((item) => (
              <SidebarItem key={item.name} item={item} />
            ))}
          </div>

          {/* Account switcher */}
          <div className="mx-3 mb-4 mt-1">
            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-brand-md bg-white/[0.05] hover:bg-white/[0.08] transition-colors duration-150 group">
              <div className="w-6 h-6 rounded-full bg-[#FF3535] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[11px] font-bold leading-none">O</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-white/80 text-[12px] font-medium leading-tight truncate">
                  Onextel
                </p>
                <p className="text-white/35 text-[10px] leading-tight truncate">
                  Enterprise
                </p>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
            </button>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">

          {/* Top bar */}
          <header className="bg-card border-b border-border px-6 py-3.5 flex items-center justify-between flex-shrink-0">
            <h1
              className="text-[17px] font-semibold text-foreground leading-none"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {pageTitle}
            </h1>

            <div className="flex items-center gap-4">
              {/* Status pill */}
              <div className="flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                Live
              </div>

              {/* Notifications */}
              <button className="relative w-8 h-8 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors">
                <Bell className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* User avatar */}
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[11px] font-bold text-primary-foreground leading-none">U</span>
                </div>
                <ChevronRight className="w-3 h-3 text-muted-foreground rotate-90" />
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>

      </div>

      <Footer />
    </div>
  );
}

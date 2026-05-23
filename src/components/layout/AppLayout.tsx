import React, { useState } from 'react';
import {
  Home,
  Megaphone,
  Route,
  Users,
  FileText,
  BarChart3,
  LineChart,
  Wallet,
  Radio,
  Shield,
  Settings,
  ChevronRight,
  Bell,
  ChevronsUpDown,
  HeartPulse,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
  { name: 'Analytics',  href: '/analytics',  icon: LineChart },
  { name: 'Reports',    href: '/reports',    icon: BarChart3 },
  { name: 'Channels',   href: '/channels',   icon: Radio     },
  { name: 'Governance', href: '/governance', icon: Shield    },
  { name: 'Credits',    href: '/credits',    icon: Wallet    },
  { name: 'Acct Health', href: '/account-health', icon: HeartPulse },
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
  '/analytics':  'Analytics',
  '/reports':    'Reports',
  '/channels':   'Channels',
  '/governance': 'Governance',
  '/credits':         'Credits & Wallet',
  '/account-health':  'Account Health',
  '/settings':        'Settings',
};

/* ─── Sidebar nav item ────────────────────────────────────────────────────── */

interface SidebarItemProps {
  item: NavItem;
  expanded: boolean;
}

function SidebarItem({ item, expanded }: SidebarItemProps) {
  if (item.locked) {
    return (
      <div
        className={cn(
          'flex items-center rounded-brand-md cursor-not-allowed select-none transition-all duration-200',
          expanded ? 'justify-between px-3 py-2.5' : 'justify-center py-2.5 px-0',
        )}
        title={!expanded ? item.name : undefined}
      >
        <div className={cn('flex items-center', expanded ? 'gap-3' : '')}>
          <item.icon className="w-[18px] h-[18px] text-white/25 flex-shrink-0" />
          <span
            className={cn(
              'text-[13px] font-medium text-white/25 leading-none whitespace-nowrap transition-all duration-200 overflow-hidden',
              expanded ? 'opacity-100 max-w-[160px] ml-0' : 'opacity-0 max-w-0',
            )}
          >
            {item.name}
          </span>
        </div>
        <span
          className={cn(
            'text-[10px] font-semibold tracking-wide uppercase text-white/30 bg-white/[0.06] px-1.5 py-0.5 rounded-brand-xs whitespace-nowrap transition-all duration-200 overflow-hidden',
            expanded ? 'opacity-100 max-w-[40px]' : 'opacity-0 max-w-0 px-0',
          )}
        >
          Soon
        </span>
      </div>
    );
  }

  return (
    <NavLink
      to={item.href}
      end={item.href === '/'}
      title={!expanded ? item.name : undefined}
      className={({ isActive }) =>
        cn(
          'group flex items-center rounded-brand-md transition-colors duration-150 relative',
          expanded ? 'gap-3 px-3 py-2.5' : 'justify-center py-2.5 px-0',
          isActive
            ? 'bg-white/[0.09] text-white'
            : 'text-white/55 hover:text-white/90 hover:bg-white/[0.05]',
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator bar — always visible */}
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#FF3535] rounded-r-full" />
          )}
          <item.icon
            className={cn(
              'w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150',
              isActive ? 'text-[#FF3535]' : 'text-current',
            )}
          />
          <span
            className={cn(
              'text-[13px] font-medium leading-none whitespace-nowrap transition-all duration-200 overflow-hidden',
              expanded ? 'opacity-100 max-w-[160px]' : 'opacity-0 max-w-0',
            )}
          >
            {item.name}
          </span>
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
  const [sidebarHovered, setSidebarHovered] = useState(false);

  // Collapse whenever we're inside a section (not the root dashboard)
  const isOnRoot = location.pathname === '/';
  const isExpanded = isOnRoot || sidebarHovered;

  // Resolve page title from pathname (handles sub-routes too)
  const pageTitle = React.useMemo(() => {
    const exact = routeTitles[location.pathname];
    if (exact) return exact;
    const segment = '/' + location.pathname.split('/')[1];
    return routeTitles[segment] ?? 'OneXtel';
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex-1 flex">

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside
          className={cn(
            'flex-shrink-0 flex flex-col bg-[#2E2E2E] h-full overflow-y-auto overflow-x-hidden',
            'transition-[width] duration-200 ease-in-out',
            isExpanded ? 'w-[232px]' : 'w-[52px]',
          )}
          onMouseEnter={() => setSidebarHovered(true)}
          onMouseLeave={() => setSidebarHovered(false)}
        >

          {/* Logo */}
          <div
            className={cn(
              'flex items-center border-b border-white/[0.08] transition-all duration-200',
              isExpanded ? 'gap-3 px-5 py-5' : 'justify-center px-0 py-5',
            )}
          >
            <div className="w-8 h-8 bg-[#FF3535] rounded-brand-md flex items-center justify-center flex-shrink-0">
              <span
                className="text-white font-black text-[15px] leading-none"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                X
              </span>
            </div>
            <div
              className={cn(
                'flex flex-col overflow-hidden transition-all duration-200',
                isExpanded ? 'opacity-100 max-w-[160px]' : 'opacity-0 max-w-0',
              )}
            >
              <span
                className="text-white font-bold text-[15px] leading-tight tracking-[0.2px] whitespace-nowrap"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                OneXtel
              </span>
              <span className="text-white/35 text-[9px] font-semibold tracking-[1.2px] uppercase mt-0.5 whitespace-nowrap">
                Intelligent CPaaS
              </span>
            </div>
          </div>

          {/* Primary navigation */}
          <nav
            className={cn(
              'flex-1 py-4 flex flex-col gap-0.5 overflow-y-auto',
              isExpanded ? 'px-3' : 'px-1.5',
            )}
          >
            {primaryNav.map((item) => (
              <SidebarItem key={item.name} item={item} expanded={isExpanded} />
            ))}
          </nav>

          {/* Divider */}
          <div className="mx-4 border-t border-white/[0.08]" />

          {/* Bottom navigation (Settings) */}
          <div className={cn('py-3 flex flex-col gap-0.5', isExpanded ? 'px-3' : 'px-1.5')}>
            {bottomNav.map((item) => (
              <SidebarItem key={item.name} item={item} expanded={isExpanded} />
            ))}
          </div>

          {/* Account switcher */}
          <div className={cn('mb-4 mt-1', isExpanded ? 'mx-3' : 'mx-1.5')}>
            <button
              className={cn(
                'w-full flex items-center rounded-brand-md bg-white/[0.05] hover:bg-white/[0.08] transition-colors duration-150',
                isExpanded ? 'gap-2.5 px-3 py-2.5' : 'justify-center px-0 py-2.5',
              )}
              title={!isExpanded ? 'Onextel — Enterprise' : undefined}
            >
              <div className="w-6 h-6 rounded-full bg-[#FF3535] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[11px] font-bold leading-none">O</span>
              </div>
              <div
                className={cn(
                  'flex-1 min-w-0 text-left overflow-hidden transition-all duration-200',
                  isExpanded ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0',
                )}
              >
                <p className="text-white/80 text-[12px] font-medium leading-tight truncate whitespace-nowrap">
                  Onextel
                </p>
                <p className="text-white/35 text-[10px] leading-tight truncate whitespace-nowrap">
                  Enterprise
                </p>
              </div>
              <ChevronsUpDown
                className={cn(
                  'w-3.5 h-3.5 text-white/30 flex-shrink-0 transition-all duration-200',
                  isExpanded ? 'opacity-100' : 'opacity-0 w-0',
                )}
              />
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
            <div className="w-full max-w-[1440px] mx-auto">
              {children}
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}

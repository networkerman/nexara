import React from 'react';
import { LayoutDashboard, Megaphone, Users, FileText, BarChart3, MessageSquare, Route, Monitor, Smartphone, Globe } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
const navigation = [{
  name: 'Dashboards',
  href: '/dashboards',
  icon: LayoutDashboard
}, {
  name: 'Engage',
  href: '/engage',
  icon: Megaphone,
  children: [{
    name: 'Campaigns',
    href: '/engage/campaigns',
    icon: MessageSquare
  }, {
    name: 'Journey',
    href: '/engage/journey',
    icon: Route
  }, {
    name: 'On-site messages',
    href: '/engage/onsite',
    icon: Monitor
  }]
}, {
  name: 'Audiences',
  href: '/audiences',
  icon: Users
}, {
  name: 'Content',
  href: '/content',
  icon: FileText
}, {
  name: 'Analytics',
  href: '/analytics',
  icon: BarChart3
}];
interface AppLayoutProps {
  children: React.ReactNode;
}
export function AppLayout({
  children
}: AppLayoutProps) {
  return <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-primary-foreground">
        {/* Logo */}
        <div className="p-6 border-b border-primary/20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-warning rounded-md flex items-center justify-center">
              <span className="text-sm font-bold text-warning-foreground">N</span>
            </div>
            <span className="text-lg font-semibold">Netcore</span>
          </div>
          <p className="text-xs text-primary-foreground/70 mt-1">CUSTOMER ENGAGEMENT</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map(item => <div key={item.name}>
              <NavLink to={item.href} className={({
            isActive
          }) => cn("flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors", isActive || item.name === 'Engage' ? "bg-primary-foreground/10 text-primary-foreground" : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5")}>
                <item.icon className="w-4 h-4 mr-3" />
                {item.name}
              </NavLink>
              
              {/* Submenu for Engage */}
              {item.name === 'Engage' && item.children && <div className="ml-7 mt-1 space-y-1">
                  {item.children.map(child => <NavLink key={child.name} to={child.href} className={({
              isActive
            }) => cn("flex items-center px-3 py-1.5 text-sm rounded-md transition-colors", isActive ? "bg-primary-foreground/15 text-primary-foreground font-medium" : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5")}>
                      <child.icon className="w-3 h-3 mr-2" />
                      {child.name}
                    </NavLink>)}
                </div>}
            </div>)}
        </nav>

        {/* Personalization Section */}
        <div className="px-4 mt-8">
          <h3 className="px-3 text-xs font-semibold text-primary-foreground/50 uppercase tracking-wider">
            Personalization
          </h3>
          <div className="mt-2 space-y-1">
            <NavLink to="/personalization/web" className="flex items-center px-3 py-2 text-sm text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5 rounded-md transition-colors">
              <Globe className="w-4 h-4 mr-3" />
              Web
            </NavLink>
            <NavLink to="/personalization/app" className="flex items-center px-3 py-2 text-sm text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5 rounded-md transition-colors">
              <Smartphone className="w-4 h-4 mr-3" />
              App
            </NavLink>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-foreground">Engage</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-success-foreground rounded-full"></div>
                </div>
                <span className="text-sm text-foreground">HDFC</span>
                <span className="text-xs text-success font-medium">Live</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>;
}
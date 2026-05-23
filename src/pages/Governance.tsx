import React, { useState } from 'react';
import {
  Shield,
  Users2,
  ClipboardCheck,
  ScrollText,
  Plus,
  Search,
  MoreHorizontal,
  ChevronDown,
  Check,
  X,
  Clock,
  AlertTriangle,
  Download,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  User,
  Lock,
  Unlock,
  ArrowRight,
  RefreshCw,
  FileText,
  Megaphone,
  Radio,
  BarChart3,
  Settings,
  Mail,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { cn } from '@/lib/utils';

/* ─── Types ──────────────────────────────────────────────────────────────── */

type GovernanceSection = 'rbac' | 'maker-checker' | 'audit-log';

type RoleId = 'admin' | 'manager' | 'campaign_mgr' | 'approver' | 'analyst' | 'viewer';

interface Role {
  id: RoleId;
  name: string;
  description: string;
  userCount: number;
  color: string;
  isSystem: boolean;
}

interface RbacUser {
  id: string;
  name: string;
  email: string;
  role: RoleId;
  lastActive: string;
  status: 'active' | 'inactive' | 'invited';
}

type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';
type ApprovalType = 'campaign' | 'template' | 'sender_id' | 'audience';

interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  title: string;
  submittedBy: string;
  submittedAt: string;
  channel: string;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  comment?: string;
  prodRef?: string;
}

type AuditAction =
  | 'user.login'
  | 'user.created'
  | 'user.role_changed'
  | 'campaign.created'
  | 'campaign.approved'
  | 'campaign.rejected'
  | 'campaign.launched'
  | 'template.created'
  | 'template.approved'
  | 'sender_id.added'
  | 'sender_id.deleted'
  | 'settings.changed'
  | 'credits.topped_up';

interface AuditEntry {
  id: string;
  action: AuditAction;
  actor: string;
  actorEmail: string;
  target: string;
  detail: string;
  ip: string;
  timestamp: string;
  module: string;
}

/* ─── Mock data ──────────────────────────────────────────────────────────── */

const roles: Role[] = [
  { id: 'admin',       name: 'Admin',            description: 'Full access to all modules, settings, and user management', userCount: 2,  color: 'bg-red-100 text-red-700',    isSystem: true  },
  { id: 'manager',     name: 'Manager',           description: 'All modules except billing and user management',            userCount: 3,  color: 'bg-purple-100 text-purple-700', isSystem: true },
  { id: 'campaign_mgr',name: 'Campaign Manager',  description: 'Create and manage campaigns; cannot approve own work',      userCount: 8,  color: 'bg-blue-100 text-blue-700',  isSystem: true  },
  { id: 'approver',    name: 'Approver',          description: 'Review and approve campaigns, templates, sender IDs',       userCount: 3,  color: 'bg-green-100 text-green-700', isSystem: true },
  { id: 'analyst',     name: 'Analyst',           description: 'Read-only access to reports and dashboards',                userCount: 5,  color: 'bg-yellow-100 text-yellow-700', isSystem: true },
  { id: 'viewer',      name: 'Viewer',            description: 'View campaigns and reports; no create or edit rights',      userCount: 12, color: 'bg-gray-100 text-gray-600',  isSystem: true  },
];

const permissionMatrix: { module: string; icon: React.ElementType; perms: Record<RoleId, 'full' | 'limited' | 'none'> }[] = [
  { module: 'Campaigns',    icon: Megaphone,      perms: { admin: 'full', manager: 'full', campaign_mgr: 'full', approver: 'limited', analyst: 'none',    viewer: 'none'    } },
  { module: 'Templates',    icon: FileText,       perms: { admin: 'full', manager: 'full', campaign_mgr: 'full', approver: 'limited', analyst: 'none',    viewer: 'none'    } },
  { module: 'Audiences',    icon: Users2,         perms: { admin: 'full', manager: 'full', campaign_mgr: 'full', approver: 'none',    analyst: 'limited', viewer: 'none'    } },
  { module: 'Channels',     icon: Radio,          perms: { admin: 'full', manager: 'full', campaign_mgr: 'none', approver: 'none',    analyst: 'none',    viewer: 'none'    } },
  { module: 'Reports',      icon: BarChart3,      perms: { admin: 'full', manager: 'full', campaign_mgr: 'limited', approver: 'limited', analyst: 'full', viewer: 'full'   } },
  { module: 'Governance',   icon: Shield,         perms: { admin: 'full', manager: 'limited', campaign_mgr: 'none', approver: 'none', analyst: 'none',   viewer: 'none'    } },
  { module: 'Credits',      icon: Building2,      perms: { admin: 'full', manager: 'none', campaign_mgr: 'none', approver: 'none',    analyst: 'limited', viewer: 'none'    } },
  { module: 'Settings',     icon: Settings,       perms: { admin: 'full', manager: 'limited', campaign_mgr: 'none', approver: 'none', analyst: 'none',   viewer: 'none'    } },
];

const rbacUsers: RbacUser[] = [
  { id: '1', name: 'Udayan Chowdhury',  email: 'udayan.chowdhury@onextel.com',  role: 'admin',        lastActive: '2 min ago',  status: 'active'   },
  { id: '2', name: 'Priya Sharma',      email: 'priya.sharma@onextel.com',      role: 'manager',      lastActive: '1 hr ago',   status: 'active'   },
  { id: '3', name: 'Rohan Mehta',       email: 'rohan.mehta@onextel.com',       role: 'campaign_mgr', lastActive: '3 hrs ago',  status: 'active'   },
  { id: '4', name: 'Sneha Kapoor',      email: 'sneha.kapoor@onextel.com',      role: 'approver',     lastActive: '1 day ago',  status: 'active'   },
  { id: '5', name: 'Kiran Bose',        email: 'kiran.bose@onextel.com',        role: 'analyst',      lastActive: '2 days ago', status: 'active'   },
  { id: '6', name: 'Amit Verma',        email: 'amit.verma@sbi.co.in',          role: 'viewer',       lastActive: 'Never',      status: 'invited'  },
  { id: '7', name: 'Deepa Nair',        email: 'deepa.nair@onextel.com',        role: 'campaign_mgr', lastActive: '5 days ago', status: 'inactive' },
];

const approvalRequests: ApprovalRequest[] = [
  { id: 'APR-1041', type: 'campaign',   title: 'SBI Festival Offer — Oct Diwali Blast',       submittedBy: 'Rohan Mehta',   submittedAt: '23 May 2026, 09:12', channel: 'WhatsApp', status: 'pending'  },
  { id: 'APR-1040', type: 'template',   title: 'OTP Verification Template v3',                submittedBy: 'Priya Sharma',  submittedAt: '23 May 2026, 08:45', channel: 'SMS',      status: 'pending'  },
  { id: 'APR-1039', type: 'sender_id',  title: 'CRSNEW — CRIS New Transactional Sender',      submittedBy: 'Rohan Mehta',   submittedAt: '22 May 2026, 17:30', channel: 'SMS',      status: 'pending'  },
  { id: 'APR-1038', type: 'campaign',   title: 'KPN Monthly Account Statement — May 2026',    submittedBy: 'Sneha Kapoor',  submittedAt: '22 May 2026, 14:10', channel: 'RCS',      status: 'approved', reviewedBy: 'Udayan Chowdhury', reviewedAt: '22 May 2026, 15:00' },
  { id: 'APR-1037', type: 'template',   title: 'Hero FinCorp Loan Disbursal Confirmation',    submittedBy: 'Rohan Mehta',   submittedAt: '21 May 2026, 11:00', channel: 'WhatsApp', status: 'approved', reviewedBy: 'Sneha Kapoor',    reviewedAt: '21 May 2026, 13:22' },
  { id: 'APR-1036', type: 'campaign',   title: 'DMI Finance Pre-approved Loan — Bulk Blast',  submittedBy: 'Kiran Bose',    submittedAt: '20 May 2026, 09:00', channel: 'SMS',      status: 'rejected', reviewedBy: 'Priya Sharma',    reviewedAt: '20 May 2026, 10:05', comment: 'DLT template ID missing. Re-submit with correct PE mapping.', prodRef: 'PROD-311' },
  { id: 'APR-1035', type: 'audience',   title: 'BSNL Inactive Subscribers — 90 days segment', submittedBy: 'Rohan Mehta',   submittedAt: '18 May 2026, 16:00', channel: 'SMS',      status: 'expired' },
];

const auditLog: AuditEntry[] = [
  { id: 'AUD-8821', action: 'campaign.launched',  actor: 'Udayan Chowdhury', actorEmail: 'udayan.chowdhury@onextel.com', target: 'SBI Diwali Campaign',        detail: 'Campaign launched to 2.4M recipients via WhatsApp',    ip: '103.21.58.12', timestamp: '23 May 2026, 09:41', module: 'Campaigns'  },
  { id: 'AUD-8820', action: 'campaign.approved',  actor: 'Sneha Kapoor',     actorEmail: 'sneha.kapoor@onextel.com',     target: 'APR-1038',                   detail: 'Approved: KPN Monthly Statement — May 2026',           ip: '103.21.58.14', timestamp: '22 May 2026, 15:00', module: 'Governance' },
  { id: 'AUD-8819', action: 'user.role_changed',  actor: 'Udayan Chowdhury', actorEmail: 'udayan.chowdhury@onextel.com', target: 'Kiran Bose',                 detail: 'Role changed from Campaign Manager → Analyst',         ip: '103.21.58.12', timestamp: '22 May 2026, 14:55', module: 'Governance' },
  { id: 'AUD-8818', action: 'template.approved',  actor: 'Sneha Kapoor',     actorEmail: 'sneha.kapoor@onextel.com',     target: 'Hero FinCorp Loan Disbursal', detail: 'Template approved and synced to WhatsApp BSP',        ip: '103.21.58.14', timestamp: '21 May 2026, 13:22', module: 'Governance' },
  { id: 'AUD-8817', action: 'campaign.rejected',  actor: 'Priya Sharma',     actorEmail: 'priya.sharma@onextel.com',     target: 'APR-1036',                   detail: 'Rejected: DMI Finance — DLT template ID missing',      ip: '103.21.58.11', timestamp: '20 May 2026, 10:05', module: 'Governance' },
  { id: 'AUD-8816', action: 'sender_id.added',    actor: 'Rohan Mehta',      actorEmail: 'rohan.mehta@onextel.com',      target: 'CRISIN',                     detail: 'New sender ID registered — PE ID 1101156789012348',    ip: '103.21.58.13', timestamp: '19 May 2026, 17:30', module: 'Channels'   },
  { id: 'AUD-8815', action: 'credits.topped_up',  actor: 'Udayan Chowdhury', actorEmail: 'udayan.chowdhury@onextel.com', target: 'SBI Account',                detail: 'Credits added: ₹5,00,000 via Razorpay TXN-88291',      ip: '103.21.58.12', timestamp: '19 May 2026, 11:10', module: 'Credits'    },
  { id: 'AUD-8814', action: 'settings.changed',   actor: 'Priya Sharma',     actorEmail: 'priya.sharma@onextel.com',     target: 'Frequency capping',          detail: 'WA frequency cap updated: 2/week → 1/7days',          ip: '103.21.58.11', timestamp: '18 May 2026, 15:00', module: 'Channels'   },
  { id: 'AUD-8813', action: 'user.created',        actor: 'Udayan Chowdhury', actorEmail: 'udayan.chowdhury@onextel.com', target: 'Amit Verma (SBI)',           detail: 'User invited with Viewer role — amit.verma@sbi.co.in', ip: '103.21.58.12', timestamp: '17 May 2026, 09:05', module: 'Governance' },
  { id: 'AUD-8812', action: 'user.login',          actor: 'Sneha Kapoor',     actorEmail: 'sneha.kapoor@onextel.com',     target: 'Login',                      detail: 'Successful login from Chrome on macOS',               ip: '103.21.58.14', timestamp: '17 May 2026, 08:55', module: 'Auth'       },
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function PermCell({ level }: { level: 'full' | 'limited' | 'none' }) {
  if (level === 'full')    return <Check className="w-4 h-4 text-success mx-auto" />;
  if (level === 'limited') return <div className="w-3 h-0.5 bg-warning mx-auto rounded-full" />;
  return <X className="w-3 h-3 text-muted-foreground/30 mx-auto" />;
}

function RoleBadge({ role }: { role: RoleId }) {
  const r = roles.find(r => r.id === role);
  if (!r) return null;
  return (
    <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', r.color)}>
      {r.name}
    </span>
  );
}

function StatusBadge({ status }: { status: ApprovalStatus }) {
  const map: Record<ApprovalStatus, { label: string; cls: string; icon: React.ElementType }> = {
    pending:  { label: 'Pending',  cls: 'bg-amber-50 text-amber-700 border border-amber-200',  icon: Clock        },
    approved: { label: 'Approved', cls: 'bg-green-50 text-green-700 border border-green-200',  icon: CheckCircle2 },
    rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700 border border-red-200',        icon: XCircle      },
    expired:  { label: 'Expired',  cls: 'bg-gray-100 text-gray-500 border border-gray-200',    icon: Clock        },
  };
  const { label, cls, icon: Icon } = map[status];
  return (
    <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full', cls)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function TypeBadge({ type }: { type: ApprovalType }) {
  const map: Record<ApprovalType, string> = {
    campaign:  'bg-blue-100 text-blue-700',
    template:  'bg-purple-100 text-purple-700',
    sender_id: 'bg-orange-100 text-orange-700',
    audience:  'bg-teal-100 text-teal-700',
  };
  const labels: Record<ApprovalType, string> = {
    campaign: 'Campaign', template: 'Template', sender_id: 'Sender ID', audience: 'Audience',
  };
  return (
    <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', map[type])}>
      {labels[type]}
    </span>
  );
}

function AuditActionChip({ action }: { action: AuditAction }) {
  const map: Record<AuditAction, { label: string; cls: string }> = {
    'user.login':         { label: 'Login',            cls: 'bg-gray-100 text-gray-600'       },
    'user.created':       { label: 'User Created',     cls: 'bg-blue-100 text-blue-700'       },
    'user.role_changed':  { label: 'Role Changed',     cls: 'bg-purple-100 text-purple-700'   },
    'campaign.created':   { label: 'Campaign Created', cls: 'bg-blue-100 text-blue-700'       },
    'campaign.approved':  { label: 'Approved',         cls: 'bg-green-100 text-green-700'     },
    'campaign.rejected':  { label: 'Rejected',         cls: 'bg-red-100 text-red-700'         },
    'campaign.launched':  { label: 'Launched',         cls: 'bg-green-100 text-green-700'     },
    'template.created':   { label: 'Template Created', cls: 'bg-blue-100 text-blue-700'       },
    'template.approved':  { label: 'Approved',         cls: 'bg-green-100 text-green-700'     },
    'sender_id.added':    { label: 'Sender Added',     cls: 'bg-orange-100 text-orange-700'   },
    'sender_id.deleted':  { label: 'Sender Deleted',   cls: 'bg-red-100 text-red-700'         },
    'settings.changed':   { label: 'Settings Changed', cls: 'bg-amber-100 text-amber-700'     },
    'credits.topped_up':  { label: 'Credits Added',    cls: 'bg-teal-100 text-teal-700'       },
  };
  const { label, cls } = map[action];
  return <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', cls)}>{label}</span>;
}

/* ─── RBAC View ──────────────────────────────────────────────────────────── */

function RbacView() {
  const [tab, setTab] = useState<'roles' | 'users' | 'matrix'>('roles');
  const [search, setSearch] = useState('');

  const filteredUsers = rbacUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-foreground font-heading">Roles & Permissions</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {rbacUsers.length} users · {roles.length} roles · Full RBAC with custom role builder
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-4 py-2 rounded-brand-md hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Invite user
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-brand-md w-fit">
        {(['roles', 'users', 'matrix'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'text-[13px] font-medium px-4 py-1.5 rounded-brand-sm transition-colors capitalize',
              tab === t ? 'bg-card text-foreground shadow-el-1' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t === 'matrix' ? 'Permission Matrix' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Roles tab */}
      {tab === 'roles' && (
        <div className="grid grid-cols-3 gap-4">
          {roles.map(role => (
            <div key={role.id} className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1 hover:shadow-el-2 transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-bold px-2.5 py-1 rounded-full', role.color)}>
                  {role.name}
                </span>
                {role.isSystem ? (
                  <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">System</span>
                ) : (
                  <button className="text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">{role.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-foreground font-medium">
                  <User className="w-3.5 h-3.5 inline mr-1 text-muted-foreground" />
                  {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
                </span>
                <button className="text-[12px] text-primary hover:underline">View users →</button>
              </div>
            </div>
          ))}
          {/* Add custom role */}
          <button className="border-2 border-dashed border-border rounded-brand-xl p-4 hover:border-primary/40 hover:bg-primary/[0.02] transition-colors text-center group">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/10 transition-colors">
              <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">Create custom role</p>
          </button>
        </div>
      )}

      {/* Users tab */}
      {tab === 'users' && (
        <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-3">
            <div className="relative flex-1 max-w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-8 pr-3 py-1.5 text-[13px] bg-muted border border-border rounded-brand-md focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <button className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground px-3 py-1.5 border border-border rounded-brand-md transition-colors">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Last active</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={user.id} className={cn('border-b border-border last:border-0 hover:bg-muted/30 transition-colors', i === 0 && 'bg-primary/[0.02]')}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] font-bold text-primary">{user.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground leading-tight">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{user.lastActive}</td>
                  <td className="px-4 py-3">
                    {user.status === 'active'   && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success"><span className="w-1.5 h-1.5 rounded-full bg-success" />Active</span>}
                    {user.status === 'inactive' && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />Inactive</span>}
                    {user.status === 'invited'  && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-warning"><Mail className="w-3 h-3" />Invited</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                      {user.status === 'active' ? (
                        <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Lock className="w-3.5 h-3.5" /></button>
                      ) : (
                        <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Unlock className="w-3.5 h-3.5" /></button>
                      )}
                      <button className="w-7 h-7 flex items-center justify-center rounded-brand-md hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Permission matrix tab */}
      {tab === 'matrix' && (
        <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[13px] text-muted-foreground">
              <Check className="w-3.5 h-3.5 inline text-success mr-1" /> Full access &nbsp;·&nbsp;
              <span className="inline-block w-3 h-0.5 bg-warning rounded-full align-middle mx-1" /> Limited &nbsp;·&nbsp;
              <X className="w-3 h-3 inline text-muted-foreground/40 mr-1" /> No access
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide w-[200px]">Module</th>
                  {roles.map(r => (
                    <th key={r.id} className="px-4 py-2.5 text-center">
                      <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', r.color)}>{r.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionMatrix.map((row, i) => (
                  <tr key={row.module} className={cn('border-b border-border last:border-0', i % 2 === 0 ? '' : 'bg-muted/20')}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <row.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{row.module}</span>
                      </div>
                    </td>
                    {roles.map(r => (
                      <td key={r.id} className="px-4 py-3 text-center">
                        <PermCell level={row.perms[r.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Maker-Checker View ──────────────────────────────────────────────────── */

function MakerCheckerView() {
  const [filter, setFilter] = useState<'all' | ApprovalStatus>('all');
  const [expandedId, setExpandedId] = useState<string | null>('APR-1041');

  const filtered = filter === 'all' ? approvalRequests : approvalRequests.filter(r => r.status === filter);
  const pendingCount = approvalRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-foreground font-heading">Maker-Checker Approvals</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Review and approve campaigns, templates, and sender IDs before they go live
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground px-3 py-2 border border-border rounded-brand-md transition-colors">
            <Settings className="w-4 h-4" /> Approval rules
          </button>
        </div>
      </div>

      {/* PROD-311 callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-brand-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-amber-900">
            Maker-Checker was buggy in Aura (PROD-311) — campaigns approved themselves without a second reviewer.
          </p>
          <p className="text-[12px] text-amber-700 mt-0.5">
            This implementation enforces: submitter ≠ approver, 48hr expiry, mandatory rejection reason. Self-approval is blocked at the API layer.
          </p>
        </div>
        <span className="text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full whitespace-nowrap">PROD-311</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Pending review',  value: pendingCount, cls: 'text-amber-600', sub: 'Needs action'      },
          { label: 'Approved today',  value: 2,            cls: 'text-success',   sub: 'Last: 15:00'       },
          { label: 'Rejected today',  value: 0,            cls: 'text-foreground',sub: 'All clear'          },
          { label: 'Avg review time', value: '1h 12m',     cls: 'text-foreground',sub: 'Last 7 days'       },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">{s.label}</p>
            <p className={cn('text-[24px] font-bold font-heading', s.cls)}>{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-brand-md w-fit">
        {(['all', 'pending', 'approved', 'rejected', 'expired'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'text-[13px] font-medium px-3.5 py-1.5 rounded-brand-sm transition-colors capitalize flex items-center gap-1.5',
              filter === f ? 'bg-card text-foreground shadow-el-1' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {f}
            {f === 'pending' && pendingCount > 0 && (
              <span className="w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Requests list */}
      <div className="space-y-3">
        {filtered.map(req => (
          <div key={req.id} className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
            {/* Row */}
            <div
              className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <TypeBadge type={req.type} />
                  <span className="text-[11px] text-muted-foreground font-mono">{req.id}</span>
                  {req.channel && (
                    <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{req.channel}</span>
                  )}
                </div>
                <p className="text-[14px] font-semibold text-foreground truncate">{req.title}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  by {req.submittedBy} · {req.submittedAt}
                </p>
              </div>
              <StatusBadge status={req.status} />
              <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', expandedId === req.id && 'rotate-180')} />
            </div>

            {/* Expanded detail */}
            {expandedId === req.id && (
              <div className="border-t border-border px-5 py-4 bg-muted/20">
                {req.status === 'pending' && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-[12px] font-semibold text-muted-foreground block mb-1.5">Review comment (optional)</label>
                      <textarea
                        className="w-full text-[13px] px-3 py-2 border border-border rounded-brand-md bg-card focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                        rows={2}
                        placeholder="Add a note for the submitter…"
                      />
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button className="flex items-center gap-2 bg-success text-white text-[13px] font-semibold px-5 py-2 rounded-brand-md hover:bg-success/90 transition-colors">
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button className="flex items-center gap-2 bg-destructive text-white text-[13px] font-semibold px-5 py-2 rounded-brand-md hover:bg-destructive/90 transition-colors">
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                )}
                {(req.status === 'approved' || req.status === 'rejected') && (
                  <div className="flex items-start gap-4 text-[13px]">
                    <div className="flex-1">
                      <p className="text-muted-foreground">
                        {req.status === 'approved' ? 'Approved' : 'Rejected'} by{' '}
                        <span className="font-semibold text-foreground">{req.reviewedBy}</span>
                        {' '}on {req.reviewedAt}
                      </p>
                      {req.comment && (
                        <p className="mt-1.5 text-[13px] bg-card border border-border rounded-brand-md px-3 py-2 text-foreground">
                          "{req.comment}"
                        </p>
                      )}
                    </div>
                    {req.prodRef && (
                      <span className="text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-300 px-2 py-1 rounded-full">{req.prodRef}</span>
                    )}
                  </div>
                )}
                {req.status === 'expired' && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <p className="text-[13px] text-muted-foreground">
                      This request expired after 48 hours with no review. The submitter can re-submit.
                    </p>
                    <button className="ml-auto flex items-center gap-1.5 text-[13px] text-primary hover:underline">
                      <RefreshCw className="w-3.5 h-3.5" /> Re-submit
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Audit Log View ─────────────────────────────────────────────────────── */

function AuditLogView() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All modules');

  const modules = ['All modules', 'Campaigns', 'Governance', 'Channels', 'Credits', 'Auth'];

  const filtered = auditLog.filter(e => {
    const matchSearch = !search ||
      e.actor.toLowerCase().includes(search.toLowerCase()) ||
      e.target.toLowerCase().includes(search.toLowerCase()) ||
      e.detail.toLowerCase().includes(search.toLowerCase());
    const matchModule = moduleFilter === 'All modules' || e.module === moduleFilter;
    return matchSearch && matchModule;
  });

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-foreground font-heading">Audit Log</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Immutable record of every action — who changed what, when. Retained for 2 years.
          </p>
        </div>
        <button className="flex items-center gap-2 border border-border text-foreground text-[13px] font-semibold px-4 py-2 rounded-brand-md hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Compliance callout */}
      <div className="bg-blue-50 border border-blue-200 rounded-brand-xl p-4 flex items-center gap-3">
        <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <p className="text-[13px] text-blue-800 flex-1">
          All entries are tamper-proof. Exported for VAPT audits, TRAI compliance, and BFSI regulatory submissions.
          Retained for <strong>24 months</strong>. Accessible to Admin and Manager roles only.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by user, action, or target…"
            className="w-full pl-8 pr-3 py-1.5 text-[13px] bg-card border border-border rounded-brand-md focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <div className="relative">
          <select
            value={moduleFilter}
            onChange={e => setModuleFilter(e.target.value)}
            className="text-[13px] border border-border bg-card rounded-brand-md px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
          >
            {modules.map(m => <option key={m}>{m}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
        <span className="text-[12px] text-muted-foreground ml-auto">{filtered.length} entries</span>
      </div>

      {/* Log table */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Timestamp</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Actor</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Action</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Detail</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Module</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">IP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, i) => (
              <tr key={entry.id} className={cn('border-b border-border last:border-0 hover:bg-muted/30 transition-colors', i % 2 === 0 ? '' : 'bg-muted/10')}>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap font-mono text-[12px]">
                  {entry.timestamp}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-primary">{entry.actor[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground leading-tight">{entry.actor}</p>
                      <p className="text-[11px] text-muted-foreground">{entry.ip}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <AuditActionChip action={entry.action} />
                </td>
                <td className="px-4 py-3 text-muted-foreground max-w-[320px]">
                  <p className="truncate">{entry.detail}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">{entry.module}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-[12px]">{entry.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <span className="text-[12px] text-muted-foreground">Showing {filtered.length} of {auditLog.length} entries</span>
          <button className="text-[12px] text-primary hover:underline flex items-center gap-1">
            Load more <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Governance Page ────────────────────────────────────────────────────── */

const navItems: { id: GovernanceSection; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'rbac',          label: 'Roles & Permissions', icon: Users2,        desc: 'RBAC + custom roles'   },
  { id: 'maker-checker', label: 'Maker-Checker',        icon: ClipboardCheck, desc: 'Approval workflows'   },
  { id: 'audit-log',     label: 'Audit Log',             icon: ScrollText,    desc: 'Immutable activity trail' },
];

const Governance = () => {
  const [active, setActive] = useState<GovernanceSection>('rbac');

  const pendingApprovals = approvalRequests.filter(r => r.status === 'pending').length;

  return (
    <AppLayout>
      <div className="flex h-full">

        {/* Left sub-nav */}
        <aside className="w-[248px] flex-shrink-0 border-r border-border bg-card h-full overflow-y-auto">
          <div className="p-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Controls</p>
            <div className="space-y-0.5">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-brand-md transition-colors text-left',
                    active === item.id
                      ? 'bg-primary/[0.07] text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold leading-tight">{item.label}</span>
                      {item.id === 'maker-checker' && pendingApprovals > 0 && (
                        <span className="w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">{pendingApprovals}</span>
                      )}
                    </div>
                    <p className="text-[11px] opacity-70 leading-tight mt-0.5 truncate">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {active === 'rbac'          && <RbacView />}
          {active === 'maker-checker' && <MakerCheckerView />}
          {active === 'audit-log'     && <AuditLogView />}
        </main>

      </div>
    </AppLayout>
  );
};

export default Governance;

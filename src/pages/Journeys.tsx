import { useState, useCallback, useRef, DragEvent } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeProps,
  Handle,
  Position,
  MarkerType,
  BackgroundVariant,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Route,
  Play,
  Pause,
  Plus,
  Search,
  ChevronRight,
  MessageSquare,
  Clock,
  GitBranch,
  Zap,
  Users,
  Tag,
  X,
  Settings,
  MoreHorizontal,
  Eye,
  Copy,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  Phone,
  Mail,
  Webhook,
  LayoutGrid,
  SplitSquareHorizontal,
  BellOff,
  Timer,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type JourneyStatus = 'active' | 'paused' | 'draft' | 'archived';

interface Journey {
  id: string;
  name: string;
  status: JourneyStatus;
  channels: string[];
  trigger: string;
  activeContacts: number;
  completions: number;
  conversionRate: string;
  updatedAt: string;
  description: string;
}

interface PaletteItem {
  type: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const journeys: Journey[] = [
  {
    id: 'J-001',
    name: 'Loan EMI Reminder Cascade',
    status: 'active',
    channels: ['WA', 'SMS', 'RCS'],
    trigger: 'Schedule — Daily 9 AM',
    activeContacts: 8412,
    completions: 24310,
    conversionRate: '73.2%',
    updatedAt: '2 hours ago',
    description: 'Multi-channel EMI reminder with WhatsApp first, SMS fallback, RCS for premium.',
  },
  {
    id: 'J-002',
    name: 'Welcome & Onboarding Flow',
    status: 'active',
    channels: ['WA', 'SMS'],
    trigger: 'Segment entry — New signups',
    activeContacts: 1203,
    completions: 9870,
    conversionRate: '81.5%',
    updatedAt: '1 day ago',
    description: 'Onboarding sequence for new customers with feature highlights and CTA.',
  },
  {
    id: 'J-003',
    name: 'OTP Delivery Fallback',
    status: 'active',
    channels: ['WA', 'SMS'],
    trigger: 'API / Webhook',
    activeContacts: 312,
    completions: 145230,
    conversionRate: '99.1%',
    updatedAt: '5 minutes ago',
    description: 'Tries WhatsApp OTP first, falls back to SMS if not delivered in 30s.',
  },
  {
    id: 'J-004',
    name: 'Diwali Re-engagement',
    status: 'paused',
    channels: ['WA', 'RCS'],
    trigger: 'Segment entry — Dormant 60d',
    activeContacts: 0,
    completions: 3820,
    conversionRate: '22.4%',
    updatedAt: '3 weeks ago',
    description: 'Seasonal re-engagement campaign paused after festival period.',
  },
  {
    id: 'J-005',
    name: 'KPN RCS Rich Onboarding',
    status: 'draft',
    channels: ['RCS'],
    trigger: 'Segment entry — KPN customers',
    activeContacts: 0,
    completions: 0,
    conversionRate: '—',
    updatedAt: '4 days ago',
    description: 'Rich RCS onboarding with carousels and quick replies for KPN account.',
  },
  {
    id: 'J-006',
    name: 'Account Statement Monthly',
    status: 'archived',
    channels: ['SMS', 'WA'],
    trigger: 'Schedule — 1st of month',
    activeContacts: 0,
    completions: 18400,
    conversionRate: '68.9%',
    updatedAt: '2 months ago',
    description: 'Monthly account statement delivery — replaced by Email channel.',
  },
];

const statusConfig: Record<JourneyStatus, { label: string; className: string }> = {
  active:   { label: 'Active',    className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  paused:   { label: 'Paused',    className: 'bg-amber-100 text-amber-700 border-amber-200' },
  draft:    { label: 'Draft',     className: 'bg-blue-100 text-blue-700 border-blue-200' },
  archived: { label: 'Archived',  className: 'bg-gray-100 text-gray-500 border-gray-200' },
};

const channelColors: Record<string, string> = {
  WA:  'bg-green-500',
  SMS: 'bg-indigo-500',
  RCS: 'bg-red-500',
  Email: 'bg-sky-500',
  Voice: 'bg-violet-500',
};

// ─── Palette Items ────────────────────────────────────────────────────────────

const paletteGroups: { label: string; items: PaletteItem[] }[] = [
  {
    label: 'Triggers',
    items: [
      { type: 'trigger',  label: 'Schedule',             icon: Clock,    color: 'bg-amber-100 text-amber-700' },
      { type: 'trigger',  label: 'Segment Entry',        icon: Users,    color: 'bg-amber-100 text-amber-700' },
      { type: 'trigger',  label: 'API / Webhook',        icon: Webhook,  color: 'bg-amber-100 text-amber-700' },
      { type: 'trigger',  label: 'Inaction / No Response', icon: BellOff, color: 'bg-amber-100 text-amber-700' },
    ],
  },
  {
    label: 'Messaging',
    items: [
      { type: 'send', label: 'Send WhatsApp', icon: MessageSquare, color: 'bg-green-100 text-green-700' },
      { type: 'send', label: 'Send SMS',      icon: Phone,         color: 'bg-indigo-100 text-indigo-700' },
      { type: 'send', label: 'Send RCS',      icon: Layers,        color: 'bg-red-100 text-red-700' },
      { type: 'send', label: 'Send Email',    icon: Mail,          color: 'bg-sky-100 text-sky-700' },
    ],
  },
  {
    label: 'Logic',
    items: [
      { type: 'waitEvent', label: 'Wait for Event', icon: Timer,                color: 'bg-teal-100 text-teal-700' },
      { type: 'condition', label: 'Condition',       icon: GitBranch,            color: 'bg-purple-100 text-purple-700' },
      { type: 'wait',      label: 'Wait / Delay',    icon: Clock,               color: 'bg-slate-100 text-slate-700' },
      { type: 'split',     label: 'A/B Split',       icon: SplitSquareHorizontal, color: 'bg-fuchsia-100 text-fuchsia-700' },
    ],
  },
  {
    label: 'Actions',
    items: [
      { type: 'action', label: 'Add Tag',         icon: Tag,        color: 'bg-blue-100 text-blue-700' },
      { type: 'action', label: 'Add to Segment',  icon: LayoutGrid, color: 'bg-blue-100 text-blue-700' },
      { type: 'end',    label: 'End Journey',     icon: CheckCircle2, color: 'bg-gray-100 text-gray-600' },
    ],
  },
];

// ─── Custom Nodes ─────────────────────────────────────────────────────────────

const handleStyle = { width: 10, height: 10 };

function TriggerNode({ data }: NodeProps) {
  return (
    <div className="bg-white border-2 border-amber-400 rounded-xl shadow-el-2 w-52 overflow-hidden">
      <div className="bg-amber-100 px-3 py-2 flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-amber-600" />
        <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Trigger</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[13px] font-semibold text-foreground leading-tight">{String(data.label ?? '')}</p>
        {data.sublabel && <p className="text-[11px] text-muted-foreground mt-0.5">{String(data.sublabel)}</p>}
      </div>
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
}

function SendNode({ data }: NodeProps) {
  const ch = String(data.channel ?? 'WA');
  const headerCls = ch === 'WA' ? 'bg-green-100' : ch === 'SMS' ? 'bg-indigo-100' : ch === 'RCS' ? 'bg-red-100' : 'bg-sky-100';
  const textCls   = ch === 'WA' ? 'text-green-700' : ch === 'SMS' ? 'text-indigo-700' : ch === 'RCS' ? 'text-red-700' : 'text-sky-700';
  const borderCls = ch === 'WA' ? 'border-green-300' : ch === 'SMS' ? 'border-indigo-300' : ch === 'RCS' ? 'border-red-300' : 'border-sky-300';

  return (
    <div className={cn('bg-white border-2 rounded-xl shadow-el-2 w-52 overflow-hidden', borderCls)}>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <div className={cn('px-3 py-2 flex items-center gap-2', headerCls)}>
        <MessageSquare className={cn('w-3.5 h-3.5', textCls)} />
        <span className={cn('text-[11px] font-bold uppercase tracking-wide', textCls)}>Send {ch}</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[13px] font-semibold text-foreground leading-tight">{String(data.label ?? '')}</p>
        {data.sublabel && <p className="text-[11px] text-muted-foreground mt-0.5">{String(data.sublabel)}</p>}
      </div>
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
}

function WaitNode({ data }: NodeProps) {
  return (
    <div className="bg-white border-2 border-slate-300 rounded-xl shadow-el-2 w-52 overflow-hidden">
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <div className="bg-slate-100 px-3 py-2 flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Wait</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[13px] font-semibold text-foreground">{String(data.label ?? '')}</p>
      </div>
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
}

function WaitEventNode({ data }: NodeProps) {
  return (
    <div className="bg-white border-2 border-teal-400 rounded-xl shadow-el-2 w-56 overflow-hidden">
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <div className="bg-teal-100 px-3 py-2 flex items-center gap-2">
        <Timer className="w-3.5 h-3.5 text-teal-700" />
        <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wide">Wait for Event</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[13px] font-semibold text-foreground leading-tight">{String(data.label ?? '')}</p>
        {data.sublabel && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{String(data.sublabel)}</p>
        )}
      </div>
      {/* Event occurred handle — left (green) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="event"
        style={{ ...handleStyle, left: '28%', background: '#10b981' }}
      />
      {/* Timed out handle — right (amber) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="timeout"
        style={{ ...handleStyle, left: '72%', background: '#f59e0b' }}
      />
      <div className="flex justify-between px-3 pb-1.5 mt-1">
        <span className="text-[9px] font-bold text-emerald-600">EVENT</span>
        <span className="text-[9px] font-bold text-amber-500">TIMEOUT</span>
      </div>
    </div>
  );
}

function ConditionNode({ data }: NodeProps) {
  return (
    <div className="bg-white border-2 border-purple-300 rounded-xl shadow-el-2 w-52 overflow-hidden">
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <div className="bg-purple-100 px-3 py-2 flex items-center gap-2">
        <GitBranch className="w-3.5 h-3.5 text-purple-700" />
        <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wide">Condition</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[13px] font-semibold text-foreground leading-tight">{String(data.label ?? '')}</p>
      </div>
      {/* Yes handle — left */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        style={{ ...handleStyle, left: '30%', background: '#10b981' }}
      />
      {/* No handle — right */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        style={{ ...handleStyle, left: '70%', background: '#ef4444' }}
      />
      <div className="flex justify-between px-3 pb-1.5 mt-1">
        <span className="text-[9px] font-bold text-emerald-600">YES</span>
        <span className="text-[9px] font-bold text-red-500">NO</span>
      </div>
    </div>
  );
}

function ActionNode({ data }: NodeProps) {
  return (
    <div className="bg-white border-2 border-blue-300 rounded-xl shadow-el-2 w-52 overflow-hidden">
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <div className="bg-blue-100 px-3 py-2 flex items-center gap-2">
        <Tag className="w-3.5 h-3.5 text-blue-700" />
        <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">Action</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[13px] font-semibold text-foreground">{String(data.label ?? '')}</p>
      </div>
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
}

function EndNode({ data: _data }: NodeProps) {
  return (
    <div className="bg-gray-800 border-2 border-gray-700 rounded-xl shadow-el-2 w-44 overflow-hidden">
      <Handle type="target" position={Position.Top} style={{ ...handleStyle, background: '#9ca3af' }} />
      <div className="px-3 py-3 flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-gray-300" />
        <span className="text-[12px] font-bold text-gray-200 uppercase tracking-wide">End Journey</span>
      </div>
    </div>
  );
}

const nodeTypes = {
  trigger:   TriggerNode,
  send:      SendNode,
  wait:      WaitNode,
  waitEvent: WaitEventNode,
  condition: ConditionNode,
  action:    ActionNode,
  end:       EndNode,
};

// ─── EMI Cascade — pre-loaded nodes & edges ───────────────────────────────────

const initialNodes: Node[] = [
  // ── Trigger ──────────────────────────────────────────────────────────────
  {
    id: 'n1', type: 'trigger', position: { x: 290, y: 20 },
    data: { label: 'Schedule — Daily 9 AM', sublabel: 'Weekdays only' },
  },
  // ── Send WA ───────────────────────────────────────────────────────────────
  {
    id: 'n2', type: 'send', position: { x: 290, y: 155 },
    data: { label: 'EMI Reminder v2', sublabel: 'WhatsApp template', channel: 'WA' },
  },
  // ── Wait for WA Open (24h timeout) ────────────────────────────────────────
  {
    id: 'n3', type: 'waitEvent', position: { x: 282, y: 300 },
    data: { label: 'WA Opened?', sublabel: 'Timeout: 24 hours' },
  },
  // ── EVENT path: tag + end ─────────────────────────────────────────────────
  {
    id: 'n4', type: 'action', position: { x: 60, y: 470 },
    data: { label: 'Add tag: EMI_ENGAGED' },
  },
  {
    id: 'n5', type: 'end', position: { x: 78, y: 590 },
    data: {},
  },
  // ── TIMEOUT path: Send SMS ────────────────────────────────────────────────
  {
    id: 'n6', type: 'send', position: { x: 500, y: 470 },
    data: { label: 'EMI Reminder SMS', sublabel: 'DLT template #1042', channel: 'SMS' },
  },
  // ── Wait for SMS Delivery (24h timeout) ───────────────────────────────────
  {
    id: 'n7', type: 'waitEvent', position: { x: 492, y: 615 },
    data: { label: 'SMS Delivered?', sublabel: 'Timeout: 24 hours' },
  },
  // ── EVENT path: end (delivered) ───────────────────────────────────────────
  {
    id: 'n8', type: 'end', position: { x: 360, y: 785 },
    data: {},
  },
  // ── TIMEOUT path: Send RCS ────────────────────────────────────────────────
  {
    id: 'n9', type: 'send', position: { x: 630, y: 785 },
    data: { label: 'EMI RCS Card', sublabel: 'RCS agent: ONEXTEL_MAIN', channel: 'RCS' },
  },
  {
    id: 'n10', type: 'end', position: { x: 648, y: 925 },
    data: {},
  },
];

const green  = { stroke: '#10b981', strokeWidth: 2 };
const amber  = { stroke: '#f59e0b', strokeWidth: 2 };
const gray   = { stroke: '#94a3b8', strokeWidth: 1.5 };
const arrowClosed = { type: MarkerType.ArrowClosed };

const initialEdges: Edge[] = [
  { id: 'e1-2',  source: 'n1',  target: 'n2',  style: gray,  markerEnd: arrowClosed },
  { id: 'e2-3',  source: 'n2',  target: 'n3',  style: gray,  markerEnd: arrowClosed },
  // WaitEvent — event (green) → tag, timeout (amber) → SMS
  { id: 'e3-4',  source: 'n3',  target: 'n4',  sourceHandle: 'event',   style: green, label: 'Opened',  markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
  { id: 'e4-5',  source: 'n4',  target: 'n5',  style: gray,  markerEnd: arrowClosed },
  { id: 'e3-6',  source: 'n3',  target: 'n6',  sourceHandle: 'timeout', style: amber, label: '24h timeout', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
  { id: 'e6-7',  source: 'n6',  target: 'n7',  style: gray,  markerEnd: arrowClosed },
  // WaitEvent — event (green) → end, timeout (amber) → RCS
  { id: 'e7-8',  source: 'n7',  target: 'n8',  sourceHandle: 'event',   style: green, label: 'Delivered', markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
  { id: 'e7-9',  source: 'n7',  target: 'n9',  sourceHandle: 'timeout', style: amber, label: '24h timeout', markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
  { id: 'e9-10', source: 'n9',  target: 'n10', style: gray,  markerEnd: arrowClosed },
];

// ─── Node Settings Panel ──────────────────────────────────────────────────────

function NodeSettingsPanel({ node, onClose }: { node: Node; onClose: () => void }) {
  const type = node.type as string;
  const label = String(node.data.label ?? '');

  return (
    <div className="absolute right-0 top-0 bottom-0 w-72 bg-white border-l border-border shadow-el-2 z-10 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">{type} node</p>
          <p className="text-[14px] font-semibold text-foreground mt-0.5 leading-tight">{label}</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {type === 'trigger' && (
          <>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Trigger Type</label>
              <select className="w-full text-[13px] border border-border rounded-brand-md px-3 py-2 bg-background">
                <option>Schedule</option>
                <option>Segment Entry</option>
                <option>API / Webhook</option>
                <option>Inaction / No Response</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Time</label>
              <Input defaultValue="09:00" type="time" className="text-[13px]" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Days</label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {['M','T','W','Th','F','Sa','Su'].map(d => (
                  <button key={d} className={cn('w-8 h-8 rounded-full text-[11px] font-bold border transition-colors',
                    ['M','T','W','Th','F'].includes(d)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-muted-foreground border-border hover:border-primary'
                  )}>{d}</button>
                ))}
              </div>
            </div>
            {/* Inaction-specific fields (shown for Inaction trigger type) */}
            <div className="border-t border-border pt-3">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-2">Inaction config</p>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">User did NOT</label>
              <select className="w-full text-[13px] border border-border rounded-brand-md px-3 py-2 bg-background mb-3">
                <option>Open message</option>
                <option>Click any link</option>
                <option>Reply</option>
                <option>Complete purchase</option>
              </select>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Within</label>
              <div className="flex gap-2">
                <Input defaultValue="24" type="number" className="text-[13px] w-20" />
                <select className="flex-1 text-[13px] border border-border rounded-brand-md px-3 py-2 bg-background">
                  <option>Hours</option>
                  <option>Days</option>
                </select>
              </div>
            </div>
          </>
        )}
        {type === 'send' && (
          <>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Channel</label>
              <select className="w-full text-[13px] border border-border rounded-brand-md px-3 py-2 bg-background">
                <option>WhatsApp</option>
                <option>SMS</option>
                <option>RCS</option>
                <option>Email</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Template</label>
              <select className="w-full text-[13px] border border-border rounded-brand-md px-3 py-2 bg-background">
                <option>EMI Reminder v2</option>
                <option>Payment Due Today</option>
                <option>Final Notice</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Sender</label>
              <select className="w-full text-[13px] border border-border rounded-brand-md px-3 py-2 bg-background">
                <option>+91-9999-ONEXTEL (default)</option>
                <option>ONXTEL (SMS)</option>
              </select>
            </div>
          </>
        )}
        {type === 'wait' && (
          <>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Duration</label>
              <div className="flex gap-2">
                <Input defaultValue="24" type="number" className="text-[13px] w-20" />
                <select className="flex-1 text-[13px] border border-border rounded-brand-md px-3 py-2 bg-background">
                  <option>Hours</option>
                  <option>Minutes</option>
                  <option>Days</option>
                </select>
              </div>
            </div>
          </>
        )}
        {type === 'waitEvent' && (
          <>
            <div className="bg-teal-50 border border-teal-200 rounded-lg px-3 py-2.5 text-[12px] text-teal-800">
              Waits for a user to perform an action. Takes the <strong>Event</strong> path immediately when it occurs, or the <strong>Timeout</strong> path if the window expires.
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Wait for event</label>
              <select className="w-full text-[13px] border border-border rounded-brand-md px-3 py-2 bg-background">
                <option>Message Opened</option>
                <option>Message Delivered</option>
                <option>Link Clicked</option>
                <option>Replied</option>
                <option>Button Tapped (RCS)</option>
                <option>Opted Out</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Timeout window</label>
              <div className="flex gap-2">
                <Input defaultValue="24" type="number" className="text-[13px] w-20" />
                <select className="flex-1 text-[13px] border border-border rounded-brand-md px-3 py-2 bg-background">
                  <option>Hours</option>
                  <option>Minutes</option>
                  <option>Days</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 text-[12px]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-muted-foreground"><strong className="text-foreground">Event path</strong> — user performed the action</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-muted-foreground"><strong className="text-foreground">Timeout path</strong> — window expired without action</span>
              </div>
            </div>
          </>
        )}
        {type === 'condition' && (
          <>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Condition</label>
              <select className="w-full text-[13px] border border-border rounded-brand-md px-3 py-2 bg-background">
                <option>Message Opened</option>
                <option>Message Delivered</option>
                <option>Link Clicked</option>
                <option>Replied</option>
                <option>Opted Out</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Evaluate after</label>
              <div className="flex gap-2">
                <Input defaultValue="24" type="number" className="text-[13px] w-20" />
                <select className="flex-1 text-[13px] border border-border rounded-brand-md px-3 py-2 bg-background">
                  <option>Hours</option>
                  <option>Minutes</option>
                </select>
              </div>
            </div>
          </>
        )}
        {type === 'action' && (
          <>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Action Type</label>
              <select className="w-full text-[13px] border border-border rounded-brand-md px-3 py-2 bg-background">
                <option>Add Tag</option>
                <option>Remove Tag</option>
                <option>Add to Segment</option>
                <option>Remove from Segment</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Tag / Segment</label>
              <Input defaultValue="EMI_ENGAGED" className="text-[13px]" />
            </div>
          </>
        )}
      </div>
      <div className="p-4 border-t border-border flex gap-2">
        <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-white text-[13px]">Save</Button>
        <Button size="sm" variant="outline" className="text-[13px]" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}

// ─── Journey Canvas ───────────────────────────────────────────────────────────

function JourneyCanvas({ journey, onBack }: { journey: Journey; onBack: () => void }) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeCounter, setNodeCounter] = useState(20);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge({ ...params, markerEnd: arrowClosed, style: gray }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!rfInstance || !reactFlowWrapper.current) return;

      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');
      if (!type) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = rfInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const id = `n${nodeCounter}`;
      setNodeCounter(c => c + 1);

      const newNode: Node = {
        id,
        type,
        position,
        data: { label: label || `New ${type}` },
      };

      // @ts-expect-error setNodes from useNodesState
      setEdges; // keep linter quiet
      rfInstance.setNodes((nds: Node[]) => [...nds, newNode]);
    },
    [rfInstance, nodeCounter, setEdges]
  );

  const onDragStart = (event: DragEvent<HTMLDivElement>, item: PaletteItem) => {
    event.dataTransfer.setData('application/reactflow/type', item.type);
    event.dataTransfer.setData('application/reactflow/label', item.label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-background">
      {/* Top bar */}
      <div className="h-14 border-b border-border bg-white flex items-center px-4 gap-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-[13px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Journeys
        </button>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-[14px] font-semibold text-foreground">{journey.name}</span>
        <Badge className={cn('border text-[11px] ml-1', statusConfig[journey.status].className)}>
          {statusConfig[journey.status].label}
        </Badge>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-[13px] gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Preview
          </Button>
          {journey.status === 'active' ? (
            <Button size="sm" className="text-[13px] gap-1.5 bg-amber-500 hover:bg-amber-600 text-white">
              <Pause className="w-3.5 h-3.5" />
              Pause
            </Button>
          ) : (
            <Button size="sm" className="text-[13px] gap-1.5 bg-primary hover:bg-primary/90 text-white">
              <Play className="w-3.5 h-3.5" />
              Activate
            </Button>
          )}
        </div>
      </div>

      {/* Body: palette + canvas + settings */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left palette */}
        <div className="w-56 border-r border-border bg-white flex flex-col overflow-y-auto flex-shrink-0">
          <div className="p-3 border-b border-border">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Node palette</p>
          </div>
          <div className="p-2 space-y-3">
            {paletteGroups.map(group => (
              <div key={group.label}>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1 mb-1">
                  {group.label}
                </p>
                {group.items.map(item => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-grab hover:bg-muted transition-colors mb-0.5"
                      draggable
                      onDragStart={e => onDragStart(e, item)}
                    >
                      <div className={cn('w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0', item.color)}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[12px] text-foreground font-medium">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            defaultEdgeOptions={{ markerEnd: arrowClosed, style: gray }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
            <Controls position="bottom-right" />
            <MiniMap
              position="bottom-left"
              nodeColor={(n) => {
                if (n.type === 'trigger')   return '#fbbf24';
                if (n.type === 'send')      return '#6366f1';
                if (n.type === 'waitEvent') return '#14b8a6';
                if (n.type === 'condition') return '#a855f7';
                if (n.type === 'wait')      return '#94a3b8';
                if (n.type === 'action')    return '#3b82f6';
                return '#374151';
              }}
              maskColor="rgba(255,255,255,0.6)"
            />
          </ReactFlow>
        </div>

        {/* Settings panel */}
        {selectedNode && (
          <NodeSettingsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
      </div>
    </div>
  );
}

// ─── Journey List ─────────────────────────────────────────────────────────────

function JourneyList({ onOpen }: { onOpen: (j: Journey) => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<JourneyStatus | 'all'>('all');

  const filtered = journeys.filter(j => {
    const matchSearch = j.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: 'Active journeys',   value: journeys.filter(j => j.status === 'active').length.toString(),  icon: Activity,   color: 'text-emerald-600' },
    { label: 'Contacts in-flight', value: '9,927',  icon: Users,       color: 'text-blue-600' },
    { label: 'Completions today',  value: '2,341',  icon: CheckCircle2, color: 'text-primary' },
    { label: 'Avg conversion',     value: '68.4%',  icon: TrendingUp,  color: 'text-purple-600' },
  ];

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading-xl font-bold text-foreground font-heading">Journey Automation</h1>
          <p className="text-body-sm text-muted-foreground mt-0.5">
            Build trigger-based, multi-channel automation flows
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white text-[13px] gap-1.5">
          <Plus className="w-4 h-4" />
          New Journey
        </Button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-brand-xl p-4 shadow-el-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn('w-4 h-4', s.color)} />
                <span className="text-[11px] text-muted-foreground font-medium">{s.label}</span>
              </div>
              <p className="text-[24px] font-bold text-foreground font-heading">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search journeys…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 text-[13px]"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(['all', 'active', 'paused', 'draft', 'archived'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors capitalize',
                statusFilter === s
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {s === 'all' ? 'All' : statusConfig[s as JourneyStatus].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-brand-xl shadow-el-1 overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Journey</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Channels</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Trigger</th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Active</th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Completions</th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Conversion</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((journey, i) => (
              <tr
                key={journey.id}
                className={cn(
                  'border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors',
                  i % 2 === 0 ? 'bg-white' : 'bg-muted/10'
                )}
                onClick={() => onOpen(journey)}
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Route className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{journey.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-muted-foreground text-[11px]">{journey.id}</span>
                        <span className="text-muted-foreground text-[11px]">·</span>
                        <span className="text-muted-foreground text-[11px]">{journey.updatedAt}</span>
                        <Badge className={cn('border text-[10px] px-1.5 py-0', statusConfig[journey.status].className)}>
                          {statusConfig[journey.status].label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1">
                    {journey.channels.map(ch => (
                      <span key={ch} className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white', channelColors[ch])}>
                        {ch[0]}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">{journey.trigger}</td>
                <td className="py-3.5 px-4 text-right font-medium">{journey.activeContacts.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-right text-muted-foreground">{journey.completions.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-right">
                  <span className={cn('font-semibold', journey.conversionRate !== '—' ? 'text-emerald-600' : 'text-muted-foreground')}>
                    {journey.conversionRate}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      onClick={e => { e.stopPropagation(); onOpen(journey); }}
                      title="Open canvas"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      onClick={e => e.stopPropagation()}
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-md hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500"
                      onClick={e => e.stopPropagation()}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      onClick={e => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

const Journeys = () => {
  const [mode, setMode] = useState<'list' | 'canvas'>('list');
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);

  const openCanvas = (journey: Journey) => {
    setActiveJourney(journey);
    setMode('canvas');
  };

  const backToList = () => {
    setMode('list');
    setActiveJourney(null);
  };

  if (mode === 'canvas' && activeJourney) {
    return <JourneyCanvas journey={activeJourney} onBack={backToList} />;
  }

  return (
    <AppLayout>
      <JourneyList onOpen={openCanvas} />
    </AppLayout>
  );
};

export default Journeys;

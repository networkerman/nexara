import React, { useState, useCallback } from 'react';
import {
  ArrowLeft, Plus, Trash2, Phone, ExternalLink, Copy,
  Type, Image as ImageIcon, Video, FileText, Hash,
  Info, AlertCircle, CheckCircle2, MessageSquare, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Types ──────────────────────────────────────────────────────────────── */

type CreateChannel = 'WhatsApp' | 'SMS' | 'RCS' | 'Email' | 'Voice';
type WaCategory   = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
type WaHeaderType = 'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
type WaTemplateType = 'STANDARD' | 'LTO' | 'CAROUSEL' | 'CATALOG';
type SmsType = 'TRANSACTIONAL' | 'PROMOTIONAL' | 'OTP' | 'SERVICE_IMPLICIT' | 'SERVICE_EXPLICIT';
type BtnType = 'QUICK_REPLY' | 'PHONE' | 'URL' | 'COPY_CODE';

interface WaBtn {
  id: string;
  type: BtnType;
  text: string;
  value?: string;
  urlType?: 'STATIC' | 'DYNAMIC';
}

interface WaState {
  name: string;
  category: WaCategory;
  language: string;
  templateType: WaTemplateType;
  headerType: WaHeaderType;
  headerText: string;
  body: string;
  footer: string;
  addOptOut: boolean;
  buttons: WaBtn[];
  varSamples: Record<string, string>;
}

interface SmsState {
  name: string;
  dltId: string;
  senderId: string;
  type: SmsType;
  body: string;
}

export interface CreateTemplateProps {
  channel: CreateChannel;
  onBack: () => void;
}

/* ─── Constants ──────────────────────────────────────────────────────────── */

const WA_LANGUAGES = [
  { code: 'en',    label: 'English' },
  { code: 'en_US', label: 'English (US)' },
  { code: 'hi',    label: 'Hindi' },
  { code: 'mr',    label: 'Marathi' },
  { code: 'ta',    label: 'Tamil' },
  { code: 'te',    label: 'Telugu' },
  { code: 'kn',    label: 'Kannada' },
  { code: 'gu',    label: 'Gujarati' },
  { code: 'bn',    label: 'Bengali' },
  { code: 'pa',    label: 'Punjabi' },
];

const SMS_SENDER_IDS = ['SBISMS', 'CREDMS', 'HEROMS', 'KPNTXT', 'CRISIN'];

const DEFAULT_WA: WaState = {
  name: '', category: 'MARKETING', language: 'en', templateType: 'STANDARD',
  headerType: 'NONE', headerText: '', body: '', footer: '',
  addOptOut: false, buttons: [], varSamples: {},
};

const DEFAULT_SMS: SmsState = {
  name: '', dltId: '', senderId: 'SBISMS', type: 'TRANSACTIONAL', body: '',
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/__+/g, '_');
}

function extractVars(text: string): string[] {
  const m = text.match(/\{\{(\d+)\}\}/g) || [];
  return [...new Set(m)].sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, ''));
    const nb = parseInt(b.replace(/\D/g, ''));
    return na - nb;
  });
}

function countSms(text: string) {
  const len = text.length;
  const parts = len === 0 ? 0 : len <= 160 ? 1 : Math.ceil(len / 153);
  return { chars: len, parts };
}

/* ─── Shared field components ────────────────────────────────────────────── */

function FormSection({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-[12px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function FieldLabel({ label, required, hint }: { label: string; required?: boolean; hint?: string }) {
  return (
    <label className="flex items-center gap-1 text-[12px] font-medium text-foreground mb-1.5">
      {label}
      {required && <span className="text-red-500">*</span>}
      {hint && <span title={hint}><Info className="w-3 h-3 text-muted-foreground cursor-help" /></span>}
    </label>
  );
}

function FInput({ value, onChange, placeholder, maxLength, className }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; maxLength?: number; className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={cn(
        'w-full px-3 py-2 text-[13px] bg-background border border-border rounded-brand-md',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
        'placeholder:text-muted-foreground',
        className,
      )}
    />
  );
}

function FSelect({ value, onChange, options, className }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; className?: string;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={cn(
        'w-full px-3 py-2 text-[13px] bg-background border border-border rounded-brand-md',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer',
        className,
      )}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function FTextarea({ value, onChange, placeholder, maxLength, rows = 5 }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; maxLength?: number; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      rows={rows}
      className={cn(
        'w-full px-3 py-2 text-[13px] bg-background border border-border rounded-brand-md resize-none',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
        'placeholder:text-muted-foreground leading-relaxed',
      )}
    />
  );
}

/* ─── WA Phone preview ──────────────────────────────────────────────────── */

function WaPhonePreview({ wa }: { wa: WaState }) {
  const vars = extractVars(wa.body);
  let bodyDisplay = wa.body || 'Your message body will appear here...';
  vars.forEach(v => {
    const n = v.replace(/[{}]/g, '');
    bodyDisplay = bodyDisplay.replace(v, wa.varSamples[n] || v);
  });

  return (
    <div className="mx-auto w-[224px]">
      <div className="relative bg-[#ECE5DD] rounded-[28px] border-[3px] border-gray-700 shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="bg-gray-700 h-5 flex items-center justify-center">
          <div className="w-12 h-2 bg-gray-600 rounded-full" />
        </div>
        {/* WA top bar */}
        <div className="bg-[#075E54] px-3 py-2 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/30 flex-shrink-0" />
          <span className="text-white text-[11px] font-semibold">Template Preview</span>
        </div>
        {/* Chat */}
        <div className="min-h-[300px] p-2 flex flex-col gap-1 overflow-y-auto">
          <div className="text-[8px] text-gray-500 text-center py-1 bg-white/50 rounded-full w-16 mx-auto">Today</div>
          {/* Bubble */}
          <div className="bg-white rounded-lg rounded-tl-none shadow-sm overflow-hidden max-w-[92%] text-[10px]">
            {/* Header */}
            {wa.headerType === 'TEXT' && wa.headerText && (
              <div className="px-2.5 pt-2.5 font-bold text-gray-900 text-[11px]">{wa.headerText}</div>
            )}
            {wa.headerType === 'IMAGE' && (
              <div className="bg-gray-200 h-16 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
            {wa.headerType === 'VIDEO' && (
              <div className="bg-gray-800 h-16 flex items-center justify-center">
                <Video className="w-6 h-6 text-white/60" />
              </div>
            )}
            {wa.headerType === 'DOCUMENT' && (
              <div className="bg-gray-100 h-10 flex items-center gap-1.5 px-2.5">
                <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-600 text-[9px]">document.pdf</span>
              </div>
            )}
            {/* Body */}
            <div className="px-2.5 py-2 text-gray-800 leading-relaxed whitespace-pre-wrap text-[10px]">
              {bodyDisplay}
            </div>
            {/* Footer */}
            {(wa.footer || wa.addOptOut) && (
              <div className="px-2.5 pb-1.5 text-gray-400 text-[8px] leading-snug">
                {wa.footer}
                {wa.addOptOut && (wa.footer ? ' · ' : '') + 'Stop promotions'}
              </div>
            )}
            {/* Timestamp */}
            <div className="px-2.5 pb-1.5 text-right text-gray-400 text-[8px]">10:24 ✓✓</div>
            {/* Buttons */}
            {wa.buttons.length > 0 && (
              <div className="border-t border-gray-100">
                {wa.buttons.slice(0, 3).map(btn => (
                  <div
                    key={btn.id}
                    className="flex items-center justify-center gap-1 py-1.5 text-[10px] font-medium text-[#00A884] border-b border-gray-100 last:border-0"
                  >
                    {btn.type === 'PHONE'     && <Phone className="w-2.5 h-2.5" />}
                    {btn.type === 'URL'       && <ExternalLink className="w-2.5 h-2.5" />}
                    {btn.type === 'COPY_CODE' && <Copy className="w-2.5 h-2.5" />}
                    <span>{btn.text || (
                      btn.type === 'QUICK_REPLY' ? 'Quick Reply' :
                      btn.type === 'PHONE'       ? 'Call us' :
                      btn.type === 'URL'         ? 'Learn more' : 'Copy code'
                    )}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-2">Live preview</p>
    </div>
  );
}

/* ─── SMS Phone preview ─────────────────────────────────────────────────── */

function SmsPhonePreview({ sms }: { sms: SmsState }) {
  const { chars, parts } = countSms(sms.body);
  return (
    <div className="mx-auto w-[224px]">
      <div className="relative bg-white rounded-[28px] border-[3px] border-gray-700 shadow-2xl overflow-hidden">
        <div className="bg-gray-700 h-5 flex items-center justify-center">
          <div className="w-12 h-2 bg-gray-600 rounded-full" />
        </div>
        <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 text-center">
          <p className="text-[11px] font-semibold text-gray-800">{sms.senderId || 'SENDER'}</p>
          <p className="text-[9px] text-gray-400">Messages</p>
        </div>
        <div className="min-h-[280px] bg-white p-3 flex flex-col gap-2">
          <div className="text-[9px] text-gray-400 text-center">Today</div>
          {sms.body ? (
            <div className="bg-gray-200 rounded-2xl rounded-tl-none px-3 py-2 max-w-[90%]">
              <p className="text-[10px] text-gray-900 leading-relaxed whitespace-pre-wrap">{sms.body}</p>
            </div>
          ) : (
            <p className="text-[10px] text-gray-300 italic">Your SMS will appear here...</p>
          )}
        </div>
        <div className="bg-gray-50 border-t border-gray-200 px-3 py-1.5 flex items-center justify-between">
          <span className="text-[9px] text-gray-500">{chars} chars</span>
          <span className={cn('text-[9px] font-semibold', parts > 1 ? 'text-amber-600' : 'text-gray-400')}>
            {parts > 0 ? `${parts} SMS part${parts > 1 ? 's' : ''}` : '—'}
          </span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-2">Live preview</p>
    </div>
  );
}

/* ─── Step indicator ────────────────────────────────────────────────────── */

function StepIndicator({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const n = i + 1;
        const done    = current > n;
        const active  = current === n;
        return (
          <React.Fragment key={n}>
            <div className="flex items-center gap-1.5">
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors',
                done || active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground',
              )}>
                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : n}
              </div>
              <span className={cn(
                'text-[12px] font-medium whitespace-nowrap',
                active ? 'text-foreground' : 'text-muted-foreground',
              )}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('w-8 h-px transition-colors', current > n ? 'bg-primary' : 'bg-border')} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Page chrome (shared header + footer) ──────────────────────────────── */

function PageChrome({
  title, badge, onBack, stepBar, preview, footer, children,
}: {
  title: string;
  badge?: React.ReactNode;
  onBack: () => void;
  stepBar?: React.ReactNode;
  preview: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex-shrink-0 px-8 py-4 border-b border-border flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Templates
        </button>
        <div className="w-px h-4 bg-border" />
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        {badge && <div className="ml-1">{badge}</div>}
        {stepBar && <div className="ml-auto">{stepBar}</div>}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden flex min-h-0">
        {/* Form */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {children}
        </div>

        {/* Preview sidebar */}
        <div className="w-[276px] flex-shrink-0 border-l border-border bg-muted/20 flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[12px] font-semibold text-foreground">Live preview</p>
            <p className="text-[11px] text-muted-foreground">Updates as you type</p>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6 flex items-start justify-center">
            {preview}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex-shrink-0 px-8 py-4 border-t border-border bg-background">
        {footer}
      </div>
    </div>
  );
}

/* ─── WA Creator ────────────────────────────────────────────────────────── */

function WaCreator({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [wa, setWa] = useState<WaState>(DEFAULT_WA);

  const update = useCallback((patch: Partial<WaState>) => setWa(s => ({ ...s, ...patch })), []);

  const addBtn = (type: BtnType) => {
    if (wa.buttons.length >= 3) return;
    update({
      buttons: [...wa.buttons, {
        id: Math.random().toString(36).slice(2),
        type,
        text: type === 'QUICK_REPLY' ? '' : type === 'PHONE' ? 'Call us' : type === 'URL' ? 'Learn more' : 'Copy code',
        urlType: type === 'URL' ? 'STATIC' : undefined,
      }],
    });
  };

  const removeBtn = (id: string) => update({ buttons: wa.buttons.filter(b => b.id !== id) });
  const patchBtn  = (id: string, p: Partial<WaBtn>) =>
    update({ buttons: wa.buttons.map(b => b.id === id ? { ...b, ...p } : b) });

  const insertVar = () => {
    const n = extractVars(wa.body).length + 1;
    update({ body: wa.body + `{{${n}}}` });
  };

  const vars     = extractVars(wa.body);
  const isStep1Ok = wa.name.length > 0 && /^[a-z0-9_]+$/.test(wa.name);
  const isStep2Ok = wa.body.length > 0;

  const footer = (
    <div className="flex items-center justify-between">
      <button
        onClick={() => step > 1 ? setStep((step - 1) as 1 | 2 | 3) : onBack()}
        className="px-4 py-2 text-[13px] font-medium text-muted-foreground border border-border rounded-brand-md hover:bg-muted transition-colors"
      >
        {step === 1 ? 'Cancel' : '← Back'}
      </button>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-[13px] font-medium text-muted-foreground border border-border rounded-brand-md hover:bg-muted transition-colors">
          Save as Draft
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep((step + 1) as 2 | 3)}
            disabled={step === 1 ? !isStep1Ok : !isStep2Ok}
            className={cn(
              'px-4 py-2 text-[13px] font-medium rounded-brand-md transition-colors',
              (step === 1 && !isStep1Ok) || (step === 2 && !isStep2Ok)
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90',
            )}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={onBack}
            className="px-5 py-2 text-[13px] font-semibold bg-primary text-white rounded-brand-md hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Submit for Approval
          </button>
        )}
      </div>
    </div>
  );

  return (
    <PageChrome
      title="Create WhatsApp Template"
      onBack={onBack}
      stepBar={<StepIndicator current={step} steps={['Setup', 'Build', 'Review']} />}
      preview={<WaPhonePreview wa={wa} />}
      footer={footer}
    >
      {/* ── Step 1: Setup ─────────────────────────────────────── */}
      {step === 1 && (
        <div className="max-w-[560px] space-y-6">
          <FormSection title="Template details" subtitle="Basic settings that Meta uses to categorise and route your template">

            {/* Name */}
            <div>
              <FieldLabel label="Template name" required hint="Lowercase letters, numbers, and underscores only. Cannot be changed after approval." />
              <FInput
                value={wa.name}
                onChange={v => update({ name: slugify(v) })}
                placeholder="e.g. order_confirmation_v2"
                maxLength={512}
              />
              {wa.name && !/^[a-z0-9_]+$/.test(wa.name) && (
                <p className="text-[11px] text-red-500 mt-1">Only lowercase letters, numbers, and underscores</p>
              )}
            </div>

            {/* Category */}
            <div>
              <FieldLabel label="Category" required hint="Determines message cost tier. Marketing is highest, Authentication is lowest." />
              <div className="grid grid-cols-3 gap-2">
                {([
                  { v: 'MARKETING',      l: 'Marketing',      d: 'Promotions, offers & recommendations' },
                  { v: 'UTILITY',        l: 'Utility',        d: 'Transactional updates & alerts' },
                  { v: 'AUTHENTICATION', l: 'Authentication', d: 'OTPs & security verification codes' },
                ] as { v: WaCategory; l: string; d: string }[]).map(c => (
                  <button
                    key={c.v}
                    onClick={() => update({ category: c.v })}
                    className={cn(
                      'p-3 rounded-brand-md border text-left transition-all',
                      wa.category === c.v ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
                    )}
                  >
                    <p className={cn('text-[12px] font-semibold', wa.category === c.v ? 'text-primary' : 'text-foreground')}>
                      {c.l}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{c.d}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Language + Template type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Language" required />
                <FSelect
                  value={wa.language}
                  onChange={v => update({ language: v })}
                  options={WA_LANGUAGES.map(l => ({ value: l.code, label: l.label }))}
                />
              </div>
              {wa.category !== 'AUTHENTICATION' && (
                <div>
                  <FieldLabel label="Template type" hint="Standard is the default. LTO adds expiry timers. Carousel adds multiple cards." />
                  <FSelect
                    value={wa.templateType}
                    onChange={v => update({ templateType: v as WaTemplateType })}
                    options={[
                      { value: 'STANDARD',  label: 'Standard' },
                      { value: 'LTO',       label: 'Limited Time Offer' },
                      { value: 'CAROUSEL',  label: 'Carousel (multi-card)' },
                      { value: 'CATALOG',   label: 'Catalog / Product' },
                    ]}
                  />
                </div>
              )}
            </div>

            {/* Auth note */}
            {wa.category === 'AUTHENTICATION' && (
              <div className="rounded-brand-md bg-amber-50 border border-amber-200 p-3 flex gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-semibold text-amber-900">Authentication template restrictions</p>
                  <p className="text-[12px] text-amber-700 mt-0.5">
                    Body text is pre-defined by Meta and cannot be edited. You can set OTP expiry duration and button type (Copy Code or One-Tap Autofill) in the next step.
                  </p>
                </div>
              </div>
            )}
          </FormSection>
        </div>
      )}

      {/* ── Step 2: Build ─────────────────────────────────────── */}
      {step === 2 && (
        <div className="max-w-[560px] space-y-7">

          {/* Header */}
          {wa.category !== 'AUTHENTICATION' && (
            <FormSection title="Header" subtitle="Optional. Appears above the body text.">
              <div className="flex flex-wrap gap-2">
                {([
                  { t: 'NONE',     l: 'None',     Icon: null },
                  { t: 'TEXT',     l: 'Text',     Icon: Type },
                  { t: 'IMAGE',    l: 'Image',    Icon: ImageIcon },
                  { t: 'VIDEO',    l: 'Video',    Icon: Video },
                  { t: 'DOCUMENT', l: 'Document', Icon: FileText },
                ] as { t: WaHeaderType; l: string; Icon: any }[]).map(h => (
                  <button
                    key={h.t}
                    onClick={() => update({ headerType: h.t })}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-brand-md border text-[12px] font-medium transition-all',
                      wa.headerType === h.t
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                    )}
                  >
                    {h.Icon && <h.Icon className="w-3.5 h-3.5" />}
                    {h.l}
                  </button>
                ))}
              </div>
              {wa.headerType === 'TEXT' && (
                <FInput
                  value={wa.headerText}
                  onChange={v => update({ headerText: v })}
                  placeholder="Header text (max 60 characters)"
                  maxLength={60}
                />
              )}
              {['IMAGE', 'VIDEO', 'DOCUMENT'].includes(wa.headerType) && (
                <div className="border-2 border-dashed border-border rounded-brand-md p-4 text-center bg-muted/20">
                  <p className="text-[12px] text-muted-foreground">
                    {wa.headerType === 'IMAGE'    ? 'Upload image — JPG or PNG, max 5 MB' :
                     wa.headerType === 'VIDEO'    ? 'Upload video — MP4, max 16 MB' :
                                                   'Upload document — PDF, max 100 MB'}
                  </p>
                  <button className="mt-2 px-3 py-1.5 text-[12px] font-medium text-primary border border-primary/40 rounded-brand-md hover:bg-primary/5 transition-colors">
                    Choose file
                  </button>
                </div>
              )}
            </FormSection>
          )}

          {/* Body */}
          <FormSection
            title="Body"
            subtitle={wa.category === 'AUTHENTICATION'
              ? 'Pre-defined by Meta — cannot be edited for Authentication templates'
              : 'Main message content. Max 1,024 characters.'}
          >
            {wa.category === 'AUTHENTICATION' ? (
              <div className="px-3 py-2.5 bg-muted/50 border border-border rounded-brand-md text-[13px] text-muted-foreground italic">
                {'{{1}} is your verification code. For your security, do not share this code.'}
              </div>
            ) : (
              <div className="space-y-2">
                <FTextarea
                  value={wa.body}
                  onChange={v => update({ body: v })}
                  placeholder={'Enter your message body. Use {{1}}, {{2}} for dynamic variables.\n\nExample: Dear {{1}}, your order {{2}} has been confirmed!'}
                  maxLength={1024}
                  rows={5}
                />
                <div className="flex items-center justify-between">
                  <button
                    onClick={insertVar}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-brand-md border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                  >
                    <Hash className="w-3 h-3" />
                    Insert variable
                  </button>
                  <span className="text-[11px] text-muted-foreground">{wa.body.length} / 1024</span>
                </div>

                {/* Variable sample values */}
                {vars.length > 0 && (
                  <div className="rounded-brand-md border border-border bg-muted/20 p-3 space-y-2.5">
                    <p className="text-[11px] font-semibold text-foreground">
                      Sample values <span className="font-normal text-muted-foreground">(required by Meta for template review)</span>
                    </p>
                    {vars.map(v => {
                      const n = v.replace(/[{}]/g, '');
                      return (
                        <div key={v} className="flex items-center gap-3">
                          <code className="text-[11px] bg-muted px-1.5 py-0.5 rounded text-primary w-10 text-center flex-shrink-0">{v}</code>
                          <FInput
                            value={wa.varSamples[n] || ''}
                            onChange={val => update({ varSamples: { ...wa.varSamples, [n]: val } })}
                            placeholder={`Sample value for ${v}`}
                            className="text-[12px] py-1.5"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </FormSection>

          {/* Footer */}
          {wa.category !== 'AUTHENTICATION' && (
            <FormSection title="Footer" subtitle="Optional — small text below the body. Max 60 characters.">
              <FInput
                value={wa.footer}
                onChange={v => update({ footer: v })}
                placeholder="e.g. Reply STOP to unsubscribe"
                maxLength={60}
              />
              {wa.category === 'MARKETING' && (
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wa.addOptOut}
                    onChange={e => update({ addOptOut: e.target.checked })}
                    className="mt-0.5 w-3.5 h-3.5 rounded border-border accent-primary"
                  />
                  <span className="text-[12px] text-muted-foreground leading-snug">
                    Add marketing opt-out text{' '}
                    <em className="not-italic text-muted-foreground/70">(recommended for Marketing category — improves template quality score)</em>
                  </span>
                </label>
              )}
            </FormSection>
          )}

          {/* Buttons */}
          <FormSection title="Buttons" subtitle="Add up to 3 buttons — Quick Reply or Call to Action">
            <div className="space-y-2">
              {wa.buttons.map((btn, i) => (
                <div key={btn.id} className="rounded-brand-md border border-border p-3 space-y-2 bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'text-[10px] font-bold px-1.5 py-0.5 rounded-brand-xs uppercase tracking-wide',
                        btn.type === 'QUICK_REPLY' ? 'bg-blue-100 text-blue-700' :
                        btn.type === 'PHONE'       ? 'bg-green-100 text-green-700' :
                        btn.type === 'URL'         ? 'bg-purple-100 text-purple-700' :
                                                     'bg-amber-100 text-amber-700',
                      )}>
                        {btn.type === 'QUICK_REPLY' ? 'Quick Reply' :
                         btn.type === 'PHONE'       ? 'Call' :
                         btn.type === 'URL'         ? 'URL' : 'Copy Code'}
                      </span>
                      <span className="text-[11px] text-muted-foreground">Button {i + 1}</span>
                    </div>
                    <button
                      onClick={() => removeBtn(btn.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <FInput
                    value={btn.text}
                    onChange={v => patchBtn(btn.id, { text: v })}
                    placeholder="Button label text"
                    maxLength={25}
                    className="text-[12px] py-1.5"
                  />
                  {btn.type === 'PHONE' && (
                    <FInput
                      value={btn.value || ''}
                      onChange={v => patchBtn(btn.id, { value: v })}
                      placeholder="+91 98765 43210"
                      className="text-[12px] py-1.5"
                    />
                  )}
                  {btn.type === 'URL' && (
                    <div className="space-y-2">
                      <div className="flex gap-1.5">
                        {(['STATIC', 'DYNAMIC'] as const).map(ut => (
                          <button
                            key={ut}
                            onClick={() => patchBtn(btn.id, { urlType: ut })}
                            className={cn(
                              'px-2.5 py-1 text-[11px] rounded-brand-md border transition-colors',
                              btn.urlType === ut
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border text-muted-foreground hover:border-primary/30',
                            )}
                          >
                            {ut === 'STATIC' ? 'Static URL' : 'Dynamic URL'}
                          </button>
                        ))}
                      </div>
                      <FInput
                        value={btn.value || ''}
                        onChange={v => patchBtn(btn.id, { value: v })}
                        placeholder={btn.urlType === 'DYNAMIC' ? 'https://example.com/order/{{1}}' : 'https://example.com/sale'}
                        className="text-[12px] py-1.5"
                      />
                    </div>
                  )}
                </div>
              ))}

              {wa.buttons.length < 3 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {([
                    { type: 'QUICK_REPLY' as BtnType, label: 'Quick Reply',  Icon: MessageSquare },
                    { type: 'PHONE'       as BtnType, label: 'Call number',  Icon: Phone },
                    { type: 'URL'         as BtnType, label: 'Visit URL',    Icon: ExternalLink },
                    { type: 'COPY_CODE'   as BtnType, label: 'Copy code',    Icon: Copy },
                  ]).map(b => (
                    <button
                      key={b.type}
                      onClick={() => addBtn(b.type)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-brand-md border border-dashed border-border text-[12px] text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-muted/30 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <b.Icon className="w-3 h-3" />
                      {b.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </FormSection>
        </div>
      )}

      {/* ── Step 3: Review ────────────────────────────────────── */}
      {step === 3 && (
        <div className="max-w-[560px] space-y-6">
          <FormSection title="Review before submitting" subtitle="Once submitted, Meta typically reviews templates within 24–48 hours.">
            <div className="rounded-brand-md border border-border overflow-hidden bg-card">
              {[
                { label: 'Template name', value: wa.name || '—' },
                { label: 'Category',      value: wa.category },
                { label: 'Language',      value: WA_LANGUAGES.find(l => l.code === wa.language)?.label ?? wa.language },
                { label: 'Template type', value: wa.templateType },
                { label: 'Header',        value: wa.headerType === 'NONE' ? 'None' : wa.headerType === 'TEXT' ? `Text: "${wa.headerText}"` : wa.headerType },
                { label: 'Footer',        value: wa.footer || 'None' },
                { label: 'Buttons',       value: wa.buttons.length > 0 ? `${wa.buttons.length} button${wa.buttons.length > 1 ? 's' : ''}` : 'None' },
              ].map((row, i) => (
                <div key={row.label} className={cn('flex items-start gap-4 px-4 py-3', i > 0 && 'border-t border-border')}>
                  <span className="text-[12px] text-muted-foreground w-36 flex-shrink-0">{row.label}</span>
                  <span className="text-[12px] font-medium text-foreground">{row.value}</span>
                </div>
              ))}
              <div className="border-t border-border px-4 py-3">
                <span className="text-[12px] text-muted-foreground">Body</span>
                <p className="text-[12px] font-medium text-foreground mt-1.5 leading-relaxed whitespace-pre-wrap bg-muted/40 px-3 py-2 rounded-brand-md">
                  {wa.body || '—'}
                </p>
              </div>
            </div>
          </FormSection>

          <div className="rounded-brand-md bg-blue-50 border border-blue-200 p-4 flex gap-3">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] font-semibold text-blue-900">Meta review: 24–48 hours</p>
              <p className="text-[12px] text-blue-700 mt-0.5">
                You'll receive a notification and email when the status changes. Track status in Saved templates under the Pending tab.
              </p>
            </div>
          </div>

          <div className="rounded-brand-md bg-amber-50 border border-amber-200 p-4 flex gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] font-semibold text-amber-900">Quality signals that affect approval</p>
              <ul className="text-[12px] text-amber-700 mt-1 space-y-0.5 list-disc list-inside">
                <li>Marketing templates without opt-out may be downgraded</li>
                <li>Variable samples must be realistic (not placeholder text)</li>
                <li>URL buttons must link to the registered business domain</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </PageChrome>
  );
}

/* ─── SMS Creator ───────────────────────────────────────────────────────── */

function SmsCreator({ onBack }: { onBack: () => void }) {
  const [sms, setSms] = useState<SmsState>(DEFAULT_SMS);
  const update = useCallback((patch: Partial<SmsState>) => setSms(s => ({ ...s, ...patch })), []);
  const { chars, parts } = countSms(sms.body);

  const insertVar = () => {
    const count = (sms.body.match(/\{#var\d*#\}/g) || []).length;
    update({ body: sms.body + `{#var${count + 1}#}` });
  };

  const isValid = sms.name.length > 0 && sms.dltId.length > 0 && sms.body.length > 0;

  const footer = (
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        className="px-4 py-2 text-[13px] font-medium text-muted-foreground border border-border rounded-brand-md hover:bg-muted transition-colors"
      >
        Cancel
      </button>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-[13px] font-medium text-muted-foreground border border-border rounded-brand-md hover:bg-muted transition-colors">
          Save as Draft
        </button>
        <button
          disabled={!isValid}
          onClick={onBack}
          className={cn(
            'px-5 py-2 text-[13px] font-semibold rounded-brand-md transition-colors flex items-center gap-2',
            isValid ? 'bg-primary text-white hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed',
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
          Submit for Approval
        </button>
      </div>
    </div>
  );

  return (
    <PageChrome
      title="Create SMS Template"
      badge={<span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-brand-xs uppercase tracking-wide">DLT Required</span>}
      onBack={onBack}
      preview={<SmsPhonePreview sms={sms} />}
      footer={footer}
    >
      <div className="max-w-[560px] space-y-6">

        <FormSection title="Template details">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Template name" required />
              <FInput
                value={sms.name}
                onChange={v => update({ name: slugify(v) })}
                placeholder="e.g. otp_verification"
                maxLength={50}
              />
            </div>
            <div>
              <FieldLabel label="DLT Template ID" required hint="The 14-19 digit ID assigned by TRAI for this template via your telecom PE registration" />
              <FInput
                value={sms.dltId}
                onChange={v => update({ dltId: v.replace(/\D/g, '') })}
                placeholder="1234567890123456"
                maxLength={19}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Sender ID" required />
              <FSelect
                value={sms.senderId}
                onChange={v => update({ senderId: v })}
                options={SMS_SENDER_IDS.map(id => ({ value: id, label: id }))}
              />
            </div>
            <div>
              <FieldLabel label="Template type" required hint="Determines routing path and DND override rules" />
              <FSelect
                value={sms.type}
                onChange={v => update({ type: v as SmsState['type'] })}
                options={[
                  { value: 'TRANSACTIONAL',    label: 'Transactional' },
                  { value: 'PROMOTIONAL',      label: 'Promotional' },
                  { value: 'OTP',              label: 'OTP' },
                  { value: 'SERVICE_IMPLICIT', label: 'Service Implicit' },
                  { value: 'SERVICE_EXPLICIT', label: 'Service Explicit' },
                ]}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Message body" subtitle="Must exactly match the TRAI-registered template. Use {#var1#}, {#var2#} for dynamic values.">
          <FTextarea
            value={sms.body}
            onChange={v => update({ body: v })}
            placeholder={'Dear {#var1#}, your OTP is {#var2#}. Valid for 10 minutes. Do not share. - SBISMS'}
            maxLength={1000}
            rows={5}
          />
          <div className="flex items-center justify-between">
            <button
              onClick={insertVar}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-brand-md border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              <Hash className="w-3 h-3" />
              Insert variable
            </button>
            <div className="flex items-center gap-4 text-[11px]">
              <span className={cn('font-medium', chars > 160 ? 'text-amber-600' : 'text-muted-foreground')}>
                {chars} chars
              </span>
              <span className={cn('font-semibold', parts > 1 ? 'text-amber-600' : 'text-muted-foreground')}>
                {parts > 0 ? `${parts} SMS${parts > 1 ? ' parts' : ' part'}` : '—'}
              </span>
            </div>
          </div>
          {parts > 1 && (
            <div className="flex gap-2 rounded-brand-md bg-amber-50 border border-amber-200 p-3">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700">
                Messages over 160 characters are split and billed as {parts} separate SMS.
              </p>
            </div>
          )}
        </FormSection>

        <div className="rounded-brand-md bg-blue-50 border border-blue-200 p-4 flex gap-3">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] font-semibold text-blue-900">DLT compliance</p>
            <p className="text-[12px] text-blue-700 mt-0.5">
              The exact template text (including variable positions) must match your TRAI DLT registration. Mismatches cause delivery failures on Airtel, Vi, and BSNL routes.
            </p>
          </div>
        </div>
      </div>
    </PageChrome>
  );
}

/* ─── Phase 2 placeholder ────────────────────────────────────────────────── */

function Phase2({ channel, onBack }: { channel: string; onBack: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-8 bg-background">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <Clock className="w-6 h-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-[15px] font-semibold text-foreground">{channel} template editor</p>
        <p className="text-[13px] text-muted-foreground mt-1">Coming in Phase 2</p>
      </div>
      <button onClick={onBack} className="text-[13px] text-primary hover:underline mt-1">
        ← Back to templates
      </button>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────────────── */

export function CreateTemplate({ channel, onBack }: CreateTemplateProps) {
  if (channel === 'WhatsApp') return <WaCreator onBack={onBack} />;
  if (channel === 'SMS')       return <SmsCreator onBack={onBack} />;
  return <Phase2 channel={channel} onBack={onBack} />;
}

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useDevMode } from '@/context/DevModeContext';
import { cn } from '@/lib/utils';
import {
  Code2,
  ChevronLeft,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  FlaskConical,
  Key,
  Webhook,
  Terminal,
  AlertTriangle,
  Shield,
  Zap,
  Globe,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

/* ─── Mock data ───────────────────────────────────────────────────────────── */

const apiKeys = [
  {
    id: 'live',
    label: 'Live key',
    env: 'Production',
    key: 'oxl_live_sk_Kh9aP2mNzWqR7vLtXdY4jFcB3eGsUiOp',
    created: '12 Jan 2026',
    lastUsed: '25 May 2026, 11:42',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    id: 'test',
    label: 'Test key',
    env: 'Sandbox',
    key: 'oxl_test_sk_Mk1bZ8nVwEfR2uHsYgC5jXtA9qDpLrOn',
    created: '12 Jan 2026',
    lastUsed: '24 May 2026, 09:15',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
];

const webhooks = [
  { event: 'message.delivered',   desc: 'DLR received from operator'            },
  { event: 'message.failed',      desc: 'Final failure — no more retries'        },
  { event: 'campaign.completed',  desc: 'All sends dispatched for a campaign'    },
  { event: 'journey.enrolled',    desc: 'Contact entered a journey'              },
  { event: 'journey.exited',      desc: 'Contact completed or exited a journey'  },
  { event: 'approval.requested',  desc: 'New Maker-Checker request pending'      },
];

/* ─── Code snippet definitions ──────────────────────────────────────────── */

type Lang = 'cURL' | 'JavaScript' | 'Python';

const snippets: Record<string, Record<Lang, string>> = {
  'Send SMS': {
    cURL: `curl -X POST https://api.onextel.com/v1/messages \\
  -H "Authorization: Bearer {API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "sms",
    "to": "+919876543210",
    "sender_id": "SBISMS",
    "template_id": "tmpl_abc123",
    "variables": { "name": "Ramesh", "otp": "847291" }
  }'`,
    JavaScript: `const response = await fetch('https://api.onextel.com/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${API_KEY}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    channel: 'sms',
    to: '+919876543210',
    sender_id: 'SBISMS',
    template_id: 'tmpl_abc123',
    variables: { name: 'Ramesh', otp: '847291' },
  }),
});
const data = await response.json();
console.log(data.message_id); // msg_7fKp2mNzWqR`,
    Python: `import httpx

response = httpx.post(
    'https://api.onextel.com/v1/messages',
    headers={'Authorization': f'Bearer {API_KEY}'},
    json={
        'channel': 'sms',
        'to': '+919876543210',
        'sender_id': 'SBISMS',
        'template_id': 'tmpl_abc123',
        'variables': {'name': 'Ramesh', 'otp': '847291'},
    }
)
print(response.json()['message_id'])  # msg_7fKp2mNzWqR`,
  },
  'Create Campaign': {
    cURL: `curl -X POST https://api.onextel.com/v1/campaigns \\
  -H "Authorization: Bearer {API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "May OTP Blast",
    "channel": "sms",
    "template_id": "tmpl_abc123",
    "segment_id": "seg_xyz789",
    "schedule": { "type": "immediate" }
  }'`,
    JavaScript: `const response = await fetch('https://api.onextel.com/v1/campaigns', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${API_KEY}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'May OTP Blast',
    channel: 'sms',
    template_id: 'tmpl_abc123',
    segment_id: 'seg_xyz789',
    schedule: { type: 'immediate' },
  }),
});
const { campaign_id } = await response.json();`,
    Python: `import httpx

response = httpx.post(
    'https://api.onextel.com/v1/campaigns',
    headers={'Authorization': f'Bearer {API_KEY}'},
    json={
        'name': 'May OTP Blast',
        'channel': 'sms',
        'template_id': 'tmpl_abc123',
        'segment_id': 'seg_xyz789',
        'schedule': {'type': 'immediate'},
    }
)
campaign_id = response.json()['campaign_id']`,
  },
  'Trigger Journey': {
    cURL: `curl -X POST https://api.onextel.com/v1/journeys/{journey_id}/enroll \\
  -H "Authorization: Bearer {API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contact_id": "ctc_9mKpQrZn",
    "properties": {
      "plan": "premium",
      "signup_date": "2026-05-25"
    }
  }'`,
    JavaScript: `const response = await fetch(
  \`https://api.onextel.com/v1/journeys/\${JOURNEY_ID}/enroll\`,
  {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contact_id: 'ctc_9mKpQrZn',
      properties: { plan: 'premium', signup_date: '2026-05-25' },
    }),
  }
);
const { enrollment_id } = await response.json();`,
    Python: `import httpx

response = httpx.post(
    f'https://api.onextel.com/v1/journeys/{JOURNEY_ID}/enroll',
    headers={'Authorization': f'Bearer {API_KEY}'},
    json={
        'contact_id': 'ctc_9mKpQrZn',
        'properties': {'plan': 'premium', 'signup_date': '2026-05-25'},
    }
)
enrollment_id = response.json()['enrollment_id']`,
  },
};

/* ─── Small components ───────────────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={copy}
      className="p-1.5 rounded-brand-md hover:bg-muted transition-colors"
      title="Copy"
    >
      {copied
        ? <Check className="w-3.5 h-3.5 text-success" />
        : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
    </button>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0',
        checked ? 'bg-primary' : 'bg-muted-foreground/30',
      )}
    >
      <span
        className={cn(
          'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-1',
        )}
      />
    </button>
  );
}

/* ─── Section: API Keys ──────────────────────────────────────────────────── */

function ApiKeysSection() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const mask = (key: string) =>
    key.substring(0, 14) + '•'.repeat(20) + key.substring(key.length - 6);

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-[15px] font-semibold text-foreground font-heading flex items-center gap-2">
          <Key className="w-4 h-4 text-primary" /> API Keys
        </h3>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Use your live key for production traffic. Test key sends are free and never dispatched to real networks.
        </p>
      </div>

      <div className="space-y-2">
        {apiKeys.map((k) => (
          <div
            key={k.id}
            className="bg-card border border-border rounded-brand-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', k.bg, k.color)}>
                  {k.env}
                </span>
                <span className="text-[13px] font-semibold text-foreground">{k.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded-brand-md hover:bg-muted transition-colors"
                  title="Regenerate key"
                >
                  <RefreshCw className="w-3 h-3" /> Rotate
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-muted/50 rounded-brand-md px-3 py-2">
              <code className="flex-1 text-[12px] font-mono text-foreground truncate">
                {revealed[k.id] ? k.key : mask(k.key)}
              </code>
              <button
                onClick={() => setRevealed(r => ({ ...r, [k.id]: !r[k.id] }))}
                className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
              >
                {revealed[k.id]
                  ? <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                  : <Eye className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
              <CopyButton text={k.key} />
            </div>

            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span>Created {k.created}</span>
              <span>·</span>
              <span>Last used {k.lastUsed}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Section: Sandbox ───────────────────────────────────────────────────── */

function SandboxSection() {
  const { sandboxEnabled, setSandboxEnabled } = useDevMode();

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-[15px] font-semibold text-foreground font-heading flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-amber-500" /> Sandbox
        </h3>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Sandbox requests use your test key and never reach real networks. Messages, campaigns, and journey enrollments are simulated. Counts appear in reports marked "sandbox".
        </p>
      </div>

      <div className="bg-card border border-border rounded-brand-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-foreground">
              {sandboxEnabled ? 'Sandbox active — no real messages will be sent' : 'Production mode'}
            </p>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              {sandboxEnabled
                ? 'All API calls and UI actions are intercepted and mocked.'
                : 'Toggle to switch to sandbox. A banner will appear across the platform.'}
            </p>
          </div>
          <Toggle checked={sandboxEnabled} onChange={setSandboxEnabled} />
        </div>

        {sandboxEnabled && (
          <div className="mt-3 flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-brand-md px-3 py-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-700 dark:text-amber-400">
              Sandbox mode is active. A <strong>SANDBOX</strong> badge is visible in the top bar. Turn this off before going live.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Section: Code snippets ─────────────────────────────────────────────── */

function CodeSnippetsSection() {
  const [activeExample, setActiveExample] = useState<keyof typeof snippets>('Send SMS');
  const [activeLang, setActiveLang] = useState<Lang>('cURL');
  const { sandboxEnabled } = useDevMode();

  const code = snippets[activeExample][activeLang];
  const displayCode = sandboxEnabled
    ? code.replace('{API_KEY}', 'oxl_test_sk_Mk1bZ8nVwEfR2uHsYgC5jXtA9qDpLrOn')
    : code.replace('{API_KEY}', 'oxl_live_sk_Kh9aP2mNzWqR7vLtXdY4jFcB3eGsUiOp');

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-[15px] font-semibold text-foreground font-heading flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" /> Code Examples
        </h3>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Copy-ready examples for the most common API actions.
          {sandboxEnabled && <span className="text-amber-500 font-medium"> Using test key — sandbox mode.</span>}
        </p>
      </div>

      <div className="bg-card border border-border rounded-brand-xl overflow-hidden">
        {/* Example selector */}
        <div className="flex border-b border-border px-4 gap-0 overflow-x-auto">
          {Object.keys(snippets).map((ex) => (
            <button
              key={ex}
              onClick={() => setActiveExample(ex as keyof typeof snippets)}
              className={cn(
                'text-[12px] font-medium py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap',
                activeExample === ex
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Language tabs + copy */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border">
          <div className="flex gap-1">
            {(['cURL', 'JavaScript', 'Python'] as Lang[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={cn(
                  'text-[11px] font-semibold px-2.5 py-1 rounded-brand-md transition-colors',
                  activeLang === lang
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-muted',
                )}
              >
                {lang}
              </button>
            ))}
          </div>
          <CopyButton text={displayCode} />
        </div>

        {/* Code block */}
        <div className="p-4 overflow-x-auto">
          <pre className="text-[12px] font-mono text-foreground leading-relaxed whitespace-pre">
            {displayCode}
          </pre>
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Webhooks ──────────────────────────────────────────────────── */

function WebhooksSection() {
  const [endpoint, setEndpoint] = useState('https://your-server.com/onextel-webhook');
  const [editing, setEditing] = useState(false);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    'message.delivered': true,
    'message.failed': true,
    'campaign.completed': false,
    'journey.enrolled': false,
    'journey.exited': false,
    'approval.requested': true,
  });

  const secret = 'whsec_Kp9mQrZnWvEx2uHsYgC5jXtA9qDpLrOnMk1b';

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-[15px] font-semibold text-foreground font-heading flex items-center gap-2">
          <Webhook className="w-4 h-4 text-primary" /> Webhooks
        </h3>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          OneXtel will POST signed payloads to your endpoint for the events you enable. Verify with the signing secret.
        </p>
      </div>

      <div className="bg-card border border-border rounded-brand-xl p-4 space-y-4">
        {/* Endpoint */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-foreground">Endpoint URL</label>
          {editing ? (
            <div className="flex gap-2">
              <input
                className="flex-1 bg-muted border border-border rounded-brand-md px-3 py-2 text-[13px] font-mono text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              />
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 bg-primary text-white text-[12px] font-semibold rounded-brand-md"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-muted/50 rounded-brand-md px-3 py-2">
              <Globe className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <code className="flex-1 text-[12px] font-mono text-foreground truncate">{endpoint}</code>
              <button
                onClick={() => setEditing(true)}
                className="text-[11px] text-primary hover:underline flex-shrink-0"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Signing secret */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-foreground">Signing Secret</label>
          <div className="flex items-center gap-2 bg-muted/50 rounded-brand-md px-3 py-2">
            <Shield className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <code className="flex-1 text-[12px] font-mono text-foreground truncate">
              {'whsec_' + '•'.repeat(32)}
            </code>
            <CopyButton text={secret} />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Verify the <code className="bg-muted px-1 rounded">X-OneXtel-Signature</code> header on every webhook to confirm authenticity.
          </p>
        </div>

        {/* Events */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-foreground">Events</label>
          <div className="divide-y divide-border">
            {webhooks.map((w) => (
              <div key={w.event} className="flex items-center justify-between py-2.5 gap-3">
                <div className="min-w-0">
                  <code className="text-[12px] font-mono text-foreground">{w.event}</code>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{w.desc}</p>
                </div>
                <Toggle
                  checked={enabled[w.event]}
                  onChange={(v) => setEnabled(e => ({ ...e, [w.event]: v }))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */

export default function SettingsDevelopers() {
  const { devModeEnabled, setDevModeEnabled } = useDevMode();

  return (
    <AppLayout>
      <div className="p-8 max-w-[760px] mx-auto space-y-8">

        {/* Back link */}
        <NavLink
          to="/settings"
          className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Settings
        </NavLink>

        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 bg-secondary rounded-brand-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-foreground" />
              </div>
              <h2 className="text-heading-xl font-bold text-foreground font-heading">Developer Mode</h2>
            </div>
            <p className="text-body-sm text-muted-foreground">
              For engineers integrating with the OneXtel API. Enable to access keys, sandbox, code examples, and webhook config.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[13px] font-medium text-muted-foreground">
              {devModeEnabled ? 'On' : 'Off'}
            </span>
            <Toggle checked={devModeEnabled} onChange={setDevModeEnabled} />
          </div>
        </div>

        {/* Locked state */}
        {!devModeEnabled && (
          <div className="bg-muted/50 border border-border rounded-brand-xl p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-foreground">Developer Mode is off</p>
              <p className="text-[13px] text-muted-foreground mt-1 max-w-sm mx-auto">
                Enable it to access API keys, sandbox mode, code examples, and webhook configuration.
                A banner will appear across the platform while active.
              </p>
            </div>
            <button
              onClick={() => setDevModeEnabled(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-[13px] font-semibold rounded-brand-md hover:bg-primary/90 transition-colors"
            >
              <Code2 className="w-4 h-4" /> Enable Developer Mode
            </button>
          </div>
        )}

        {/* Developer Mode content */}
        {devModeEnabled && (
          <div className="space-y-8">
            <ApiKeysSection />
            <SandboxSection />
            <CodeSnippetsSection />
            <WebhooksSection />
          </div>
        )}

      </div>
    </AppLayout>
  );
}

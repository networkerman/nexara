/**
 * Channel brand icons — use these everywhere a channel needs a visual identity.
 * All accept a standard `className` prop so they drop in as Lucide icon replacements.
 *
 * Usage:
 *   import { WhatsAppIcon, SMSIcon, RCSIcon, EmailIcon, VoiceIcon } from '@/components/icons/ChannelIcons';
 *   <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
 *
 * Brand colours (use as default when no className overrides color):
 *   WhatsApp  → #25D366
 *   RCS       → #4285F4  (Google blue)
 *   SMS       → #6366F1  (indigo — no universal brand colour)
 *   Email     → #0EA5E9  (sky — no universal brand colour)
 *   Voice     → #8B5CF6  (violet — no universal brand colour)
 */

interface IconProps {
  className?: string;
}

/* ── WhatsApp ─────────────────────────────────────────────────────────────── */
// Official WhatsApp brand mark (Simple Icons path)
export const WhatsAppIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="WhatsApp">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085" />
  </svg>
);

/* ── RCS / Google Messages ────────────────────────────────────────────────── */
// Google Messages-style speech bubble with Google multicolour dots
export const RCSIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="RCS">
    <rect x="2" y="3" width="20" height="14" rx="3" fill="currentColor" opacity="0.15" />
    <rect x="2" y="3" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 21l4-4h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Google-style coloured dots */}
    <circle cx="8"  cy="10" r="1.5" fill="#4285F4" />
    <circle cx="12" cy="10" r="1.5" fill="#EA4335" />
    <circle cx="16" cy="10" r="1.5" fill="#34A853" />
  </svg>
);

/* ── SMS ──────────────────────────────────────────────────────────────────── */
// Classic SMS speech bubble with text lines
export const SMSIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="SMS">
    <path
      d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
      fill="currentColor"
      opacity="0.15"
    />
    <path
      d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <line x1="7" y1="9"  x2="17" y2="9"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="7" y1="13" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ── Email ────────────────────────────────────────────────────────────────── */
// Classic envelope with open flap (more distinctive than Lucide Mail)
export const EmailIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Email">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" opacity="0.15" />
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M2 7l9.293 6.293a1 1 0 001.414 0L22 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/* ── Voice ────────────────────────────────────────────────────────────────── */
// Telephone handset with outgoing sound waves
export const VoiceIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Voice">
    <path
      d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
      fill="currentColor"
      opacity="0.15"
    />
    <path
      d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Sound waves */}
    <path d="M15.5 7a4.5 4.5 0 010 6"   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18 4.5a8 8 0 010 11"       stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);

/* ── Convenience map (matches Channel type) ──────────────────────────────── */
export const CHANNEL_ICONS = {
  WhatsApp: WhatsAppIcon,
  RCS:      RCSIcon,
  SMS:      SMSIcon,
  Email:    EmailIcon,
  Voice:    VoiceIcon,
} as const;

export type ChannelIconKey = keyof typeof CHANNEL_ICONS;

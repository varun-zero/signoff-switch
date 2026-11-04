import React from 'react';
import { AgentProvider, PlatformBridge, VerticalId } from '../engine/signoffEngine';

interface LogoProps {
  className?: string;
}

/**
 * Custom Signoff Brand Mark: Interlocking Switch rooms + Tropical Mint human sign-off chamber.
 */
export const SignoffBrandLogo: React.FC<LogoProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="signoffVioletGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#5323E3" />
      </linearGradient>
      <linearGradient id="signoffMintGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00F5A0" />
        <stop offset="100%" stopColor="#88F9C0" />
      </linearGradient>
      <filter id="brandGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#00F5A0" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Room 1 (Agent Intelligence Room - Electric Violet) */}
    <rect x="3" y="4" width="23" height="23" rx="6" fill="#0E0B28" stroke="url(#signoffVioletGrad)" strokeWidth="2.2" />
    <circle cx="9.5" cy="10" r="2" fill="#A78BFA" />
    <rect x="13.5" y="9" width="8" height="2" rx="1" fill="#7C3AED" />
    <rect x="9.5" y="15" width="12" height="2" rx="1" fill="#4B3B82" />
    {/* Interlocking Room 2 (Human Sign-Off Gate Chamber - Tropical Mint) */}
    <rect x="14" y="13" width="23" height="23" rx="6" fill="#041812" stroke="url(#signoffMintGrad)" strokeWidth="2.2" />
    {/* Glowing Human Signoff Node */}
    <circle cx="25.5" cy="24.5" r="7.5" fill="#0B2B20" stroke="url(#signoffMintGrad)" strokeWidth="1.8" filter="url(#brandGlow)" />
    <path
      d="M22 24.5L24.5 27L29.5 21.5"
      stroke="#00F5A0"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Authentic Discord Logo with official Blurple (#5865F2) and Clyde mark
 */
export const DiscordLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <rect width="24" height="24" rx="5.5" fill="#5865F2" />
    <path
      fill="#FFFFFF"
      d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.16 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.02.02.05.03.08.02 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.03-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"
    />
  </svg>
);

/**
 * Authentic 4-color Slack Pinwheel Logo (#E01E5A, #36C5F0, #2EB67D, #ECB22E)
 */
export const SlackLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <rect width="24" height="24" rx="5.5" fill="#1A1D21" />
    <g transform="translate(1.5, 1.5) scale(0.875)">
      {/* Top Left (Aubergine Pink #E01E5A) */}
      <path d="M5.04 15.17a2.52 2.52 0 0 1-2.52 2.52A2.52 2.52 0 0 1 0 15.17a2.52 2.52 0 0 1 2.52-2.52h2.52v2.52z" fill="#E01E5A" />
      <path d="M6.31 15.17a2.52 2.52 0 0 1 2.52-2.52 2.52 2.52 0 0 1 2.52 2.52v6.31A2.52 2.52 0 0 1 8.83 24a2.52 2.52 0 0 1-2.52-2.52v-6.31z" fill="#E01E5A" />
      {/* Top Right (Cyan #36C5F0) */}
      <path d="M8.83 5.04a2.52 2.52 0 0 1-2.52-2.52A2.52 2.52 0 0 1 8.83 0a2.52 2.52 0 0 1 2.52 2.52v2.52h-2.52z" fill="#36C5F0" />
      <path d="M8.83 6.31a2.52 2.52 0 0 1 2.52 2.52 2.52 2.52 0 0 1-2.52 2.52H2.52A2.52 2.52 0 0 1 0 8.83a2.52 2.52 0 0 1 2.52-2.52h6.31z" fill="#36C5F0" />
      {/* Bottom Right (Green #2EB67D) */}
      <path d="M18.96 8.83a2.52 2.52 0 0 1 2.52-2.52A2.52 2.52 0 0 1 24 8.83a2.52 2.52 0 0 1-2.52 2.52h-2.52v-2.52z" fill="#2EB67D" />
      <path d="M17.69 8.83a2.52 2.52 0 0 1-2.52 2.52 2.52 2.52 0 0 1-2.52-2.52V2.52A2.52 2.52 0 0 1 15.17 0a2.52 2.52 0 0 1 2.52 2.52v6.31z" fill="#2EB67D" />
      {/* Bottom Left (Yellow #ECB22E) */}
      <path d="M15.17 18.96a2.52 2.52 0 0 1 2.52 2.52A2.52 2.52 0 0 1 15.17 24a2.52 2.52 0 0 1-2.52-2.52v-2.52h2.52z" fill="#ECB22E" />
      <path d="M15.17 17.69a2.52 2.52 0 0 1-2.52-2.52 2.52 2.52 0 0 1 2.52-2.52h6.31A2.52 2.52 0 0 1 24 15.17a2.52 2.52 0 0 1-2.52 2.52h-6.31z" fill="#ECB22E" />
    </g>
  </svg>
);

/**
 * Authentic Microsoft Teams Multi-tone Purple 3D Layered Logo
 */
export const TeamsLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="teamsBackGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#535BC9" />
        <stop offset="100%" stopColor="#313682" />
      </linearGradient>
      <linearGradient id="teamsFrontGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7B83EB" />
        <stop offset="100%" stopColor="#4F52B2" />
      </linearGradient>
    </defs>
    {/* Base container badge */}
    <rect width="24" height="24" rx="5.5" fill="#1F2342" />
    {/* Back shield & avatars */}
    <rect x="9.5" y="4.5" width="11" height="13" rx="3" fill="url(#teamsBackGrad)" />
    <circle cx="15.5" cy="8" r="2" fill="#9DA6F9" />
    <path d="M12.5 14c0-1.6 1.4-2.8 3-2.8s3 1.2 3 2.8v2.2h-6V14z" fill="#9DA6F9" />
    {/* Front "T" Tile with gentle offset */}
    <rect x="3.5" y="6" width="11" height="13" rx="2.5" fill="url(#teamsFrontGrad)" stroke="#1F2342" strokeWidth="0.8" />
    <path d="M6.2 9.2h5.6v1.7H9.9v5.6H8.1v-5.6H6.2V9.2z" fill="#FFFFFF" />
  </svg>
);

/**
 * Authentic Telegram Sky-Blue Gradient Badge with White Folded Plane
 */
export const TelegramLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="tgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2AABEE" />
        <stop offset="100%" stopColor="#229ED9" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="11" fill="url(#tgGrad)" />
    <path
      d="M5.4 11.8l11.2-4.3c.5-.2 1 .1.8.7l-1.9 8.9c-.1.5-.5.7-1 .4l-2.7-2-1.3 1.2c-.2.2-.3.3-.6.3l.2-2.7 4.9-4.5c.2-.2 0-.3-.3-.1l-6.1 3.9-2.6-.8c-.6-.2-.6-.6.2-.9z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Authentic OpenCode Developer CLI Badge with Terminal Prompt
 */
export const OpenCodeLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="opencodeGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <rect x="2" y="2.5" width="20" height="19" rx="5" fill="#0A1118" stroke="url(#opencodeGrad)" strokeWidth="1.6" />
    {/* Terminal buttons */}
    <circle cx="6" cy="6.8" r="1.1" fill="#EF4444" />
    <circle cx="9.2" cy="6.8" r="1.1" fill="#F59E0B" />
    <circle cx="12.4" cy="6.8" r="1.1" fill="#10B981" />
    {/* Terminal Code Glyphs */}
    <path d="M6 13.5l3.2 2-3.2 2M11.5 17.5h5.5" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/**
 * Authentic Google AI / Antigravity Multiverse Sparkle Emblem (Blue, Red, Yellow, Green)
 */
export const AntigravityLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="antiGeminiGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="30%" stopColor="#8AB4F8" />
        <stop offset="65%" stopColor="#EA4335" />
        <stop offset="100%" stopColor="#FBBC04" />
      </linearGradient>
      <linearGradient id="antiCoreGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1A73E8" />
        <stop offset="100%" stopColor="#34A853" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="5.5" fill="#0D1117" />
    {/* 4-point Google Gemini Star */}
    <path
      d="M12 3C12 7.8 8.2 12 3.5 12C8.2 12 12 16.2 12 21C12 16.2 15.8 12 20.5 12C15.8 12 12 7.8 12 3Z"
      fill="url(#antiGeminiGrad)"
    />
    <circle cx="12" cy="12" r="3.2" fill="url(#antiCoreGlow)" />
    <circle cx="12" cy="12" r="1.4" fill="#FFFFFF" />
  </svg>
);

/**
 * Authentic Anthropic Claude Terracotta Warm Sunburst Emblem (#D97706 / #CC785C)
 */
export const ClaudeLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="claudeGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E27855" />
        <stop offset="100%" stopColor="#C45A33" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="5.5" fill="#261814" />
    <path
      d="M13.8 4.6h-3.6l-.45 3.5a5.5 5.5 0 0 0-2.5 1.45l-3.1-1.75-1.8 3.1 2.65 2.35a5.6 5.6 0 0 0 0 2.9L2.35 18.5l1.8 3.1 3.1-1.75a5.5 5.5 0 0 0 2.5 1.45l.45 3.5h3.6l.45-3.5a5.5 5.5 0 0 0 2.5-1.45l3.1 1.75 1.8-3.1-2.65-2.35a5.6 5.6 0 0 0 0-2.9l2.65-2.35-1.8-3.1-3.1 1.75a5.5 5.5 0 0 0-2.5-1.45l-.45-3.5z"
      fill="url(#claudeGrad)"
    />
    <circle cx="12" cy="12" r="3" fill="#F8E7DF" />
  </svg>
);

/**
 * Authentic OpenAI Codex Knot Rosette in Vivid Emerald Mint (#10A37E)
 */
export const CodexLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="openaiGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10A37E" />
        <stop offset="100%" stopColor="#006C4E" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="5.5" fill="#0C1B17" />
    <path
      d="M18.8 10.4a4.9 4.9 0 0 0-.44-3.4 5 5 0 0 0-3.45-2.42 5 5 0 0 0-3.86.7 5 5 0 0 0-2.94 3.1 5 5 0 0 0 .47 5.22 4.9 4.9 0 0 0 .44 3.4 5 5 0 0 0 3.45 2.42 5 5 0 0 0 3.86-.7 5 5 0 0 0 2.94-3.1 5 5 0 0 0-.47-5.22zm-5.88 9a3.6 3.6 0 0 1-2.3-.82l.12-.07 2.98-1.72a.72.72 0 0 0 .37-.62v-4.2l1.25.72v3.12a3.58 3.58 0 0 1-2.42 3.59zm-6.18-2.94a3.58 3.58 0 0 1-.44-2.4l.12.07 2.98 1.73a.72.72 0 0 0 .72 0l3.63-2.1v1.45L11.1 16.8a3.58 3.58 0 0 1-4.36-.34zm-.97-6.77a3.58 3.58 0 0 1 1.87-1.58V11.5l3.63 2.1a.72.72 0 0 0 .72 0l3.63-2.1V9.95l-2.7-1.56a3.58 3.58 0 0 1-7.15-.31zm11.7 2.62l-3.63-2.1a.72.72 0 0 0-.72 0L9.8 12.3V10.85l2.7-1.56a3.58 3.58 0 0 1 5.3 2.98v.04zm.97 4.15a3.58 3.58 0 0 1-1.87 1.58v-3.42l-3.63-2.1a.72.72 0 0 0-.72 0l-3.63 2.1v1.45l2.7 1.56a3.58 3.58 0 0 1 7.15.33z"
      fill="#10A37E"
    />
  </svg>
);

/**
 * Authentic Python 3.13 Logo (Blue #3776AB & Yellow #FFD43B)
 */
export const PythonLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      d="M11.9 2c-3.1 0-5.1 1.3-5.1 3.8v2.4h5.2v.7H4.4C2.5 8.9 1 10.4 1 12.3c0 1.9 1.5 3.3 3.4 3.3h2V13c0-2.3 2-4.2 4.3-4.2h5.2V5.8c0-2.5-2-3.8-5-3.8zm-1.8 1.6c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"
      fill="#3776AB"
    />
    <path
      d="M12.1 22c3.1 0 5.1-1.3 5.1-3.8v-2.4H12v-.7h7.6c1.9 0 3.4-1.5 3.4-3.4 0-1.9-1.5-3.3-3.4-3.3h-2v2.6c0 2.3-2 4.2-4.3 4.2H8.1v3c0 2.5 2 3.8 5 3.8zm1.8-1.6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
      fill="#FFD43B"
    />
  </svg>
);

/**
 * Official Docker Whale Logo (#2496ED)
 */
export const DockerLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      d="M13.9 8.2h2.2v2.2h-2.2V8.2zm-2.8 0h2.2v2.2h-2.2V8.2zm-2.8 0h2.2v2.2H8.3V8.2zm-2.8 0h2.2v2.2H5.5V8.2zm5.6-2.8h2.2v2.2h-2.2V5.4zm-2.8 0h2.2v2.2H8.3V5.4zm-2.8 0h2.2v2.2H5.5V5.4zm-2.8 0h2.2v2.2H2.7V5.4zm8.4-2.8h2.2v2.2h-2.2V2.6zM23.9 11c-.3-.2-1.3-.4-2.5-.2-.2-.7-.7-1.4-1.4-1.9l-.6-.4-.4.6c-.6.9-.7 2-.5 3-.9.6-2.1.8-3.4.8H1.3c-.6 0-1.1.4-1.3 1-.9 3.6 1.1 7.2 5.5 7.2 4.6 0 8.1-2.4 9.9-7.1 2.8.2 5.6-.4 6.7-2.6.5-.4.8-.8.8-1.2 0-.1 0-.1-.1-.2z"
      fill="#2496ED"
    />
  </svg>
);

/**
 * Official GitHub Mark (Crisp Octocat)
 */
export const GitHubLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export const PlatformIcon: React.FC<{ bridge: PlatformBridge; className?: string }> = ({
  bridge,
  className = 'w-5 h-5'
}) => {
  switch (bridge) {
    case 'discord':
      return <DiscordLogo className={className} />;
    case 'slack':
      return <SlackLogo className={className} />;
    case 'teams':
      return <TeamsLogo className={className} />;
    case 'telegram':
      return <TelegramLogo className={className} />;
  }
};

export const ProviderIcon: React.FC<{ provider: AgentProvider; className?: string }> = ({
  provider,
  className = 'w-5 h-5'
}) => {
  switch (provider) {
    case 'opencode':
      return <OpenCodeLogo className={className} />;
    case 'antigravity':
      return <AntigravityLogo className={className} />;
    case 'claude':
      return <ClaudeLogo className={className} />;
    case 'codex':
      return <CodexLogo className={className} />;
  }
};

/**
 * Colorful Vertical Emblems with rich gradients and badges
 */
export const VerticalEmblem: React.FC<{ vertical: VerticalId; className?: string }> = ({
  vertical,
  className = 'w-5 h-5'
}) => {
  switch (vertical) {
    case 'grant':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="grantGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="5" fill="#062419" />
          <path d="M4 19.5h16M5.5 19.5V8.5l6.5-4.5 6.5 4.5v11M9.5 19.5v-5.5h5v5.5" stroke="url(#grantGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="12" cy="10" r="1.5" fill="#88F9C0" />
        </svg>
      );
    case 'bid':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="bidGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="5" fill="#251605" />
          <path d="M12 20.5s7-3.5 7-9V6l-7-2.8L5 6v5.5c0 5.5 7 9 7 9z" stroke="url(#bidGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M9.5 11.5l2 2 3.5-3.5" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case 'deal':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="dealGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6331FB" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="5" fill="#140C2E" />
          <rect x="3.5" y="7" width="17" height="12" rx="2.5" stroke="url(#dealGrad)" strokeWidth="1.8" fill="none" />
          <path d="M15 7V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2M12 11.5v3M9.5 13h5" stroke="#C084FC" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
      );
  }
};

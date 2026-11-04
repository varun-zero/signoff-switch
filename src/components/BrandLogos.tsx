import React from 'react';
import { AgentProvider, PlatformBridge, VerticalId } from '../engine/signoffEngine';

interface LogoProps {
  className?: string;
}

/**
 * Custom Signoff Brand Mark: Two interlocking Switch rooms + Tropical Mint human sign-off node.
 */
export const SignoffBrandLogo: React.FC<LogoProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
    <rect x="2" y="6" width="18" height="18" rx="5" stroke="#6331FB" strokeWidth="2.5" />
    <rect x="14" y="12" width="20" height="18" rx="5" fill="#6331FB" fillOpacity="0.22" stroke="#88F9C0" strokeWidth="2.5" />
    <path
      d="M19.5 21L22.5 24L28.5 17.5"
      stroke="#88F9C0"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="12" r="2" fill="#6331FB" />
  </svg>
);

export const DiscordLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export const SlackLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
);

export const TeamsLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.5 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm-5-1.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5.5 3h-3.2c.14.47.2.97.2 1.5v5.5a3.5 3.5 0 0 1-.62 2H20a2 2 0 0 0 2-2v-4a3 3 0 0 0-2.5-3zM13 8H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-2 4H9.5v5h-2v-5H6v-1.8h5V12z" />
  </svg>
);

export const TelegramLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
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
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M8 10l3 2-3 2M13 14h3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'antigravity':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden="true">
          <polygon points="12 3 20 18 4 18" strokeLinejoin="round" />
          <circle cx="12" cy="13" r="2.2" fill="currentColor" />
        </svg>
      );
    case 'claude':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden="true">
          <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" strokeLinecap="round" />
        </svg>
      );
    case 'codex':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden="true">
          <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
};

export const VerticalEmblem: React.FC<{ vertical: VerticalId; className?: string }> = ({
  vertical,
  className = 'w-5 h-5'
}) => {
  switch (vertical) {
    case 'grant':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
          <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'bid':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'deal':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
          <rect x="2" y="6" width="20" height="14" rx="2" />
          <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 11v4M9.5 13h5" strokeLinecap="round" />
        </svg>
      );
  }
};

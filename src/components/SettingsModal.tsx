import React from 'react';
import { AgentProvider, PlatformBridge } from '../engine/signoffEngine';
import { PlatformIcon, ProviderIcon } from './BrandLogos';
import { X, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bridge: PlatformBridge;
  onSelectBridge: (b: PlatformBridge) => void;
  provider: AgentProvider;
  onSelectProvider: (p: AgentProvider) => void;
}

const BRIDGES: Array<{ id: PlatformBridge; label: string; desc: string }> = [
  { id: 'discord', label: 'Discord', desc: 'Bot gateway with slash command dispatch' },
  { id: 'slack', label: 'Slack', desc: 'Socket mode enterprise workspace bridge' },
  { id: 'teams', label: 'Microsoft Teams', desc: 'Azure bot framework for M365 tenants' },
  { id: 'telegram', label: 'Telegram', desc: 'Executive mobile approvals via @BotFather' }
];

const PROVIDERS: Array<{ id: AgentProvider; label: string; desc: string }> = [
  { id: 'opencode', label: 'OpenCode CLI', desc: 'Local and cloud terminal code agent' },
  { id: 'antigravity', label: 'Antigravity', desc: 'Google DeepMind & Gemini 2.5/3.0 harness' },
  { id: 'claude', label: 'Claude Code', desc: 'Anthropic Claude 3.7 Sonnet agent' },
  { id: 'codex', label: 'Codex CLI', desc: 'OpenAI o3-mini schema executor' }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  bridge,
  onSelectBridge,
  provider,
  onSelectProvider
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1217]/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#151A21] border border-[#2A323E] rounded-xl shadow-2xl p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#2A323E]">
          <div>
            <h2 id="settings-title" className="text-base font-semibold text-[#E6E9EF]">
              Switch environment settings
            </h2>
            <p className="text-xs text-[#7F8A9B] mt-0.5">
              Configure active messaging bridge and agent execution harness
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#7F8A9B] hover:text-[#E6E9EF] hover:bg-[#1B212A] cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messaging Bridge Picker */}
        <div className="space-y-2.5">
          <label className="block text-xs font-medium text-[#A3ACBA] uppercase tracking-wider">
            Messaging bridge
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BRIDGES.map((b) => {
              const isSelected = bridge === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onSelectBridge(b.id)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B212A] border-[#8DA2FF] text-[#E6E9EF]'
                      : 'bg-[#151A21] border-[#2A323E] text-[#A3ACBA] hover:border-[#384252] hover:text-[#E6E9EF]'
                  }`}
                >
                  <PlatformIcon bridge={b.id} className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-[#E6E9EF] flex items-center justify-between">
                      <span>{b.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#8DA2FF]" />}
                    </div>
                    <p className="text-xs text-[#7F8A9B] leading-tight mt-0.5">{b.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Agent Harness Picker */}
        <div className="space-y-2.5">
          <label className="block text-xs font-medium text-[#A3ACBA] uppercase tracking-wider">
            Agent runtime harness
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PROVIDERS.map((p) => {
              const isSelected = provider === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectProvider(p.id)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B212A] border-[#8DA2FF] text-[#E6E9EF]'
                      : 'bg-[#151A21] border-[#2A323E] text-[#A3ACBA] hover:border-[#384252] hover:text-[#E6E9EF]'
                  }`}
                >
                  <ProviderIcon provider={p.id} className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-[#E6E9EF] flex items-center justify-between">
                      <span>{p.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#8DA2FF]" />}
                    </div>
                    <p className="text-xs text-[#7F8A9B] leading-tight mt-0.5">{p.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-[#2A323E] flex items-center justify-between text-xs text-[#7F8A9B]">
          <span>Applies to `signoff.template.yaml`</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-[#8DA2FF] text-[#0F1217] rounded-md hover:bg-[#A5B6FF] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

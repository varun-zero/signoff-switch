import React, { useState } from 'react';
import {
  ActorId,
  AgentProvider,
  PermissionCheckResult,
  PlatformBridge,
  RoomKind,
  RoomMessage
} from '../engine/signoffEngine';
import { VerticalPack } from '../engine/verticalsData';
import { PlatformIcon, ProviderIcon } from './BrandLogos';
import {
  CheckCircle2,
  RotateCcw,
  Send,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

interface BridgeRoomPanelProps {
  pack: VerticalPack;
  bridge: PlatformBridge;
  onSelectBridge: (b: PlatformBridge) => void;
  provider: AgentProvider;
  onSelectProvider: (p: AgentProvider) => void;
  activeRoom: RoomKind | 'split';
  onSelectRoom: (r: RoomKind | 'split') => void;
  messages: RoomMessage[];
  isFixed: boolean;
  isSignedOff: boolean;
  onApplyHumanFix: () => void;
  onResetDemo: () => void;
  onSignOffAndExport: () => void;
  onSendCustomMessage: (
    from: ActorId,
    to: 'analyst' | 'drafter' | 'reviewer',
    room: RoomKind,
    text: string
  ) => PermissionCheckResult;
}

const BRIDGE_LABELS: Record<PlatformBridge, string> = {
  discord: 'Discord',
  slack: 'Slack',
  teams: 'Teams',
  telegram: 'Telegram'
};

const PROVIDER_LABELS: Record<AgentProvider, string> = {
  opencode: 'OpenCode',
  antigravity: 'Antigravity',
  claude: 'Claude',
  codex: 'Codex'
};

export const BridgeRoomPanel: React.FC<BridgeRoomPanelProps> = ({
  pack,
  bridge,
  onSelectBridge,
  provider,
  onSelectProvider,
  activeRoom,
  onSelectRoom,
  messages,
  isFixed,
  isSignedOff,
  onApplyHumanFix,
  onResetDemo,
  onSignOffAndExport,
  onSendCustomMessage
}) => {
  const [senderActor, setSenderActor] = useState<ActorId>('approver');
  const [targetAgent, setTargetAgent] = useState<'analyst' | 'drafter' | 'reviewer'>('reviewer');
  const [targetRoom, setTargetRoom] = useState<RoomKind>('draft');
  const [customText, setCustomText] = useState('');
  const [lastPermissionNotice, setLastPermissionNotice] = useState<PermissionCheckResult | null>(null);

  const visibleMessages =
    activeRoom === 'split'
      ? messages
      : messages.filter((m) => m.room === activeRoom);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend =
      customText.trim() ||
      (targetAgent === 'reviewer'
        ? 'Run signoff check and score the draft.'
        : targetAgent === 'drafter'
          ? 'Cite [E2] in Section 3.'
          : 'Rebuild compliance matrix.');

    const permResult = onSendCustomMessage(senderActor, targetAgent, targetRoom, textToSend);
    setLastPermissionNotice(permResult);
    if (permResult.allowed) {
      setCustomText('');
    }
  };

  return (
    <section aria-label="Live Switch Room" className="space-y-6">
      {/* Header & Visual Logo Switchers */}
      <div className="space-y-3 pb-4 border-b border-[#221E42]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <PlatformIcon bridge={bridge} className="w-6 h-6 text-[#88F9C0]" />
            <h2 className="text-xl font-semibold text-[#F4F3FF]">
              {BRIDGE_LABELS[bridge]} Room
            </h2>
          </div>

          {/* 4 Messaging Bridge Logo Buttons */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Messaging Platform">
            {(['discord', 'slack', 'teams', 'telegram'] as PlatformBridge[]).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => onSelectBridge(b)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                  bridge === b
                    ? 'bg-[#6331FB] text-[#FFFFFF]'
                    : 'text-[#C2BCE8] hover:text-[#F4F3FF]'
                }`}
              >
                <PlatformIcon bridge={b} className="w-4 h-4" />
                <span>{BRIDGE_LABELS[b]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4 Agent Harness Logo Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Agent Harness">
            {(['opencode', 'antigravity', 'claude', 'codex'] as AgentProvider[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onSelectProvider(p)}
                className={`px-3 py-1.5 text-sm font-mono rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                  provider === p
                    ? 'bg-[#171436] text-[#88F9C0] font-semibold'
                    : 'text-[#C2BCE8] hover:text-[#F4F3FF]'
                }`}
              >
                <ProviderIcon provider={p} className="w-4 h-4" />
                <span>{PROVIDER_LABELS[p]}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSelectRoom('split')}
              className={`px-2.5 py-1 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeRoom === 'split'
                  ? 'bg-[#6331FB] text-[#FFFFFF]'
                  : 'text-[#C2BCE8] hover:text-[#F4F3FF]'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              type="button"
              onClick={() => onSelectRoom('intake')}
              className={`px-2.5 py-1 text-sm font-mono rounded-lg transition-colors cursor-pointer ${
                activeRoom === 'intake'
                  ? 'bg-[#6331FB] text-[#FFFFFF]'
                  : 'text-[#C2BCE8] hover:text-[#F4F3FF]'
              }`}
            >
              #{pack.intakeRoomName}
            </button>
            <button
              type="button"
              onClick={() => onSelectRoom('draft')}
              className={`px-2.5 py-1 text-sm font-mono rounded-lg transition-colors cursor-pointer ${
                activeRoom === 'draft'
                  ? 'bg-[#6331FB] text-[#FFFFFF]'
                  : 'text-[#C2BCE8] hover:text-[#F4F3FF]'
              }`}
            >
              #{pack.draftRoomName}
            </button>
          </div>
        </div>
      </div>

      {/* Human Decision Gate Bar */}
      <div className="py-3.5 border-b border-[#221E42] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserCheck className="w-6 h-6 text-[#88F9C0] shrink-0" />
          <div>
            <h3 className="text-base font-semibold text-[#88F9C0]">
              {isFixed ? 'Ready for Human Sign-Off' : '2 Holds Caught by Reviewer'}
            </h3>
            <p className="text-sm text-[#D6D2F2] max-w-[46ch]">
              {isFixed
                ? 'Audit E7 attached + [E2] cited. 8/8 rules pass.'
                : 'Missing audit file [E7] + uncited metric in Section 3.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isFixed ? (
            <button
              type="button"
              onClick={onApplyHumanFix}
              className="px-4 py-2 text-sm font-semibold text-[#01010D] bg-[#88F9C0] hover:bg-[#72F5B2] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Approve Fix & Re-Run Checker
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onSignOffAndExport}
                className="px-4 py-2 text-sm font-semibold text-[#01010D] bg-[#88F9C0] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isSignedOff ? 'Download Pack Again' : 'Sign Off & Export Pack'}
              </button>
              <button
                type="button"
                onClick={onResetDemo}
                className="px-3 py-2 text-sm font-medium text-[#D6D2F2] border border-[#2D2757] hover:border-[#6331FB] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                aria-label="Reset demo to initial 78/100 catch"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Visual Message Stream with Platform & Provider Logos */}
      <div className="divide-y divide-[#1D1A39] border-t border-b border-[#221E42] max-h-[400px] overflow-y-auto">
        {visibleMessages.map((msg) => {
          const isAgent = msg.sender_id === 'analyst' || msg.sender_id === 'drafter' || msg.sender_id === 'reviewer';
          return (
            <div key={msg.id} className="py-3.5 flex items-start gap-3">
              {isAgent ? (
                <ProviderIcon provider={provider} className="w-5 h-5 text-[#88F9C0] shrink-0 mt-0.5" />
              ) : (
                <PlatformIcon bridge={bridge} className="w-5 h-5 text-[#6331FB] shrink-0 mt-0.5" />
              )}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        msg.sender_id === 'approver'
                          ? 'text-[#88F9C0]'
                          : msg.sender_id === 'client'
                            ? 'text-[#F4F3FF]'
                            : 'text-[#B8A7FF] font-mono'
                      }`}
                    >
                      {msg.sender_name}
                    </span>
                    <span className="text-[#B8B2DE] font-mono">
                      #{msg.room === 'intake' ? pack.intakeRoomName : pack.draftRoomName}
                    </span>
                    {msg.addressed_to && (
                      <span className="text-[#88F9C0] font-mono">
                        → {msg.addressed_to}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-sm text-[#B8B2DE] tabular-nums">
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-sm text-[#E4E1FA] leading-relaxed max-w-[48ch]">
                  {msg.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Streamlined Permission & Message Tester */}
      <form onSubmit={handleDispatch} className="space-y-3 pt-1">
        <h3 className="text-base font-semibold text-[#F4F3FF]">
          Test Switch Addressing Policy
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="sim-actor" className="block text-sm text-[#C2BCE8] mb-1">
              Sender
            </label>
            <select
              id="sim-actor"
              value={senderActor}
              onChange={(e) => setSenderActor(e.target.value as ActorId)}
              className="w-full text-sm bg-[#0A091A] border border-[#2D2757] rounded-lg px-3 py-2 text-[#F4F3FF]"
            >
              <option value="approver">Approver (Owner)</option>
              <option value="client">Client ({pack.persona.split(',')[0]})</option>
              <option value="analyst">@signoff-analyst</option>
              <option value="drafter">@signoff-drafter</option>
              <option value="reviewer">@signoff-reviewer</option>
            </select>
          </div>

          <div>
            <label htmlFor="sim-target" className="block text-sm text-[#C2BCE8] mb-1">
              Wake Agent
            </label>
            <select
              id="sim-target"
              value={targetAgent}
              onChange={(e) => setTargetAgent(e.target.value as 'analyst' | 'drafter' | 'reviewer')}
              className="w-full text-sm bg-[#0A091A] border border-[#2D2757] rounded-lg px-3 py-2 text-[#F4F3FF] font-mono"
            >
              <option value="analyst">@analyst (anyone)</option>
              <option value="drafter">@drafter (owner-agents)</option>
              <option value="reviewer">@reviewer (owner)</option>
            </select>
          </div>

          <div>
            <label htmlFor="sim-room" className="block text-sm text-[#C2BCE8] mb-1">
              Room
            </label>
            <select
              id="sim-room"
              value={targetRoom}
              onChange={(e) => setTargetRoom(e.target.value as RoomKind)}
              className="w-full text-sm bg-[#0A091A] border border-[#2D2757] rounded-lg px-3 py-2 text-[#F4F3FF] font-mono"
            >
              <option value="intake">#{pack.intakeRoomName}</option>
              <option value="draft">#{pack.draftRoomName}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            aria-label="Room message or instruction"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder={`Message @signoff-${targetAgent}...`}
            className="flex-1 text-sm bg-[#0A091A] border border-[#2D2757] rounded-lg px-3.5 py-2 text-[#F4F3FF] placeholder:text-[#A9A4C8]"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold text-[#FFFFFF] bg-[#6331FB] hover:bg-[#5222E8] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>

        {lastPermissionNotice && (
          <div
            role="status"
            className="py-2 text-sm flex items-start gap-2.5 text-[#F4F3FF]"
          >
            {lastPermissionNotice.allowed ? (
              <CheckCircle2 className="w-4 h-4 text-[#88F9C0] shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-[#FF8080] shrink-0 mt-0.5" />
            )}
            <p className="max-w-[48ch]">{lastPermissionNotice.reason}</p>
          </div>
        )}
      </form>
    </section>
  );
};

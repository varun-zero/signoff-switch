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
  Lock,
  RotateCcw,
  Send,
  ShieldAlert,
  Sparkles,
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

const BRIDGE_INFO: Record<PlatformBridge, { label: string; activeBorder: string; activeBg: string }> = {
  discord: { label: 'Discord', activeBorder: 'border-[#5865F2]', activeBg: 'bg-[#5865F2]/20' },
  slack: { label: 'Slack', activeBorder: 'border-[#36C5F0]', activeBg: 'bg-[#1E1C2E]' },
  teams: { label: 'Teams', activeBorder: 'border-[#7B83EB]', activeBg: 'bg-[#505AC9]/20' },
  telegram: { label: 'Telegram', activeBorder: 'border-[#2AABEE]', activeBg: 'bg-[#229ED9]/20' }
};

const PROVIDER_INFO: Record<AgentProvider, { label: string }> = {
  opencode: { label: 'OpenCode' },
  antigravity: { label: 'Antigravity' },
  claude: { label: 'Claude' },
  codex: { label: 'Codex' }
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
    <section
      aria-label="Live Switch Room"
      className="space-y-6"
    >
      {/* Top Header & Platform/Provider Switchers */}
      <div className="space-y-4 pb-4 border-b border-[#201B42]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <PlatformIcon bridge={bridge} className="w-7 h-7" />
            <div>
              <div className="text-xs font-mono text-[#958DBF] uppercase tracking-wider">
                Live Messaging Bridge
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif-display text-[#F5F3FF]">
                {BRIDGE_INFO[bridge].label} Compliance Room
              </h2>
            </div>
          </div>

          {/* 4 Messaging Bridge Buttons */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Messaging Platforms">
            {(['discord', 'slack', 'teams', 'telegram'] as PlatformBridge[]).map((b) => {
              const isSelected = bridge === b;
              const info = BRIDGE_INFO[b];
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => onSelectBridge(b)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? `${info.activeBg} ${info.activeBorder} border text-[#F5F3FF] font-semibold`
                      : 'text-[#C5BFE9] hover:text-[#F5F3FF] bg-[#09081B] border border-[#201B42]'
                  }`}
                >
                  <PlatformIcon bridge={b} className="w-4 h-4 shrink-0" />
                  <span>{info.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Second Row: Provider Selector & Room Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Agent Harness Provider">
            <span className="text-xs font-mono text-[#958DBF] mr-1 hidden sm:inline">Harness:</span>
            {(['opencode', 'antigravity', 'claude', 'codex'] as AgentProvider[]).map((p) => {
              const isSelected = provider === p;
              const pInfo = PROVIDER_INFO[p];
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onSelectProvider(p)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#151139] border-[#6331FB] text-[#88F9C0] font-semibold'
                      : 'bg-[#09081B] border-[#201B42] text-[#C5BFE9] hover:text-[#F5F3FF]'
                  }`}
                >
                  <ProviderIcon provider={p} className="w-4 h-4 shrink-0" />
                  <span className="font-mono">{pInfo.label}</span>
                </button>
              );
            })}
          </div>

          {/* Room filter tabs */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onSelectRoom('split')}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium ${
                activeRoom === 'split'
                  ? 'bg-[#6331FB] text-[#FFFFFF]'
                  : 'text-[#C5BFE9] hover:text-[#F5F3FF]'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              type="button"
              onClick={() => onSelectRoom('intake')}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer font-mono ${
                activeRoom === 'intake'
                  ? 'bg-[#6331FB] text-[#FFFFFF]'
                  : 'text-[#C5BFE9] hover:text-[#F5F3FF]'
              }`}
            >
              #{pack.intakeRoomName}
            </button>
            <button
              type="button"
              onClick={() => onSelectRoom('draft')}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer font-mono ${
                activeRoom === 'draft'
                  ? 'bg-[#6331FB] text-[#FFFFFF]'
                  : 'text-[#C5BFE9] hover:text-[#F5F3FF]'
              }`}
            >
              #{pack.draftRoomName}
            </button>
          </div>
        </div>
      </div>

      {/* Human Decision Gate Status Strip (Divided, not a nested box) */}
      <div className="py-3 border-b border-[#201B42] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {isFixed ? (
              <CheckCircle2 className="w-5 h-5 text-[#00F5A0]" />
            ) : (
              <UserCheck className="w-5 h-5 text-[#F59E0B]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-bold ${isFixed ? 'text-[#88F9C0]' : 'text-[#F59E0B]'}`}>
                {isFixed ? 'Stage 5: Ready for Human Sign-Off' : '2 Holds Caught by Deterministic Checker'}
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1A1637] text-[#C5BFE9]">
                {isFixed ? '8/8 Rules Passed' : '78/100 Initial'}
              </span>
            </div>
            <p className="text-xs text-[#C5BFE9] mt-0.5 leading-relaxed max-w-[50ch]">
              {isFixed
                ? 'Audited file [E7] attached & [E2] citation verified in Section 3. Submission pack ready.'
                : 'Missing audit file [E7] + uncited metric in Section 3. Reviewer cannot release without approval.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isFixed ? (
            <button
              type="button"
              onClick={onApplyHumanFix}
              className="px-4 py-2 text-xs font-bold text-[#02010A] bg-[#00F5A0] hover:bg-[#28FFAE] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Approve Fix & Re-Run Checker
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onSignOffAndExport}
                className="px-4 py-2 text-xs font-bold text-[#02010A] bg-[#88F9C0] hover:bg-[#A3FED0] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                {isSignedOff ? 'Download Pack Again' : 'Sign Off & Export'}
              </button>
              <button
                type="button"
                onClick={onResetDemo}
                className="px-2.5 py-2 text-xs font-medium text-[#C5BFE9] hover:text-[#F5F3FF] bg-[#09081B] border border-[#201B42] hover:border-[#6331FB] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                title="Reset to initial state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Message Stream with Authentic Colorful Brand Badges */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#958DBF] pb-1 border-b border-[#201B42]">
          <span>Bridge Stream · #{activeRoom === 'split' ? 'all-channels' : activeRoom === 'intake' ? pack.intakeRoomName : pack.draftRoomName}</span>
          <span>{visibleMessages.length} Messages</span>
        </div>

        <div className="divide-y divide-[#1D193D] max-h-[400px] overflow-y-auto">
          {visibleMessages.map((msg) => {
            const isAgent = msg.sender_id === 'analyst' || msg.sender_id === 'drafter' || msg.sender_id === 'reviewer';
            const isOwner = msg.sender_id === 'approver';
            return (
              <div
                key={msg.id}
                className={`py-3.5 flex items-start gap-3 transition-colors ${
                  msg.is_human_gate ? 'bg-[#00F5A0]/5' : ''
                }`}
              >
                {/* Colorful Brand Icon Avatar */}
                <div className="shrink-0 mt-0.5">
                  {isAgent ? (
                    <ProviderIcon provider={provider} className="w-5 h-5" />
                  ) : (
                    <PlatformIcon bridge={bridge} className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold ${
                          isOwner
                            ? 'text-[#88F9C0]'
                            : isAgent
                              ? 'text-[#C5BFE9] font-mono'
                              : 'text-[#F5F3FF]'
                        }`}
                      >
                        {msg.sender_name}
                      </span>
                      <span className="text-xs font-mono uppercase px-1.5 py-0.5 rounded bg-[#17133B] text-[#958DBF]">
                        {msg.sender_badge}
                      </span>
                      <span className="text-xs text-[#958DBF] font-mono">
                        #{msg.room === 'intake' ? pack.intakeRoomName : pack.draftRoomName}
                      </span>
                      {msg.addressed_to && (
                        <span className="text-xs text-[#88F9C0] font-mono">
                          → {msg.addressed_to}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-[#958DBF] tabular-nums">
                      {msg.timestamp}
                    </span>
                  </div>

                  <p className="text-sm text-[#F5F3FF] leading-relaxed max-w-[65ch]">
                    {msg.content}
                  </p>

                  {msg.artifact_ref && (
                    <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded bg-[#130F30] text-xs font-mono text-[#88F9C0]">
                      <Sparkles className="w-3.5 h-3.5 text-[#00F5A0]" />
                      <span>{msg.artifact_ref}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Switch Addressing Policy & Interactive Message Tester */}
      <form onSubmit={handleDispatch} className="space-y-3 pt-3 border-t border-[#201B42]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#6331FB]" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C5BFE9]">
              Switch Addressing Policy Tester
            </h3>
          </div>
          <span className="text-xs text-[#958DBF]">Simulate cross-agent wakeup permissions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label htmlFor="sim-actor" className="block text-xs font-mono text-[#958DBF] mb-1">
              Sender Actor
            </label>
            <select
              id="sim-actor"
              value={senderActor}
              onChange={(e) => setSenderActor(e.target.value as ActorId)}
              className="w-full text-xs bg-[#09081B] border border-[#201B42] rounded-lg px-2.5 py-2 text-[#F5F3FF]"
            >
              <option value="approver">Approver (Owner)</option>
              <option value="client">Client ({pack.persona.split(',')[0]})</option>
              <option value="analyst">@signoff-analyst</option>
              <option value="drafter">@signoff-drafter</option>
              <option value="reviewer">@signoff-reviewer</option>
            </select>
          </div>

          <div>
            <label htmlFor="sim-target" className="block text-xs font-mono text-[#958DBF] mb-1">
              Target Wake Agent
            </label>
            <select
              id="sim-target"
              value={targetAgent}
              onChange={(e) => setTargetAgent(e.target.value as 'analyst' | 'drafter' | 'reviewer')}
              className="w-full text-xs bg-[#09081B] border border-[#201B42] rounded-lg px-2.5 py-2 text-[#F5F3FF] font-mono"
            >
              <option value="analyst">@analyst (public intake)</option>
              <option value="drafter">@drafter (owner & agents)</option>
              <option value="reviewer">@reviewer (owner only)</option>
            </select>
          </div>

          <div>
            <label htmlFor="sim-room" className="block text-xs font-mono text-[#958DBF] mb-1">
              Destination Room
            </label>
            <select
              id="sim-room"
              value={targetRoom}
              onChange={(e) => setTargetRoom(e.target.value as RoomKind)}
              className="w-full text-xs bg-[#09081B] border border-[#201B42] rounded-lg px-2.5 py-2 text-[#F5F3FF] font-mono"
            >
              <option value="intake">#{pack.intakeRoomName} (Intake)</option>
              <option value="draft">#{pack.draftRoomName} (Draft Room)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            aria-label="Room message or instruction"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder={`Message @signoff-${targetAgent} in #${targetRoom}...`}
            className="flex-1 text-xs bg-[#09081B] border border-[#201B42] rounded-lg px-3 py-2 text-[#F5F3FF] placeholder:text-[#A9A2D0]"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-[#FFFFFF] bg-[#6331FB] hover:bg-[#7243FC] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>

        {lastPermissionNotice && (
          <div
            role="status"
            className={`p-2.5 rounded-lg text-xs flex items-start gap-2 border ${
              lastPermissionNotice.allowed
                ? 'bg-[#00F5A0]/10 border-[#00F5A0]/30 text-[#88F9C0]'
                : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#FF8080]'
            }`}
          >
            {lastPermissionNotice.allowed ? (
              <CheckCircle2 className="w-4 h-4 text-[#00F5A0] shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">{lastPermissionNotice.reason}</p>
          </div>
        )}
      </form>
    </section>
  );
};

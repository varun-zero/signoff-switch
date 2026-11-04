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
  ChevronRight,
  MessageSquare,
  Send,
  ShieldAlert,
  Check
} from 'lucide-react';

interface BridgeRoomPanelProps {
  pack: VerticalPack;
  bridge: PlatformBridge;
  provider: AgentProvider;
  activeRoom: RoomKind | 'split';
  onSelectRoom: (r: RoomKind | 'split') => void;
  messages: RoomMessage[];
  onSendCustomMessage: (
    from: ActorId,
    to: 'analyst' | 'drafter' | 'reviewer',
    room: RoomKind,
    text: string
  ) => PermissionCheckResult;
}

export const BridgeRoomPanel: React.FC<BridgeRoomPanelProps> = ({
  pack,
  bridge,
  provider,
  activeRoom,
  onSelectRoom,
  messages,
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
    <aside aria-label="Activity panel" className="bg-[#151A21] border border-[#2A323E] rounded-lg overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 bg-[#1B212A] border-b border-[#2A323E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#7F8A9B]" />
          <h2 className="text-xs font-semibold text-[#E6E9EF]">
            Activity
          </h2>
          <span className="text-xs font-mono text-[#7F8A9B]">
            #{activeRoom === 'split' ? 'all' : activeRoom === 'intake' ? pack.intakeRoomName : pack.draftRoomName}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSelectRoom('draft')}
            className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
              activeRoom === 'draft' ? 'bg-[#8DA2FF] text-[#0F1217]' : 'text-[#7F8A9B] hover:text-[#E6E9EF]'
            }`}
          >
            #draft
          </button>
          <button
            type="button"
            onClick={() => onSelectRoom('intake')}
            className={`px-2 py-0.5 text-xs font-mono rounded cursor-pointer ${
              activeRoom === 'intake' ? 'bg-[#8DA2FF] text-[#0F1217]' : 'text-[#7F8A9B] hover:text-[#E6E9EF]'
            }`}
          >
            #intake
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[520px]">
        {visibleMessages.map((msg) => {
          const isAgent = msg.sender_id === 'analyst' || msg.sender_id === 'drafter' || msg.sender_id === 'reviewer';
          const isOwner = msg.sender_id === 'approver';
          return (
            <div key={msg.id} className="text-xs space-y-1 py-1">
              <div className="flex items-center justify-between text-[#7F8A9B]">
                <div className="flex items-center gap-1.5">
                  <span className={`font-medium ${isOwner ? 'text-[#8DA2FF]' : isAgent ? 'text-[#A3ACBA]' : 'text-[#E6E9EF]'}`}>
                    {msg.sender_name}
                  </span>
                  {msg.addressed_to && (
                    <span className="text-[#7F8A9B] font-mono">
                      → {msg.addressed_to}
                    </span>
                  )}
                </div>
                <span className="font-mono num text-[#7F8A9B]">
                  {msg.timestamp}
                </span>
              </div>
              <p className="text-[#E6E9EF] leading-relaxed">
                {msg.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Simulator input */}
      <form onSubmit={handleDispatch} className="p-3 bg-[#1B212A] border-t border-[#2A323E] space-y-2">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            aria-label="Send test message to room"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder={`Message @${targetAgent}...`}
            className="flex-1 text-xs bg-[#0F1217] border border-[#2A323E] rounded px-2.5 py-1.5 text-[#E6E9EF] placeholder:text-[#7F8A9B] focus:outline-none focus:border-[#8DA2FF]"
          />
          <button
            type="submit"
            className="p-1.5 bg-[#8DA2FF] text-[#0F1217] rounded hover:bg-[#A5B6FF] transition-colors cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {lastPermissionNotice && (
          <div
            role="status"
            className={`text-xs px-2 py-1 rounded flex items-start gap-1.5 ${
              lastPermissionNotice.allowed
                ? 'bg-[rgba(108,196,161,0.15)] text-[#6CC4A1]'
                : 'bg-[rgba(242,131,122,0.15)] text-[#F2837A]'
            }`}
          >
            {lastPermissionNotice.allowed ? (
              <Check className="w-3 h-3 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-3 h-3 shrink-0 mt-0.5" />
            )}
            <span className="leading-tight">{lastPermissionNotice.reason}</span>
          </div>
        )}
      </form>
    </aside>
  );
};

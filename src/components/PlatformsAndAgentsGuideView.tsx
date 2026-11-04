import React, { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import {
  DiscordLogo,
  ProviderIcon,
  SlackLogo,
  TeamsLogo,
  TelegramLogo
} from './BrandLogos';

interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
  done: boolean;
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk-1',
    title: '1. Start Docker & Switch Console',
    detail: 'Launch local Switch server and test in Mattermost.',
    done: false
  },
  {
    id: 'chk-2',
    title: '2. Connect OpenCode & Antigravity',
    detail: 'Run `opencode auth login` with your Gemini or Claude API key.',
    done: false
  },
  {
    id: 'chk-3',
    title: '3. Connect Discord Bot & Link User',
    detail: 'Enable Message Content Intent and paste Bot Token in Switch Console.',
    done: false
  },
  {
    id: 'chk-4',
    title: '4. Connect Slack / Telegram / Teams',
    detail: 'Invite `@signoff-analyst`, `@signoff-drafter`, and `@signoff-reviewer`.',
    done: false
  },
  {
    id: 'chk-5',
    title: '5. Push to GitHub & Submit',
    detail: 'Push to `github.com/varun2507027108-oss/signoff-switch`.',
    done: false
  }
];

export const PlatformsAndAgentsGuideView: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="space-y-10">
      {/* Section 1: Visual Agent Harnesses (OpenCode + Antigravity + Claude + Codex) */}
      <section aria-label="Agent Harnesses" className="space-y-4">
        <h2 className="text-xl font-semibold text-[#F4F3FF] pb-3 border-b border-[#221E42]">
          Agent Harnesses (Mix or Match in `signoff.template.yaml`)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-[#88F9C0] bg-[#0A091A] space-y-2">
            <div className="flex items-center justify-between">
              <ProviderIcon provider="opencode" className="w-7 h-7 text-[#88F9C0]" />
              <span className="font-mono text-sm font-semibold text-[#88F9C0]">Default · Free</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F3FF]">OpenCode CLI</h3>
            <p className="text-sm text-[#C2BCE8] font-mono">opencode auth login</p>
          </div>

          <div className="p-4 rounded-xl border border-[#6331FB] bg-[#0A091A] space-y-2">
            <div className="flex items-center justify-between">
              <ProviderIcon provider="antigravity" className="w-7 h-7 text-[#88F9C0]" />
              <span className="font-mono text-sm font-semibold text-[#88F9C0]">Google AI Studio</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F3FF]">Antigravity</h3>
            <p className="text-sm text-[#C2BCE8] font-mono">GEMINI_API_KEY</p>
          </div>

          <div className="p-4 rounded-xl border border-[#221E42] bg-[#0A091A] space-y-2">
            <div className="flex items-center justify-between">
              <ProviderIcon provider="claude" className="w-7 h-7 text-[#6331FB]" />
              <span className="font-mono text-sm text-[#C2BCE8]">Anthropic</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F3FF]">Claude Code</h3>
            <p className="text-sm text-[#C2BCE8] font-mono">ANTHROPIC_API_KEY</p>
          </div>

          <div className="p-4 rounded-xl border border-[#221E42] bg-[#0A091A] space-y-2">
            <div className="flex items-center justify-between">
              <ProviderIcon provider="codex" className="w-7 h-7 text-[#6331FB]" />
              <span className="font-mono text-sm text-[#C2BCE8]">OpenAI</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F3FF]">Codex CLI</h3>
            <p className="text-sm text-[#C2BCE8] font-mono">OPENAI_API_KEY</p>
          </div>
        </div>
      </section>

      {/* Section 2: Visual Messaging Bridges */}
      <section aria-label="Messaging Bridges" className="space-y-4">
        <h2 className="text-xl font-semibold text-[#F4F3FF] pb-3 border-b border-[#221E42]">
          Messaging Bridges (Same 3 Agents Across Every App)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-[#6331FB] bg-[#0A091A] space-y-2">
            <div className="flex items-center justify-between">
              <DiscordLogo className="w-7 h-7 text-[#88F9C0]" />
              <span className="font-mono text-sm font-semibold text-[#88F9C0]">Free Bot</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F3FF]">Discord</h3>
            <p className="text-sm text-[#C2BCE8] font-mono">DISCORD_BOT_TOKEN</p>
          </div>

          <div className="p-4 rounded-xl border border-[#221E42] bg-[#0A091A] space-y-2">
            <div className="flex items-center justify-between">
              <SlackLogo className="w-7 h-7 text-[#88F9C0]" />
              <span className="font-mono text-sm font-semibold text-[#88F9C0]">Socket Mode</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F3FF]">Slack</h3>
            <p className="text-sm text-[#C2BCE8] font-mono">SLACK_BOT_TOKEN</p>
          </div>

          <div className="p-4 rounded-xl border border-[#221E42] bg-[#0A091A] space-y-2">
            <div className="flex items-center justify-between">
              <TeamsLogo className="w-7 h-7 text-[#88F9C0]" />
              <span className="font-mono text-sm font-semibold text-[#88F9C0]">M365 Sandbox</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F3FF]">Microsoft Teams</h3>
            <p className="text-sm text-[#C2BCE8] font-mono">APP_ID + PASSWORD</p>
          </div>

          <div className="p-4 rounded-xl border border-[#221E42] bg-[#0A091A] space-y-2">
            <div className="flex items-center justify-between">
              <TelegramLogo className="w-7 h-7 text-[#88F9C0]" />
              <span className="font-mono text-sm font-semibold text-[#88F9C0]">@BotFather</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F3FF]">Telegram</h3>
            <p className="text-sm text-[#C2BCE8] font-mono">TELEGRAM_BOT_TOKEN</p>
          </div>
        </div>
      </section>

      {/* Section 3: Concise Human Action Checklist */}
      <section aria-label="Human Setup Checklist" className="space-y-4">
        <h2 className="text-xl font-semibold text-[#F4F3FF] pb-3 border-b border-[#221E42]">
          5-Step Setup Checklist
        </h2>

        <div className="divide-y divide-[#1D1A39] border-t border-b border-[#221E42]">
          {checklist.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full py-3.5 flex items-start gap-3 text-left cursor-pointer"
            >
              {item.done ? (
                <CheckCircle2 className="w-5 h-5 text-[#88F9C0] shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-[#6331FB] shrink-0 mt-0.5" />
              )}
              <div>
                <div className={`text-sm font-semibold ${item.done ? 'line-through text-[#C2BCE8]' : 'text-[#F4F3FF]'}`}>
                  {item.title}
                </div>
                <p className="text-sm text-[#C2BCE8] max-w-[48ch]">{item.detail}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

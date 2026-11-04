import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Circle,
  Copy
} from 'lucide-react';
import {
  AntigravityLogo,
  ClaudeLogo,
  CodexLogo,
  DiscordLogo,
  OpenCodeLogo,
  SlackLogo,
  TeamsLogo,
  TelegramLogo
} from './BrandLogos';

interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
  code?: string;
  done: boolean;
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk-1',
    title: '1. Start Switch local daemon & Mattermost bridge',
    detail: 'Boot the local Switch orchestrator container. Serves WebSocket gateway on port 8080.',
    code: 'docker compose -f switch-docker-compose.yaml up -d',
    done: false
  },
  {
    id: 'chk-2',
    title: '2. Authenticate OpenCode & agent harnesses',
    detail: 'Log in via OpenCode CLI. Antigravity, Claude Code, and Codex CLI share the same config.',
    code: 'opencode auth login',
    done: false
  },
  {
    id: 'chk-3',
    title: '3. Enable Discord bot & message intent',
    detail: 'Turn on Message Content Intent in Discord Developer Portal and paste bot token.',
    code: 'export DISCORD_BOT_TOKEN="your_discord_token"',
    done: false
  },
  {
    id: 'chk-4',
    title: '4. Bridge Slack, Teams, or Telegram',
    detail: 'Invite @signoff-analyst, @signoff-drafter, and @signoff-reviewer to channels.',
    code: 'python -m signoff run --bridge slack --rooms intake,draft',
    done: false
  },
  {
    id: 'chk-5',
    title: '5. Run deterministic checker & export pack',
    detail: 'Run the 8-rule compliance gate and export docx submission package.',
    code: 'signoff demo --vertical grant --fix',
    done: false
  }
];

export const PlatformsAndAgentsGuideView: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const completedCount = checklist.filter((i) => i.done).length;

  return (
    <div className="space-y-8">
      {/* Overview Intro Banner */}
      <div className="p-6 rounded-xl bg-[#151A21] border border-[#2A323E] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="text-xs font-mono text-[#8DA2FF]">
            Architecture blueprint
          </div>
          <h2 className="text-xl font-semibold text-[#E6E9EF]">
            Multi-platform messaging & agent harnesses
          </h2>
          <p className="text-sm text-[#A3ACBA] max-w-[65ch] leading-relaxed">
            One deterministic compliance engine powering Discord, Slack, Microsoft Teams, and Telegram. Switch bridges the rooms while your choice of OpenCode, Antigravity, Claude Code, or Codex runs the work.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-lg bg-[#1B212A] border border-[#2A323E] text-center min-w-[96px]">
            <div className="font-mono text-xl font-semibold text-[#E6E9EF] tabular-nums">
              4
            </div>
            <div className="text-xs text-[#7F8A9B]">Bridges</div>
          </div>
          <div className="p-3 rounded-lg bg-[#1B212A] border border-[#2A323E] text-center min-w-[96px]">
            <div className="font-mono text-xl font-semibold text-[#8DA2FF] tabular-nums">
              4
            </div>
            <div className="text-xs text-[#7F8A9B]">Harnesses</div>
          </div>
          <div className="p-3 rounded-lg bg-[#1B212A] border border-[#2A323E] text-center min-w-[96px]">
            <div className="font-mono text-xl font-semibold text-[#6CC4A1] tabular-nums">
              8/8
            </div>
            <div className="text-xs text-[#7F8A9B]">Rules</div>
          </div>
        </div>
      </div>

      {/* Section 1: Agent Harnesses */}
      <section aria-label="Agent Harnesses" className="space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#2A323E]">
          <div>
            <h2 className="text-base font-semibold text-[#E6E9EF]">
              1. Agent harnesses (configurable in signoff.template.yaml)
            </h2>
            <p className="text-xs text-[#7F8A9B]">
              Mix and match providers per agent role or use your existing team API keys
            </p>
          </div>
          <span className="text-xs font-mono text-[#8DA2FF]">4 supported runtimes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* OpenCode */}
          <div className="p-4 rounded-xl border border-[#2A323E] bg-[#151A21] hover:border-[#8DA2FF]/40 transition-colors space-y-3">
            <div className="flex items-center justify-between">
              <OpenCodeLogo className="w-7 h-7" />
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#1B212A] text-[#A3ACBA] border border-[#2A323E]">
                Default · Free
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E6E9EF]">OpenCode CLI</h3>
              <p className="text-xs text-[#A3ACBA] mt-0.5 leading-relaxed">
                Terminal-native open code assistant. Works out-of-the-box with local or cloud models.
              </p>
            </div>
            <div className="p-2 rounded-md bg-[#10141B] border border-[#2A323E] font-mono text-xs text-[#E6E9EF] flex items-center justify-between">
              <span className="truncate pr-2">opencode auth login</span>
              <button
                type="button"
                onClick={() => handleCopy('opencode auth login')}
                className="text-[#7F8A9B] hover:text-[#E6E9EF] cursor-pointer shrink-0 transition-colors"
                title="Copy command"
              >
                {copiedCode === 'opencode auth login' ? (
                  <Check className="w-3.5 h-3.5 text-[#6CC4A1]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Antigravity */}
          <div className="p-4 rounded-xl border border-[#2A323E] bg-[#151A21] hover:border-[#8DA2FF]/40 transition-colors space-y-3">
            <div className="flex items-center justify-between">
              <AntigravityLogo className="w-7 h-7" />
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#1B212A] text-[#A3ACBA] border border-[#2A323E]">
                Google AI Studio
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E6E9EF]">Antigravity</h3>
              <p className="text-xs text-[#A3ACBA] mt-0.5 leading-relaxed">
                Google DeepMind & Gemini harness. Superior long-context reasoning for large RFP packs.
              </p>
            </div>
            <div className="p-2 rounded-md bg-[#10141B] border border-[#2A323E] font-mono text-xs text-[#E6E9EF] flex items-center justify-between">
              <span className="truncate pr-2">GEMINI_API_KEY</span>
              <button
                type="button"
                onClick={() => handleCopy('export GEMINI_API_KEY="your_gemini_key"')}
                className="text-[#7F8A9B] hover:text-[#E6E9EF] cursor-pointer shrink-0 transition-colors"
                title="Copy env var"
              >
                {copiedCode === 'export GEMINI_API_KEY="your_gemini_key"' ? (
                  <Check className="w-3.5 h-3.5 text-[#6CC4A1]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Claude Code */}
          <div className="p-4 rounded-xl border border-[#2A323E] bg-[#151A21] hover:border-[#8DA2FF]/40 transition-colors space-y-3">
            <div className="flex items-center justify-between">
              <ClaudeLogo className="w-7 h-7" />
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#1B212A] text-[#A3ACBA] border border-[#2A323E]">
                Anthropic
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E6E9EF]">Claude Code</h3>
              <p className="text-xs text-[#A3ACBA] mt-0.5 leading-relaxed">
                Agentic terminal coding with Claude 3.7 Sonnet. Exceptional structured drafting and reasoning.
              </p>
            </div>
            <div className="p-2 rounded-md bg-[#10141B] border border-[#2A323E] font-mono text-xs text-[#E6E9EF] flex items-center justify-between">
              <span className="truncate pr-2">ANTHROPIC_API_KEY</span>
              <button
                type="button"
                onClick={() => handleCopy('export ANTHROPIC_API_KEY="your_anthropic_key"')}
                className="text-[#7F8A9B] hover:text-[#E6E9EF] cursor-pointer shrink-0 transition-colors"
                title="Copy env var"
              >
                {copiedCode === 'export ANTHROPIC_API_KEY="your_anthropic_key"' ? (
                  <Check className="w-3.5 h-3.5 text-[#6CC4A1]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Codex CLI */}
          <div className="p-4 rounded-xl border border-[#2A323E] bg-[#151A21] hover:border-[#8DA2FF]/40 transition-colors space-y-3">
            <div className="flex items-center justify-between">
              <CodexLogo className="w-7 h-7" />
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#1B212A] text-[#A3ACBA] border border-[#2A323E]">
                OpenAI Agents
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E6E9EF]">Codex CLI</h3>
              <p className="text-xs text-[#A3ACBA] mt-0.5 leading-relaxed">
                OpenAI o3-mini and GPT-4o harness. High-speed JSON schema execution and matrix parsing.
              </p>
            </div>
            <div className="p-2 rounded-md bg-[#10141B] border border-[#2A323E] font-mono text-xs text-[#E6E9EF] flex items-center justify-between">
              <span className="truncate pr-2">OPENAI_API_KEY</span>
              <button
                type="button"
                onClick={() => handleCopy('export OPENAI_API_KEY="your_openai_key"')}
                className="text-[#7F8A9B] hover:text-[#E6E9EF] cursor-pointer shrink-0 transition-colors"
                title="Copy env var"
              >
                {copiedCode === 'export OPENAI_API_KEY="your_openai_key"' ? (
                  <Check className="w-3.5 h-3.5 text-[#6CC4A1]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Messaging Bridges with Authentic Colorful Logos */}
      <section aria-label="Messaging Bridges" className="space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#2A323E]">
          <div>
            <h2 className="text-base font-semibold text-[#E6E9EF]">
              2. Messaging bridges (same 3 agents in every workspace)
            </h2>
            <p className="text-xs text-[#7F8A9B]">
              Your team collaborates in their daily chat application; Switch bridges to the agent harnesses
            </p>
          </div>
          <span className="text-xs font-mono text-[#8DA2FF]">Switch 2.0 gateway</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Discord */}
          <div className="p-4 rounded-xl border border-[#2A323E] bg-[#151A21] hover:border-[#8DA2FF]/40 transition-colors space-y-3">
            <div className="flex items-center justify-between">
              <DiscordLogo className="w-7 h-7" />
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#1B212A] text-[#A3ACBA] border border-[#2A323E]">
                Bot & Gateway
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E6E9EF]">Discord</h3>
              <p className="text-xs text-[#A3ACBA] mt-0.5 leading-relaxed">
                Instant setup. Full slash command support, threads, and role-based permissions.
              </p>
            </div>
            <div className="p-2 rounded-md bg-[#10141B] border border-[#2A323E] font-mono text-xs text-[#E6E9EF] flex items-center justify-between">
              <span className="truncate pr-2">DISCORD_BOT_TOKEN</span>
              <button
                type="button"
                onClick={() => handleCopy('export DISCORD_BOT_TOKEN="your_token"')}
                className="text-[#7F8A9B] hover:text-[#E6E9EF] cursor-pointer shrink-0 transition-colors"
                title="Copy token"
              >
                {copiedCode === 'export DISCORD_BOT_TOKEN="your_token"' ? (
                  <Check className="w-3.5 h-3.5 text-[#6CC4A1]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Slack */}
          <div className="p-4 rounded-xl border border-[#2A323E] bg-[#151A21] hover:border-[#8DA2FF]/40 transition-colors space-y-3">
            <div className="flex items-center justify-between">
              <SlackLogo className="w-7 h-7" />
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#1B212A] text-[#A3ACBA] border border-[#2A323E]">
                Socket Mode
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E6E9EF]">Slack</h3>
              <p className="text-xs text-[#A3ACBA] mt-0.5 leading-relaxed">
                Enterprise ready. Uses WebSocket connection with no public ingress or open ports required.
              </p>
            </div>
            <div className="p-2 rounded-md bg-[#10141B] border border-[#2A323E] font-mono text-xs text-[#E6E9EF] flex items-center justify-between">
              <span className="truncate pr-2">SLACK_APP_TOKEN</span>
              <button
                type="button"
                onClick={() => handleCopy('export SLACK_APP_TOKEN="xapp-..."')}
                className="text-[#7F8A9B] hover:text-[#E6E9EF] cursor-pointer shrink-0 transition-colors"
                title="Copy token"
              >
                {copiedCode === 'export SLACK_APP_TOKEN="xapp-..."' ? (
                  <Check className="w-3.5 h-3.5 text-[#6CC4A1]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Teams */}
          <div className="p-4 rounded-xl border border-[#2A323E] bg-[#151A21] hover:border-[#8DA2FF]/40 transition-colors space-y-3">
            <div className="flex items-center justify-between">
              <TeamsLogo className="w-7 h-7" />
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#1B212A] text-[#A3ACBA] border border-[#2A323E]">
                M365 App
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E6E9EF]">Microsoft Teams</h3>
              <p className="text-xs text-[#A3ACBA] mt-0.5 leading-relaxed">
                Connects to Azure Bot Framework & Microsoft 365 developer tenant for corporate proposals.
              </p>
            </div>
            <div className="p-2 rounded-md bg-[#10141B] border border-[#2A323E] font-mono text-xs text-[#E6E9EF] flex items-center justify-between">
              <span className="truncate pr-2">APP_ID + SECRET</span>
              <button
                type="button"
                onClick={() => handleCopy('export TEAMS_APP_ID="guid"')}
                className="text-[#7F8A9B] hover:text-[#E6E9EF] cursor-pointer shrink-0 transition-colors"
                title="Copy credentials"
              >
                {copiedCode === 'export TEAMS_APP_ID="guid"' ? (
                  <Check className="w-3.5 h-3.5 text-[#6CC4A1]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Telegram */}
          <div className="p-4 rounded-xl border border-[#2A323E] bg-[#151A21] hover:border-[#8DA2FF]/40 transition-colors space-y-3">
            <div className="flex items-center justify-between">
              <TelegramLogo className="w-7 h-7" />
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#1B212A] text-[#A3ACBA] border border-[#2A323E]">
                @BotFather
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E6E9EF]">Telegram</h3>
              <p className="text-xs text-[#A3ACBA] mt-0.5 leading-relaxed">
                Mobile-first rapid sign-offs. Executives can approve proposals directly from Telegram chats.
              </p>
            </div>
            <div className="p-2 rounded-md bg-[#10141B] border border-[#2A323E] font-mono text-xs text-[#E6E9EF] flex items-center justify-between">
              <span className="truncate pr-2">TELEGRAM_BOT_TOKEN</span>
              <button
                type="button"
                onClick={() => handleCopy('export TELEGRAM_BOT_TOKEN="token"')}
                className="text-[#7F8A9B] hover:text-[#E6E9EF] cursor-pointer shrink-0 transition-colors"
                title="Copy token"
              >
                {copiedCode === 'export TELEGRAM_BOT_TOKEN="token"' ? (
                  <Check className="w-3.5 h-3.5 text-[#6CC4A1]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive 5-Step Setup Checklist */}
      <section aria-label="Human Setup Checklist" className="space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#2A323E]">
          <div>
            <h2 className="text-base font-semibold text-[#E6E9EF]">
              3. Interactive setup checklist
            </h2>
            <p className="text-xs text-[#7F8A9B]">
              Follow these 5 steps to run the complete end-to-end stack locally
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#A3ACBA] tabular-nums">
              {completedCount}/5 completed
            </span>
            <div className="w-24 h-1.5 bg-[#1B212A] rounded-full overflow-hidden border border-[#2A323E]">
              <div
                className="h-full bg-[#6CC4A1] transition-all duration-300"
                style={{ width: `${(completedCount / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#2A323E] rounded-xl border border-[#2A323E] bg-[#151A21] overflow-hidden">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`p-4 transition-colors ${item.done ? 'bg-[#151A21]/50' : 'hover:bg-[#1B212A]/40'}`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="mt-0.5 text-left cursor-pointer focus:outline-none"
                  aria-label={`Toggle ${item.title}`}
                >
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-[#6CC4A1]" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#7F8A9B] hover:text-[#8DA2FF]" />
                  )}
                </button>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-sm font-medium ${item.done ? 'text-[#7F8A9B] line-through' : 'text-[#E6E9EF]'}`}>
                      {item.title}
                    </span>
                    {item.code && (
                      <button
                        type="button"
                        onClick={() => handleCopy(item.code!)}
                        className="text-xs font-mono text-[#7F8A9B] hover:text-[#E6E9EF] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedCode === item.code ? (
                          <>
                            <Check className="w-3 h-3 text-[#6CC4A1]" />
                            <span className="text-[#6CC4A1]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy code</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[#A3ACBA] max-w-[65ch] leading-relaxed">
                    {item.detail}
                  </p>

                  {item.code && (
                    <pre className="text-xs font-mono bg-[#10141B] p-2.5 rounded-md border border-[#2A323E] text-[#E6E9EF] overflow-x-auto">
                      <code>{item.code}</code>
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

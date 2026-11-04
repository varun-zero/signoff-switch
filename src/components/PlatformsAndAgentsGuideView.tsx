import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Copy,
  ExternalLink,
  KeyRound,
  MessageSquare,
  Server,
  Terminal
} from 'lucide-react';
import {
  AntigravityLogo,
  ClaudeLogo,
  CodexLogo,
  DiscordLogo,
  DockerLogo,
  GitHubLogo,
  OpenCodeLogo,
  PlatformIcon,
  ProviderIcon,
  PythonLogo,
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
    title: '1. Start Switch Local Daemon & Mattermost',
    detail: 'Boot the local Switch orchestrator container. Serves WebSocket gateway on port 8080.',
    code: 'docker compose -f switch-docker-compose.yaml up -d',
    done: false
  },
  {
    id: 'chk-2',
    title: '2. Authenticate OpenCode & Agent Harnesses',
    detail: 'Log in via OpenCode CLI. Antigravity, Claude Code, and Codex CLI share the same config.',
    code: 'opencode auth login',
    done: false
  },
  {
    id: 'chk-3',
    title: '3. Enable Discord Bot & Message Intent',
    detail: 'Turn on Message Content Intent in Discord Developer Portal and paste Bot Token.',
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
    title: '5. Run Deterministic Checker & Export Pack',
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
    <div className="space-y-10">
      {/* Overview Intro Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0E0B2B] to-[#061814] border border-[#251F49] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="text-xs font-mono text-[#88F9C0] uppercase tracking-wider">
            Architecture Blueprint
          </div>
          <h2 className="text-2xl font-bold font-serif-display text-[#F5F3FF]">
            Multi-Platform Messaging & Multi-Agent Harnesses
          </h2>
          <p className="text-sm text-[#C5BFE9] max-w-[65ch] leading-relaxed">
            One deterministic compliance engine powering Discord, Slack, Microsoft Teams, and Telegram. Switch bridges the rooms while your choice of OpenCode, Antigravity, Claude Code, or Codex runs the work.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-xl bg-[#050414] border border-[#201B42] text-center min-w-[100px]">
            <div className="font-mono text-xl font-bold text-[#88F9C0] tabular-nums">
              4
            </div>
            <div className="text-xs font-mono text-[#958DBF] uppercase">Bridges</div>
          </div>
          <div className="p-3 rounded-xl bg-[#050414] border border-[#201B42] text-center min-w-[100px]">
            <div className="font-mono text-xl font-bold text-[#6331FB] tabular-nums">
              4
            </div>
            <div className="text-xs font-mono text-[#958DBF] uppercase">Harnesses</div>
          </div>
          <div className="p-3 rounded-xl bg-[#050414] border border-[#201B42] text-center min-w-[100px]">
            <div className="font-mono text-xl font-bold text-[#00F5A0] tabular-nums">
              8/8
            </div>
            <div className="text-xs font-mono text-[#958DBF] uppercase">Rules</div>
          </div>
        </div>
      </div>

      {/* Section 1: Agent Harnesses */}
      <section aria-label="Agent Harnesses" className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#201B42]">
          <div>
            <h2 className="text-lg font-bold font-serif-display text-[#F5F3FF]">
              1. Agent Harnesses (Configurable in `signoff.template.yaml`)
            </h2>
            <p className="text-xs text-[#958DBF]">
              Mix and match providers per agent role or use your existing team API keys
            </p>
          </div>
          <span className="text-xs font-mono text-[#88F9C0]">4 Supported Runtimes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* OpenCode */}
          <div className="p-5 rounded-2xl border border-[#10B981]/40 bg-[#09081B] hover:border-[#10B981] transition-all space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <OpenCodeLogo className="w-8 h-8" />
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#10B981]/20 text-[#34D399]">
                Default · Free
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F3FF]">OpenCode CLI</h3>
              <p className="text-xs text-[#C5BFE9] mt-0.5 leading-relaxed">
                Terminal-native open code assistant. Works out-of-the-box with local or cloud models.
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#050414] border border-[#1A1637] font-mono text-xs text-[#88F9C0] flex items-center justify-between">
              <span>opencode auth login</span>
              <button
                type="button"
                onClick={() => handleCopy('opencode auth login')}
                className="text-[#958DBF] hover:text-[#F5F3FF] cursor-pointer"
                title="Copy command"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Antigravity */}
          <div className="p-5 rounded-2xl border border-[#4285F4]/40 bg-[#09081B] hover:border-[#4285F4] transition-all space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <AntigravityLogo className="w-8 h-8" />
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#4285F4]/20 text-[#8AB4F8]">
                Google AI Studio
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F3FF]">Antigravity</h3>
              <p className="text-xs text-[#C5BFE9] mt-0.5 leading-relaxed">
                Google DeepMind & Gemini 2.5/3.0 harness. Superior long-context reasoning for large RFP packs.
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#050414] border border-[#1A1637] font-mono text-xs text-[#88F9C0] flex items-center justify-between">
              <span>GEMINI_API_KEY</span>
              <button
                type="button"
                onClick={() => handleCopy('export GEMINI_API_KEY="your_gemini_key"')}
                className="text-[#958DBF] hover:text-[#F5F3FF] cursor-pointer"
                title="Copy env var"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Claude Code */}
          <div className="p-5 rounded-2xl border border-[#E27855]/40 bg-[#09081B] hover:border-[#E27855] transition-all space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <ClaudeLogo className="w-8 h-8" />
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#E27855]/20 text-[#E27855]">
                Anthropic
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F3FF]">Claude Code</h3>
              <p className="text-xs text-[#C5BFE9] mt-0.5 leading-relaxed">
                Agentic terminal coding with Claude 3.7 Sonnet. Exceptional structured drafting and reasoning.
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#050414] border border-[#1A1637] font-mono text-xs text-[#88F9C0] flex items-center justify-between">
              <span>ANTHROPIC_API_KEY</span>
              <button
                type="button"
                onClick={() => handleCopy('export ANTHROPIC_API_KEY="your_anthropic_key"')}
                className="text-[#958DBF] hover:text-[#F5F3FF] cursor-pointer"
                title="Copy env var"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Codex CLI */}
          <div className="p-5 rounded-2xl border border-[#10A37E]/40 bg-[#09081B] hover:border-[#10A37E] transition-all space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <CodexLogo className="w-8 h-8" />
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#10A37E]/20 text-[#34D399]">
                OpenAI Agents
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F3FF]">Codex CLI</h3>
              <p className="text-xs text-[#C5BFE9] mt-0.5 leading-relaxed">
                OpenAI o3-mini and GPT-4o harness. High-speed JSON schema execution and matrix parsing.
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#050414] border border-[#1A1637] font-mono text-xs text-[#88F9C0] flex items-center justify-between">
              <span>OPENAI_API_KEY</span>
              <button
                type="button"
                onClick={() => handleCopy('export OPENAI_API_KEY="your_openai_key"')}
                className="text-[#958DBF] hover:text-[#F5F3FF] cursor-pointer"
                title="Copy env var"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Messaging Bridges with Colorful Logos */}
      <section aria-label="Messaging Bridges" className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#201B42]">
          <div>
            <h2 className="text-lg font-bold font-serif-display text-[#F5F3FF]">
              2. Messaging Bridges (Same 3 Agents in Every Workspace)
            </h2>
            <p className="text-xs text-[#958DBF]">
              Your team collaborates in their daily chat application; Switch bridges to the agent harnesses
            </p>
          </div>
          <span className="text-xs font-mono text-[#88F9C0]">Switch 2.0 Gateway</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Discord */}
          <div className="p-5 rounded-2xl border border-[#5865F2]/40 bg-[#09081B] hover:border-[#5865F2] transition-all space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <DiscordLogo className="w-8 h-8" />
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#5865F2]/20 text-[#8896F8]">
                Bot & Gateway
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F3FF]">Discord</h3>
              <p className="text-xs text-[#C5BFE9] mt-0.5 leading-relaxed">
                Instant setup. Full slash command support, threads, and role-based permissions.
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#050414] border border-[#1A1637] font-mono text-xs text-[#88F9C0] flex items-center justify-between">
              <span>DISCORD_BOT_TOKEN</span>
              <button
                type="button"
                onClick={() => handleCopy('export DISCORD_BOT_TOKEN="your_token"')}
                className="text-[#958DBF] hover:text-[#F5F3FF] cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Slack */}
          <div className="p-5 rounded-2xl border border-[#36C5F0]/40 bg-[#09081B] hover:border-[#36C5F0] transition-all space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <SlackLogo className="w-8 h-8" />
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#36C5F0]/20 text-[#36C5F0]">
                Socket Mode
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F3FF]">Slack</h3>
              <p className="text-xs text-[#C5BFE9] mt-0.5 leading-relaxed">
                Enterprise ready. Uses WebSocket connection with no public ingress or open ports required.
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#050414] border border-[#1A1637] font-mono text-xs text-[#88F9C0] flex items-center justify-between">
              <span>SLACK_APP_TOKEN</span>
              <button
                type="button"
                onClick={() => handleCopy('export SLACK_APP_TOKEN="xapp-..."')}
                className="text-[#958DBF] hover:text-[#F5F3FF] cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Teams */}
          <div className="p-5 rounded-2xl border border-[#7B83EB]/40 bg-[#09081B] hover:border-[#7B83EB] transition-all space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <TeamsLogo className="w-8 h-8" />
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#7B83EB]/20 text-[#A5ABF9]">
                M365 App
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F3FF]">Microsoft Teams</h3>
              <p className="text-xs text-[#C5BFE9] mt-0.5 leading-relaxed">
                Connects to Azure Bot Framework & Microsoft 365 developer tenant for corporate proposals.
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#050414] border border-[#1A1637] font-mono text-xs text-[#88F9C0] flex items-center justify-between">
              <span>APP_ID + SECRET</span>
              <button
                type="button"
                onClick={() => handleCopy('export TEAMS_APP_ID="guid"')}
                className="text-[#958DBF] hover:text-[#F5F3FF] cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Telegram */}
          <div className="p-5 rounded-2xl border border-[#2AABEE]/40 bg-[#09081B] hover:border-[#2AABEE] transition-all space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <TelegramLogo className="w-8 h-8" />
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#2AABEE]/20 text-[#60CDFF]">
                @BotFather
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F3FF]">Telegram</h3>
              <p className="text-xs text-[#C5BFE9] mt-0.5 leading-relaxed">
                Mobile-first rapid sign-offs. Executives can approve proposals directly from Telegram chats.
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#050414] border border-[#1A1637] font-mono text-xs text-[#88F9C0] flex items-center justify-between">
              <span>TELEGRAM_BOT_TOKEN</span>
              <button
                type="button"
                onClick={() => handleCopy('export TELEGRAM_BOT_TOKEN="token"')}
                className="text-[#958DBF] hover:text-[#F5F3FF] cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive 5-Step Setup Checklist */}
      <section aria-label="Human Setup Checklist" className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#201B42]">
          <div>
            <h2 className="text-lg font-bold font-serif-display text-[#F5F3FF]">
              3. Interactive Setup Checklist
            </h2>
            <p className="text-xs text-[#958DBF]">
              Follow these 5 steps to run the complete end-to-end stack locally
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#88F9C0]">
              {completedCount}/5 Completed
            </span>
            <div className="w-20 h-2 bg-[#120F2E] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00F5A0] transition-all duration-300"
                style={{ width: `${(completedCount / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#181436] rounded-2xl border border-[#201B42] bg-[#09081B] overflow-hidden">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`p-4 transition-colors ${item.done ? 'bg-[#00F5A0]/5' : 'hover:bg-[#0E0C26]'}`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="mt-0.5 text-left cursor-pointer focus:outline-none"
                  aria-label={`Toggle ${item.title}`}
                >
                  {item.done ? (
                    <CheckCircle2 className="w-5 h-5 text-[#00F5A0]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#6331FB] hover:text-[#88F9C0]" />
                  )}
                </button>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-sm font-bold ${item.done ? 'text-[#88F9C0] line-through' : 'text-[#F5F3FF]'}`}>
                      {item.title}
                    </span>
                    {item.code && (
                      <button
                        type="button"
                        onClick={() => handleCopy(item.code!)}
                        className="text-xs font-mono text-[#958DBF] hover:text-[#88F9C0] flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[#C5BFE9] max-w-[65ch] leading-relaxed">
                    {item.detail}
                  </p>

                  {item.code && (
                    <pre className="text-xs font-mono bg-[#050414] p-2.5 rounded-lg border border-[#1A1637] text-[#88F9C0] overflow-x-auto">
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

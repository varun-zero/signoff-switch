import React from 'react';
import {
  AgentProvider,
  CheckerResult,
  PlatformBridge,
  ScorecardResult,
  VerticalId
} from '../engine/signoffEngine';
import { VerticalPack } from '../engine/verticalsData';
import { InspectorTab } from './ArtifactInspectorPanel';
import { PlatformIcon, ProviderIcon } from './BrandLogos';
import { CheckCircle2, ChevronRight, FileCheck2, FileSpreadsheet, UserCheck } from 'lucide-react';

interface VisualPipelineFlowProps {
  vertical: VerticalId;
  pack: VerticalPack;
  bridge: PlatformBridge;
  provider: AgentProvider;
  checker: CheckerResult;
  scorecard: ScorecardResult;
  isFixed: boolean;
  isSignedOff: boolean;
  activeTab: InspectorTab;
  onSelectTab: (t: InspectorTab) => void;
  onApplyHumanFix: () => void;
  onSignOffAndExport: () => void;
}

export const VisualPipelineFlow: React.FC<VisualPipelineFlowProps> = ({
  pack,
  bridge,
  provider,
  checker,
  scorecard,
  isFixed,
  isSignedOff,
  activeTab,
  onSelectTab,
  onApplyHumanFix,
  onSignOffAndExport
}) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scorecard.total_score / 100) * circumference;

  return (
    <section
      aria-label="Visual Compliance Pipeline"
      className="border-b border-[#201B42] px-6 py-4 bg-[#050414]"
    >
      <div className="max-w-[1440px] mx-auto space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1A1637]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00F5A0]" />
            <span className="text-xs font-mono font-medium tracking-wide uppercase text-[#C5BFE9]">
              Autonomous Switch Pipeline
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-[#958DBF]">
            <span>Audit: <strong className="text-[#F5F3FF]">Deterministic Check</strong></span>
            <span>·</span>
            <span>Gate: <strong className="text-[#88F9C0]">Human-in-the-Loop</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-stretch">
          {/* Stage 1: Intake Room & Source Doc */}
          <button
            type="button"
            onClick={() => onSelectTab('evidence')}
            className={`group flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-colors cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-[#120F2E] border-[#88F9C0]'
                : 'bg-[#09081B] border-[#201B42] hover:border-[#6331FB]'
            }`}
          >
            <PlatformIcon bridge={bridge} className="w-8 h-8 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-mono text-[#958DBF] uppercase tracking-wider">
                1 · Intake
              </div>
              <div className="text-sm font-semibold text-[#F5F3FF] truncate">
                #{pack.intakeRoomName}
              </div>
              <div className="text-xs font-mono text-[#88F9C0] truncate mt-0.5">
                {pack.sourceDocPages}p PDF · {pack.evidence.length} Files
              </div>
            </div>
          </button>

          {/* Stage 2: @signoff-analyst -> Matrix */}
          <button
            type="button"
            onClick={() => onSelectTab('matrix')}
            className={`group flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-colors cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-[#120F2E] border-[#88F9C0]'
                : 'bg-[#09081B] border-[#201B42] hover:border-[#6331FB]'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#141133] flex items-center justify-center shrink-0 text-[#88F9C0]">
              <FileSpreadsheet className="w-5 h-5 text-[#88F9C0]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-mono text-[#958DBF] uppercase tracking-wider">
                2 · Analyst
              </div>
              <div className="text-sm font-semibold text-[#F5F3FF] truncate">
                @signoff-analyst
              </div>
              <div className="text-xs font-mono text-[#C5BFE9] truncate mt-0.5">
                {pack.requirements.length} Reqs Matrix
              </div>
            </div>
          </button>

          {/* Stage 3: @signoff-drafter -> Cited Draft */}
          <button
            type="button"
            onClick={() => onSelectTab('draft')}
            className={`group flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-colors cursor-pointer ${
              activeTab === 'draft'
                ? 'bg-[#120F2E] border-[#88F9C0]'
                : 'bg-[#09081B] border-[#201B42] hover:border-[#6331FB]'
            }`}
          >
            <ProviderIcon provider={provider} className="w-8 h-8 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-mono text-[#958DBF] uppercase tracking-wider">
                3 · Drafter
              </div>
              <div className="text-sm font-semibold text-[#F5F3FF] truncate">
                @signoff-drafter
              </div>
              <div className="text-xs font-mono text-[#C5BFE9] truncate mt-0.5">
                {pack.sections.length} Cited Sections
              </div>
            </div>
          </button>

          {/* Stage 4: @signoff-reviewer -> Live Radial Score Gauge */}
          <button
            type="button"
            onClick={() => onSelectTab('checker')}
            className={`group flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-colors cursor-pointer ${
              activeTab === 'checker'
                ? 'bg-[#120F2E] border-[#88F9C0]'
                : 'bg-[#09081B] border-[#201B42] hover:border-[#6331FB]'
            }`}
          >
            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
              <svg className="w-11 h-11 -rotate-90" viewBox="0 0 54 54" aria-hidden="true">
                <circle
                  cx="27"
                  cy="27"
                  r={radius}
                  stroke="#1D193D"
                  strokeWidth="4.5"
                  fill="none"
                />
                <circle
                  cx="27"
                  cy="27"
                  r={radius}
                  stroke={checker.passed ? '#00F5A0' : '#F59E0B'}
                  strokeWidth="4.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-300"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-[#F5F3FF] tabular-nums">
                {scorecard.total_score}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-mono text-[#958DBF] uppercase tracking-wider">
                4 · Reviewer
              </div>
              <div className="text-sm font-semibold text-[#F5F3FF] truncate">
                @signoff-reviewer
              </div>
              <div className={`text-xs font-mono truncate mt-0.5 ${checker.passed ? 'text-[#88F9C0]' : 'text-[#F59E0B]'}`}>
                {checker.rules_passed}/8 Rules {checker.passed ? 'PASS' : 'HOLD'}
              </div>
            </div>
          </button>

          {/* Stage 5: Human Sign-Off Gate CTA */}
          <button
            type="button"
            onClick={isFixed ? onSignOffAndExport : onApplyHumanFix}
            className={`col-span-2 md:col-span-1 group flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer ${
              isFixed
                ? 'bg-[#00F5A0] hover:bg-[#28FFAE] text-[#02010A]'
                : 'bg-[#6331FB] hover:bg-[#7243FC] text-[#FFFFFF]'
            }`}
          >
            <div className="shrink-0">
              {isSignedOff ? (
                <FileCheck2 className={`w-7 h-7 ${isFixed ? 'text-[#02010A]' : 'text-[#FFFFFF]'}`} />
              ) : isFixed ? (
                <CheckCircle2 className="w-7 h-7 text-[#02010A]" />
              ) : (
                <UserCheck className="w-7 h-7 text-[#FFFFFF]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className={`text-xs font-mono uppercase tracking-wider ${isFixed ? 'text-[#02010A] font-bold' : 'text-[#FFFFFF]'}`}>
                5 · Human Gate
              </div>
              <div className={`text-sm font-bold truncate ${isFixed ? 'text-[#02010A]' : 'text-[#FFFFFF]'}`}>
                {isFixed ? (isSignedOff ? 'Signed Off' : 'Ready: Sign Off') : 'Fix 2 Holds'}
              </div>
              <div className={`text-xs font-mono truncate mt-0.5 ${isFixed ? 'text-[#02010A] font-semibold' : 'text-[#FFFFFF]'}`}>
                {isFixed ? 'Export Pack' : '78 → 94/100'}
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${isFixed ? 'text-[#02010A]' : 'text-[#FFFFFF]'}`} />
          </button>
        </div>
      </div>
    </section>
  );
};

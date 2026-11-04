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
import { FileCheck2, FileSpreadsheet, UserCheck } from 'lucide-react';

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
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scorecard.total_score / 100) * circumference;

  return (
    <section
      aria-label="Visual Compliance Pipeline"
      className="border-b border-[#221E42] px-6 py-5 bg-[#01010D]"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3.5 items-stretch">
        {/* Stage 1: Intake Room & Source Doc */}
        <button
          type="button"
          onClick={() => onSelectTab('evidence')}
          className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
            activeTab === 'evidence'
              ? 'bg-[#120F2D] border-[#88F9C0]'
              : 'bg-[#080716] border-[#221E42] hover:border-[#6331FB]'
          }`}
        >
          <PlatformIcon bridge={bridge} className="w-8 h-8 text-[#88F9C0] shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#F4F3FF] truncate">
              1. #{pack.intakeRoomName}
            </div>
            <div className="text-sm font-mono text-[#88F9C0] truncate">
              {pack.sourceDocPages}p PDF · {pack.evidence.length} Files
            </div>
          </div>
        </button>

        {/* Stage 2: @signoff-analyst -> Matrix */}
        <button
          type="button"
          onClick={() => onSelectTab('matrix')}
          className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
            activeTab === 'matrix'
              ? 'bg-[#120F2D] border-[#88F9C0]'
              : 'bg-[#080716] border-[#221E42] hover:border-[#6331FB]'
          }`}
        >
          <FileSpreadsheet className="w-8 h-8 text-[#6331FB] shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#F4F3FF] truncate">
              2. @analyst
            </div>
            <div className="text-sm font-mono text-[#C2BCE8] truncate">
              {pack.requirements.length} Reqs Matrix
            </div>
          </div>
        </button>

        {/* Stage 3: @signoff-drafter -> Cited Draft */}
        <button
          type="button"
          onClick={() => onSelectTab('draft')}
          className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
            activeTab === 'draft'
              ? 'bg-[#120F2D] border-[#88F9C0]'
              : 'bg-[#080716] border-[#221E42] hover:border-[#6331FB]'
          }`}
        >
          <ProviderIcon provider={provider} className="w-8 h-8 text-[#88F9C0] shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#F4F3FF] truncate">
              3. @drafter
            </div>
            <div className="text-sm font-mono text-[#C2BCE8] truncate">
              {pack.sections.length} Cited Sections
            </div>
          </div>
        </button>

        {/* Stage 4: @signoff-reviewer -> Live Radial Score Gauge */}
        <button
          type="button"
          onClick={() => onSelectTab('checker')}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
            activeTab === 'checker'
              ? 'bg-[#120F2D] border-[#88F9C0]'
              : 'bg-[#080716] border-[#221E42] hover:border-[#6331FB]'
          }`}
        >
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 60 60" aria-hidden="true">
              <circle
                cx="30"
                cy="30"
                r={radius}
                stroke="#221E42"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="30"
                cy="30"
                r={radius}
                stroke={checker.passed ? '#88F9C0' : '#6331FB'}
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute font-mono text-sm font-bold text-[#F4F3FF] tabular-nums">
              {scorecard.total_score}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#F4F3FF] truncate">
              4. @reviewer
            </div>
            <div className="text-sm font-mono text-[#88F9C0] truncate">
              {checker.rules_passed}/8 Rules
            </div>
          </div>
        </button>

        {/* Stage 5: Human Sign-Off Gate */}
        <button
          type="button"
          onClick={isFixed ? onSignOffAndExport : onApplyHumanFix}
          className="col-span-2 sm:col-span-1 flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-[#88F9C0] text-[#01010D] text-left transition-transform active:scale-[0.99] cursor-pointer"
        >
          {isSignedOff ? (
            <FileCheck2 className="w-8 h-8 text-[#01010D] shrink-0" />
          ) : (
            <UserCheck className="w-8 h-8 text-[#01010D] shrink-0" />
          )}
          <div className="min-w-0">
            <div className="text-sm font-bold text-[#01010D] truncate">
              {isFixed ? '5. Sign Off' : '5. Fix 2 Holds'}
            </div>
            <div className="text-sm font-mono font-semibold text-[#01010D] truncate">
              {isFixed ? 'Export .DOCX' : '78 → 94/100'}
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};

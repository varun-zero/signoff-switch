import React from 'react';
import { CheckerResult, ScorecardResult, VerticalId } from '../engine/signoffEngine';
import { VerticalPack } from '../engine/verticalsData';
import { InspectorTab } from './ArtifactInspectorPanel';
import { Check, Circle } from 'lucide-react';

interface VisualPipelineFlowProps {
  vertical: VerticalId;
  pack: VerticalPack;
  checker: CheckerResult;
  scorecard: ScorecardResult;
  isFixed: boolean;
  isSignedOff: boolean;
  activeTab: InspectorTab;
  onSelectTab: (t: InspectorTab) => void;
}

export const VisualPipelineFlow: React.FC<VisualPipelineFlowProps> = ({
  pack,
  checker,
  scorecard,
  isFixed,
  isSignedOff,
  activeTab,
  onSelectTab
}) => {
  const steps: Array<{
    id: InspectorTab;
    label: string;
    sublabel: string;
    status: 'complete' | 'current' | 'pending';
  }> = [
    {
      id: 'evidence',
      label: 'Intake',
      sublabel: `${pack.sourceDocPages}p source`,
      status: 'complete'
    },
    {
      id: 'matrix',
      label: 'Analyst',
      sublabel: `${pack.requirements.length} requirements`,
      status: 'complete'
    },
    {
      id: 'draft',
      label: 'Drafter',
      sublabel: `${pack.sections.length} sections`,
      status: 'complete'
    },
    {
      id: 'checker',
      label: 'Reviewer',
      sublabel: checker.passed ? '8/8 pass' : '2 holds',
      status: isFixed ? 'complete' : 'current'
    },
    {
      id: 'checker',
      label: isSignedOff ? 'Signed off' : 'Sign-off',
      sublabel: isSignedOff ? 'Pack ready' : isFixed ? 'Ready' : 'Pending',
      status: isSignedOff ? 'complete' : isFixed ? 'current' : 'pending'
    }
  ];

  return (
    <nav aria-label="Pipeline progress" className="py-3 px-4 bg-[#151A21] border border-[#2A323E] rounded-lg">
      <ol className="flex items-center justify-between text-xs">
        {steps.map((step, idx) => {
          const isSelected =
            (step.label === 'Reviewer' && activeTab === 'checker') ||
            (step.label === 'Drafter' && activeTab === 'draft') ||
            (step.label === 'Analyst' && activeTab === 'matrix') ||
            (step.label === 'Intake' && activeTab === 'evidence');

          return (
            <React.Fragment key={`${step.label}-${idx}`}>
              <li className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectTab(step.id)}
                  className={`flex items-center gap-2 text-left cursor-pointer transition-colors ${
                    isSelected ? 'text-[#8DA2FF]' : 'text-[#A3ACBA] hover:text-[#E6E9EF]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-xs font-semibold ${
                      step.status === 'complete'
                        ? 'bg-[rgba(108,196,161,0.15)] text-[#6CC4A1]'
                        : step.status === 'current'
                          ? 'bg-[#8DA2FF] text-[#0F1217]'
                          : 'bg-[#1B212A] text-[#7F8A9B]'
                    }`}
                  >
                    {step.status === 'complete' ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <div>
                    <div className="font-medium text-[#E6E9EF] leading-tight">
                      {step.label}
                    </div>
                    <div className="text-xs text-[#7F8A9B] font-mono leading-tight">
                      {step.sublabel}
                    </div>
                  </div>
                </button>
              </li>

              {idx < steps.length - 1 && (
                <li aria-hidden="true" className="flex-1 mx-3 h-[1px] bg-[#2A323E]" />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

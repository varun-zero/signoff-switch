import React from 'react';
import { CheckerResult } from '../engine/signoffEngine';
import { Check, Pause, AlertTriangle, ExternalLink } from 'lucide-react';

interface RulesTableProps {
  checker: CheckerResult;
  onViewRule: (ruleId: number) => void;
}

interface RuleDefinition {
  id: number;
  code: string;
  name: string;
  standard: string;
  targetTab: 'draft' | 'evidence' | 'matrix';
}

const ALL_RULES: RuleDefinition[] = [
  { id: 2, code: 'R2', name: 'Word cap', standard: 'Zero draft sections exceed strict RFP word limits', targetTab: 'draft' },
  { id: 6, code: 'R6', name: 'Mandatory files', standard: 'Mandatory file attachments [E7] attached & verified', targetTab: 'evidence' },
  { id: 1, code: 'R1', name: 'Coverage', standard: '100% of RFP requirements mapped to matrix', targetTab: 'matrix' },
  { id: 3, code: 'R3', name: 'Placeholders', standard: 'No [TODO], [TBD], or unaddressed brackets', targetTab: 'draft' },
  { id: 4, code: 'R4', name: 'Citations', standard: 'All quantitative metrics cite intake evidence [EX]', targetTab: 'draft' },
  { id: 5, code: 'R5', name: 'Numbers', standard: 'Budget arithmetic & rate cards verified consistent', targetTab: 'draft' },
  { id: 7, code: 'R7', name: 'Headings', standard: 'Heading schema matches RFP evaluation structure', targetTab: 'draft' },
  { id: 8, code: 'R8', name: 'Rubric', standard: 'Scored against weighted evaluation criteria', targetTab: 'matrix' }
];

export const RulesTable: React.FC<RulesTableProps> = ({ checker, onViewRule }) => {
  const violatedRuleIds = new Set(checker.violations.map((v) => v.rule_id));

  // Sort: Holds first, then passed rules
  const sortedRules = [...ALL_RULES].sort((a, b) => {
    const aViolated = violatedRuleIds.has(a.id);
    const bViolated = violatedRuleIds.has(b.id);
    if (aViolated && !bViolated) return -1;
    if (!aViolated && bViolated) return 1;
    return a.id - b.id;
  });

  return (
    <div className="bg-[#151A21] border border-[#2A323E] rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 bg-[#1B212A] border-b border-[#2A323E] flex items-center justify-between text-xs font-medium text-[#A3ACBA]">
        <div className="flex items-center gap-6">
          <span className="w-16">Status</span>
          <span className="w-24">Rule</span>
          <span>Requirement & finding</span>
        </div>
        <span>Location</span>
      </div>

      <div className="divide-y divide-[#2A323E]">
        {sortedRules.map((r) => {
          const violation = checker.violations.find((v) => v.rule_id === r.id);
          const isHold = !!violation;

          return (
            <div
              key={r.id}
              className={`min-h-[44px] px-4 py-2 flex items-center justify-between gap-4 text-xs transition-colors ${
                isHold
                  ? 'bg-[rgba(232,176,74,0.12)]'
                  : 'hover:bg-[#1B212A]/50'
              }`}
            >
              <div className="flex items-center gap-6 min-w-0 flex-1">
                {/* Fixed status indicator */}
                <div className="w-16 shrink-0">
                  {isHold ? (
                    <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-[#E8B04A]">
                      <Pause className="w-3.5 h-3.5 fill-[#E8B04A]" />
                      <span>HOLD</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[#A3ACBA]">
                      <Check className="w-3.5 h-3.5 text-[#6CC4A1]" />
                      <span>PASS</span>
                    </span>
                  )}
                </div>

                {/* Rule Code & Name */}
                <div className="w-24 shrink-0 font-mono">
                  <span className={isHold ? 'font-bold text-[#E6E9EF]' : 'text-[#A3ACBA]'}>
                    {r.code} {r.name}
                  </span>
                </div>

                {/* Requirement / Remediation Finding */}
                <div className="min-w-0 flex-1 truncate">
                  {isHold ? (
                    <span className="text-[#E6E9EF] font-medium">
                      {violation?.remediation || r.standard}
                    </span>
                  ) : (
                    <span className="text-[#7F8A9B]">
                      {r.standard}
                    </span>
                  )}
                </div>
              </div>

              {/* Action / Location */}
              <div className="shrink-0 flex items-center gap-2">
                {isHold ? (
                  <button
                    type="button"
                    onClick={() => onViewRule(r.id)}
                    className="px-2.5 py-1 text-xs font-medium text-[#E6E9EF] bg-[#1B212A] border border-[#384252] hover:border-[#8DA2FF] rounded transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3 text-[#7F8A9B]" />
                  </button>
                ) : (
                  <span className="text-xs text-[#7F8A9B] font-mono">
                    verified
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

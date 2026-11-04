import React, { useState } from 'react';
import {
  BidScoreResult,
  CheckerResult,
  DecisionLogEntry,
  DraftSection,
  EvidenceItem,
  PricingQuoteResult,
  RequirementRow,
  ScorecardResult,
  VerticalId,
  countWords
} from '../engine/signoffEngine';
import {
  CheckCircle2,
  Download
} from 'lucide-react';

export type InspectorTab = 'checker' | 'matrix' | 'draft' | 'evidence' | 'extra';

interface ArtifactInspectorPanelProps {
  vertical: VerticalId;
  activeTab: InspectorTab;
  onSelectTab: (t: InspectorTab) => void;
  checker: CheckerResult;
  scorecard: ScorecardResult;
  requirements: RequirementRow[];
  evidence: EvidenceItem[];
  sections: DraftSection[];
  decisionLog: DecisionLogEntry[];
  dealPricing?: PricingQuoteResult;
  bidScore?: BidScoreResult;
  onToggleEvidenceAttached: (evidenceId: string) => void;
  onUpdateSectionContent: (sectionId: string, newContent: string) => void;
  onUpdateRateCardHours?: (rowId: string, hours: number) => void;
  onApplyHumanFix: () => void;
  onDownloadArtifact: (filename: string, content: string, mimeType?: string) => void;
  onSignOffAndExport: () => void;
}

const RULE_SHORT_NAMES = [
  'R1 Coverage',
  'R2 Word Cap',
  'R3 Placeholders',
  'R4 Citations',
  'R5 Numbers',
  'R6 Files',
  'R7 Headings',
  'R8 Rubric'
];

export const ArtifactInspectorPanel: React.FC<ArtifactInspectorPanelProps> = ({
  vertical,
  activeTab,
  onSelectTab,
  checker,
  scorecard,
  requirements,
  evidence,
  sections,
  decisionLog,
  dealPricing,
  bidScore,
  onToggleEvidenceAttached,
  onUpdateSectionContent,
  onUpdateRateCardHours,
  onApplyHumanFix,
  onDownloadArtifact
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');

  const currentSection =
    sections.find((s) => s.id === selectedSectionId) || sections[0];

  const fullDraftMarkdown = sections
    .map((s) => `## ${s.title}\n\n${s.content}`)
    .join('\n\n---\n\n');

  const violatedRuleIds = new Set(checker.violations.map((v) => v.rule_id));

  return (
    <section aria-label="Compliance Artifacts" className="space-y-6">
      {/* Header & Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#221E42]">
        <h2 className="text-xl font-semibold text-[#F4F3FF]">
          Compliance Telemetry
        </h2>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelectTab('checker')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'checker'
                ? 'bg-[#6331FB] text-[#FFFFFF]'
                : 'text-[#C2BCE8] hover:text-[#F4F3FF]'
            }`}
          >
            Checker ({checker.violations.length === 0 ? '8/8' : `${checker.rules_passed}/8`})
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('matrix')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-[#6331FB] text-[#FFFFFF]'
                : 'text-[#C2BCE8] hover:text-[#F4F3FF]'
            }`}
          >
            Matrix ({requirements.length})
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('draft')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'draft'
                ? 'bg-[#6331FB] text-[#FFFFFF]'
                : 'text-[#C2BCE8] hover:text-[#F4F3FF]'
            }`}
          >
            Draft ({sections.length})
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('evidence')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-[#6331FB] text-[#FFFFFF]'
                : 'text-[#C2BCE8] hover:text-[#F4F3FF]'
            }`}
          >
            Evidence ({evidence.filter((e) => e.attached).length}/{evidence.length})
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('extra')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'extra'
                ? 'bg-[#6331FB] text-[#FFFFFF]'
                : 'text-[#C2BCE8] hover:text-[#F4F3FF]'
            }`}
          >
            {vertical === 'deal' ? 'Pricing' : vertical === 'bid' ? 'Bid Memo' : 'Audit Log'}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'checker' && (
        <div className="space-y-6">
          {/* 8-Rule Visual Segment Bar */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <h3 className="text-base font-semibold text-[#F4F3FF]">
                8-Rule Deterministic Gate
              </h3>
              <span className="font-mono text-[#88F9C0] tabular-nums">
                {checker.rules_passed}/8 Passed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RULE_SHORT_NAMES.map((label, idx) => {
                const ruleNum = idx + 1;
                const isViolated = violatedRuleIds.has(ruleNum);
                return (
                  <div
                    key={label}
                    className={`px-3 py-2 rounded-lg font-mono text-sm flex items-center justify-between ${
                      isViolated
                        ? 'bg-[#6331FB] text-[#FFFFFF] font-semibold'
                        : 'bg-[#0C1D18] text-[#88F9C0]'
                    }`}
                  >
                    <span>{label}</span>
                    <span>{isViolated ? 'HOLD' : 'OK'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Violations or Pass Banner */}
          {checker.violations.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-[#F4F3FF]">
                  Active Holds ({checker.violations.length})
                </h3>
                <button
                  type="button"
                  onClick={onApplyHumanFix}
                  className="px-3.5 py-1.5 text-sm font-semibold text-[#01010D] bg-[#88F9C0] rounded-lg transition-colors cursor-pointer"
                >
                  Resolve 2 Holds
                </button>
              </div>

              <div className="divide-y divide-[#221E42] border-t border-b border-[#221E42]">
                {checker.violations.map((v, idx) => (
                  <div key={`${v.rule_id}-${idx}`} className="py-3.5 space-y-1">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-semibold text-[#88F9C0]">
                        Rule {v.rule_id} · {v.rule_name}
                      </span>
                      <code className="text-sm font-mono text-[#C2BCE8]">
                        {v.file}:{v.line}
                      </code>
                    </div>
                    <p className="text-sm text-[#F4F3FF] max-w-[48ch]">{v.remediation}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-3.5 border-b border-[#221E42] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#88F9C0] shrink-0" />
              <p className="text-sm text-[#F4F3FF] max-w-[48ch]">
                All 8 compliance rules verified. Ready for .DOCX export.
              </p>
            </div>
          )}

          {/* Visual Score Bars */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#F4F3FF]">
                Weighted Rubric ({scorecard.total_score}/100)
              </h3>
              <button
                type="button"
                onClick={() =>
                  onDownloadArtifact(
                    `${vertical}-draft.md`,
                    `${fullDraftMarkdown}\n\n---\n\n${scorecard.markdown_scorecard}`
                  )
                }
                className="text-sm font-medium text-[#88F9C0] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download .MD</span>
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {scorecard.criteria.map((c) => (
                <div key={c.criterion} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#F4F3FF]">
                      {c.label} <span className="text-[#C2BCE8] font-mono">({c.weight}%)</span>
                    </span>
                    <span className="font-mono font-semibold text-[#88F9C0] tabular-nums">
                      {c.score}/100
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#120F2D] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        c.score >= 80 ? 'bg-[#88F9C0]' : 'bg-[#6331FB]'
                      }`}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-[#F4F3FF]">
              Compliance Matrix
            </h3>
            <button
              type="button"
              onClick={() => {
                const header = 'ID,Section,Requirement,Mandatory,Page,WordLimit,EvidenceIDs,Status';
                const rows = requirements.map(
                  (r) =>
                    `${r.id},"${r.section}","${r.requirement.replace(/"/g, '""')}",${r.mandatory},${r.source_page},${r.word_limit || ''},"${r.evidence_ids.join(';')}",${r.status}`
                );
                onDownloadArtifact(
                  `${vertical}-compliance-matrix.csv`,
                  [header, ...rows].join('\n'),
                  'text/csv'
                );
              }}
              className="px-3 py-1.5 text-sm font-semibold text-[#01010D] bg-[#88F9C0] rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#221E42] text-[#C2BCE8]">
                  <th className="py-2.5 pr-3 font-medium">ID</th>
                  <th className="py-2.5 px-3 font-medium">Section</th>
                  <th className="py-2.5 px-3 font-medium text-right">Limit</th>
                  <th className="py-2.5 px-3 font-medium">Evidence</th>
                  <th className="py-2.5 pl-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D1A39]">
                {requirements.map((req) => (
                  <tr key={req.id}>
                    <td className="py-3 pr-3 font-mono font-semibold text-[#F4F3FF] whitespace-nowrap">
                      {req.id}
                    </td>
                    <td className="py-3 px-3 text-[#F4F3FF]">{req.section}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-[#C2BCE8]">
                      {req.word_limit ? `${req.word_limit}w` : 'File'}
                    </td>
                    <td className="py-3 px-3 font-mono text-[#88F9C0]">
                      {req.evidence_ids.map((id) => `[${id}]`).join(' ')}
                    </td>
                    <td className="py-3 pl-3 font-mono">
                      {req.status === 'covered' ? (
                        <span className="text-[#88F9C0]">Covered</span>
                      ) : (
                        <span className="text-[#FF8080]">Hold</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'draft' && currentSection && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-[#F4F3FF]">
              Draft Editor
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              {sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`px-3 py-1 text-sm font-mono rounded-lg transition-colors cursor-pointer ${
                    currentSection.id === sec.id
                      ? 'bg-[#6331FB] text-[#FFFFFF] font-semibold'
                      : 'text-[#C2BCE8] hover:text-[#F4F3FF]'
                  }`}
                >
                  S{idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-[#F4F3FF]">{currentSection.title}</span>
              <span className="font-mono tabular-nums text-[#88F9C0]">
                {countWords(currentSection.content)} / {currentSection.word_limit} words
              </span>
            </div>

            <textarea
              aria-label={`Draft content for ${currentSection.title}`}
              rows={7}
              value={currentSection.content}
              onChange={(e) => onUpdateSectionContent(currentSection.id, e.target.value)}
              className="w-full font-mono text-sm leading-relaxed p-3.5 rounded-lg bg-[#0A091A] border border-[#2D2757] text-[#F4F3FF]"
            />
          </div>
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-[#F4F3FF]">
            Evidence Pack
          </h3>

          <div className="divide-y divide-[#1D1A39] border-t border-b border-[#221E42]">
            {evidence.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-[#F4F3FF]">
                    <span className="font-mono text-[#88F9C0] mr-2">[{item.id}]</span>
                    {item.title}
                  </div>
                  <p className="text-sm text-[#C2BCE8] max-w-[46ch]">{item.summary}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleEvidenceAttached(item.id)}
                  className={`px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    item.attached
                      ? 'bg-[#88F9C0] text-[#01010D]'
                      : 'bg-[#6331FB] text-[#FFFFFF]'
                  }`}
                >
                  {item.attached ? 'Attached' : 'Attach File'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'extra' && (
        <div className="space-y-6">
          {vertical === 'deal' && dealPricing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#F4F3FF]">
                  Pricing & Margin (`signoff price`)
                </h3>
                <span className="font-mono text-sm font-semibold text-[#88F9C0] tabular-nums">
                  ${dealPricing.subtotal.toLocaleString()} · {dealPricing.gross_margin_pct}% Margin
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#221E42] text-[#C2BCE8]">
                      <th className="py-2 pr-3 font-medium">Role</th>
                      <th className="py-2 px-3 font-medium text-right">Hours</th>
                      <th className="py-2 px-3 font-medium text-right">Rate</th>
                      <th className="py-2 pl-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D1A39]">
                    {dealPricing.rows.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2.5 pr-3 font-medium text-[#F4F3FF]">{r.role}</td>
                        <td className="py-2.5 px-3 text-right">
                          <input
                            type="number"
                            min={0}
                            max={500}
                            aria-label={`Hours for ${r.role}`}
                            value={r.hours}
                            onChange={(e) =>
                              onUpdateRateCardHours?.(r.id, Math.max(0, Number(e.target.value) || 0))
                            }
                            className="w-20 text-right font-mono tabular-nums text-sm bg-[#0A091A] border border-[#2D2757] text-[#F4F3FF] rounded px-2 py-1"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#C2BCE8]">
                          ${r.hourly_rate}/hr
                        </td>
                        <td className="py-2.5 pl-3 text-right font-mono tabular-nums font-semibold text-[#88F9C0]">
                          ${r.line_total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {vertical === 'bid' && bidScore && (
            <div className="space-y-2 pb-4 border-b border-[#221E42]">
              <h3 className="text-base font-semibold text-[#F4F3FF]">
                Bid Decision: <span className="text-[#88F9C0]">{bidScore.recommendation} ({bidScore.win_probability}% Win)</span>
              </h3>
              <pre className="text-sm font-mono whitespace-pre-wrap text-[#D6D2F2]">
                {bidScore.memo_markdown}
              </pre>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-[#F4F3FF]">
              Decision Log
            </h3>
            <div className="divide-y divide-[#1D1A39] border-t border-b border-[#221E42]">
              {decisionLog.map((entry) => (
                <div key={entry.id} className="py-3 space-y-1 text-sm">
                  <div className="flex items-center justify-between font-mono text-[#C2BCE8]">
                    <span className="text-[#88F9C0] font-semibold">{entry.actor}</span>
                    <span className="tabular-nums">{entry.timestamp}</span>
                  </div>
                  <p className="text-[#F4F3FF] max-w-[48ch]">{entry.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

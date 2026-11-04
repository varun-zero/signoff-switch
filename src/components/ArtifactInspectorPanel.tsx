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
import { RulesTable } from './RulesTable';
import {
  Check,
  Clock,
  Download,
  FileText,
  Paperclip,
  PlusCircle,
  Table,
  Sparkles
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
  onDownloadArtifact: (filename: string, content: string, mimeType?: string) => void;
}

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
  onDownloadArtifact
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');

  const currentSection =
    sections.find((s) => s.id === selectedSectionId) || sections[0];

  const handleViewRule = (ruleId: number) => {
    if (ruleId === 2 || ruleId === 3 || ruleId === 4 || ruleId === 5 || ruleId === 7) {
      onSelectTab('draft');
    } else if (ruleId === 6) {
      onSelectTab('evidence');
    } else {
      onSelectTab('matrix');
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#2A323E]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSelectTab('checker')}
            className={`px-3 py-1.5 text-xs rounded transition-colors font-medium cursor-pointer ${
              activeTab === 'checker'
                ? 'bg-[#8DA2FF] text-[#0F1217] font-semibold'
                : 'text-[#A3ACBA] hover:text-[#E6E9EF] bg-[#151A21] border border-[#2A323E]'
            }`}
          >
            Rules ({checker.violations.length === 0 ? '8/8 pass' : `${checker.violations.length} holds`})
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('matrix')}
            className={`px-3 py-1.5 text-xs rounded transition-colors font-medium cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-[#8DA2FF] text-[#0F1217] font-semibold'
                : 'text-[#A3ACBA] hover:text-[#E6E9EF] bg-[#151A21] border border-[#2A323E]'
            }`}
          >
            Matrix ({requirements.length})
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('draft')}
            className={`px-3 py-1.5 text-xs rounded transition-colors font-medium cursor-pointer ${
              activeTab === 'draft'
                ? 'bg-[#8DA2FF] text-[#0F1217] font-semibold'
                : 'text-[#A3ACBA] hover:text-[#E6E9EF] bg-[#151A21] border border-[#2A323E]'
            }`}
          >
            Draft ({sections.length})
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('evidence')}
            className={`px-3 py-1.5 text-xs rounded transition-colors font-medium cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-[#8DA2FF] text-[#0F1217] font-semibold'
                : 'text-[#A3ACBA] hover:text-[#E6E9EF] bg-[#151A21] border border-[#2A323E]'
            }`}
          >
            Evidence ({evidence.filter((e) => e.attached).length}/{evidence.length})
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('extra')}
            className={`px-3 py-1.5 text-xs rounded transition-colors font-medium cursor-pointer ${
              activeTab === 'extra'
                ? 'bg-[#8DA2FF] text-[#0F1217] font-semibold'
                : 'text-[#A3ACBA] hover:text-[#E6E9EF] bg-[#151A21] border border-[#2A323E]'
            }`}
          >
            {vertical === 'deal' ? 'Pricing' : vertical === 'bid' ? 'Bid memo' : 'Audit log'}
          </button>
        </div>

        <span className="text-xs font-mono text-[#7F8A9B]">
          Score: <strong className="text-[#E6E9EF]">{scorecard.total_score}</strong>/100
        </span>
      </div>

      {/* Tab 1: Rules Table */}
      {activeTab === 'checker' && (
        <div className="space-y-4">
          <RulesTable checker={checker} onViewRule={handleViewRule} />

          {/* Criteria Breakdown */}
          <div className="bg-[#151A21] border border-[#2A323E] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#2A323E]">
              <span className="font-semibold text-[#E6E9EF]">Weighted evaluation rubric</span>
              <button
                type="button"
                onClick={() =>
                  onDownloadArtifact(
                    `${vertical}-scorecard.md`,
                    `${scorecard.markdown_scorecard}\n\n---\n\n${checker.markdown_report}`
                  )
                }
                className="text-xs text-[#8DA2FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export scorecard</span>
              </button>
            </div>

            <div className="space-y-2">
              {scorecard.criteria.map((c) => (
                <div key={c.criterion} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A3ACBA]">
                      {c.label} <span className="text-[#7F8A9B] font-mono">({c.weight}%)</span>
                    </span>
                    <span className="font-mono text-[#E6E9EF] num">
                      {c.score}/100
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1B212A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8DA2FF] rounded-full transition-all duration-300"
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Compliance Matrix */}
      {activeTab === 'matrix' && (
        <div className="bg-[#151A21] border border-[#2A323E] rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-[#1B212A] border-b border-[#2A323E] flex items-center justify-between text-xs">
            <span className="font-semibold text-[#E6E9EF]">Requirements compliance matrix</span>
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
              className="px-2.5 py-1 text-xs font-medium text-[#E6E9EF] bg-[#151A21] border border-[#2A323E] hover:border-[#8DA2FF] rounded flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#2A323E] text-[#A3ACBA]">
                  <th className="py-2.5 px-3 font-mono font-medium">ID</th>
                  <th className="py-2.5 px-3 font-medium">Section</th>
                  <th className="py-2.5 px-3 font-medium">Requirement</th>
                  <th className="py-2.5 px-3 font-medium text-right font-mono">Limit</th>
                  <th className="py-2.5 px-3 font-medium font-mono">Evidence</th>
                  <th className="py-2.5 px-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A323E]">
                {requirements.map((req) => (
                  <tr key={req.id} className="min-h-[44px] hover:bg-[#1B212A]/40">
                    <td className="py-2.5 px-3 font-mono text-[#8DA2FF] whitespace-nowrap">
                      {req.id}
                    </td>
                    <td className="py-2.5 px-3 text-[#E6E9EF] whitespace-nowrap">
                      {req.section}
                    </td>
                    <td className="py-2.5 px-3 text-[#A3ACBA] max-w-[280px]">
                      {req.requirement}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono num text-[#7F8A9B] whitespace-nowrap">
                      {req.word_limit ? `${req.word_limit}w` : 'File'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#A3ACBA] whitespace-nowrap">
                      {req.evidence_ids.map((id) => `[${id}]`).join(' ')}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {req.status === 'covered' ? (
                        <span className="text-[#6CC4A1] font-mono">Covered</span>
                      ) : (
                        <span className="text-[#E8B04A] font-mono font-semibold">Hold</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Cited Draft Editor */}
      {activeTab === 'draft' && currentSection && (
        <div className="bg-[#151A21] border border-[#2A323E] rounded-lg p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#2A323E]">
            <div className="flex items-center gap-1">
              {sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                    currentSection.id === sec.id
                      ? 'bg-[#8DA2FF] text-[#0F1217] font-semibold'
                      : 'text-[#A3ACBA] hover:text-[#E6E9EF] bg-[#1B212A]'
                  }`}
                >
                  Section {idx + 1}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#7F8A9B] num">
                {countWords(currentSection.content)} / {currentSection.word_limit} words
              </span>
              <button
                type="button"
                onClick={() => {
                  const appendCitation = currentSection.content.includes('[E2]')
                    ? currentSection.content
                    : `${currentSection.content} [E2]`;
                  onUpdateSectionContent(currentSection.id, appendCitation);
                }}
                className="px-2 py-1 text-xs font-mono text-[#8DA2FF] border border-[#384252] hover:border-[#8DA2FF] rounded bg-[#1B212A] cursor-pointer flex items-center gap-1"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Cite [E2]</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-[#E6E9EF]">
              {currentSection.title}
            </div>
            <textarea
              aria-label={`Draft content for ${currentSection.title}`}
              rows={8}
              value={currentSection.content}
              onChange={(e) => onUpdateSectionContent(currentSection.id, e.target.value)}
              className="w-full font-mono text-xs leading-relaxed p-3 rounded-lg bg-[#0F1217] border border-[#2A323E] text-[#E6E9EF] focus:border-[#8DA2FF] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Tab 4: Evidence Attachments */}
      {activeTab === 'evidence' && (
        <div className="bg-[#151A21] border border-[#2A323E] rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-[#1B212A] border-b border-[#2A323E] flex items-center justify-between text-xs">
            <span className="font-semibold text-[#E6E9EF]">Source audit evidence & files</span>
            <span className="text-xs font-mono text-[#7F8A9B]">
              {evidence.filter((e) => e.attached).length}/{evidence.length} attached
            </span>
          </div>

          <div className="divide-y divide-[#2A323E]">
            {evidence.map((item) => (
              <div
                key={item.id}
                className="min-h-[44px] px-4 py-3 flex items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#8DA2FF]">[{item.id}]</span>
                    <span className="font-medium text-[#E6E9EF]">{item.title}</span>
                  </div>
                  <p className="text-xs text-[#7F8A9B] truncate">{item.summary}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleEvidenceAttached(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer shrink-0 ${
                    item.attached
                      ? 'bg-[rgba(108,196,161,0.15)] text-[#6CC4A1] border border-[#6CC4A1]/40'
                      : 'bg-[#1B212A] text-[#A3ACBA] border border-[#2A323E] hover:border-[#8DA2FF] hover:text-[#E6E9EF]'
                  }`}
                >
                  {item.attached ? 'Attached' : 'Attach file'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Extras & Audit Log */}
      {activeTab === 'extra' && (
        <div className="space-y-4">
          {vertical === 'deal' && dealPricing && (
            <div className="bg-[#151A21] border border-[#2A323E] rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-[#1B212A] border-b border-[#2A323E] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#E6E9EF]">Deal rate card pricing</span>
                <span className="font-mono text-[#E6E9EF] num">
                  ${dealPricing.subtotal.toLocaleString()} · {dealPricing.gross_margin_pct}% margin
                </span>
              </div>

              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#2A323E] text-[#A3ACBA]">
                    <th className="py-2 px-3 font-medium">Role</th>
                    <th className="py-2 px-3 font-medium text-right font-mono">Hours</th>
                    <th className="py-2 px-3 font-medium text-right font-mono">Rate</th>
                    <th className="py-2 px-3 font-medium text-right font-mono">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A323E]">
                  {dealPricing.rows.map((r) => (
                    <tr key={r.id} className="min-h-[44px]">
                      <td className="py-2.5 px-3 text-[#E6E9EF]">{r.role}</td>
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          min={0}
                          max={500}
                          value={r.hours}
                          onChange={(e) =>
                            onUpdateRateCardHours?.(r.id, Math.max(0, Number(e.target.value) || 0))
                          }
                          className="w-16 text-right font-mono num text-xs bg-[#0F1217] border border-[#2A323E] text-[#E6E9EF] rounded px-1.5 py-0.5"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono num text-[#7F8A9B]">
                        ${r.hourly_rate}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono num text-[#E6E9EF]">
                        ${r.line_total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {vertical === 'bid' && bidScore && (
            <div className="bg-[#151A21] border border-[#2A323E] rounded-lg p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A323E]">
                <span className="font-semibold text-[#E6E9EF]">Bid evaluation memo</span>
                <span className="font-mono text-[#8DA2FF]">
                  {bidScore.recommendation} ({bidScore.win_probability}% win prob)
                </span>
              </div>
              <pre className="font-mono text-xs text-[#A3ACBA] leading-relaxed whitespace-pre-wrap bg-[#0F1217] p-3 rounded border border-[#2A323E]">
                {bidScore.memo_markdown}
              </pre>
            </div>
          )}

          {/* Decision Audit Log */}
          <div className="bg-[#151A21] border border-[#2A323E] rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-[#1B212A] border-b border-[#2A323E] text-xs font-semibold text-[#E6E9EF]">
              Decision log
            </div>
            <div className="divide-y divide-[#2A323E]">
              {decisionLog.map((entry) => (
                <div key={entry.id} className="min-h-[44px] px-4 py-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono text-[#7F8A9B]">
                    <span className="text-[#8DA2FF] font-medium">{entry.actor}</span>
                    <span className="num">{entry.timestamp}</span>
                  </div>
                  <p className="text-[#E6E9EF] leading-relaxed">{entry.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

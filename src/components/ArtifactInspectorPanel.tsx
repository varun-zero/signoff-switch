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
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Paperclip,
  PlusCircle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Table
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

const RULE_METADATA = [
  { id: 1, name: 'Coverage', desc: '100% of RFP requirements mapped in matrix' },
  { id: 2, name: 'Word Cap', desc: 'Zero draft sections exceed strict limits' },
  { id: 3, name: 'Placeholders', desc: 'No [TODO], [TBD], or unaddressed brackets' },
  { id: 4, name: 'Citations', desc: 'All claims cite verified intake evidence [EX]' },
  { id: 5, name: 'Numbers', desc: 'Budget & pricing arithmetic verified' },
  { id: 6, name: 'Files', desc: 'Mandatory file attachments present & signed' },
  { id: 7, name: 'Headings', desc: 'Heading schema matches RFP structure' },
  { id: 8, name: 'Rubric', desc: 'Scored against weighted evaluation criteria' }
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
    <section
      aria-label="Compliance Artifacts"
      className="space-y-6"
    >
      {/* Header & Segmented Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#201B42]">
        <div>
          <div className="text-xs font-mono text-[#958DBF] uppercase tracking-wider">
            Deterministic Engine
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-serif-display text-[#F5F3FF]">
            Compliance Telemetry & Artifacts
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => onSelectTab('checker')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'checker'
                ? 'bg-[#6331FB] text-[#FFFFFF] font-semibold'
                : 'text-[#C5BFE9] hover:text-[#F5F3FF] bg-[#09081B] border border-[#201B42]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Checker ({checker.violations.length === 0 ? '8/8' : `${checker.rules_passed}/8`})</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('matrix')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-[#6331FB] text-[#FFFFFF] font-semibold'
                : 'text-[#C5BFE9] hover:text-[#F5F3FF] bg-[#09081B] border border-[#201B42]'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Matrix ({requirements.length})</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('draft')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'draft'
                ? 'bg-[#6331FB] text-[#FFFFFF] font-semibold'
                : 'text-[#C5BFE9] hover:text-[#F5F3FF] bg-[#09081B] border border-[#201B42]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Draft ({sections.length})</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('evidence')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'evidence'
                ? 'bg-[#6331FB] text-[#FFFFFF] font-semibold'
                : 'text-[#C5BFE9] hover:text-[#F5F3FF] bg-[#09081B] border border-[#201B42]'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Evidence ({evidence.filter((e) => e.attached).length}/{evidence.length})</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('extra')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'extra'
                ? 'bg-[#6331FB] text-[#FFFFFF] font-semibold'
                : 'text-[#C5BFE9] hover:text-[#F5F3FF] bg-[#09081B] border border-[#201B42]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{vertical === 'deal' ? 'Pricing' : vertical === 'bid' ? 'Bid Memo' : 'Audit Log'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 8-Rule Checker */}
      {activeTab === 'checker' && (
        <div className="space-y-6">
          {/* 8-Rule Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#958DBF]">
              <span>8-Rule Deterministic Compliance Gate</span>
              <span className={`font-semibold ${checker.passed ? 'text-[#88F9C0]' : 'text-[#F59E0B]'}`}>
                {checker.rules_passed}/8 Rules Verified
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RULE_METADATA.map((r) => {
                const isViolated = violatedRuleIds.has(r.id);
                return (
                  <div
                    key={r.id}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isViolated
                        ? 'bg-[#210D16] border-[#7F1D38] text-[#FF8080]'
                        : 'bg-[#061C14] border-[#0E523A] text-[#88F9C0]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold">R{r.id} {r.name}</span>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                        isViolated ? 'bg-[#FF4D4D]/20 text-[#FF8080]' : 'bg-[#00F5A0]/20 text-[#00F5A0]'
                      }`}>
                        {isViolated ? 'HOLD' : 'PASS'}
                      </span>
                    </div>
                    <div className="text-xs text-[#C5BFE9]">
                      {r.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Holds or Clean Bill */}
          {checker.violations.length > 0 ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#201B42]">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#FF8080]" />
                  <h3 className="text-sm font-bold text-[#FF8080]">
                    Active Holds ({checker.violations.length}) — Submission Blocked
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onApplyHumanFix}
                  className="px-3 py-1.5 text-xs font-bold text-[#02010A] bg-[#00F5A0] hover:bg-[#28FFAE] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Resolve 2 Holds
                </button>
              </div>

              <div className="divide-y divide-[#201B42]">
                {checker.violations.map((v, idx) => (
                  <div key={`${v.rule_id}-${idx}`} className="py-2.5 space-y-1">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-[#FF8080] font-mono">
                        Rule {v.rule_id} · {v.rule_name}
                      </span>
                      <code className="text-xs font-mono text-[#C5BFE9] bg-[#09081B] px-2 py-0.5 rounded border border-[#201B42]">
                        {v.file}:{v.line}
                      </code>
                    </div>
                    <p className="text-xs text-[#F5F3FF] leading-relaxed max-w-[65ch]">
                      {v.remediation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-3 border-y border-[#0A6B48] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#00F5A0] shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-[#88F9C0]">
                    All 8 Rules Verified Clean
                  </h3>
                  <p className="text-xs text-[#C5BFE9] max-w-[50ch]">
                    Zero violations. Word limits, citations, arithmetic, and evidence integrity fully compliant.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#00F5A0]/20 text-[#00F5A0] text-xs font-mono font-bold">
                100% READY
              </span>
            </div>
          )}

          {/* Weighted Rubric Breakdown */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#201B42]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-serif-display text-[#F5F3FF]">
                  Weighted Rubric Scorecard
                </h3>
                <span className="text-xs font-mono font-bold text-[#88F9C0]">
                  ({scorecard.total_score}/100)
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onDownloadArtifact(
                    `${vertical}-scorecard.md`,
                    `${scorecard.markdown_scorecard}\n\n---\n\n${checker.markdown_report}`
                  )
                }
                className="text-xs font-mono text-[#88F9C0] hover:text-[#00F5A0] flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Scorecard</span>
              </button>
            </div>

            <div className="space-y-3">
              {scorecard.criteria.map((c) => (
                <div key={c.criterion} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#F5F3FF]">
                      {c.label} <span className="text-[#958DBF] font-mono">({c.weight}%)</span>
                    </span>
                    <span className={`font-mono font-bold tabular-nums ${c.score >= 80 ? 'text-[#88F9C0]' : 'text-[#F59E0B]'}`}>
                      {c.score}/100
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#120F2E] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        c.score >= 80 ? 'bg-[#00F5A0]' : 'bg-[#F59E0B]'
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

      {/* Tab 2: Compliance Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#201B42]">
            <div>
              <h3 className="text-sm font-bold font-serif-display text-[#F5F3FF]">
                Compliance Matrix (`signoff matrix`)
              </h3>
              <p className="text-xs text-[#958DBF]">
                Extracted from RFP specifications by @signoff-analyst
              </p>
            </div>
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
              className="px-3 py-1.5 text-xs font-bold text-[#02010A] bg-[#88F9C0] hover:bg-[#00F5A0] rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#201B42] text-[#C5BFE9]">
                  <th className="py-2.5 px-3 font-mono font-semibold">ID</th>
                  <th className="py-2.5 px-3 font-semibold">Section</th>
                  <th className="py-2.5 px-3 font-semibold">Requirement</th>
                  <th className="py-2.5 px-3 font-semibold text-right font-mono">Limit</th>
                  <th className="py-2.5 px-3 font-semibold font-mono">Evidence</th>
                  <th className="py-2.5 px-3 font-semibold font-mono">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181436]">
                {requirements.map((req) => (
                  <tr key={req.id} className="hover:bg-[#0E0C26] transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#88F9C0] whitespace-nowrap">
                      {req.id}
                    </td>
                    <td className="py-2.5 px-3 text-[#F5F3FF] whitespace-nowrap font-medium">
                      {req.section}
                    </td>
                    <td className="py-2.5 px-3 text-[#C5BFE9] max-w-[280px]">
                      {req.requirement}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#958DBF] whitespace-nowrap">
                      {req.word_limit ? `${req.word_limit}w` : 'File'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#88F9C0] whitespace-nowrap">
                      {req.evidence_ids.map((id) => `[${id}]`).join(' ')}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {req.status === 'covered' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded bg-[#00F5A0]/15 text-[#00F5A0] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Covered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded bg-[#EF4444]/15 text-[#FF8080] font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Hold
                        </span>
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
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#201B42]">
            <div>
              <h3 className="text-sm font-bold font-serif-display text-[#F5F3FF]">
                Cited Draft Editor
              </h3>
              <p className="text-xs text-[#958DBF]">
                Word limit tracking & bracket citation validation
              </p>
            </div>
            <div className="flex items-center gap-1">
              {sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                    currentSection.id === sec.id
                      ? 'bg-[#6331FB] text-[#FFFFFF] font-semibold'
                      : 'text-[#C5BFE9] hover:text-[#F5F3FF] bg-[#09081B] border border-[#201B42]'
                  }`}
                >
                  Section {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#F5F3FF]">{currentSection.title}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono tabular-nums text-[#88F9C0]">
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
                  className="px-2 py-0.5 text-xs font-mono text-[#88F9C0] border border-[#0E523A] bg-[#061C14] rounded hover:bg-[#0A2E21] cursor-pointer flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Insert Citation [E2]</span>
                </button>
              </div>
            </div>

            <textarea
              aria-label={`Draft content for ${currentSection.title}`}
              rows={8}
              value={currentSection.content}
              onChange={(e) => onUpdateSectionContent(currentSection.id, e.target.value)}
              className="w-full font-mono text-xs leading-relaxed p-3.5 rounded-lg bg-[#09081B] border border-[#201B42] text-[#F5F3FF] focus:border-[#88F9C0] focus:ring-0"
            />
          </div>
        </div>
      )}

      {/* Tab 4: Evidence Pack */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#201B42]">
            <div>
              <h3 className="text-sm font-bold font-serif-display text-[#F5F3FF]">
                Source Evidence & Audit Attachments
              </h3>
              <p className="text-xs text-[#958DBF]">
                Verified against Rule 6 (Mandatory Attachment Gate)
              </p>
            </div>
            <span className="text-xs font-mono text-[#88F9C0]">
              {evidence.filter((e) => e.attached).length}/{evidence.length} Attached
            </span>
          </div>

          <div className="divide-y divide-[#201B42]">
            {evidence.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#88F9C0] bg-[#061C14] px-1.5 py-0.5 rounded border border-[#0E523A]">
                      [{item.id}]
                    </span>
                    <span className="text-xs font-bold text-[#F5F3FF]">{item.title}</span>
                  </div>
                  <p className="text-xs text-[#C5BFE9] max-w-[55ch] leading-relaxed">{item.summary}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleEvidenceAttached(item.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    item.attached
                      ? 'bg-[#00F5A0] text-[#02010A] hover:bg-[#28FFAE]'
                      : 'bg-[#6331FB] text-[#FFFFFF] hover:bg-[#7243FC]'
                  }`}
                >
                  {item.attached ? '✓ Attached' : '+ Attach File'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Vertical Extras & Decision Log */}
      {activeTab === 'extra' && (
        <div className="space-y-6">
          {vertical === 'deal' && dealPricing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#201B42]">
                <div>
                  <h3 className="text-sm font-bold font-serif-display text-[#F5F3FF]">
                    Deal Rate Card & Gross Margin Engine
                  </h3>
                  <p className="text-xs text-[#958DBF]">
                    Deterministic arithmetic checked against Rule 5
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-[#88F9C0] tabular-nums">
                    ${dealPricing.subtotal.toLocaleString()}
                  </span>
                  <div className="text-xs font-mono text-[#958DBF]">
                    {dealPricing.gross_margin_pct}% Target Margin
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#201B42] text-[#C5BFE9]">
                      <th className="py-2.5 px-3 font-semibold">Role</th>
                      <th className="py-2.5 px-3 font-semibold text-right font-mono">Hours</th>
                      <th className="py-2.5 px-3 font-semibold text-right font-mono">Hourly Rate</th>
                      <th className="py-2.5 px-3 font-semibold text-right font-mono">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#181436]">
                    {dealPricing.rows.map((r) => (
                      <tr key={r.id} className="hover:bg-[#0E0C26]">
                        <td className="py-2.5 px-3 font-medium text-[#F5F3FF]">{r.role}</td>
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
                            className="w-20 text-right font-mono tabular-nums text-xs bg-[#09081B] border border-[#201B42] text-[#F5F3FF] rounded px-2 py-1 focus:border-[#88F9C0]"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#958DBF]">
                          ${r.hourly_rate}/hr
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-[#88F9C0]">
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
            <div className="space-y-2 pb-4 border-b border-[#201B42]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F5F3FF]">
                  Defense RFP Bid Decision Memo
                </h3>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#00F5A0]/20 text-[#00F5A0]">
                  {bidScore.recommendation} ({bidScore.win_probability}% Win Prob)
                </span>
              </div>
              <pre className="text-xs font-mono whitespace-pre-wrap text-[#C5BFE9] leading-relaxed bg-[#09081B] p-3 rounded-lg border border-[#201B42]">
                {bidScore.memo_markdown}
              </pre>
            </div>
          )}

          {/* Decision Log */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#201B42]">
              <Clock className="w-4 h-4 text-[#6331FB]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5BFE9]">
                Audit Trail & Human Decision Log
              </h3>
            </div>

            <div className="divide-y divide-[#201B42]">
              {decisionLog.map((entry) => (
                <div key={entry.id} className="py-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[#88F9C0] font-bold">{entry.actor}</span>
                    <span className="text-[#958DBF] tabular-nums">{entry.timestamp}</span>
                  </div>
                  <p className="text-[#F5F3FF] leading-relaxed max-w-[65ch]">{entry.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

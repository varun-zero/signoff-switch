import React, { useState } from 'react';
import { REPO_FILES, RepoFileEntry } from '../engine/repoBundle';
import {
  CheckerResult,
  PricingQuoteResult,
  ScorecardResult,
  VerticalId,
  renderComplianceMatrixCsv
} from '../engine/signoffEngine';
import { VerticalPack } from '../engine/verticalsData';
import { Check, Copy, Download } from 'lucide-react';

interface CliAndRepoViewProps {
  vertical: VerticalId;
  pack: VerticalPack;
  checker: CheckerResult;
  scorecard: ScorecardResult;
  dealPricing: PricingQuoteResult;
  isFixed: boolean;
  onDownloadArtifact: (filename: string, content: string, mimeType?: string) => void;
}

type CliCommandId = 'demo' | 'check' | 'score' | 'matrix' | 'price' | 'extract' | 'export';

export const CliAndRepoView: React.FC<CliAndRepoViewProps> = ({
  vertical,
  pack,
  checker,
  scorecard,
  dealPricing,
  isFixed,
  onDownloadArtifact
}) => {
  const [selectedCmd, setSelectedCmd] = useState<CliCommandId>('demo');
  const [selectedFile, setSelectedFile] = useState<RepoFileEntry>(REPO_FILES[0]);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const getCommandOutput = (cmd: CliCommandId): { commandLine: string; stdout: string } => {
    switch (cmd) {
      case 'demo':
        return {
          commandLine: `signoff demo --vertical ${vertical}${isFixed ? ' --fix' : ''}`,
          stdout: [
            `[1/4] signoff extract -> ${pack.sourceDocPages} pages from ${pack.sourceDocTitle}`,
            `[2/4] signoff matrix  -> ${pack.requirements.length} requirements -> out/${vertical}/compliance-matrix.csv`,
            `[3/4] signoff check   -> ${checker.passed ? 'PASS (0 violations)' : `FAIL (${checker.violations.length} violations)`} · ${checker.rules_passed}/${checker.rules_total} rules`,
            `[4/4] signoff score   -> ${scorecard.total_score}/100 (${scorecard.ready_for_signoff ? 'READY' : 'HOLD'})`
          ].join('\n')
        };
      case 'check':
        return {
          commandLine: `signoff check --vertical ${vertical}`,
          stdout: checker.markdown_report
        };
      case 'score':
        return {
          commandLine: `signoff score --vertical ${vertical}`,
          stdout: scorecard.markdown_scorecard
        };
      case 'matrix':
        return {
          commandLine: `signoff matrix --vertical ${vertical}`,
          stdout: renderComplianceMatrixCsv(pack.requirements)
        };
      case 'price':
        return {
          commandLine: `signoff price --vertical deal`,
          stdout: dealPricing.markdown_quote
        };
      case 'extract':
        return {
          commandLine: `signoff extract --vertical ${vertical}`,
          stdout: `Extracted ${pack.sourceDocPages} pages -> out/${vertical}/extracted_source.txt`
        };
      case 'export':
        return {
          commandLine: `signoff export --vertical ${vertical}`,
          stdout: `Exported out/${vertical}/${vertical}-submission-pack.docx`
        };
    }
  };

  const activeOutput = getCommandOutput(selectedCmd);

  const handleCopyFile = (file: RepoFileEntry) => {
    navigator.clipboard?.writeText(file.content);
    setCopiedPath(file.path);
    setTimeout(() => setCopiedPath(null), 1800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left 5 Cols: CLI Runner */}
      <section aria-label="CLI Toolbelt" className="lg:col-span-5 space-y-5">
        <h2 className="text-xl font-semibold text-[#F4F3FF] pb-3 border-b border-[#221E42]">
          Python 3.13 CLI Toolbelt
        </h2>

        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'demo', label: 'signoff demo' },
              { id: 'check', label: 'signoff check' },
              { id: 'score', label: 'signoff score' },
              { id: 'matrix', label: 'signoff matrix' },
              { id: 'price', label: 'signoff price' },
              { id: 'extract', label: 'signoff extract' },
              { id: 'export', label: 'signoff export' }
            ] as Array<{ id: CliCommandId; label: string }>
          ).map((cmd) => (
            <button
              key={cmd.id}
              type="button"
              onClick={() => setSelectedCmd(cmd.id)}
              className={`px-3 py-1.5 text-sm font-mono rounded-lg transition-colors cursor-pointer ${
                selectedCmd === cmd.id
                  ? 'bg-[#6331FB] text-[#FFFFFF] font-semibold'
                  : 'bg-[#0A091A] text-[#C2BCE8] hover:text-[#F4F3FF]'
              }`}
            >
              {cmd.label}
            </button>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-[#0A091A] border border-[#221E42] font-mono text-sm space-y-3 overflow-x-auto">
          <div className="text-[#88F9C0] pb-2 border-b border-[#221E42]">
            $ {activeOutput.commandLine}
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed text-[#E4E1FA]">
            {activeOutput.stdout}
          </pre>
        </div>
      </section>

      {/* Right 7 Cols: Repo Files */}
      <section aria-label="Repository Files" className="lg:col-span-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#221E42]">
          <h2 className="text-xl font-semibold text-[#F4F3FF]">
            Repository Code (`signoff-switch`)
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopyFile(selectedFile)}
              className="px-3 py-1.5 text-sm font-medium bg-[#6331FB] text-[#FFFFFF] rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              {copiedPath === selectedFile.path ? (
                <>
                  <Check className="w-4 h-4 text-[#88F9C0]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() =>
                onDownloadArtifact(
                  selectedFile.path.replace(/\//g, '_'),
                  selectedFile.content
                )
              }
              className="px-3.5 py-1.5 text-sm font-semibold bg-[#88F9C0] text-[#01010D] rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {REPO_FILES.map((file) => (
            <button
              key={file.path}
              type="button"
              onClick={() => setSelectedFile(file)}
              className={`px-3 py-1.5 text-sm font-mono rounded-lg transition-colors cursor-pointer ${
                selectedFile.path === file.path
                  ? 'bg-[#6331FB] text-[#FFFFFF] font-semibold'
                  : 'bg-[#0A091A] text-[#C2BCE8] hover:text-[#F4F3FF]'
              }`}
            >
              {file.path}
            </button>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-[#0A091A] border border-[#221E42] overflow-auto max-h-[480px]">
          <pre className="font-mono text-sm leading-relaxed text-[#E4E1FA] whitespace-pre">
            {selectedFile.content}
          </pre>
        </div>
      </section>
    </div>
  );
};

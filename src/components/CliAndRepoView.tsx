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
import { Check, Copy, Download, FileCode, Play, Terminal } from 'lucide-react';
import { GitHubLogo, PythonLogo } from './BrandLogos';

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
  const [copiedOutput, setCopiedOutput] = useState<boolean>(false);

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

  const handleCopyOutput = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 1800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 5 Cols: CLI Runner */}
      <section
        aria-label="CLI Toolbelt"
        className="lg:col-span-5 bg-[#09081B] border border-[#201B42] rounded-2xl p-5 lg:p-6 shadow-xl space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1637]">
          <div className="flex items-center gap-3">
            <PythonLogo className="w-6 h-6 shrink-0" />
            <div>
              <div className="text-xs font-mono text-[#958DBF] uppercase tracking-wider">
                Native Toolbelt
              </div>
              <h2 className="text-lg font-bold font-serif-display text-[#F5F3FF]">
                Python 3.13 CLI
              </h2>
            </div>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#3776AB]/20 text-[#FFD43B] border border-[#3776AB]/40">
            pip install -e .
          </span>
        </div>

        {/* Command buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[#050414] rounded-xl border border-[#1A1637]">
          {(
            [
              { id: 'demo', label: 'demo' },
              { id: 'check', label: 'check' },
              { id: 'score', label: 'score' },
              { id: 'matrix', label: 'matrix' },
              { id: 'price', label: 'price' },
              { id: 'extract', label: 'extract' },
              { id: 'export', label: 'export' }
            ] as Array<{ id: CliCommandId; label: string }>
          ).map((cmd) => (
            <button
              key={cmd.id}
              type="button"
              onClick={() => setSelectedCmd(cmd.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all duration-150 cursor-pointer ${
                selectedCmd === cmd.id
                  ? 'bg-[#6331FB] text-[#FFFFFF] font-bold shadow-sm'
                  : 'text-[#C5BFE9] hover:text-[#F5F3FF] hover:bg-[#120F2E]'
              }`}
            >
              signoff {cmd.label}
            </button>
          ))}
        </div>

        {/* Terminal emulator box */}
        <div className="rounded-xl bg-[#050414] border border-[#1A1637] font-mono text-xs overflow-hidden shadow-inner">
          {/* Terminal Window Header with Colored Dots */}
          <div className="px-3 py-2 bg-[#0C0A20] border-b border-[#1A1637] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="ml-2 text-xs text-[#958DBF]">bash — 80x24</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyOutput(`$ ${activeOutput.commandLine}\n${activeOutput.stdout}`)}
              className="text-[#958DBF] hover:text-[#F5F3FF] flex items-center gap-1 text-xs cursor-pointer"
            >
              {copiedOutput ? (
                <>
                  <Check className="w-3 h-3 text-[#00F5A0]" />
                  <span className="text-[#00F5A0]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 space-y-2.5 overflow-x-auto max-h-[360px]">
            <div className="text-[#00F5A0] font-bold flex items-center gap-1.5">
              <span className="text-[#6331FB]">$</span>
              <span>{activeOutput.commandLine}</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed text-[#F5F3FF] font-mono">
              {activeOutput.stdout}
            </pre>
          </div>
        </div>
      </section>

      {/* Right 7 Cols: Repo Files */}
      <section
        aria-label="Repository Files"
        className="lg:col-span-7 bg-[#09081B] border border-[#201B42] rounded-2xl p-5 lg:p-6 shadow-xl space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A1637]">
          <div className="flex items-center gap-3">
            <GitHubLogo className="w-6 h-6 text-[#F5F3FF] shrink-0" />
            <div>
              <div className="text-xs font-mono text-[#958DBF] uppercase tracking-wider">
                Source Code
              </div>
              <h2 className="text-lg font-bold font-serif-display text-[#F5F3FF]">
                `signoff-switch` Repository
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopyFile(selectedFile)}
              className="px-3 py-1.5 text-xs font-semibold bg-[#6331FB] hover:bg-[#7243FC] text-[#FFFFFF] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedPath === selectedFile.path ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00F5A0]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
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
              className="px-3 py-1.5 text-xs font-bold bg-[#88F9C0] hover:bg-[#00F5A0] text-[#02010A] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* File Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[#050414] rounded-xl border border-[#1A1637]">
          {REPO_FILES.map((file) => (
            <button
              key={file.path}
              type="button"
              onClick={() => setSelectedFile(file)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                selectedFile.path === file.path
                  ? 'bg-[#151139] border border-[#6331FB] text-[#88F9C0] font-semibold shadow-sm'
                  : 'text-[#C5BFE9] hover:text-[#F5F3FF] hover:bg-[#120F2E]'
              }`}
            >
              <FileCode className="w-3 h-3 text-[#6331FB]" />
              <span>{file.path}</span>
            </button>
          ))}
        </div>

        {/* Code Content Container */}
        <div className="rounded-xl bg-[#050414] border border-[#1A1637] overflow-hidden">
          <div className="px-3.5 py-2 bg-[#0C0A20] border-b border-[#1A1637] flex items-center justify-between text-xs font-mono text-[#958DBF]">
            <span>{selectedFile.path}</span>
            <span>{selectedFile.content.split('\n').length} lines</span>
          </div>
          <div className="p-4 overflow-auto max-h-[460px]">
            <pre className="font-mono text-xs leading-relaxed text-[#F5F3FF] whitespace-pre">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};

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
import { Check, Copy, Download, FileCode, Terminal } from 'lucide-react';
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 5 Cols: CLI Runner */}
      <section
        aria-label="CLI Toolbelt"
        className="lg:col-span-5 bg-[#151A21] border border-[#2A323E] rounded-xl p-5 space-y-4 shadow-sm"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#2A323E]">
          <div className="flex items-center gap-3">
            <PythonLogo className="w-5 h-5 shrink-0" />
            <div>
              <div className="text-xs text-[#7F8A9B]">Native toolbelt</div>
              <h2 className="text-base font-semibold text-[#E6E9EF]">
                Python 3.13 CLI
              </h2>
            </div>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1B212A] text-[#A3ACBA] border border-[#2A323E]">
            pip install -e .
          </span>
        </div>

        {/* Command buttons */}
        <div className="flex flex-wrap gap-1 p-1 bg-[#10141B] rounded-lg border border-[#2A323E]">
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
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                selectedCmd === cmd.id
                  ? 'bg-[#8DA2FF] text-[#0F1217] font-semibold'
                  : 'text-[#A3ACBA] hover:text-[#E6E9EF] hover:bg-[#1B212A]'
              }`}
            >
              signoff {cmd.label}
            </button>
          ))}
        </div>

        {/* Terminal emulator box */}
        <div className="rounded-lg bg-[#0B0E13] border border-[#2A323E] font-mono text-xs overflow-hidden">
          {/* Terminal Window Header with Subtle Dots */}
          <div className="px-3 py-2 bg-[#151A21] border-b border-[#2A323E] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F2837A]/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8B04A]/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#6CC4A1]/70" />
              <span className="ml-2 text-xs text-[#7F8A9B]">bash — 80x24</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyOutput(`$ ${activeOutput.commandLine}\n${activeOutput.stdout}`)}
              className="text-[#7F8A9B] hover:text-[#E6E9EF] flex items-center gap-1.5 text-xs cursor-pointer transition-colors"
            >
              {copiedOutput ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#6CC4A1]" />
                  <span className="text-[#6CC4A1]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 space-y-2 overflow-x-auto max-h-[360px]">
            <div className="text-[#E6E9EF] font-semibold flex items-center gap-1.5">
              <span className="text-[#8DA2FF]">$</span>
              <span>{activeOutput.commandLine}</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed text-[#A3ACBA] font-mono text-xs">
              {activeOutput.stdout}
            </pre>
          </div>
        </div>
      </section>

      {/* Right 7 Cols: Repo Files */}
      <section
        aria-label="Repository Files"
        className="lg:col-span-7 bg-[#151A21] border border-[#2A323E] rounded-xl p-5 space-y-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2A323E]">
          <div className="flex items-center gap-3">
            <GitHubLogo className="w-5 h-5 text-[#E6E9EF] shrink-0" />
            <div>
              <div className="text-xs text-[#7F8A9B]">Source code</div>
              <h2 className="text-base font-semibold text-[#E6E9EF]">
                signoff-switch repository
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopyFile(selectedFile)}
              className="px-3 py-1.5 text-xs font-medium bg-[#1B212A] hover:bg-[#232B36] text-[#E6E9EF] border border-[#2A323E] rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedPath === selectedFile.path ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#6CC4A1]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#7F8A9B]" />
                  <span>Copy file</span>
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
              className="px-3 py-1.5 text-xs font-medium bg-[#1B212A] hover:bg-[#232B36] text-[#E6E9EF] border border-[#2A323E] rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#7F8A9B]" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* File Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-[#10141B] rounded-lg border border-[#2A323E]">
          {REPO_FILES.map((file) => (
            <button
              key={file.path}
              type="button"
              onClick={() => setSelectedFile(file)}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedFile.path === file.path
                  ? 'bg-[#1B212A] border border-[#8DA2FF] text-[#E6E9EF] font-medium'
                  : 'text-[#A3ACBA] hover:text-[#E6E9EF] hover:bg-[#151A21]'
              }`}
            >
              <FileCode className={`w-3.5 h-3.5 ${selectedFile.path === file.path ? 'text-[#8DA2FF]' : 'text-[#7F8A9B]'}`} />
              <span>{file.path}</span>
            </button>
          ))}
        </div>

        {/* Code Content Container */}
        <div className="rounded-lg bg-[#0B0E13] border border-[#2A323E] overflow-hidden">
          <div className="px-3.5 py-2 bg-[#151A21] border-b border-[#2A323E] flex items-center justify-between text-xs font-mono text-[#7F8A9B]">
            <span>{selectedFile.path}</span>
            <span className="tabular-nums">{selectedFile.content.split('\n').length} lines</span>
          </div>
          <div className="p-4 overflow-auto max-h-[460px]">
            <pre className="font-mono text-xs leading-relaxed text-[#E6E9EF] whitespace-pre">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};

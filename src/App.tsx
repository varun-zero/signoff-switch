import React, { useMemo, useState } from 'react';
import {
  ActorId,
  AgentProvider,
  DecisionLogEntry,
  DraftSection,
  EvidenceItem,
  PermissionCheckResult,
  PlatformBridge,
  RateCardRow,
  RequirementRow,
  RoomKind,
  RoomMessage,
  RubricCriterion,
  VerticalId,
  calculateDealPricing,
  checkAgentWakePermission,
  computeRubricScorecard,
  evaluateBidGoNoGo,
  renderComplianceMatrixCsv,
  runDeterministicChecker
} from './engine/signoffEngine';
import { VERTICAL_PACKS } from './engine/verticalsData';
import { BridgeRoomPanel } from './components/BridgeRoomPanel';
import { ArtifactInspectorPanel, InspectorTab } from './components/ArtifactInspectorPanel';
import { CliAndRepoView } from './components/CliAndRepoView';
import { PlatformsAndAgentsGuideView } from './components/PlatformsAndAgentsGuideView';
import { SignoffBrandLogo, VerticalEmblem } from './components/BrandLogos';
import { VisualPipelineFlow } from './components/VisualPipelineFlow';
import { CheckCircle2, Download } from 'lucide-react';

type MainWorkspaceView = 'workbench' | 'cli_repo' | 'platforms_guide' | 'build_plan_pdf';

interface VerticalRuntimeState {
  isFixed: boolean;
  isSignedOff: boolean;
  requirements: RequirementRow[];
  evidence: EvidenceItem[];
  sections: DraftSection[];
  rubric: RubricCriterion[];
  rateCard: RateCardRow[];
  messages: RoomMessage[];
  decisionLog: DecisionLogEntry[];
}

function createInitialStateForVertical(v: VerticalId): VerticalRuntimeState {
  const pack = VERTICAL_PACKS[v];
  return {
    isFixed: false,
    isSignedOff: false,
    requirements: pack.requirements.map((r) => ({ ...r, evidence_ids: [...r.evidence_ids] })),
    evidence: pack.evidence.map((e) => ({ ...e })),
    sections: pack.sections.map((s) => ({ ...s })),
    rubric: pack.rubricInitial.map((c) => ({ ...c, finding_ids: [...c.finding_ids] })),
    rateCard: (pack.rateCard || []).map((r) => ({ ...r })),
    messages: pack.initialMessages.map((m) => ({ ...m })),
    decisionLog: pack.initialDecisionLog.map((d) => ({ ...d }))
  };
}

export default function App() {
  const [activeView, setActiveView] = useState<MainWorkspaceView>('workbench');
  const [vertical, setVertical] = useState<VerticalId>('grant');
  const [bridge, setBridge] = useState<PlatformBridge>('discord');
  const [provider, setProvider] = useState<AgentProvider>('opencode');
  const [activeRoom, setActiveRoom] = useState<RoomKind | 'split'>('split');
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('checker');
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const [verticalStates, setVerticalStates] = useState<Record<VerticalId, VerticalRuntimeState>>(() => ({
    grant: createInitialStateForVertical('grant'),
    bid: createInitialStateForVertical('bid'),
    deal: createInitialStateForVertical('deal')
  }));

  const currentPack = VERTICAL_PACKS[vertical];
  const currentState = verticalStates[vertical];

  const checkerResult = useMemo(
    () =>
      runDeterministicChecker(
        vertical,
        currentState.requirements,
        currentState.evidence,
        currentState.sections,
        currentState.rubric
      ),
    [
      vertical,
      currentState.requirements,
      currentState.evidence,
      currentState.sections,
      currentState.rubric
    ]
  );

  const scorecardResult = useMemo(
    () => computeRubricScorecard(vertical, currentState.rubric, checkerResult),
    [vertical, currentState.rubric, checkerResult]
  );

  const dealPricingResult = useMemo(
    () => calculateDealPricing(verticalStates.deal.rateCard, 40),
    [verticalStates.deal.rateCard]
  );

  const bidScoreResult = useMemo(
    () => evaluateBidGoNoGo(currentState.requirements, checkerResult, scorecardResult),
    [currentState.requirements, checkerResult, scorecardResult]
  );

  const triggerDownload = (filename: string, content: string, mimeType = 'text/markdown;charset=utf-8') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBannerNotice(`Downloaded ${filename}`);
  };

  const handleApplyHumanFix = () => {
    const pack = VERTICAL_PACKS[vertical];
    setVerticalStates((prev) => {
      const st = prev[vertical];
      const updatedEvidence = st.evidence.map((e) => ({ ...e, attached: true }));
      const updatedRequirements = st.requirements.map((r) => ({
        ...r,
        status: 'covered' as const
      }));

      const updatedSections = st.sections.map((sec) => {
        if (vertical === 'grant' && sec.id === 'sec-3') {
          return {
            ...sec,
            content: sec.content.replace(
              'we served 1,240 job seekers last year across four port corridors.',
              'we served 1,240 job seekers last year across four port corridors [E2].'
            )
          };
        }
        if (vertical === 'bid' && sec.id === 'bid-sec-3') {
          return {
            ...sec,
            content: sec.content.replace(
              'achieved 99.98% uptime across 45 enterprise clients.',
              'achieved 99.98% uptime across 45 enterprise clients [E4].'
            )
          };
        }
        if (vertical === 'deal' && sec.id === 'deal-sec-3') {
          return {
            ...sec,
            content: sec.content.replace(
              'total fixed-fee investment is $76,404 with a 40% kickoff deposit due upon signing.',
              'total fixed-fee investment is $76,404 with a 40% kickoff deposit due upon signing [E1].'
            )
          };
        }
        return sec;
      });

      const newMessages: RoomMessage[] = [
        ...st.messages,
        {
          id: `msg-fix-human-${Date.now()}`,
          room: 'draft',
          sender_id: 'approver',
          sender_name: 'You (Approver)',
          sender_badge: 'OWNER',
          timestamp: '16:05:12',
          addressed_to: '@signoff-drafter @signoff-reviewer',
          content: pack.humanDecisionPrompt,
          is_human_gate: true
        },
        {
          id: `msg-fix-reviewer-${Date.now() + 1}`,
          room: 'draft',
          sender_id: 'reviewer',
          sender_name: 'signoff-reviewer',
          sender_badge: 'AGENT',
          timestamp: '16:05:40',
          addressed_to: '@Approver',
          content: `All 8/8 rules passed. Score updated to ${vertical === 'grant' ? '94/100' : '95/100'} (Ready for Sign-Off).`,
          artifact_ref: `out/${vertical}/scorecard.md`
        }
      ];

      const newDecisionLog: DecisionLogEntry[] = [
        {
          id: `dec-fix-${Date.now()}`,
          actor: 'Approver (Owner)',
          role: 'Approver',
          action: pack.humanDecisionPrompt,
          timestamp: '2026-11-04 16:05:12 IST',
          room: `#${pack.draftRoomName}`,
          artifact: `out/${vertical}/scorecard.md`
        },
        ...st.decisionLog
      ];

      return {
        ...prev,
        [vertical]: {
          ...st,
          isFixed: true,
          requirements: updatedRequirements,
          evidence: updatedEvidence,
          sections: updatedSections,
          rubric: pack.rubricFixed.map((c) => ({ ...c })),
          messages: newMessages,
          decisionLog: newDecisionLog
        }
      };
    });

    setBannerNotice('Human fix applied: 8/8 rules passed.');
  };

  const handleResetVertical = () => {
    setVerticalStates((prev) => ({
      ...prev,
      [vertical]: createInitialStateForVertical(vertical)
    }));
    setBannerNotice(`Reset ${currentPack.name} to initial 78/100 catch.`);
  };

  const handleSignOffAndExport = () => {
    const pack = VERTICAL_PACKS[vertical];
    setVerticalStates((prev) => {
      const st = prev[vertical];
      const exportMsg: RoomMessage = {
        id: `msg-export-${Date.now()}`,
        room: 'draft',
        sender_id: 'approver',
        sender_name: 'You (Approver)',
        sender_badge: 'OWNER',
        timestamp: '16:06:15',
        addressed_to: '@signoff-drafter',
        content: `Signed off (${scorecardResult.total_score}/100) and exported ${vertical}-submission-pack.docx.`,
        is_human_gate: true
      };

      return {
        ...prev,
        [vertical]: {
          ...st,
          isSignedOff: true,
          messages: [...st.messages, exportMsg]
        }
      };
    });

    const bundleContent = [
      `# SIGNOFF SUBMISSION PACKAGE — ${pack.name.toUpperCase()}`,
      `Score: ${scorecardResult.total_score}/100 · Rules: ${checkerResult.rules_passed}/8`,
      '',
      ...currentState.sections.map((s) => `## ${s.title}\n\n${s.content}\n`),
      '',
      scorecardResult.markdown_scorecard,
      '',
      renderComplianceMatrixCsv(currentState.requirements)
    ].join('\n');

    triggerDownload(`${vertical}-submission-package.doc`, bundleContent, 'application/msword');
  };

  const handleSendCustomMessage = (
    from: ActorId,
    to: 'analyst' | 'drafter' | 'reviewer',
    room: RoomKind,
    text: string
  ): PermissionCheckResult => {
    const perm = checkAgentWakePermission(from, to, room);
    if (!perm.allowed) {
      return perm;
    }

    const senderLabels: Record<ActorId, string> = {
      approver: 'You (Approver)',
      client: currentPack.persona.split(',')[0],
      analyst: 'signoff-analyst',
      drafter: 'signoff-drafter',
      reviewer: 'signoff-reviewer'
    };

    const agentReplyMap: Record<'analyst' | 'drafter' | 'reviewer', string> = {
      analyst: `Validated ${currentState.requirements.length} requirements in matrix.`,
      drafter: `Verified ${currentState.sections.length} sections within word limits.`,
      reviewer: `Ran check & score: ${scorecardResult.total_score}/100 (${checkerResult.rules_passed}/8 rules).`
    };

    const userMsg: RoomMessage = {
      id: `msg-u-${Date.now()}`,
      room,
      sender_id: from,
      sender_name: senderLabels[from],
      sender_badge: from.toUpperCase(),
      timestamp: '16:07:02',
      addressed_to: `@signoff-${to}`,
      content: text
    };

    const agentMsg: RoomMessage = {
      id: `msg-a-${Date.now() + 1}`,
      room,
      sender_id: to,
      sender_name: `signoff-${to}`,
      sender_badge: 'AGENT',
      timestamp: '16:07:06',
      addressed_to: `@${senderLabels[from]}`,
      content: agentReplyMap[to]
    };

    setVerticalStates((prev) => ({
      ...prev,
      [vertical]: {
        ...prev[vertical],
        messages: [...prev[vertical].messages, userMsg, agentMsg]
      }
    }));

    return perm;
  };

  const handleToggleEvidenceAttached = (evidenceId: string) => {
    setVerticalStates((prev) => {
      const st = prev[vertical];
      const nextEvidence = st.evidence.map((e) =>
        e.id === evidenceId ? { ...e, attached: !e.attached } : e
      );
      const attachedSet = new Set(nextEvidence.filter((e) => e.attached).map((e) => e.id));
      const nextReqs = st.requirements.map((r) => {
        if (!r.is_attachment) return r;
        const allPresent = r.evidence_ids.every((id) => attachedSet.has(id));
        return {
          ...r,
          status: allPresent ? ('covered' as const) : ('missing_attachment' as const)
        };
      });
      return {
        ...prev,
        [vertical]: {
          ...st,
          evidence: nextEvidence,
          requirements: nextReqs
        }
      };
    });
  };

  const handleUpdateSectionContent = (sectionId: string, newContent: string) => {
    setVerticalStates((prev) => {
      const st = prev[vertical];
      return {
        ...prev,
        [vertical]: {
          ...st,
          sections: st.sections.map((s) => (s.id === sectionId ? { ...s, content: newContent } : s))
        }
      };
    });
  };

  const handleUpdateRateCardHours = (rowId: string, hours: number) => {
    setVerticalStates((prev) => {
      const st = prev.deal;
      return {
        ...prev,
        deal: {
          ...st,
          rateCard: st.rateCard.map((r) => (r.id === rowId ? { ...r, hours } : r))
        }
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#01010D] text-[#F4F3FF]">
      {/* 3-Zone Top Bar */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 bg-[#01010D] border-b border-[#221E42] sticky top-0 z-30">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('workbench');
          }}
          className="flex items-center gap-3 text-xl font-bold tracking-tight text-[#F4F3FF] font-serif-display whitespace-nowrap shrink-0"
        >
          <SignoffBrandLogo className="w-8 h-8" />
          <span>Signoff</span>
        </a>

        <nav aria-label="Primary Workspace Views" className="flex items-center gap-6 text-sm font-medium text-[#C2BCE8] overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveView('workbench')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'workbench'
                ? 'text-[#88F9C0] underline decoration-[#88F9C0] decoration-2 underline-offset-8 font-semibold'
                : 'hover:text-[#F4F3FF]'
            }`}
          >
            Compliance Room
          </button>
          <button
            type="button"
            onClick={() => setActiveView('cli_repo')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'cli_repo'
                ? 'text-[#88F9C0] underline decoration-[#88F9C0] decoration-2 underline-offset-8 font-semibold'
                : 'hover:text-[#F4F3FF]'
            }`}
          >
            CLI & Python Repo
          </button>
          <button
            type="button"
            onClick={() => setActiveView('platforms_guide')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'platforms_guide'
                ? 'text-[#88F9C0] underline decoration-[#88F9C0] decoration-2 underline-offset-8 font-semibold'
                : 'hover:text-[#F4F3FF]'
            }`}
          >
            Platforms & Providers
          </button>
          <button
            type="button"
            onClick={() => setActiveView('build_plan_pdf')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'build_plan_pdf'
                ? 'text-[#88F9C0] underline decoration-[#88F9C0] decoration-2 underline-offset-8 font-semibold'
                : 'hover:text-[#F4F3FF]'
            }`}
          >
            Build Plan PDF
          </button>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleSignOffAndExport}
            className="px-4 py-2 text-sm font-semibold text-[#01010D] bg-[#88F9C0] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Export Submission Pack
          </button>
        </div>
      </header>

      {/* Minimal Header Strip with Vertical Emblem Buttons */}
      <section className="border-b border-[#221E42] px-6 py-5">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-serif-display font-semibold text-[#F4F3FF]">
            One engine. Three verticals. One human sign-off.
          </h1>

          <div
            role="group"
            aria-label="Select Compliance Vertical"
            className="flex flex-wrap items-center gap-2.5"
          >
            {(['grant', 'bid', 'deal'] as VerticalId[]).map((vId) => {
              const p = VERTICAL_PACKS[vId];
              const isSelected = vertical === vId;
              return (
                <button
                  key={vId}
                  type="button"
                  onClick={() => {
                    setVertical(vId);
                    setBannerNotice(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#6331FB] text-[#FFFFFF]'
                      : 'bg-[#0A091A] text-[#C2BCE8] border border-[#221E42] hover:text-[#F4F3FF]'
                  }`}
                >
                  <VerticalEmblem vertical={vId} className="w-4 h-4" />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive 5-Stage Visual Pipeline Flow */}
      {activeView === 'workbench' && (
        <VisualPipelineFlow
          vertical={vertical}
          pack={currentPack}
          bridge={bridge}
          provider={provider}
          checker={checkerResult}
          scorecard={scorecardResult}
          isFixed={currentState.isFixed}
          isSignedOff={currentState.isSignedOff}
          activeTab={inspectorTab}
          onSelectTab={setInspectorTab}
          onApplyHumanFix={handleApplyHumanFix}
          onSignOffAndExport={handleSignOffAndExport}
        />
      )}

      {bannerNotice && (
        <div
          role="status"
          className="bg-[#0A091A] border-b border-[#6331FB] px-6 py-2.5 text-sm text-[#88F9C0]"
        >
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{bannerNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setBannerNotice(null)}
              className="text-sm text-[#C2BCE8] hover:text-[#F4F3FF] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-8">
        {activeView === 'workbench' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
            <div className="xl:col-span-6">
              <BridgeRoomPanel
                pack={currentPack}
                bridge={bridge}
                onSelectBridge={setBridge}
                provider={provider}
                onSelectProvider={setProvider}
                activeRoom={activeRoom}
                onSelectRoom={setActiveRoom}
                messages={currentState.messages}
                isFixed={currentState.isFixed}
                isSignedOff={currentState.isSignedOff}
                onApplyHumanFix={handleApplyHumanFix}
                onResetDemo={handleResetVertical}
                onSignOffAndExport={handleSignOffAndExport}
                onSendCustomMessage={handleSendCustomMessage}
              />
            </div>

            <div className="xl:col-span-6">
              <ArtifactInspectorPanel
                vertical={vertical}
                activeTab={inspectorTab}
                onSelectTab={setInspectorTab}
                checker={checkerResult}
                scorecard={scorecardResult}
                requirements={currentState.requirements}
                evidence={currentState.evidence}
                sections={currentState.sections}
                decisionLog={currentState.decisionLog}
                dealPricing={vertical === 'deal' ? dealPricingResult : undefined}
                bidScore={vertical === 'bid' ? bidScoreResult : undefined}
                onToggleEvidenceAttached={handleToggleEvidenceAttached}
                onUpdateSectionContent={handleUpdateSectionContent}
                onUpdateRateCardHours={handleUpdateRateCardHours}
                onApplyHumanFix={handleApplyHumanFix}
                onDownloadArtifact={triggerDownload}
                onSignOffAndExport={handleSignOffAndExport}
              />
            </div>
          </div>
        )}

        {activeView === 'cli_repo' && (
          <CliAndRepoView
            vertical={vertical}
            pack={currentPack}
            checker={checkerResult}
            scorecard={scorecardResult}
            dealPricing={dealPricingResult}
            isFixed={currentState.isFixed}
            onDownloadArtifact={triggerDownload}
          />
        )}

        {activeView === 'platforms_guide' && <PlatformsAndAgentsGuideView />}

        {activeView === 'build_plan_pdf' && (
          <section aria-label="Signoff Build Plan PDF" className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#221E42]">
              <h2 className="text-xl font-semibold text-[#F4F3FF]">
                Build Plan PDF
              </h2>
              <a
                href="/assets/aistudio/Signoff-Build-Plan_fbb7e173.pdf"
                download="Signoff-Build-Plan.pdf"
                className="px-4 py-2 text-sm font-semibold bg-[#88F9C0] text-[#01010D] rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>
            </div>
            <div className="h-[760px] w-full rounded-xl overflow-hidden border border-[#221E42]">
              <iframe
                src="/assets/aistudio/Signoff-Build-Plan_fbb7e173.pdf"
                title="Signoff Build Plan PDF"
                className="w-full h-full border-0"
              />
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-[#221E42] px-6 py-5 text-sm text-[#C2BCE8]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>Signoff · Switch Compliance Room</div>
          <div className="font-mono">github.com/varun2507027108-oss/signoff-switch</div>
        </div>
      </footer>
    </div>
  );
}

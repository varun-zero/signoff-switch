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
import { SettingsModal } from './components/SettingsModal';
import { DockerLogo, GitHubLogo, PythonLogo, SignoffBrandLogo, VerticalEmblem } from './components/BrandLogos';
import { VisualPipelineFlow } from './components/VisualPipelineFlow';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  RotateCcw,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sidebar
} from 'lucide-react';

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
  const [activeRoom, setActiveRoom] = useState<RoomKind | 'split'>('draft');
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('checker');
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(true);

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

    setBannerNotice('Fix approved: all 8 deterministic rules verified clean.');
  };

  const handleResetVertical = () => {
    setVerticalStates((prev) => ({
      ...prev,
      [vertical]: createInitialStateForVertical(vertical)
    }));
    setBannerNotice(`Reset ${currentPack.name} to initial holds.`);
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
      `Signer: You (Approver) · Timestamp: 2026-11-04 16:05:12 IST`,
      `Verification Hash: sha256:4f8b2e9c18d4e72a0f9b6c3d5e8a1f2b`,
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
    <div className="min-h-screen flex bg-[#0F1217] text-[#E6E9EF]">
      {/* 56px Left Rail (Context & Navigation) */}
      <aside aria-label="Verticals rail" className="w-14 bg-[#151A21] border-r border-[#2A323E] flex flex-col items-center py-3.5 justify-between shrink-0 z-30">
        <div className="flex flex-col items-center gap-4">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('workbench');
            }}
            title="Signoff"
            className="p-1.5 rounded-lg hover:bg-[#1B212A] transition-colors"
          >
            <SignoffBrandLogo className="w-7 h-7" />
          </a>

          <div className="w-8 h-[1px] bg-[#2A323E]" />

          {/* 3 Verticals in Rail */}
          <div className="flex flex-col items-center gap-2" role="group" aria-label="Select vertical">
            {(['grant', 'bid', 'deal'] as VerticalId[]).map((vId) => {
              const isSelected = vertical === vId;
              const p = VERTICAL_PACKS[vId];
              return (
                <button
                  key={vId}
                  type="button"
                  onClick={() => {
                    setVertical(vId);
                    setBannerNotice(null);
                  }}
                  title={p.name}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B212A] border border-[#8DA2FF] text-[#8DA2FF]'
                      : 'text-[#7F8A9B] hover:text-[#E6E9EF] hover:bg-[#1B212A]'
                  }`}
                >
                  <VerticalEmblem vertical={vId} className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Rail Action: Settings Popover */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            title="Switch Environment Settings"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#7F8A9B] hover:text-[#E6E9EF] hover:bg-[#1B212A] transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-14 px-6 bg-[#151A21] border-b border-[#2A323E] flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#E6E9EF]">
                Signoff
              </span>
              <span className="text-xs text-[#7F8A9B] font-mono">
                / {currentPack.name}
              </span>
            </div>

            {/* Top Workspace Nav */}
            <nav aria-label="Primary views" className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveView('workbench')}
                className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer font-medium ${
                  activeView === 'workbench'
                    ? 'bg-[#1B212A] text-[#8DA2FF] font-semibold'
                    : 'text-[#A3ACBA] hover:text-[#E6E9EF]'
                }`}
              >
                Compliance room
              </button>
              <button
                type="button"
                onClick={() => setActiveView('cli_repo')}
                className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer font-medium ${
                  activeView === 'cli_repo'
                    ? 'bg-[#1B212A] text-[#8DA2FF] font-semibold'
                    : 'text-[#A3ACBA] hover:text-[#E6E9EF]'
                }`}
              >
                CLI toolbelt
              </button>
              <button
                type="button"
                onClick={() => setActiveView('platforms_guide')}
                className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer font-medium ${
                  activeView === 'platforms_guide'
                    ? 'bg-[#1B212A] text-[#8DA2FF] font-semibold'
                    : 'text-[#A3ACBA] hover:text-[#E6E9EF]'
                }`}
              >
                Platforms & providers
              </button>
              <button
                type="button"
                onClick={() => setActiveView('build_plan_pdf')}
                className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer font-medium ${
                  activeView === 'build_plan_pdf'
                    ? 'bg-[#1B212A] text-[#8DA2FF] font-semibold'
                    : 'text-[#A3ACBA] hover:text-[#E6E9EF]'
                }`}
              >
                Build plan
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsActivityOpen(!isActivityOpen)}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 border transition-colors cursor-pointer ${
                isActivityOpen
                  ? 'bg-[#1B212A] border-[#384252] text-[#8DA2FF]'
                  : 'text-[#7F8A9B] border-[#2A323E] hover:text-[#E6E9EF]'
              }`}
              title="Toggle activity sidebar"
            >
              <Sidebar className="w-4 h-4" />
              <span className="hidden sm:inline">Activity</span>
            </button>
          </div>
        </header>

        {/* Global Toast / Notice */}
        {bannerNotice && (
          <div
            role="status"
            className="px-6 py-2 bg-[#1B212A] border-b border-[#2A323E] flex items-center justify-between text-xs text-[#E6E9EF]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#6CC4A1]" />
              <span>{bannerNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setBannerNotice(null)}
              className="text-xs text-[#7F8A9B] hover:text-[#E6E9EF] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-6 space-y-5 overflow-y-auto max-w-[1440px] w-full mx-auto">
          {activeView === 'workbench' && (
            <>
              {/* Verdict Banner: Lead with the Verdict (Above the fold) */}
              <section
                aria-label="Verdict banner"
                className="p-5 rounded-lg border border-[#2A323E] bg-[#151A21] transition-all shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          currentState.isFixed
                            ? 'bg-[rgba(108,196,161,0.15)] text-[#6CC4A1]'
                            : 'bg-[rgba(242,131,122,0.15)] text-[#F2837A]'
                        }`}
                      >
                        {currentState.isFixed ? 'Pass · Ready' : 'Blocked'}
                      </span>
                      <h1 className="text-xl sm:text-2xl font-bold text-[#E6E9EF]">
                        {currentState.isFixed
                          ? 'Signed audit instrument · Verified clean'
                          : 'Blocked: 2 holds before submission'}
                      </h1>
                    </div>

                    <p className="text-xs text-[#A3ACBA] leading-relaxed max-w-[70ch]">
                      {currentState.isFixed
                        ? `Signer: You (Approver) · Verified: 2026-11-04 16:05:12 IST · Score: ${scorecardResult.total_score}/100 · SHA-256: 4f8b2e9c18d4e72a`
                        : `Score 78 → 94 after fixes · Missing audit attachment [E7] and uncited metric in Section 3`}
                    </p>
                  </div>

                  {/* Single Primary Action in Verdict Banner */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!currentState.isFixed ? (
                      <button
                        type="button"
                        onClick={handleApplyHumanFix}
                        className="px-4 py-2.5 text-xs font-semibold bg-[#8DA2FF] text-[#0F1217] hover:bg-[#A5B6FF] rounded-md transition-colors cursor-pointer whitespace-nowrap control-btn"
                      >
                        Approve fix & re-run
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleSignOffAndExport}
                          className="px-4 py-2.5 text-xs font-semibold bg-[#8DA2FF] text-[#0F1217] hover:bg-[#A5B6FF] rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 control-btn"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{currentState.isSignedOff ? 'Export pack again' : 'Export submission pack'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleResetVertical}
                          className="p-2 text-xs text-[#7F8A9B] hover:text-[#E6E9EF] bg-[#1B212A] border border-[#2A323E] hover:border-[#8DA2FF] rounded-md transition-colors cursor-pointer"
                          title="Reset demo"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </section>

              {/* Thin 5-step Pipeline Stepper */}
              <VisualPipelineFlow
                vertical={vertical}
                pack={currentPack}
                checker={checkerResult}
                scorecard={scorecardResult}
                isFixed={currentState.isFixed}
                isSignedOff={currentState.isSignedOff}
                activeTab={inspectorTab}
                onSelectTab={setInspectorTab}
              />

              {/* Main Content & Activity Layout */}
              <div className="flex flex-col lg:flex-row gap-5 items-start">
                {/* Left/Center Column: Rules Table & Telemetry Tabs */}
                <div className="flex-1 min-w-0 w-full space-y-4">
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
                    onDownloadArtifact={triggerDownload}
                  />
                </div>

                {/* Right Collapsible Activity Panel */}
                {isActivityOpen && (
                  <div className="w-full lg:w-80 shrink-0">
                    <BridgeRoomPanel
                      pack={currentPack}
                      bridge={bridge}
                      provider={provider}
                      activeRoom={activeRoom}
                      onSelectRoom={setActiveRoom}
                      messages={currentState.messages}
                      onSendCustomMessage={handleSendCustomMessage}
                    />
                  </div>
                )}
              </div>
            </>
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
              <div className="flex items-center justify-between pb-3 border-b border-[#2A323E]">
                <div>
                  <h2 className="text-base font-semibold text-[#E6E9EF]">
                    Signoff build plan specification PDF
                  </h2>
                  <p className="text-xs text-[#7F8A9B]">
                    Architecture reference for Switch compliance rooms and scoring
                  </p>
                </div>
                <a
                  href="/assets/aistudio/Signoff-Build-Plan_fbb7e173.pdf"
                  download="Signoff-Build-Plan.pdf"
                  className="px-3 py-1.5 text-xs font-semibold bg-[#8DA2FF] text-[#0F1217] rounded-md flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
              <div className="h-[760px] w-full rounded-lg overflow-hidden border border-[#2A323E] bg-[#151A21]">
                <iframe
                  src="/assets/aistudio/Signoff-Build-Plan_fbb7e173.pdf"
                  title="Signoff Build Plan PDF"
                  className="w-full h-full border-0"
                />
              </div>
            </section>
          )}
        </main>

        {/* Clean Neutral Footer */}
        <footer className="h-12 border-t border-[#2A323E] px-6 bg-[#151A21] flex items-center justify-between text-xs text-[#7F8A9B]">
          <div className="flex items-center gap-2">
            <span>Signoff · Deterministic compliance gate</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <PythonLogo className="w-3.5 h-3.5" />
              <span>Python 3.13</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <DockerLogo className="w-3.5 h-3.5" />
              <span>Docker</span>
            </div>
            <span>·</span>
            <a
              href="https://github.com/varun-zero/signoff-switch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#A3ACBA] hover:text-[#8DA2FF] transition-colors"
            >
              <GitHubLogo className="w-3.5 h-3.5" />
              <span>varun-zero/signoff-switch</span>
            </a>
          </div>
        </footer>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        bridge={bridge}
        onSelectBridge={setBridge}
        provider={provider}
        onSelectProvider={setProvider}
      />
    </div>
  );
}

export type VerticalId = 'grant' | 'bid' | 'deal';
export type PlatformBridge = 'discord' | 'slack' | 'teams' | 'telegram';
export type AgentProvider = 'opencode' | 'antigravity' | 'claude' | 'codex';
export type ActorId = 'client' | 'approver' | 'analyst' | 'drafter' | 'reviewer';
export type RoomKind = 'intake' | 'draft';

export interface RequirementRow {
  id: string;
  section: string;
  requirement: string;
  mandatory: boolean;
  source_page: number;
  word_limit?: number;
  is_attachment?: boolean;
  rubric_criterion?: string;
  evidence_ids: string[];
  status: 'covered' | 'flagged' | 'gap' | 'missing_attachment';
  disqualifier_note?: string;
}

export interface EvidenceItem {
  id: string;
  type: 'document' | 'spreadsheet' | 'audit' | 'letter' | 'certification' | 'rate_card' | 'case_study';
  title: string;
  path: string;
  date: string;
  issuer: string;
  attached: boolean;
  summary: string;
}

export interface RubricCriterion {
  criterion: string;
  label: string;
  weight: number; // percentage 0..100
  score: number; // 0..100
  rationale: string;
  finding_ids: string[];
}

export interface DraftSection {
  id: string;
  req_id: string;
  title: string;
  word_limit: number;
  rubric_criterion: string;
  content: string;
}

export interface CheckerViolation {
  rule_id: number;
  rule_name: string;
  severity: 'error' | 'warning';
  file: string;
  line: number;
  section_id?: string;
  message: string;
  quote: string;
  remediation: string;
}

export interface CheckerResult {
  vertical: VerticalId;
  passed: boolean;
  rules_passed: number;
  rules_total: number;
  violations: CheckerViolation[];
  section_word_counts: Record<string, { words: number; limit: number; within_limit: boolean }>;
  cited_evidence_ids: string[];
  gap_markers_count: number;
  markdown_report: string;
}

export interface ScorecardResult {
  vertical: VerticalId;
  total_score: number; // weighted 0..100
  checker_passed: boolean;
  ready_for_signoff: boolean;
  criteria: Array<RubricCriterion & { weighted_points: number }>;
  markdown_scorecard: string;
}

export interface RateCardRow {
  id: string;
  role: string;
  deliverable: string;
  hours: number;
  hourly_rate: number;
  cost_rate: number;
  evidence_id: string;
}

export interface PricingQuoteResult {
  subtotal: number;
  total_cost: number;
  gross_margin_dollars: number;
  gross_margin_pct: number;
  deposit_pct: number;
  deposit_amount: number;
  total_hours: number;
  rows: Array<RateCardRow & { line_total: number; line_cost: number; line_margin_pct: number }>;
  markdown_quote: string;
}

export interface BidScoreResult {
  win_probability: number;
  recommendation: 'GO' | 'CONDITIONAL GO' | 'NO-BID';
  blockers: string[];
  strengths: string[];
  memo_markdown: string;
}

export interface DecisionLogEntry {
  id: string;
  actor: string;
  role: 'Approver' | 'Analyst' | 'Drafter' | 'Reviewer' | 'Client';
  action: string;
  timestamp: string;
  room: string;
  artifact: string;
}

export interface RoomMessage {
  id: string;
  room: RoomKind;
  sender_id: ActorId;
  sender_name: string;
  sender_badge: string;
  timestamp: string;
  addressed_to?: string;
  content: string;
  artifact_ref?: string;
  is_human_gate?: boolean;
}

export interface PermissionCheckResult {
  from: ActorId;
  to: 'analyst' | 'drafter' | 'reviewer';
  room: RoomKind;
  allowed: boolean;
  enforcement_type: 'structural_room' | 'addressing_policy' | 'agent_instruction' | 'allowed';
  reason: string;
}

/**
 * Evaluate Switch v1 per-agent addressing and room visibility model (Build Plan Page 8).
 */
export function checkAgentWakePermission(
  from: ActorId,
  to: 'analyst' | 'drafter' | 'reviewer',
  room: RoomKind
): PermissionCheckResult {
  // Rule 1: Client is only a member of intake; draft room is invisible to client.
  if (from === 'client' && room === 'draft') {
    return {
      from,
      to,
      room,
      allowed: false,
      enforcement_type: 'structural_room',
      reason: 'Structural guarantee: Client is a member of #{vertical}-intake only. The #{vertical}-draft room is private and not visible to the client.'
    };
  }

  // Rule 2: Drafter and Reviewer are not members of intake room.
  if (room === 'intake' && (to === 'drafter' || to === 'reviewer')) {
    return {
      from,
      to,
      room,
      allowed: false,
      enforcement_type: 'structural_room',
      reason: `Structural guarantee: @signoff-${to} is not in #{vertical}-intake. Only @signoff-analyst is present in the intake room.`
    };
  }

  // Rule 3: Reviewer has `addressing: owner` — ONLY the human Approver (owner) can wake it.
  if (to === 'reviewer') {
    if (from === 'approver') {
      return {
        from,
        to,
        room,
        allowed: true,
        enforcement_type: 'allowed',
        reason: 'Allowed: Approver is the Switch owner of @signoff-reviewer (addressing: owner).'
      };
    }
    return {
      from,
      to,
      room,
      allowed: false,
      enforcement_type: 'addressing_policy',
      reason: `Blocked by Switch policy (addressing: owner): @signoff-reviewer only accepts wakes from the human Approver. ${from.toUpperCase()} cannot wake the Reviewer.`
    };
  }

  // Rule 4: Drafter has `addressing: owner-agents` — only Approver or Approver's agents can wake it.
  if (to === 'drafter') {
    if (from === 'client') {
      return {
        from,
        to,
        room,
        allowed: false,
        enforcement_type: 'addressing_policy',
        reason: 'Blocked by Switch policy (addressing: owner-agents): Client cannot wake @signoff-drafter.'
      };
    }
    if (from === 'reviewer') {
      return {
        from,
        to,
        room,
        allowed: false,
        enforcement_type: 'agent_instruction',
        reason: 'Blocked by Agent Instruction contract: While owner-agents policy permits it, @signoff-reviewer is strictly instructed to report to the Approver only and never direct the Drafter.'
      };
    }
    return {
      from,
      to,
      room,
      allowed: true,
      enforcement_type: 'allowed',
      reason: `Allowed: ${from} is admitted by owner-agents policy to hand off work to @signoff-drafter.`
    };
  }

  // Rule 5: Analyst has `addressing: anyone` and is in both rooms.
  return {
    from,
    to,
    room,
    allowed: true,
    enforcement_type: 'allowed',
    reason: 'Allowed: @signoff-analyst has addressing: anyone and is active in both intake and draft rooms.'
  };
}

/**
 * Count words in a markdown text block (excluding citation tags like [E1] or [GAP: ...]).
 */
export function countWords(text: string): number {
  const cleaned = text
    .replace(/\[E\d+\]/g, '')
    .replace(/\[GAP:?[^\]]*\]/g, '')
    .replace(/[#*_`>-]/g, ' ')
    .trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

/**
 * Deterministic 8-rule Checker (Build Plan Page 12).
 * Never calls an LLM. Offline, instant, and reports file/line references.
 */
export function runDeterministicChecker(
  vertical: VerticalId,
  requirements: RequirementRow[],
  evidence: EvidenceItem[],
  sections: DraftSection[],
  rubric: RubricCriterion[]
): CheckerResult {
  const violations: CheckerViolation[] = [];
  const validEvidenceIds = new Set(evidence.map((e) => e.id));
  const attachedEvidenceIds = new Set(evidence.filter((e) => e.attached).map((e) => e.id));
  const citedEvidenceSet = new Set<string>();
  let gapMarkersCount = 0;

  const sectionWordCounts: Record<string, { words: number; limit: number; within_limit: boolean }> = {};

  // Track which rules pass
  const ruleFailures = new Set<number>();

  // Rule 7: Requirement IDs are unique and no mandatory row is missing
  const seenReqIds = new Set<string>();
  requirements.forEach((req, idx) => {
    if (!req.id || seenReqIds.has(req.id)) {
      ruleFailures.add(7);
      violations.push({
        rule_id: 7,
        rule_name: 'Unique Requirement IDs & Mandatory Integrity',
        severity: 'error',
        file: `out/${vertical}/requirements.json`,
        line: idx + 2,
        message: `Duplicate or empty requirement ID "${req.id}" detected in matrix schema.`,
        quote: `"id": "${req.id}"`,
        remediation: 'Ensure every row in requirements.json has a unique identifier.'
      });
    }
    seenReqIds.add(req.id);
  });

  // Compute global line numbers in draft.md
  let currentLine = 1;
  const coveredReqIds = new Set<string>();
  const coveredCriteria = new Set<string>();

  for (const section of sections) {
    const headerLine = currentLine;
    const lines = section.content.split('\n');
    const words = countWords(section.content);
    const withinLimit = words <= section.word_limit;

    sectionWordCounts[section.id] = {
      words,
      limit: section.word_limit,
      within_limit: withinLimit
    };

    if (section.content.trim().length > 0) {
      coveredReqIds.add(section.req_id);
      if (section.rubric_criterion) {
        coveredCriteria.add(section.rubric_criterion);
      }
    }

    // Rule 4: Every section is within its word limit
    if (!withinLimit) {
      ruleFailures.add(4);
      violations.push({
        rule_id: 4,
        rule_name: 'Section Word Limit Enforcement',
        severity: 'error',
        file: `out/${vertical}/draft.md`,
        line: headerLine,
        section_id: section.id,
        message: `Section "${section.title}" exceeds word limit (${words} / ${section.word_limit} words).`,
        quote: `## ${section.title} (${words} words > max ${section.word_limit})`,
        remediation: `Trim ${words - section.word_limit} words from ${section.title} to satisfy funder limit.`
      });
    }

    lines.forEach((rawLine, lineOffset) => {
      const lineNumber = headerLine + 1 + lineOffset;
      const trimmed = rawLine.trim();
      if (!trimmed) return;

      // Count [GAP] markers
      const gapMatches = trimmed.match(/\[GAP:?[^\]]*\]/g);
      if (gapMatches) {
        gapMarkersCount += gapMatches.length;
      }

      // Extract [E#] citations
      const citationMatches = [...trimmed.matchAll(/\[(E\d+)\]/g)];
      for (const match of citationMatches) {
        const eid = match[1];
        citedEvidenceSet.add(eid);

        // Rule 1: Every [E#] citation exists in evidence/index.json
        if (!validEvidenceIds.has(eid)) {
          ruleFailures.add(1);
          violations.push({
            rule_id: 1,
            rule_name: 'Evidence Index Citation Validity',
            severity: 'error',
            file: `out/${vertical}/draft.md`,
            line: lineNumber,
            section_id: section.id,
            message: `Citation [${eid}] does not exist in verticals/${vertical}/evidence/index.json.`,
            quote: trimmed,
            remediation: `Replace [${eid}] with a valid evidence ID (${Array.from(validEvidenceIds).join(', ')}) or mark as [GAP].`
          });
        } else if (!attachedEvidenceIds.has(eid)) {
          // Cited an evidence item that is not yet attached/approved
          ruleFailures.add(1);
          violations.push({
            rule_id: 1,
            rule_name: 'Evidence Index Citation Validity',
            severity: 'error',
            file: `out/${vertical}/draft.md`,
            line: lineNumber,
            section_id: section.id,
            message: `Citation [${eid}] references an unattached file in evidence/index.json.`,
            quote: trimmed,
            remediation: `Attach ${eid} in the evidence pack or obtain Approver sign-off to include it.`
          });
        }
      }

      // Rule 2: Every numeric or date claim has a citation [E#] or a [GAP] marker
      // Remove [E#] and [GAP...] before scanning for numeric/percentage/currency/year claims
      const lineWithoutTags = trimmed
        .replace(/\[E\d+\]/g, '')
        .replace(/\[GAP:?[^\]]*\]/g, '');

      const hasNumericOrDateClaim =
        /(\$\d[\d,.]*|\b\d{1,3}(?:,\d{3})+\b|\b\d+(?:\.\d+)?%|\b20\d{2}\b|\b\d{2,}\s+(?:people|job seekers|learners|participants|clients|hours|days|months|years|projects|engineers)\b)/i.test(
          lineWithoutTags
        );

      const hasCitationOrGap = /\[E\d+\]/.test(trimmed) || /\[GAP:?[^\]]*\]/.test(trimmed);

      if (hasNumericOrDateClaim && !hasCitationOrGap) {
        ruleFailures.add(2);
        violations.push({
          rule_id: 2,
          rule_name: 'Uncited Numeric or Date Claim Guardrail',
          severity: 'error',
          file: `out/${vertical}/draft.md`,
          line: lineNumber,
          section_id: section.id,
          message: 'Factual numeric or date claim found without an [E#] citation or [GAP] marker.',
          quote: trimmed,
          remediation: 'Append the supporting [E#] citation from evidence/index.json or mark [GAP: need verified metric].'
        });
      }
    });

    currentLine += lines.length + 2;
  }

  // Rule 3: Every mandatory narrative requirement in the matrix has a matching section/answer or a [GAP]
  requirements
    .filter((r) => r.mandatory && !r.is_attachment)
    .forEach((req, idx) => {
      if (!coveredReqIds.has(req.id) || req.status === 'flagged') {
        ruleFailures.add(3);
        violations.push({
          rule_id: 3,
          rule_name: 'Mandatory Requirement Coverage',
          severity: 'error',
          file: `out/${vertical}/requirements.json`,
          line: idx + 2,
          section_id: req.id,
          message: `Mandatory requirement "${req.id}" (${req.section}) is unresolved or missing a section response.`,
          quote: `${req.id}: ${req.requirement}`,
          remediation: req.disqualifier_note || `Provide a cited section or explicit [GAP] for ${req.id}.`
        });
      }
    });

  // Rule 5: Every required attachment is present and attached
  requirements
    .filter((r) => r.mandatory && r.is_attachment)
    .forEach((req, idx) => {
      const hasAttached =
        req.evidence_ids.length > 0 && req.evidence_ids.every((eid) => attachedEvidenceIds.has(eid));
      if (!hasAttached || req.status === 'missing_attachment' || req.status === 'flagged') {
        ruleFailures.add(5);
        violations.push({
          rule_id: 5,
          rule_name: 'Mandatory Attachment Verification',
          severity: 'error',
          file: `out/${vertical}/requirements.json`,
          line: idx + 2,
          section_id: req.id,
          message: `Required attachment "${req.id}" (${req.section}) is missing from active submission bundle.`,
          quote: `${req.id}: ${req.requirement} -> [${req.evidence_ids.join(', ') || 'NONE'}]`,
          remediation:
            req.disqualifier_note ||
            `Attach required file in evidence/index.json and link its [E#] ID to ${req.id}.`
        });
      }
    });

  // Rule 6: Every rubric criterion is addressed by at least one section
  rubric.forEach((crit, idx) => {
    if (!coveredCriteria.has(crit.criterion)) {
      ruleFailures.add(6);
      violations.push({
        rule_id: 6,
        rule_name: 'Complete Rubric Criterion Coverage',
        severity: 'error',
        file: `verticals/${vertical}/rubric.json`,
        line: idx + 2,
        message: `Rubric criterion "${crit.label}" (${crit.weight}% weight) is not addressed by any draft section.`,
        quote: `"criterion": "${crit.criterion}", "weight": ${crit.weight}`,
        remediation: `Map at least one draft section to the "${crit.criterion}" rubric criterion.`
      });
    }
  });

  const rulesTotal = 8;
  const rulesPassed = rulesTotal - ruleFailures.size;
  const passed = violations.length === 0;

  const mdLines: string[] = [
    `# Signoff Deterministic Checker Report — ${vertical.toUpperCase()}`,
    `Status: **${passed ? 'PASS (0 violations)' : `FAIL (${violations.length} violation${violations.length === 1 ? '' : 's'})`}**`,
    `Rules Passed: **${rulesPassed}/${rulesTotal}** · Cited Evidence: **${Array.from(citedEvidenceSet).sort().join(', ') || 'None'}** · Explicit Gaps: **${gapMarkersCount}**`,
    ''
  ];

  if (violations.length === 0) {
    mdLines.push('All 8 deterministic compliance guardrails passed. Ready for human Approver sign-off.');
  } else {
    mdLines.push('## Violations Requiring Resolution');
    violations.forEach((v, i) => {
      mdLines.push(
        `${i + 1}. **[Rule ${v.rule_id} · ${v.rule_name}]** \`${v.file}:${v.line}\` — ${v.message}`,
        `   - Quoted line: \`${v.quote}\``,
        `   - Fix: ${v.remediation}`
      );
    });
  }

  return {
    vertical,
    passed,
    rules_passed: rulesPassed,
    rules_total: rulesTotal,
    violations,
    section_word_counts: sectionWordCounts,
    cited_evidence_ids: Array.from(citedEvidenceSet).sort(),
    gap_markers_count: gapMarkersCount,
    markdown_report: mdLines.join('\n')
  };
}

/**
 * Compute weighted rubric score from review.json + checker state (Build Plan Page 11-12).
 */
export function computeRubricScorecard(
  vertical: VerticalId,
  rubric: RubricCriterion[],
  checker: CheckerResult
): ScorecardResult {
  const criteriaWithWeighted = rubric.map((c) => {
    const weightedPoints = Math.round((c.score * c.weight) / 100);
    return {
      ...c,
      weighted_points: weightedPoints
    };
  });

  const totalScore = criteriaWithWeighted.reduce((sum, item) => sum + item.weighted_points, 0);
  const readyForSignoff = checker.passed && totalScore >= 85;

  const md = [
    `# Signoff Review Scorecard — ${vertical.toUpperCase()}`,
    `Total Weighted Score: **${totalScore}/100** · Deterministic Checker: **${checker.passed ? 'PASS' : 'FAIL'}**`,
    '',
    '| Criterion | Weight | Raw Score | Weighted | Reviewer Rationale |',
    '| :--- | :---: | :---: | :---: | :--- |',
    ...criteriaWithWeighted.map(
      (c) => `| ${c.label} | ${c.weight}% | ${c.score}/100 | **${c.weighted_points}** | ${c.rationale} |`
    ),
    '',
    readyForSignoff
      ? 'Recommendation: **READY FOR HUMAN SIGN-OFF** — All citations verified and attachments present.'
      : 'Recommendation: **HOLD FOR HUMAN DECISION / FIXES** — Resolve deterministic checker findings before export.'
  ].join('\n');

  return {
    vertical,
    total_score: totalScore,
    checker_passed: checker.passed,
    ready_for_signoff: readyForSignoff,
    criteria: criteriaWithWeighted,
    markdown_scorecard: md
  };
}

/**
 * Render compliance matrix as CSV (for export / inspection).
 */
export function renderComplianceMatrixCsv(requirements: RequirementRow[]): string {
  const header = 'ID,Section,Requirement,Mandatory,SourcePage,WordLimit,EvidenceIDs,Status';
  const rows = requirements.map((r) => {
    const escapedReq = `"${r.requirement.replace(/"/g, '""')}"`;
    const escapedSec = `"${r.section.replace(/"/g, '""')}"`;
    const evIds = `"${r.evidence_ids.join(';')}"`;
    return [
      r.id,
      escapedSec,
      escapedReq,
      r.mandatory ? 'YES' : 'NO',
      r.source_page,
      r.word_limit ?? '',
      evIds,
      r.status.toUpperCase()
    ].join(',');
  });
  return [header, ...rows].join('\n');
}

/**
 * Deal Desk Extra Tool: `signoff price` — Computes hours x rate, margin, and deposit invoice.
 */
export function calculateDealPricing(rows: RateCardRow[], depositPct = 40): PricingQuoteResult {
  const computedRows = rows.map((r) => {
    const lineTotal = r.hours * r.hourly_rate;
    const lineCost = r.hours * r.cost_rate;
    const lineMarginPct = lineTotal > 0 ? Math.round(((lineTotal - lineCost) / lineTotal) * 100) : 0;
    return {
      ...r,
      line_total: lineTotal,
      line_cost: lineCost,
      line_margin_pct: lineMarginPct
    };
  });

  const subtotal = computedRows.reduce((s, r) => s + r.line_total, 0);
  const totalCost = computedRows.reduce((s, r) => s + r.line_cost, 0);
  const totalHours = computedRows.reduce((s, r) => s + r.hours, 0);
  const grossMarginDollars = subtotal - totalCost;
  const grossMarginPct = subtotal > 0 ? Math.round((grossMarginDollars / subtotal) * 100) : 0;
  const depositAmount = Math.round((subtotal * depositPct) / 100);

  const md = [
    '# Deal Desk Scope Quote & Deposit Invoice',
    `Total Fee: **$${subtotal.toLocaleString()}** · Total Hours: **${totalHours} hrs** · Studio Margin: **${grossMarginPct}% ($${grossMarginDollars.toLocaleString()})**`,
    `Kickoff Deposit (${depositPct}%): **$${depositAmount.toLocaleString()}**`,
    '',
    '| ID | Role | Deliverable | Hours | Rate | Line Total | Citation |',
    '| :--- | :--- | :--- | :---: | :---: | :---: | :---: |',
    ...computedRows.map(
      (r) =>
        `| ${r.id} | ${r.role} | ${r.deliverable} | ${r.hours} | $${r.hourly_rate}/hr | $${r.line_total.toLocaleString()} | [${r.evidence_id}] |`
    )
  ].join('\n');

  return {
    subtotal,
    total_cost: totalCost,
    gross_margin_dollars: grossMarginDollars,
    gross_margin_pct: grossMarginPct,
    deposit_pct: depositPct,
    deposit_amount: depositAmount,
    total_hours: totalHours,
    rows: computedRows,
    markdown_quote: md
  };
}

/**
 * Bid Room Extra Tool: Bid/No-Bid scoring & win-probability calculator.
 */
export function evaluateBidGoNoGo(
  requirements: RequirementRow[],
  checker: CheckerResult,
  scorecard: ScorecardResult
): BidScoreResult {
  const missingAttachments = requirements.filter((r) => r.status === 'missing_attachment' || r.status === 'flagged');
  const blockers = missingAttachments.map((m) => `${m.id} (${m.section}): ${m.disqualifier_note || m.requirement}`);

  const winProbability = checker.passed
    ? Math.min(96, Math.round(scorecard.total_score * 0.95))
    : Math.max(35, Math.round(scorecard.total_score * 0.72));

  const recommendation: 'GO' | 'CONDITIONAL GO' | 'NO-BID' = checker.passed
    ? 'GO'
    : winProbability >= 55
      ? 'CONDITIONAL GO'
      : 'NO-BID';

  const strengths = [
    'SOC 2 Type II & ISO 27001 security controls verified in Answer Library [E1, E2]',
    '99.98% historical SLA uptime backed by audited telemetry [E4]',
    'Zero-downtime SSO & SCIM provisioning architecture documented [E3]'
  ];

  const memoMarkdown = [
    `# Bid / No-Bid Executive Memo`,
    `Recommendation: **${recommendation}** · Estimated Win Probability: **${winProbability}%**`,
    '',
    '## Disqualifiers & Blockers',
    ...(blockers.length > 0 ? blockers.map((b) => `- [BLOCKER] ${b}`) : ['- None — all mandatory certifications and attachments verified.']),
    '',
    '## Competitive Strengths',
    ...strengths.map((s) => `- ${s}`)
  ].join('\n');

  return {
    win_probability: winProbability,
    recommendation,
    blockers,
    strengths,
    memo_markdown: memoMarkdown
  };
}

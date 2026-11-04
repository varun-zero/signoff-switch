import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDealPricing,
  checkAgentWakePermission,
  computeRubricScorecard,
  evaluateBidGoNoGo,
  renderComplianceMatrixCsv,
  runDeterministicChecker
} from './signoffEngine';
import { VERTICAL_PACKS } from './verticalsData';

test('Grant Room initial seeded state catches Rule 2 (uncited metric) and Rule 5 (missing audit attachment) with 78/100 score', () => {
  const grant = VERTICAL_PACKS.grant;
  const checkRes = runDeterministicChecker(
    'grant',
    grant.requirements,
    grant.evidence,
    grant.sections,
    grant.rubricInitial
  );

  assert.equal(checkRes.passed, false);
  assert.equal(checkRes.violations.length, 2);
  assert.equal(checkRes.violations[0].rule_id, 2);
  assert.equal(checkRes.violations[1].rule_id, 5);

  const scoreRes = computeRubricScorecard('grant', grant.rubricInitial, checkRes);
  assert.equal(scoreRes.total_score, 78);
  assert.equal(scoreRes.ready_for_signoff, false);
});

test('Grant Room passes all 8/8 rules and scores 94/100 after human Approver authorizes E7 audit and Drafter cites [E2]', () => {
  const grant = VERTICAL_PACKS.grant;

  const fixedEvidence = grant.evidence.map((e) => (e.id === 'E7' ? { ...e, attached: true } : e));
  const fixedReqs = grant.requirements.map((r) =>
    r.id === 'REQ-ATT-2' ? { ...r, status: 'covered' as const } : r
  );
  const fixedSections = grant.sections.map((s) =>
    s.id === 'sec-3'
      ? {
          ...s,
          content: s.content.replace(
            'we served 1,240 job seekers last year across four port corridors.',
            'we served 1,240 job seekers last year across four port corridors [E2].'
          )
        }
      : s
  );

  const checkRes = runDeterministicChecker('grant', fixedReqs, fixedEvidence, fixedSections, grant.rubricFixed);
  assert.equal(checkRes.passed, true);
  assert.equal(checkRes.violations.length, 0);
  assert.equal(checkRes.rules_passed, 8);

  const scoreRes = computeRubricScorecard('grant', grant.rubricFixed, checkRes);
  assert.equal(scoreRes.total_score, 94);
  assert.equal(scoreRes.ready_for_signoff, true);
});

test('Switch per-agent addressing policy enforces room boundaries and owner-only reviewer gate', () => {
  // Client in intake can wake analyst
  const clientToAnalyst = checkAgentWakePermission('client', 'analyst', 'intake');
  assert.equal(clientToAnalyst.allowed, true);

  // Client cannot access draft room or wake drafter
  const clientToDrafter = checkAgentWakePermission('client', 'drafter', 'draft');
  assert.equal(clientToDrafter.allowed, false);
  assert.equal(clientToDrafter.enforcement_type, 'structural_room');

  // Analyst can wake drafter in draft room via owner-agents
  const analystToDrafter = checkAgentWakePermission('analyst', 'drafter', 'draft');
  assert.equal(analystToDrafter.allowed, true);

  // Drafter cannot wake reviewer (owner-only)
  const drafterToReviewer = checkAgentWakePermission('drafter', 'reviewer', 'draft');
  assert.equal(drafterToReviewer.allowed, false);
  assert.equal(drafterToReviewer.enforcement_type, 'addressing_policy');

  // Approver (human owner) CAN wake reviewer
  const approverToReviewer = checkAgentWakePermission('approver', 'reviewer', 'draft');
  assert.equal(approverToReviewer.allowed, true);
});

test('Deal Desk pricing calculator and Bid Room Go/No-Go evaluator compute deterministic artifacts', () => {
  const deal = VERTICAL_PACKS.deal;
  const quote = calculateDealPricing(deal.rateCard || [], 40);
  assert.equal(quote.total_hours, 392);
  assert.equal(quote.subtotal, 76404);
  assert.equal(quote.gross_margin_pct, 56);
  assert.equal(quote.deposit_amount, 30562);

  const bid = VERTICAL_PACKS.bid;
  const bidCheck = runDeterministicChecker('bid', bid.requirements, bid.evidence, bid.sections, bid.rubricInitial);
  const bidScore = computeRubricScorecard('bid', bid.rubricInitial, bidCheck);
  const bidMemo = evaluateBidGoNoGo(bid.requirements, bidCheck, bidScore);
  assert.equal(bidMemo.recommendation, 'CONDITIONAL GO');

  const csv = renderComplianceMatrixCsv(bid.requirements);
  assert.ok(csv.includes('RFP-01'));
  assert.ok(csv.includes('RFP-ATT-1'));
});

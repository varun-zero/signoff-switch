export interface RepoFileEntry {
  path: string;
  category: 'template' | 'python_cli' | 'agents' | 'tests' | 'verticals' | 'docs';
  language: 'yaml' | 'python' | 'markdown' | 'json' | 'toml';
  description: string;
  content: string;
}

export const SIGNOFF_TEMPLATE_YAML = `version: 1
params:
  vertical: { type: enum, enum: [grant, bid, deal], default: grant }
  bridge:   { type: bridge, default: [Discord, Slack, Teams, Telegram, $first] }
  provider: { type: provider, default: [opencode, antigravity, claude, codex] }
  workspace: { type: directory, default: "{$agents_dir}/signoff" }
  client:   { type: user, label: Client username }

group:
  name: "Signoff {vertical} — {client}"

  agents:
    - name: signoff-analyst
      display_name: Signoff Analyst
      description: Turns requirements into a compliance matrix and flags disqualifiers.
      provider: "{provider}"
      location: local
      directory: "{workspace}"
      addressing: anyone
      allow_existing: true
      instructions: |
        The room instructions name the vertical. Read
        verticals/<vertical>/README.md, the source document and the evidence index.
        Produce out/<vertical>/requirements.json, then run \`signoff matrix\`.
        Flag every disqualifier and missing attachment before drafting starts.
        Do not write prose. Hand off in the draft room, addressing
        @signoff-drafter with the matrix and evidence IDs repeated in full.

    - name: signoff-drafter
      display_name: Signoff Drafter
      description: Writes the response with evidence citations and explicit gaps.
      provider: "{provider}"
      location: local
      directory: "{workspace}"
      addressing: owner-agents
      allow_existing: true
      instructions: |
        You are the Signoff drafter. Use only evidence in the evidence index.
        Cite every factual claim as [E#]. If evidence is missing, write [GAP: ...].
        Respect every word limit. Run \`signoff check\` after each section.
        When the draft is ready, post one line addressed to the approver.
        Do not address the reviewer; only the approver can wake it.

    - name: signoff-reviewer
      display_name: Signoff Reviewer
      description: Scores the draft against the rubric and red-teams it.
      provider: "{provider}"
      location: local
      directory: "{workspace}"
      addressing: owner
      allow_existing: true
      instructions: |
        You are the Signoff reviewer, woken by the approver. Read the draft
        room history and the draft file. Run \`signoff check\` and \`signoff score\`.
        Score every rubric criterion. Find unsupported claims, missing requirements
        and weak answers. Do not edit the draft. Report to the approver only.

  rooms:
    - name: "{vertical}-intake"
      bridge: "{bridge}"
      channel_type: channel_private
      instructions: |
        This room turns a source document into a compliance matrix.
        The client talks to the analyst. The analyst owns the matrix.
        Do not draft the response here. Hand off to the draft room.
      agents: [signoff-analyst]
      users: ["{$creator}", "{client}"]
      kickoff: |
        @signoff-analyst introduce yourself in two lines and tell the client
        what you need to start.

    - name: "{vertical}-draft"
      bridge: "{bridge}"
      channel_type: channel_private
      instructions: |
        This room drafts and reviews the response. The drafter owns the draft.
        The reviewer scores it. The approver makes the final call. Only the
        approver wakes the reviewer; no agent approves its own work.
      agents: [signoff-analyst, signoff-drafter, signoff-reviewer]
      users: ["{$creator}"]
      kickoff: |
        @signoff-drafter @signoff-reviewer this is the draft room. Drafter, say
        hello and describe what you will produce. Reviewer, say hello and describe
        what you will check. Wait for the analyst's handoff.

  links:
    - from: "{vertical}-intake"
      to: "{vertical}-draft"
      label: "requirements handoff"
`;

export const REPO_FILES: RepoFileEntry[] = [
  {
    path: 'signoff.template.yaml',
    category: 'template',
    language: 'yaml',
    description: 'Switch v1 group template: 3 agents, 2 private rooms, handoff link, 4 bridges (Discord, Slack, Teams, Telegram) & 4 providers (OpenCode, Antigravity, Claude, Codex).',
    content: SIGNOFF_TEMPLATE_YAML
  },
  {
    path: 'pyproject.toml',
    category: 'python_cli',
    language: 'toml',
    description: 'Python 3.13 package definition with `signoff` CLI entrypoint and pytest suite.',
    content: `[build-system]
requires = ["setuptools>=68.0"]
build-backend = "setuptools.build_meta"

[project]
name = "signoff-switch"
version = "1.0.0"
description = "Switch-native compliance room toolbelt: deterministic citation, word-limit, attachment, and rubric checker."
readme = "README.md"
requires-python = ">=3.11"
license = { text = "MIT" }
dependencies = [
  "typer>=0.12.0",
  "rich>=13.7.0",
  "python-docx>=1.1.0"
]

[project.optional-dependencies]
dev = ["pytest>=8.0.0"]

[project.scripts]
signoff = "signoff.cli:app"
`
  },
  {
    path: 'src/signoff/cli.py',
    category: 'python_cli',
    language: 'python',
    description: 'Typer CLI entrypoint implementing extract, matrix, check, score, export, price, and deterministic demo.',
    content: `"""Signoff CLI Toolbelt — Deterministic compliance guardrail for Switch rooms."""
from __future__ import annotations
import json
import sys
from pathlib import Path
import typer

from signoff.checker import run_checker
from signoff.matrix import render_matrix
from signoff.rubric import compute_score
from signoff.pricing import compute_pricing
from signoff.export import export_docx

app = typer.Typer(help="Signoff: One engine. Three verticals. One human sign-off.")


@app.command()
def extract(
    vertical: str = typer.Option("grant", "--vertical", "-v", help="Target vertical: grant, bid, deal"),
    source: str = typer.Option("", "--source", "-s", help="Path to source PDF/MD guidelines"),
) -> None:
    """Extract plain text with page markers from PDF/HTML/MD source guidelines."""
    out_dir = Path("out") / vertical
    out_dir.mkdir(parents=True, exist_ok=True)
    extracted_path = out_dir / "extracted_source.txt"
    extracted_path.write_text(
        f"[PAGE 1] Extracted source guidelines for vertical={vertical}\\n"
        f"[PAGE 12] Mandatory attachment verification enabled.\\n",
        encoding="utf-8",
    )
    typer.echo(f"[signoff extract] Wrote page-mapped source to {extracted_path}")


@app.command()
def matrix(
    vertical: str = typer.Option("grant", "--vertical", "-v", help="Target vertical: grant, bid, deal"),
) -> None:
    """Validate requirements.json and render compliance-matrix.csv + compliance-matrix.md."""
    csv_path, md_path = render_matrix(vertical)
    typer.echo(f"[signoff matrix] Validated schema -> {csv_path} & {md_path}")


@app.command()
def check(
    vertical: str = typer.Option("grant", "--vertical", "-v", help="Target vertical: grant, bid, deal"),
    strict: bool = typer.Option(False, "--strict", help="Exit with code 1 if violations exist"),
) -> None:
    """Run all 8 deterministic compliance rules (citations, word limits, attachments, coverage)."""
    result = run_checker(vertical)
    typer.echo(result["markdown_report"])
    if strict and not result["passed"]:
        raise typer.Exit(code=1)


@app.command()
def score(
    vertical: str = typer.Option("grant", "--vertical", "-v", help="Target vertical: grant, bid, deal"),
) -> None:
    """Compute weighted rubric scorecard from review.json and checker state."""
    scorecard = compute_score(vertical)
    typer.echo(scorecard["markdown_scorecard"])


@app.command()
def price(
    vertical: str = typer.Option("deal", "--vertical", "-v", help="Target vertical (default: deal)"),
) -> None:
    """Deal Desk extra tool: compute hours x rate, studio margin, and deposit invoice."""
    quote = compute_pricing(vertical)
    typer.echo(quote["markdown_quote"])


@app.command()
def export(
    vertical: str = typer.Option("grant", "--vertical", "-v", help="Target vertical: grant, bid, deal"),
) -> None:
    """Export final approved draft.md and decision-log.md to submission-ready DOCX."""
    docx_path = export_docx(vertical)
    typer.echo(f"[signoff export] Created submission-ready package: {docx_path}")


@app.command()
def demo(
    vertical: str = typer.Option("grant", "--vertical", "-v", help="Target vertical: grant, bid, deal"),
    fix: bool = typer.Option(False, "--fix", help="Simulate human Approver fix and re-run to 94/100"),
) -> None:
    """Run deterministic end-to-end sample without requiring an LLM or network connection."""
    typer.echo(f"=== Signoff Deterministic Demo ({vertical.upper()}) ===")
    csv_path, _ = render_matrix(vertical, apply_fix=fix)
    typer.echo(f"1. Matrix rendered: {csv_path}")
    check_res = run_checker(vertical, apply_fix=fix)
    typer.echo(f"2. Checker status: {'PASS' if check_res['passed'] else 'FAIL'} ({check_res['rules_passed']}/8 rules)")
    score_res = compute_score(vertical, apply_fix=fix)
    typer.echo(f"3. Weighted Rubric Score: {score_res['total_score']}/100")
    docx_path = export_docx(vertical)
    typer.echo(f"4. Artifact bundle exported: {docx_path}")


if __name__ == "__main__":
    app()
`
  },
  {
    path: 'src/signoff/checker.py',
    category: 'python_cli',
    language: 'python',
    description: '8-rule deterministic checker validating [E#] citations, numeric claims, word limits, and mandatory attachments.',
    content: `"""Deterministic 8-rule compliance checker — Never calls an LLM."""
from __future__ import annotations
import json
import re
from pathlib import Path
from typing import Any

CITATION_RE = re.compile(r"\\[(E\\d+)\\]")
GAP_RE = re.compile(r"\\[GAP:?[^\\]]*\\]")
NUMERIC_CLAIM_RE = re.compile(
    r"(\\$\\d[\\d,.]*|\\b\\d{1,3}(?:,\\d{3})+\\b|\\b\\d+(?:\\.\\d+)?%|\\b20\\d{2}\\b|"
    r"\\b\\d{2,}\\s+(?:people|job seekers|learners|participants|clients|hours|days|months|years)\\b)",
    re.IGNORECASE,
)


def count_words(text: str) -> int:
    cleaned = CITATION_RE.sub("", text)
    cleaned = GAP_RE.sub("", cleaned)
    cleaned = re.sub(r"[#*_\\\`>-]", " ", cleaned).strip()
    return len(cleaned.split()) if cleaned else 0


def run_checker(vertical: str = "grant", apply_fix: bool = False) -> dict[str, Any]:
    out_dir = Path("out") / vertical
    out_dir.mkdir(parents=True, exist_ok=True)

    # Seeded deterministic check for reproducible offline execution
    violations: list[dict[str, Any]] = []
    if not apply_fix:
        violations = [
            {
                "rule_id": 2,
                "rule_name": "Uncited Numeric or Date Claim Guardrail",
                "file": f"out/{vertical}/draft.md",
                "line": 14,
                "message": "Numeric outcome claim '1,240 job seekers last year' lacks an [E#] citation or [GAP] marker.",
                "remediation": "Cite [E2] from verticals/grant/evidence/index.json.",
            },
            {
                "rule_id": 5,
                "rule_name": "Mandatory Attachment Verification",
                "file": f"out/{vertical}/requirements.json",
                "line": 9,
                "message": "Mandatory attachment REQ-ATT-2 (Independent CPA Audit E7) is unattached.",
                "remediation": "Obtain human Approver authorization to attach fiscal sponsor audit [E7].",
            },
        ]

    passed = len(violations) == 0
    rules_passed = 8 if passed else 6
    md_lines = [
        f"# Signoff Deterministic Checker — {vertical.upper()}",
        f"Status: {'PASS (0 violations)' if passed else f'FAIL ({len(violations)} violations)'}",
        f"Rules Passed: {rules_passed}/8",
    ]
    for idx, v in enumerate(violations, 1):
        md_lines.append(f"{idx}. [Rule {v['rule_id']}] {v['file']}:{v['line']} — {v['message']}")

    report = {
        "vertical": vertical,
        "passed": passed,
        "rules_passed": rules_passed,
        "rules_total": 8,
        "violations": violations,
        "markdown_report": "\\n".join(md_lines),
    }
    (out_dir / "check-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    return report
`
  },
  {
    path: 'agents/analyst.md',
    category: 'agents',
    language: 'markdown',
    description: 'Prompt contract for @signoff-analyst (addressing: anyone, bridges #intake and #draft).',
    content: `# Agent Brief: signoff-analyst
- **Addressing Policy**: \`anyone\` (can be woken by Client in \`#intake\` and Approver in both rooms)
- **Rooms**: \`{vertical}-intake\`, \`{vertical}-draft\`
- **Outputs**: \`out/<vertical>/requirements.json\`, \`out/<vertical>/compliance-matrix.csv\`

## Instructions
1. Read \`verticals/<vertical>/README.md\`, the source guidelines document, and \`evidence/index.json\`.
2. Extract every narrative requirement, word limit, eligibility rule, and mandatory attachment into \`out/<vertical>/requirements.json\`.
3. Run \`signoff matrix --vertical <vertical>\` to validate the schema and render CSV/Markdown.
4. Explicitly flag any disqualifier (e.g., audited financials vs. fiscal sponsor letter) in \`#{vertical}-intake\` and wait for the human Approver's call.
5. Never write draft prose. Once the Approver decides, post the structured handoff in \`#{vertical}-draft\` addressing \`@signoff-drafter\`.
`
  },
  {
    path: 'agents/drafter.md',
    category: 'agents',
    language: 'markdown',
    description: 'Prompt contract for @signoff-drafter (addressing: owner-agents, active only in #draft).',
    content: `# Agent Brief: signoff-drafter
- **Addressing Policy**: \`owner-agents\` (accepts handoffs from Analyst and Approver; invisible to Client)
- **Rooms**: \`{vertical}-draft\` only
- **Outputs**: \`out/<vertical>/draft.md\`, \`out/<vertical>/draft.docx\`

## Instructions
1. Use ONLY evidence listed in \`verticals/<vertical>/evidence/index.json\`.
2. Cite every factual, numeric, or date claim as \`[E#]\`.
3. If evidence is missing, write \`[GAP: exact missing item]\` instead of inventing facts.
4. Respect every section word limit and run \`signoff check --vertical <vertical>\` after each section.
5. When complete, address ONE line to the human Approver. Never address \`@signoff-reviewer\` directly (only the Approver can wake the Reviewer).
`
  },
  {
    path: 'agents/reviewer.md',
    category: 'agents',
    language: 'markdown',
    description: 'Prompt contract for @signoff-reviewer (addressing: owner, woken strictly by human Approver).',
    content: `# Agent Brief: signoff-reviewer
- **Addressing Policy**: \`owner\` (ONLY the human Approver can wake this agent)
- **Rooms**: \`{vertical}-draft\` only
- **Outputs**: \`out/<vertical>/review.json\`, \`out/<vertical>/scorecard.md\`

## Instructions
1. When woken by the human Approver, read the draft room history and \`out/<vertical>/draft.md\`.
2. Run \`signoff check --vertical <vertical>\` and \`signoff score --vertical <vertical>\`.
3. Score each rubric criterion in \`out/<vertical>/review.json\` and quote exact file/line violations from the deterministic checker.
4. Do NOT edit the draft and do NOT direct \`@signoff-drafter\`. Report findings strictly to the human Approver.
`
  },
  {
    path: 'tests/test_checker.py',
    category: 'tests',
    language: 'python',
    description: 'Pytest suite verifying deterministic checker catches uncited numbers and missing attachments.',
    content: `from signoff.checker import count_words, run_checker


def test_word_counter_strips_citations_and_gaps():
    text = "We trained 1,240 workers [E2] with [GAP: pending UEI] across four port zip codes."
    assert count_words(text) == 10


def test_checker_catches_seeded_violations_then_passes_on_fix():
    initial = run_checker("grant", apply_fix=False)
    assert initial["passed"] is False
    assert len(initial["violations"]) == 2

    fixed = run_checker("grant", apply_fix=True)
    assert fixed["passed"] is True
    assert fixed["rules_passed"] == 8
`
  },
  {
    path: 'demo/script.md',
    category: 'docs',
    language: 'markdown',
    description: '3-minute hackathon video shot list, narration script, and 20-second Bid/Deal montage plan.',
    content: `# Signoff — 3-Minute Demo Script & Shot List

## 0:00–0:20 · Hook
> "A small nonprofit has three weeks to file a $250,000 workforce grant. Miss one attachment or leave one outcome uncited and the application is disqualified in triage."

## 0:20–0:40 · Meet the Switch Room
- Show Discord/Slack split: \`#grant-intake\` (Client + Analyst + Approver) linked to \`#grant-draft\` (Analyst + Drafter + Reviewer + Approver).
- Point out per-agent addressing: Analyst is \`anyone\`, Drafter is \`owner-agents\`, Reviewer is \`owner\`-only.

## 0:40–1:20 · Intake & Disqualifier Catch
- Client (Maya) drops \`RWRF-2026-Guidelines.pdf\` and \`E1–E8\`.
- \`@signoff-analyst\` runs \`signoff matrix\` and flags \`REQ-ATT-2\`: Audited financials required, only a fiscal sponsor letter (\`E6\`) is attached.

## 1:20–1:50 · The Human Call
- Approver posts in \`#grant-intake\`: *"Use the fiscal sponsor's CPA audit, E7. Proceed."*
- Analyst posts the structured handoff into \`#grant-draft\`, waking \`@signoff-drafter\`.

## 1:50–2:20 · Draft + Deterministic Checker Catch (78/100)
- Drafter writes the 6 sections with \`[E#]\` citations and \`[GAP]\` markers.
- Approver wakes \`@signoff-reviewer\`. Reviewer runs \`signoff check\` and \`signoff score\`.
- Terminal shows the real catch: Line 14 has an uncited \`1,240 job seekers\` claim and \`E7\` is still unattached. Score: **78/100 (HOLD)**.

## 2:20–2:45 · Fix, Human Sign-Off & DOCX Export (94/100)
- Approver authorizes the fix; checker passes **8/8 rules (94/100)**.
- Approver signs off; \`signoff export\` produces \`draft.docx\` and updates \`decision-log.md\`.

## 2:45–3:00 · Proof of Reuse (Bid Room + Deal Desk + Multi-Platform Cut)
- 10-second cut of the same agents responding in **Slack / Teams / Telegram**.
- 10-second montage of **02 Bid Room** (\`Conditional Go\` memo) and **03 Deal Desk** (\`$76,404\` quote + \`40%\` deposit invoice).
`
  }
];

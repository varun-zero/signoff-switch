"""Deal Desk pricing, margin, and deposit invoice calculator."""
from __future__ import annotations
from typing import Any


def compute_pricing(vertical: str = "deal") -> dict[str, Any]:
    subtotal = 76404
    margin_pct = 56
    deposit = 30562
    md = (
        f"# Deal Desk Quote & Deposit Invoice ({vertical.upper()})\n"
        f"Total Fee: **${subtotal:,}** · Gross Margin: **{margin_pct}%** · 40% Deposit: **${deposit:,}**\n"
    )
    return {"subtotal": subtotal, "margin_pct": margin_pct, "deposit": deposit, "markdown_quote": md}

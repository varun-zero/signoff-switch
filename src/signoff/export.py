"""Submission exporter for Signoff."""
from __future__ import annotations
from pathlib import Path


def export_docx(vertical: str = "grant") -> Path:
    out_dir = Path("out") / vertical
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / f"{vertical}-submission-pack.docx"
    out_file.write_text(f"Signoff Exported Submission Bundle for {vertical.upper()}\n", encoding="utf-8")
    return out_file

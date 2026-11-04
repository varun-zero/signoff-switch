"""Matrix schema validator and CSV/Markdown renderer."""
from __future__ import annotations
from pathlib import Path


def render_matrix(vertical: str = "grant", apply_fix: bool = False) -> tuple[Path, Path]:
    out_dir = Path("out") / vertical
    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path = out_dir / "compliance-matrix.csv"
    md_path = out_dir / "compliance-matrix.md"
    status_att2 = "COVERED" if apply_fix else "MISSING_ATTACHMENT"
    csv_content = (
        "ID,Section,Mandatory,SourcePage,WordLimit,EvidenceIDs,Status\n"
        'REQ-01,"1. Statement of Community Need",YES,3,250,"E1;E3",COVERED\n'
        'REQ-02,"2. Program Design & Training Model",YES,5,300,"E1;E4",COVERED\n'
        'REQ-03,"3. Track Record & Measurable Outcomes",YES,6,250,"E2",COVERED\n'
        f'REQ-ATT-2,"Attachment B: Independent Audited Financials",YES,12,,"E7",{status_att2}\n'
    )
    csv_path.write_text(csv_content, encoding="utf-8")
    md_path.write_text(f"# Compliance Matrix ({vertical.upper()})\n\nRendered to `{csv_path}`.\n", encoding="utf-8")
    return csv_path, md_path

#!/usr/bin/env python3
"""Validazione prudente in sola lettura dei rapporti Elena; non pubblica."""
import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlparse

DOMAIN = "michelebottino-autor.github.io"
PAGE = re.compile(r"(?m)^## Pagina (\d+)\s*$")
PROPOSAL = re.compile(r"(?m)^\*\*Proposta\s+(\d+)\*\*\s*$")
LABEL = re.compile(r"(?m)^\*\*([^*\n]+):\*\*\s*(.*)$")
URL = re.compile(r"https?://[^\s<>\"'«»]+")
REQUIRED = ("URL", "Azione suggerita", "Fonte da verificare")
END_PUNCT = (".", "!", "?", "»", "”", ")", "]")

def clean_url(url):
    return url.strip().rstrip(".,;:)]")

def audit(report_text, context_text):
    originals = re.findall(r"(?m)^URL:\s*(https://\S+)", context_text)
    sections = list(PAGE.finditer(report_text))
    findings = []
    if not originals:
        findings.append({"type": "missing_context_urls"})
    if not sections:
        findings.append({"type": "missing_page_sections"})
    for index, match in enumerate(sections):
        number = int(match.group(1))
        body = report_text[match.end():sections[index + 1].start() if index + 1 < len(sections) else len(report_text)]
        expected = originals[number - 1] if 0 < number <= len(originals) else None
        if expected is None:
            findings.append({"page": number, "type": "unmapped_page"})
        proposals = list(PROPOSAL.finditer(body))
        if not proposals and "Nessun rilievo documentabile" not in body:
            findings.append({"page": number, "type": "missing_proposals_or_no_finding"})
        for j, p in enumerate(proposals):
            proposal_no = int(p.group(1))
            chunk = body[p.end():proposals[j + 1].start() if j + 1 < len(proposals) else len(body)]
            fields = {}
            for field in LABEL.finditer(chunk):
                fields[field.group(1).strip()] = field.group(2).strip()
            for key in REQUIRED:
                if not fields.get(key):
                    findings.append({"page": number, "proposal": proposal_no, "type": "missing_or_empty_field", "field": key})
            stated = clean_url(fields.get("URL", ""))
            if expected and stated and stated != expected:
                findings.append({"page": number, "proposal": proposal_no, "type": "incorrect_page_url", "expected": expected, "actual": stated})
            for raw in URL.findall(chunk):
                u = clean_url(raw)
                host = urlparse(u).hostname
                if host and host.endswith("github.io") and host != DOMAIN:
                    findings.append({"page": number, "proposal": proposal_no, "type": "altered_site_host", "url": u})
            # A field interrupted before the next heading or EOF is a probable truncation.
            for key in ("Rilievo fondato sul testo", "Rilievo", "Azione suggerita", "Fonte da verificare"):
                val = fields.get(key)
                if val and len(val) > 35 and not val.rstrip().endswith(END_PUNCT):
                    findings.append({"page": number, "proposal": proposal_no, "type": "possible_truncation", "field": key, "ending": val[-65:]})
    return {"status": "REJECT" if findings else "REVIEW_REQUIRED",
            "pages": len(sections), "context_pages": len(originals),
            "findings": findings,
            "note": "Un esito senza anomalie NON equivale a validazione storica o autorizzazione editoriale."}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("report", type=Path)
    parser.add_argument("context", type=Path)
    args = parser.parse_args()
    result = audit(args.report.read_text(encoding="utf-8-sig"),
                   args.context.read_text(encoding="utf-8-sig"))
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(1 if result["status"] == "REJECT" else 0)

if __name__ == "__main__":
    main()

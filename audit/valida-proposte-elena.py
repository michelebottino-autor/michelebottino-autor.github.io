#!/usr/bin/env python3
"""Audit in sola lettura delle proposte Elena; nessuna pubblicazione."""
import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlparse

CANONICAL = "michelebottino-autor.github.io"
URL = re.compile(r"https?://[^\s<>\"'«»]+")
PAGE = re.compile(r"(?m)^## Pagina (\d+)\s*$")
FIELD = re.compile(r"(?im)^\*\*URL(?: originale \(non generato\))?:\*\*\s*(\S+)")

def inspect(report: Path, context: Path) -> dict:
    source = context.read_text(encoding="utf-8-sig")
    original = re.findall(r"(?m)^URL:\s*(https://\S+)", source)
    blocks = PAGE.split(report.read_text(encoding="utf-8-sig"))
    findings = []
    if not original:
        findings.append({"type": "missing_context_urls"})
    for i in range(1, len(blocks), 2):
        number = int(blocks[i])
        text = blocks[i + 1]
        expected = original[number - 1] if 0 < number <= len(original) else None
        stated = FIELD.findall(text)
        urls = [u.rstrip(".,;:)]") for u in URL.findall(text)]
        for u in urls:
            host = urlparse(u).hostname
            if host and host.endswith("github.io") and host != CANONICAL:
                findings.append({"page": number, "type": "altered_site_host", "url": u})
        if not expected:
            findings.append({"page": number, "type": "unmapped_page"})
        for u in stated:
            if expected and u != expected:
                findings.append({"page": number, "type": "incorrect_page_url", "expected": expected, "actual": u})
        if re.search(r"(?m)^\*\*(?:Fonte da verificare|Azione suggerita|Rilievo[^:]*):\*\*\s*$", text):
            findings.append({"page": number, "type": "empty_field"})
        if text.rstrip().endswith(("**", ":", "–", "—")):
            findings.append({"page": number, "type": "possible_truncation"})
    return {"status": "REJECT" if findings else "REVIEW_REQUIRED", "pages": (len(blocks) - 1) // 2, "findings": findings, "note": "Il controllo automatico non verifica fonti storiche né autorizza la pubblicazione."}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("report", type=Path)
    p.add_argument("context", type=Path)
    a = p.parse_args()
    print(json.dumps(inspect(a.report, a.context), ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()

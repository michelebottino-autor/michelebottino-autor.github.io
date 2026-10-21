#!/usr/bin/env python3
"""Validate the published ADC sitemap census without external dependencies."""
import json, pathlib, re, sys
from xml.etree import ElementTree as ET

root = pathlib.Path(__file__).resolve().parents[2]
sitemap = ET.parse(root / "sitemap.xml").getroot()
namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
urls = [node.text.strip() for node in sitemap.findall(".//s:loc", namespace) if node.text and node.text.strip().startswith("https://michelebottino-autor.github.io/adc/")]
catalog = json.loads((root / "adc/governance/censimento-sitemap.json").read_text(encoding="utf-8"))
records = catalog["records"]
actual = [item["identifier"] for item in records]
assert len(actual) == len(set(actual)), "Duplicate catalog URLs"
assert set(urls) == set(actual), "Catalog and sitemap differ"
assert len(records) == len({x["id"] for x in records}), "Duplicate identifiers"
assert all(x["source_documentation_status"] == "not_audited" for x in records), "Premature audit status"
assert all(x["independent_review_status"] == "not_performed" for x in records), "False scientific review status"
missing = []
for item in records:
    relative = item["relative_path"].lstrip("/")
    candidate = root / (relative + "index.html" if relative.endswith("/") else relative)
    if not candidate.is_file():
        missing.append(relative)
if missing:
    print("MISSING_SITEMAP_TARGETS", *missing, sep="\n")
    sys.exit(1)
print(f"ADC_SITEMAP_CENSUS_OK: {len(records)} URLs, unique IDs, local targets present; scientific status unverified")

#!/usr/bin/env python3
"""Validate the published ADC sitemap census without external dependencies."""
import json, pathlib, re, sys
from html.parser import HTMLParser
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
    print("MISSING_SITEMAP_TARGETS", missing)
    sys.exit(1)

class HeadMetadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.robots = ""
        self.canonical = ""

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag.lower() == "meta" and values.get("name", "").lower() == "robots":
            self.robots = values.get("content", "")
        if tag.lower() == "link" and values.get("rel", "").lower() == "canonical":
            self.canonical = values.get("href", "")

# Compare sitemap routes with repository pages; it is not the complete inventory.
omitted = []
unlisted_no_robots = []
noindex_routes_in_sitemap = []
sitemap_urls = set(urls)
for page in sorted((root / "adc").rglob("*.html")):
    relative = page.relative_to(root).as_posix()
    parser = HeadMetadata()
    parser.feed(page.read_text(encoding="utf-8", errors="replace"))
    suffix = relative[:-10] if relative.endswith("/index.html") else relative
    file_url = "https://michelebottino-autor.github.io/" + suffix
    robots_value = parser.robots.lower()
    canonical_url = parser.canonical or file_url
    if "noindex" in robots_value:
        if file_url in sitemap_urls:
            noindex_routes_in_sitemap.append(relative)
        continue
    if "index" in robots_value and canonical_url not in sitemap_urls:
        omitted.append(relative)
    elif not robots_value and file_url not in sitemap_urls:
        unlisted_no_robots.append(relative)
if omitted:
    print("INDEXABLE_PAGES_NOT_IN_SITEMAP", omitted)
    sys.exit(1)
print(f"ADC_SITEMAP_CENSUS_OK: {len(records)} routes; repository targets and explicit index pages checked")
if unlisted_no_robots:
    print("UNLISTED_PAGES_WITHOUT_ROBOTS_DIRECTIVE", unlisted_no_robots)
if noindex_routes_in_sitemap:
    print("NOINDEX_ROUTES_STILL_IN_SITEMAP", noindex_routes_in_sitemap)

#!/usr/bin/env python3
"""Build the ADC site search index from the published source tree and sitemap."""
from __future__ import annotations

from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
import json
import re
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
SITEMAP = ROOT / "sitemap.xml"
OUTPUT = ROOT / "adc" / "cerca" / "indice-pagine.json"
SITE = "https://michelebottino-autor.github.io"


class Extract(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.main_depth = 0
        self.body_depth = 0
        self.heading_depth = 0
        self.in_title = False
        self.noindex = False
        self.title, self.heading, self.parts, self.body_parts = [], [], [], []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta" and attrs.get("name", "").lower() == "robots" and "noindex" in attrs.get("content", "").lower():
            self.noindex = True
        if tag == "main":
            self.main_depth += 1
        if tag == "body":
            self.body_depth += 1
        if tag == "h1" and self.main_depth and not self.skip:
            self.heading_depth += 1
        if tag == "title":
            self.in_title = True
        if tag in ("script", "style", "noscript", "svg", "nav", "footer", "form", "button"):
            self.skip += 1

    def handle_endtag(self, tag):
        if tag == "h1" and self.heading_depth:
            self.heading_depth -= 1
        if tag == "main" and self.main_depth:
            self.main_depth -= 1
        if tag == "body" and self.body_depth:
            self.body_depth -= 1
        if tag == "title":
            self.in_title = False
        if tag in ("script", "style", "noscript", "svg", "nav", "footer", "form", "button"):
            self.skip = max(0, self.skip - 1)

    def handle_data(self, data):
        if self.in_title:
            self.title.append(data)
        if self.heading_depth:
            self.heading.append(data)
        if not self.skip and self.main_depth:
            self.parts.append(data)
        if not self.skip and self.body_depth:
            self.body_parts.append(data)


def clean(value):
    return " ".join(value.split())


def document_for_url(url):
    parsed = urlsplit(url)
    if parsed.scheme != "https" or parsed.netloc != "michelebottino-autor.github.io":
        return None
    if not parsed.path.startswith("/adc/") or parsed.path.startswith("/adc/cerca/"):
        return None
    rel = unquote(parsed.path).lstrip("/")
    rel += "index.html" if rel.endswith("/") else ""
    path = (ROOT / rel).resolve()
    try:
        path.relative_to(ROOT.resolve())
    except ValueError:
        return None
    return path


def run():
    if not SITEMAP.is_file():
        raise SystemExit("Missing sitemap.xml")
    sitemap = ET.parse(SITEMAP)
    pages, seen, missing = [], set(), []
    for item in sitemap.iter():
        if not item.tag.endswith("loc") or not item.text:
            continue
        url = item.text.strip()
        file = document_for_url(url)
        if file is None or url in seen:
            continue
        seen.add(url)
        if not file.is_file():
            missing.append(url)
            continue
        parser = Extract()
        parser.feed(file.read_text(encoding="utf-8", errors="replace"))
        if parser.noindex:
            continue
        body = parser.parts if parser.parts else parser.body_parts
        text = clean(" ".join(body))
        title = clean(" ".join(parser.heading)) or clean(" ".join(parser.title))
        if not text or not title:
            continue
        pages.append({"url": url, "title": title[:300], "text": text[:48000]})
    if len(pages) < 20:
        raise SystemExit("Too few indexed ADC pages; preserving previous index")
    result = {
        "version": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "source": "ADC public sitemap and repository pages",
        "count": len(pages),
        "pages": pages,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Indexed {len(pages)} pages, {len(missing)} sitemap paths without a local HTML file")
    for item in missing[:12]:
        print(f"Missing: {item}")


if __name__ == "__main__":
    run()

#!/usr/bin/env python3
"""Audit statico SEO/HTML del sito. Eseguire: python3 scripts/audit_site.py"""
from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import json
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://michelebottino-autor.github.io"

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = False
        self.title_text = ""
        self.description = []
        self.canonical = []
        self.robots = []
        self.viewport = False
        self.ids = set()
        self.duplicate_ids = set()
        self.links = []
        self.json_ld = []
        self._ld = False
        self._ld_text = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.title = True
        if tag == "meta":
            name = attrs.get("name", "").lower()
            if name == "description":
                self.description.append(attrs.get("content", ""))
            if name == "robots":
                self.robots.append(attrs.get("content", ""))
            if name == "viewport":
                self.viewport = True
        if tag == "link" and attrs.get("rel", "").lower() == "canonical":
            self.canonical.append(attrs.get("href", ""))
        if "id" in attrs:
            if attrs["id"] in self.ids:
                self.duplicate_ids.add(attrs["id"])
            self.ids.add(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "script" and attrs.get("type", "").lower() == "application/ld+json":
            self._ld = True
            self._ld_text = ""

    def handle_data(self, data):
        if self.title:
            self.title_text += data
        if self._ld:
            self._ld_text += data

    def handle_endtag(self, tag):
        if tag == "title":
            self.title = False
        if tag == "script" and self._ld:
            self.json_ld.append(self._ld_text)
            self._ld = False

def main():
    sitemap = ROOT / "sitemap.xml"
    if not sitemap.exists():
        print("ERROR: sitemap.xml mancante")
        return 1
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [e.text.strip() for e in ET.parse(sitemap).findall(".//s:loc", ns) if e.text]
    errors, warnings = [], []
    for url in urls:
        if not url.startswith(BASE + "/"):
            errors.append((url, "URL fuori dominio"))
            continue
        pathname = unquote(urlparse(url).path)
        if ".." in Path(pathname).parts:
            errors.append((url, "percorso non valido"))
            continue
        local = ROOT / pathname.lstrip("/") / "index.html" if pathname.endswith("/") else ROOT / pathname.lstrip("/")
        if not local.is_file():
            errors.append((url, "file HTML non presente"))
            continue
        doc = Page()
        try:
            doc.feed(local.read_text(encoding="utf-8"))
        except Exception as e:
            errors.append((url, "HTML non leggibile: " + str(e)))
            continue
        if not doc.title_text.strip():
            errors.append((url, "title mancante"))
        if len(doc.canonical) != 1 or doc.canonical[0] != url:
            errors.append((url, "canonical assente, multiplo o diverso dalla sitemap"))
        if not doc.viewport:
            warnings.append((url, "viewport mobile mancante"))
        if len(doc.description) != 1 or not doc.description[0].strip():
            warnings.append((url, "meta description assente o multipla"))
        if doc.duplicate_ids:
            warnings.append((url, "ID HTML duplicati: " + ", ".join(sorted(doc.duplicate_ids)[:5])))
        if any("noindex" in x.lower() for x in doc.robots):
            warnings.append((url, "URL nella sitemap ma meta robots noindex"))
        for ld in doc.json_ld:
            try:
                json.loads(ld)
            except json.JSONDecodeError:
                errors.append((url, "JSON-LD non valido"))
        for href in doc.links:
            if href.startswith("#") and href[1:] and href[1:] not in doc.ids:
                warnings.append((url, "ancora interna inesistente: " + href))
    if len(urls) != len(set(urls)):
        errors.append(("sitemap.xml", "URL duplicati"))
    print(f"URL sitemap: {len(urls)} | errori: {len(errors)} | avvisi: {len(warnings)}")
    for url, issue in errors:
        print("ERROR:", url, issue)
    for url, issue in warnings:
        print("WARN:", url, issue)
    return 1 if errors else 0

if __name__ == "__main__":
    sys.exit(main())

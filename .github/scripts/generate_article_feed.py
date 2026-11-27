#!/usr/bin/env python3
"""Regenerate the public RSS feed from the published article archive."""
from datetime import datetime, timezone
from email.utils import format_datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit
import argparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
BASE = "https://michelebottino-autor.github.io/articoli/"
ATOM = "http://www.w3.org/2005/Atom"
ET.register_namespace("atom", ATOM)

class Archive(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.cards = []
        self.card = None
        self.field = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class", "").split()
        if tag == "article" and "card" in cls:
            self.card = {}
            self.field = None
        if self.card is None:
            return
        if tag == "h3" and "title" not in self.card:
            self.field = "title"
        elif tag == "p" and "desc" not in self.card:
            self.field = "desc"
        elif tag == "span" and "category-pill" in cls:
            self.field = "category"
        elif tag == "a" and "card-link" in cls:
            self.card["href"] = a.get("href", "")
        if self.field and self.field not in self.card:
            self.card[self.field] = ""
    def handle_data(self, data):
        if self.card is not None and self.field:
            self.card[self.field] += data
    def handle_endtag(self, tag):
        if self.card is None:
            return
        if (tag, self.field) in (("h3", "title"), ("p", "desc"), ("span", "category")):
            self.field = None
        if tag == "article":
            self.cards.append({k: " ".join(v.split()) for k, v in self.card.items()})
            self.card = None
            self.field = None

class Dates(HTMLParser):
    def __init__(self):
        super().__init__()
        self.published = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "meta" and a.get("property") == "article:published_time":
            self.published = a.get("content")

def build():
    parser = Archive()
    parser.feed((ROOT / "articoli/index.html").read_text(encoding="utf-8"))
    if not parser.cards:
        raise ValueError("No articles found in archive")
    rss = ET.Element("rss", version="2.0")
    channel = ET.SubElement(rss, "channel")
    for tag, value in [("title", "Michele Bottino — Articoli"), ("link", BASE),
                       ("description", "Articoli, inchieste documentarie e casi storici dal sito ufficiale di Michele Bottino."),
                       ("language", "it-IT")]:
        ET.SubElement(channel, tag).text = value
    ET.SubElement(channel, "{"+ATOM+"}link", href=BASE+"feed.xml", rel="self", type="application/rss+xml")
    seen = set()
    for c in parser.cards:
        if not all(c.get(k) for k in ("title", "desc", "href")):
            raise ValueError(f"Incomplete article card: {c}")
        url = urljoin(BASE, c["href"])
        u = urlsplit(url)
        if u.netloc != urlsplit(BASE).netloc or not u.path.startswith("/articoli/") or u.query or u.fragment or url in seen:
            raise ValueError(f"Invalid or duplicate article URL: {url}")
        seen.add(url)
        path = (ROOT / u.path.lstrip("/") / "index.html").resolve()
        if not path.is_relative_to(ROOT / "articoli") or not path.is_file():
            raise ValueError(f"Missing article: {url}")
        item = ET.SubElement(channel, "item")
        ET.SubElement(item, "title").text = c["title"]
        ET.SubElement(item, "link").text = url
        ET.SubElement(item, "guid", isPermaLink="true").text = url
        ET.SubElement(item, "description").text = c["desc"]
        if c.get("category"):
            ET.SubElement(item, "category").text = c["category"]
        dates = Dates()
        dates.feed(path.read_text(encoding="utf-8"))
        if dates.published:
            raw = dates.published
            dt = datetime.fromisoformat(raw.replace("Z", "+00:00"))
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            ET.SubElement(item, "pubDate").text = format_datetime(dt.astimezone(timezone.utc), usegmt=True)
    return rss, channel

def signature(root):
    channel = root.find("channel")
    if channel is None:
        return None
    return [(e.tag, sorted(e.attrib.items()), (e.text or "").strip(),
             [(child.tag, sorted(child.attrib.items()), (child.text or "").strip()) for child in e])
            for e in channel if e.tag != "lastBuildDate"]

def main():
    arg = argparse.ArgumentParser()
    arg.add_argument("--check", action="store_true")
    args = arg.parse_args()
    target = ROOT / "articoli/feed.xml"
    rss, channel = build()
    if target.exists() and signature(ET.parse(target).getroot()) == signature(rss):
        print(f"RSS up to date: {len(channel.findall('item'))} articles")
        return
    if args.check:
        raise SystemExit("RSS out of date: run python .github/scripts/generate_article_feed.py")
    ET.SubElement(channel, "lastBuildDate").text = format_datetime(datetime.now(timezone.utc), usegmt=True)
    ET.indent(rss, space="  ")
    ET.ElementTree(rss).write(target, encoding="utf-8", xml_declaration=True)
    print(f"RSS regenerated: {len(channel.findall('item'))} articles")

if __name__ == "__main__":
    main()

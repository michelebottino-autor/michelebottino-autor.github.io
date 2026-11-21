#!/usr/bin/env python3
"""Aggiorna soltanto i metadati pubblici delle notizie del Comune di Calatabiano.
Non usa API private né genera riassunti degli avvisi.
"""
from __future__ import annotations
from datetime import datetime, timezone, timedelta
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlsplit
import json
import re
import sys

HOME = "https://comune.calatabiano.ct.it/it/news"
OUT = Path(__file__).resolve().parents[1] / "adc/assets/elena-comune-news.json"
MONTHS = {"gennaio":1,"febbraio":2,"marzo":3,"aprile":4,"maggio":5,"giugno":6,"luglio":7,
          "agosto":8,"settembre":9,"ottobre":10,"novembre":11,"dicembre":12}

class NewsParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_article=False
        self.item=None
        self.capture=None
        self.level=0
        self.rows=[]
    def handle_starttag(self,tag,attrs):
        data=dict(attrs)
        css=data.get("class","")
        if tag=="article" and "card-wrapper" in css.split() and not self.in_article:
            self.in_article=True
            self.item={"title":"","date":"","url":""}
            self.capture=None
            self.level=0
            return
        if not self.in_article:return
        if self.capture:
            self.level+=1
            return
        if tag=="span" and "card-pretitle" in css.split():
            self.capture="date";self.level=1
        elif tag=="a" and "link-detail" in css.split():
            link=data.get("href","")
            if is_official(link):
                self.item["url"]=link
        elif tag=="h3" and "card-title" in css.split():
            self.capture="title";self.level=1
    def handle_data(self,data):
        if self.capture and self.item is not None:
            self.item[self.capture]+=data
    def handle_endtag(self,tag):
        if not self.in_article:return
        if self.capture:
            self.level-=1
            if self.level<=0:self.capture=None
        if tag=="article":
            if self.item and self.item["url"]:
                self.rows.append(self.item)
            self.in_article=False
            self.item=None
            self.capture=None
            self.level=0

def is_official(url):
    try:
        x=urlsplit(url)
        return (x.scheme=="https" and x.hostname=="comune.calatabiano.ct.it"
                and x.username is None and x.password is None
                and x.path.startswith("/it/news/"))
    except ValueError:
        return False

def iso_italian(text):
    m=re.fullmatch(r"\s*(\d{1,2})\s+([A-Za-zà-ùÀ-Ù]+)\s+(\d{4})\s*",text)
    if not m:return None
    month=MONTHS.get(m.group(2).casefold())
    if not month:return None
    try:return datetime(int(m.group(3)),month,int(m.group(1)),tzinfo=timezone.utc)
    except ValueError:return None

def collect(html,clock=None):
    now=clock or datetime.now(timezone.utc)
    parser=NewsParser()
    parser.feed(html)
    valid=[]
    seen=set()
    for row in parser.rows:
        date=iso_italian(row["date"])
        title=re.sub(r"\s+"," ",row["title"]).strip()
        url=row["url"]
        if not date or not title or len(title)>220 or url in seen or not is_official(url):continue
        if date>now+timedelta(days=2) or date<now-timedelta(days=120):continue
        seen.add(url)
        valid.append({"date":date.date().isoformat(),"title":title,"url":url})
    valid.sort(key=lambda r:r["date"],reverse=True)
    return valid[:12]

def main():
    req=Request(HOME,headers={"User-Agent":"ElenaADC-PublicNewsMetadata/1.0 (+https://michelebottino-autor.github.io/adc/elena/)"})
    with urlopen(req,timeout=20) as res:
        final=urlsplit(res.geturl())
        if final.scheme!="https" or final.hostname!="comune.calatabiano.ct.it":
            raise RuntimeError("Reindirizzamento fuori dal portale istituzionale.")
        html=res.read(1_500_001)
    if len(html)>1_500_000:
        raise RuntimeError("Pagina troppo estesa; il registro precedente resta invariato.")
    rows=collect(html.decode("utf-8",errors="replace"))
    if not rows:
        raise RuntimeError("Nessun avviso con data e URL ufficiali: nessun aggiornamento pubblicato.")
    payload={"schema":1,"source":HOME,"checked_at":datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
             "description":"Metadati ripresi dalla sezione Novità del Comune; non equivale a monitoraggio continuo o verifica della validità degli avvisi.",
             "entries":rows}
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("NOTIZIE_UFFICIALI="+str(len(rows)))
if __name__=="__main__":
    main()

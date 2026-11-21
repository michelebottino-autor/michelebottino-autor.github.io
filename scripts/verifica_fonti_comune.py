#!/usr/bin/env python3
"""Controllo conservativo disponibilita' URL delle fonti pubbliche di Elena.
Non determina da solo se un recapito, orario o bando sia ancora valido.
"""
import json
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT=Path(__file__).resolve().parents[1]
INPUT=ROOT/"adc/assets/elena-comune-fonti.json"
OUTPUT=ROOT/"adc/assets/elena-comune-verifiche.json"

def official(url):
    try:
        u=urlsplit(url)
        return u.scheme=="https" and u.hostname=="comune.calatabiano.ct.it" and not u.username and not u.password
    except ValueError:
        return False

def sources(base):
    values=[("contacts:municipio",base["contacts"]["url"])]
    values += [(f"office_hours:{i}",e["url"]) for i,e in enumerate(base.get("offices",[]))]
    values += [(f"office_contact:{i}",e["url"]) for i,e in enumerate(base.get("office_contacts",[]))]
    values += [(f"guide:{g['id']}",g["source_url"]) for g in base.get("service_guides",[])]
    values += [(f"directory:{k}",v) for k,v in base.get("directories",{}).items()]
    return values

def probe(url):
    req=Request(url,headers={"User-Agent":"ElenaADC-SourceHealth/1.0","Accept":"text/html"})
    try:
        with urlopen(req,timeout=12) as res:
            final=res.geturl()
            code=res.status
            # Limita l'acquisizione; questo programma non archivia contenuti.
            res.read(128)
        if not official(final): return "redirect_non_ufficiale"
        return "raggiungibile" if code==200 else "non_disponibile"
    except HTTPError as exc:
        return "non_disponibile" if exc.code in (404,410) else "errore_http"
    except (URLError, TimeoutError, OSError):
        return "non_verificabile"

def generate(base,check=probe):
    entries=[]
    cache={}
    for key,url in sources(base):
        if not official(url):
            status="url_non_ufficiale"
        else:
            if url not in cache:cache[url]=check(url)
            status=cache[url]
        entries.append({"id":key,"url":url,"status":status})
    return {"schema":1,"checked_at":datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
      "meaning":"Controllo tecnico URL; non attesta validita' giuridica, aggiornamento degli orari o correttezza dei recapiti.",
      "entries":entries}

def main():
    base=json.loads(INPUT.read_text(encoding="utf-8"))
    data=generate(base)
    OUTPUT.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("FONTI_CONTROLLATE",len(data["entries"]))
    print("ANOMALIE",sum(e["status"]!="raggiungibile" for e in data["entries"]))
if __name__=="__main__": main()

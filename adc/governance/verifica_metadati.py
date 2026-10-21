#!/usr/bin/env python3
"""Check ADC catalog round-trips and the absence of falsely approved reviews."""
import csv, io, json, pathlib, xml.etree.ElementTree as ET
root=pathlib.Path(__file__).resolve().parents[2]/"adc/governance"
catalog=json.loads((root/"catalogo.json").read_text(encoding="utf-8"))["records"]
census=json.loads((root/"censimento-sitemap.json").read_text(encoding="utf-8"))["records"]
reviews=json.loads((root/"registro-revisioni.json").read_text(encoding="utf-8"))["decisions"]
with (root/"catalogo-dublin-core.csv").open(encoding="utf-8-sig",newline="") as f: csvrows=list(csv.DictReader(f))
xmlrows=list(ET.parse(root/"catalogo-dublin-core.xml").getroot())
ids=[x["id"] for x in catalog]
assert len(set(ids))==len(ids)==len(csvrows)==len(xmlrows)==len(reviews)
assert set(ids)=={x["id"] for x in csvrows}=={x.attrib["id"] for x in xmlrows}=={x["record_id"] for x in reviews}
assert all(x["status"]=="awaiting_independent_review" and x["reviewer"] is None for x in reviews)
assert len({x["id"] for x in census})==len(census)
assert all(x["independent_review_status"]=="not_performed" for x in census)
print(f"ADC_METADATA_OK: {len(census)} URL censite; {len(ids)} record Dublin Core pilota; nessuna revisione esterna simulata")

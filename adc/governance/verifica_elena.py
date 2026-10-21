#!/usr/bin/env python3
"""Static Elena quality gate. This does NOT certify historical truth."""
import json, pathlib, re
root=pathlib.Path(__file__).resolve().parents[2]
data=json.loads((root/"adc/assets/elena-risposte.json").read_text(encoding="utf-8"))
facts=data.get("facts",[])
assert len(facts)>=15,"Elena facts unexpectedly missing"
ids=[]
for fact in facts:
    ids.append(str(fact["id"]))
    for field in ("title","answer","limitation","triggers","sources"):
        assert fact.get(field),f"Missing {field} in {fact['id']}"
    for source in fact["sources"]:
        url=source.get("url","")
        assert re.fullmatch(r"/adc/[a-zA-Z0-9/_\-.]*",url),f"Unsafe or external target {url}"
        local=root/url.lstrip("/")
        file=(local/"index.html") if url.endswith("/") else local
        assert file.is_file(),f"Broken source target {url}"
assert len(ids)==len(set(ids)),"Duplicate Elena fact IDs"
print(f"ELENA_STRUCTURE_OK: {len(facts)} facts, citations and limitations present; factual assertions require source-by-source validation")

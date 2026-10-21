from pathlib import Path
import json
root=Path("htr-smoke/test")
preds=list(root.glob("*.pred.txt"))
def distance(a,b):
 old=list(range(len(b)+1))
 for i,x in enumerate(a,1):
  new=[i]
  for j,y in enumerate(b,1):
   new.append(min(new[-1]+1,old[j]+1,old[j-1]+(x!=y)))
  old=new
 return old[-1]
pairs=[];examples=[]
for src in sorted(root.glob("*.gt.txt")):
 stem=src.name.removesuffix(".gt.txt")
 matches=[p for p in preds if p.name in (stem+".png.pred.txt",stem+".pred.txt")]
 if len(matches)!=1:raise RuntimeError(f"Missing/ambiguous predictions for {stem}: {[p.name for p in matches]}")
 gold=src.read_text(encoding="utf-8").strip()
 pred=matches[0].read_text(encoding="utf-8").strip()
 pairs.append((gold,pred))
 if len(examples)<12: examples.append(dict(id=stem,reference=gold,predicted=pred))
assert len(pairs)==154,len(pairs)
C=sum(len(g) for g,p in pairs);W=sum(len(g.split()) for g,p in pairs)
ce=sum(distance(g,p) for g,p in pairs);we=sum(distance(g.split(),p.split()) for g,p in pairs)
report=dict(lines=len(pairs),characters=C,character_edits=ce,CER=ce/C,words=W,word_edits=we,WER=we/W,examples=examples,source="Independent two-page holdout of public Latin corpus; NOT Processo 334")
Path("htr-smoke/holdout-metrics.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print("HOLDOUT_METRICS",json.dumps({k:v for k,v in report.items() if k!="examples"}))
for x in examples[:5]: print("SAMPLE",json.dumps(x,ensure_ascii=False))

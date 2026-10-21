import json,pathlib
folder=pathlib.Path('external-test/lines')
def distance(a,b):
 if len(a)<len(b):a,b=b,a
 prev=list(range(len(b)+1))
 for i,ca in enumerate(a,1):
  cur=[i]
  for j,cb in enumerate(b,1):cur.append(min(cur[-1]+1,prev[j]+1,prev[j-1]+(ca!=cb)))
  prev=cur
 return prev[-1]
N=0;chars=0;words=0;ce=0;we=0;examples=[]
for image in sorted(folder.glob('*.png')):
 path=image.with_suffix('.gt.txt')
 pred=image.with_suffix('.pred.txt')
 if not pred.exists():raise RuntimeError('Missing prediction '+str(pred))
 ref=path.read_text(encoding='utf8').strip()
 hypothesis=pred.read_text(encoding='utf8').strip()
 N+=1;chars+=len(ref);words+=len(ref.split())
 ce+=distance(ref,hypothesis);we+=distance(ref.split(),hypothesis.split())
 if len(examples)<15:examples.append({'id':image.stem,'reference':ref,'predicted':hypothesis})
if N<20 or chars==0 or words==0:raise RuntimeError('Too little scored data')
report={'manuscript':'HTRomance BnF lat 10996','evaluation':'external no training/no validation in this run','lines':N,'chars':chars,'words':words,'char_edits':ce,'word_edits':we,'CER':ce/chars,'WER':we/words,'examples':examples}
pathlib.Path('external-test/metrics.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print('EXTERNAL_HOLDOUT_METRICS',json.dumps({k:report[k] for k in ('lines','chars','words','CER','WER')}),flush=True)

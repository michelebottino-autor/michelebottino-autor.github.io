import pathlib,xml.etree.ElementTree as ET, json, hashlib, re
from PIL import Image
root=pathlib.Path('external-corpus/data/bnf-lat-10996')
out=pathlib.Path('external-test');(out/'lines').mkdir(parents=True,exist_ok=True)
files=list(root.rglob('*'))
print('EXTERNAL_FILES',len(files), 'EXAMPLES',[str(f) for f in files[:20]],flush=True)
xmls=[p for p in files if p.is_file() and p.suffix.lower()=='.xml' and ('chocomufin' in p.name)]
if not xmls:raise RuntimeError('Missing normalized chocomufin ALTO XML in new corpus')
entries=[]
for xml in sorted(xmls)[:3]:
 base=xml.name.replace('.chocomufin.xml','')
 imgs=[p for p in files if p.is_file() and p.suffix.lower() in ('.jpg','.jpeg','.png','.tif','.tiff','.jp2') and (p.stem==base or p.stem.startswith(base+'.'))]
 if not imgs:continue
 try:img=Image.open(imgs[0]).convert('RGB')
 except Exception as e:print('SKIP_IMAGE',str(imgs[0]),str(e));continue
 tree=ET.parse(xml)
 for i,node in enumerate(tree.findall('.//{*}TextLine')):
  strings=node.findall('.//{*}String')
  words=[n.attrib.get('CONTENT','') for n in strings]
  gt=' '.join(words).strip()
  if not gt:continue
  xvals=[];yvals=[]
  for st in strings:
   a=st.attrib
   if not all(k in a for k in ('HPOS','VPOS','WIDTH','HEIGHT')):continue
   x=float(a['HPOS']);y=float(a['VPOS']);w=float(a['WIDTH']);h=float(a['HEIGHT'])
   xvals.extend([x,x+w]);yvals.extend([y,y+h])
  if not xvals:continue
  box=(max(0,int(min(xvals))-5),max(0,int(min(yvals))-5),min(img.width,int(max(xvals))+6),min(img.height,int(max(yvals))+6))
  if box[2]<=box[0] or box[3]<=box[1]:continue
  stem=re.sub('[^a-zA-Z0-9_-]','_',base)+'_'+str(i).zfill(3)
  target=out/'lines'/stem
  img.crop(box).save(str(target)+'.png')
  pathlib.Path(str(target)+'.gt.txt').write_text(gt,encoding='utf8')
  entries.append({'id':stem,'xml':str(xml),'image':str(imgs[0]),'ground_truth':gt,'box':box})
(out/'extract-report.json').write_text(json.dumps({'manuscript':'bnf-lat-10996','source':'HTRomance','line_count':len(entries),'lines':entries[:12]},ensure_ascii=False,indent=2),encoding='utf8')
print('EXTERNAL_LINES',len(entries),flush=True)
if len(entries)<20:raise RuntimeError('Fewer than 20 aligned external lines; cannot claim meaningful CER/WER')

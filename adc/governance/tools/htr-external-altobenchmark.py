import pathlib,urllib.request,xml.etree.ElementTree as ET,json,hashlib
from PIL import Image
root=pathlib.Path("htr-external");root.mkdir(exist_ok=True)
base="https://raw.githubusercontent.com/HTRomance-Project/medieval-latin/main/data/bnf-lat-10996/"
names=[f"btv1b100389713_f{i}" for i in (2,3,4)]
records=[]; lines=[]
for stem in names:
 files={}
 for ext in (".jpg",".chocomufin.xml"):
  url=base+stem+ext; target=root/(stem+ext)
  urllib.request.urlretrieve(url,target)
  files[ext]={"sha256":hashlib.sha256(target.read_bytes()).hexdigest(),"bytes":target.stat().st_size}
 xml=ET.parse(root/(stem+".chocomufin.xml")).getroot()
 img=Image.open(root/(stem+".jpg")).convert("RGB")
 n=0
 for line in xml.findall(".//{*}TextLine"):
  words=[x.get("CONTENT","") for x in line.findall("./{*}String")]
  transcription=" ".join(w for w in words if w).strip()
  if not transcription:continue
  try:
   x=int(float(line.get("HPOS")));y=int(float(line.get("VPOS")))
   w=int(float(line.get("WIDTH")));h=int(float(line.get("HEIGHT")))
  except (TypeError,ValueError):continue
  box=(max(0,x-5),max(0,y-5),min(img.width,x+w+5),min(img.height,y+h+5))
  if box[2]<=box[0] or box[3]<=box[1]:continue
  dest=root/(stem+"_"+str(n).zfill(3))
  img.crop(box).save(str(dest)+".png")
  pathlib.Path(str(dest)+".gt.txt").write_text(transcription,encoding="utf-8")
  lines.append(str(dest.resolve())+".png");n+=1
 records.append({"page":stem,"lines":n,"files":files,"source":base})
(root/"test.txt").write_text("\n".join(lines)+"\n",encoding="utf-8")
(root/"manifest.json").write_text(json.dumps({"corpus":"HTRomance medieval-latin", "split":"entirely external, never used for training or checkpoint selection", "pages":records,"lines":len(lines)},indent=2),encoding="utf-8")
print("EXTERNAL_TEST_LINES",len(lines),"PAGES",len(records),flush=True)
assert len(lines)>=40

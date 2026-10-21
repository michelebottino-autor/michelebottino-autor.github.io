"""Isolated smoke training on PUBLIC Zenodo data only. Does not access Processo 334 scans."""
import io, os, pathlib, urllib.request, zipfile, xml.etree.ElementTree as ET
from PIL import Image
url="https://zenodo.org/records/17911438/files/19_-_Praha%2C_NKP%2C_sign__I_D_10_-_Winter_School.zip?download=1"
base=pathlib.Path("htr-smoke");base.mkdir(exist_ok=True)
archive=base/"public.zip"
urllib.request.urlretrieve(url,archive)
with zipfile.ZipFile(archive) as z:
 names=[n for n in z.namelist() if not n.startswith("__MACOSX/")]
 xmls=sorted(n for n in names if "/page/" in n and n.endswith(".xml"))
 train=[];test=[]
 for idx,n in enumerate(xmls):
  if idx not in (0,1,2,3,4,5,6,7):continue
  stem=pathlib.PurePosixPath(n).stem
  imn=next((x for x in names if x.endswith("/"+stem+".jpg")),None)
  if not imn:raise RuntimeError("image missing "+stem)
  image=Image.open(io.BytesIO(z.read(imn))).convert("RGB")
  root=ET.fromstring(z.read(n))
  lines=root.findall(".//{*}TextLine")
  maxlines=len(lines)
  for j,line in enumerate(lines[:maxlines]):
   txtnode=line.find(".//{*}Unicode")
   coords=line.find("./{*}Coords")
   if txtnode is None or coords is None:continue
   text="".join(txtnode.itertext()).strip()
   if not text or "\ufffd" in text:continue
   points=[tuple(map(int,p.split(","))) for p in coords.attrib["points"].split()]
   xs=[p[0] for p in points];ys=[p[1] for p in points]
   box=(max(0,min(xs)-5),max(0,min(ys)-5),min(image.width,max(xs)+6),min(image.height,max(ys)+6))
   folder=base/("test" if idx>=6 else "train");folder.mkdir(exist_ok=True)
   target=folder/(stem+"_"+str(j).zfill(3))
   image.crop(box).save(str(target)+".png")
   (pathlib.Path(str(target)+".gt.txt")).write_text(text,encoding="utf-8")
   (test if idx>=6 else train).append(str(target.resolve())+".png")
(base/"train.txt").write_text("\n".join(train)+"\n",encoding="utf-8")
(base/"test.txt").write_text("\n".join(test)+"\n",encoding="utf-8")
print("TRAIN_LINES",len(train),"TEST_LINES",len(test),flush=True)
assert len(train)>=400 and len(test)>=140

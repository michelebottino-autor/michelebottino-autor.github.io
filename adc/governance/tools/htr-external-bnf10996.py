"""External manuscript HTR benchmark. No training. Separate BnF manuscript (HTRomance)."""
import io,json,pathlib,urllib.request,xml.etree.ElementTree as ET,hashlib
from PIL import Image
root=pathlib.Path("htr-smoke"); output=root/"test";output.mkdir(parents=True,exist_ok=True)
base="https://raw.githubusercontent.com/HTRomance-Project/medieval-latin/main/data/bnf-lat-10996/"
files=["btv1b100389713_f2","btv1b100389713_f3","btv1b100389713_f4"]
sources=[];count=0
for stem in files:
 items={}
 for ext in (".jpg",".chocomufin.xml"):
  with urllib.request.urlopen(base+stem+ext,timeout=50) as response: items[ext]=response.read()
 image=Image.open(io.BytesIO(items[".jpg"])).convert("RGB")
 xroot=ET.fromstring(items[".chocomufin.xml"])
 entries=0
 for j,line in enumerate(xroot.findall(".//{*}TextLine")):
  words=[s.attrib.get("CONTENT","").strip() for s in line.findall("./{*}String")]
  trans=" ".join(x for x in words if x).strip()
  if not trans: continue
  polygon=line.find("./{*}Shape/{*}Polygon")
  xy=[]
  if polygon is not None:
   for point in polygon.attrib.get("POINTS","").split():
    try:xy.append(tuple(map(int,point.split(","))))
    except ValueError:pass
  if len(xy)<3:continue
  xs=[x for x,y in xy];ys=[y for x,y in xy]
  box=(max(0,min(xs)-5),max(0,min(ys)-5),min(image.width,max(xs)+6),min(image.height,max(ys)+6))
  if box[2]-box[0]<25 or box[3]-box[1]<10:continue
  target=output/(stem+"_"+str(j).zfill(3))
  image.crop(box).save(str(target)+".png")
  pathlib.Path(str(target)+".gt.txt").write_text(trans,encoding="utf-8")
  count+=1;entries+=1
 sources.append({"manuscript":"BnF lat. 10996","page":stem,"lines":entries,"image_sha256":hashlib.sha256(items[".jpg"]).hexdigest(),"alto_sha256":hashlib.sha256(items[".chocomufin.xml"]).hexdigest()})
root.joinpath("test.txt").write_text("\n".join(str(x.resolve()) for x in sorted(output.glob("*.png")))+"\n",encoding="utf-8")
root.joinpath("external-source-manifest.json").write_text(json.dumps({"source":"HTRomance BnF lat. 10996","pages":sources,"lines":count,"training_used":False},indent=2),encoding="utf-8")
print("EXTERNAL_HOLDOUT_LINES",count,flush=True)
assert count>=40

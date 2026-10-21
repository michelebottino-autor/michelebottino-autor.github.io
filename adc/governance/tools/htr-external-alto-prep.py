import pathlib,xml.etree.ElementTree as ET
from PIL import Image
src=pathlib.Path("external-htromance/data/bnf-lat-10996")
dst=pathlib.Path("external-test");dst.mkdir(exist_ok=True)
pairs=[]
for xml in sorted(src.glob("*.chocomufin.xml")):
    stem=xml.name.replace(".chocomufin.xml","")
    jpg=src/(stem+".jpg")
    if not jpg.exists():continue
    im=Image.open(jpg).convert("RGB")
    root=ET.parse(xml).getroot()
    lines=root.findall(".//{*}TextLine")
    for n,line in enumerate(lines):
        strings=line.findall(".//{*}String")
        trans=[str(s.get("CONTENT","")).strip() for s in strings if s.get("CONTENT")]
        if not trans:continue
        text=" ".join(trans)
        x,y,w,h=(float(line.get(k,"0")) for k in ("HPOS","VPOS","WIDTH","HEIGHT"))
        if min(w,h)<=0:continue
        box=(max(0,int(x)-3),max(0,int(y)-3),min(im.width,int(x+w)+4),min(im.height,int(y+h)+4))
        if box[2]<=box[0] or box[3]<=box[1]:continue
        target=dst/(stem+"_"+str(n).zfill(3))
        im.crop(box).save(str(target)+".png")
        pathlib.Path(str(target)+".gt.txt").write_text(text,encoding="utf-8")
        pairs.append(str(target.resolve())+".png")
(dst/"test.txt").write_text("\n".join(pairs)+"\n",encoding="utf-8")
print("EXTERNAL_PAIRS",len(pairs),flush=True)
assert len(pairs)>=60,"Too few independent lines"

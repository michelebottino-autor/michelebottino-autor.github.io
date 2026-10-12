from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import textwrap

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "images" / "adc-social"
OUT.mkdir(parents=True, exist_ok=True)
ITEMS = {
 "atlante": ("Atlante storico-documentario", "Luoghi, documenti e cronologie"),
 "ricostruzione-1943": ("Calatabiano nel 1943", "Guerra e ricostruzione"),
 "dossier-1213-1537": ("Dal Medioevo al Cinquecento", "1213–1537"),
 "dossier-rationes": ("Le chiese nelle Rationes", "Decime e comunità medievali"),
 "dossier-zucchero": ("Lo zucchero a Calatabiano", "Trappeti, Mirulla e Cruïlles"),
 "fonti": ("Le fonti della storia", "Pergamene, registri e testimonianze"),
 "opere-pubbliche": ("Le opere pubbliche", "Calatabiano 1860–1866"),
 "ponte-alcantara": ("Il ponte sull’Alcantara", "Strade e passaggi medievali"),
 "processo-334": ("Il processo del 334", "Una testimonianza da interrogare"),
 "programma": ("Percorsi di ricerca", "Le domande della storia"),
 "storia": ("Una storia che torna a parlare", "Calatabiano attraverso i secoli"),
 "terremoto-1818": ("Il terremoto del 1818", "Case, chiese e castello"),
}
def font(size, bold=False):
    candidates = [
      "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
      "/usr/share/fonts/truetype/liberation2/LiberationSerif-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSerif-Regular.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists(): return ImageFont.truetype(candidate,size)
    return ImageFont.load_default()
# Facebook mobile may display a centered square crop of a landscape OG image.
# All essential information is kept inside the central 600 px safe zone.
def lines_for(text, draw, typeface, max_width):
    words=text.split()
    rows=[]; current=""
    for word in words:
        candidate=(current+" "+word).strip()
        if current and draw.textbbox((0,0),candidate,font=typeface)[2]>max_width:
            rows.append(current);current=word
        else: current=candidate
    if current: rows.append(current)
    return rows

for slug,(title,subtitle) in ITEMS.items():
    im=Image.new("RGB",(1200,630),"#172d33")
    d=ImageDraw.Draw(im)
    gold="#e0bc7f";cream="#f6eedc"
    # Side panels are decorative only and may be cropped.
    d.rectangle((315,26,885,604),outline="#c9a46b",width=3)
    d.line((350,148,850,148),fill="#c9a46b",width=2)
    d.line((350,501,850,501),fill="#c9a46b",width=2)
    d.text((600,70),"ARCHIVIO DOCUMENTALE",font=font(22),fill=gold,anchor="mm")
    d.text((600,105),"CALATABIANO",font=font(22),fill=gold,anchor="mm")
    title_font=font(48,True)
    rows=lines_for(title,d,title_font,495)
    while (len(rows)>4 or any(d.textbbox((0,0),row,font=title_font)[2]>495 for row in rows)) and title_font.size>28:
        title_font=font(title_font.size-2,True)
        rows=lines_for(title,d,title_font,495)
    step=title_font.size+14
    top=295-(len(rows)-1)*step/2
    for i,row in enumerate(rows):
        d.text((600,int(top+i*step)),row,font=title_font,fill=cream,anchor="mm")
    subtitle_font=font(23)
    sublines=lines_for(subtitle,d,subtitle_font,485)
    for i,row in enumerate(sublines[:2]):
        d.text((600,435+i*29),row,font=subtitle_font,fill=gold,anchor="mm")
    d.text((600,543),"MICHELE BOTTINO",font=font(22),fill=gold,anchor="mm")
    d.text((600,571),"STORIA E FONTI",font=font(17),fill=gold,anchor="mm")
    im.save(OUT/(slug+"-v2.png"),optimize=True)
    print(slug)

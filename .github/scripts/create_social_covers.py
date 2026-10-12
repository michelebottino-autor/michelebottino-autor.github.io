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
for slug,(title,subtitle) in ITEMS.items():
    im=Image.new("RGB",(1200,630),"#172d33")
    d=ImageDraw.Draw(im)
    d.rectangle((38,38,1162,592),outline="#c9a46b",width=4)
    d.line((78,150,1122,150),fill="#c9a46b",width=3)
    d.line((78,505,1122,505),fill="#c9a46b",width=3)
    d.text((600,100),"ARCHIVIO DOCUMENTALE CALATABIANO",font=font(25),fill="#e0bc7f",anchor="mm")
    title_font=font(64,True)
    while d.textbbox((0,0),title,font=title_font)[2]>1030 and title_font.size>36:
        title_font=font(title_font.size-2,True)
    d.text((600,285),title,font=title_font,fill="#f6eedc",anchor="mm")
    d.text((600,442),subtitle,font=font(32),fill="#e0bc7f",anchor="mm")
    d.text((600,549),"MICHELE BOTTINO  |  STORIA E FONTI",font=font(23),fill="#e0bc7f",anchor="mm")
    im.save(OUT/(slug+".png"),optimize=True)
    print(slug)

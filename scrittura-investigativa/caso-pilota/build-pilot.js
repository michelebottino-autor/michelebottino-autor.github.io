'use strict';
const fs=require('node:fs'),path=require('node:path');
const d=JSON.parse(fs.readFileSync(path.join(__dirname,'dossier.json'),'utf8'));
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const claims=new Set(d.claims.map(x=>x.id));
if(d.stages.length!==10)throw Error('Expected 10 stages.');
if(d.article.paragraphs.some(p=>p.claim_ids.some(id=>!claims.has(id))))throw Error('Unrecognized evidence ID');
const nav='<nav class="pilot-nav"><a href="../">← Indice del corso</a> <a href="../documenti/">Laboratorio fonti</a> <a href="../../formazione/">Formazione</a></nav>';
const steps=d.stages.map(s=>'<article class="pilot-step" id="stage-'+s.unit+'"><strong>'+String(s.unit).padStart(2,'0')+'</strong><div><h3><a href="../unita-'+s.unit+'/">'+esc(s.title)+'</a></h3><p>'+esc(s.output)+'</p></div></article>').join('');
const article=d.article.paragraphs.map(p=>'<p>'+esc(p.text)+' <span class="pilot-citations">'+p.claim_ids.map(id=>'<a href="#claim-'+esc(id)+'" aria-label="Consulta la scheda '+esc(id)+'">'+esc(id)+'</a>').join(' ')+'</span></p>').join('');
const statuses={catalog_record:'Dato bibliografico',ocr_partial:'OCR indicizzato, controllo visivo aperto',secondary_context:'Fonte secondaria di contesto',open:'Non accertato'};
const rows=d.claims.map(c=>'<tr id="claim-'+esc(c.id)+'"><th scope="row">'+esc(c.id)+'</th><td>'+esc(c.claim)+'</td><td>'+(c.source_id?'<a href="#source-'+esc(c.source_id)+'">'+esc(c.source_id)+'</a>':'Da individuare')+'</td><td>'+esc(statuses[c.status]||c.status)+'</td><td>'+esc(c.limitation)+'</td></tr>').join('');
const sources=d.sources.map(s=>'<li id="source-'+esc(s.id)+'"><strong>'+esc(s.id)+'</strong> · <a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a> — '+esc(s.institution)+'</li>').join('');
const gates=d.review_gates.map(s=>'<li>'+esc(s)+'</li>').join('');
const html=[
'<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
'<title>'+esc(d.title)+' · Caso pilota | Michele Bottino</title>',
'<meta name="description" content="Esempio di scrittura investigativa su un documento giornalistico storico: fonti, dieci passaggi, articolo e tracciabilità.">',
'<link rel="canonical" href="https://michelebottino-autor.github.io/scrittura-investigativa/caso-pilota/">',
'<link rel="stylesheet" href="./style.css"></head><body><a class="pilot-skip" href="#contenuto">Salta al contenuto</a>',
'<header>'+nav+'</header><main id="contenuto">',
'<section class="pilot-hero"><p class="pilot-kicker">Officina dell’autore · fonte storica autentica</p><h1>'+esc(d.title)+'</h1><p class="pilot-lead">'+esc(d.subtitle)+'</p>',
'<p class="pilot-warning"><strong>Stato della verifica:</strong> '+esc(d.source_integrity)+' È una dimostrazione didattica provvisoria, non un articolo definitivamente validato.</p>',
'<p>Il fascicolo S-01 usato in altri esercizi è simulato. Questo caso utilizza invece una fonte primaria storica identificata e un testo indicizzato, mantenendo visibili i controlli mancanti.</p></section>',
'<section class="pilot-panel" aria-labelledby="stages"><h2 id="stages">Dieci unità, una sola opera</h2><p>Ogni unità produce una decisione di scrittura. Seleziona un passaggio per aprire la lezione corrispondente.</p>'+steps+'</section>',
'<section class="pilot-panel" aria-labelledby="article"><p class="pilot-kicker">Articolo modello · '+d.article.paragraphs.reduce((n,p)=>n+p.text.split(/\s+/).length,0)+' parole · estratto dimostrativo, non prova valutata</p><h2 id="article">'+esc(d.article.title)+'</h2><p class="pilot-lead">Una narrazione originale con rimandi puntuali alle affermazioni; nessuna citazione letterale da OCR non verificato.</p><article class="pilot-article">'+article+'</article></section>',
'<section class="pilot-panel" aria-labelledby="matrix"><h2 id="matrix">Matrice delle affermazioni</h2><p>Le schede P riguardano il testo e i dati consultati; le Q indicano limiti o domande non risolte.</p><div class="pilot-scroll"><table><thead><tr><th>ID</th><th>Affermazione</th><th>Fonte</th><th>Stato</th><th>Limite</th></tr></thead><tbody>'+rows+'</tbody></table></div></section>',
'<section class="pilot-panel" id="fonti"><h2>Fonti e provenienza</h2><ul>'+sources+'</ul><p>Le notizie riportate sulla stessa pagina del 1918 non valgono come conferme indipendenti l’una dell’altra. La guida moderna della Library of Congress offre un contesto ma non documenta l’effettiva distribuzione degli aiuti locali.</p><p>Nessuna immagine o trascrizione integrale viene riprodotta. Per la verifica definitiva occorre confrontare il testo con il facsimile e documentare i diritti applicabili al riuso.</p></section>',
'<section class="pilot-panel"><h2>Passaggi necessari prima della validazione</h2><ol>'+gates+'</ol><p class="pilot-warning">'+esc(d.disclaimer)+'</p><p>La bozza non attribuisce alcun voto: la valutazione dell’opera finale richiede un revisore umano e fonti integralmente controllate.</p></section>',
'</main><footer>'+nav+'<p>© 2026 Michele Bottino · Officina delle Storie.</p></footer><script defer src="../../analytics-consenso.js"></script></body></html>'
].join('\n');
fs.writeFileSync(path.join(__dirname,'index.html'),html,'utf8');
console.log('PILOT_PAGE_OK units='+d.stages.length+' evidence='+d.claims.length+' paragraphs='+d.article.paragraphs.length);
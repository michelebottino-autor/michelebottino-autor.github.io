'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const evidence=JSON.parse(fs.readFileSync(path.join(root,'verifica-puntuale.json'),'utf8'));
const rubric=JSON.parse(fs.readFileSync(path.join(root,'valutazione-redazionale.json'),'utf8'));
if(evidence.items.length!==8||rubric.criterion.length!==5||evidence.facsimile_review!==false||evidence.human_review!==false)throw Error('Invalid review metadata');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const claims=evidence.items.map(x=>'<tr><th scope="row">'+esc(x.id)+'</th><td>'+esc(x.location_hint||'Questione da indagare')+'</td><td>'+esc(x.what_is_supported)+'</td><td>'+esc(x.not_supported)+'</td></tr>').join('');
const rows=rubric.criterion.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+x.maximum+'</td><td class="blank">________</td><td class="blank">____________________________</td></tr>').join('');
const gates=['Identificativo della pagina, data e testata','Titolo e passaggi verificati sul facsimile e non solo OCR','Distinzione fra fondo annunciato e aiuti realmente documentati','Coordinamento con la Croce Rossa descritto come intenzione','Nomi propri e dialoghi correttamente attribuiti','Fonte sanitaria del 1918 presentata come documento storico','Guide secondarie non confuse con prove indipendenti','Licenze e condizioni di riuso delle immagini, se presenti'];
const checklist=gates.map(s=>'<li>☐ '+esc(s)+'</li>').join('');
const html=[
'<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
'<title>Fascicolo di revisione · La pagina dei soccorsi | Michele Bottino</title>',
'<meta name="description" content="Fascicolo trasparente e stampabile per la revisione umana di un testo documentario, con rubrica, controllo delle fonti e limiti della ricerca.">',
'<link rel="canonical" href="https://michelebottino-autor.github.io/scrittura-investigativa/caso-pilota/revisione/">',
'<style>',
':root{color-scheme:light;--ink:#23342d;--paper:#f7f7f2;--line:#dedfd9}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.7 system-ui,-apple-system,"Segoe UI",sans-serif}',
'header,main,footer{max-width:1080px;margin:auto;padding:22px clamp(16px,3vw,32px)}nav{display:flex;gap:12px 24px;flex-wrap:wrap}a{color:#215f52;text-underline-offset:3px}a:focus-visible{outline:3px solid #af8850;outline-offset:3px}',
'h1,h2{font-family:Georgia,serif;line-height:1.2}h1{font-size:clamp(2rem,5vw,3.45rem)}h2{font-size:1.7rem}h3{font-size:1.1rem}.panel{padding:clamp(17px,3vw,32px);border:1px solid var(--line);background:white;border-radius:12px;margin:20px 0}',
'.notice{background:#f5eee0;border-left:4px solid #b18d57;padding:16px 20px}.scroll{overflow-x:auto}table{border-collapse:collapse;width:100%;min-width:780px;font-size:.9rem;text-align:left}th,td{padding:13px 11px;border-bottom:1px solid #e0e5dc;vertical-align:top}thead{background:#edf3ef}.blank{color:#567165}',
'ol li,ul li{padding:5px 0}.kicker{color:#785b3b;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;font-weight:800}footer{border-top:1px solid var(--line)}',
'@media print{body{background:#fff}nav{display:none}.panel{border:0;padding:10px 0;break-inside:avoid}.scroll{overflow:visible}table{font-size:10pt}}',
'</style></head><body>',
'<header><nav aria-label="Percorso"><a href="../../">Scrittura Investigativa</a><a href="../">Caso documentario</a><a href="../../sperimentazione/">Sperimentazione</a></nav></header>',
'<main><p class="kicker">Officina dell’autore · fascicolo di controllo</p><h1>Revisione umana di «La pagina dei soccorsi»</h1>',
'<p class="notice"><strong>Stato:</strong> nessuna revisione umana esterna è stata svolta. Il facsimile originale del 14 ottobre 1918 non è stato acquisito per una collazione integrale. Il punteggio redazionale assistito da IA esistente non è un esame ufficiale.</p>',
'<section class="panel"><h2>Come utilizzare il fascicolo</h2><p>Leggi <a href="../#article">l’articolo modello</a> e consulta il <a href="https://chroniclingamerica.loc.gov/lccn/sn88064293/1918-10-14/ed-1/seq-4/" rel="noopener noreferrer" target="_blank">documento digitalizzato nell’archivio della Library of Congress</a>. Distingui chiaramente la notizia del 1918, l’interpretazione moderna e l’effettiva verifica di un evento. Se non è possibile aprire l’immagine originale, segnala il controllo come non svolto.</p>',
'<p>Il revisore può stampare questa pagina e compilare i campi, oppure consultare la <a href="./SCHEDA_REVISIONE_UMANA.md">scheda di revisione in Markdown</a>. Il sito non conserva né trasmette valutazioni o dati personali.</p>',
'<p>Codice revisore: __________ &nbsp; Data: __________ &nbsp; Versione del testo: __________</p></section>',
'<section class="panel"><h2>Otto riscontri e questioni aperte</h2><p>Le schede derivano dal testo indicizzato e dai metadati. Non implicano che l’immagine sia stata verificata. Per P4, il giornale descrive una <strong>collaborazione prevista</strong>, non un fatto già dimostrato.</p>',
'<div class="scroll"><table><thead><tr><th>ID</th><th>Dove cercare</th><th>Cosa sostiene il materiale</th><th>Cosa non dimostra</th></tr></thead><tbody>'+claims+'</tbody></table></div>',
'<p><a href="../verifica-puntuale.json">Registro strutturato delle otto attestazioni</a> · <a href="../audit-fonti.json">Audit delle fonti e ostacoli di accesso</a> · <a href="../VERBALE_VERIFICA_PUNTUALE.md">Verbale e impronte dei file redazionali</a></p></section>',
'<section class="panel"><h2>Rubrica da compilare dal revisore umano</h2><div class="scroll"><table><thead><tr><th>Criterio</th><th>Massimo</th><th>Punteggio</th><th>Motivazione e riferimenti</th></tr></thead><tbody>'+rows+'<tr><th>Totale</th><th>100</th><td>________</td><td>La soglia progettuale è 70/100; restano necessari tutti i controlli essenziali.</td></tr></tbody></table></div>',
'<p><strong>Non utilizzare automaticamente il 65/100 precedente.</strong> È una valutazione preliminare prodotta con assistenza IA. Un docente indipendente deve motivare i propri giudizi e può confermarli o discostarsene.</p></section>',
'<section class="panel"><h2>Checklist indispensabile</h2><ul>'+checklist+'</ul>',
'<p>Facsimile visualizzato e controllato? ☐ Sì ☐ No</p><p>Fonti indipendenti verificate? ☐ Sì ☐ No</p>',
'<p>Esito: ☐ Bozza migliorabile ☐ Necessita nuove fonti ☐ Può essere usata come modello con limiti espliciti</p>',
'<p>Correzioni prioritarie: ___________________________________________________</p><p>Osservazioni sull’efficacia della scrittura: __________________________________</p></section>',
'</main><footer>Documento di lavoro non certificativo · Corso di livello intermedio · Michele Bottino</footer>',
'<script defer src="../../../analytics-consenso.js"></script></body></html>'
].join('\n');
fs.writeFileSync(path.join(__dirname,'index.html'),html,'utf8');
console.log('REVIEW_HANDOFF_PAGE_OK source_evidence='+evidence.items.length+' rubric='+rubric.criterion.length);

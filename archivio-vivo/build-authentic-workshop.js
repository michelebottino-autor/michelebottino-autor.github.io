(function addHistoricalWorkshop(){
 const fs=require('fs'),path=require('path'),dir=__dirname;
 const data=JSON.parse(fs.readFileSync(path.join(dir,'laboratorio-storico','fonti.json'),'utf8'));
 const e=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 const map=data.materials.map(x=>`<li><strong>${e(x.id)} — ${e(x.date)} · pagina ${x.page}</strong><p><a href="${e(x.url)}" target="_blank" rel="noopener noreferrer">${e(x.title)}</a></p><p><strong>Leggi nella pagina:</strong> ${e(x.status)}.</p><p><strong>Da non dedurre:</strong> ${e(x.not_demonstrated)}.</p></li>`).join('');
 const panels=data.panel_proposal.map((x,i)=>`<li><h3>${i+1}. ${e(x.title)}</h3><p>${e(x.label)}</p><p><strong>Unità:</strong> ${e(x.source||'questione aperta')} · <strong>Limite:</strong> ${e(x.limitation)}</p></li>`).join('');
 const html=`<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tre edizioni, un percorso archivistico | L’archivio diventa racconto</title><meta name="description" content="Laboratorio di curatela con tre edizioni del Morgan City Daily Review digitalizzate dalla Library of Congress, corredate da limiti delle attestazioni."><link rel="canonical" href="https://michelebottino-autor.github.io/archivio-vivo/laboratorio-storico/"><link rel="stylesheet" href="../assets/site.css?v=1"></head><body><a href="#contenuto" class="skip">Salta al contenuto</a><header class="topbar"><div class="bar-inner"><a class="brand" href="../">L’archivio diventa racconto</a><nav class="topnav" aria-label="Navigazione"><a href="../">Programma</a><a href="../caso-A01/">Caso A-01</a><a href="/catalogo/">Catalogo</a></nav></div></header><main id="contenuto">
 <div class="crumbs"><a href="../">Corso</a> / Laboratorio su documenti storici autentici</div><section class="hero"><p class="kicker">Esercitazione documentaria · Library of Congress</p><h1>Tre edizioni, un percorso archivistico</h1><p class="lead">Come trasformare tre numeri di un quotidiano del 1918 in un percorso per il pubblico, conservando provenienza, date, attribuzioni e problemi ancora aperti.</p><div class="facts"><span>Fonti autentiche</span><span>3 pagine di giornale</span><span>4 pannelli proposti</span><span>Stessa testata</span></div></section>
 <div class="notice"><strong>Limite fondamentale:</strong> le tre edizioni appartengono tutte a <em>The Morgan City Daily Review</em>. Documentano ciò che il giornale pubblicò; non costituiscono tre conferme indipendenti dell'effettiva attività di assistenza. I quattro pannelli sono un esercizio da realizzare, non la descrizione di una mostra già allestita.</div>
 <section class="panel"><h2>Inventario della piccola raccolta</h2><p>Il corpus è una selezione editoriale di tre giornate della stessa testata, non un fondo autonomo creato da tre produttori distinti. Le riproduzioni sono ospitate dalla Library of Congress nella raccolta Chronicling America, con contributo di Louisiana State University.</p><ol class="source-list">${map}</ol></section>
 <section class="panel"><h2>Storyboard per quattro pannelli</h2><ol class="steps">${panels}</ol><p>Il quarto pannello rende visibili le domande ancora non risolte, senza attribuire alle assenze il significato di una prova di fallimento o successo.</p></section>
 <section class="panel"><h2>Compito di progettazione</h2><ol class="steps">${data.curatorial_questions.map(q=>`<li>${e(q)}</li>`).join('')}</ol><p><strong>Consegna:</strong> ${e(data.student_product)}. Puoi partire dal <a href="${e(data.reused_project)}">dossier già controllato nel corso di Scrittura Investigativa</a>, ma qui il prodotto da valutare è la <strong>progettazione curatoriale</strong>, non la ripetizione dell’articolo storico.</p></section>
 <section class="panel"><h2>Controlli editoriali</h2><ul>${data.review_points.map(x=>`<li>${e(x)}</li>`).join('')}</ul><p><a href="./fonti.json">Registro strutturato di fonti, limiti e pannelli</a>.</p><p class="small subtle">Collegamenti alle risorse ufficiali; nessuna scansione ripubblicata dal corso.</p></section>
 </main><footer class="footer">Officina delle Storie · Materiale pilota non certificativo · <a href="/privacy/">Privacy</a></footer></body></html>`;
 fs.writeFileSync(path.join(dir,'laboratorio-storico','index.html'),html,'utf8');
 let home=fs.readFileSync(path.join(dir,'index.html'),'utf8');
 if(!home.includes('id="ponte-archivio-storico"')){
  const anchor='<section class="panel"><h2>Portfolio finale</h2>';
  if(!home.includes(anchor))throw Error('Missing homepage anchor');
  home=home.replace(anchor,'<section class="panel" id="ponte-archivio-storico"><h2>Un esercizio con fonti storiche autentiche</h2><p>Per provare il metodo su documenti effettivamente conservati, puoi progettare una sequenza di quattro pannelli da tre edizioni del <em>Morgan City Daily Review</em> del 1918. Il compito consiste nella scelta, descrizione, disposizione e attribuzione delle unità, non nel ripetere l’articolo pubblicato nell’altro corso.</p><p><a href="./laboratorio-storico/">Apri il laboratorio di curatela su fonti autentiche →</a></p></section>'+anchor);
  fs.writeFileSync(path.join(dir,'index.html'),home,'utf8');
 }
 for(const i of [2,4,6,8,10]){
  const dest=path.join(dir,'unita-'+i,'index.html');let h=fs.readFileSync(dest,'utf8');
  if(!h.includes('class="archivio-ponte-storico"')){
   const anchor='<section class="panel"><h2>Esempio applicato</h2>';
   if(!h.includes(anchor))throw Error('Missing unit anchor '+i);
   h=h.replace(anchor,'<section class="panel archivio-ponte-storico"><h2>Applicazione a fonti autentiche</h2><p>Nel <a href="../laboratorio-storico/">laboratorio sulle tre edizioni del 1918</a> puoi applicare le operazioni di questa unità a documenti digitalizzati e identificabili. Conserva la provenienza di ciascuna pagina e non attribuire conferma indipendente a numeri della stessa testata.</p></section>'+anchor);
   fs.writeFileSync(dest,h,'utf8');
  }
 }
 let syllabus=JSON.parse(fs.readFileSync(path.join(dir,'programma.json'),'utf8'));
 syllabus.authentic_workshop={id:'LOC-1918-CURATION',url:'./laboratorio-storico/',sources:3,panels:4,source_relationship:'same_newspaper_different_issues_not_independent_corroboration',status:'prior_project_source_review_reused_with_limits'};
 fs.writeFileSync(path.join(dir,'programma.json'),JSON.stringify(syllabus,null,2)+'\n','utf8');
 console.log('ARCHIVIO_AUTHENTIC_WORKSHOP_OK: 3 issues, 4 panels, 5 linked units');
})();
(function buildPages(){
 const fs=require('node:fs'),path=require('node:path'),base=__dirname;
 const p=JSON.parse(fs.readFileSync(path.join(base,'programma.json'),'utf8'));
 const d=JSON.parse(fs.readFileSync(path.join(base,'caso-modello','dossier.json'),'utf8'));
 const e=x=>String(x??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
 const write=(rel,html)=>{const dest=path.join(base,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,html,'utf8')};
 const footer=()=>`<footer class="footer">Officina delle Storie · Michele Bottino <a href="/catalogo/">Catalogo</a><a href="/privacy/">Privacy</a><a href="/contatti/">Contatti</a></footer>`;
 const head=(title,desc,url,deep)=>`<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)} | Michele Bottino</title><meta name="description" content="${e(desc)}"><link rel="canonical" href="https://michelebottino-autor.github.io/storie-che-mancano/${url}"><link rel="stylesheet" href="${deep?'../':'./'}assets/site.css?v=1"></head>`;
 const header=(deep)=>{const home=deep?'../':'./';return `<a class="skip" href="#contenuto">Salta al contenuto</a><header class="topbar"><div class="bar-inner"><a class="brand" href="${home}">Le storie che mancano</a><nav class="topnav" aria-label="Navigazione del corso"><a href="${home}">Programma</a><a href="${home}caso-modello/">Caso R-01</a><a href="/catalogo/">Catalogo</a><a href="/formazione/">Formazione</a></nav></div></header>`};
 const script=(deep)=>`<script defer src="${deep?'../':'./'}assets/officina.js?v=1"></script>`;
 const facts=`<div class="facts"><span>Livello introduttivo</span><span>10 unità</span><span>30 lezioni</span><span>Italiano</span><span>Anteprima gratuita</span></div>`;
 const rubric=()=>`<div class="scroll-x"><table class="rubric-table"><thead><tr><th>Criterio</th><th>Massimo</th></tr></thead><tbody>${p.rubric.criteria.map(c=>`<tr><td>${e(c.label)}</td><td>${c.max}</td></tr>`).join('')}<tr><th>Totale</th><th>100</th></tr></tbody></table></div><p class="small subtle">Usa la rubrica per orientare la revisione del testo.</p>`;
 const guide=unit=>`<section class="guide" aria-labelledby="title-guide"><h3 id="title-guide">Elena · guida alla scrittura</h3><label class="minilabel" for="guide-question">Domanda</label><select id="guide-question">${p.units.map(u=>`<option value="${u.n}" data-answer="${e(u.guide.a)}"${unit===u.n?' selected':''}>${e(u.guide.q)}</option>`).join('')}</select><p class="answer" id="guide-answer" aria-live="polite"></p></section>`;
 const note=unit=>`<section class="panel notebook" id="taccuino"><h2>Taccuino della memoria</h2><p>Il testo resta soltanto in questo browser. Non viene inviato al sito, sincronizzato o corretto. Esporta regolarmente una copia: pulendo il browser puoi perdere gli appunti.</p><label class="minilabel" for="notebook-text">La mia bozza — Unità ${unit}</label><textarea id="notebook-text" spellcheck="true" placeholder="Scrivi il testo dell'esercizio, attribuendo le fonti…"></textarea><div class="tools"><button id="save-draft" type="button" class="btn">Salva nel browser</button><button id="download-unit" type="button" class="btn secondary">Esporta bozza</button><button id="delete-draft" type="button" class="btn secondary">Elimina bozza</button></div><p class="status" id="notebook-status" role="status" aria-live="polite">Nessun testo inviato al server.</p><noscript><p class="noscript">Il salvataggio richiede JavaScript; puoi copiare il testo manualmente.</p></noscript></section>`;
 function landing(){
  const html=[
   head("Le storie che mancano — Laboratorio di memoria","Dieci unità introduttive per scrivere un ritratto biografico con fotografie, lettere, memorie e lacune dichiarate.",'',false),
   '<body data-course-root="true">',header(false),'<main id="contenuto">',
   `<section class="hero"><p class="kicker">Officina delle Storie · Laboratorio di memoria</p><h1>Le storie che mancano</h1><p class="lead">Dalle fotografie e dai documenti incompleti a un ritratto biografico breve, rispettoso delle persone e delle domande senza risposta.</p>${facts}<p>Questo percorso <strong>introduttivo</strong> non richiede attestati precedenti e accompagna passo dopo passo alla scrittura di un testo originale.</p><p><a href="#unita">Consulta le lezioni</a> · <a href="./caso-modello/">Leggi il caso simulato R-01</a></p></section>`,
   ``,
   `<section class="panel"><h2>Obiettivi del percorso</h2><ul>${p.learning_outcomes.map(x=>`<li>${e(x)}</li>`).join('')}</ul><p><strong>Elaborato finale:</strong> un ritratto originale di 550–850 parole con cronologia, fonti, lacune, note etiche e almeno tre revisioni motivate.</p></section>`,
   `<section class="panel" id="unita"><h2>Le dieci unità</h2><div class="unit-grid">${p.units.map(u=>`<a class="unit-card" href="./unita-${u.n}/"><span class="tag">Unità ${u.n} di 10</span><strong data-unit-name="${u.n}">${e(u.title)}</strong><p>${e(u.outcome)}</p><span class="small">Apri la lezione →</span></a>`).join('')}</div></section>`,
   `<section class="panel"><h2>Il caso modello R-01</h2><p>«Il quaderno di Nina» usa cinque tracce <strong>interamente inventate</strong> per insegnare come leggere fotografie e scritti senza attribuire a persone reali fatti non verificati.</p><p><a href="./caso-modello/">Leggi il ritratto di ${d.word_count} parole, la cronologia e la matrice →</a></p></section>`,
   `<section class="panel"><h2>I tuoi progressi nel browser</h2><div class="progress" aria-hidden="true"><div id="course-progress" class="fill"></div></div><p id="progress-label" class="small" role="status">Caricamento progressi locali…</p><button id="export-portfolio" class="btn" type="button">Esporta il portfolio Markdown</button><p class="small subtle">La memoria locale può essere cancellata o non disponibile in alcuni browser. L’esportazione è la copia da conservare.</p></section>`,
   `<section class="two-col"><div class="panel"><h2>Rubrica futura</h2>${rubric()}</div><div class="panel"><h2>Etica delle memorie</h2><p>Una fotografia non dimostra uno stato d’animo. Una cartolina non certifica tutto ciò che racconta. Le voci di familiari vanno attribuite e pubblicate con cautele e autorizzazioni appropriate. È sempre possibile usare il caso inventato senza condividere materiale privato.</p></div></section>`,
   `<section class="panel">${guide(1)}</section>`,
   '</main>',footer(),script(false),'</body></html>'
  ].join('\n');
  write('index.html',html);
 }
 function unitPage(u){
  const lessons=u.lessons.map(([name,body],i)=>`<section class="lesson"><h3>${u.n}.${i+1} ${e(name)}</h3><p>${e(body)}</p></section>`).join('');
  const html=[
  head(`Unità ${u.n} — ${u.title}`,u.outcome,`unita-${u.n}/`,true),
  `<body data-course-root="true" data-unit="${u.n}">`,header(true),'<main id="contenuto">',
  `<div class="crumbs"><a href="../">Le storie che mancano</a> / Unità ${u.n} di 10</div>`,
  `<section class="hero"><p class="kicker">Unità ${u.n} / 10 · livello introduttivo</p><h1>${e(u.title)}</h1><p class="lead"><strong>Risultato:</strong> ${e(u.outcome)}</p><p>Puoi usare il <a href="../caso-modello/">dossier simulato R-01</a> oppure fonti reali di cui conosci provenienza e condizioni di uso.</p></section>`,
  `<div class="notice"><strong>Regola:</strong> non trasformare in certezze date, identità, emozioni o azioni che i documenti non attestano. I dati di persone reali richiedono rispetto e cautela.</div>`,
  `<section class="panel"><h2>La lezione</h2>${lessons}</section>`,
  `<section class="panel"><h2>Dal documento alla scrittura</h2><div class="examples"><p>${e(u.example)}</p></div><p class="small subtle">Le fonti R-01 sono simulate, non testimonianze di persone reali.</p></section>`,
  `<section class="panel" id="laboratorio"><h2>Esercizio guidato</h2><p><strong>Consegna:</strong> ${e(u.deliverable)}</p><ol class="steps">${u.steps.map(s=>`<li>${e(s)}</li>`).join('')}</ol></section>`,
  `<section class="panel"><h2>Controlla il tuo lavoro</h2><div class="checklist">${u.checks.map((s,i)=>`<div class="check"><input type="checkbox" data-check id="check-${u.n}-${i}"><label for="check-${u.n}-${i}">${e(s)}</label></div>`).join('')}</div><p class="small subtle">L’autocontrollo non equivale a un giudizio del docente.</p></section>`,
  note(u.n),`<section class="panel">${guide(u.n)}</section>`,
  `<nav class="pager" aria-label="Navigazione delle unità"><a href="${u.n===1?'../':'../unita-'+(u.n-1)+'/'}">← ${u.n===1?'Programma':'Unità '+(u.n-1)}</a><a href="${u.n===10?'../':'../unita-'+(u.n+1)+'/'}">${u.n===10?'Programma':'Unità '+(u.n+1)} →</a></nav>`,
  '</main>',footer(),script(true),'</body></html>'].join('\n');
  write(`unita-${u.n}/index.html`,html);
 }
 function casePage(){
  const sources=d.sources.map(s=>`<li><strong>${e(s.id)} — ${e(s.type)}</strong><p>${e(s.description)}</p><p class="small"><strong>Non dimostra:</strong> ${e(s.not_proved)}</p></li>`).join('');
  const chronology=d.chronology.map(s=>`<tr><td>${e(s.date)}</td><td>${e(s.source)}</td><td>${e(s.meaning)}</td><td>${e(s.type.replaceAll('_',' '))}</td></tr>`).join('');
  const matrix=d.assertions.map(s=>`<tr><th scope="row">${e(s.id)}</th><td>${e(s.claim)}</td><td>${e(s.references.join(', '))}</td><td>${e(s.grade.replaceAll('_',' '))}</td></tr>`).join('');
  const portrait=d.portrait.map(x=>`<p>${e(x.text)} <span class="case-ref">[${e(x.sources.join(' · '))}]</span></p>`).join('');
  const html=[
  head('Il quaderno di Nina — Caso R-01','Dossier didattico inventato con cinque tracce, cronologia, sette attestazioni e ritratto narrativo.',"caso-modello/",true),
  '<body data-course-root="true">',header(true),'<main id="contenuto">',
  `<div class="crumbs"><a href="../">Le storie che mancano</a> / Caso R-01</div>`,
  `<section class="hero"><p class="kicker">Caso dimostrativo · simulazione integrale</p><h1>Il quaderno di Nina</h1><p class="lead">Un ritratto costruito con cinque tracce incomplete. L’assenza di documenti diventa parte del metodo, non una scusa per inventare.</p><div class="facts"><span>${d.word_count} parole</span><span>5 fonti fittizie</span><span>7 schede</span></div></section>`,
  `<div class="notice"><strong>${e(d.warning)}</strong> Non contiene documenti autentici o materiali familiari di persone identificate.</div>`,
  `<section class="panel"><h2>Le cinque tracce simulate</h2><ul class="source-list">${sources}</ul></section>`,
  `<section class="panel"><h2>Cronologia con vuoti</h2><div class="scroll-x"><table class="matrix"><thead><tr><th>Quando</th><th>Traccia</th><th>Cosa si può dire</th><th>Stato</th></tr></thead><tbody>${chronology}</tbody></table></div></section>`,
  `<section class="panel" id="ritratto"><h2>Ritratto dimostrativo</h2><p class="subtle">Le sigle accanto ai paragrafi rimandano alle tracce simulate, non a fonti storiche reali.</p><article class="reading-block">${portrait}</article></section>`,
  `<section class="panel"><h2>Matrice delle affermazioni</h2><div class="scroll-x"><table class="matrix"><thead><tr><th>ID</th><th>Proposizione</th><th>Tracce</th><th>Stato</th></tr></thead><tbody>${matrix}</tbody></table></div><p><a href="./dossier.json">Esamina il fascicolo strutturato</a>.</p></section>`,
  `<section class="panel"><h2>Che cosa impariamo</h2><p>Una nota su una fotografia non identifica necessariamente la persona; la cartolina con firma completa non prova il proprietario del quaderno con sigla. Il caso insegna a costruire un ritratto coerente senza unire arbitrariamente gli indizi.</p><p><a href="../unita-1/">Comincia dalla prima unità →</a></p></section>`,
  '</main>',footer(),script(true),'</body></html>'].join('\n');
  write('caso-modello/index.html',html);
 }
 landing();p.units.forEach(unitPage);casePage();
 for(const f of ['index.html','caso-modello/index.html',...p.units.map(u=>`unita-${u.n}/index.html`)]){
  const html=fs.readFileSync(path.join(base,f),'utf8');
  if(!html.includes('lang="it"')||!html.includes('</main>')||!html.includes('officina.js?v=1'))throw Error('HTML incomplete '+f);
 }
 console.log('BIOGRAPHY_PAGES_GENERATED: landing + 10 units + case ('+d.word_count+' words)');
})();
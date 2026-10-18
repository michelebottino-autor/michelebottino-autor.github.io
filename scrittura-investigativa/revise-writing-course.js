/* Integration script: idempotent local edition; no network or external writes */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const unitRoot=__dirname;
const programPath=path.join(root,'catalogo','scrittura-investigativa-programma.json');
const catalogPath=path.join(root,'catalogo','corsi.json');
const course=JSON.parse(fs.readFileSync(path.join(unitRoot,'officina-percorso.json'),'utf8'));
const program=JSON.parse(fs.readFileSync(programPath,'utf8'));
const oldTitles=program.units.map(x=>x.title);
for(const u of course.units){
 const record=program.units.find(x=>x.number===u.number);
 if(!record)throw new Error('Program unit missing '+u.number);
 record.title=u.title;
 record.objective=u.outcome;
 record.lessons_status='editorial_pilot_available';
 record.writing_deliverable=u.assignment;
 record.assessment_policy='Bozza e autovalutazione locali; nessuna valutazione o attestato automatici.';
}
program.status='in_development';
program.educational_stage='editorial_pilot_available';
program.course_identity='Scrittura di articoli, inchieste, biografie e capitoli di non-fiction basati su fatti documentabili. La verifica delle fonti è competenza trasversale, non replica del corso Bottino Method.';
program.pilot_notice='Dieci lezioni e taccuino disponibili; non sono attivi account, caricamento elaborati, valutazione umana, iscrizioni o certificazioni.';
program.release_date=null;
fs.writeFileSync(programPath,JSON.stringify(program,null,2)+'\n','utf8');
const catalog=JSON.parse(fs.readFileSync(catalogPath,'utf8'));
const entry=catalog.courses.find(c=>c.id==='scrittura-investigativa-documentale');
if(!entry)throw new Error('Catalog course missing');
entry.status='in_development';
entry.description='Dieci laboratori di scrittura di opere documentate: idea, punto di vista, progetto, interviste, documenti, ritmo narrativo, revisione e portfolio. Lezioni consultabili in versione pilota; iscrizioni e attestati non attivi.';
entry.units=10;entry.duration_minutes=null;
fs.writeFileSync(catalogPath,JSON.stringify(catalog,null,2)+'\n','utf8');
function addAssets(s,prefix){
 if(!s.includes('officina-percorso.css')){
   if(!s.includes('</head>'))throw new Error('head missing');
   s=s.replace('</head>','<link rel="stylesheet" href="'+prefix+'officina-percorso.css?v=1"/></head>');
 }
 if(!s.includes('officina-percorso.js')){
   if(!s.includes('</body>'))throw new Error('body missing');
   s=s.replace('</body>','<script defer src="'+prefix+'officina-percorso.js?v=1"></script></body>');
 }
 return s;
}
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
for(const u of course.units){
 const file=path.join(unitRoot,'unita-'+u.number,'index.html');
 let s=fs.readFileSync(file,'utf8');
 s=addAssets(s,'../');
 const old=oldTitles[u.number-1];
 s=s.replaceAll(old,u.title);
 s=s.replace(/<title>[\s\S]*?<\/title>/i,'<title>Unità '+u.number+' · '+esc(u.title)+' | Scrittura Investigativa</title>');
 s=s.replace(/<meta\s+name="description"\s+content="[^"]*"/i,'<meta name="description" content="'+esc('Unità '+u.number+': '+u.outcome)+'"');
 fs.writeFileSync(file,s,'utf8');
}
const indexPath=path.join(unitRoot,'index.html');
let html=fs.readFileSync(indexPath,'utf8');
html=addAssets(html,'./');
html=html.replace(/<meta content="Corso di scrittura investigativa in dieci unità" name="description"\/>/,
 '<meta content="Corso di scrittura investigativa e non-fiction: 10 unità su progetto editoriale, interviste, documenti, narrazione e revisione." name="description"/>');
html=html.replace(/<h1>Scrittura Investigativa<\/h1>/,'<h1>Scrittura Investigativa e Ricostruzione dei Fatti Reali</h1>');
html=html.replace(/<p>Corso in dieci unità:[\s\S]*?<\/p>/,'<p>Dieci laboratori dedicati alla scrittura di articoli, inchieste, biografie e capitoli documentati: dalla prima idea a un testo originale revisionato. Il controllo delle fonti sostiene la scrittura, ma non sostituisce il progetto narrativo.</p>');
const list=course.units.map(u=>'<a href="unita-'+u.number+'/"><strong>'+String(u.number).padStart(2,'0')+' · '+esc(u.title)+'</strong><br/><small>'+esc(u.outcome)+'</small></a>').join('');
html=html.replace(/<div class="unitlist">[\s\S]*?<\/div>/,'<div class="unitlist">'+list+'</div>');
html=html.replace(/<section class="case">/,'<p><strong>Fonti autentiche:</strong> il <a href="documenti/">laboratorio documentale</a> propone collegamenti a istituzioni archivistiche e biblioteche. Le schede con metadati provvisori non costituiscono verifiche completate: occorre aprire l’originale e controllare i diritti di riuso.</p><section class="case">');
fs.writeFileSync(indexPath,html,'utf8');
const clientPath=path.join(unitRoot,'officina-percorso.js');
let client=fs.readFileSync(clientPath,'utf8');
client=client.replace('if(workshop) main.insertBefore(sec,workshop); else main.append(sec);','const intro=main.querySelector("h1");if(intro)(intro.nextElementSibling||intro).insertAdjacentElement("afterend",sec);else if(workshop) main.insertBefore(sec,workshop);else main.append(sec);');
fs.writeFileSync(clientPath,client,'utf8');
console.log('EDITORIAL_INTEGRATION_OK: 10 lessons, source links, local portfolio, Elena, catalog alignment');
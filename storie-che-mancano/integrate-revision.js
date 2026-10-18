(function integrateRevision(){
 const fs=require('fs'),path=require('path');
 const root=__dirname;
 function patch(p,anchor,marker,section){
  let s=fs.readFileSync(p,'utf8');
  if(s.includes(marker))return false;
  if(!s.includes(anchor))throw Error('Missing '+anchor+' in '+p);
  s=s.replace(anchor,section+anchor);fs.writeFileSync(p,s,'utf8');return true;
 }
 patch(path.join(root,'index.html'),'<section class="panel"><h2>Il caso modello R-01</h2>','id="nuovo-laboratorio-loc"',
 `<section class="panel" id="nuovo-laboratorio-loc"><h2>Laboratorio su fonti autentiche</h2><p>Accanto al caso inventato R-01 trovi un esercizio su <strong>Mary Church Terrell</strong>, con fotografie, diario e corrispondenza catalogati dalla Library of Congress. Il laboratorio distingue metadati controllati, informazioni di contesto e pagine originali ancora da leggere integralmente.</p><p><a href="./laboratorio-autentico/">Apri l'esercitazione con fonti autentiche →</a></p></section>`);
 patch(path.join(root,'index.html'),'<section class="panel"><h2>I tuoi progressi nel browser</h2>','id="rubrica-esempio-r01"',
 `<section class="panel" id="rubrica-esempio-r01"><h2>Come si valuta un ritratto</h2><p>Il caso simulato è accompagnato da una <a href="./caso-modello/valutazione/">rubrica dimostrativa con cinque criteri e motivazioni</a>. È una revisione editoriale assistita da IA, non una prova superata da uno studente. L'assenza di valutazione umana resta dichiarata.</p></section>`);
 for(const i of [2,3,5,9,10]){
  const file=path.join(root,'unita-'+i,'index.html');
  patch(file,'<section class="panel"><h2>Dal documento alla scrittura</h2>','archivio-autentico-unit-'+i,
  `<section class="panel archivio-autentico-unit-${i}"><h2>Prova su una fonte autentica</h2><p>Vuoi confrontarti con descrizioni archivistiche reali? Consulta il <a href="../laboratorio-autentico/">laboratorio della Library of Congress su Mary Church Terrell</a>. Le schede aiutano a distinguere la datazione approssimativa di un ritratto, un diario e una cartella di corrispondenza senza inventare dettagli biografici.</p></section>`);
 }
 patch(path.join(root,'caso-modello','index.html'),'<section class="panel"><h2>Che cosa impariamo</h2>','id="valutazione-interna-r01"',
 `<section class="panel" id="valutazione-interna-r01"><h2>La revisione del modello</h2><p>Il ritratto inventato è stato esaminato con una rubrica di cinque criteri: <strong>77/100 è soltanto un punteggio redazionale dimostrativo</strong>. Nessun docente indipendente ha valutato il testo e le cinque tracce non sono documenti storici.</p><p><a href="./valutazione/">Leggi la valutazione motivata e i limiti del punteggio</a>.</p></section>`);
 const scorePath=path.join(root,'caso-modello','valutazione','index.html');
 let h=fs.readFileSync(scorePath,'utf8');h=h.replace('href="./valutazione-dimostrativa.json"','href="../valutazione-dimostrativa.json"');
 fs.writeFileSync(scorePath,h,'utf8');
 const prog=path.join(root,'programma.json'),syllabus=JSON.parse(fs.readFileSync(prog,'utf8'));
 syllabus.authentic_lab={id:'LOC-01',status:'catalog_records_verified_full_manuscript_collation_pending',subject:'Mary Church Terrell',path:'./laboratorio-autentico/',references:4,claims_and_open_questions:8,source_register:'./laboratorio-autentico/fonti-verificate.json',rights_mode:'links_only'};
 syllabus.model_assessment={case_id:'R-01',score_illustrative:77,max:100,judgment_type:'internal_AI_assisted_editorial_example',human_review_completed:false,certification:false,path:'./caso-modello/valutazione/'};
 fs.writeFileSync(prog,JSON.stringify(syllabus,null,2)+'\n','utf8');
 const sitemap=path.join(root,'..','sitemap.xml');let xml=fs.readFileSync(sitemap,'utf8');
 for(const slug of ['laboratorio-autentico/','caso-modello/valutazione/']){
  const loc='https://michelebottino-autor.github.io/storie-che-mancano/'+slug;
  if(!xml.includes('<loc>'+loc+'</loc>')){
   if(!xml.includes('</urlset>'))throw Error('Invalid sitemap');
   xml=xml.replace('</urlset>','  <url>\n    <loc>'+loc+'</loc>\n    <lastmod>2026-10-18</lastmod>\n    <priority>0.5</priority>\n  </url>\n</urlset>');
  }
 }
 fs.writeFileSync(sitemap,xml,'utf8');
 console.log('BIOGRAPHY_SUPPLEMENT_LINKS_OK: homepage, case, 5 lessons, sitemap, program, rubric path');
})();
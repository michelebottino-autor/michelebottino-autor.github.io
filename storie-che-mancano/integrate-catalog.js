(function integrateCatalog(){
 const fs=require('node:fs'),path=require('node:path');
 const root=path.resolve(__dirname,'..');
 const p=JSON.parse(fs.readFileSync(path.join(__dirname,'programma.json'),'utf8'));
 const cfile=path.join(root,'catalogo','corsi.json'),catalog=JSON.parse(fs.readFileSync(cfile,'utf8'));
 const course=catalog.courses.find(x=>x.id==='storie-che-mancano');
 if(!course||!['coming_soon','in_development'].includes(course.status))throw Error('Course record unexpectedly changed');
 Object.assign(course,{status:'in_development',level:'Introduttivo',url:'../storie-che-mancano/',units:10,duration_minutes:null,
 description:'Da fotografie, lettere e memorie frammentarie a un ritratto documentario breve. Dieci unità introduttive con esercizi, taccuino e caso integralmente simulato. Versione pilota.',
 audience:['Persone che custodiscono memorie familiari','Lettori e aspiranti autori alle prime esperienze','Chi desidera raccontare una vita attraverso tracce incomplete'],
 learning_outcomes:p.learning_outcomes,
 level_details:{category:'introduttivo',framework:'classificazione didattica interna, non EQF né titolo professionale',mandatory_previous_courses:[],prior_certificate_required:false,focus:'ritratto biografico breve con tracce incomplete',final_output:'550–850 parole con cronologia e fonti'},
 enrollment:{enabled:false},interest:{type:'none',email:'',status:'not_enabled'},pricing:{payment_enabled:false},
 pilot:{status:'editorial_preview_available',certificates_issued:false,assessment_human_only:true,student_trials_completed:0,human_review_completed:false,source_case_simulated:true}});
 course.locales.it='in_review';course.source_locale='it';
 fs.writeFileSync(cfile,JSON.stringify(catalog,null,2)+'\n','utf8');
 const formation=path.join(root,'formazione','index.html');let h=fs.readFileSync(formation,'utf8');
 if(!h.includes('id="storie-che-mancano-pilota-20261018"')){
  if(!h.includes('</main>'))throw Error('Formazione main not found');
  const fragment='<section class="notice" id="storie-che-mancano-pilota-20261018"><h2>Le storie che mancano · livello introduttivo</h2><p>Un percorso pilota di dieci unità per trasformare fotografie, lettere e memorie incomplete in un ritratto biografico breve. Consultazione gratuita e taccuino locale. Non sono attivi iscrizioni, correzione ufficiale o attestati.</p><p><a href="/storie-che-mancano/">Consulta il programma e le lezioni</a></p></section>';
  h=h.replace('</main>',fragment+'</main>');fs.writeFileSync(formation,h,'utf8');
 }
 const sitemap=path.join(root,'sitemap.xml'),baseUrl='https://michelebottino-autor.github.io/storie-che-mancano/';
 let xml=fs.readFileSync(sitemap,'utf8');
 const urls=['',...Array.from({length:10},(_,i)=>'unita-'+(i+1)+'/'),'caso-modello/'];let added=0;
 for(const rel of urls){
  const loc=baseUrl+rel;
  if(!xml.includes('<loc>'+loc+'</loc>')){
   if(!xml.includes('</urlset>'))throw Error('Invalid sitemap');
   const record='  <url>\n    <loc>'+loc+'</loc>\n    <lastmod>2026-10-18</lastmod>\n    <priority>'+(rel?'0.5':'0.7')+'</priority>\n  </url>\n';
   xml=xml.replace('</urlset>',record+'</urlset>');added++;
  }
 }
 fs.writeFileSync(sitemap,xml,'utf8');
 console.log('BIOGRAPHY_CATALOG_LINKED status=in_development level=Introduttivo routes=12 sitemap_added='+added);
})();
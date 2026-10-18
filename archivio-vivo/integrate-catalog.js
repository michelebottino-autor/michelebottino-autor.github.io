(function integrateArchiveCourse(){
 const fs=require('fs'),path=require('path'),courseDir=__dirname,root=path.resolve(courseDir,'..');
 const p=JSON.parse(fs.readFileSync(path.join(courseDir,'programma.json'),'utf8'));
 const file=path.join(root,'catalogo','corsi.json'),catalog=JSON.parse(fs.readFileSync(file,'utf8'));
 const course=catalog.courses.find(x=>x.id==='archivio-vivo');
 if(!course||!['coming_soon','in_development'].includes(course.status))throw Error('Unexpected course catalogue state');
 Object.assign(course,{
  status:'in_development',level:'Intermedio',url:'../archivio-vivo/',units:10,duration_minutes:null,
  description:'Dal fondo al racconto pubblico: dieci unità su inventario, provenienza, cronologia, citazioni e progettazione di un percorso accessibile. Anteprima didattica.',
  audience:['Custodi di archivi personali, biblioteche e associazioni','Autori interessati al racconto del patrimonio documentale','Partecipanti con capacità iniziali di lettura e scrittura'],
  learning_outcomes:p.learning_outcomes,
  level_details:{classification:'intermedio, scala didattica interna non EQF',mandatory_prior_courses:[],recommended:'Lettura, sintesi e scrittura iniziali',final_project:'racconto di 900–1.300 parole con sei unità, matrice, cronologia, didascalie e revisione'},
  enrollment:{enabled:false},
  interest:{type:'none',email:'',status:'not_enabled'},
  pricing:{payment_enabled:false},
  pilot:{status:'editorial_preview_available',human_review:false,student_trials_completed:0,real_archive_demo:'three official LOC pages from same newspaper',simulated_case:'A-01',certification:false}
 });
 course.locales.it='in_review';course.source_locale='it';
 fs.writeFileSync(file,JSON.stringify(catalog,null,2)+'\n','utf8');
 const formation=path.join(root,'formazione','index.html');let h=fs.readFileSync(formation,'utf8');
 if(!h.includes('id="archivio-vivo-pilota-20261018"')){
  if(!h.includes('</main>'))throw Error('Formation page lacks main end');
  const section='<section class="notice" id="archivio-vivo-pilota-20261018"><h2>L’archivio diventa racconto · livello intermedio</h2><p>Dieci unità di progettazione narrativa da un insieme di fonti archivistiche, con caso simulato A-01, laboratorio su giornali autentici e taccuino locale. Anteprima senza iscrizioni, correzioni ufficiali o attestati.</p><p><a href="/archivio-vivo/">Consulta il corso e il laboratorio</a></p></section>';
  h=h.replace('</main>',section+'</main>');
  fs.writeFileSync(formation,h,'utf8');
 }
 const sitemap=path.join(root,'sitemap.xml');let xml=fs.readFileSync(sitemap,'utf8');
 const routes=['',...Array.from({length:10},(_,i)=>'unita-'+(i+1)+'/'),'caso-A01/','laboratorio-storico/'];
 let count=0;
 for(const route of routes){
  const loc='https://michelebottino-autor.github.io/archivio-vivo/'+route;
  if(!xml.includes('<loc>'+loc+'</loc>')){
   if(!xml.includes('</urlset>'))throw Error('Invalid sitemap');
   xml=xml.replace('</urlset>','  <url>\n    <loc>'+loc+'</loc>\n    <lastmod>2026-10-18</lastmod>\n    <priority>'+(route?'0.5':'0.7')+'</priority>\n  </url>\n</urlset>');count++;
  }
 }
 fs.writeFileSync(sitemap,xml,'utf8');
 console.log('ARCHIVIO_CATALOG_OK: level=Intermedio status=in_development new_routes='+count);
})();
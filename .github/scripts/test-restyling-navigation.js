#!/usr/bin/env node
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const pages=['index.html','biografia/index.html','opere/index.html','ricerca/index.html','articoli/index.html','contatti/index.html','adc/index.html','adc/fonti/index.html','poetica/index.html','metodo/index.html','indagini/index.html','media/index.html','testi-musicali/index.html'];
const styles=['assets/css/nav-unificata-2026.css','assets/css/editoriale-mockup-approvato.css','assets/js/site-nav.js'];
let failures=[];
for(const p of styles)if(!fs.existsSync(path.join(root,p)))failures.push('Risorsa assente: '+p);
for(const p of pages){
 const x=fs.readFileSync(path.join(root,p),'utf8');
 for(const href of ['/assets/css/nav-unificata-2026.css','/assets/css/editoriale-mockup-approvato.css']){
  const n=x.split('href="'+href+'"').length-1;
  if(n>1)failures.push(p+': riferimento duplicato '+href+' presente '+n+' volte');
 }
 if((x.match(/id="site-nav"/g)||[]).length>1)failures.push(p+': navigazione generale duplicata');
 if((x.match(/id="menu"/g)||[]).length>1)failures.push(p+': menu generale duplicato');
 if(!/<nav\b|<header\b/.test(x))failures.push(p+': struttura di navigazione assente');
 if(p!=='index.html' && !x.includes('src="/assets/js/site-nav.js"'))failures.push(p+': JS navigazione mancante');
 if(/<button\b(?=[^>]*class="menu-toggle")[^>]*onclick\s*=/.test(x))failures.push(p+': gestore inline duplicato sul menu');
 for(const url of ['/formazione/','/adc/','/opere/','/contatti/'])if(!x.includes('href="'+url+'"') && !(p==='index.html' && x.includes('href="'+url.slice(1)+'"')))failures.push(p+': collegamento mancante '+url);
}
console.log('Pagine controllate: '+pages.length);
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('Verifiche statiche navigazione e CSS superate. Non sostituisce un collaudo visivo.');

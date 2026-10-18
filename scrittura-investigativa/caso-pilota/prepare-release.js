'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
let count=0;
for(const file of ['scrittura-investigativa/index.html',...Array.from({length:10},(_,i)=>'scrittura-investigativa/unita-'+(i+1)+'/index.html')]){
 const f=path.join(root,file),text=fs.readFileSync(f,'utf8');
 const updated=text.replace(/officina-percorso\.(css|js)\?v=1/g,'officina-percorso.$1?v=2');
 if(updated!==text){fs.writeFileSync(f,updated,'utf8');count++;}
}
const xmlPath=path.join(root,'sitemap.xml');
let xml=fs.readFileSync(xmlPath,'utf8');
const loc='https://michelebottino-autor.github.io/scrittura-investigativa/caso-pilota/';
if(!xml.includes(loc)){
 if(!xml.includes('</urlset>'))throw Error('Invalid sitemap');
 xml=xml.replace('</urlset>','  <url>\n    <loc>'+loc+'</loc>\n    <lastmod>2026-10-18</lastmod>\n    <priority>0.7</priority>\n  </url>\n</urlset>');
 fs.writeFileSync(xmlPath,xml,'utf8');
}
const p=JSON.parse(fs.readFileSync(path.join(__dirname,'dossier.json'),'utf8'));
if(p.sources[0].visual_checked!==true)throw Error('Visual verification evidence missing');
console.log('PILOT_RELEASE_PREP_OK pages_cache_refreshed='+count+' sitemap='+xml.includes(loc));
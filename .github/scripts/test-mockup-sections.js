#!/usr/bin/env node
const fs=require('fs'),path=require('path');
const pages=['biografia','opere','adc','ricerca','contatti'];
let errors=[];
for(const name of pages){
 const source=fs.readFileSync(path.join(name,'index.html'),'utf8');
 for(const token of ['mockup-sezioni-2026.css','class="mockup-hero','</main>','id="site-nav"'])if(!source.includes(token))errors.push(name+': missing '+token);
 const hero=source.match(/<section class="mockup-hero[^]*?<\/section>/);
 if(!hero||!/<h1\b/.test(hero[0]))errors.push(name+': hero/h1 missing');
}
if(!fs.existsSync('assets/css/mockup-sezioni-2026.css'))errors.push('shared CSS missing');
console.log('Audited 5 mockup sections; issues: '+errors.length);if(errors.length){console.error(errors.join('\n'));process.exit(1);}

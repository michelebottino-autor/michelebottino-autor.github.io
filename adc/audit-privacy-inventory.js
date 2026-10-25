'use strict';
/** Inventario tecnico: nessuna scansione di nomi, contenuti sensibili o dati personali. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const skip=new Set(['.git','node_modules','.cache']);
const inventory=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(skip.has(e.name))continue;const absolute=path.join(dir,e.name);if(e.isDirectory())walk(absolute);else if(e.isFile())inventory.push(path.relative(root,absolute).split(path.sep).join('/'));}}
walk(root);
const html=inventory.filter(x=>x.endsWith('.html')),media=inventory.filter(x=>/\.(png|jpg|jpeg|webp|svg|tiff?|gif)$/i.test(x)),pdf=inventory.filter(x=>/\.pdf$/i.test(x));
const scoped=html.filter(p=>p.startsWith('adc/')||p.startsWith('articoli/')||p.startsWith('biografia/'));
const counts={html_pages:html.length,media_files:media.length,pdf_files:pdf.length,selected_pages:scoped.length,rights_link_missing:0,forms_present:0,robots_meta_present:0};
const review=[];
for(const file of scoped){const page=fs.readFileSync(path.join(root,file),'utf8');const linked=page.includes('/rettifiche-e-diritti/');const form=/<form\b/i.test(page);const robot=/<meta\b[^>]*name\s*=\s*["'](?:robots|googlebot)["']/i.test(page);if(!linked)counts.rights_link_missing++;if(form)counts.forms_present++;if(robot)counts.robots_meta_present++;if(!linked||form)review.push({path:file,missing_rights_link:!linked,form_requires_manual_review:form});}
const format=process.argv.includes('--json')?JSON.stringify({counts,review},null,2):'ADC_PRIVACY_INVENTORY '+JSON.stringify(counts)+'\n'+review.map(x=>x.path+' | rights_link_missing='+x.missing_rights_link+' | form_review='+x.form_requires_manual_review).join('\n');
console.log(format);

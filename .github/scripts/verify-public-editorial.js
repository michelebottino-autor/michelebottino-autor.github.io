'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const publicHtml=[];
function scan(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  if(['.git','node_modules','_site','vendor'].includes(entry.name))continue;
  const file=path.join(dir,entry.name);
  if(entry.isDirectory())scan(file);
  else if(entry.isFile()&&entry.name.endsWith('.html'))publicHtml.push(file);
 }
}
const disallowed=[
 {id:'internal-school-note',re:/Informazioni sulla Scuola[\s\S]{0,600}(?:sperimentazione con studenti reali|revisione umana indipendente|accademia legalmente accreditata)/i},
 {id:'internal-pilot-banner',re:/(?:Versione pilota per autoapprendimento|Pilota per autoapprendimento)/i},
 {id:'internal-release-description',re:/(?:la versione pilota è tecnicamente collaudata|non è stata ancora validata con partecipanti reali)/i},
 {id:'internal-ai-status',re:/(?:Risposte predefinite, non assistente generativo|Risposte preparate, non assistente generativo|non è collegata al backend generativo locale)/i},
 {id:'release-verbal-in-ui',re:/(?:Consulta il verbale di chiusura editoriale|STATO_PRONTEZZA_PILOTA\.md)/i},
 {id:'internal-operations',re:/\b(?:regression test passed|debug log|internal deployment note|rilascio non ancora collaudato)\b/i}
];
function validate(file,content){
 const issues=[];
 for(const rule of disallowed)if(rule.re.test(content))issues.push(rule.id);
 const f=String(file).replaceAll('\\','/');
 if(/\.html$/i.test(f)){
  const footers=content.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi)||[];
  if(footers.some(x=>/(?:non certificativ|versione pilota|revisione umana|sperimentazione)/i.test(x)))issues.push('technical-status-in-footer');
 }
 return issues;
}
if(process.argv.includes('--self-test')){
 assert.deepEqual(validate('formazione/index.html','<section><h2>Informazioni sulla Scuola</h2>Una sperimentazione con studenti reali non completata</section>'),['internal-school-note']);
 assert.deepEqual(validate('corso/index.html','<footer>Versione pilota, non certificativa</footer>'),['technical-status-in-footer']);
 assert.deepEqual(validate('fonti.html','<p>La pergamena non è datata con certezza e le fonti sono discordanti.</p>'),[]);
 console.log('EDITORIAL_GUARD_SELFTEST_OK');
 process.exit(0);
}
scan(root);
const failures=[];
for(const file of publicHtml){
 const data=fs.readFileSync(file,'utf8'),problems=validate(file,data);
 if(problems.length)failures.push({file:path.relative(root,file).replaceAll('\\','/'),problems});
}
const jsonFiles=['adc/assets/elena-risposte.json','adc/assets/elena-memoria-pubblica.json'];
for(const name of jsonFiles){
 const fp=path.join(root,name);
 if(fs.existsSync(fp)){
  const data=fs.readFileSync(fp,'utf8');
  JSON.parse(data);
  const bad=validate(name,data);
  if(bad.length)failures.push({file:name,problems:bad});
 }
}
if(failures.length){
 console.error('PUBLIC_EDITORIAL_GUARD_FAILED');
 for(const error of failures)console.error(error.file+' -> '+error.problems.join(', '));
 process.exitCode=1;
}else{
 console.log('PUBLIC_EDITORIAL_GUARD_OK:',publicHtml.length,'HTML pages and Elena public data checked');
}

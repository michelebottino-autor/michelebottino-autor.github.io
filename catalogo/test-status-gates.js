'use strict';
// Audit conservativo dei percorsi formativi; non pubblica o modifica lo stato dei corsi.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=__dirname;
const catalog=JSON.parse(fs.readFileSync(path.join(root,'corsi.json'),'utf8'));
const courses=catalog.courses;
assert.equal(courses.length,14,'Il catalogo deve contenere 14 percorsi; riesaminare le regole se cambia');
const tally={};for(const course of courses)tally[course.status]=(tally[course.status]||0)+1;
assert.equal(tally.published,1);assert.equal(tally.in_development,6);assert.equal(tally.coming_soon,7);
const ids=new Set(),slugs=new Set();
for(const c of courses){
 assert.ok(c.id&&!ids.has(c.id),'ID corso assente o duplicato: '+c.id);ids.add(c.id);
 assert.ok(c.slug&&!slugs.has(c.slug),'Slug assente o duplicato: '+c.id);slugs.add(c.slug);
 if(c.status==='coming_soon'){
  assert.equal(c.enrollment?.enabled,false,'Iscrizioni non ammesse in anteprima: '+c.id);
  assert.notEqual(c.pricing?.payment_enabled,true,'Pagamento non ammesso in anteprima: '+c.id);
  assert.ok(!c.url||c.url.startsWith('#'),'Non collegare un corso futuro a una lezione pubblicata: '+c.id);
 }
 if(c.id==='fotografie-senza-nome'){assert.equal(c.status,'in_development');assert.equal(c.url,'../fotografie-senza-nome/');assert.equal(c.enrollment.enabled,false);assert.equal(c.pricing.payment_enabled,false);}
 if(c.id==='cronologie-impossibili'){assert.equal(c.status,'in_development');assert.equal(c.url,'../cronologie-impossibili/');assert.equal(c.enrollment.enabled,false);assert.equal(c.pricing.payment_enabled,false);}
 if(c.id==='museo-in-una-stanza'){assert.equal(c.status,'in_development');assert.equal(c.url,'../museo-in-una-stanza/');assert.equal(c.enrollment.enabled,false);assert.equal(c.pricing.payment_enabled,false);}
 if(c.syllabus){
  const file=path.resolve(root,c.syllabus);
  assert.ok(file.startsWith(root+path.sep),'Percorso syllabus esterno al catalogo: '+c.id);
  assert.ok(fs.existsSync(file),'Programma indicato ma inesistente: '+c.id);
  const program=JSON.parse(fs.readFileSync(file,'utf8'));
  assert.equal(program.course_id,c.id,'Syllabus non coerente: '+c.id);
  if(c.status==='coming_soon'){
   assert.equal(program.status,'editorial_draft','Bozza futura non marcata come bozza: '+c.id);
   assert.ok(program.units.every(u=>['pilot_draft','outline'].includes(u.status)),'Unità futura presentata come completa: '+c.id);
  }
 }
}
console.log('CATALOG_GATES_OK:',JSON.stringify(tally),'syllabi=',courses.filter(c=>c.syllabus).length);

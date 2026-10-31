const assert=require('node:assert/strict');
const fs=require('node:fs');
const engine=require('../../adc/assets/elena-dialogo.js');
const index=JSON.parse(fs.readFileSync('adc/assets/elena-indice.json','utf8'));
const approved=JSON.parse(fs.readFileSync('adc/assets/elena-risposte-approvate.json','utf8')).answers;
assert(Array.isArray(index.entries)&&index.entries.length>0,'Indice vuoto');
assert(Array.isArray(approved),'Registro approvazioni invalido');
const questions=['castello 1213','chiese medievali','zucchero Mirulla','ponte Alcantara','testimonianza sconosciutazzxq'];
for(const q of questions){
 const result=engine.reply(q,index,approved);
 assert(['documentary','index','empty'].includes(result.kind));
 assert(result.links.every(x=>engine.safeUrl(x.url)),'Collegamento non autorizzato');
 if(result.kind==='documentary')assert(approved.some(a=>a.status==='APPROVED_FOR_PUBLICATION'&&engine.normalize(a.question)===engine.normalize(q)),'Risposta non approvata');
 console.log(q+': '+result.kind+' ('+result.links.length+' collegamenti)');
}
assert.equal(engine.reply('testimonianza sconosciutazzxq',index,approved).kind,'empty');
assert.equal(engine.safeUrl('https://example.com'),false);
assert.equal(engine.safeUrl('/adc/../../private'),false);
assert.equal(engine.contextualQuery('Quali fonti?', 'castello 1213').includes('castello'),true);
console.log('Elena: verifiche di prudenza documentaria e collegamenti superate.');

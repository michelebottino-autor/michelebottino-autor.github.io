/* Collaudo offline del motore civico; non effettua chiamate a servizi esterni. */
'use strict';
const assert=require('node:assert/strict');
const civic=require('../adc/assets/elena-comune.js');
const base=require('../adc/assets/elena-comune-fonti.json');
const asks=[
 ['mensa scolastica','school_meals','Refezione scolastica'],
 ['scuolabus a Calatabiano','school_bus','Trasporto scolastico'],
 ['raccolta carta e cartone','waste_paper','carta e cartone'],
 ['calendario raccolta rifiuti','waste_directory','Raccolta differenziata'],
 ['protezione civile','civil_protection','Protezione civile'],
 ['ordinanze comunali','ordinances','Ordinanze'],
 ['servizi sociali','social_services','assistenza sociale']
];
const guides=new Map(base.service_guides.map(g=>[g.id,g]));
for(const [question,id,label] of asks){
 const r=civic.reply(question,base,{entries:[],checked_at:'2024-01-01'});
 assert.equal(r?.kind,'civic',question);
 assert.match(r.title,new RegExp(label,'i'),question);
 assert.equal(r.links[0].url,guides.get(id).source_url);
 assert.equal(civic.official(r.links[0].url),true);
 assert.ok(r.limitation.length>35);
 console.log('OK',id);
}
const waste=civic.reply('Quando passa raccolta umido?',base,null);
assert.equal(waste.kind,'civic');
assert.ok(/non.*calendario|calendario.*non/i.test(waste.limitation));
const noNews=civic.reply('ultime notizie del comune',base,{entries:[],checked_at:'2020-01-01'});
assert.match(noNews.text,/non dispongo/i);
const bogus={...base,service_guides:[{...guides.get('school_meals'),source_url:'https://falso.example/mensa'}]};
assert.notEqual(civic.reply('mensa scolastica',bogus,null)?.title,'Refezione scolastica 2026/2027');
console.log('TEST_SERVIZI_OK',asks.length+3);

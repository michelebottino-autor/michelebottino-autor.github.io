#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const e=require('../../adc/assets/elena-dialogo.js');
const index=require('../../adc/assets/elena-indice.json');
const approved=require('../../adc/assets/elena-risposte-approvate.json');
const first=e.reply('Processo 334',index,approved.answers);
assert.equal(first.kind,'index');
assert(first.links.some(l=>l.url==='/adc/processo-334/'));
const contextual=e.contextualQuery('Quali documenti?', 'Processo 334');
const second=e.reply(contextual,index,approved.answers);
assert(second.links.some(l=>l.url==='/adc/processo-334/'));
const empty=e.reply('zxqvtrpl inesistente',index,approved.answers);
assert.equal(empty.kind,'empty');
assert(approved.answers.length>=1);
const historical=e.reply('Chi possedeva il castello di Calatabiano nel 1213?',index,approved.answers);
assert.equal(historical.kind,'documentary');
assert(historical.text.includes('15.000 tarì'));
assert(historical.links.some(l=>l.url==='/adc/dossier-1213-1537/'));
assert(historical.limitation.includes('edizione a stampa'));

assert(!first.text.includes('è attestato che'));
const catalog=require('../../adc/assets/elena-passaggi-pubblicati.json');
const groups={
  'adc-notizia-1537':[
    'Zuccheri 1537', 'Che cosa sappiamo di Pietro Faraone nel 1537?',
    'Trascrivi l’atto originale del 1537 sugli zuccheri', 'Mirulla e la cannamela nel 1537'
  ],
  'adc-0002':[
    'Cosa dice la voce 897?', 'Santa Maria e il cappellano Tommaso nelle decime',
    'Santa Maria nelle Rationes del 1308–1310', 'Tommaso cappellano della chiesa di Santa Maria'
  ],
  'aggiornamento-20261111':[
    'Che cosa è stato accertato sul Processo 334?', 'A chi si riferisce il fascicolo 334?',
    'Processo n. 334', 'Processo d’investitura 334 e vendita del 1484'
  ],
  'adc-notizia-1213':[
    'Che cosa conferma il privilegio regio del 1213?', 'Dove è edito il privilegio regio del 1213?',
    'Hillen e il castello nel 1213', 'La concessione del castrum Calatabianum nel 1213'
  ],
  'adc-0012':[
    'Chi aveva diritto all’acqua del mulino di Gullia?', 'Che cosa accadde a Gullia nel 1217?',
    'Pascoli e acqua a Gullia', 'Costantino de Fimi e il mulino di Gullia'
  ]
};
for(const [anchor,queries] of Object.entries(groups)){
  for(const query of queries){
    assert.equal(e.publishedPassageFor(query,catalog)?.anchor,anchor,query);
  }
}
const negatives=[
  'Zuccheri 1537 o 1538', 'Cosa sappiamo del mulino di Gullia nel 1225?',
  'Chiesa di Santa Maria', 'Santa Maria nelle decime del 1350',
  'Quale privilegio del castello fu emanato nel 1214?', 'Processo 334 del 1537',
  'Processo 184', 'Canna da zucchero', 'Gullia', 'Lavori della ferrovia nel 1924'
];
for(const query of negatives)assert.equal(e.publishedPassageFor(query,catalog),null,query);
const typed=catalog.entries[0];
assert.equal(e.publishedPassageFor('Zuccheri 1537',{schema:1,entries:[typed,typed]}),null);
assert.equal(e.publishedPassageFor('Zuccheri 1537',{schema:1,entries:[{...typed,path:'/adc/../'}]}),null);
assert.equal(e.publishedPassageFor('Zuccheri 1537',{schema:2,entries:[typed]}),null);
console.log('ELENA_REPERTORIO: 20 domande coperte, 10 senza passaggio, tre controlli di integrità.');

console.log('ELENA_DIALOGO_VERIFICATO: indice, risposta E-026 documentata, domanda successiva, astensione senza fonti.');

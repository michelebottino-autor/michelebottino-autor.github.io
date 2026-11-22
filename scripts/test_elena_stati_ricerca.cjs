'use strict';
const assert=require('node:assert/strict');
const engine=require('../adc/assets/elena-dialogo.js');
const status=require('../adc/assets/elena-stati-ricerca.json');
const index=require('../adc/assets/elena-indice.json');
const approved=require('../adc/assets/elena-risposte-approvate.json').answers;
const knowledge=require('../adc/assets/elena-conoscenza-verificata.json');
let passed=0;
function t(name,check){check();passed++;console.log('PASS',name)}
function ask(q){return engine.reply(q,index,approved,knowledge,null,null,null,null,status)}
t('schema and controlled number',()=>{assert.equal(status.schema,1);assert.equal(status.entries.length,4);assert.equal(new Set(status.entries.map(e=>e.id)).size,4)});
t('processo 184 unavailable',()=>{let r=ask('Possedete il processo 184?');assert.equal(r.kind,'research-status');assert.equal(r.id,'ADC-016');assert.match(r.text,/non è disponibile/)});
t('processo 334 not blocked',()=>assert.notEqual(ask('Processo 334').kind,'research-status'));
t('annunziata crypt',()=>{let r=ask('La cripta dell Annunziata ha nicchie mortuarie?');assert.equal(r.id,'ADC-001');assert.equal(r.kind,'research-status')});
t('Annunziata generic unaffected',()=>assert.notEqual(ask('Chiesa Annunziata Calatabiano').kind,'research-status'));
t('Madonna Imperio 1092',()=>assert.equal(ask('Madonna Imperio fondata nel 1092?').id,'ADC-010'));
t('Imperio generic unaffected',()=>assert.notEqual(ask('Madonna Imperio').kind,'research-status'));
t('Ignazio Gravina buried in crypt',()=>assert.equal(ask('Ignazio Gravina sepolto nella cripta?').id,'ADC-002'));
t('Ignazio Gravina without tomb unaffected',()=>assert.notEqual(ask('Ignazio Gravina').kind,'research-status'));
t('ordinary question still documentary',()=>assert.equal(ask('Chi possedeva il castello di Calatabiano nel 1213?').kind,'documentary'));
t('unrelated input unaffected',()=>assert.notEqual(ask('Cosa sai sul ponte Alcantara?').kind,'research-status'));
t('ambiguous matches are not invented',()=>assert.equal(engine.researchStatus('ignazio gravina cripta annunziata',status),null));
t('unsafe registry link rejected',()=>{const bad=JSON.parse(JSON.stringify(status));bad.entries[0].links=[{title:'sito falso',url:'https://attacker.example/'}];assert.equal(engine.researchStatus('cripta annunziata',bad),null)});
t('missing registry fails open to existing path',()=>assert.notEqual(engine.reply('Processo 184',index,approved,knowledge).kind,'research-status'));
console.log('ELENA_RESEARCH_STATUS_TESTS',passed);

const assert=require('node:assert/strict');
const civic=require('../adc/assets/elena-comune.js');
globalThis.ElenaComune=civic;
const engine=require('../adc/assets/elena-dialogo.js');
const base=require('../adc/assets/elena-comune-fonti.json');
const admin=require('../adc/assets/elena-amministrazione.json');
const index=require('../adc/assets/elena-indice.json');
const approved=require('../adc/assets/elena-risposte-approvate.json').answers;
const kb=require('../adc/assets/elena-conoscenza-verificata.json');
const news=require('../adc/assets/elena-comune-news.json');
const checks=require('../adc/assets/elena-comune-verifiche.json');
const ask=q=>engine.reply(q,index,approved,kb,base,news,checks,admin);
const tests=[
 ['sindaco',()=>assert.match(ask('Chi è il sindaco di Calatabiano?').text,/Antonio Filippo Petralia/)],
 ['vicesindaca',()=>assert.match(ask('Chi è il vicesindaco?').text,/Vanessa Gambacurta/)],
 ['giunta',()=>assert.match(ask('Chi sono gli assessori della giunta comunale?').text,/Valeria Ferretti/)],
 ['consiglio',()=>assert.match(ask('Chi sono i consiglieri del consiglio comunale?').text,/Veronica Intelisano/)],
 ['presidente consiglio',()=>assert.match(ask('Chi presiede il consiglio comunale?').text,/Paolo Fabiano Calabrese/)],
 ['commissaria storica',()=>assert.match(ask('Rossana Manno era commissaria nel marzo 2026?').text,/2026/)],
 ['residenza',()=>assert.match(ask('Come fare cambio residenza?').title,/Cambio abitazione/)],
 ['identità',()=>assert.match(ask('Come richiedere carta di identita elettronica?').title,/Carta d.identità/)],
 ['accesso atti',()=>assert.match(ask('Come fare accesso agli atti?').title,/Accesso agli atti/)],
 ['suap',()=>assert.match(ask('Come aprire attivita con SUAP?').title,/SUAP/)],
 ['edilizia',()=>assert.match(ask('Come presentare CILA pratica edilizia?').title,/SUE/)],
 ['tributi',()=>assert.match(ask('Come fare dichiarazione tari?').title,/TARI/)],
 ['segnalazioni',()=>assert.match(ask('Come segnalare disservizio raccolta?').title,/Segnalare un disservizio/)],
 ['storia preservata',()=>assert.equal(ask('Chi possedeva il castello di Calatabiano nel 1213?').kind,'documentary')],
 ['niente documenti privati',()=>assert.ok(admin.procedures.every(p=>!p.summary.includes('Invia i documenti alla chat')))],
 ['disambiguazione cognome',()=>assert.match(ask('Che ruolo ha Antonino Fazio?').title,/Antonino Fazio/)],
 ['nome solo ambiguo',()=>assert.notEqual(ask('Chi è Antonino?').kind,'civic')],
 ['filippa noto',()=>assert.match(ask('Chi è Filippa Noto?').text,/Servizio Tributi/)]
];
let count=0;for(const [label,fn] of tests){fn();console.log('OK',label);count++}console.log('AMMINISTRAZIONE_TEST',count);

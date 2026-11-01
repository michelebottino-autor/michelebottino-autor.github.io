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
console.log('ELENA_DIALOGO_VERIFICATO: indice, risposta E-026 documentata, domanda successiva, astensione senza fonti.');

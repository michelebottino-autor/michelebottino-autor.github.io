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
assert(approved.answers.length===0);
assert(!first.text.includes('è attestato che'));
console.log('ELENA_DIALOGO_VERIFICATO: indice, domanda successiva, assenza fonti, nessuna risposta inventata.');

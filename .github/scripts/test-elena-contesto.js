#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const engine=require('../../adc/assets/elena-dialogo.js');
const context=engine.contextualQuery('quali fonti','castello 1213');
assert(context.includes('castello')&&context.includes('1213'),context);
assert.equal(engine.contextualQuery('mulini','castello 1213'),'mulini');
assert.equal(engine.contextualQuery('quali fonti',''),'quali fonti');
const index=require('../../adc/assets/elena-indice.json');
const approved=require('../../adc/assets/elena-risposte-approvate.json');
const result=engine.reply(context,index,approved.answers);
assert(result.kind==='index'||result.kind==='empty');
assert(result.links.every(link=>engine.safeUrl(link.url)));
console.log('ELENA_CONTESTO_OK: riferimento conversazionale effimero, nessuna risposta storica inventata.');

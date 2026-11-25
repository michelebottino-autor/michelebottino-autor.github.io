#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const targets=['adc/assets/elena-presenza.js','adc/elena/index.html','adc/assets/elena-dialogo.js'];
for(const file of targets){
 const s=fs.readFileSync(path.join(root,file),'utf8');
 const visible=[];
 for(const m of s.matchAll(/(?:textContent\s*=\s*(['"`])([\s\S]*?)\1|>([^<>]+)<)/g)){
   const value=m[2]||m[3]||'';
   if(/\bPaola\b/i.test(value))visible.push(value.slice(0,160));
 }
 assert.deepEqual(visible,[],file+' contiene testo pubblico Paola: '+visible.join('; '));
}
const widget=fs.readFileSync(path.join(root,'adc/assets/elena-presenza.js'),'utf8');
assert(widget.includes('Ascolta un campione della voce'),'Pulsante del campione vocale Elena assente');
assert(widget.includes('Ferma il campione'),'Comando di arresto del campione vocale assente');
assert.doesNotMatch(widget,/speechSynthesis|elena-paola-.*\.mp3/,'Il campione ufficiale non deve essere sostituito');
const sample='/adc/audio/elena-presentazione-adc.mp3';
for(const target of ['adc/assets/elena-presenza.js','adc/elena/index.html']){
 assert(fs.readFileSync(path.join(root,target),'utf8').includes(sample),target+' non usa il campione ufficiale');
}
assert.ok(fs.existsSync(path.join(root,sample)),'File della voce ufficiale mancante');
const officialAudio=fs.readFileSync(path.join(root,sample));
assert.equal(crypto.createHash('sha256').update(officialAudio).digest('hex'),
 'd6a70d3695835b6998c994bac2a9f19483386957799c559e33ce5b2942d6021c',
 'La presentazione ufficiale deve coincidere con la traccia editoriale sintetizzata con il profilo R18');
const welcome='/adc/audio/elena-presentazione-adc.mp3';
const home=fs.readFileSync(path.join(root,'adc/index.html'),'utf8');
assert.match(home, /<audio[^>]+src="\/adc\/audio\/elena-presentazione-adc\.mp3\?v=20261125-r18"/);
assert.ok(fs.existsSync(path.join(root,welcome)),'Presentazione audio ADC mancante');
console.log('ELENA_IDENTITA_OK: interfaccia pubblica Elena e campione ufficiale.');

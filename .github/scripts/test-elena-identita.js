#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const path=require('node:path');
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
const sample='/adc/audio/elena-ufficiale.mp3';
for(const target of ['adc/assets/elena-presenza.js','adc/elena/index.html']){
 assert(fs.readFileSync(path.join(root,target),'utf8').includes(sample),target+' non usa il campione ufficiale');
}
assert.ok(fs.existsSync(path.join(root,sample)),'File della voce ufficiale mancante');
const welcome='/adc/audio/elena-presentazione-adc.mp3';
const home=fs.readFileSync(path.join(root,'adc/index.html'),'utf8');
assert.match(home, /<audio[^>]+src="\/adc\/audio\/elena-presentazione-adc\.mp3"/);
assert.ok(fs.existsSync(path.join(root,welcome)),'Presentazione audio ADC mancante');
console.log('ELENA_IDENTITA_OK: interfaccia pubblica Elena e campione ufficiale.');

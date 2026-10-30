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
assert(widget.includes('Ascolta Elena'),'Pulsante Elena assente');
assert(widget.includes('Ferma Elena'),'Arresto Elena assente');
assert(widget.includes('Elena sta leggendo'),'Conferma lettura Elena assente');
assert(widget.includes('/adc/audio/elena-paola-benvenuto.mp3'),'Audio originale mancante');
console.log('ELENA_IDENTITA_OK: interfaccia pubblica Elena; percorsi tecnici Paola conservati.');

#!/usr/bin/env node
/* © 2026 Michele Bottino — regressione mirata del collegamento Elena.
 * Nessuna revisione scientifica, nessuna modifica ai JSON o al sito remoto.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
const engine=require(path.join(root,'adc/assets/elena-dialogo.js'));
const source=fs.readFileSync(path.join(root,'adc/assets/elena-presenza.js'),'utf8');
const index=JSON.parse(fs.readFileSync(path.join(root,'adc/assets/elena-indice.json'),'utf8'));
const approved=JSON.parse(fs.readFileSync(path.join(root,'adc/assets/elena-risposte-approvate.json'),'utf8'));

class Element {
  constructor(tag){this.tagName=tag;this.dataset={};this.children=[];this.listeners={};this.textContent='';this.disabled=false;this.hidden=true;this.value='';this.classList={remove(){},add(){}};}
  set innerHTML(value){this.html=value;}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
  querySelector(selector){return this.selectors?.[selector]||null;}
  addEventListener(type,fn){this.listeners[type]=fn;}
  setAttribute(){}
  focus(){}
  get innerText(){return [this.textContent,...this.children.map(n=>n.innerText)].filter(Boolean).join('\n');}
}
async function run(query, resources={}){
  const widget=new Element('aside'),form=new Element('form'),send=new Element('button');
  const input=new Element('input'),result=new Element('div');
  form.selectors={'button':send};
  widget.selectors={'.elena-presenza-toggle':new Element('button'),'.elena-presenza-panel':new Element('section'),'.elena-presenza-close':new Element('button'),'.elena-presenza-message':new Element('p'),'form':form,'input':input,'.elena-presenza-result':result};
  const requests=[];
  const document={querySelector(){return null;},createElement(tag){return tag==='aside'?widget:new Element(tag);},body:{append(){}},head:{append(){throw Error('Motore inatteso');}},addEventListener(){}};
  const window={ElenaADCDialogo:engine,scrollY:0,addEventListener(){},matchMedia(){return {matches:false};},requestAnimationFrame(fn){fn();}};
  const data={'/adc/assets/elena-indice.json':index,'/adc/assets/elena-risposte-approvate.json':approved,...resources};
  const context={document,window,location:{pathname:'/adc/'},fetch:async url=>{requests.push(url);return {ok:Object.hasOwn(data,url),json:async()=>data[url]};},Promise,Error,Array,String};
  vm.runInNewContext(source,context,{filename:'elena-presenza.js'});
  input.value=query;
  await form.listeners.submit({preventDefault(){}});
  const links=[];
  function walk(node){if(node.tagName==='a')links.push({title:node.textContent,url:node.href});for(const child of node.children)walk(child);}
  walk(result);
  return {text:result.innerText,links,requests,send,input};
}
(async()=>{
  const a=await run('Processo 334');
  assert(!a.text.includes('La consultazione non è disponibile'),a.text);
  assert(a.links.some(x=>x.url==='/adc/processo-334/'),'Il dossier reale non è recuperato');
  assert(a.text.includes('Non è disponibile una risposta sintetica verificata'));
  assert.deepEqual(a.requests,['/adc/assets/elena-indice.json','/adc/assets/elena-risposte-approvate.json']);
  assert.equal(a.send.disabled,false);
  assert.equal(a.input.value,'');
  console.log('PASS: dati reali → indice → link Processo 334, senza risposta inventata.');

  const malformed=await run('Processo 334',{'/adc/assets/elena-risposte-approvate.json':{answers:{}}});
  assert(malformed.text.includes('La consultazione non è disponibile'));
  assert.equal(malformed.links.length,0);
  assert.equal(malformed.send.disabled,false);
  console.log('PASS: formato approvazioni invalido → rifiuto chiuso, nessuna fonte inventata.');

  const malformedIndex=await run('Processo 334',{'/adc/assets/elena-indice.json':{entries:{}}});
  assert(malformedIndex.text.includes('La consultazione non è disponibile'));
  assert.equal(malformedIndex.links.length,0);
  console.log('PASS: formato indice invalido → rifiuto chiuso.');

  const draft={question:'Domanda di test non storica',status:'DRAFT',answer:'TESTO NON APPROVATO',sources:[{url:'/adc/processo-334/',title:'Fixture, non citazione storica',page:'TEST'}],reviewer:'TEST_ONLY',reviewed_at:'TEST_ONLY'};
  const rejected=await run(draft.question,{'/adc/assets/elena-risposte-approvate.json':{answers:[draft]}});
  assert(!rejected.text.includes(draft.answer));
  console.log('PASS: fixture DRAFT → non viene presentata come risposta approvata.');

  const unknown=await run('zxqvtrpl inesistente');
  assert(unknown.text.includes('Non ho trovato un percorso sufficientemente pertinente'));
  assert(unknown.links.every(x=>x.url.startsWith('/adc/')));
  console.log('PASS: domanda priva di riscontri → astensione e soli percorsi ADC.');
  console.log('ELENA_WIDGET_REGRESSION_OK: 5 casi mirati; nessuna prova del flusso archivistico end-to-end.');
})().catch(error=>{console.error(error);process.exitCode=1;});

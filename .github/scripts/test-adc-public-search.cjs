#!/usr/bin/env node
// Collaudo deterministico dell'interfaccia di ricerca ADC e delle rotte Elena.
// Esegue il JavaScript effettivo della pagina in un DOM simulato; non sostituisce
// il collaudo grafico in Chrome, Firefox e su smartphone.
'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.join(__dirname,'../..');
const fromRoot=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=fromRoot('adc/cerca/index.html');
const inline=html.match(/<script>\s*("use strict";[\s\S]*?)<\/script>/)?.[1];
assert(inline,'Script della ricerca non individuato');
const index=JSON.parse(fromRoot('adc/cerca/indice-pagine.json'));
const inventory=JSON.parse(fromRoot('adc/inventario/testimonianze.json'));
const elena=JSON.parse(fromRoot('adc/assets/elena-indice.json'));
const approved=JSON.parse(fromRoot('adc/assets/elena-risposte-approvate.json'));
const dialogue=require(path.join(root,'adc/assets/elena-dialogo.js'));
assert(index.pages.length>=50,'Indice ricerca inatteso');
assert(index.count===index.pages.length,'Conteggio indice incoerente');
assert(inventory.schede.length>0,'Inventario non disponibile');
const urls=new Set();
for(const page of index.pages){
  const url=new URL(page.url);
  assert(url.pathname.startsWith('/adc/'), 'URL estraneo all’ADC');
  assert(!urls.has(url.pathname),'URL duplicato');
  urls.add(url.pathname);
  assert(typeof page.text==='string'&&page.text.length>15,'Testo indicizzato insufficiente');
}
for(const entry of elena.entries){
  assert(dialogue.safeUrl(entry.url),'Rotta Elena non valida: '+entry.url);
  const file=path.join(root,entry.url.slice(1)+(entry.url.endsWith('/')?'index.html':''));
  assert(fs.existsSync(file),'Rotta Elena inesistente: '+entry.url);
}
const rationes=elena.entries.find(e=>e.title.includes('Rationes Decimarum'));
assert(rationes && rationes.url==='/adc/chiese/studi/rationes/');
assert(rationes.tags.includes('536'));
assert(!rationes.tags.includes('525'),'Vecchia voce non verificata usata come tag');
const historical=dialogue.reply('Chi possedeva il castello di Calatabiano nel 1213?',elena,approved.answers);
assert.equal(historical.kind,'documentary');
assert(historical.links.some(x=>x.url==='/adc/dossier-1213-1537/'));
const unanswered=dialogue.reply('xyzxyz tipo inesistente',elena,approved.answers);
assert.equal(unanswered.kind,'empty');

function element(tag='div'){
  return {
    tag,children:[],value:'',textContent:'',className:'',dataset:{},
    append(...xs){this.children.push(...xs)},
    appendChild(x){this.children.push(x);return x},
    replaceChildren(...xs){this.children=[...xs]},
    addEventListener(){},remove(){},setAttribute(){},
    get firstElementChild(){return this.children[0]},
  };
}
const fields=Object.fromEntries(['search-form','query','status','results','documentary'].map(id=>[id,element()]));
const doc={
  getElementById(id){return fields[id]},
  createElement:element,
  createTextNode(text){return {textContent:text}},
};
const ctx={
  document:doc,URL,URLSearchParams,
  location:{origin:'https://michelebottino-autor.github.io',href:'https://michelebottino-autor.github.io/adc/cerca/',search:''},
  history:{replaceState(){}},
  fetch:async url=>{
    const s=String(url);
    if(s==='./indice-pagine.json')return {ok:true,json:async()=>index};
    if(s==='../inventario/testimonianze.json')return {ok:true,json:async()=>inventory};
    throw Error('Fetch inatteso: '+s);
  },
  console,
};
ctx.globalThis=ctx;
vm.runInNewContext(inline+'\n;globalThis.__probe={loadIndex,search,relevance,excerpt};',ctx,{filename:'adc/cerca/index.html'});
(async()=>{
  let data=await ctx.__probe.loadIndex();
  assert.equal(data.pages.length,index.pages.length,'Il caricamento dell’indice perde pagine');
  for(const [term,expected] of [['castello',true],['chiese',true],['annunziata',true],['parlamento',true],['xyznotpresentabc',false]]){
    fields.query.value=term;
    await ctx.__probe.search();
    const count=Number(fields.status.textContent.match(/^\d+/)?.[0]||0);
    if(expected) assert(count>0,'Nessun risultato per '+term);
    else assert(count===0,'Falso positivo per '+term);
  }
  fields.query.value='x';
  await ctx.__probe.search();
  assert(fields.status.textContent.includes('almeno due caratteri'),'Manca validazione query breve');
  console.log('ADC_RICERCA_ELENA_OK: '+index.pages.length+' pagine, '+inventory.schede.length+' schede inventario, '+elena.entries.length+' rotte Elena, query note e query vuote verificate.');
})().catch(err=>{console.error(err);process.exitCode=1});

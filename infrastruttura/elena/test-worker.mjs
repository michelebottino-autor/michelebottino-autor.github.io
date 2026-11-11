import test from 'node:test';
import assert from 'node:assert/strict';
import worker, {findFacts,extractText} from './worker.js';
const SITE='https://michelebottino-autor.github.io';
const corpus={facts:[
 {id:'1213',title:'Il castello nel marzo 1213',triggers:['1213','costanza'],answer:'Il castello fu confermato alla Chiesa di Catania.',limitation:'Il contratto originale non è stato acquisito.',sources:[{title:'Dossier 1213',url:'/adc/dossier-1213-1537/'},{title:'URL malevolo',url:'https://evil.invalid/'}]},
 {id:'ponte',title:'Il ponte sull Alcantara',triggers:['ponte','alcantara'],answer:'Edizione moderna di al Idrisi.',limitation:'Identificazione non esplicita.',sources:[{title:'Ponte',url:'/adc/ponte-alcantara-medievale/'}]}
]};
const env={OPENAI_API_KEY:'FAKE_TEST_KEY',OPENAI_MODEL:'gpt-4.1-mini',CLIENT_LIMIT:{limit:async()=>({success:true})},GLOBAL_LIMIT:{limit:async()=>({success:true})}};
let upstreamCalls=0,requests=[];
const original=globalThis.fetch;
globalThis.fetch=async (url,options={})=>{
 requests.push(url);
 if(url.endsWith('/elena-risposte.json'))return Response.json(corpus);
 if(url==='https://api.openai.com/v1/responses'){
  upstreamCalls++;
  const request=JSON.parse(options.body);
  assert.equal(request.store,false);assert.equal(request.model,'gpt-4.1-mini');
  assert.equal(options.headers.Authorization,'Bearer FAKE_TEST_KEY');
  assert.ok(request.instructions.includes('schede documentarie'));
  return Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'Risposta prodotta dal modello, da verificare.'}]}]});
 }
 throw Error('Request to unexpected origin '+url);
};
function ask(q,extras={},origin=SITE){return new Request('https://api.example.invalid/ask',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','cf-connecting-ip':'192.0.2.2'},body:JSON.stringify({question:q,...extras})});}
test.after(()=>{globalThis.fetch=original});
test('La fonte selezionata e la domanda successiva restano sullo stesso argomento',()=>{
 assert.equal(findFacts('Cosa avvenne nel 1213?',corpus.facts)[0].id,'1213');
 assert.equal(findFacts('E il documento originale?',corpus.facts,'1213')[0].id,'1213');
 assert.equal(findFacts('E nel 1213?',corpus.facts,'ponte')[0].id,'1213');
 assert.equal(findFacts('E il ponte Alcantara?',corpus.facts,'1213')[0].id,'ponte');
});
test('I risultati incompleti non vengono spacciati per risposte',()=>{
 assert.equal(extractText({status:'incomplete',output:[{type:'message',content:[{type:'output_text',text:'parziale'}]}]}),'');
});
test('Origin esterno rifiutato e preflight configurato',async()=>{
 assert.equal((await worker.fetch(ask('anno 1213',{},'https://evil.invalid'),env)).status,403);
 const r=await worker.fetch(new Request('https://api.example.invalid/ask',{method:'OPTIONS',headers:{Origin:SITE}}),env);
 assert.equal(r.status,204);assert.equal(r.headers.get('access-control-allow-origin'),SITE);
});
test('Contenuto invalido rifiutato prima di provider e indice',async()=>{
 const before=requests.length;
 assert.equal((await worker.fetch(ask('x'),env)).status,400);
 assert.equal((await worker.fetch(ask('a'.repeat(241)),env)).status,400);
 const large=new Request('https://api.example.invalid/ask',{method:'POST',headers:{Origin:SITE,'Content-Type':'application/json'},body:JSON.stringify({question:'a'.repeat(1100)})});
 assert.equal((await worker.fetch(large,env)).status,413);
 assert.equal(requests.length,before);
});
test('Risposta generativa: sintesi, fonti ADC e nessun link arbitrario',async()=>{
 const r=await worker.fetch(ask('Che cosa avvenne nel 1213?'),env);
 assert.equal(r.status,200);const data=await r.json();
 assert.equal(data.kind,'generative');assert.equal(data.topic,'1213');
 assert.equal(data.text,'Risposta prodotta dal modello, da verificare.');
 assert.deepEqual(data.links,[{title:'Dossier 1213',url:'/adc/dossier-1213-1537/'}]);
 assert.equal(r.headers.get('cache-control'),'no-store');assert.equal(upstreamCalls,1);
});
test('Nessuna fonte pertinente: non si chiama il modello',async()=>{
 const prior=upstreamCalls;
 const r=await worker.fetch(ask('astronomia e geologia?'),env);
 assert.equal(r.status,422);assert.equal((await r.json()).error,'no_documentary_match');assert.equal(upstreamCalls,prior);
});
test('Secret mancante e rate limit impediscono il servizio',async()=>{
 assert.equal((await worker.fetch(ask('anno 1213'),{...env,OPENAI_API_KEY:''})).status,503);
 const limited={...env,GLOBAL_LIMIT:{limit:async()=>({success:false})}};
 const r=await worker.fetch(ask('anno 1213'),limited);
 assert.equal(r.status,429);assert.equal(r.headers.get('retry-after'),'60');
});

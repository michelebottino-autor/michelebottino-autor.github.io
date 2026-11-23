import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync('elena-servizio/src/index.js','utf8');
const {default:app}=await import('data:text/javascript,'+encodeURIComponent(src));
const original=globalThis.fetch;
const approved={answers:[{question:'Prova attestazione',answer:'Testo di collaudo, non attestazione storica.',status:'APPROVED_FOR_PUBLICATION',reviewer:'Revisore di prova',reviewed_at:'2026-10-30',review_rationale:'Validazione del testo di prova',evidence_status:'EDITION_TEXT_CHECKED',evidence_limitations:'Verifica su edizione a stampa',sources:[{title:'Scheda di prova',page:'1',url:'/adc/fonti/',source_type:'printed_edition'}]}]};
globalThis.fetch=async()=>new Response(JSON.stringify(approved));
const ask=(q,origin='https://michelebottino-autor.github.io')=>app.fetch(new Request('https://elena.example/api/elena',{method:'POST',headers:{Origin:origin,'content-type':'application/json'},body:JSON.stringify({question:q})}),{});
let result=await ask('prova attestazione');assert.equal(result.status,200);let data=await result.json();assert.equal(data.kind,'documentary');assert.equal(data.sources[0].page,'1');
data=await (await ask('Domanda senza verifica')).json();assert.equal(data.kind,'unverified');assert.equal(data.sources.length,0);
result=await ask('Prova attestazione','https://sito-estraneo.invalid');assert.equal(result.status,403);
globalThis.fetch=async()=>new Response(JSON.stringify({answers:[{...approved.answers[0],status:'DRAFT'}]}));
data=await (await ask('Prova attestazione')).json();assert.equal(data.kind,'unverified');
globalThis.fetch=async()=>new Response(JSON.stringify({answers:[{...approved.answers[0],review_rationale:''}]}));
data=await (await ask('Prova attestazione')).json();assert.equal(data.kind,'unverified');
// Regressioni aggiuntive: URL fonti, limiti richiesta, controllo del metodo e
// risposta di sicurezza quando il registro approvato non è raggiungibile.
globalThis.fetch=async()=>new Response(JSON.stringify({answers:[{...approved.answers[0],sources:[{...approved.answers[0].sources[0],url:'https://example.invalid/private'}]}]}));
data=await (await ask('Prova attestazione')).json();
assert.equal(data.kind,'unverified','Fonte esterna non autorizzata');

globalThis.fetch=async()=>{throw new Error('Repository unavailable');};
result=await ask('Prova attestazione');
assert.equal(result.status,503);
data=await result.json();
assert.equal(data.kind,'unavailable');
assert.deepEqual(data.sources,[]);

result=await app.fetch(new Request('https://elena.example/api/elena',{method:'GET'}),{});
assert.equal(result.status,405,'GET non ammesso');
result=await ask('x'.repeat(161));
assert.equal(result.status,400,'Domande oltre 160 caratteri respinte');
result=await app.fetch(new Request('https://elena.example/api/elena',{method:'POST',headers:{Origin:'https://michelebottino-autor.github.io','content-type':'application/json'},body:'{invalid'}),{});
assert.equal(result.status,400,'JSON non valido');
result=await app.fetch(new Request('https://elena.example/api/elena',{method:'POST',headers:{Origin:'https://michelebottino-autor.github.io','content-type':'application/json'},body:JSON.stringify({question:'Prova attestazione'})}),{ELENA_PRIVATE_TOKEN:'test-only-private-token'});
assert.equal(result.status,401,'Token amministrativo richiesto se configurato');

globalThis.fetch=original;
console.log('ELENA_SERVIZIO_OK: fonti obbligatorie, astensione, bozze escluse, origine, input, indisponibilità e token verificati');

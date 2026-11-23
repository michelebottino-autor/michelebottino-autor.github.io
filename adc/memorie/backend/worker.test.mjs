// Controlli di regressione per API ADC Memorie — non utilizzano credenziali reali.
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';
import assert from 'node:assert/strict';

const source=await readFile(new URL('./worker.js',import.meta.url),'utf8');
const worker=(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).default;
let operations=0;
const db={prepare(sql){return {bind(){return this},async all(){return {results:[]}},async first(){return null},async run(){operations++;return {success:true}}}}};
const live={DB:db,ADMIN_TOKEN:'A'.repeat(40),RATE_SALT:'B'.repeat(40),TURNSTILE_SECRET:'C'.repeat(40)};
const base='https://adc-memorie-api.example.workers.dev';
const call=(path,options={},env=live)=>worker.fetch(new Request(base+path,options),env);
const origin='https://michelebottino-autor.github.io';

test('servizio incompleto: HTTP 503',async()=>{
 const response=await call('/v1/health',{}, {...live,TURNSTILE_SECRET:undefined});
 assert.equal(response.status,503);
});
test('health con configurazione completa',async()=>{
 const response=await call('/v1/health');
 assert.equal(response.status,200);
 assert.equal((await response.json()).status,'ready');
});
test('health non dichiara pronto il servizio se D1 non risponde',async()=>{
 const unavailable={...live,DB:{prepare(){return {async first(){throw new Error('D1 temporarily unreachable')}}}}};
 const response=await call('/v1/health',{},unavailable);
 assert.equal(response.status,500);
 assert.deepEqual(await response.json(),{error:'Richiesta non completata'});
});

test('origine estranea respinta',async()=>{
 assert.equal((await call('/v1/pubbliche',{headers:{Origin:'https://example.org'}})).status,403);
});
test('registro pubblico vuoto, senza dati privati',async()=>{
 const response=await call('/v1/pubbliche');
 assert.equal(response.status,200);
 assert.deepEqual((await response.json()).entries,[]);
});
test('redazione non consultabile senza credenziale',async()=>{
 assert.equal((await call('/v1/redazione/elenco')).status,401);
});
test('redazione con credenziale presente',async()=>{
 const response=await call('/v1/redazione/elenco',{headers:{Authorization:'Bearer '+'A'.repeat(40)}});
 assert.equal(response.status,200);
});
test('nessun invio senza origine ADC',async()=>{
 assert.equal((await call('/v1/memorie',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status,403);
});
test('JSON non valido respinto',async()=>{
 assert.equal((await call('/v1/memorie',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{'})).status,400);
});
test('invio senza consenso respinto, senza scritture',async()=>{
 const data={title:'Ricordo',period:'1970',place:'Calatabiano',story:'Un ricordo del paese abbastanza lungo da superare il limite.',attribution:'',private_contact:'',publication:'anonima',consent:false};
 const before=operations;
 const response=await call('/v1/memorie',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(data)});
 assert.equal(response.status,400);
 assert.equal(operations,before);
});
test('richiesta troppo lunga respinta senza scritture',async()=>{
 const before=operations;
 const response=await call('/v1/memorie',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'x'.repeat(65001)});
 assert.equal(response.status,413);
 assert.equal(operations,before);
});

test('nessuna pubblicazione diretta, ritiro definitivo',async()=>{
 const record={scelta_pubblicazione:'nome',stato:'ricevuta'};
 const fakeDb={
  prepare(sql){
   let params=[];
   return {
    bind(...args){params=args;return this},
    async first(){return {...record}},
    async all(){return {results:[]}},
    async run(){if(sql.startsWith('UPDATE testimonianze SET'))record.stato=params[0];return {success:true}}
   };
  }
 };
 const env={...live,DB:fakeDb};
 const id='ADC-MEM-00000000-0000-4000-a000-000000000001';
 const patch=(stato,testo_pubblico='')=>call('/v1/redazione/'+id,{method:'PATCH',headers:{Authorization:'Bearer '+'A'.repeat(40),'Content-Type':'application/json'},body:JSON.stringify({stato,testo_pubblico})},env);
 assert.equal((await patch('pubblicata','Testo verificato')).status,409);
 assert.equal((await patch('approvata')).status,200);
 assert.equal((await patch('pubblicata','Testo verificato')).status,200);
 assert.equal((await patch('approvata')).status,409);
 assert.equal((await patch('ritirata')).status,200);
 assert.equal((await patch('pubblicata','Testo verificato')).status,409);
});
test('la scelta di non pubblicare blocca l\'approvazione',async()=>{
 const env={...live,DB:{prepare(){return {bind(){return this},async first(){return {scelta_pubblicazione:'non_autorizzata',stato:'ricevuta'}}}}}};
 const id='ADC-MEM-00000000-0000-4000-a000-000000000002';
 const response=await call('/v1/redazione/'+id,{method:'PATCH',headers:{Authorization:'Bearer '+'A'.repeat(40),'Content-Type':'application/json'},body:JSON.stringify({stato:'approvata'})},env);
 assert.equal(response.status,409);
});
test('modifica amministrativa oltre 65 KB bloccata',async()=>{
 const id='ADC-MEM-00000000-0000-4000-a000-000000000003';
 const response=await call('/v1/redazione/'+id,{method:'PATCH',headers:{Authorization:'Bearer '+'A'.repeat(40),'Content-Type':'application/json'},body:'x'.repeat(65001)});
 assert.equal(response.status,413);
});

test('manutenzione senza opzione purge: cancella soltanto contatori tecnici',async()=>{
 const statements=[];
 const env={...live,RETENTION_PURGE_ENABLED:'false',DB:{prepare(sql){const item={sql,bind(...args){this.args=args;return this},async run(){statements.push({sql:this.sql,args:this.args});return {success:true}}};return item}}};
 let pending;
 await worker.scheduled({},env,{waitUntil(p){pending=p}});
 await pending;
 assert.equal(statements.length,1);
 assert.match(statements[0].sql,/DELETE FROM richieste_giornaliere/);
 assert.equal(statements[0].args.length,1);
});
test('politica purge esplicita: esclude testimonianze pubblicate',async()=>{
 const statements=[];
 const env={...live,RETENTION_PURGE_ENABLED:'true',DB:{prepare(sql){return{sql,bind(...args){this.args=args;return this},async run(){statements.push({sql:this.sql,args:this.args});return {success:true}}}}}};
 let pending;
 await worker.scheduled({},env,{waitUntil(p){pending=p}});
 await pending;
 assert.equal(statements.length,4);
 assert.ok(statements.slice(1).every(x=>!x.args.includes('pubblicata')));
 assert.ok(statements.some(x=>x.args.includes('approvata')));
});

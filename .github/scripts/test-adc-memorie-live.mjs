// ADC Memorie — collaudo pubblico non invasivo; nessun POST e nessun dato personale letto.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const config=JSON.parse(await readFile(new URL('../../adc/memorie/config.json',import.meta.url),'utf8'));
const endpoint=new URL(config.endpoint);
const expectedOrigin='https://michelebottino-autor.github.io';
assert.equal(endpoint.protocol,'https:','HTTPS obbligatorio');
assert.equal(config.enabled,false,'Non abilitare la raccolta pubblica prima del collaudo completo');
assert.equal(endpoint.pathname,'/','Endpoint Worker atteso senza percorso');

async function probe(path,{origin,method='GET'}={}){
 const headers=origin?{Origin:origin}:{};
 return fetch(new URL(path,endpoint),{
  method,headers,redirect:'error',signal:AbortSignal.timeout(12000),
  cache:'no-store'
 });
}
const testCases=[
 {label:'health API',path:'/v1/health',status:200},
 {label:'elenco pubblico disponibile',path:'/v1/pubbliche',status:200},
 {label:'redazione chiusa senza token',path:'/v1/redazione/elenco',status:401},
 {label:'origine non ammessa',path:'/v1/pubbliche',origin:'https://example.invalid',status:403},
 {label:'CORS sito ADC',path:'/v1/pubbliche',origin:expectedOrigin,status:200,cors:expectedOrigin},
 {label:'preflight CORS',path:'/v1/pubbliche',origin:expectedOrigin,method:'OPTIONS',status:204,cors:expectedOrigin},
 {label:'percorso inesistente',path:'/v1/does-not-exist',status:404}
];
let passed=0;
for(const t of testCases){
 const r=await probe(t.path,{origin:t.origin,method:t.method});
 assert.equal(r.status,t.status,t.label);
 if(t.cors)assert.equal(r.headers.get('access-control-allow-origin'),t.cors,t.label+' CORS');
 if(t.label==='health API'){
  const data=await r.json();
  assert.equal(data.status,'ready',t.label+' payload');
 } else {
  // Non leggere né registrare il contenuto dell'elenco delle testimonianze.
  await r.body?.cancel();
 }
 console.log('OK '+t.label+': HTTP '+r.status);
 passed++;
}
console.log('ADC Memorie: '+passed+'/'+testCases.length+' controlli remoti non invasivi superati; invii pubblici ancora disabilitati.');

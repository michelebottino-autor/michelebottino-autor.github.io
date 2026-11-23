const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('catalogo/index.html','utf8');
const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
 .filter(([,attrs,code])=>!/(?:^|\s)src\s*=/.test(attrs)&&!/(?:application\/ld\+json|application\/json|type=["']module["'])/i.test(attrs)&&code.trim());
test('catalogo: gli script JavaScript incorporati hanno sintassi valida',()=>{
 assert(scripts.length>0,'Nessuno script inline rilevato');
 for(const [,attrs,code] of scripts)assert.doesNotThrow(()=>new vm.Script(code), 'Errore nello script del catalogo');
});

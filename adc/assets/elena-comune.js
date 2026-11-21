/* Elena ADC: risposte civiche fondate su informazioni pubbliche del Comune.
   Non è un servizio ufficiale comunale e non presume dati aggiornati in tempo reale. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(typeof window!=='undefined')root.ElenaComune=api;
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const norm=s=>String(s||'').toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();
 const official=u=>{
   try{const x=new URL(u);return x.protocol==='https:'&&x.hostname==='comune.calatabiano.ct.it'&&x.username===''&&x.password===''}catch(_){return false}
 };
 const link=(title,url)=>official(url)?{title,url}:null;
 const recent=(date,ageDays)=>{const t=Date.parse(date);return Number.isFinite(t)&&Date.now()-t>=-2*86400000&&Date.now()-t<=ageDays*86400000};
 function reply(query,base,news){
   const q=norm(query);
   if(!base||base.schema!==1||!base.contacts||!base.directories)return null;
   const has=pattern=>pattern.test(q);
   const common=base.contacts;
   const officialLink=link('Sito ufficiale del Comune',base.directories.municipality);
   const newsIntent=has(/\b(ultime|notizie|novita|news|avvisi|avviso|comunicati|eventi|cosa succede|cosa accade|consiglio comunale)\b/);
   const municipality=has(/\b(comune|comunale|municipio|municipale|sindaco|uffici|ufficio|sportello|urp|anagrafe|protocollo|tributi|cosap|tari|stato civile|residenza|carta d.identita|certificati|pec)\b/);
   if(newsIntent){
     const records=Array.isArray(news?.entries)&&recent(news.checked_at,2)?news.entries.filter(e=>
       e&&typeof e.title==='string'&&e.title.length<=220&&official(e.url)&&recent(e.date,120)).slice(0,5):[];
     if(records.length){
       const lines=records.map(e=>(e.date||'')+' — '+e.title);
       return {kind:'civic',title:'Avvisi e novità del Comune di Calatabiano',
         text:'Queste sono le pubblicazioni recentemente rilevate dal portale del Comune (data del singolo avviso, non dell’evento):\n'+lines.join('\n')+
         '\nPer verificare modifiche, scadenze o nuove pubblicazioni consulta sempre il portale ufficiale.',
         links:[...records.map(e=>link(e.title,e.url)).filter(Boolean),link('Tutte le novità comunali',base.directories.news)].filter(Boolean),
         limitation:'Elenco periodicamente aggiornato; non è un monitoraggio in tempo reale né copre necessariamente tutto il territorio.',
         checked_at:news.checked_at,source:'Comune di Calatabiano'};
     }
     return {kind:'civic',title:'Novità e avvisi comunali',
       text:'Per conoscere le comunicazioni più recenti del Comune di Calatabiano, consulta la sezione ufficiale Novità e Avvisi. Non dispongo in questo momento di un elenco recente verificato.',
       links:[link('Novità del Comune',base.directories.news),link('Avvisi ufficiali',base.directories.notices)].filter(Boolean),
       limitation:'Non attribuisco la qualifica di notizia attuale a comunicazioni non aggiornate.',source:'Comune di Calatabiano'};
   }
   const office=(base.offices||[]).find(o=>(o.keys||[]).some(k=>q.includes(norm(k)) &&
     (municipality|| /\b(orari|quando|apre|chiude|apertura)\b/.test(q))));
   if(office){
     return {kind:'civic',title:'Orari — '+office.name,
       text:'Secondo l’avviso ufficiale del '+office.source_date+': '+office.opening+
         '\nPer festività, chiusure straordinarie o modifiche successive verifica il sito del Comune o chiama il centralino '+common.phone+'.',
       links:[link('Avviso ufficiale sugli orari',office.url),link('Elenco degli uffici comunali',base.directories.offices)].filter(Boolean),
       limitation:'L’orario riportato è quello dell’avviso citato, non una conferma in tempo reale dell’apertura.',source:'Comune di Calatabiano',checked_at:base.verified_at};
   }
   if(!municipality&&!has(/\b(telefono|numero|centralino|orario|orari|apertura|chiusura|pec)\b.*\b(calatabiano)\b/))return null;
   if(has(/\b(telefono|numero|centralino|chiamare|contattare|contatti|email|mail|pec|indirizzo|sede|dove si trova)\b/)){
     return {kind:'civic',title:'Contatti del Comune di Calatabiano',
       text:'Centralino: '+common.phone+'.\nSede: '+common.address+'.\nEmail: '+common.email+'.\nPEC: '+common.pec+
         '\nPer i numeri diretti dei singoli uffici consulta la scheda ufficiale: non posso confermarli senza una fonte aggiornata.',
       links:[link('Scheda ufficiale del Municipio',common.url),link('Uffici e recapiti',base.directories.offices)].filter(Boolean),
       limitation:'Recapiti verificati sulle pagine istituzionali. Per cambiamenti recenti consultare il Comune.',
       source:'Comune di Calatabiano',checked_at:base.verified_at};
   }
   if(has(/\b(orari|orario|apertura|chiusura|apre|chiude|quando|ricevimento)\b/)){
     return {kind:'civic',title:'Apertura degli uffici comunali',
       text:'Gli orari cambiano secondo l’ufficio. Nell’avviso del 2 settembre 2026 sono indicati Anagrafe, Stato Civile, Protocollo e Tributi TARI/COSAP. Indica l’ufficio che ti interessa oppure consulta l’avviso ufficiale.',
       links:[link('Orari degli uffici comunali',base.offices[0].url),link('Elenco degli uffici',base.directories.offices)].filter(Boolean),
       limitation:'Non tutti gli uffici seguono gli stessi orari.',source:'Comune di Calatabiano'};
   }
   return {kind:'civic',title:'Uffici e servizi del Comune',
     text:'Per trovare il servizio corretto consulta l’elenco ufficiale degli uffici comunali, che contiene competenze e recapiti. Puoi anche chiedermi gli orari di Anagrafe, Stato Civile, Protocollo o Tributi.',
     links:[link('Elenco degli uffici comunali',base.directories.offices),officialLink].filter(Boolean),
     limitation:'Non attribuisco orari o numeri diretti a uffici per i quali non ho dati verificati.',source:'Comune di Calatabiano'};
 }
 return {reply,official,norm,recent};
});

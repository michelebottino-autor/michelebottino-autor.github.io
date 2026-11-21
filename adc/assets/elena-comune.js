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
 function replyInternal(query,base,news){
   const q=norm(query);
   if(!base||base.schema!==1||!base.contacts||!base.directories)return null;
   const has=pattern=>pattern.test(q);
   const common=base.contacts;
   const officialLink=link('Sito ufficiale del Comune',base.directories.municipality);
   const eventIntent=has(/\b(eventi|manifestazioni|spettacoli|concerti|cosa fare|calendario eventi)\b/);
   const newsIntent=has(/\b(ultime|notizie|novita|news|avvisi|avviso|comunicati|cosa succede|cosa accade|consiglio comunale)\b/);
   const municipality=has(/\b(comune|comunale|municipio|municipale|sindaco|uffici|ufficio|sportello|urp|anagrafe|protocollo|tributi|cosap|tari|stato civile|residenza|carta d.identita|certificati|pec)\b/);
   if(eventIntent&&!newsIntent){
     return {kind:'civic',title:'Eventi e manifestazioni a Calatabiano',
       text:'Per conoscere il calendario aggiornato degli eventi organizzati o segnalati dal Comune consulta la pagina ufficiale. Non dispongo di una verifica continuativa degli eventi in programma e non posso confermare date o aperture senza un avviso attuale.',
       links:[link('Calendario ufficiale degli eventi',base.directories.events),
         link('Novità e comunicazioni del Comune',base.directories.news)].filter(Boolean),
       limitation:'Il calendario comunale non comprende necessariamente tutte le iniziative private o associative.',
       source:'Comune di Calatabiano',checked_at:base.verified_at};
   }
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
   // Servizi territoriali: una risposta descrittiva soltanto se esiste una scheda
   // con fonte ufficiale. Mai inferire disponibilità, turni o validità attuale.
   const cleanTokens=text=>norm(text).split(/[^a-z0-9]+/).filter(Boolean);
   const service=(Array.isArray(base.service_guides)?base.service_guides:[])
     .map(g=>{
       if(!g||!Array.isArray(g.keywords)||!official(g.source_url)||typeof g.fact!=='string'||
          typeof g.caution!=='string'||!g.caution.trim())return null;
       const qwords=cleanTokens(q);
       let match=0;
       for(const keyword of g.keywords){
         const words=cleanTokens(keyword);
         if(words.length&&qwords.some((v,j)=>v===words[0]&&
            words.every((x,k)=>qwords[j+k]===x)))match=Math.max(match,words.length);
       }
       return match?{g,match}:null;
     }).filter(Boolean).sort((a,b)=>b.match-a.match);
   if(service.length && !(service.length>1&&service[0].match===service[1].match)){
     const g=service[0].g;
     return {kind:'civic',title:g.title,
       text:g.fact+(g.source_date?'\\nFonte: comunicazione del '+g.source_date+'.':'')+
         '\\nPer eventuali variazioni consulta sempre la pagina ufficiale.',
       links:[link('Fonte istituzionale — '+g.title,g.source_url),
         link('Portale del Comune',base.directories.municipality)].filter(Boolean),
       limitation:g.caution,source:'Comune di Calatabiano',checked_at:base.verified_at};
   }
   const requestsContact=has(/\b(telefono|numero|recapito|contatto|chiamare|mail|email|pec)\b/);
   const requestsHours=has(/\b(orari|orario|apertura|chiusura|apre|chiude|ricevimento)\b/);
   const officialOffice=(base.office_contacts||[]).find(o=>(o.keywords||[]).some(k=>q.includes(norm(k))));
   if(requestsContact&&officialOffice&&!requestsHours){
     const phones=Array.isArray(officialOffice.phones)?officialOffice.phones.filter(p=>/^0[0-9]{7,11}$/.test(p)):[];
     if(phones.length&&official(officialOffice.url)){
       return {kind:'civic',title:'Recapiti — '+officialOffice.name,
         text:'Secondo la scheda ufficiale di '+officialOffice.name+', i numeri pubblicati sono: '+
           phones.join(', ')+'. Per eventuali modifiche o chiarimenti, consulta la pagina istituzionale.',
         links:[link('Scheda ufficiale — '+officialOffice.name,officialOffice.url),
           link('Elenco di tutti gli uffici',base.directories.offices)].filter(Boolean),
         limitation:'Numeri riportati dalla scheda pubblica dell’ufficio, non verificati tramite telefonata. Non implicano disponibilità immediata.',
         checked_at:base.verified_at,source:'Comune di Calatabiano'};
     }
   }
   const office=(base.offices||[]).find(o=>(o.keys||[]).some(k=>q.includes(norm(k)) &&
     (municipality|| /\b(orari|quando|apre|chiude|apertura)\b/.test(q))));
   if(office){
     if(has(/\b(telefono|numero|recapito|contatto|chiamare|mail|email|pec)\b/)&&
        !has(/\b(orari|orario|apertura|chiusura|apre|chiude|ricevimento)\b/)){
       return {kind:'civic',title:'Recapiti — '+office.name,
         text:'Per contattare '+office.name+' puoi chiamare il centralino del Comune: '+common.phone+
           '. Per un eventuale recapito diretto consulta la scheda dell’ufficio sul portale ufficiale: non dispongo di un numero diretto verificato.',
         links:[link('Elenco degli uffici e contatti',base.directories.offices),
           link('Contatti del Municipio',common.url)].filter(Boolean),
         limitation:'Il centralino è un recapito generale, non il numero diretto dell’ufficio.',
         source:'Comune di Calatabiano',checked_at:base.verified_at};
     }
     return {kind:'civic',title:'Orari — '+office.name,
       text:'Secondo l’avviso ufficiale del '+office.source_date+': '+office.opening+
         '\nPer festività, chiusure straordinarie o modifiche successive verifica il sito del Comune o chiama il centralino '+common.phone+'.',
       links:[link('Avviso ufficiale sugli orari',office.url),link('Elenco degli uffici comunali',base.directories.offices)].filter(Boolean),
       limitation:'L’orario riportato è quello dell’avviso citato, non una conferma in tempo reale dell’apertura.',source:'Comune di Calatabiano',checked_at:base.verified_at};
   }
   if(has(/\b(quanti|quante|numero di|elenco completo)\s+(?:sono\s+)?(?:gli\s+|degli\s+)?uffici\b/)&&municipality){
     return {kind:'civic',title:'Elenco degli uffici comunali',
       text:'Per conoscere il numero e l’elenco aggiornato degli uffici consulta la directory istituzionale. Non fornisco un totale che non sia stato verificato sul portale.',
       links:[link('Directory degli uffici del Comune',base.directories.offices)].filter(Boolean),
       limitation:'La struttura organizzativa può essere modificata dal Comune.',source:'Comune di Calatabiano'};
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
 function reply(query,base,news,checks){
   const result=replyInternal(query,base,news);
   if(!result||result.kind!=='civic')return result;
   const valid=checks?.schema===1&&Array.isArray(checks.entries)&&recent(checks.checked_at,7);
   const listed=valid?checks.entries.filter(e=>e&&official(e.url)&&
      Array.isArray(result.links)&&result.links.some(l=>l.url===e.url)):[];
   const unavailable=listed.filter(e=>e.status==='non_disponibile'||e.status==='redirect_non_ufficiale'||e.status==='url_non_ufficiale');
   if(unavailable.length){
     return {kind:'civic',title:'Fonte istituzionale da riconfermare',
       text:'Il controllo automatico segnala una fonte non disponibile o non più collegata al portale comunale. Evito di riportare qui recapiti, orari o disposizioni potenzialmente non aggiornati.',
       links:[{title:'Portale ufficiale del Comune',url:base.directories.municipality}],
       limitation:'La pagina sorgente va verificata direttamente prima di utilizzare questi dati.',
       source:'Comune di Calatabiano'};
   }
   if(!valid){
     result.limitation=(result.limitation?result.limitation+' ':'')+
       'Il controllo tecnico delle pagine istituzionali non è stato aggiornato negli ultimi sette giorni.';
   }else if(listed.length){
     const uncertain=listed.some(e=>e.status!=='raggiungibile');
     if(uncertain){
       result.limitation=(result.limitation?result.limitation+' ':'')+
         'Almeno una pagina istituzionale non è stata verificabile nell’ultimo controllo tecnico; conferma i dati sul sito del Comune.';
     }
     result.source_health_checked_at=checks.checked_at;
   }
   return result;
 }
 return {reply,official,norm,recent};
});

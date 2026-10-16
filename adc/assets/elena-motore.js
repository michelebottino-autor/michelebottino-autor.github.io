/* Elena ADC: risposte editoriali verificabili, non un modello linguistico. Nessun invio delle domande. */
(function (global) {
  'use strict';
  if (global.ElenaADC) return;
  const dataUrl = '/adc/assets/elena-risposte.json';
  const indexUrl = '/adc/assets/elena-indice.json';
  const stop = new Set('a ad al alla alle allo anche che chi ci come con cosa dai dal dalla delle del degli dei dell di e ed ecco era erano gli ha ho i il in io la le lo ma mi ne nel nella non o per perché perche piu più quale quali questo questa questi se si sia sono su sul sulla tra un una uno vorrei voglio sapere spiegami raccontami dimmi puoi potreste documenti documento qualcosa tutto fare fatto sappiamo calatabiano'.split(' '));
  const aliases = { cruilles:'cruylles',cruillas:'cruylles',mirulla:'mirulla',marullo:'mirulla',mulino:'mulini',chiesa:'chiese',croce:'crocifisso',etimologico:'etimologia',iddrisi:'idrisi' };
  function norm(s){return String(s||'').toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();}
  function tokens(s){return [...new Set(norm(s).split(' ').filter(w=>w.length>2&&!stop.has(w)).map(w=>aliases[w]||w))];}
  let stored = null;
  async function load(){
    if(!stored)stored=Promise.all([fetch(dataUrl,{cache:'no-store'}),fetch(indexUrl,{cache:'no-store'})]).then(async res=>{
      for(const r of res)if(!r.ok)throw Error('Indice ADC non disponibile');
      const [facts,index]=await Promise.all(res.map(r=>r.json()));
      if(!Array.isArray(facts.entries)||!Array.isArray(index.entries))throw Error('Indice ADC non valido');
      return {facts:facts.entries,index:index.entries.filter(x=>x&&typeof x.url==='string'&&x.url.startsWith('/adc/'))};
    }).catch(err=>{stored=null;throw err});
    return stored;
  }
  function safeLinks(xs){return (xs||[]).filter(x=>x&&typeof x.title==='string'&&typeof x.url==='string'&&/^\/adc\/(?!\/)[a-z0-9/_\-.]*$/.test(x.url));}
  const evidenceRE=/\b(fonte|fonti|prova|prove|originale|pergamena|manoscritto|certezza|sicuro|verificat|trascrizion|attendibil|documento)\w*\b/i;
  const genericRE=/^(altro|di piu|approfondisci|continua|e poi|perche|come mai|e quindi|spiegami meglio|puoi approfondire)\??$/i;
  const nameRE=/\b(etimologia|toponimo|toponomastica)\b|\b(nome|chiam|significat|deriva|origine)\w*.*\bcalatabiano\b|\bcalatabiano\b.*\b(nome|chiam|significat|deriva|origine)\w*/;
  function scoreFact(q,entry){
    const qn=norm(q),ws=tokens(q),years=(qn.match(/\b(?:1[0-9]{3}|20[0-9]{2})\b/g)||[]);
    if(years.length && entry.years?.length && !years.some(y=>entry.years.includes(y)))return 0;
    let points=0,hit=0;
    for(const y of entry.years||[])if(years.includes(y)){points+=18;hit++;}
    for(const raw of entry.distinctive||[]){
      const k=norm(raw);
      if(k && (' '+qn+' ').includes(' '+k+' ')){points+=9;hit++;}
    }
    for(const raw of entry.keywords||[]){
      const k=norm(raw);
      if(k && (k.includes(' ')?qn.includes(k):ws.includes(k))){points+=3;hit++;}
    }
    if(entry.id==='nome'&&!nameRE.test(qn))return 0;
    if(years.length&&!entry.years?.length && points<9)return 0;
    return hit>0 && (points>=9 || hit>=2)?points:0;
  }
  function fallback(q,index){
    const ws=tokens(q);
    if(!ws.length)return {kind:'clarify',message:'Puoi indicare un argomento, una data, un luogo o il nome di un documento?',sources:[],suggestions:['Il castello nel 1213','Origine del nome Calatabiano']};
    const scored=index.map(e=>{
      const title=norm(e.title),desc=norm(e.description),tags=(e.tags||[]).map(norm);
      const score=ws.reduce((n,w)=>n+(title.includes(w)?5:0)+(tags.some(t=>t.includes(w))?4:0)+(desc.includes(w)?2:0),0);
      return {e,score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score || a.e.title.localeCompare(b.e.title,'it'));
    const links=[];const urls=new Set();
    for(const {e} of scored){if(!urls.has(e.url)&&links.length<5){urls.add(e.url);links.push({title:e.title,url:e.url,description:e.description})}}
    return {kind:'results',message:links.length?'Non dispongo di una risposta documentaria predefinita a questa domanda. Ho trovato alcuni percorsi pubblicati da cui iniziare; controlla direttamente le fonti indicate nelle pagine.':'Non ho trovato una risposta nell’indice pubblico. Questo non significa che la documentazione non esista; prova a precisare il luogo, l’anno o l’argomento.',sources:safeLinks(links),suggestions:links.length?[]:['Fonti e documenti','Il castello nel 1213']};
  }
  async function answer(question,state){
    const {facts,index}=await load();
    const query=String(question||'').trim().slice(0,160),qnorm=norm(query);
    if(!query)return {kind:'clarify',message:'Scrivi un argomento o una domanda per iniziare.',sources:[],suggestions:[]};
    const ctx=state&&typeof state==='object'?state:{};
    const matches=facts.map(f=>({f,score:scoreFact(query,f)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
    let found=matches[0]?.f;
    // Le richieste di sola verifica proseguono il contesto precedente; una data esplicita ha sempre priorità.
    const current=facts.find(f=>f.id===ctx.lastTopic);
    const hasYear=/\b(?:1[0-9]{3}|20[0-9]{2})\b/.test(qnorm);
    const evidenceOnly=evidenceRE.test(qnorm)&&tokens(query).filter(w=>!['fonte','fonti','prova','prove','originale','pergamena','manoscritto','certezza','sicuro','verificato','trascrizione','attendibilita','documento'].includes(w)).length===0;
    if(current&&!hasYear&&(genericRE.test(qnorm)||(evidenceRE.test(qnorm)&&(!found||found.id===current.id))))found=current;
    let response;
    if(found){
      const evidenceAsked=current?.id===found.id && !hasYear && (evidenceRE.test(qnorm) || /^(e )?(quanto|come).*(verificat|certo|sicuro|prova|fonte)/.test(qnorm));
      const moreAsked=current?.id===found.id && genericRE.test(qnorm);
      response={kind:'answer',topic:found.id,message:evidenceAsked?found.evidence:moreAsked?'Per approfondire, consulta le pagine dell’ADC indicate qui sotto. La sintesi precedente non sostituisce l’esame delle fonti.':found.message,
      evidence:evidenceAsked||moreAsked?'':found.evidence,sources:safeLinks(found.sources),suggestions:found.suggestions||[]};
    }else response=fallback(query,index);
    if(state&&typeof state==='object'){state.lastTopic=found?.id||null;state.lastQuestion=query;}
    return response;
  }
  global.ElenaADC={load,answer};
})(window);
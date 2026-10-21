/* Elena ADC: risposte documentarie controllate nel browser, NON un modello generativo.
   Nessun invio di domande a server; le risposte provengono solo dal JSON pubblico ADC. */
(function (global, make) {
  'use strict';
  const api=make();
  if(typeof module === 'object' && module.exports) module.exports=api;
  if(typeof document !== 'undefined') { global.ElenaADCDialogo=api; api.mount(); }
})(typeof globalThis === 'undefined' ? this : globalThis, function () {
  'use strict';
  const normalize=s=>String(s||'').toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();
  const stop=new Set('della delle degli dello dalla nelle nella sono dove quali quale come trovo trovare cerca cercare sapere vorrei voglio parlami dimmi raccontami documenti documento informazioni calatabiano storia storico storica sulla sulle sugli anche quando perche esiste esistono posso avere avete riguardo qualcosa questo questa che cosa ci sono dei un una gli alle del nel nella nei sui sul sull chi sappiamo accadde ha si sa sapete per il la di e a da con negli'.split(' '));
  const aliases={mulino:'mulini',mulini:'mulino',chiesa:'chiese',chiese:'chiesa',origine:'origini',origini:'origine',mappa:'cartografia',mappe:'cartografia',terremoti:'terremoto',guerra:'1943',greco:'greci',greca:'greci',fotografia:'fotografie',foto:'fotografie'};
  const safeUrl=u=>typeof u==='string' && /^\/adc\/[a-z0-9/_-]*(?:\.html)?$/i.test(u);
  const tokenize=q=>[...new Set(normalize(q).split(/[^a-z0-9]+/).filter(t=>t.length>2&&!stop.has(t)).flatMap(t=>aliases[t]?[t,aliases[t]]:[t]))];
  function indexMatches(q,entries) {
    const terms=tokenize(q);
    if(!terms.length)return [];
    return (entries||[]).map(e=>{
      const title=normalize(e.title),description=normalize(e.description),tags=(e.tags||[]).map(normalize);
      const score=terms.reduce((sum,t)=>sum+(title.includes(t)?5:0)+(tags.some(x=>x.includes(t)||(t.includes(x)&&x.length>3))?4:0)+(description.includes(t)?2:0),0);
      return {e,score};
    }).filter(x=>x.score>0&&safeUrl(x.e.url)).sort((a,b)=>b.score-a.score||a.e.title.localeCompare(b.e.title,'it')).filter((x,i,arr)=>arr.findIndex(y=>y.e.url===x.e.url)===i).slice(0,5).map(x=>x.e);
  }
  function detectFact(q,facts,previousId) {
    const nq=normalize(q);
    // Non confondere le sigle «Processo 184» e «Processo 334».
    if(/\b(?:processo|investitura|fascicolo|p)\b.{0,40}\b184\b/.test(nq))return null;
    const hasYear=/\b(?:1[0123456789]\d\d|20\d\d)\b/.test(nq);
    const asksName=/(etimolog|toponim|origine del nome|significato del nome|perche si chiama|da dove deriva il nome|da dove viene il nome|da cosa deriva il nome)/.test(nq)||(!hasYear&&/\bnome calatabiano\b/.test(nq));
    if(asksName){const x=facts.find(f=>f.id==='nome');if(x)return x;}
    // La sola presenza di un anno non prova che la domanda riguardi il dossier di quell'anno.
    // Per esempio «quanti abitanti nel 1531?» non riguarda l'arciprete attestato nel 1531.
    const anchors={
      '1213':/\b(castello|costanza|enrico|arnaldo|privilegio|pagamento|vendita|conferma)\b/,
      '1201':/\b(federico|diploma|privilegio)\b/,
      '1267':/\b(controversia|contesa|lite|conflitto)\b/,
      '1282':/\b(restituzione|vespri|diritti)\b/,
      '1502':/\b(crocifisso|croce|salvo|antonio)\b/,
      '1537':/\b(zucchero|zuccheri|faraone|mirulla|gabella|arbitrio|contratto)\b/,
      'notaio1348':/\b(notaio|notai|notarile|iacobello|teocarito|regesto|salvo)\b/,
      'notaio1356':/\b(notaio|notai|notarile|cunistabili|nomina|protonotaro|marrone)\b/,
      'arciprete1531':/\b(arciprete|prelato|prete|sacerdote|renaldo|calvo|beneficio|martino|buxo|affitto)\b/,
      'chiese1594':/\b(chiesa|chiese|sacramentale|sacramentali|relatio|relationes|concilio|mellusi|517a)\b/,
      'gravina':/\b(gravina|cruillas|palagonia|fidecommissaria|assento|baronia|bardella|inventario|feudi|feudale|giurisdizione)\b/
    };
    const generic=new Set(['accadde','successe','succede','avvenne','avviene','accaduto','successo','eventi','evento',
      'episodio','avvenimenti','avvenimento','fatti','fatto','anno','periodo','epoca','tempo','notizia','notizie','era']);
    const words=tokenize(q).filter(w=>!/^\d{3,4}$/.test(w));
    const genericYearQuery=words.every(w=>generic.has(w));
    const asksDocumentSource=/\b(originale|fonti|fonte|manoscritto|facsimile|documentazione|documento|carta|pergamena|citazione|bibliografia)\b/.test(nq);
    // In caso di domande che chiedono dati estranei ai nostri fatti registrati,
    // non attribuire mai automaticamente un'altra notizia dello stesso anno.
    const unsupportedDetail=/\b(sindaco|abitanti|popolazione|abitazioni|famiglie|proprietari|genealogia|genealogie|costrui|costruirono|nascita|fotografie|fotografia)\b/.test(nq)
      || /\bchi (?:abitava|abito|viveva|vivevano|costrui|costruirono)\b/.test(nq);
    if(unsupportedDetail)return null;
    const ranked=facts.filter(f=>f.id!=='nome').map(f=>{
      let points=0;
      for(const trigger of f.triggers||[]){
        const t=normalize(trigger);
        if(!t)continue;
        const isYear=/^\d{3,4}$/.test(t);
        if(isYear&&!new RegExp('\\b'+t+'\\b').test(nq))continue;
        if(!isYear&&!nq.includes(t))continue;
        if(f.id==='processo334'&&(t!=='334'||!/\b(?:processo|investitura|fascicolo|p)\b.{0,40}\b334\b/.test(nq)))continue;
        if(isYear&&anchors[f.id]&&!anchors[f.id].test(nq)&&!genericYearQuery&&!asksDocumentSource)continue;
        points+=isYear?16:t.length>=7?6:3;
      }
      return {f,points};
    }).sort((a,b)=>b.points-a.points);
    if(ranked[0]&&ranked[0].points>=6&&(ranked[0].points>=(ranked[1]?.points||0)+2||hasYear))return ranked[0].f;
    const follow=/(^e\b|^ma\b|^quale\b|^quali\b|^dove\b|^l.originale\b|^la fonte\b|^le fonti\b|^e il\b|^e la\b|^era originale\b)/.test(nq);
    const sourceFollow=/(^fonte\b|^fonti\b|^originale\b|^pergamena\b)/.test(nq);
    if(previousId&&(follow||sourceFollow)&&!hasYear)return facts.find(f=>f.id===previousId)||null;
    return null;
  }
  function reply(q,db,index,previousId,memory) {
    if(!memory || memory.schema!==1 || !Array.isArray(memory.topics) || memory.topics.length<2) return {kind:'empty',topic:null,title:'Memoria non disponibile',text:'Elena non può rispondere senza consultare la memoria documentaria condivisa.',links:[]};
    if(/\b(?:processo|investitura|fascicolo|p)\b.{0,40}\b184\b/.test(normalize(q)))return {kind:'empty',topic:null,title:'Processo 184: attribuzione non verificata',text:'Le vecchie sigle di lavoro P184 non identificano con certezza un Processo 184. Non posso attribuire loro il materiale del Processo 334. Se la domanda confronta i due fascicoli, serve una verifica documentaria separata.',links:[{title:'Criteri di verifica e fonti',url:'/adc/fonti/'}]};
    // Consultazione bibliografica attribuita, distinta dai fatti ADC approvati.
    if(/\b(pianotta|usk\s*81)\b/i.test(normalize(q)) && typeof globalThis.ElenaPianottaBibliografia==='function'){
      const b=globalThis.ElenaPianottaBibliografia(q);
      if(b.sources.length)return {kind:'index',topic:null,title:'Contrada Pianotta — bibliografia',text:b.answer+' '+b.disclaimer,links:[{title:'Scheda archeologica di Pianotta',url:'/adc/pianotta/'}]};
      return {kind:'index',topic:null,title:'Contrada Pianotta — documenti',text:'Per questa domanda non risulta una citazione bibliografica puntuale nella scheda del 2020.',links:[{title:'Consulta la scheda di Pianotta',url:'/adc/pianotta/'}]};
    }
    const facts=Array.isArray(db?.facts)?db.facts:[];
    const entries=Array.isArray(index?.entries)?index.entries:[];
    const fact=detectFact(q,facts,previousId);
    if(fact) {
      const isSource=/(?:^| )(?:quali? fonti|le fonti|la fonte|da quale fonte|bibliografia|dove posso leggere)/.test(normalize(q));
      const isOriginal=/(originale|pergamena|facsimile)/.test(normalize(q));
      const opening=isOriginal?'La scheda ADC indica la fonte e chiarisce se il documento originale è stato collazionato; il testo manoscritto non viene riprodotto qui.':isSource?'La pagina collegata riporta gli studi e i riferimenti d’archivio consultabili:':fact.answer;
      return {kind:'documentary',topic:fact.id,title:fact.title,text:opening,limitation:fact.limitation,links:(fact.sources||[]).filter(s=>safeUrl(s.url)).map(s=>({title:s.title,url:s.url}))};
    }
    const matches=indexMatches(q,entries);
    if(matches.length)return {kind:'index',topic:null,title:'Percorsi pertinenti',text:'Non ho una risposta documentaria già verificata per questa domanda. Puoi consultare questi percorsi dell’Archivio.',links:matches.map(e=>({title:e.title,url:e.url,description:e.description}))};
    const empty=!facts.length&&!entries.length;
    return {kind:'empty',topic:null,title:'Nessuna corrispondenza',text:empty?'La consultazione è momentaneamente indisponibile. Puoi aprire la sezione Fonti.':'Non ho una risposta verificata né un percorso corrispondente. Prova a indicare un luogo, un anno o il nome di un documento.',links:[{title:'Fonti e documenti',url:'/adc/fonti/'}]};
  }
  function mount() {
    const form=document.getElementById('elena-form'),input=document.getElementById('elena-query'),output=document.getElementById('elena-results');
    if(!form||!input||!output)return;
    let database={facts:[]},index={entries:[]},memory=null,lastTopic=null,turns=0;
    const load=url=>fetch(url,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Risorsa non disponibile');return r.json()});
    const ready=Promise.allSettled([load('/adc/assets/elena-risposte.json'),load('/adc/assets/elena-indice.json'),load('/adc/assets/elena-memoria-pubblica.json')]).then(results=>{
      if(results[0].status==='fulfilled')database=results[0].value;
      if(results[1].status==='fulfilled')index=results[1].value;
      if(results[2].status==='fulfilled')memory=results[2].value;
    });
    const el=(tag,cls,txt)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x;};
    function appendQuestion(q){
      const user=el('p','elena-dialogue-question','Domanda: '+q);
      output.append(user);
      return user;
    }
    function appendAnswer(r){
      const article=el('article','elena-dialogue-answer');
      article.append(el('h2','',r.title),el('p','',r.text));
      if(r.limitation){const caution=el('p','elena-dialogue-caution','Limite della documentazione: '+r.limitation);article.append(caution);}
      if(r.links.length){
        const h=el('p','elena-dialogue-sources',r.kind==='index'?'Pagine suggerite:':'Documentazione pubblicata:');
        const ul=el('ul','elena-dialogue-links');
        for(const s of r.links){if(!safeUrl(s.url))continue;const li=el('li');const a=el('a');a.href=s.url;a.textContent=s.title;li.append(a);if(s.description)li.append(el('span','',' — '+s.description));ul.append(li);}
        article.append(h,ul);
      }
      output.append(article);
      return article;
    }
    function run(query){
      const q=String(query||'').trim().slice(0,160);
      if(!q)return;
      ready.then(async()=>{
        memory=await load('/adc/assets/elena-memoria-pubblica.json').catch(()=>null);
        if(!turns)output.replaceChildren();
        const r=reply(q,database,index,lastTopic,memory);
        if(r.topic)lastTopic=r.topic;
        appendQuestion(q);const current=appendAnswer(r);turns++;
        while(output.children.length>16){output.removeChild(output.firstElementChild);output.removeChild(output.firstElementChild);}
        if(current.scrollIntoView && turns>1)current.scrollIntoView({block:'nearest',behavior:'smooth'});
      });
    }
    form.addEventListener('submit',e=>{e.preventDefault();const q=input.value;input.value='';run(q);});
    document.querySelectorAll('[data-query]').forEach(b=>b.addEventListener('click',()=>run(b.dataset.query)));
    let initial='';
    try{
      const raw=sessionStorage.getItem('adc-elena-handoff');
      if(raw){sessionStorage.removeItem('adc-elena-handoff');const parsed=JSON.parse(raw);if(typeof parsed.q==='string'&&Date.now()-parsed.at<120000&&Date.now()-parsed.at>=0)initial=parsed.q;}
    }catch(e){/* Archiviazione di sessione non disponibile: nessun requisito. */}
    const loc=new URL(window.location.href);
    if(!initial){initial=loc.searchParams.get('q')||'';if(!initial&&loc.hash.startsWith('#q=')){try{initial=decodeURIComponent(loc.hash.slice(3));}catch(e){initial='';}}}
    if(loc.searchParams.has('q')||loc.hash.startsWith('#q=')){
      loc.searchParams.delete('q');loc.hash='';try{history.replaceState(null,'',loc.pathname+loc.search);}catch(e){/* navigazione privata */}
    }
    if(initial&&initial.length<=160)run(initial);
  }
  return {normalize,tokenize,indexMatches,detectFact,reply,mount,safeUrl};
});

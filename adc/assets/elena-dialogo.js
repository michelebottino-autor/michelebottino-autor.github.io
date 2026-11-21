/* Elena ADC — guida documentaria statica. Nessuna risposta generativa o inferenza storica. */
(function (global, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (typeof document !== 'undefined') { global.ElenaADCDialogo = api; api.mount(); }
})(typeof globalThis === 'undefined' ? this : globalThis, function () {
  'use strict';
  const normalize = s => String(s || '').toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
  const stop = new Set('calatabiano storia storico storica documento documenti fonte fonti cosa quale quali dove quando come sapere informazioni vorrei vorremmo cerca cercare trovare parla dice del della delle degli dello nella nelle nei sui sul con per alla alle anche sono hanno un una che chi gli dai dai dal dei era erano e il la di da a in si'.split(' '));
  const aliases = {mulino:'mulini',mulini:'mulino',chiesa:'chiese',chiese:'chiesa',origine:'origini',origini:'origine',mappa:'cartografia',mappe:'cartografia',foto:'fotografie',fotografia:'fotografie',fotografie:'foto',ponte:'alcantara',castelli:'castello',castello:'castelli',pergamena:'pergamene',pergamene:'pergamena',monastero:'monasteri',monasteri:'monastero',decime:'rationes',rationes:'decime',zuccherificio:'zucchero',trappeto:'zucchero',trappeti:'zucchero',crocifisso:'croce',croce:'crocifisso',ferroviaria:'ferrovia',stazioni:'stazione',stazione:'ferrovia',terremoti:'terremoto'};
  const safeUrl = u => typeof u === 'string' && /^\/adc\/[a-z0-9/_-]*(?:\.html)?$/i.test(u);
  const tokens = q => [...new Set(normalize(q).split(/[^a-z0-9]+/).filter(x => x.length > 2 && !stop.has(x)).flatMap(x => aliases[x] ? [x, aliases[x]] : [x]))];
  function rank(q, entries) {
    const ts = tokens(q);
    if (!ts.length) return [];
    const generic = new Set(['archivio','ricerca','bibliografia','territorio','medievale','medievali','medioevo']);
    const specific = ts.filter(t => !generic.has(t));
    const candidates = (entries || []).filter(e => e && safeUrl(e.url)).map(e => {
      const title = normalize(e.title), tags = (e.tags || []).map(normalize), description = normalize(e.description);
      const titleWords=title.split(/[^a-z0-9]+/), descriptionWords=description.split(/[^a-z0-9]+/);
      const match=t=>titleWords.includes(t) || tags.some(tag => tag === t || tag.split(/[^a-z0-9]+/).includes(t));
      const score = ts.reduce((sum,t) => sum + (titleWords.includes(t) ? 6 : 0) + (tags.some(tag => tag === t || tag.split(/[^a-z0-9]+/).includes(t)) ? 5 : 0) + (descriptionWords.includes(t) ? 1 : 0),0);
      const matchedSpecific=specific.filter(match).length;
      return {e,score,strong:matchedSpecific>0,matchedSpecific};
    }).filter(x => x.score >= 5 && x.strong);
    // Per domande con più termini, privilegia la copertura massima quando almeno due coincidono.
    const bestCoverage=candidates.reduce((max,x)=>Math.max(max,x.matchedSpecific),0);
    const requireCoverage=specific.length>1 && bestCoverage>1;
    return candidates.filter(x=>!requireCoverage || x.matchedSpecific===bestCoverage)
      .sort((a,b) => b.score-a.score || a.e.title.localeCompare(b.e.title,'it'))
      .filter((x,i,all) => all.findIndex(y => y.e.url===x.e.url)===i).slice(0,5).map(x=>x.e);
  }
  // Contesto effimero: solo l'ultima domanda in questa scheda, senza memorizzazione.
  function contextualQuery(q, previous) {
    const current=String(q||'').trim();
    const antecedent=String(previous||'').trim();
    if(!antecedent || !current || current.length>160) return current;
    const follow=/^(?:e\s+)?(?:quali?\s+(?:fonti|documenti|prove)|dove\s+(?:si\s+)?(?:trova|legg[oe]|sono)|in\s+che\s+(?:anno|periodo)|e\s+(?:poi|prima)|puoi\s+(?:approfondire|spiegare)|parlami\s+(?:di\s+)?(?:quest[oaie]|quello)|e\s+(?:quest[oaie]|quello)|che\s+(?:cosa|documenti|fonti)\s+(?:lo|la|ne))\b/i;
    if(!follow.test(current))return current;
    const keywords=tokens(antecedent).slice(0,5);
    if(!keywords.length)return current;
    return (current+' '+keywords.join(' ')).slice(0,160);
  }
  // Motore documentario controllato: usa esclusivamente enunciati validati e
  // ricondotti a una risposta approvata, senza costruire nuovi fatti storici.
  function knowledgeAnswer(q, knowledge, approved) {
    const query=normalize(q), words=new Set(query.split(/[^a-z0-9]+/).filter(Boolean));
    if(!Array.isArray(knowledge?.entries)||!Array.isArray(approved))return null;
    const allowedEvidence=new Set(['SOURCE_IDENTIFIED','EDITION_TEXT_CHECKED','IMAGE_COLLATED','ORIGINAL_COLLATED']);
    const validEntry=e=>{
      if(!e||e.status!=='APPROVED_FOR_PUBLICATION'||!e.reviewer||!e.reviewed_at||!e.review_rationale||
         !allowedEvidence.has(e.evidence_status)||typeof e.evidence_limitations!=='string'||
         !e.evidence_limitations.trim()||!Array.isArray(e.sources)||!e.sources.length||
         typeof e.answer!=='string'||!e.answer.trim()||!Array.isArray(e.must_match_any)||
         !Array.isArray(e.must_match_subject)||!Array.isArray(e.keywords)||!e.source_answer_id)return false;
      const canonical=approved.find(x=>x.id===e.source_answer_id && x.status==='APPROVED_FOR_PUBLICATION'&&
        x.reviewer&&x.reviewed_at&&x.review_rationale&&Array.isArray(x.sources)&&x.sources.length);
      if(!canonical)return false;
      return e.sources.every(src=>src&&safeUrl(src.url)&&src.title&&src.page&&src.source_type&&
        canonical.sources.some(c=>c.url===src.url&&c.page===src.page&&c.source_type===src.source_type));
    };
    const match=a=>a.some(word=>words.has(normalize(word).replace(/[^a-z0-9]+/g,'')));
    const candidates=knowledge.entries.filter(validEntry).filter(e=>
      match(e.must_match_any)&&match(e.must_match_subject)
    ).map(e=>{
      const matched=e.keywords.filter(k=>words.has(normalize(k).replace(/[^a-z0-9]+/g,''))).length;
      return {e,score:matched+(e.must_match_subject.some(k=>words.has(normalize(k)))?1:0)};
    }).filter(x=>x.score>=1).sort((a,b)=>b.score-a.score||a.e.id.localeCompare(b.e.id));
    if(!candidates.length)return null;
    // Se due attestazioni hanno pari pertinenza, meglio rimandare alle fonti che attribuire una risposta arbitraria.
    if(candidates.length>1&&candidates[0].score===candidates[1].score)return null;
    const entry=candidates[0].e;
    return {kind:'documentary',id:entry.id,title:'Risposta documentaria verificata',
      text:entry.answer,links:entry.sources.map(src=>({title:src.title+' — p. '+src.page,url:src.url})),
      limitation:entry.evidence_limitations,evidence_status:entry.evidence_status,
      reviewer:entry.reviewer,reviewed_at:entry.reviewed_at};
  }
  function reply(q, index, approved, knowledge) {
    const n = normalize(q);
    // Richiesta esplicita di contribuire con una memoria personale: nessuna raccolta implicita nella chat.
    if(/(?:raccont|testimonianz|ricord|memori)/.test(n) && /(?:voglio|vorrei|posso|condivid|inviar|pubblic|personal|infanzia|nonni|famiglia)/.test(n)){
      return {kind:'contribution',title:'Condividi un ricordo con l’ADC',text:'Puoi raccontare un episodio di Calatabiano attraverso la scheda dedicata. Prima dell’invio decidi se autorizzare una possibile pubblicazione con il tuo nome, in forma anonima, oppure se non autorizzarla. Nulla viene pubblicato automaticamente.',links:[{title:'Apri la raccolta delle memorie',url:'/adc/memorie/'}]};
    }
    // Risposte canoniche consentite soltanto con stato, fonte e testo approvati.
    const answer = (approved || []).find(x => x && x.status === 'APPROVED_FOR_PUBLICATION' && x.question && normalize(x.question)===n && typeof x.answer==='string' && x.answer.trim() && Array.isArray(x.sources) && x.sources.length && x.sources.every(s=>s && safeUrl(s.url) && s.page && s.title) && x.reviewer && x.reviewed_at && x.review_rationale && ['SOURCE_IDENTIFIED','EDITION_TEXT_CHECKED','IMAGE_COLLATED','ORIGINAL_COLLATED'].includes(x.evidence_status) && typeof x.evidence_limitations==='string' && x.sources.every(s=>s.source_type));
    if (answer) return {kind:'documentary',id:answer.id,title:'Risposta documentata',text:answer.answer,links:answer.sources.map(s=>({title:s.title+' — p. '+s.page,url:s.url})),limitation:answer.evidence_limitations,evidence_status:answer.evidence_status};
    const controlled=knowledgeAnswer(q,knowledge,approved);
    if(controlled)return controlled;
    const matches = rank(q, index?.entries);
    if (matches.length) return {kind:'index',title:'Fonti e percorsi da consultare',text:'Non è disponibile una risposta sintetica verificata per questa domanda. Questi percorsi potrebbero essere pertinenti: consulta le fonti prima di trarre conclusioni.',links:matches.map(e=>({title:e.title,url:e.url,description:e.description}))};
    return {kind:'empty',title:'Nessuna fonte sufficiente individuata',text:'Non ho trovato un percorso sufficientemente pertinente nell’indice pubblico. Puoi consultare il repertorio generale oppure riprovare indicando una località, un anno o un argomento.',links:[{title:'Consulta le fonti e i documenti',url:'/adc/fonti/'},{title:'Leggi la storia di Calatabiano',url:'/adc/storia/'}]};
  }
  function mount() {
    const form=document.getElementById('elena-form'), input=document.getElementById('elena-query'), output=document.getElementById('elena-results');
    if (!form || !input || !output) return;
    let index={entries:[]}, approved=[], knowledge={entries:[]}, knowledgeAvailable=false, turns=0, previousQuestion='', activeAudio=null, indexAvailable=false, approvedAvailable=false;
    const tools=document.createElement('div');tools.className='elena-conversation-tools';
    const availability=document.createElement('p');availability.className='elena-source-status';availability.setAttribute('role','status');
    availability.textContent='Caricamento del repertorio documentario…';
    const clear=document.createElement('button');clear.type='button';clear.className='elena-clear';clear.textContent='Nuova conversazione';
    tools.append(availability,clear);
    output.parentNode.insertBefore(tools,output);
    output.setAttribute('role','log');output.setAttribute('aria-label','Conversazione con Elena');
    output.setAttribute('aria-relevant','additions');
    clear.addEventListener('click',()=>{
      if(window.speechSynthesis)window.speechSynthesis.cancel();
      if(activeAudio){activeAudio.pause();activeAudio.currentTime=0;activeAudio=null;}
      previousQuestion='';turns=0;input.value='';
      output.replaceChildren(Object.assign(document.createElement('p'),{className:'elena-chat-welcome',textContent:'Nuova conversazione. Puoi cercare un documento, una persona o un luogo nelle fonti pubbliche ADC.'}));
      input.focus();
    });
    // Percorsi d'accesso: non alterano le evidenze né il controllo delle risposte.
    const profilePrompts={
      cittadino:{feedback:'Percorso cittadino: luoghi, fotografie, vicende e memoria di Calatabiano.',examples:[['La storia di Calatabiano','origini Calatabiano'],['Chiese del paese','chiese Calatabiano'],['Fotografie storiche','fotografie Calatabiano']]},
      studente:{feedback:'Percorso scuola: cronologie, luoghi, fonti e letture introduttive.',examples:[['Storia per tutti','storia per tutti'],['Il castello','castello Calatabiano'],['Dove sono le fonti?','fonti documenti']]},
      ricercatore:{feedback:'Percorso ricerca: manoscritti, atti, trascrizioni e limiti delle attribuzioni.',examples:[['Pergamene medievali','pergamene medievali'],['Rationes Decimarum','rationes decimarum'],['Monasteri e documenti','monasteri documenti']]},
      istituzione:{feedback:'Percorso istituzioni: consultazione delle fonti, patrimonio e collaborazione con l’Archivio.',examples:[['Patrimonio storico','patrimonio Calatabiano'],['Inventario delle fonti','inventario fonti'],['Attività dell’ADC','archivio documentale']]}
    };
    const profileFeedback=document.getElementById('elena-profile-feedback');
    const examples=document.querySelector('.elena-examples');
    document.querySelectorAll('[data-elena-profile]').forEach(button=>button.addEventListener('click',()=>{
      const choice=profilePrompts[button.dataset.elenaProfile];if(!choice || !examples)return;
      document.querySelectorAll('[data-elena-profile]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      if(profileFeedback)profileFeedback.textContent=choice.feedback;
      examples.replaceChildren();
      choice.examples.forEach(([label,query])=>{
        const item=document.createElement('button');item.type='button';item.dataset.query=query;item.textContent=label;
        item.addEventListener('click',()=>{input.value=query;form.requestSubmit();});
        examples.append(item);
      });
      input.placeholder='Scrivi la tua domanda a Elena…';
      input.focus();
    }));
    // Il benvenuto usa la registrazione originale Paola anche nella pagina completa.
    const welcome=document.getElementById('elena-paola-welcome');
    if(welcome){
      const welcomeAudio=new Audio('/adc/audio/elena-paola-benvenuto.mp3');welcomeAudio.preload='none';welcomeAudio.playbackRate=0.95;welcomeAudio.preservesPitch=true;
      welcome.addEventListener('click',()=>{
        if(!welcomeAudio.paused){welcomeAudio.pause();welcomeAudio.currentTime=0;welcome.textContent='Ascolta Elena';return;}
        welcomeAudio.currentTime=0;
        welcomeAudio.play().then(()=>{welcome.textContent='Ferma Elena';}).catch(()=>{welcome.textContent='Audio Paola non disponibile';});
      });
      welcomeAudio.addEventListener('ended',()=>{welcome.textContent='Ascolta Elena';});
      window.addEventListener('pagehide',()=>welcomeAudio.pause());
    }
    const load=url=>fetch(url,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Risorsa non disponibile');return r.json()});
    const ready=Promise.allSettled([load('/adc/assets/elena-indice.json'),load('/adc/assets/elena-risposte-approvate.json'),load('/adc/assets/elena-conoscenza-verificata.json')]).then(a=>{
      if(a[0].status==='fulfilled' && Array.isArray(a[0].value?.entries)){index=a[0].value;indexAvailable=true;}
      if(a[1].status==='fulfilled' && Array.isArray(a[1].value?.answers)){approved=a[1].value.answers;approvedAvailable=true;}
      if(a[2].status==='fulfilled'&&a[2].value?.schema===1&&Array.isArray(a[2].value.entries)){
        knowledge=a[2].value;knowledgeAvailable=true;
      }
      availability.textContent=indexAvailable
        ? 'Indice consultabile: '+index.entries.length+' percorsi · '+(approvedAvailable?approved.filter(a=>a.status==='APPROVED_FOR_PUBLICATION').length+' risposte approvate':'risposte approvate non disponibili')
        : 'Indice non disponibile. La consultazione è temporaneamente limitata.';
    });
    const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
    // Esplorazione delle schede pubbliche: filtro locale senza inviare o memorizzare ricerche.
    const explorer=document.createElement('section');
    explorer.className='elena-explorer';
    explorer.setAttribute('aria-labelledby','elena-explorer-title');
    const exploreTitle=make('h2','','Esplora il repertorio');
    exploreTitle.id='elena-explorer-title';
    const exploreIntro=make('p','','Cerca per parola, nome, luogo o anno tra le schede indicizzate. I risultati sono collegamenti di consultazione, non conclusioni storiche.');
    const exploreLabel=make('label','','Filtra le schede dell’Archivio');
    exploreLabel.htmlFor='elena-explore-filter';
    const exploreFilter=make('input');exploreFilter.id='elena-explore-filter';exploreFilter.type='search';
    exploreFilter.maxLength=100;exploreFilter.autocomplete='off';
    exploreFilter.placeholder='Per esempio: 1213, monasteri, Annunziata';
    const exploreCount=make('p','elena-explore-count','Il repertorio sarà disponibile dopo il caricamento.');
    exploreCount.setAttribute('role','status');
    const exploreList=make('ul','elena-explore-list');
    const exploreMore=make('button','elena-explore-more','Mostra altre schede');exploreMore.type='button';exploreMore.hidden=true;
    explorer.append(exploreTitle,exploreIntro,exploreLabel,exploreFilter,exploreCount,exploreList,exploreMore);
    output.parentNode.append(explorer);
    let visibleEntries=12;
    function renderExplorer(){
      exploreList.replaceChildren();
      const query=normalize(exploreFilter.value);
      const words=query.split(/[^a-z0-9]+/).filter(Boolean);
      const entries=indexAvailable?index.entries.filter(e=>e && safeUrl(e.url) && typeof e.title==='string'):[];
      const selected=entries.filter(e=>{
        const hay=normalize([e.title,e.description,...(Array.isArray(e.tags)?e.tags:[])].join(' '));
        return words.every(word=>hay.includes(word));
      });
      for(const e of selected.slice(0,visibleEntries)){
        const li=make('li'), link=make('a','',e.title);
        link.href=e.url;
        li.append(link);
        if(e.description)li.append(make('p','',e.description));
        exploreList.append(li);
      }
      exploreCount.textContent=indexAvailable
        ? selected.length+' schede corrispondenti'+(selected.length>visibleEntries?' · mostrate le prime '+visibleEntries:'')
        : 'Indice non disponibile: riprova quando la connessione sarà ripristinata.';
      exploreMore.hidden=visibleEntries>=selected.length;
    }
    exploreFilter.addEventListener('input',()=>{visibleEntries=12;renderExplorer();});
    exploreMore.addEventListener('click',()=>{visibleEntries+=12;renderExplorer();});
    ready.then(renderExplorer);
    function run(query) {
      const q=String(query||'').trim().slice(0,160);if(!q)return;
      ready.then(()=>{
        if(!turns)output.replaceChildren();
        if(window.speechSynthesis)window.speechSynthesis.cancel();
        if(activeAudio){activeAudio.pause();activeAudio.currentTime=0;activeAudio=null;}
        const effective=contextualQuery(q,previousQuestion);
        const partial=(!indexAvailable || !approvedAvailable);
        const r=(!indexAvailable && !approvedAvailable)
          ? {kind:'unavailable',title:'Archivio temporaneamente non disponibile',text:'Non è stato possibile caricare le fonti documentarie. Riprova più tardi: l’assenza di risultati non indica assenza di testimonianze.',links:[]}
          : reply(effective,index,approved,knowledge);
        if(!indexAvailable && r.kind!=='documentary'){
          r.kind='unavailable';
          r.title='Indice documentario non disponibile';
          r.text='Non è stato possibile consultare l’indice delle fonti. Non si può concludere che manchino testimonianze pertinenti.';
          r.links=[];
        }
        previousQuestion=effective;
        output.append(make('p','elena-dialogue-question',q));
        const article=make('article','elena-dialogue-answer');
        article.append(make('h2','',r.title),make('p','',r.text));
        const evidence=make('p','elena-dialogue-evidence',r.kind==='documentary'
          ? 'Risposta verificata nel registro editoriale ADC. Controlla le fonti citate qui sotto.'
          : r.kind==='unavailable'
            ? 'Caricamento delle fonti non riuscito: nessuna conclusione storica può essere tratta.'
          : r.kind==='index'
            ? 'Percorsi di consultazione: i collegamenti non costituiscono una risposta storica approvata.'
            : 'Nessuna attestazione approvata individuata per questa domanda.');
        article.append(evidence);
        if(partial) article.append(make('p','elena-dialogue-evidence',!indexAvailable
          ? 'Non è stato possibile consultare l’intero repertorio. La ricerca non è completa.'
          : 'Le risposte approvate non sono momentaneamente consultabili. I suggerimenti non esauriscono la documentazione.'));
        if(r.kind==='documentary' && r.limitation) article.append(make('p','elena-dialogue-evidence','Limiti della verifica: '+r.limitation));
        const voiceControls=make('div','elena-dialogue-voice');
        const read=make('button','elena-dialogue-read','Ascolta la risposta');
        read.type='button';
        const stop=make('button','elena-dialogue-stop','Interrompi');
        stop.type='button';stop.hidden=true;
        const status=make('p','elena-dialogue-voice-status','');
        const synthesis=window.speechSynthesis;
        let utterance=null;
        const stopAudio=()=>{
          if(synthesis) synthesis.cancel();
          if(activeAudio){activeAudio.pause();activeAudio.currentTime=0;activeAudio=null;}
          utterance=null;stop.hidden=true;read.hidden=false;
        };
        const speedLabel=make('label','elena-dialogue-speed-label','Velocità: ');
        const speed=make('select','elena-dialogue-speed');speed.setAttribute('aria-label','Velocità della risposta vocale');
        for(const [value,label] of [['0.85','Lenta'],['0.95','Naturale'],['1','Normale'],['1.1','Rapida']]){
          const option=make('option','',label);option.value=value;if(value==='0.95')option.selected=true;speed.append(option);
        }
        speedLabel.append(speed);
        read.addEventListener('click',()=>{
          if(!synthesis || typeof SpeechSynthesisUtterance==='undefined'){
            status.textContent='La lettura vocale non è supportata da questo browser.';return;
          }
          stopAudio();
          const spoken=r.title+'. '+r.text+(r.kind==='documentary' && r.limitation ? ' Limiti della verifica: '+r.limitation : '');
          utterance=new SpeechSynthesisUtterance(spoken);
          utterance.lang='it-IT';utterance.rate=Number(speed.value);utterance.pitch=1;
          const voices=synthesis.getVoices();
          const italian=voices.filter(v=>v.lang && v.lang.toLowerCase().startsWith('it'));
          utterance.voice=italian.find(v=>/female|femmina|elsa|paola|alice|lucia|elsa/i.test(v.name)) || italian[0] || null;
          utterance.onend=()=>{utterance=null;stop.hidden=true;read.hidden=false;status.textContent='Lettura terminata.';};
          utterance.onerror=()=>{utterance=null;stop.hidden=true;read.hidden=false;status.textContent='Lettura vocale non riuscita. Verifica le impostazioni vocali del dispositivo.';};
          stop.hidden=false;read.hidden=true;status.textContent='Elena sta leggendo la risposta visualizzata.';
          synthesis.speak(utterance);
        });
        stop.addEventListener('click',()=>{stopAudio();status.textContent='Lettura interrotta.';});
        voiceControls.append(read,stop,speedLabel,status);
        // Il comando vocale precede il testo lungo: resta subito visibile anche su smartphone.
        article.insertBefore(voiceControls,article.children[1] || null);
        if(r.links.length) {
          article.append(make('p','elena-dialogue-sources',r.kind==='documentary'?'Fonti della risposta:':'Apri i documenti e i percorsi:'));
          const list=make('ul','elena-dialogue-links');
          for (const link of r.links) {
            if(!safeUrl(link.url))continue;
            const li=make('li'),a=make('a');a.href=link.url;a.textContent=link.title;li.append(a);
            if(link.description)li.append(make('span','',' — '+link.description));
            list.append(li);
          }
          article.append(list);
        }
        const actions=make('div','elena-answer-actions');
        const copy=make('button','elena-copy-answer','Copia risposta e fonti');copy.type='button';
        const copyStatus=make('span','elena-copy-status','');copyStatus.setAttribute('role','status');
        copy.addEventListener('click',async()=>{
          const lines=[q,r.title,r.text,r.limitation?'Limiti della verifica: '+r.limitation:'',...(r.links||[]).filter(x=>safeUrl(x.url)).map(x=>x.title+' — '+location.origin+x.url),'Fonte: Archivio Documentale Calatabiano — '+location.origin+'/adc/elena/'].filter(Boolean);
          try {
            if(!navigator.clipboard || !window.isSecureContext)throw Error('Copia non supportata');
            await navigator.clipboard.writeText(lines.join('\n\n'));
            copyStatus.textContent='Testo e collegamenti copiati.';
          }catch(_){copyStatus.textContent='Copia non disponibile in questo browser: seleziona il testo della risposta.';}
        });
        actions.append(copy,copyStatus);article.append(actions);
        output.append(article);turns++;
        while(output.children.length>16){output.removeChild(output.firstElementChild);output.removeChild(output.firstElementChild);}
        if(turns>1)article.scrollIntoView({block:'nearest',behavior:'smooth'});
      });
    }
    form.addEventListener('submit',e=>{e.preventDefault();const q=input.value;input.value='';run(q)});
    document.querySelectorAll('[data-query]').forEach(b=>b.addEventListener('click',()=>run(b.dataset.query)));
    let initial='';
    try{const raw=sessionStorage.getItem('adc-elena-handoff');if(raw){sessionStorage.removeItem('adc-elena-handoff');const o=JSON.parse(raw);if(typeof o.q==='string' && Date.now()-o.at>=0 && Date.now()-o.at<120000)initial=o.q}}catch(e){}
    const loc=new URL(window.location.href);
    if(!initial)initial=loc.searchParams.get('q')||'';
    if(!initial && loc.hash.startsWith('#q=')){try{initial=decodeURIComponent(loc.hash.slice(3))}catch(e){}}
    if(loc.searchParams.has('q')||loc.hash.startsWith('#q=')){loc.searchParams.delete('q');loc.hash='';try{history.replaceState(null,'',loc.pathname+loc.search)}catch(e){}}
    if(initial && initial.length<=160)run(initial);
  }
  return {normalize,tokens,rank,reply,knowledgeAnswer,contextualQuery,safeUrl,mount};
});

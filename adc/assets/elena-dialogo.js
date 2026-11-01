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
    const generic = new Set(['archivio','ricerca','bibliografia','territorio']);
    return (entries || []).filter(e => e && safeUrl(e.url)).map(e => {
      const title = normalize(e.title), tags = (e.tags || []).map(normalize), description = normalize(e.description);
      const score = ts.reduce((sum,t) => sum + (title.split(/[^a-z0-9]+/).includes(t) ? 6 : 0) + (tags.some(tag => tag === t || tag.split(/[^a-z0-9]+/).includes(t)) ? 5 : 0) + (description.split(/[^a-z0-9]+/).includes(t) ? 1 : 0),0);
      const strong = ts.some(t => !generic.has(t) && (title.split(/[^a-z0-9]+/).includes(t) || tags.some(tag => tag === t || tag.split(/[^a-z0-9]+/).includes(t))));
      return {e,score,strong};
    }).filter(x => x.score >= 5 && x.strong).sort((a,b) => b.score-a.score || a.e.title.localeCompare(b.e.title,'it')).filter((x,i,all) => all.findIndex(y => y.e.url===x.e.url)===i).slice(0,5).map(x=>x.e);
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
  function reply(q, index, approved) {
    const n = normalize(q);
    // Risposte canoniche consentite soltanto con stato, fonte e testo approvati.
    const answer = (approved || []).find(x => x && x.status === 'APPROVED_FOR_PUBLICATION' && x.question && normalize(x.question)===n && typeof x.answer==='string' && x.answer.trim() && Array.isArray(x.sources) && x.sources.length && x.sources.every(s=>s && safeUrl(s.url) && s.page && s.title) && x.reviewer && x.reviewed_at && x.review_rationale && ['SOURCE_IDENTIFIED','EDITION_TEXT_CHECKED','IMAGE_COLLATED','ORIGINAL_COLLATED'].includes(x.evidence_status) && typeof x.evidence_limitations==='string' && x.sources.every(s=>s.source_type));
    if (answer) return {kind:'documentary',title:'Risposta documentata',text:answer.answer,links:answer.sources.map(s=>({title:s.title+' — p. '+s.page,url:s.url})),limitation:answer.evidence_limitations,evidence_status:answer.evidence_status};
    const matches = rank(q, index?.entries);
    if (matches.length) return {kind:'index',title:'Fonti e percorsi da consultare',text:'Non è disponibile una risposta sintetica verificata per questa domanda. Questi percorsi potrebbero essere pertinenti: consulta le fonti prima di trarre conclusioni.',links:matches.map(e=>({title:e.title,url:e.url,description:e.description}))};
    return {kind:'empty',title:'Nessuna fonte sufficiente individuata',text:'Non ho trovato un percorso sufficientemente pertinente nell’indice pubblico. Puoi consultare il repertorio generale oppure riprovare indicando una località, un anno o un argomento.',links:[{title:'Consulta le fonti e i documenti',url:'/adc/fonti/'},{title:'Leggi la storia di Calatabiano',url:'/adc/storia/'}]};
  }
  function mount() {
    const form=document.getElementById('elena-form'), input=document.getElementById('elena-query'), output=document.getElementById('elena-results');
    if (!form || !input || !output) return;
    let index={entries:[]}, approved=[], turns=0, previousQuestion='', activeAudio=null;
    // Il benvenuto usa la registrazione originale Paola anche nella pagina completa.
    const welcome=document.getElementById('elena-paola-welcome');
    if(welcome){
      const welcomeAudio=new Audio('/adc/audio/elena-paola-benvenuto.mp3');welcomeAudio.preload='none';
      welcome.addEventListener('click',()=>{
        if(!welcomeAudio.paused){welcomeAudio.pause();welcomeAudio.currentTime=0;welcome.textContent='Ascolta Paola';return;}
        welcomeAudio.currentTime=0;
        welcomeAudio.play().then(()=>{welcome.textContent='Ferma Paola';}).catch(()=>{welcome.textContent='Audio Paola non disponibile';});
      });
      welcomeAudio.addEventListener('ended',()=>{welcome.textContent='Ascolta Paola';});
      window.addEventListener('pagehide',()=>welcomeAudio.pause());
    }
    const load=url=>fetch(url,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Risorsa non disponibile');return r.json()});
    const ready=Promise.allSettled([load('/adc/assets/elena-indice.json'),load('/adc/assets/elena-risposte-approvate.json')]).then(a=>{
      if(a[0].status==='fulfilled' && Array.isArray(a[0].value?.entries)) index=a[0].value;
      if(a[1].status==='fulfilled' && Array.isArray(a[1].value?.answers)) approved=a[1].value.answers;
    });
    const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
    function run(query) {
      const q=String(query||'').trim().slice(0,160);if(!q)return;
      ready.then(()=>{
        if(!turns)output.replaceChildren();
        const effective=contextualQuery(q,previousQuestion);
        const r=reply(effective,index,approved);
        previousQuestion=effective;
        output.append(make('p','elena-dialogue-question','Domanda: '+q));
        const article=make('article','elena-dialogue-answer');
        article.append(make('h2','',r.title),make('p','',r.text));
        const evidence=make('p','elena-dialogue-evidence',r.kind==='documentary'
          ? 'Risposta verificata nel registro editoriale ADC. Controlla le fonti citate qui sotto.'
          : r.kind==='index'
            ? 'Percorsi di consultazione: i collegamenti non costituiscono una risposta storica approvata.'
            : 'Nessuna attestazione approvata individuata per questa domanda.');
        article.append(evidence);
        if(r.kind==='documentary' && r.limitation) article.append(make('p','elena-dialogue-evidence','Limiti della verifica: '+r.limitation));
        const voiceControls=make('div','elena-dialogue-voice');
        const read=make('button','elena-dialogue-read','Ascolta la risposta');
        read.type='button';
        const stop=make('button','elena-dialogue-stop','Interrompi');
        stop.type='button';stop.hidden=true;
        const status=make('p','elena-dialogue-voice-status','');
        const audio=new Audio();
        let utterance=null;
        const synthesis=typeof window!=='undefined' ? window.speechSynthesis : null;
        audio.preload='none';
        const recordings={index:'/adc/audio/elena-paola-risposta-indice.mp3',empty:'/adc/audio/elena-paola-risposta-vuota.mp3'};
        const stopAudio=()=>{audio.pause();audio.currentTime=0;if(utterance && synthesis){synthesis.cancel();utterance=null;}if(activeAudio===audio)activeAudio=null;stop.hidden=true;read.hidden=false;};
        read.addEventListener('click',()=>{
          if(r.kind==='documentary'){
            if(!synthesis || typeof SpeechSynthesisUtterance==='undefined'){
              status.textContent='La lettura vocale non è supportata da questo browser.';
              return;
            }
            if(activeAudio && activeAudio!==audio){activeAudio.pause();activeAudio.currentTime=0;}
            synthesis.cancel();
            utterance=new SpeechSynthesisUtterance(r.text);
            utterance.lang='it-IT';
            utterance.rate=.94;
            const paolaVoice=synthesis.getVoices().find(v=>/^it(?:-|_)/i.test(v.lang)&&/paola/i.test(v.name));
            if(!paolaVoice){
              utterance=null;
              status.textContent='La voce Paola non è disponibile per la sintesi di questa risposta. Le registrazioni originali di Paola restano ascoltabili; non viene usata una voce sostitutiva.';
              return;
            }
            utterance.voice=paolaVoice;
            utterance.onend=()=>{utterance=null;stop.hidden=true;read.hidden=false;status.textContent='Lettura terminata.';};
            utterance.onerror=()=>{utterance=null;stop.hidden=true;read.hidden=false;status.textContent='Lettura vocale non riuscita.';};
            stop.hidden=false;read.hidden=true;status.textContent='Elena sta leggendo la risposta.';
            synthesis.speak(utterance);
            return;
          }
          if(!recordings[r.kind]){
            status.textContent='La lettura vocale di questa risposta non è ancora disponibile.';
            return;
          }
          if(activeAudio && activeAudio!==audio){activeAudio.pause();activeAudio.currentTime=0;}
          activeAudio=audio;
          audio.src=recordings[r.kind];
          audio.play().then(()=>{
            stop.hidden=false;read.hidden=true;status.textContent='Elena sta leggendo la risposta.';
          }).catch(()=>{
            stopAudio();status.textContent='Non è stato possibile riprodurre la registrazione.';
          });
        });
        stop.addEventListener('click',()=>{stopAudio();status.textContent='Lettura interrotta.';});
        audio.addEventListener('ended',()=>{stopAudio();status.textContent='Lettura terminata.';});
        voiceControls.append(read,stop,status);
        article.append(voiceControls);
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
  return {normalize,tokens,rank,reply,contextualQuery,safeUrl,mount};
});

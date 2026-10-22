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
  const aliases = {mulino:'mulini',mulini:'mulino',chiesa:'chiese',chiese:'chiesa',origine:'origini',origini:'origine',mappa:'cartografia',mappe:'cartografia',foto:'fotografie',ponte:'alcantara'};
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
  function reply(q, index, approved) {
    const n = normalize(q);
    // Risposte canoniche consentite soltanto con stato, fonte e testo approvati.
    const answer = (approved || []).find(x => x && x.status === 'APPROVED_FOR_PUBLICATION' && x.question && normalize(x.question)===n && typeof x.answer==='string' && x.answer.trim() && Array.isArray(x.sources) && x.sources.length && x.sources.every(s=>s && safeUrl(s.url) && s.page && s.title) && x.reviewer && x.reviewed_at);
    if (answer) return {kind:'documentary',title:'Risposta documentata',text:answer.answer,links:answer.sources.map(s=>({title:s.title+' — p. '+s.page,url:s.url}))};
    const matches = rank(q, index?.entries);
    if (matches.length) return {kind:'index',title:'Fonti e percorsi da consultare',text:'Non è disponibile una risposta sintetica verificata per questa domanda. Questi percorsi potrebbero essere pertinenti: consulta le fonti prima di trarre conclusioni.',links:matches.map(e=>({title:e.title,url:e.url,description:e.description}))};
    return {kind:'empty',title:'Nessuna fonte sufficiente individuata',text:'Non ho trovato un percorso sufficientemente pertinente nell’indice pubblico. Puoi consultare il repertorio generale oppure riprovare indicando una località, un anno o un argomento.',links:[{title:'Consulta le fonti e i documenti',url:'/adc/fonti/'},{title:'Leggi la storia di Calatabiano',url:'/adc/storia/'}]};
  }
  function mount() {
    const form=document.getElementById('elena-form'), input=document.getElementById('elena-query'), output=document.getElementById('elena-results');
    if (!form || !input || !output) return;
    let index={entries:[]}, approved=[], turns=0;
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
        const r=reply(q,index,approved);
        output.append(make('p','elena-dialogue-question','Domanda: '+q));
        const article=make('article','elena-dialogue-answer');
        article.append(make('h2','',r.title),make('p','',r.text));
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
  return {normalize,tokens,rank,reply,safeUrl,mount};
});

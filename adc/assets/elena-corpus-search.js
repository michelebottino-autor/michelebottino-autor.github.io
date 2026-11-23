/* Elena ADC - ricerca locale in un corpus di testi redazionali approvati. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.ElenaCorpus=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const stop=new Set(['che','chi','come','dove','quando','sono','della','delle','degli','nella','nelle','per','con','una','uno','del','nel','sul','alla','dell','quali','cosa','testo','cerca','mostra','fonte','fonti','documento','calatabiano','passaggio','estratto','ricerca','archivio']);
 const normalize=x=>String(x||'').toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
 const terms=x=>[...new Set(normalize(x).split(' ').filter(x=>x.length>2&&!stop.has(x)))];
 function validated(corpus){
  if(corpus?.schema!==1||corpus.kind!=='editorial-corpus'||!Array.isArray(corpus.entries))throw Error('Corpus non valido');
  return corpus.entries.filter(e=>e&&typeof e.id==='string'&&e.text_type==='editorial_summary'&&e.transcription===false&&typeof e.title==='string'&&typeof e.text==='string'&&e.approval_id&&e.evidence_status&&e.reviewed_at&&e.limitations&&Array.isArray(e.sources)&&e.sources.length&&e.sources.every(s=>s&&typeof s.title==='string'&&typeof s.page==='string'&&/^\/adc\/[a-z0-9/_-]+\/$/i.test(s.url)));
 }
 function search(corpus,query){
  const data=validated(corpus),wanted=terms(query);
  if(!wanted.length)return [];
  return data.map(e=>{
   const title=new Set(terms(e.title));const keywords=new Set((Array.isArray(e.keywords)?e.keywords:[]).flatMap(terms));const body=new Set(terms(e.text));
   const coverage=wanted.filter(t=>title.has(t)||keywords.has(t)||body.has(t));
   const score=coverage.reduce((sum,t)=>sum+(title.has(t)?8:0)+(keywords.has(t)?5:0)+(body.has(t)?2:0),0);
   return {entry:e,score,coverage:coverage.length};
  }).filter(x=>x.coverage>0).sort((a,b)=>b.coverage-a.coverage||b.score-a.score||a.entry.id.localeCompare(b.entry.id)).slice(0,10).map(x=>x.entry);
 }
 function mount(document,fetcher){
  const form=document.getElementById('corpus-form'),input=document.getElementById('corpus-query'),results=document.getElementById('corpus-results'),status=document.getElementById('corpus-status');
  if(!form||!input||!results||!status)return;
  let corpus=null;
  const make=(tag,txt)=>{const el=document.createElement(tag);el.textContent=txt;return el};
  const draw=q=>{
   results.replaceChildren();
   if(!corpus){status.textContent='I testi approvati non sono disponibili in questo momento.';return}
   const hits=search(corpus,q);
   if(!q.trim()){status.textContent='Inserisci un argomento, un nome o un anno.';return}
   status.textContent=hits.length?hits.length+' passaggi approvati individuati.':'Nessun passaggio approvato trovato per questa ricerca. L’assenza di risultati non esclude altre fonti nell’archivio.';
   for(const e of hits){
    const article=document.createElement('article');article.className='corpus-record';
    article.append(make('h2',e.title),make('p',e.text));
    article.append(make('p','Tipo: sintesi redazionale ADC, non trascrizione originale.'));
    article.append(make('h3','Fonte e pagine'));
    const ul=document.createElement('ul');
    for(const s of e.sources){const li=document.createElement('li'),a=document.createElement('a');a.href=s.url;a.textContent=s.title+', pp. '+s.page;li.append(a);ul.append(li)}
    article.append(ul,make('p','Limiti della verifica: '+e.limitations));
    article.append(make('small','Approvazione '+e.approval_id+' · '+e.reviewed_at));
    results.append(article);
   }
  };
  form.addEventListener('submit',event=>{event.preventDefault();draw(input.value)});
  fetcher('/adc/assets/elena-corpus-documentario.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Corpus non disponibile');return r.json()}).then(payload=>{validated(payload);corpus=payload;status.textContent='Consulta i passaggi redazionali approvati ADC.';
    let handoff='';
    try{const raw=sessionStorage.getItem('adc-elena-corpus-handoff');if(raw){sessionStorage.removeItem('adc-elena-corpus-handoff');const item=JSON.parse(raw);if(typeof item.q==='string'&&item.q.length<=160&&Date.now()>=item.at&&Date.now()-item.at<120000)handoff=item.q;}}catch(_){}
    const q=handoff||(new URLSearchParams(location.search).get('q')||'');
    if(q&&q.length<=160){input.value=q;draw(q)}}).catch(()=>{status.textContent='I testi approvati non sono disponibili in questo momento.'});
 }
 return {normalize,terms,validated,search,mount};
});
if(typeof document!=='undefined' && typeof fetch==='function')globalThis.ElenaCorpus.mount(document,fetch.bind(globalThis));

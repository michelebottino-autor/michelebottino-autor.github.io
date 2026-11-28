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
  const safeUrl = u => typeof u === 'string' && (/^https:\/\/doi\.org\/10\.5281\/zenodo\.\d+$/.test(u) || /^\/adc\/[a-z0-9/_-]*(?:\.html)?(?:#[a-z0-9_-]+)?$/i.test(u) || /^https:\/\/(?:www\.|pagamentipa\.)?comune\.calatabiano\.ct\.it\/[a-z0-9/?&=_.%-]*$/i.test(u) || /^https:\/\/(?:dark-aronte|michelebottino-autor)\.github\.io\/$/.test(u));
  const tokens = q => [...new Set(normalize(q).split(/[^a-z0-9]+/).filter(x => x.length > 2 && !stop.has(x)).flatMap(x => aliases[x] ? [x, aliases[x]] : [x]))];
  // Ricerca lessicale verificabile: le schede sono suggerimenti di lettura, non risposte storiche.
  // Peso maggiore alle espressioni esatte (es. "Madonna del Carmine") e alle date;
  // nessuna generazione di contenuti non presenti nel repertorio.
  function rank(q, entries) {
    const query=normalize(q), terms=tokens(q);
    if(!terms.length || !Array.isArray(entries))return [];
    const common=new Set(['archivio','ricerca','bibliografia','territorio','medievale','medievali','medioevo','documentale']);
    const specific=terms.filter(t=>!common.has(t));
    if(!specific.length)return [];
    const queryWords=new Set(query.split(/[^a-z0-9]+/).filter(Boolean));
    const containsPhrase=(haystack,phrase)=>{
      const normalized=normalize(haystack).replace(/[^a-z0-9]+/g,' ').trim();
      const target=normalize(phrase).replace(/[^a-z0-9]+/g,' ').trim();
      return target.length>=5 && (' '+normalized+' ').includes(' '+target+' ');
    };
    const candidates=entries.filter(e=>e&&safeUrl(e.url)&&typeof e.title==='string'&&e.title.trim()).map(e=>{
      const title=normalize(e.title), description=normalize(e.description);
      const rawTags=Array.isArray(e.tags)?e.tags.filter(t=>typeof t==='string'):[];
      const tags=rawTags.map(normalize);
      const titleWords=new Set(title.split(/[^a-z0-9]+/).filter(Boolean));
      const descriptionWords=new Set(description.split(/[^a-z0-9]+/).filter(Boolean));
      const tagWords=new Set(tags.flatMap(tag=>tag.split(/[^a-z0-9]+/).filter(Boolean)));
      const matched=specific.filter(t=>titleWords.has(t)||tagWords.has(t));
      let score=terms.reduce((total,t)=>total+
        (titleWords.has(t)?7:0)+(tagWords.has(t)?6:0)+(descriptionWords.has(t)?1:0),0);
      // Una locuzione presente nella domanda e nelle parole chiave identifica più precisamente la scheda.
      for(const tag of tags){
        const words=tag.split(/[^a-z0-9]+/).filter(Boolean);
        if(words.length>=2 && words.length<=6 && words.some(w=>!stop.has(w)) && containsPhrase(query,tag))score+=18;
      }
      const normalizedTitle=title.replace(/[^a-z0-9]+/g,' ').trim();
      if(normalizedTitle.length>=8 && containsPhrase(query,normalizedTitle))score+=22;
      // Le date specifiche hanno priorità; non interpretare anni non presenti nella domanda.
      const years=[...queryWords].filter(w=>/^(?:1[0-9]{3}|20[0-9]{2})$/.test(w));
      const available=new Set([...titleWords,...tagWords]);
      if(years.length && years.every(y=>available.has(y)))score+=10;
      return {e,score,matched:matched.length,yearMismatch:years.length>0&&!years.some(y=>available.has(y))};
    }).filter(x=>x.matched>0&&x.score>=6);
    // Se almeno una scheda contiene tutti i termini specifici, escludi quelle che ne colgono uno soltanto.
    const maxCoverage=candidates.reduce((value,x)=>Math.max(value,x.matched),0);
    const subset=candidates.filter(x=>specific.length<2 || maxCoverage<2 || x.matched===maxCoverage);
    // Evita che una data diversa domini una ricerca con anno esplicito.
    return subset.sort((a,b)=>a.yearMismatch-b.yearMismatch||b.score-a.score||a.e.title.localeCompare(b.e.title,'it'))
      .filter((x,i,all)=>all.findIndex(y=>y.e.url===x.e.url)===i)
      .slice(0,5).map(x=>x.e);
  }
  // Contesto effimero: solo l'ultima domanda in questa scheda, senza memorizzazione.
  function contextualQuery(q, previous) {
    const current=String(q||'').trim();
    const antecedent=String(previous||'').trim();
    if(!antecedent || !current || current.length>160) return current;
    const follow=/^(?:e\s+)?(?:(?:quali?|le|i)\s+(?:fonti|documenti|prove)|dove\s+(?:si\s+)?(?:trova|legg[oe]|sono)|in\s+che\s+(?:anno|periodo)|e\s+(?:poi|prima)|puoi\s+(?:approfondire|spiegare)|parlami\s+(?:di\s+)?(?:quest[oaie]|quello)|e\s+(?:quest[oaie]|quello)|che\s+(?:cosa|documenti|fonti)\s+(?:lo|la|ne))\b/i;
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
  // Ricerca di estratti REDAZIONALI approvati: non sono trascrizioni letterali di pergamene.
  // Una unità è citabile solo se coincide con il relativo registro di approvazione.
  function findPassages(query, knowledge, approved) {
    const n=normalize(query);
    const requested=/(?:passagg|estratt|nel testo|nella trascrizion|nel document|pagina (?:esatta|della fonte)|cerca (?:nel|all.interno del) testo)/.test(n);
    if(!requested)return null;
    const fallback={kind:'passage-empty',title:'Passaggi documentari da verificare',
      text:'Non ho trovato un estratto redazionale approvato per questa ricerca. L’assenza di risultati non esclude altre testimonianze nell’archivio. Per ora la consultazione dei passaggi verificati è limitata al dossier sul 1213.',
      links:[{title:'Repertorio generale delle fonti',url:'/adc/fonti/'}]};
    if(!Array.isArray(knowledge?.entries)||!Array.isArray(approved))return fallback;
    const ignore=new Set(['passaggio','passaggi','estratto','estratti','testo','testi','pagina','pagine','citazione','citazioni','trascrizione','mostrami','mostra','trovami','trova','documento','documenti','ricerca','cerca','verificata','approvato','nel','alla','dei','della','fonte','fonti']);
    const words=new Set(n.split(/[^a-z0-9]+/).filter(t=>t.length>2&&!stop.has(t)&&!ignore.has(t)));
    if(!words.size)return fallback;
    const allowed=new Set(['SOURCE_IDENTIFIED','EDITION_TEXT_CHECKED','IMAGE_COLLATED','ORIGINAL_COLLATED']);
    const matches=knowledge.entries.filter(e=>{
      if(!e||e.status!=='APPROVED_FOR_PUBLICATION'||!allowed.has(e.evidence_status)||
        !e.reviewer||!e.reviewed_at||!e.review_rationale||!e.source_answer_id||
        typeof e.answer!=='string'||!e.answer.trim()||!e.evidence_limitations||
        !Array.isArray(e.sources)||!e.sources.length||!Array.isArray(e.keywords))return false;
      const parent=approved.find(a=>a.id===e.source_answer_id&&a.status==='APPROVED_FOR_PUBLICATION'&&
        a.reviewer&&a.reviewed_at&&a.review_rationale&&Array.isArray(a.sources));
      if(!parent)return false;
      if(!e.sources.every(src=>src&&safeUrl(src.url)&&src.page&&src.source_type&&src.title&&
         parent.sources.some(ps=>ps.url===src.url&&ps.page===src.page&&ps.source_type===src.source_type)))return false;
      const subjectTokens=new Set(tokens(e.subject||''));
      const answerTokens=new Set(tokens(e.answer));
      const keywordTokens=new Set(e.keywords.flatMap(t=>tokens(t)));
      const intersects=[...words].filter(w=>subjectTokens.has(w)||keywordTokens.has(w)||answerTokens.has(w));
      // Evita coincidenze generiche su parole comuni a molte schede: occorre un ancoraggio
      // nel soggetto/parole chiave, più una seconda parola o un identificativo specifico.
      const subjectMatch=[...words].filter(w=>subjectTokens.has(w)||keywordTokens.has(w));
      return subjectMatch.length>=1 && intersects.length>=2;
    }).map(e=>{
      const subject=new Set(tokens(e.subject||'')),answer=new Set(tokens(e.answer));
      const tags=new Set(e.keywords.flatMap(t=>tokens(t)));
      const score=[...words].reduce((n,w)=>n+(subject.has(w)?5:0)+(tags.has(w)?3:0)+(answer.has(w)?1:0),0);
      return {e,score};
    }).sort((a,b)=>b.score-a.score||a.e.id.localeCompare(b.e.id)).slice(0,3);
    if(!matches.length)return fallback;
    const best=matches[0].e;
    return {kind:'passage',id:best.id,title:'Passaggio redazionale verificato',
      text:best.answer,
      links:best.sources.map(src=>({title:src.title+' — pp. '+src.page,url:src.url})),
      limitation:'La ricerca utilizza un testo redazionale, non la trascrizione letterale dell’originale. '+best.evidence_limitations,
      evidence_status:best.evidence_status,reviewer:best.reviewer,reviewed_at:best.reviewed_at};
  }
  // Orientamento editoriale: informazioni sul servizio, mai risposte storiche create dal sistema.
  function serviceAnswer(q) {
    const n=normalize(q);
    if(!n || n.length>160)return null;
    const asksIdentity=/(?:chi|cos.?e|che cos.?e|cosa significa|parlami di)\s+(?:e\s+)?dark\s*aronte|(?:dark\s*aronte).*(?:chi|cos.?e|significa)/.test(n);
    const asksCreators=/(?:chi|da chi).*(?:ideat|creat|realizzat|sviluppat|progettat|costruit).*(?:elena|assistente)|(?:elena).*(?:chi l.ha|chi ti ha|chi ha).*(?:ideat|creat|realizzat|sviluppat)/.test(n);
    if(asksCreators || asksIdentity){
      return {kind:'about',title:asksIdentity?'Chi è DarkAronte?':'Chi ha realizzato Elena?',
        text:asksIdentity
          ? 'DarkAronte cura lo sviluppo tecnologico e software di Elena, nata da un’idea di Michele Bottino per l’Archivio Documentale Calatabiano.'
          : 'Elena nasce da un’idea di Michele Bottino, che cura l’Archivio Documentale Calatabiano. Lo sviluppo tecnologico e software è affidato a DarkAronte. Elena è uno strumento indipendente dell’Archivio, non un servizio del Comune.',
        links:[{title:'Archivio Documentale Calatabiano',url:'/adc/'},{title:'Sito di Michele Bottino',url:'https://michelebottino-autor.github.io/'},{title:'DarkAronte',url:'https://dark-aronte.github.io/'}]};
    }
    const asksAbilities=/(?:cosa|che cosa|quali cose|come).*(?:puoi fare|sai fare|mi puoi aiutare|aiutarmi|funzioni|funziona elena)|(?:chi sei|presentati|a cosa servi|cosa sei|sei una intelligenza artificiale)/.test(n);
    if(asksAbilities){
      return {kind:'guide',title:'Come posso aiutarti',
        text:'Posso aiutarti a trovare documenti, luoghi e vicende di Calatabiano. Quando una risposta storica è verificata, ti indico la fonte. In caso contrario, ti propongo i documenti da consultare. Posso anche indirizzarti alle informazioni pubblicate dal Comune, ma non svolgere pratiche al posto tuo.',
        links:[{title:'Fonti e documenti ADC',url:'/adc/fonti/'},{title:'Storia di Calatabiano',url:'/adc/storia/'},{title:'Esplora l’archivio',url:'/adc/'}]};
    }
    const asksPrivacy=/(?:registri|memorizzi|conservi|salvi|registrazione|privacy|dati personali|dati privati).*(?:domand|chat|conversazion|messagg|ricerc)|(?:chat|conversazion|domand).*(?:salvat|conservat|registrat)/.test(n);
    if(asksPrivacy){
      return {kind:'guide',title:'Le domande e la riservatezza',
        text:'Le domande di questa pagina non vengono conservate nella cronologia di Elena. Per rispondere a una domanda successiva, Elena può tenere conto di quella precedente durante la visita. Non inserire password o dati personali. Per condividere un ricordo, utilizza la pagina dedicata alle testimonianze.',
        links:[{title:'Archivio Documentale Calatabiano',url:'/adc/'}]};
    }
    return null;
  }
  // Gli stati editoriali sono verbali di un'indagine, non nuove prove del fatto storico.
  function researchStatus(query, registry) {
    if(!registry || registry.schema!==1 || !Array.isArray(registry.entries))return null;
    const words=new Set(normalize(query).split(/[^a-z0-9]+/).filter(Boolean));
    const matches=registry.entries.filter(e=>{
      if(!e || !['SOSPESA','CHIUSA AL LIMITE','CHIUSA PER INDISPONIBILITÀ','STUDIO PUBBLICATO'].includes(e.status) ||
         !Array.isArray(e.groups) || e.groups.length<2 || e.groups.some(g=>!Array.isArray(g)||!g.length) ||
         typeof e.text!=='string'||!e.text.trim()||typeof e.limitation!=='string'||!e.limitation.trim() ||
         !Array.isArray(e.links) || !e.links.length || !e.links.every(l=>l&&safeUrl(l.url)&&l.title))return false;
      return e.groups.every(g=>g.some(term=>{
        const parts=normalize(term).split(/[^a-z0-9]+/).filter(Boolean);
        return parts.length>0 && parts.every(w=>words.has(w));
      }));
    });
    if(matches.length!==1)return null;
    const e=matches[0];
    return {kind:'research-status',id:e.id,title:e.title,text:e.text,
      limitation:e.limitation,links:e.links.map(l=>({title:l.title,url:l.url})),research_status:e.status};
  }
  function reply(q, index, approved, knowledge, municipality, news, checks, admin, researchRegistry) {
    const n = normalize(q);
    const recordedStatus=researchStatus(q,researchRegistry);
    if(recordedStatus)return recordedStatus;
    const passage=findPassages(q,knowledge,approved);
    if(passage)return passage;
    const orientation=serviceAnswer(q);
    if(orientation)return orientation;
    // Richiesta esplicita di contribuire con una memoria personale: nessuna raccolta implicita nella chat.
    if(/(?:raccont|testimonianz|ricord|memori)/.test(n) && /(?:voglio|vorrei|posso|condivid|inviar|pubblic|personal|infanzia|nonni|famiglia)/.test(n)){
      return {kind:'contribution',title:'Condividi un ricordo con l’ADC',text:'Puoi raccontare un episodio di Calatabiano attraverso la scheda dedicata. Prima dell’invio decidi se autorizzare una possibile pubblicazione con il tuo nome, in forma anonima, oppure se non autorizzarla. Nulla viene pubblicato automaticamente.',links:[{title:'Apri la raccolta delle memorie',url:'/adc/memorie/'}]};
    }
    // Risposte canoniche consentite soltanto con stato, fonte e testo approvati.
    const answer = (approved || []).find(x => x && x.status === 'APPROVED_FOR_PUBLICATION' && x.question && normalize(x.question)===n && typeof x.answer==='string' && x.answer.trim() && Array.isArray(x.sources) && x.sources.length && x.sources.every(s=>s && safeUrl(s.url) && s.page && s.title) && x.reviewer && x.reviewed_at && x.review_rationale && ['SOURCE_IDENTIFIED','EDITION_TEXT_CHECKED','IMAGE_COLLATED','ORIGINAL_COLLATED'].includes(x.evidence_status) && typeof x.evidence_limitations==='string' && x.sources.every(s=>s.source_type));
    if (answer) return {kind:'documentary',id:answer.id,title:'Risposta documentata',text:answer.answer,links:answer.sources.map(s=>({title:s.title+' — p. '+s.page,url:s.url})),limitation:answer.evidence_limitations,evidence_status:answer.evidence_status,reviewer:answer.reviewer,reviewed_at:answer.reviewed_at};
    const controlled=knowledgeAnswer(q,knowledge,approved);
    if(controlled)return controlled;
    const civic=(typeof globalThis!=='undefined'&&globalThis.ElenaComune&&typeof globalThis.ElenaComune.reply==='function')
      ?globalThis.ElenaComune.reply(q,municipality,news,checks,admin):null;
    if(civic)return civic;
    // Percorsi divulgativi: orientamento, non attestazioni storiche.
    const everyday=[
      [/\b(nonni|bisnonni|antenati|vita quotidiana|come si viveva|come vivevano|paese di una volta)\b/, [['Mestieri, botteghe e fondaci','/adc/locali-storici/'],['Storia del paese','/adc/storia-per-tutti/'],['Calatabiano nel Novecento','/adc/calatabiano-1922-1943/'],['Memorie e testimonianze','/adc/memorie/']]],
      [/\b(foto|fotografie|cartoline)\b/, [['Fotografie e video','/adc/mediateca/']]],
      [/\b(chiesa madre|matrice|annunziata)\b/, [['Le chiese di Calatabiano','/adc/chiese/']]],
      [/\b(cognome|cognomi|famiglia|famiglie)\b/, [['Repertorio biografico','/adc/dizionario-biografico/'],['Persone e protagonisti','/adc/persone/']]]
    ];
    const suggested=everyday.filter(([pattern])=>pattern.test(n)).flatMap(([,links])=>links.map(([title,url])=>({title,url})));
    if(suggested.length)return {kind:'index',title:'Da dove cominciare',text:'Questi percorsi possono aiutarti a trovare ciò che cerchi. Non dispongo ancora di una risposta documentata specifica alla tua domanda.',links:suggested.filter((x,i,a)=>a.findIndex(y=>y.url===x.url)===i)};
    const matches = rank(q, index?.entries);
    if (matches.length) return {kind:'index',title:'Fonti e percorsi da consultare',text:'Non è disponibile una risposta sintetica verificata per questa domanda. Questi percorsi potrebbero essere pertinenti: consulta le fonti prima di trarre conclusioni.',links:matches.map(e=>({title:e.title,url:e.url,description:e.description}))};
    return {kind:'empty',title:'Nessuna fonte sufficiente individuata',text:'Non ho trovato un percorso sufficientemente pertinente nell’indice pubblico. Puoi consultare il repertorio generale oppure riprovare indicando una località, un anno o un argomento.',links:[{title:'Consulta le fonti e i documenti',url:'/adc/fonti/'},{title:'Leggi la storia di Calatabiano',url:'/adc/storia/'}]};
  }
  // Il repertorio collega domande a brani pubblicati con le rispettive riserve.
  const phrase = text=>normalize(text).replace(/[^a-z0-9]+/g,' ').trim();
  function publishedPassageFor(query, catalog) {
    if(catalog?.schema!==1 || !Array.isArray(catalog.entries))return null;
    const n=phrase(query);
    const years=new Set(n.match(/\b[12][0-9]{3}\b/g) || []);
    const matches=catalog.entries.filter(p=>p&&
      /^\/adc\/(?:[a-z0-9_-]+\/)+$/i.test(p.path || '')&&
      /^[a-z0-9_-]+$/i.test(p.anchor || '')&&typeof p.source==='string'&&p.source.trim()&&
      Array.isArray(p.years)&&(!p.requiresYear||years.size)&&[...years].every(y=>p.years.includes(y))&&
      Array.isArray(p.groups)&&p.groups.length&&p.groups.every(group=>
        Array.isArray(group)&&group.some(value=>typeof value==='string'&&phrase(value)&&
          (' '+n+' ').includes(' '+phrase(value)+' '))));
    return matches.length===1 ? matches[0] : null;
  }
  let passageCatalog;
  async function loadPassageCatalog() {
    if(!passageCatalog)passageCatalog=fetch('/adc/assets/elena-passaggi-pubblicati.json',{redirect:'error'})
      .then(response=>{
        if(!response.ok)throw Error('Repertorio dei passaggi non disponibile');
        return response.json();
      }).then(data=>{
        if(data?.schema!==1||!Array.isArray(data.entries))throw Error('Repertorio dei passaggi non valido');
        return data;
      }).catch(error=>{passageCatalog=undefined;throw error;});
    return passageCatalog;
  }

  async function findPublishedPassage(query) {
    try {
      const entry=publishedPassageFor(query,await loadPassageCatalog());
      if(!entry)return null;
      const response=await fetch(entry.path,{redirect:'error'});
      if(!response.ok)return null;
      const page=new DOMParser().parseFromString(await response.text(),'text/html');
      const main=page.querySelector('main');
      const anchor=main?.querySelector('#'+entry.anchor);
      const title=anchor?.matches('section,article')?anchor.querySelector('h2')?.textContent:anchor?.textContent;
      const elements=main?.querySelectorAll('[data-elena-passaggio="'+entry.anchor+'"]');
      if(!title || elements?.length!==2)return null;
      const extract=element=>element.textContent.replace(/\s+/g,' ').trim();
      const [text,limitation]=Array.from(elements,extract);
      if(!text||!limitation)return null;
      return {kind:'published-passage',title:title.trim(),text,limitation,
        links:[{title:entry.source,url:entry.path+'#'+entry.anchor}]};
    } catch (_) {return null;}
  }

  let publicPages;
  async function findPublicPages(query, response) {
    if (response.kind === 'empty' || response.kind === 'index') {
      const passage=await findPublishedPassage(query);
      if(passage)return passage;
    }
    if (response.kind !== 'empty') return response;
    const terms = normalize(query).match(/[a-z0-9]+/g) || [];
    const words = [...new Set(terms.filter(w => w.length > 2 && !stop.has(w)
      && !['puoi','potresti','mostrami','trovare','archivio','qualche','riguardo','riguarda'].includes(w)))];
    if (!words.length) return response;
    try {
      if (!publicPages) {
        publicPages = fetch('/adc/cerca/indice-pagine.json', {cache:'no-cache'}).then(async result => {
          if (!result.ok) throw Error('Indice delle pagine non disponibile');
          const data = await result.json();
          if (!Array.isArray(data.pages)) throw Error('Indice delle pagine non valido');
          return data.pages.flatMap(page => {
            const url = typeof page?.url === 'string'
              ? page.url.replace(/^https:\/\/michelebottino-autor\.github\.io(?=\/)/, '') : '';
            if (!safeUrl(url) || !url.startsWith('/adc/') || url === '/adc/' || url.startsWith('/adc/elena/')
              || typeof page.title !== 'string' || typeof page.text !== 'string') return [];
            const titleWords = new Set(normalize(page.title).match(/[a-z0-9]+/g));
            const bodyWords = new Set(normalize(page.text).match(/[a-z0-9]+/g));
            return [{title:page.title, url, titleWords, bodyWords}];
          });
        }).catch(error => {publicPages=undefined;throw error;});
      }
      const links = (await publicPages).map(page => {
        const titleHits = words.filter(word => page.titleWords.has(word)).length;
        const matches = words.every(word => page.titleWords.has(word) || page.bodyWords.has(word));
        return {title:page.title, url:page.url, score:matches ? 1 + titleHits : 0};
      }).filter(page => page.score > 0).sort((a,b) => b.score-a.score)
        .slice(0,5).map(({title,url}) => ({title,url}));
      if (links.length) return {
        kind:'index', title:'Pagine dell’Archivio da consultare',
        text:'Ho trovato queste pagine nel catalogo pubblico. Aprile per leggere i testi e controllare i riferimenti.', links
      };
    } catch (_) {}
    return response;
  }
  function mount() {
    const form=document.getElementById('elena-form'), input=document.getElementById('elena-query'), output=document.getElementById('elena-results');
    if (!form || !input || !output) return;
    let index={entries:[]}, approved=[], knowledge={entries:[]}, municipality=null, municipalNews=null, sourceChecks=null, administration=null, researchRegistry=null, knowledgeAvailable=false, turns=0, previousQuestion='', indexAvailable=false, approvedAvailable=false;
    let pendingTurn=Promise.resolve();
    let conversationRevision=0;
    const tools=document.createElement('div');tools.className='elena-conversation-tools';
    const availability=document.createElement('p');availability.className='elena-source-status';availability.setAttribute('role','status');
    availability.textContent='Sto aprendo le fonti dell’Archivio…';
    const clear=document.createElement('button');clear.type='button';clear.className='elena-clear';clear.textContent='Nuova conversazione';
    tools.append(availability,clear);
    output.parentNode.insertBefore(tools,output);
    output.setAttribute('role','log');output.setAttribute('aria-label','Conversazione con Elena');
    output.setAttribute('aria-relevant','additions');
    clear.addEventListener('click',()=>{
      conversationRevision++;previousQuestion='';turns=0;input.value='';
      output.replaceChildren(Object.assign(document.createElement('p'),{className:'elena-chat-welcome',textContent:'Nuova conversazione. Che cosa vuoi cercare?'}));
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
    const load=url=>fetch(url,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Risorsa non disponibile');return r.json()});
    const ready=Promise.allSettled([load('/adc/assets/elena-indice.json'),load('/adc/assets/elena-risposte-approvate.json'),load('/adc/assets/elena-conoscenza-verificata.json'),load('/adc/assets/elena-comune-fonti.json'),load('/adc/assets/elena-comune-news.json'),load('/adc/assets/elena-comune-verifiche.json'),load('/adc/assets/elena-amministrazione.json'),load('/adc/assets/elena-stati-ricerca.json')]).then(a=>{
      if(a[0].status==='fulfilled' && Array.isArray(a[0].value?.entries)){index=a[0].value;indexAvailable=true;}
      if(a[1].status==='fulfilled' && Array.isArray(a[1].value?.answers)){approved=a[1].value.answers;approvedAvailable=true;}
      if(a[2].status==='fulfilled'&&a[2].value?.schema===1&&Array.isArray(a[2].value.entries)){
        knowledge=a[2].value;knowledgeAvailable=true;
      }
      if(a[3].status==='fulfilled'&&a[3].value?.schema===1)municipality=a[3].value;
      if(a[4].status==='fulfilled'&&a[4].value?.schema===1)municipalNews=a[4].value;
      if(a[5].status==='fulfilled'&&a[5].value?.schema===1)sourceChecks=a[5].value;
      if(a[6].status==='fulfilled'&&a[6].value?.schema===1)administration=a[6].value;
      if(a[7].status==='fulfilled'&&a[7].value?.schema===1&&Array.isArray(a[7].value.entries))researchRegistry=a[7].value;
      availability.textContent=indexAvailable
        ? 'Le fonti dell’Archivio sono pronte per la consultazione.'
        : 'Non riesco ad aprire tutte le fonti in questo momento. Riprova più tardi.';
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
      const revision=conversationRevision;
      pendingTurn=pendingTurn.then(()=>ready).then(async ()=>{
        if (revision!==conversationRevision) return;
        const effective=contextualQuery(q,previousQuestion);
        const partial=(!indexAvailable || !approvedAvailable);
        const passageQuery=findPassages(effective,knowledge,approved);
        let r=(passageQuery && (!knowledgeAvailable || !approvedAvailable))
          ? {kind:'unavailable',title:'Estratti temporaneamente non disponibili',text:'Le unità documentarie approvate non sono al momento consultabili. Riprova quando saranno disponibili: non è possibile stabilire se esista un passaggio pertinente.',links:[]}
          : (!indexAvailable && !approvedAvailable && !municipality && !administration && !serviceAnswer(effective) && !passageQuery)
          ? {kind:'unavailable',title:'Archivio temporaneamente non disponibile',text:'Non è stato possibile caricare le fonti documentarie. Riprova più tardi: l’assenza di risultati non indica assenza di testimonianze.',links:[]}
          : reply(effective,index,approved,knowledge,municipality,municipalNews,sourceChecks,administration,researchRegistry);
        if(!indexAvailable && !['documentary','passage','passage-empty','civic','guide','about','contribution','unavailable','research-status'].includes(r.kind)){
          r.kind='unavailable';
          r.title='Indice documentario non disponibile';
          r.text='Non è stato possibile consultare l’indice delle fonti. Non si può concludere che manchino testimonianze pertinenti.';
          r.links=[];
        }
        previousQuestion=effective;
        r=await findPublicPages(effective,r);
        if (revision!==conversationRevision) return;
        if (!turns) output.replaceChildren();
        output.append(make('p','elena-dialogue-question',q));
        const article=make('article','elena-dialogue-answer');
        article.append(make('h2','',r.title),make('p','',r.text));
        const recording = officialRecording(r, document);
        if (recording) {
          article.dataset.adcAudio = 'official';
          article.append(recording);
        }
        const evidence=make('p','elena-dialogue-evidence',r.kind==='documentary' || r.kind==='passage'
          ? (r.kind==='passage' ? 'Testo approvato dalla redazione ADC. La fonte e le pagine sono indicate sotto.' : 'Risposta verificata nel registro editoriale ADC. Controlla le fonti citate qui sotto.')
          : r.kind==='published-passage'
            ? 'Passaggio ripreso da una scheda pubblicata dell’Archivio.'
          : r.kind==='unavailable'
            ? 'Caricamento delle fonti non riuscito: nessuna conclusione storica può essere tratta.'
          : r.kind==='civic'
            ? 'Servizi e comunicazioni del Comune: informazioni attribuite al portale istituzionale. Verifica date e possibili aggiornamenti.'
          : r.kind==='research-status'
            ? (r.research_status==='STUDIO PUBBLICATO'?'Stato della ricerca ADC: studio pubblicato. Consulta la fonte e i limiti documentari.':'Stato della ricerca ADC: indagine sospesa o chiusa al limite delle fonti consultate. Non costituisce prova che il fatto storico non sia mai avvenuto.')
          : r.kind==='passage-empty'
            ? 'Non viene proposta alcuna citazione priva di un riferimento approvato.'
          : r.kind==='index'
            ? 'Questi collegamenti aiutano a proseguire la ricerca. Non sono, da soli, una prova storica.'
          : r.kind==='guide' || r.kind==='about' || r.kind==='contribution'
            ? 'Informazioni sul servizio ADC. Per i dati storici consulta le fonti documentarie indicate.'
            : 'Nessuna attestazione approvata individuata per questa domanda.');
        article.append(evidence);
        if((r.kind==='documentary'||r.kind==='passage') && r.reviewed_at && r.evidence_status){
          const levels={SOURCE_IDENTIFIED:'Fonte identificata',EDITION_TEXT_CHECKED:'Edizione controllata',
            IMAGE_COLLATED:'Collazione su immagini',ORIGINAL_COLLATED:'Originale collazionato'};
          article.append(make('p','elena-dialogue-evidence',
            (levels[r.evidence_status]||'Verifica documentaria')+
            ' · Revisione: '+r.reviewed_at+
            (r.reviewer?' · '+r.reviewer:'')));
        }
        if(partial && !['civic','guide','about','contribution','passage','passage-empty','research-status'].includes(r.kind)) article.append(make('p','elena-dialogue-evidence',!indexAvailable
          ? 'Non è stato possibile consultare l’intero repertorio. La ricerca non è completa.'
          : 'Le risposte approvate non sono momentaneamente consultabili. I suggerimenti non esauriscono la documentazione.'));
        if(r.kind==='civic' && r.limitation) article.append(make('p','elena-dialogue-evidence','Avvertenza: '+r.limitation));
        if((r.kind==='documentary'||r.kind==='passage'||r.kind==='published-passage'||r.kind==='research-status') && r.limitation) article.append(make('p','elena-dialogue-evidence','Limiti della verifica: '+r.limitation));
        if(r.links.length) {
          article.append(make('p','elena-dialogue-sources',(r.kind==='documentary'||r.kind==='passage')?'Fonti della risposta:':r.kind==='civic'?'Fonte ufficiale del Comune:':r.kind==='research-status'?'Consulta il dossier della questione:':'Apri i documenti e i percorsi:'));
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
          const lines=[q,r.title,r.text,r.limitation?'Limiti della verifica: '+r.limitation:'',...(r.links||[]).filter(x=>safeUrl(x.url)).map(x=>x.title+' — '+(x.url.startsWith('https://')?x.url:location.origin+x.url)),'Fonte: Archivio Documentale Calatabiano — '+location.origin+'/adc/elena/'].filter(Boolean);
          try {
            if(!navigator.clipboard || !window.isSecureContext)throw Error('Copia non supportata');
            await navigator.clipboard.writeText(lines.join('\n\n'));
            copyStatus.textContent='Testo e collegamenti copiati.';
          }catch(_){copyStatus.textContent='Copia non disponibile in questo browser: seleziona il testo della risposta.';}
        });
        actions.append(copy,copyStatus);
        if((r.kind==='documentary'||r.kind==='passage') && r.links?.some(link=>safeUrl(link.url))){
          const exploreText=make('button','elena-approved-text-link','Cerca nei testi verificati');exploreText.type='button';
          exploreText.addEventListener('click',()=>{
            try{sessionStorage.setItem('adc-elena-corpus-handoff',JSON.stringify({q:q.slice(0,160),at:Date.now()}))}catch(_){}
            window.location.assign('/adc/elena/documenti/');
          });
          actions.append(exploreText);
        }
        article.append(actions);
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
  function officialRecording(r, document) {
    if (!(r.kind==='documentary' && r.id==='E-026-A01-A03' && r.text==="Nel marzo 1213 Costanza, insieme al figlio Enrico, confermò alla Chiesa di Catania il castello di Calatabiano con le sue pertinenze. Il privilegio ricorda che il castello era stato acquisito al fisco regio dopo la vicenda del conte Pagano de Parisio e successivamente affidato al conte Arnaldo. Il testo menziona un pagamento di 15.000 tarì ad Arnaldo o al suo procuratore. Si tratta di un privilegio di concessione e conferma, non del contratto originale di compravendita.")) return null;
    const audio = document.createElement('audio');
    audio.className = 'elena-recorded-answer';
    audio.controls = true;
    audio.preload = 'none';
    audio.src = '/adc/audio/elena-serena-risposta-E-026-A01-A03.mp3?v=20261126';
    audio.setAttribute('aria-label', 'Ascolta la risposta con la voce ufficiale di Elena');
    return audio;
  }

  return {normalize,tokens,rank,reply,officialRecording,findPassages,serviceAnswer,knowledgeAnswer,publishedPassageFor,researchStatus,contextualQuery,safeUrl,findPublicPages,mount};
});

/* © 2026 Michele Bottino — Elena: assistenza contestuale documentaria. Nessuna domanda viene inserita negli URL o salvata. */
(function(){
 'use strict';
 if(document.querySelector('[data-elena-assistente]'))return;
 const root=document.createElement('aside');root.dataset.elenaAssistente='';root.className='elena-presenza';
 root.innerHTML=`<button class="elena-presenza-toggle" type="button" aria-expanded="false" aria-controls="elena-presenza-panel">Elena · Posso aiutarti?</button><section id="elena-presenza-panel" class="elena-presenza-panel" hidden aria-label="Assistenza di Elena"><div class="elena-presenza-heading"><strong>Elena · Archivio Documentale Calatabiano</strong><button type="button" class="elena-presenza-close" aria-label="Chiudi Elena">×</button></div><p class="elena-presenza-message"></p><form class="elena-presenza-form"><label for="elena-presenza-query">Che cosa stai cercando?</label><input id="elena-presenza-query" type="search" maxlength="160" autocomplete="off" placeholder="Un luogo, una data, un documento" required><button type="submit">Chiedi a Elena</button></form><div class="elena-presenza-result" aria-live="polite"></div><div class="elena-voice-controls"><button type="button" class="elena-voice-sample">Ascolta un campione della voce</button></div><p class="elena-voice-note" role="status"></p><p><a href="/adc/chiese/schede/maria-santissima-annunziata/#elena-audioguida">Audioguida della Chiesa Madre</a></p><a href="/adc/elena/">Apri la pagina completa di Elena</a><p class="elena-presenza-credits">Un’idea di Michele Bottino · Sviluppo DarkAronte</p><p class="elena-presenza-privacy">Elena consulta le schede pubbliche dell’Archivio. Le domande non compaiono nell’indirizzo della pagina.</p></section>`;
 const voiceStyle=document.createElement('style');voiceStyle.textContent='.elena-open-full{display:block;margin:12px 0;padding:10px 13px;border:1px solid #8b997e;border-radius:8px;background:#e9f0e9;color:#163d34;font:600 .9rem system-ui;cursor:pointer}.elena-open-full:focus-visible{outline:3px solid #b39256;outline-offset:2px}.elena-voice-controls{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 6px}.elena-voice-controls button{border:1px solid #8b997e;border-radius:7px;background:#f5f3eb;color:#163d34;padding:9px 12px;font:600 .87rem system-ui;cursor:pointer}.elena-voice-controls button:focus-visible{outline:3px solid #b39256;outline-offset:2px}.elena-voice-controls button[hidden]{display:none}.elena-voice-note{font-size:.76rem;color:#4f6057;margin:5px 0 12px}';document.head.appendChild(voiceStyle);
 document.body.append(root);
 const toggle=root.querySelector('.elena-presenza-toggle'),panel=root.querySelector('.elena-presenza-panel'),close=root.querySelector('.elena-presenza-close'),msg=root.querySelector('.elena-presenza-message'),form=root.querySelector('form'),input=root.querySelector('input'),result=root.querySelector('.elena-presenza-result'),send=form.querySelector('button');
 const voiceSampleButton=root.querySelector('.elena-voice-sample');
 const voiceSampleAudio=new Audio('/adc/audio/elena-ufficiale.mp3?v=20261125-voce');
 voiceSampleAudio.preload='none';
 const voiceNote=root.querySelector('.elena-voice-note');
 const sampleLabel='Ascolta un campione della voce';
 function stopSpeech(){
   voiceSampleAudio.pause();
   voiceSampleAudio.currentTime=0;
   result.querySelector('audio')?.pause();
   voiceSampleButton.textContent=sampleLabel;
 }
 voiceSampleButton.addEventListener('click',()=>{
   if(!voiceSampleAudio.paused){stopSpeech();return;}
   result.querySelector('audio')?.pause();
   voiceNote.textContent='';
   voiceSampleAudio.play().then(()=>{
     if(!voiceSampleAudio.paused)voiceSampleButton.textContent='Ferma il campione';
   }).catch(()=>{if(!panel.hidden)voiceNote.textContent='Impossibile riprodurre il campione. Riprova.';});
 });
 voiceSampleAudio.addEventListener('ended',stopSpeech);
 window.addEventListener('pagehide',stopSpeech);

 // Messaggio uguale per tutti i visitatori e per tutte le sezioni ADC.
 const pageMain=document.querySelector('main')||document.querySelector('article');
 const pageHeading=pageMain?.querySelector('h1')||document.querySelector('h1');
 const pageTitle=(pageHeading?.textContent||document.title||'').replace(/\s+/g,' ').trim().slice(0,180);
 const pagePath=location.pathname;
 const canUsePage=!!pageMain&&!!pageTitle&&!/^\/adc\/(?:elena|cerca|memorie|widget|custode)(?:\/|$)/.test(pagePath)&&pagePath!=='/adc/';
 const normal=value=>String(value||'').toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 function pageParagraphs(){
   if(!canUsePage)return [];
   return [...pageMain.querySelectorAll('p,li,blockquote,figcaption')].filter(e=>!e.closest('nav,footer,form,aside,button,[hidden],details:not([open]),.adc-reading-controls,.elena-presenza')&&e.getClientRects().length).map(e=>e.textContent.replace(/\s+/g,' ').trim()).filter(t=>t.length>=45);
 }
 msg.textContent=canUsePage?'Stai consultando: '+pageTitle+'. Puoi chiedermi indicazioni sul testo di questa pagina oppure cercare in tutto l’Archivio.':'Posso aiutarti a trovare documenti, luoghi e testimonianze nelle fonti dell’Archivio.';
 const make=(tag,text,cls)=>{const el=document.createElement(tag);el.textContent=text||'';if(cls)el.className=cls;return el;};
 if(canUsePage){
   const shortcuts=make('div','','elena-voice-controls');
   const options=[['Di cosa parla questa pagina?','Di cosa parla questa pagina?'],['Trova un passaggio','Trova un passaggio in questa pagina']];
   for(const [label,query] of options){const b=make('button',label);b.type='button';b.addEventListener('click',()=>{if(label==='Trova un passaggio'){input.value='In questa pagina cerca ';input.focus();}else{input.value=query;form.requestSubmit();}});shortcuts.append(b);}
   msg.after(shortcuts);
 }
 function pageReply(q){
   if(!canUsePage)return null;
   const n=normal(q);
   const overview=/^(?:di cosa parla|cosa tratta|cosa dice|riassumi|spiegami|presentami) (?:questa|la) pagina[?.! ]*$/.test(n);
   const local=/\b(?:questa pagina|qui nel testo|in questo testo)\b/.test(n);
   if(!overview&&!local)return null;
   const paragraphs=pageParagraphs();
   const omitted=new Set('in questa pagina cerca trova un una il lo la le di del della dei delle che cosa dice parla testo qui nel questo spiegami mostrami quali quale come dove quando sono e a su per'.split(' '));
   const terms=[...new Set((n.match(/[a-z0-9]+/g)||[]).filter(w=>w.length>2&&!omitted.has(w)))];
   const selected=overview?paragraphs.slice(0,3):terms.length?paragraphs.map((t,i)=>({t,i,score:terms.filter(w=>normal(t).includes(w)).length})).filter(x=>x.score===terms.length).sort((a,b)=>b.score-a.score||a.i-b.i).slice(0,3).map(x=>x.t):[];
   if(!selected.length)return {kind:'page-context',title:'Nessun passaggio individuato nella pagina',text:'Non ho individuato un passaggio che corrisponda alla richiesta nel testo attualmente visibile. Prova con un termine più breve oppure cerca in tutto l’Archivio.',links:[{title:'Ricerca nell’Archivio',url:'/adc/cerca/'}]};
   return {kind:'page-context',title:overview?'Introduzione alla pagina: '+pageTitle:'Passaggi della pagina: '+pageTitle,text:'Estratti dal testo pubblicato (non una nuova verifica storica):',extracts:selected.map(t=>t.length>650?t.slice(0,650).trim()+'…':t),links:[{title:'Pagina consultata',url:pagePath}]};
 }
 let loader=null,resources=null,busy=false,previousQuestion='';
 function loadEngine(){
   if(window.ElenaADCDialogo)return Promise.resolve(window.ElenaADCDialogo);
   if(!loader)loader=new Promise((resolve,reject)=>{
     if(!window.ElenaComune){
       const civic=document.createElement('script');civic.src='/adc/assets/elena-comune.js';civic.async=false;
       civic.onerror=()=>reject(Error('Modulo comunale non disponibile'));
       civic.onload=()=>loadMain();
       document.head.append(civic);
       return;
     }
     loadMain();
     function loadMain(){
     const script=document.createElement('script');script.src='/adc/assets/elena-dialogo.js?v=20261125-voce';script.async=true;
     script.onload=()=>window.ElenaADCDialogo?resolve(window.ElenaADCDialogo):reject(Error('Motore documentario non disponibile'));
     script.onerror=()=>reject(Error('Impossibile caricare il motore documentario'));
     document.head.append(script);
     }
   }).catch(err=>{loader=null;throw err});
   return loader;
 }
 function loadResources(){
   if(!resources)resources=Promise.all([
     fetch('/adc/assets/elena-indice.json',{cache:'no-store'}),
     fetch('/adc/assets/elena-risposte-approvate.json',{cache:'no-store'}),
     fetch('/adc/assets/elena-conoscenza-verificata.json',{cache:'no-store'}),
     fetch('/adc/assets/elena-comune-fonti.json',{cache:'no-store'}).catch(()=>({ok:false})),
     fetch('/adc/assets/elena-comune-news.json',{cache:'no-store'}).catch(()=>({ok:false})),
     fetch('/adc/assets/elena-comune-verifiche.json',{cache:'no-store'}).catch(()=>({ok:false})),
     fetch('/adc/assets/elena-amministrazione.json',{cache:'no-store'}).catch(()=>({ok:false})),
     fetch('/adc/assets/elena-stati-ricerca.json',{cache:'no-store'}).catch(()=>({ok:false}))
   ]).then(async responses=>{
     if(!responses[0].ok||!responses[1].ok)throw Error('Indice delle risposte non disponibile');
     return Promise.all(responses.map(r=>r.ok?r.json().catch(()=>null):null));
   }).then(([index,approved,knowledge,municipality,news,checks,admin,researchRegistry])=>{
     if(!Array.isArray(index?.entries)||!Array.isArray(approved?.answers))throw Error('Formato delle risorse documentarie non valido');
     return {index,approved:approved.answers,knowledge:knowledge?.schema===1&&Array.isArray(knowledge.entries)?knowledge:{entries:[]},municipality:municipality?.schema===1?municipality:null,news:news?.schema===1?news:null,checks:checks?.schema===1?checks:null,admin:admin?.schema===1?admin:null,researchRegistry};
   }).catch(err=>{resources=null;throw err});
   return resources;
 }
 function setOpen(open){if(!open)stopSpeech();if(open)root.classList.remove('elena-presenza-reading');panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)input.focus();else toggle.focus();}
 // On small screens, a downward scroll reduces the visual prominence
 // of Elena without removing its keyboard/touch access.
 let prevY=window.scrollY, pending=false;
 function refreshReadingState(){
   pending=false;
   if(!window.matchMedia('(max-width:600px)').matches||!panel.hidden){
     root.classList.remove('elena-presenza-reading');
     prevY=window.scrollY;return;
   }
   const nextY=window.scrollY, delta=nextY-prevY;
   if(nextY<120 || delta < -8)root.classList.remove('elena-presenza-reading');
   else if(delta>8)root.classList.add('elena-presenza-reading');
   prevY=nextY;
 }
 window.addEventListener('scroll',()=>{
   if(!pending){pending=true;window.requestAnimationFrame(refreshReadingState);}
 },{passive:true});
 toggle.addEventListener('focus',()=>root.classList.remove('elena-presenza-reading'));
 toggle.addEventListener('click',()=>setOpen(panel.hidden));
 close.addEventListener('click',()=>setOpen(false));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)setOpen(false)});
 form.addEventListener('submit',async e=>{
   e.preventDefault();const q=input.value.trim();if(!q||busy)return;
   stopSpeech();
   busy=true;send.disabled=true;result.replaceChildren(make('p','Consulto le schede pubbliche dell’Archivio…'));
   try{
     const localReply=pageReply(q);
     if(localReply){
       result.replaceChildren(make('p',localReply.title),make('p',localReply.text));
       for(const excerpt of localReply.extracts||[])result.append(make('blockquote',excerpt));
       for(const source of localReply.links){const p=make('p'),a=make('a',source.title);a.href=source.url;p.append(a);result.append(p);}
       input.value='';return;
     }
     const [engine,data]=await Promise.all([loadEngine(),loadResources()]);
     const contextual=engine.contextualQuery?engine.contextualQuery(q,previousQuestion):q;
     const referring=canUsePage&&/^(?:e\s+)?(?:quali? (?:fonti|documenti)|dove (?:si )?trova|in che (?:anno|periodo)|puoi approfondire|puoi spiegare)\b/i.test(q)&&!previousQuestion;
     const effective=referring?(q+' '+pageTitle).slice(0,160):contextual;
     let reply=engine.reply(effective,data.index,data.approved,data.knowledge,data.municipality,data.news,data.checks,data.admin,data.researchRegistry);
     previousQuestion=effective;
     if(engine.findPublicPages) reply=await engine.findPublicPages(effective,reply);
     result.replaceChildren(make('p',reply.title),make('p',reply.text));
     const recording=engine.officialRecording(reply,document);
     if(recording){
       recording.style.width='100%';
       recording.addEventListener('play',()=>{
         voiceSampleAudio.pause();
         voiceSampleButton.textContent=sampleLabel;
       });
       result.append(recording);
     }
     if(reply.limitation)result.append(make('p','Limite della documentazione: '+reply.limitation,'elena-presenza-evidence'));
     if(reply.kind==='documentary'&&reply.reviewed_at&&reply.evidence_status){
       const levels={SOURCE_IDENTIFIED:'Fonte identificata',EDITION_TEXT_CHECKED:'Edizione controllata',IMAGE_COLLATED:'Collazione su immagini',ORIGINAL_COLLATED:'Originale collazionato'};
       result.append(make('p',(levels[reply.evidence_status]||'Verifica documentaria')+' · Revisione: '+reply.reviewed_at+(reply.reviewer?' · '+reply.reviewer:''),'elena-presenza-evidence'));
     }
     for(const source of (reply.links||[]).slice(0,5)){
       if(!(engine.safeUrl?engine.safeUrl(source.url):/^\/adc\/(?!\/)[a-z0-9/_\-.]*$/i.test(source.url)))continue;
       const p=make('p'),link=make('a',source.title);link.href=source.url;p.append(link);result.append(p);
     }
     const more=make('button','Apri questa domanda nella pagina completa di Elena','elena-open-full');
     more.type='button';
     more.addEventListener('click',()=>{
       try{sessionStorage.setItem('adc-elena-handoff',JSON.stringify({q:effective.slice(0,160),at:Date.now()}));}
       catch(_){}
       window.location.assign('/adc/elena/');
     });
     result.append(more);
     input.value='';
   }catch(_){result.replaceChildren(make('p','La consultazione non è disponibile in questo momento. Puoi aprire la pagina completa di Elena.'));}
   finally{busy=false;send.disabled=false;}
 });
})();

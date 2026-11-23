/* © 2026 Michele Bottino — Elena: assistenza contestuale documentaria. Nessuna domanda viene inserita negli URL o salvata. */
(function(){
 'use strict';
 if(document.querySelector('[data-elena-assistente]'))return;
 const root=document.createElement('aside');root.dataset.elenaAssistente='';root.className='elena-presenza';
 root.innerHTML=`<button class="elena-presenza-toggle" type="button" aria-expanded="false" aria-controls="elena-presenza-panel">Elena · Posso aiutarti?</button><section id="elena-presenza-panel" class="elena-presenza-panel" hidden aria-label="Assistenza di Elena"><div class="elena-presenza-heading"><strong>Elena · Archivio Documentale Calatabiano</strong><button type="button" class="elena-presenza-close" aria-label="Chiudi Elena">×</button></div><p class="elena-presenza-message"></p><form class="elena-presenza-form"><label for="elena-presenza-query">Che cosa stai cercando?</label><input id="elena-presenza-query" type="search" maxlength="160" autocomplete="off" placeholder="Un luogo, una data, un documento" required><button type="submit">Chiedi a Elena</button></form><div class="elena-presenza-result" aria-live="polite"></div><div class="elena-voice-controls"><button type="button" class="elena-paola-sample">Ascolta un campione della voce</button><button type="button" class="elena-voice-read" hidden disabled>Lettura risposta non disponibile</button><button type="button" class="elena-voice-page" disabled title="Lettura con la voce ufficiale in attesa di validazione">Lettura pagina non disponibile</button><button type="button" class="elena-voice-stop" hidden>Interrompi lettura</button></div><p class="elena-voice-note">Il campione della voce è disponibile. La lettura delle risposte è ancora in preparazione.</p><a href="/adc/elena/">Apri la pagina completa di Elena</a><p class="elena-presenza-credits">Un’idea di Michele Bottino · Sviluppo DarkAronte</p><p class="elena-presenza-privacy">Elena consulta le schede pubbliche dell’Archivio. Le domande non compaiono nell’indirizzo della pagina.</p></section>`;
 const voiceStyle=document.createElement('style');voiceStyle.textContent='.elena-open-full{display:block;margin:12px 0;padding:10px 13px;border:1px solid #8b997e;border-radius:8px;background:#e9f0e9;color:#163d34;font:600 .9rem system-ui;cursor:pointer}.elena-open-full:focus-visible{outline:3px solid #b39256;outline-offset:2px}.elena-voice-controls{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 6px}.elena-voice-controls button{border:1px solid #8b997e;border-radius:7px;background:#f5f3eb;color:#163d34;padding:9px 12px;font:600 .87rem system-ui;cursor:pointer}.elena-voice-controls button:focus-visible{outline:3px solid #b39256;outline-offset:2px}.elena-voice-controls button[hidden]{display:none}.elena-voice-note{font-size:.76rem;color:#4f6057;margin:5px 0 12px}';document.head.appendChild(voiceStyle);
 document.body.append(root);
 const toggle=root.querySelector('.elena-presenza-toggle'),panel=root.querySelector('.elena-presenza-panel'),close=root.querySelector('.elena-presenza-close'),msg=root.querySelector('.elena-presenza-message'),form=root.querySelector('form'),input=root.querySelector('input'),result=root.querySelector('.elena-presenza-result'),send=form.querySelector('button');
 const paolaSampleButton=root.querySelector('.elena-paola-sample');
 const paolaSampleAudio=new Audio('/adc/audio/elena-ufficiale-20261123.wav');
 paolaSampleAudio.preload='none';
 paolaSampleButton.addEventListener('click',()=>{
   if(!paolaSampleAudio.paused){paolaSampleAudio.pause();paolaSampleAudio.currentTime=0;paolaSampleButton.textContent='Ascolta un campione della voce';return;}
   if('speechSynthesis' in window)window.speechSynthesis.cancel();
   paolaSampleAudio.currentTime=0;
   paolaSampleAudio.play().then(()=>{paolaSampleButton.textContent='Ferma il campione';}).catch(()=>{voiceNote.textContent='Il messaggio vocale non è disponibile in questo momento.';});
 });
 paolaSampleAudio.addEventListener('ended',()=>{paolaSampleButton.textContent='Ascolta un campione della voce';});
 window.addEventListener('pagehide',()=>paolaSampleAudio.pause());
 const readButton=root.querySelector('.elena-voice-read'),pageButton=root.querySelector('.elena-voice-page'),stopButton=root.querySelector('.elena-voice-stop'),voiceNote=root.querySelector('.elena-voice-note');
 let spokenAnswer='',spokenKind='',spokenId='';
 const paolaAnswerAudio=new Audio();paolaAnswerAudio.preload='none';
 const paolaPageAudio=new Audio();paolaPageAudio.preload='none';paolaPageAudio.addEventListener('ended',()=>{stopButton.hidden=true;});
 paolaAnswerAudio.addEventListener('ended',()=>{stopButton.hidden=true;});
 const synthesis=('speechSynthesis' in window)&&('SpeechSynthesisUtterance' in window)?window.speechSynthesis:null;
 function stopSpeech(){if(synthesis)synthesis.cancel();paolaAnswerAudio.pause();paolaAnswerAudio.currentTime=0;paolaPageAudio.pause();paolaPageAudio.currentTime=0;paolaSampleAudio.pause();paolaSampleButton.textContent='Ascolta un campione della voce';stopButton.hidden=true;}
 function speakText(text){
   stopSpeech();voiceNote.textContent='Puoi ascoltare il campione della voce di Elena. La lettura di questo testo non è ancora disponibile.';return;
   if(!synthesis){voiceNote.textContent='La lettura vocale non è disponibile in questo browser.';return;}
   stopSpeech();
   if(!text.trim())return;
   const utterance=new SpeechSynthesisUtterance(text.slice(0,14000));
   utterance.lang='it-IT';utterance.rate=.94;utterance.pitch=1;
   const italian=synthesis.getVoices().filter(v=>/^it(?:-|_)/i.test(v.lang));
   const paola=italian.find(v=>/paola/i.test(v.name));
   if(!paola){voiceNote.textContent='La voce di Elena non è disponibile per questa lettura sul dispositivo. Non verrà utilizzata un’altra voce.';return;}
   utterance.voice=paola;
   voiceNote.textContent='Lettura con la voce di Elena disponibile sul dispositivo.';
   utterance.onend=()=>{stopButton.hidden=true;};
   utterance.onerror=()=>{stopButton.hidden=true;voiceNote.textContent='Lettura interrotta. Verifica le impostazioni vocali del dispositivo.';};
   stopButton.hidden=false;
   synthesis.speak(utterance);
 }
 readButton.addEventListener('click',()=>{
   stopSpeech();voiceNote.textContent='Puoi ascoltare il campione della voce di Elena. La lettura di questo testo non è ancora disponibile.';return;
   if(spokenKind==='index'||spokenKind==='empty'){
     stopSpeech();
     paolaAnswerAudio.src='/adc/audio/elena-paola-risposta-'+(spokenKind==='index'?'indice':'vuota')+'.mp3';
     paolaAnswerAudio.play().then(()=>{voiceNote.textContent='Elena sta leggendo la risposta.';stopButton.hidden=false;}).catch(()=>{voiceNote.textContent='Registrazione vocale non disponibile. Riprova più tardi.';});
   }else if(spokenKind==='civic'){
     speakText(spokenAnswer);
   }else if(spokenKind==='documentary' && /^[A-Za-z0-9_-]{1,80}$/.test(spokenId)){
     stopSpeech();
     paolaAnswerAudio.src='/adc/audio/elena-paola-documentaria-'+spokenId+'.mp3';
     paolaAnswerAudio.play().then(()=>{voiceNote.textContent='Elena sta leggendo la risposta documentaria.';stopButton.hidden=false;}).catch(()=>{voiceNote.textContent='Registrazione vocale non ancora disponibile per questa risposta.';});
   }else{voiceNote.textContent='Nessuna registrazione vocale disponibile per questa risposta.';}
 });
 pageButton.addEventListener('click',()=>{
   stopSpeech();voiceNote.textContent='Puoi ascoltare il campione della voce di Elena. La lettura di questo testo non è ancora disponibile.';return;
   const path=window.location.pathname.replace(/index\.html$/,'').replace(/\/$/,'');
   const recordings={'/adc/storia-per-tutti':'/adc/audio/elena-paola-storia-per-tutti.mp3','/adc/elena':'/adc/audio/elena-paola-pagina-elena.mp3'};
   if(!recordings[path]){
     const main=document.querySelector('main')||document.querySelector('article');
     if(!main){voiceNote.textContent='Non è stato individuato il testo principale della pagina.';return;}
     const copy=main.cloneNode(true);
     copy.querySelectorAll('nav,aside,footer,script,style,button,form,iframe,svg,[aria-hidden="true"],[hidden],.elena-presenza').forEach(node=>node.remove());
     const text=(copy.innerText||copy.textContent||'').replace(/\s+/g,' ').trim();
     if(!text){voiceNote.textContent='Questa pagina non contiene testo leggibile.';return;}
     speakText(text.slice(0,3500));
     voiceNote.textContent='Lettura del testo principale della pagina (prima parte, fino a 3.500 caratteri), con la voce disponibile sul dispositivo.';
     return;
   }
   stopSpeech();
   paolaPageAudio.src=recordings[path];
   paolaPageAudio.play().then(()=>{voiceNote.textContent='Elena sta leggendo la pagina.';stopButton.hidden=false;}).catch(()=>{voiceNote.textContent='La registrazione della pagina non è ancora disponibile.';});
 });
 stopButton.addEventListener('click',stopSpeech);
 window.addEventListener('pagehide',stopSpeech);

 // Messaggio uguale per tutti i visitatori e per tutte le sezioni ADC.
 msg.textContent='Posso aiutarti a trovare documenti, luoghi e testimonianze nelle fonti dell’Archivio.';
 const make=(tag,text,cls)=>{const el=document.createElement(tag);el.textContent=text||'';if(cls)el.className=cls;return el;};
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
     const script=document.createElement('script');script.src='/adc/assets/elena-dialogo.js';script.async=true;
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
     fetch('/adc/assets/elena-amministrazione.json',{cache:'no-store'}).catch(()=>({ok:false}))
   ]).then(async responses=>{
     if(!responses[0].ok||!responses[1].ok)throw Error('Indice delle risposte non disponibile');
     return Promise.all(responses.map(r=>r.ok?r.json().catch(()=>null):null));
   }).then(([index,approved,knowledge,municipality,news,checks,admin])=>{
     if(!Array.isArray(index?.entries)||!Array.isArray(approved?.answers))throw Error('Formato delle risorse documentarie non valido');
     return {index,approved:approved.answers,knowledge:knowledge?.schema===1&&Array.isArray(knowledge.entries)?knowledge:{entries:[]},municipality:municipality?.schema===1?municipality:null,news:news?.schema===1?news:null,checks:checks?.schema===1?checks:null,admin:admin?.schema===1?admin:null};
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
   busy=true;send.disabled=true;result.replaceChildren(make('p','Consulto le schede pubbliche dell’Archivio…'));
   try{
     const [engine,data]=await Promise.all([loadEngine(),loadResources()]);
     const effective=engine.contextualQuery?engine.contextualQuery(q,previousQuestion):q;
     const reply=engine.reply(effective,data.index,data.approved,data.knowledge,data.municipality,data.news,data.checks,data.admin);
     previousQuestion=effective;
     spokenKind=reply.kind;spokenId=reply.id||'';spokenAnswer=[reply.title,reply.text,reply.limitation?'Limite della documentazione: '+reply.limitation:''].filter(Boolean).join('. ');readButton.hidden=!(reply.kind==='index'||reply.kind==='empty'||reply.kind==='documentary'||reply.kind==='civic');result.replaceChildren(make('p',reply.title),make('p',reply.text));
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
       try{sessionStorage.setItem('adc-elena-handoff',JSON.stringify({q:q.slice(0,160),at:Date.now()}));}
       catch(_){}
       window.location.assign('/adc/elena/');
     });
     result.append(more);
     input.value='';
   }catch(_){readButton.hidden=true;spokenAnswer='';spokenKind='';result.replaceChildren(make('p','La consultazione non è disponibile in questo momento. Puoi aprire la pagina completa di Elena.'));}
   finally{busy=false;send.disabled=false;}
 });
})();

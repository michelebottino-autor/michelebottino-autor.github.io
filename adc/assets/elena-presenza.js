/* © 2026 Michele Bottino — Elena: assistenza contestuale documentaria. Nessuna domanda viene inserita negli URL o salvata. */
(function(){
 'use strict';
 if(document.querySelector('[data-elena-assistente]'))return;
 const root=document.createElement('aside');root.dataset.elenaAssistente='';root.className='elena-presenza';
 root.innerHTML=`<button class="elena-presenza-toggle" type="button" aria-expanded="false" aria-controls="elena-presenza-panel">Elena · Posso aiutarti?</button><section id="elena-presenza-panel" class="elena-presenza-panel" hidden aria-label="Assistenza di Elena"><div class="elena-presenza-heading"><strong>Elena, archivista di Calatabiano</strong><button type="button" class="elena-presenza-close" aria-label="Chiudi Elena">×</button></div><p class="elena-presenza-message"></p><form class="elena-presenza-form"><label for="elena-presenza-query">Che cosa stai cercando?</label><input id="elena-presenza-query" type="search" maxlength="160" autocomplete="off" placeholder="Un luogo, una data, un documento" required><button type="submit">Chiedi a Elena</button></form><div class="elena-presenza-result" aria-live="polite"></div><div class="elena-voice-controls"><button type="button" class="elena-paola-sample">Ascolta Elena</button><button type="button" class="elena-voice-read" hidden>Leggi la risposta</button><button type="button" class="elena-voice-page">Leggi la pagina</button><button type="button" class="elena-voice-stop" hidden>Interrompi lettura</button></div><p class="elena-voice-note">Elena legge le risposte disponibili su richiesta. La lettura delle altre pagine sarà attivata progressivamente.</p><a href="/adc/elena/">Apri la pagina completa di Elena</a><p class="elena-presenza-privacy">Le risposte provengono dalle schede pubbliche dell'ADC. La domanda è elaborata nel browser e non viene inserita nell'indirizzo della pagina.</p></section>`;
 const voiceStyle=document.createElement('style');voiceStyle.textContent='.elena-voice-controls{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 6px}.elena-voice-controls button{border:1px solid #8b997e;border-radius:7px;background:#f5f3eb;color:#163d34;padding:9px 12px;font:600 .87rem system-ui;cursor:pointer}.elena-voice-controls button:focus-visible{outline:3px solid #b39256;outline-offset:2px}.elena-voice-controls button[hidden]{display:none}.elena-voice-note{font-size:.76rem;color:#4f6057;margin:5px 0 12px}';document.head.appendChild(voiceStyle);
 document.body.append(root);
 const toggle=root.querySelector('.elena-presenza-toggle'),panel=root.querySelector('.elena-presenza-panel'),close=root.querySelector('.elena-presenza-close'),msg=root.querySelector('.elena-presenza-message'),form=root.querySelector('form'),input=root.querySelector('input'),result=root.querySelector('.elena-presenza-result'),send=form.querySelector('button');
 const paolaSampleButton=root.querySelector('.elena-paola-sample');
 const paolaSampleAudio=new Audio('/adc/audio/elena-paola-benvenuto.mp3');
 paolaSampleAudio.preload='none';
 paolaSampleButton.addEventListener('click',()=>{
   if(!paolaSampleAudio.paused){paolaSampleAudio.pause();paolaSampleAudio.currentTime=0;paolaSampleButton.textContent='Ascolta Elena';return;}
   if('speechSynthesis' in window)window.speechSynthesis.cancel();
   paolaSampleAudio.currentTime=0;
   paolaSampleAudio.play().then(()=>{paolaSampleButton.textContent='Ferma Elena';}).catch(()=>{voiceNote.textContent='Il messaggio vocale non è disponibile in questo momento.';});
 });
 paolaSampleAudio.addEventListener('ended',()=>{paolaSampleButton.textContent='Ascolta Elena';});
 window.addEventListener('pagehide',()=>paolaSampleAudio.pause());
 const readButton=root.querySelector('.elena-voice-read'),pageButton=root.querySelector('.elena-voice-page'),stopButton=root.querySelector('.elena-voice-stop'),voiceNote=root.querySelector('.elena-voice-note');
 let spokenAnswer='',spokenKind='';
 const paolaAnswerAudio=new Audio();paolaAnswerAudio.preload='none';
 const paolaPageAudio=new Audio('/adc/audio/elena-paola-storia-per-tutti.mp3');paolaPageAudio.preload='none';paolaPageAudio.addEventListener('ended',()=>{stopButton.hidden=true;});
 paolaAnswerAudio.addEventListener('ended',()=>{stopButton.hidden=true;});
 const synthesis=('speechSynthesis' in window)&&('SpeechSynthesisUtterance' in window)?window.speechSynthesis:null;
 function stopSpeech(){if(synthesis)synthesis.cancel();paolaAnswerAudio.pause();paolaAnswerAudio.currentTime=0;paolaPageAudio.pause();paolaPageAudio.currentTime=0;paolaSampleAudio.pause();paolaSampleButton.textContent='Ascolta Elena';stopButton.hidden=true;}
 function speakText(text){
   if(!synthesis){voiceNote.textContent='La lettura vocale non è disponibile in questo browser.';return;}
   stopSpeech();
   if(!text.trim())return;
   const utterance=new SpeechSynthesisUtterance(text.slice(0,14000));
   utterance.lang='it-IT';utterance.rate=.94;utterance.pitch=1;
   const italian=synthesis.getVoices().filter(v=>/^it(?:-|_)/i.test(v.lang));
   const paola=italian.find(v=>/paola/i.test(v.name));
   const female=italian.find(v=>/(elsa|isabella|alice|federica|silvia|bianca|sara)/i.test(v.name));
   const chosen=paola||female;
   if(!chosen){
     voiceNote.textContent='La lettura vocale non è disponibile su questo dispositivo.';
     return;
   }
   utterance.voice=chosen;
   voiceNote.textContent=paola?'Voce disponibile su questo dispositivo.':'Lettura disponibile con la voce del dispositivo.';
   utterance.onend=()=>{stopButton.hidden=true;};
   utterance.onerror=()=>{stopButton.hidden=true;voiceNote.textContent='Lettura interrotta. Verifica le impostazioni vocali del dispositivo.';};
   stopButton.hidden=false;
   synthesis.speak(utterance);
 }
 readButton.addEventListener('click',()=>{
   if(spokenKind==='index'||spokenKind==='empty'){
     stopSpeech();
     paolaAnswerAudio.src='/adc/audio/elena-paola-risposta-'+(spokenKind==='index'?'indice':'vuota')+'.mp3';
     paolaAnswerAudio.play().then(()=>{voiceNote.textContent='Elena sta leggendo la risposta.';stopButton.hidden=false;}).catch(()=>{voiceNote.textContent='Registrazione vocale non disponibile. Riprova più tardi.';});
   }else{voiceNote.textContent='Questa risposta non dispone ancora di una lettura vocale.';}
 });
 pageButton.addEventListener('click',()=>{
   const path=window.location.pathname.replace(/index\.html$/,'').replace(/\/$/,'');
   if(path!=='/adc/storia-per-tutti'){voiceNote.textContent='La lettura di questa pagina non è ancora disponibile.';return;}
   stopSpeech();
   paolaPageAudio.play().then(()=>{voiceNote.textContent='Elena sta leggendo la pagina.';stopButton.hidden=false;}).catch(()=>{voiceNote.textContent='La registrazione della pagina non è ancora disponibile.';});
 });
 stopButton.addEventListener('click',stopSpeech);
 window.addEventListener('pagehide',stopSpeech);

 // Messaggio uguale per tutti i visitatori e per tutte le sezioni ADC.
 msg.textContent='Posso aiutarti a orientarti nelle fonti pubbliche dell’Archivio Documentale Calatabiano.';
 const make=(tag,text,cls)=>{const el=document.createElement(tag);el.textContent=text||'';if(cls)el.className=cls;return el;};
 let loader=null,resources=null,busy=false;
 function loadEngine(){
   if(window.ElenaADCDialogo)return Promise.resolve(window.ElenaADCDialogo);
   if(!loader)loader=new Promise((resolve,reject)=>{
     const script=document.createElement('script');script.src='/adc/assets/elena-dialogo.js';script.async=true;
     script.onload=()=>window.ElenaADCDialogo?resolve(window.ElenaADCDialogo):reject(Error('Motore documentario non disponibile'));
     script.onerror=()=>reject(Error('Impossibile caricare il motore documentario'));
     document.head.append(script);
   }).catch(err=>{loader=null;throw err});
   return loader;
 }
 function loadResources(){
   if(!resources)resources=Promise.all([
     fetch('/adc/assets/elena-indice.json',{cache:'no-store'}),
     fetch('/adc/assets/elena-risposte-approvate.json',{cache:'no-store'})
   ]).then(async responses=>{
     if(responses.some(r=>!r.ok))throw Error('Indice delle risposte non disponibile');
     return Promise.all(responses.map(r=>r.json()));
   }).then(([index,approved])=>{
     if(!Array.isArray(index?.entries)||!Array.isArray(approved?.answers))throw Error('Formato delle risorse documentarie non valido');
     return {index,approved:approved.answers};
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
     const reply=engine.reply(q,data.index,data.approved);
     spokenKind=reply.kind;spokenAnswer=[reply.title,reply.text,reply.limitation?'Limite della documentazione: '+reply.limitation:''].filter(Boolean).join('. ');readButton.hidden=!(reply.kind==='index'||reply.kind==='empty');result.replaceChildren(make('p',reply.title),make('p',reply.text));
     if(reply.limitation)result.append(make('p','Limite della documentazione: '+reply.limitation,'elena-presenza-evidence'));
     for(const source of (reply.links||[]).slice(0,5)){
       if(!/^\/adc\/(?!\/)[a-z0-9/_\-.]*$/i.test(source.url))continue;
       const p=make('p'),link=make('a',source.title);link.href=source.url;p.append(link);result.append(p);
     }
     input.value='';
   }catch(_){readButton.hidden=true;spokenAnswer='';spokenKind='';result.replaceChildren(make('p','La consultazione non è disponibile in questo momento. Puoi aprire la pagina completa di Elena.'));}
   finally{busy=false;send.disabled=false;}
 });
})();

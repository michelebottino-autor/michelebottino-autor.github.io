/* Elena: assistenza contestuale documentaria. Nessuna domanda viene inserita negli URL o salvata. */
(function(){
 'use strict';
 if(document.querySelector('[data-elena-assistente]'))return;
 const root=document.createElement('aside');root.dataset.elenaAssistente='';root.className='elena-presenza';
 root.innerHTML=`<button class="elena-presenza-toggle" type="button" aria-expanded="false" aria-controls="elena-presenza-panel">Elena · Posso aiutarti?</button><section id="elena-presenza-panel" class="elena-presenza-panel" hidden aria-label="Assistenza di Elena"><div class="elena-presenza-heading"><strong>Elena, archivista di Calatabiano</strong><button type="button" class="elena-presenza-close" aria-label="Chiudi Elena">×</button></div><p class="elena-presenza-message"></p><form class="elena-presenza-form"><label for="elena-presenza-query">Che cosa stai cercando?</label><input id="elena-presenza-query" type="search" maxlength="160" autocomplete="off" placeholder="Un luogo, una data, un documento" required><button type="submit">Chiedi a Elena</button></form><div class="elena-presenza-result" aria-live="polite"></div><a href="/adc/elena/">Apri la pagina completa di Elena</a><p class="elena-presenza-privacy">Le risposte provengono dalle schede pubbliche dell'ADC. La domanda è elaborata nel browser e non viene inserita nell'indirizzo della pagina.</p></section>`;
 document.body.append(root);
 const toggle=root.querySelector('.elena-presenza-toggle'),panel=root.querySelector('.elena-presenza-panel'),close=root.querySelector('.elena-presenza-close'),msg=root.querySelector('.elena-presenza-message'),form=root.querySelector('form'),input=root.querySelector('input'),result=root.querySelector('.elena-presenza-result'),send=form.querySelector('button');
 const sections=[['fonti','Qui puoi cercare testimonianze e riferimenti bibliografici.'],['acque','Qui trovi materiali su acqua, mulini e confini.'],['atlante','Puoi cercare luoghi, mappe e documenti.'],['storia','Ti aiuto a distinguere attestazioni storiche e ipotesi.'],['mediateca','Qui trovi testimonianze audiovisive.']];
 const name=(location.pathname.split('/').filter(Boolean).pop()||'').replace('.html','');
 msg.textContent=(sections.find(x=>x[0]===name)||[])[1]||'Posso aiutarti a orientarti nell’Archivio.';
 const make=(tag,text,cls)=>{const el=document.createElement(tag);el.textContent=text||'';if(cls)el.className=cls;return el;};
 let loader=null,resources=null,busy=false,lastTopic=null;
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
     fetch('/adc/assets/elena-risposte.json',{cache:'no-store'}),
     fetch('/adc/assets/elena-indice.json',{cache:'no-store'})
   ]).then(async responses=>{
     if(responses.some(r=>!r.ok))throw Error('Indice delle risposte non disponibile');
     return Promise.all(responses.map(r=>r.json()));
   }).catch(err=>{resources=null;throw err});
   return resources;
 }
 function setOpen(open){if(open)root.classList.remove('elena-presenza-reading');panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)input.focus();else toggle.focus();}
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
     const reply=engine.reply(q,data[0],data[1],lastTopic);
     if(reply.topic)lastTopic=reply.topic;
     result.replaceChildren(make('p',reply.text));
     if(reply.limitation)result.append(make('p','Limite della documentazione: '+reply.limitation,'elena-presenza-evidence'));
     for(const source of (reply.links||[]).slice(0,3)){
       if(!/^\/adc\/(?!\/)[a-z0-9/_\-.]*$/i.test(source.url))continue;
       const p=make('p'),link=make('a',source.title);link.href=source.url;p.append(link);result.append(p);
     }
     input.value='';
   }catch(_){result.replaceChildren(make('p','La consultazione non è disponibile in questo momento. Puoi aprire la pagina completa di Elena.'));}
   finally{busy=false;send.disabled=false;}
 });
})();

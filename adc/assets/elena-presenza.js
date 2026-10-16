/* Elena contestuale: risposta locale senza inviare domande nel parametro URL. */
(function(){
 'use strict';
 if(document.querySelector('[data-elena-assistente]'))return;
 const root=document.createElement('aside');root.dataset.elenaAssistente='';root.className='elena-presenza';
 root.innerHTML='<button class="elena-presenza-toggle" type="button" aria-expanded="false" aria-controls="elena-presenza-panel">Elena · Posso aiutarti?</button><section id="elena-presenza-panel" class="elena-presenza-panel" hidden aria-label="Assistenza di Elena"><div class="elena-presenza-heading"><strong>Elena, archivista di Calatabiano</strong><button type="button" class="elena-presenza-close" aria-label="Chiudi Elena">×</button></div><p class="elena-presenza-message"></p><form class="elena-presenza-form"><label for="elena-presenza-query">Che cosa stai cercando?</label><input id="elena-presenza-query" type="search" maxlength="160" autocomplete="off" placeholder="Un luogo, una data, un documento" required><button type="submit">Chiedi a Elena</button></form><div class="elena-presenza-result" aria-live="polite"></div><a href="/adc/elena/">Esplora con Elena</a><p class="elena-presenza-privacy">La domanda è elaborata nel browser usando l’indice pubblico dell’ADC. Non viene aggiunta all’indirizzo della pagina.</p></section>';
 document.body.append(root);
 const toggle=root.querySelector('.elena-presenza-toggle'),panel=root.querySelector('.elena-presenza-panel'),close=root.querySelector('.elena-presenza-close'),msg=root.querySelector('.elena-presenza-message'),form=root.querySelector('form'),input=root.querySelector('input'),result=root.querySelector('.elena-presenza-result'),send=form.querySelector('button');
 const sections=[['fonti','Qui puoi cercare testimonianze e riferimenti bibliografici.'],['acque','Qui trovi materiali su acqua, mulini e confini.'],['atlante','Puoi cercare luoghi, mappe e documenti.'],['storia','Ti aiuto a distinguere attestazioni storiche e ipotesi.'],['mediateca','Qui trovi testimonianze audiovisive.']];
 const name=(location.pathname.split('/').filter(Boolean).pop()||'').replace('.html','');msg.textContent=(sections.find(x=>x[0]===name)||[])[1]||'Posso aiutarti a orientarti nell’Archivio.';
 const context={lastTopic:null},make=(tag,text)=>{const el=document.createElement(tag);el.textContent=text;return el};
 let loader=null,busy=false;
 function loadEngine(){
  if(window.ElenaADC)return Promise.resolve(window.ElenaADC);
  if(!loader)loader=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src='/adc/assets/elena-motore.js';script.async=true;
    script.onload=()=>window.ElenaADC?resolve(window.ElenaADC):reject(Error('Motore non disponibile'));
    script.onerror=()=>reject(Error('Motore non raggiungibile'));
    document.head.append(script);
  }).catch(e=>{loader=null;throw e});
  return loader;
 }
 function setOpen(open){panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)input.focus();else toggle.focus();}
 toggle.addEventListener('click',()=>setOpen(panel.hidden));close.addEventListener('click',()=>setOpen(false));document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&!panel.hidden)setOpen(false)});
 form.addEventListener('submit',async ev=>{
   ev.preventDefault();const q=input.value.trim();if(!q||busy)return;
   busy=true;send.disabled=true;result.replaceChildren(make('p','Consulto l’indice pubblico dell’Archivio…'));
   try{
     const engine=await loadEngine(),reply=await engine.answer(q,context);result.replaceChildren(make('p',reply.message));
     if(reply.evidence){const note=make('p','Stato delle fonti: '+reply.evidence);note.className='elena-presenza-evidence';result.append(note);}
     const sources=(reply.sources||[]).filter(x=>x?.url?.startsWith('/adc/')).slice(0,2);
     for(const src of sources){const p=make('p',''),a=make('a',src.title);a.href=src.url;p.append(a);result.append(p);}
     input.value='';
   }catch(_){result.replaceChildren(make('p','La consultazione non è disponibile. Puoi usare il collegamento «Esplora con Elena».'));}
   finally{busy=false;send.disabled=false;}
 });
})();
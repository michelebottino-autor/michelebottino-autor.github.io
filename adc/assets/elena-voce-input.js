/* Elena ADC: input vocale su richiesta. Mai acquisizione automatica del microfono. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.ElenaVoiceInput=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function createController({Recognition,form,input,button,status,autoRead,results,MutationObserverCtor}){
   if(!form||!input||!button||!status)return null;
   if(!Recognition){button.disabled=true;status.textContent='La dettatura non è supportata da questo browser.';return null}
   let recognition=null,active=false,submitting=false,armed=false,micStream=null;
   const releaseMic=()=>{if(micStream){micStream.getTracks().forEach(track=>track.stop());micStream=null;}};
   const setActive=val=>{active=val;button.setAttribute('aria-pressed',String(val));button.textContent=val?'Ferma microfono':'Parla con Elena'};
   const observer=MutationObserverCtor?new MutationObserverCtor((mutations)=>{
     if(!armed||!autoRead?.checked)return;
     for(const mutation of mutations){
       for(const node of mutation.addedNodes||[]){
         const answer=node?.classList?.contains('elena-dialogue-answer')?node:node?.querySelector?.('.elena-dialogue-answer');
         const read=answer?.querySelector?.('.elena-dialogue-read');
         if(read){armed=false;read.click();return}
       }
     }
   }):null;
   if(observer&&results)observer.observe(results,{childList:true,subtree:true});
   function stop(){if(recognition&&active)recognition.stop();releaseMic();setActive(false)}
   async function toggle(){
     if(active){stop();return}
     try{
       recognition=new Recognition();
       recognition.lang='it-IT';recognition.continuous=false;recognition.interimResults=false;recognition.maxAlternatives=1;
       recognition.onresult=event=>{
         const transcript=event?.results?.[0]?.[0]?.transcript?.trim();
         if(!transcript)return;
         const question=transcript.slice(0,160);input.value=question;status.textContent='Domanda riconosciuta: '+question;
         // La trascrizione è visibile; l'invio avviene solo dopo l'avvio volontario della dettatura.
         if(!submitting){submitting=true;armed=!!autoRead?.checked;form.requestSubmit();}
       };
       recognition.onerror=event=>{armed=false;releaseMic();status.textContent=event?.error==='not-allowed'?'Microfono non autorizzato. Controlla i permessi del browser.':'La dettatura non è riuscita. Puoi scrivere la domanda.';setActive(false)};
       recognition.onend=()=>{submitting=false;releaseMic();setActive(false)};
       // The audio track can be passed directly only where SpeechRecognition.start(track) is supported.
       // Browser-based recognition may still rely on its own service, not Elena's private PC.
       let mode='standard del browser';
       // Android Chrome does not currently accept the experimental audioTrack parameter.
       // Do not acquire a separate microphone stream that cannot feed recognition.
       const android=/Android/i.test(root.navigator?.userAgent||'');
       if(android){
         recognition.start();
         mode='del browser su Android (riduzione del rumore non verificabile)';
       }else if(root.navigator?.mediaDevices?.getUserMedia){
         try{
           const supported=root.navigator.mediaDevices.getSupportedConstraints?.()||{};
           const constraints={};
           if(supported.noiseSuppression)constraints.noiseSuppression=true;
           if(supported.echoCancellation)constraints.echoCancellation=true;
           if(supported.autoGainControl)constraints.autoGainControl=true;
           micStream=await root.navigator.mediaDevices.getUserMedia({audio:constraints,video:false});
           const track=micStream.getAudioTracks()[0];
           const settings=track?.getSettings?.()||{};
           // Passing a track is only valid for browsers implementing this API extension.
           // Unsupported browsers use their own capture pipeline; do not claim filtered recognition.
           if(track){
             recognition.start(track);
             mode=settings.noiseSuppression===true?'con soppressione richiesta al microfono':'con traccia audio del dispositivo';
           }else{
             releaseMic();
             recognition.start();
             mode='standard del browser (filtro non verificato)';
           }
         }catch(error){
           releaseMic();
           if(error?.name==='NotAllowedError'||error?.name==='SecurityError')throw error;
           recognition.start();
           mode='standard del browser (filtro non disponibile)';
         }
       }else recognition.start();
       setActive(true);
       status.textContent='Ti ascolto: '+mode+'. Pronuncia una domanda su Calatabiano.';
     }catch(error){
       releaseMic();setActive(false);
       status.textContent=error?.name==='NotAllowedError'?'Autorizza il microfono nelle impostazioni del browser.':'Impossibile avviare il microfono.';
     }
   }
   button.addEventListener('click',toggle);
   return {toggle,stop,isActive:()=>active,dispose:()=>{stop();observer?.disconnect()}};
 }
 function mount(document,root){
   const form=document.getElementById('elena-form'),input=document.getElementById('elena-query'),results=document.getElementById('elena-results');
   if(!form||!input||!results)return;
   const container=document.createElement('div');container.className='elena-microphone-controls';
   const button=document.createElement('button');button.type='button';button.textContent='Parla con Elena';button.className='elena-microphone-start';button.setAttribute('aria-pressed','false');
   const label=document.createElement('label');label.className='elena-microphone-autoread';
   const checkbox=document.createElement('input');checkbox.type='checkbox';label.append(checkbox,document.createTextNode(' Leggi automaticamente la risposta'));
   const status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.textContent='La dettatura richiede il permesso del microfono. La riduzione del rumore viene richiesta solo dove supportata; il riconoscimento può usare servizi del browser.';
   container.append(button,label,status);form.insertAdjacentElement('afterend',container);
   return createController({Recognition:root.SpeechRecognition||root.webkitSpeechRecognition,form,input,button,status,autoRead:checkbox,results,MutationObserverCtor:root.MutationObserver});
 }
 return {createController,mount};
});
if(typeof document!=='undefined')globalThis.ElenaVoiceInput.mount(document,globalThis);

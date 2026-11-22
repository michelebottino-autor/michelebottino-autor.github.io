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
   let recognition=null,active=false,submitting=false,armed=false;
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
   function stop(){if(recognition&&active)recognition.stop();setActive(false)}
   function toggle(){
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
       recognition.onerror=event=>{armed=false;status.textContent=event?.error==='not-allowed'?'Microfono non autorizzato. Controlla i permessi del browser.':'La dettatura non è riuscita. Puoi scrivere la domanda.';setActive(false)};
       recognition.onend=()=>{submitting=false;setActive(false)};
       recognition.start();setActive(true);status.textContent='Ti ascolto. Pronuncia una domanda su Calatabiano.';
     }catch{setActive(false);status.textContent='Impossibile avviare il microfono.'}
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
   const status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.textContent='La dettatura richiede il permesso del microfono. Il riconoscimento può utilizzare i servizi del browser.';
   container.append(button,label,status);form.insertAdjacentElement('afterend',container);
   return createController({Recognition:root.SpeechRecognition||root.webkitSpeechRecognition,form,input,button,status,autoRead:checkbox,results,MutationObserverCtor:root.MutationObserver});
 }
 return {createController,mount};
});
if(typeof document!=='undefined')globalThis.ElenaVoiceInput.mount(document,globalThis);

/* Installazione ADC solo su richiesta esplicita. */
(()=>{'use strict';
 const button=document.getElementById('adc-install-button');
 const status=document.getElementById('adc-install-status');
 const installed=document.getElementById('already-installed');
 if(!button||!status||!installed)return;
 const standalone=matchMedia('(display-mode:standalone)').matches||navigator.standalone===true;
 if(standalone)installed.hidden=false;
 let pending=null;
 window.addEventListener('beforeinstallprompt',e=>{
  if(standalone)return;
  e.preventDefault();pending=e;button.hidden=false;
 });
 window.addEventListener('appinstalled',()=>{
  pending=null;button.hidden=true;installed.hidden=false;
  status.textContent="Archivio ADC installato.";
 });
 button.addEventListener('click',async()=>{
  if(!pending)return;
  const event=pending;pending=null;button.hidden=true;
  try{await event.prompt();const result=await event.userChoice;
   if(result?.outcome==='dismissed')status.textContent="Installazione annullata; puoi usare il menu del browser.";
  }catch(_){status.textContent="Usa il menu del browser per installare Archivio ADC."}
 });
})();
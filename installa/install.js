/* Installazione volontaria, browser-aware, senza forzare banner. */
(()=>{'use strict';
const button=document.getElementById('pwa-install-button'),status=document.getElementById('install-result'),installed=document.getElementById('already-installed');
if(!button||!status||!installed)return;
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
if(standalone){installed.hidden=false;status.textContent='L’app è già installata: usa i collegamenti del sito.';return;}
const ua=navigator.userAgent||'';
const isIOS=/iPhone|iPad|iPod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const isAndroid=/Android/i.test(ua);
const insideApp=/FBAN|FBAV|Instagram|Line\/|wv\)/i.test(ua);
if(insideApp)status.textContent='Apri questo link nel browser del telefono per trovare il comando di installazione.';
else if(isIOS)status.textContent='Su iPhone o iPad usa Safari: Condividi → Aggiungi alla schermata Home.';
else if(isAndroid)status.textContent='Da Chrome o Samsung Internet usa il pulsante sottostante, se disponibile, oppure il menu del browser.';
let installEvent=null;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installEvent=event;button.hidden=false;});
window.addEventListener('appinstalled',()=>{installEvent=null;button.hidden=true;installed.hidden=false;status.textContent='Installazione completata.';});
button.addEventListener('click',async()=>{
  if(!installEvent)return;
  const event=installEvent;installEvent=null;button.hidden=true;
  try{await event.prompt();const choice=await event.userChoice;if(choice?.outcome==='dismissed')status.textContent='Installazione annullata: puoi usare il menu del browser.';}
  catch(_){status.textContent='Usa il menu del browser per installare o aggiungere il sito alla schermata Home.';}
});
})();
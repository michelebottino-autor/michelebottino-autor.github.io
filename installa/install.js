/* Installazione volontaria, senza finestre automatiche */
(()=>{'use strict';
const button=document.getElementById('pwa-install-button'),status=document.getElementById('install-result'),installed=document.getElementById('already-installed');
if(!button||!status||!installed)return;
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
if(standalone)installed.hidden=false;
let installEvent=null;
window.addEventListener('beforeinstallprompt',event=>{if(standalone)return;event.preventDefault();installEvent=event;button.hidden=false});
window.addEventListener('appinstalled',()=>{installEvent=null;button.hidden=true;installed.hidden=false;status.textContent='Installazione completata.'});
button.addEventListener('click',async()=>{if(!installEvent)return;const event=installEvent;installEvent=null;button.hidden=true;
try{await event.prompt();const choice=await event.userChoice;if(choice?.outcome==='dismissed')status.textContent='Installazione annullata. Puoi usare il menu del browser.'}
catch(_){status.textContent='Usa il menu del browser per installare o aggiungere il sito alla schermata Home.'}
});
})();
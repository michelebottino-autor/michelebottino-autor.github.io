/* Installazione volontaria e selezione istruzioni per dispositivo. */
(()=>{'use strict';
const button=document.getElementById('pwa-install-button');
const status=document.getElementById('install-result');
const installed=document.getElementById('already-installed');
const tabs=[...document.querySelectorAll('[data-platform]')];
const panels={android:document.getElementById('panel-android'),ios:document.getElementById('panel-ios')};
if(!button||!status||!installed||tabs.length!==2)return;
const ua=navigator.userAgent||'';
const isIOS=/iPhone|iPad|iPod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const isAndroid=/Android/i.test(ua);
const insideApp=/FBAN|FBAV|Instagram|Line\\/|wv\\)/i.test(ua);
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
function selectPlatform(name){
  for(const tab of tabs){const active=tab.dataset.platform===name;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1}
  for(const [platform,panel] of Object.entries(panels))panel.hidden=platform!==name;
}
tabs.forEach((tab,index)=>{
 tab.addEventListener('click',()=>selectPlatform(tab.dataset.platform));
 tab.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
  selectPlatform(tabs[next].dataset.platform);tabs[next].focus();
 });
});
selectPlatform(isIOS?'ios':'android');
if(standalone){installed.hidden=false;status.textContent='Applicazione già installata.';return}
if(insideApp)status.textContent='Apri il collegamento in Chrome o Samsung Internet: il browser interno potrebbe impedire l’installazione.';
else if(isAndroid)status.textContent='Se non compare il pulsante, usa il menu del browser per installare.';
let installEvent=null;
window.addEventListener('beforeinstallprompt',event=>{
 event.preventDefault();installEvent=event;button.hidden=false;
});
window.addEventListener('appinstalled',()=>{
 installEvent=null;button.hidden=true;installed.hidden=false;status.textContent='Installazione completata.';
});
button.addEventListener('click',async()=>{
 if(!installEvent)return;
 const event=installEvent;installEvent=null;button.hidden=true;
 try{await event.prompt();const choice=await event.userChoice;if(choice?.outcome==='dismissed')status.textContent='Installazione annullata. Puoi riprovare dal menu del browser.'}
 catch(_){status.textContent='Apri il menu del browser e scegli Installa o Aggiungi alla schermata Home.'}
});
})();

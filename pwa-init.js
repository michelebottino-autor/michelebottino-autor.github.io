/* PWA condivisa: indipendente dal consenso per le statistiche. */
(function(){
  'use strict';
  const head=document.head;
  let manifest=head.querySelector('link[rel="manifest"]');
  if(!manifest){manifest=document.createElement('link');manifest.rel='manifest';head.appendChild(manifest)}
  manifest.href='/manifest.webmanifest';
  let apple=head.querySelector('link[rel="apple-touch-icon"]');
  if(!apple){apple=document.createElement('link');apple.rel='apple-touch-icon';head.appendChild(apple)}
  apple.href='/icons/mb-192.png';
  if(!head.querySelector('meta[name="theme-color"]')){const m=document.createElement('meta');m.name='theme-color';m.content='#25302e';head.appendChild(m)}
  if('serviceWorker' in navigator && location.protocol==='https:'){
    const register=()=>navigator.serviceWorker.register('/sw.js').catch(err=>console.warn('PWA service worker:',err));
    if(document.readyState==='complete')register();
    else window.addEventListener('load',register,{once:true});
  }
})();

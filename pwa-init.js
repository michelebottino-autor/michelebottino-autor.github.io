/* Inizializzazione PWA condivisa: nessun consenso richiesto per funzioni locali. */
(function(){
  'use strict';
  // Non collegare l'Archivio ADC alla PWA del sito personale.
  if(location.pathname.startsWith('/adc/')){
    if(!document.querySelector('script[data-adc-app-init]')){
      const app=document.createElement('script');
      app.src='/adc/app-init.js';app.defer=true;app.dataset.adcAppInit='true';
      document.head.appendChild(app);
    }
    return;
  }
  const head=document.head;
  const ensureLink=(rel,href)=>{
    let link=head.querySelector('link[rel="'+rel+'"]');
    if(!link){link=document.createElement('link');link.rel=rel;head.appendChild(link)}
    link.href=href;
  };
  ensureLink('manifest','/manifest.webmanifest');
  ensureLink('icon','/icons/mb-192.png');
  ensureLink('apple-touch-icon','/icons/mb-192.png');
  if(!head.querySelector('meta[name="apple-mobile-web-app-capable"]')){const m=document.createElement('meta');m.name='apple-mobile-web-app-capable';m.content='yes';head.appendChild(m)}
  if(!head.querySelector('meta[name="apple-mobile-web-app-title"]')){const m=document.createElement('meta');m.name='apple-mobile-web-app-title';m.content='Michele Bottino';head.appendChild(m)}
  if(!head.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')){const m=document.createElement('meta');m.name='apple-mobile-web-app-status-bar-style';m.content='default';head.appendChild(m)}
  const css='/mobile-platform.css';
  if(!head.querySelector('link[href="'+css+'"]')){
    const link=document.createElement('link');
    link.rel='stylesheet';link.href=css;head.appendChild(link);
  }
  if(!head.querySelector('meta[name="theme-color"]')){
    const meta=document.createElement('meta');meta.name='theme-color';meta.content='#25302e';head.appendChild(meta);
  }
  // Interfaccia dedicata esclusivamente all'app installata del sito personale.
  if((window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true)&&!location.pathname.startsWith('/adc/')){
    const shellCss=document.createElement('link');shellCss.rel='stylesheet';shellCss.href='/app-shell.css';head.appendChild(shellCss);
    const shellJs=document.createElement('script');shellJs.src='/app-shell.js';shellJs.defer=true;head.appendChild(shellJs);
  }
  const addInstallLink=()=>{
    if(location.pathname.startsWith('/installa/'))return;
    const footer=document.querySelector('body>footer');
    if(!footer||footer.querySelector('a[href="/installa/"]'))return;
    const item=document.createElement('p');item.className='pwa-install-link';
    const a=document.createElement('a');a.href='/installa/';a.textContent='Installa il sito sul tuo dispositivo';
    item.append(a);footer.append(item);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addInstallLink,{once:true});
  else addInstallLink();
  if('serviceWorker' in navigator&&location.protocol==='https:'){
    const register=()=>navigator.serviceWorker.register('/sw.js').catch(err=>console.warn('PWA service worker:',err));
    if(document.readyState==='complete')register();
    else window.addEventListener('load',register,{once:true});
  }
})();
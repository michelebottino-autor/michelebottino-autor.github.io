/* PWA dedicata esclusivamente ad Archivio Documentale Calatabiano. */
(function(){
 'use strict';
 if(!location.pathname.startsWith('/adc/')||window.__adcPwaInitialized)return;
 window.__adcPwaInitialized=true;
 const head=document.head;
 const replaceLink=(rel,href)=>{
  const links=[...head.querySelectorAll('link[rel="'+rel+'"]')];
  let link=links.shift();
  if(!link){link=document.createElement('link');link.rel=rel;head.appendChild(link);}
  link.href=href;for(const duplicate of links)duplicate.remove();
 };
 const responsiveCSS='/mobile-platform.css';
 if(!head.querySelector('link[href="'+responsiveCSS+'"]')){
  const css=document.createElement('link');css.rel='stylesheet';css.href=responsiveCSS;head.appendChild(css);
 }
 replaceLink('manifest','/adc/manifest.webmanifest');
 replaceLink('apple-touch-icon','/adc/icons/adc-192.png');
 replaceLink('icon','/adc/icons/adc-192.png');
 let theme=head.querySelector('meta[name="theme-color"]');
 if(!theme){theme=document.createElement('meta');theme.name='theme-color';head.appendChild(theme)}
 theme.content='#143731';
 // Barra rapida solo quando l'Archivio e' aperto come app installata.
 if(matchMedia('(display-mode: standalone)').matches||navigator.standalone===true){
  const shellCss=document.createElement('link');shellCss.rel='stylesheet';shellCss.href='/adc/app-shell.css';head.appendChild(shellCss);
  const shellJs=document.createElement('script');shellJs.src='/adc/app-shell.js';shellJs.defer=true;head.appendChild(shellJs);
  const readerCss=document.createElement('link');readerCss.rel='stylesheet';readerCss.href='/adc/reading-controls.css';head.appendChild(readerCss);
  const readerJs=document.createElement('script');readerJs.src='/adc/reading-controls.js';readerJs.defer=true;head.appendChild(readerJs);
 }
 // Nei percorsi ADC i collegamenti legacy all'installazione portano all'app Archivio.
 const updateLegacyInstall=()=>{
  document.querySelectorAll('a[href="/installa/"]').forEach(link=>{
    link.href='/adc/installa/';
    link.textContent='Installa Archivio ADC';
  });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',updateLegacyInstall,{once:true});
 else updateLegacyInstall();
 const footerInstall=()=>{
  if(location.pathname.startsWith('/adc/installa/'))return;
  const footer=document.querySelector('body>footer');
  if(!footer||footer.querySelector('a[href="/adc/installa/"]'))return;
  const row=document.createElement('p');row.className='adc-install-link';
  const link=document.createElement('a');link.href='/adc/installa/';link.textContent="Installa l'app Archivio ADC";
  row.append(link);footer.append(row);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',footerInstall,{once:true});else footerInstall();
 if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
  const register=()=>navigator.serviceWorker.register('/adc/sw.js',{scope:'/adc/'}).catch(err=>console.warn('ADC PWA:',err));
  register();
 }
})();

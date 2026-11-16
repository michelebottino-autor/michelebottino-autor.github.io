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
 replaceLink('manifest','/adc/manifest.webmanifest');
 replaceLink('apple-touch-icon','/adc/icons/adc-192.png');
 replaceLink('icon','/adc/icons/adc-192.png');
 let theme=head.querySelector('meta[name="theme-color"]');
 if(!theme){theme=document.createElement('meta');theme.name='theme-color';head.appendChild(theme)}
 theme.content='#143731';
 const footerInstall=()=>{
  if(location.pathname.startsWith('/adc/installa/'))return;
  const footer=document.querySelector('body>footer');
  if(!footer||footer.querySelector('a[href="/adc/installa/"]'))return;
  const row=document.createElement('p');row.className='adc-install-link';
  const link=document.createElement('a');link.href='/adc/installa/';link.textContent="Installa l'app Archivio ADC";
  row.append(link);footer.append(row);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',footerInstall,{once:true});else footerInstall();
 if('serviceWorker' in navigator&&location.protocol==='https:'){
  const register=()=>navigator.serviceWorker.register('/adc/sw.js',{scope:'/adc/'}).catch(err=>console.warn('ADC PWA:',err));
  if(document.readyState==='complete')register();else window.addEventListener('load',register,{once:true});
 }
})();

/* Controlli essenziali, solo nell'app installata dell'Archivio ADC. */
(function(){
 'use strict';
 if(window.__adcAppShell||!location.pathname.startsWith('/adc/'))return;
 window.__adcAppShell=true;
 const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 if(!standalone)return;
 const setup=()=>{
  if(document.getElementById('adc-app-toolbar')||!document.body)return;
  const current=location.pathname;
  const paths=[
   {label:'Archivio',url:'/adc/',icon:'<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-7h6v7"/>'},
   {label:'Fonti',url:'/adc/fonti/',icon:'<path d="M4 5.5C6 4.5 9 4 12 6v15c-3-2-6-1.5-8-1V5.5z"/><path d="M20 5.5c-2-1-5-1.5-8 .5v15c3-2 6-1.5 8-1V5.5z"/>'},
   {label:'Cerca',url:'/adc/cerca/',icon:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>'},
   {label:'Elena',url:'/adc/elena/',icon:'<rect x="5" y="4" width="14" height="16" rx="3"/><path d="M9 9h.01M15 9h.01M9 14c2 2 4 2 6 0"/>'}
  ];
  const nav=document.createElement('nav');
  nav.id='adc-app-toolbar';nav.setAttribute('aria-label',"Accessi rapidi dell'app Archivio ADC");
  paths.forEach(item=>{
   const a=document.createElement('a');a.href=item.url;
   if(current===item.url||(item.url==='/adc/'&&current==='/adc/index.html'))a.setAttribute('aria-current','page');
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
   svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.innerHTML=item.icon;
   const span=document.createElement('span');span.textContent=item.label;
   a.append(svg,span);nav.append(a);
  });
  document.body.append(nav);
  const status=document.createElement('div');status.id='adc-app-offline';
  status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  status.textContent='Connessione assente: alcune pagine potrebbero non essere disponibili.';
  status.hidden=navigator.onLine;
  document.body.append(status);
  window.addEventListener('online',()=>{status.hidden=true});
  window.addEventListener('offline',()=>{status.hidden=false});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();

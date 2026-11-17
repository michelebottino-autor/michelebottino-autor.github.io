/* Barra inferiore solo nell'app personale installata; non modificare l'app ADC. */
(()=>{'use strict';
if(window.__mbAppShell||location.pathname.startsWith('/adc/'))return;
const standalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
if(!standalone)return;
window.__mbAppShell=true;
document.documentElement.classList.add('mb-app-installed');
const items=[
 {label:'Home',url:'/',icon:'<path d="M3 10.5 12 3l9 7.5V21H3V10.5z"/><path d="M9 21v-7h6v7"/>'},
 {label:'Libri',url:'/opere/',icon:'<path d="M4 5.5C7 4.5 10 5 12 7v14c-3-2-6-2-8-1V5.5z"/><path d="M20 5.5c-3-1-6-.5-8 1.5v14c3-2 6-2 8-1V5.5z"/>'},
 {label:'Ricerca',url:'/ricerca/',icon:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>'},
 {label:'Fonti',url:'/analisi-documentaria/',icon:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 12h7M9 16h7"/>'},
 {label:'Contatti',url:'/contatti/',icon:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>'}
];
function render(){
 if(document.getElementById('mb-app-navigation')||!document.body)return;
 const nav=document.createElement('nav');
 nav.id='mb-app-navigation';
 nav.setAttribute('aria-label','Navigazione rapida dell’app Michele Bottino');
 const current=location.pathname.replace(/index\.html$/,'');
 items.forEach(item=>{
   const a=document.createElement('a');
   a.href=item.url;
   if(current===item.url)a.setAttribute('aria-current','page');
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
   svg.setAttribute('viewBox','0 0 24 24');
   svg.setAttribute('aria-hidden','true');
   svg.innerHTML=item.icon;
   const label=document.createElement('span');
   label.textContent=item.label;
   a.append(svg,label);nav.append(a);
 });
 document.body.append(nav);
 const offline=document.createElement('div');
 offline.id='mb-app-network-status';
 offline.setAttribute('role','status');
 offline.setAttribute('aria-live','polite');
 offline.textContent='Connessione assente. Puoi consultare alcune pagine già salvate.';
 const refresh=()=>{offline.hidden=navigator.onLine};
 refresh();
 document.body.append(offline);
 window.addEventListener('offline',refresh);
 window.addEventListener('online',refresh);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
else render();
})();
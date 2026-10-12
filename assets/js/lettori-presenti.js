/* ADC / Michele Bottino — presenza anonima, attivabile solo con endpoint configurato.
   Nessuna cifra simulata. Nessuna richiesta senza consenso statistiche. */
(()=>{'use strict';
const endpoint=(window.MB_PRESENCE_ENDPOINT||'').replace(/\/$/,'');
if(!/^https:\/\/[a-z0-9.-]+(?:\/[^?#]*)?$/i.test(endpoint))return;
const consent=()=>{try{return localStorage.getItem('mb_analytics_consent_v1')==='yes'}catch(_){return false}};
if(!consent())return;
const page=location.pathname.replace(/\/index\.html$/,'/').replace(/\/+$/,'/')||'/';
if(page.startsWith('/adc/widget/'))return;
const id=crypto.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
let timer=null,host=null;
function mount(){
 const main=document.querySelector('main');if(!main)return;
 host=document.createElement('aside');host.className='mb-presence';host.setAttribute('aria-label','Lettori presenti su questa pagina');
 host.innerHTML='<span class="mb-presence-icon" aria-hidden="true">●</span><span class="mb-presence-label">Lettori presenti</span><strong class="mb-presence-count" aria-live="off"></strong>';
 host.hidden=true;main.appendChild(host);
}
async function beat(){
 if(document.hidden||!consent())return;
 try{
  const response=await fetch(endpoint+'/presence',{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({page,id})});
  if(!response.ok)throw Error('not available');
  const data=await response.json();
  if(!Number.isSafeInteger(data.count)||data.count<1||data.count>1000000)throw Error('invalid');
  if(host){host.querySelector('.mb-presence-count').textContent=String(data.count);host.hidden=false}
 }catch(_){if(host)host.hidden=true}
}
function start(){if(timer||!consent())return;beat();timer=setInterval(beat,45000)}
function stop(){if(timer){clearInterval(timer);timer=null}if(host)host.hidden=true}
function init(){mount();start();document.addEventListener('visibilitychange',()=>document.hidden?stop():start());window.addEventListener('pagehide',stop)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

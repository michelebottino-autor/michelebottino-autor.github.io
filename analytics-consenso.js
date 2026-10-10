/* Stream Web GA4 ufficiale. Il tag viene caricato solo dopo il consenso. */
window.MB_ANALYTICS_ID = "G-5MVH0PN6E5";
(function(){
  "use strict";
  const id=window.MB_ANALYTICS_ID;
  if (!/^G-[A-Z0-9]{6,15}$/.test(id)) return;
  const key="mb_analytics_consent_v1";
  const safeGet=()=>{try{return localStorage.getItem(key)}catch(e){return null}};
  const safeSet=v=>{try{localStorage.setItem(key,v)}catch(e){}};
  function activate(){
    if(window.__mbAnalyticsLoaded)return;
    window.__mbAnalyticsLoaded=true;
    window['ga-disable-'+id]=false;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){dataLayer.push(arguments)};
    gtag('js',new Date());gtag('config',id,{anonymize_ip:true});
    const s=document.createElement('script');s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);
    document.head.appendChild(s);
  }
  function banner(){
    if(safeGet()==='yes'){activate();return}
    if(safeGet()==='no')return;
    const d=document.createElement('div');d.id='mb-consent';d.setAttribute('role','region');d.setAttribute('aria-label','Preferenze statistiche');
    d.style.cssText='position:fixed;bottom:12px;left:12px;right:12px;z-index:9999;max-width:680px;margin:auto;background:#fffaf1;color:#29251f;border:1px solid #aa9275;border-radius:12px;padding:16px;box-shadow:0 8px 30px #0003;font:15px/1.5 system-ui,sans-serif';
    d.innerHTML='<strong>Statistiche del sito</strong><p style="margin:6px 0 12px">Con il tuo consenso utilizziamo Google Analytics per conoscere le visite al sito. Puoi rifiutare senza limitazioni.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" data-choice="no">Rifiuta</button><button type="button" data-choice="yes">Accetta statistiche</button></div>';
    d.querySelectorAll('button').forEach(b=>{b.style.cssText='padding:9px 15px;border:1px solid #89735a;border-radius:6px;cursor:pointer;background:#f0e4d3;color:#29251f';b.addEventListener('click',()=>{const choice=b.dataset.choice;safeSet(choice);d.remove();if(choice==='yes')activate();else if(window.__mbAnalyticsLoaded){window['ga-disable-'+id]=true;location.reload()}})});
    document.body.appendChild(d);
  }
  function preferenceControl(){
    const b=document.createElement('button');b.type='button';b.textContent='Preferenze statistiche';
    b.setAttribute('aria-label','Modifica il consenso alle statistiche');
    b.style.cssText='position:fixed;bottom:8px;right:8px;z-index:9998;background:#fffaf1;color:#29251f;border:1px solid #aa9275;border-radius:6px;padding:5px 9px;font:12px system-ui,sans-serif;cursor:pointer';
    b.addEventListener('click',()=>{if(window.__mbAnalyticsLoaded){safeSet('');window['ga-disable-'+id]=true;location.reload();return;}safeSet('');const d=document.getElementById('mb-consent');if(d)d.remove();banner();});
    document.body.appendChild(b);
  }
  function init(){preferenceControl();banner()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

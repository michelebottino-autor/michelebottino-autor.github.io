/* Stream Web GA4 ufficiale. Il tag viene caricato solo dopo il consenso. */
window.MB_ANALYTICS_ID = "G-5MVH0PN6E5";
(function(){
  "use strict";
  const id=window.MB_ANALYTICS_ID;
  if (!/^G-[A-Z0-9]{6,15}$/.test(id)) return;
  const key="mb_analytics_consent_v1";
  const dateKey="mb_analytics_consent_date_v1";
  const maxAge=180*24*60*60*1000;
  const safeGet=()=>{try{const value=localStorage.getItem(key);const date=Number(localStorage.getItem(dateKey));if(!date||!Number.isFinite(date)||date>Date.now()||Date.now()-date>maxAge){localStorage.removeItem(key);localStorage.removeItem(dateKey);return null}return value}catch(e){return null}};
  const safeSet=v=>{try{if(v==="yes"||v==="no"){localStorage.setItem(key,v);localStorage.setItem(dateKey,String(Date.now()))}else{localStorage.removeItem(key);localStorage.removeItem(dateKey)}}catch(e){}};
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
  /* Eventi aggregati di usabilità: nessun testo libero, URL completo o identificativo personale. */
  function trackUsage(eventName,detail){
    if(safeGet()!=='yes'||!window.__mbAnalyticsLoaded||typeof window.gtag!=='function')return;
    const allowed=['adc_search','adc_navigation','adc_widget','site_navigation'];
    if(!allowed.includes(eventName))return;
    window.gtag('event',eventName,{section:detail.section||'site',action_type:detail.action||'open',destination:detail.destination||'other'});
  }
  function category(path){
    if(path.startsWith('/adc/widget/'))return 'adc_widget';
    if(path.startsWith('/adc/incorpora/'))return 'adc_embed';
    if(path.startsWith('/adc/cerca/'))return 'adc_search';
    if(path.startsWith('/adc/custode/'))return 'adc_custode';
    if(path.startsWith('/adc/inventario/'))return 'adc_inventory';
    if(path.startsWith('/adc/'))return 'adc_other';
    if(path.startsWith('/articoli/'))return 'articles';
    if(path.startsWith('/opere/'))return 'books';
    return 'author_site';
  }
  function usageTracking(){
    document.addEventListener('click',e=>{
      const a=e.target.closest('a[href]');
      if(!a)return;
      let dest;try{dest=new URL(a.href,location.href)}catch(err){return}
      if(!['http:','https:'].includes(dest.protocol))return;
      const internal=dest.origin===location.origin;
      const target=internal?category(dest.pathname):'external';
      trackUsage(category(location.pathname).startsWith('adc_')?'adc_navigation':'site_navigation',{section:category(location.pathname),action:'link',destination:target});
    },{passive:true});
    document.addEventListener('submit',e=>{
      const form=e.target;
      if(!form||form.tagName!=='FORM')return;
      const section=category(location.pathname);
      if(section==='adc_search'||section==='adc_custode'||section==='adc_widget'){
        trackUsage('adc_search',{section,action:'submit',destination:'search_results'});
      }
    });
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
    
    b.style.cssText='position:fixed;bottom:8px;right:8px;z-index:9998;background:#fffaf1;color:#29251f;border:1px solid #aa9275;border-radius:6px;padding:5px 9px;font:12px system-ui,sans-serif;cursor:pointer';b.className='mb-preferences-control';
    b.addEventListener('click',()=>{if(window.__mbAnalyticsLoaded){safeSet('');window['ga-disable-'+id]=true;location.reload();return;}safeSet('');const d=document.getElementById('mb-consent');if(d)d.remove();banner();});
    (document.querySelector('body > footer')||document.body).appendChild(b);
  }
  function mobileNavigation(){
    const nav=document.querySelector('body > header nav.nav');
    const list=nav&&nav.querySelector(':scope > ul');
    if(!nav||!list||nav.querySelector('.mb-mobile-menu-button, .menu-toggle, [aria-controls="menu"]'))return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='mb-mobile-menu-button';
    btn.textContent='Menu';
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-label','Apri il menu di navigazione');
    list.id=list.id||'mb-site-menu';
    btn.setAttribute('aria-controls',list.id);
    nav.insertBefore(btn,list);
    btn.addEventListener('click',()=>{
      const open=btn.getAttribute('aria-expanded')!=='true';
      btn.setAttribute('aria-expanded',String(open));
      btn.setAttribute('aria-label',open?'Chiudi il menu di navigazione':'Apri il menu di navigazione');
      list.classList.toggle('mb-mobile-menu-open',open);
    });
  }
  function setupPwa(){
    if(!document.querySelector('link[rel="manifest"]')){
      const link=document.createElement('link');
      link.rel='manifest';link.href='/manifest.webmanifest';
      document.head.appendChild(link);
    }
    if('serviceWorker' in navigator && location.protocol==='https:'){
      window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}),{once:true});
    }
  }
  function init(){setupPwa();mobileNavigation();usageTracking();preferenceControl();banner()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

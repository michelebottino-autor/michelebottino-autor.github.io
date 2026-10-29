/* PWA ADC v6: rete prioritaria, offline per pagine pubbliche già visitate. */
const CACHE='mb-static-v6';
const CORE=['/','/offline.html','/site-uniform.css','/mobile-platform.css','/pwa-init.js','/manifest.webmanifest','/installa/','/adc/','/icons/mb-192.png','/icons/mb-512.png'];
const MAX_PAGES=30;
const isPublicPage=url=>{
  if(url.search)return false;
  return !/\/(?:adc\/(?:cerca|custode|contribuisci)|contatti)(?:\/|$)/i.test(url.pathname);
};
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(async cache=>{
    const responses=await Promise.allSettled(CORE.map(async path=>{
      const response=await fetch(path,{cache:'reload'});
      if(response.ok)await cache.put(path,response);
    }));
    if(responses.every(x=>x.status==='rejected'))throw new Error('Nessuna risorsa essenziale disponibile');
  }));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mb-static-')&&key!==CACHE).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(req);
        if(response.ok&&isPublicPage(url)){
          const cache=await caches.open(CACHE);
          await cache.put(req,response.clone());
          const keys=(await cache.keys()).filter(x=>x.mode==='navigate');
          if(keys.length>MAX_PAGES){
            for(const key of keys.slice(0,keys.length-MAX_PAGES))await cache.delete(key);
          }
        }
        return response;
      }catch(err){
        return (await caches.match(req))||(await caches.match('/offline.html'))||Response.error();
      }
    })());
    return;
  }
  if(!/\.(?:css|js|json|webmanifest|png|jpe?g|webp|avif|svg|woff2?)$/i.test(url.pathname))return;
  event.respondWith(fetch(req).then(response=>{
    if(response.ok&&response.type==='basic'){
      const copy=response.clone();
      event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,copy)));
    }
    return response;
  }).catch(()=>caches.match(req)));
});

/* App installabile Michele Bottino: rete prioritaria, archivio pubblico offline. ADC ha un'app separata. */
const CACHE='mb-static-v10';
const CORE=['/','/offline.html','/site-uniform.css','/mobile-platform.css','/pwa-init.js','/app-shell.js','/app-shell.css','/manifest.webmanifest','/installa/','/installa/install.js','/opere/','/ricerca/','/analisi-documentaria/','/icons/mb-192.png','/icons/mb-512.png','/images/verifica-fonti-michele-bottino.png'];
const MAX_PAGES=35;
const MAX_ASSETS=100;
const publicPage=url=>!url.pathname.startsWith('/adc/')&&!/(?:^|\/)(?:contatti|privacy|cookie|rettifiche-e-diritti)(?:\/|$)/i.test(url.pathname);
const staticAsset=url=>/\.(?:css|js|json|webmanifest|png|jpe?g|webp|avif|svg|woff2?)$/i.test(url.pathname);
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(async cache=>{
    const results=await Promise.allSettled(CORE.map(async path=>{
      const response=await fetch(path,{cache:'reload'});
      if(response.ok&&response.type==='basic')await cache.put(path,response);
    }));
    if(results.every(x=>x.status==='rejected'))throw new Error('Risorse offline non raggiungibili');
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
  if(url.pathname.startsWith('/adc/'))return;
  if(req.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(req);
        if(response.ok&&response.type==='basic'&&publicPage(url)){
          const cache=await caches.open(CACHE);
          const key=url.pathname;
          await cache.put(key,response.clone());
          const keys=(await cache.keys()).filter(x=>{
            const pathname=new URL(x.url).pathname;
            return !CORE.includes(pathname)&&!staticAsset(new URL(x.url));
          });
          if(keys.length>MAX_PAGES)for(const k of keys.slice(0,keys.length-MAX_PAGES))await cache.delete(k);
        }
        return response;
      }catch(_){
        if(!publicPage(url))return (await caches.match('/offline.html'))||Response.error();
        return (await caches.match(url.pathname))||(await caches.match('/offline.html'))||Response.error();
      }
    })());
    return;
  }
  if(!staticAsset(url)||url.pathname.startsWith('/contatti/'))return;
  event.respondWith(fetch(req).then(response=>{
    if(response.ok&&response.type==='basic'){
      const copy=response.clone();
      event.waitUntil(caches.open(CACHE).then(async cache=>{
        await cache.put(req,copy);
        const keys=(await cache.keys()).filter(x=>staticAsset(new URL(x.url)));
        if(keys.length>MAX_ASSETS)for(const k of keys.slice(0,keys.length-MAX_ASSETS))await cache.delete(k);
      }));
    }
    return response;
  }).catch(()=>caches.match(req)));
});

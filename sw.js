/* PWA 2026: contenuti aggiornati via rete, accesso offline essenziale. */
const CACHE='mb-static-v4';
const CORE=['/','/offline.html','/site-uniform.css','/mobile-platform.css','/pwa-init.js','/manifest.webmanifest','/installa/','/adc/','/icons/mb-192.png','/icons/mb-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)));
 self.skipWaiting();
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mb-static-')&&key!==CACHE).map(key=>caches.delete(key)))),
  self.clients.claim()
 ]));
});
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET')return;
 const url=new URL(req.url);if(url.origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).catch(()=>caches.match(req).then(cached=>cached||caches.match('/offline.html'))));
  return;
 }
 if(!/\.(?:css|js|json|webmanifest|png|jpe?g|webp|svg|woff2?)$/i.test(url.pathname))return;
 event.respondWith(fetch(req).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,copy)))}
  return response;
 }).catch(()=>caches.match(req)));
});
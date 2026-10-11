/* PWA: cache conservativa delle sole risorse statiche e fallback offline. */
const CACHE='mb-static-v1';
const CORE=['/','/offline.html','/site-uniform.css','/icons/mb-icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('mb-static-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;if(req.mode==='navigate'){event.respondWith(fetch(req).catch(()=>caches.match(req).then(r=>r||caches.match('/offline.html'))));return}if(!/\.(?:css|js|png|jpg|jpeg|webp|svg|woff2?)$/i.test(new URL(req.url).pathname))return;event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}return response}))) });

/* Archivio Documentale Calatabiano: PWA autonoma e limitata a /adc/. */
'use strict';
const VERSION='adc-offline-v18-20261117-editoriale';
const PREFIX='adc-offline-';
const CORE=['/adc/','/adc/processo-334/','/adc/offline.html','/adc/manifest.webmanifest','/adc/app-init.js','/adc/app-shell.js','/adc/app-shell.css','/adc/reading-controls.js','/adc/reading-controls.css','/adc/assets/adc-utility-polish.css','/adc/assets/navigazione-unificata.css','/adc/assets/interfaccia-archivistica-interna-2026.css','/adc/tipografia.css','/adc/icons/adc-192.png','/adc/icons/adc-512.png','/adc/installa/'];
const PAGE_LIMIT=30;
const isADC=url=>url.origin===self.location.origin&&url.pathname.startsWith('/adc/');
const cacheablePage=url=>isADC(url)&&!url.search&&!/\/(?:cerca|contribuisci|custode|elena)(?:\/|$)/i.test(url.pathname);
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(VERSION);
  for(const path of CORE){
   try{const res=await fetch(path,{cache:'reload'});if(res.ok)await cache.put(path,res)}catch(_){}
  }
  if(!(await cache.match('/adc/offline.html')))throw Error('Offline fallback unavailable');
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==VERSION).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(!isADC(url))return;
 if(req.mode==='navigate'){
  event.respondWith((async()=>{
   try{
    const res=await fetch(req,{cache:'no-cache'});
    if(res.ok&&cacheablePage(url)){
     const cache=await caches.open(VERSION);
     await cache.put(url.pathname,res.clone());
     const staticCore=new Set(CORE.map(p=>new URL(p,self.location.origin).pathname));
     const keys=(await cache.keys()).filter(k=>{const p=new URL(k.url).pathname;return !staticCore.has(p)&&!/\.(?:css|js|json|webmanifest|png|jpe?g|webp|avif|svg|woff2?)$/i.test(p)});
     if(keys.length>PAGE_LIMIT)for(const k of keys.slice(0,keys.length-PAGE_LIMIT))await cache.delete(k);
    }
    return res;
   }catch(_){
    return (cacheablePage(url)&&await caches.match(url.pathname))||await caches.match('/adc/offline.html')||Response.error();
   }
  })());
  return;
 }
 if(!/\.(?:css|js|json|webmanifest|png|jpe?g|webp|avif|svg|woff2?)$/i.test(url.pathname))return;
 event.respondWith(fetch(req).then(res=>{
   if(res.ok&&res.type==='basic'&&!/\/(?:cerca|contribuisci|custode|elena)\//i.test(url.pathname)){
    const copy=res.clone();event.waitUntil(caches.open(VERSION).then(c=>c.put(req,copy)));
   }return res;
 }).catch(()=>caches.match(req)));
});

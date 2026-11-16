#!/usr/bin/env node
const fs=require('node:fs'),assert=require('node:assert/strict');
const exists=p=>assert.ok(fs.existsSync(p),p+' missing');
const read=p=>fs.readFileSync(p,'utf8');
const m=JSON.parse(read('adc/manifest.webmanifest'));
assert.equal(m.id,'/adc/');assert.equal(m.scope,'/adc/');assert.equal(m.start_url,'/adc/');
assert.equal(m.display,'standalone');
assert.ok(m.name.includes('Archivio Documentale Calatabiano'));
assert.ok(m.icons.some(i=>i.sizes==='192x192'&&i.src.startsWith('/adc/')));
assert.ok(m.icons.some(i=>i.sizes==='512x512'&&i.src.startsWith('/adc/')));
for(const i of m.icons){const file=i.src.slice(1);exists(file);const bytes=fs.readFileSync(file);assert.ok(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'invalid PNG '+file)}
for(const s of ['adc/sw.js','adc/app-init.js','adc/installa/install.js','pwa-init.js','adc/assets/navigazione-unificata.js']){
 exists(s);new (require('node:vm').Script)(read(s),{filename:s});
}
const init=read('adc/app-init.js'),root=read('pwa-init.js'),nav=read('adc/assets/navigazione-unificata.js'),sw=read('adc/sw.js');
assert.ok(init.includes("register('/adc/sw.js',{scope:'/adc/'})"));
assert.ok(root.includes("location.pathname.startsWith('/adc/')"));
assert.ok(nav.includes('/adc/app-init.js'));
assert.ok(init.includes('/adc/manifest.webmanifest'));
assert.ok(sw.includes("url.pathname.startsWith('/adc/')"));
assert.ok(!sw.includes("CORE=['/'"),'root site included in ADC precache');
for(const p of ['adc/offline.html','adc/installa/index.html','adc/index.html','adc/fonti/index.html','adc/atlante/index.html'])exists(p);
for(const p of ['app-android/capacitor.config.json','app-android/package.json']){
 const j=JSON.parse(read(p));assert.ok(JSON.stringify(j).includes('adc')||JSON.stringify(j).includes('calatabiano'));
}
const android=read('app-android/www/index.html');
assert.ok(!android.includes('/opere/'),'author books link in ADC app');
assert.ok(!android.includes('github.io/installa/'),'author install link in ADC app');
const general=JSON.parse(read('manifest.webmanifest'));
assert.equal(general.id,'/');assert.equal(general.scope,'/');
console.log('ADC app: manifest, scoped worker, icons, installer and Android isolation passed.');

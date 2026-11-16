const { chromium } = require('playwright');
const assert=require('node:assert/strict');
const BASE='http://127.0.0.1:8765';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [390,820,1366]){
   const context=await browser.newContext({viewport:{width,height:850},serviceWorkers:'allow'});
   const page=await context.newPage();
   const res=await page.goto(BASE+'/adc/',{waitUntil:'domcontentloaded'});
   assert.equal(res.status(),200);
   await page.waitForFunction(()=>document.querySelector('link[rel="manifest"]')?.getAttribute('href')==='/adc/manifest.webmanifest',{timeout:12000});
   const manifestHref=await page.locator('link[rel="manifest"]').getAttribute('href');
   assert.equal(manifestHref,'/adc/manifest.webmanifest');
   await page.evaluate(()=>navigator.serviceWorker.ready);
   const scopes=await page.evaluate(async()=>(await navigator.serviceWorker.getRegistrations()).map(r=>r.scope));
   assert.ok(scopes.some(s=>s.endsWith('/adc/')),'missing scoped ADC worker');
   const w=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth}));
   assert.ok(w.scroll<=w.inner+5,'horizontal overflow '+width+' '+JSON.stringify(w));
   const page2=await context.newPage();
   const install=await page2.goto(BASE+'/adc/installa/',{waitUntil:'domcontentloaded'});
   assert.equal(install.status(),200);
   const title=await page2.title();assert.ok(title.includes('Archivio'));
   assert.equal(await page2.locator('link[rel="manifest"]').getAttribute('href'),'/adc/manifest.webmanifest');
   if(width===390){
    await page.reload({waitUntil:'domcontentloaded'});
    await context.setOffline(true);
    const off=await page.goto(BASE+'/adc/',{waitUntil:'domcontentloaded'});
    assert.equal(off.status(),200,'cached ADC homepage did not load offline');
    const fallback=await page.goto(BASE+'/adc/non-esistente-prova-rete/',{waitUntil:'domcontentloaded'});
    assert.equal(fallback.status(),200);
    assert.ok((await page.locator('h1').first().textContent()).includes('Connessione non disponibile'));
   }
   await context.close();
  }
  const context=await browser.newContext({serviceWorkers:'block'});
  const page=await context.newPage();
  await page.goto(BASE+'/',{waitUntil:'domcontentloaded'});
  const link=await page.locator('link[rel="manifest"]').first().getAttribute('href');
  assert.equal(link,'/manifest.webmanifest','author homepage manifest changed');
  await context.close();
  console.log('ADC app verified: 390 / 820 / 1366px, isolated scope, install page, offline fallback.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

const { chromium }=require('playwright');
const assert=require('node:assert/strict');
const BASE='http://127.0.0.1:8765';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'allow'});
  await context.addInitScript(()=>{
   const original=window.matchMedia.bind(window);
   window.matchMedia=query=>query.includes('display-mode: standalone')?{
    matches:true,media:query,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},dispatchEvent(){return true}
   }:original(query);
  });
  const page=await context.newPage();
  const resp=await page.goto(BASE+'/adc/',{waitUntil:'domcontentloaded'});
  assert.equal(resp.status(),200);
  const bar=page.locator('#adc-app-toolbar');
  await bar.waitFor({state:'visible',timeout:15000});
  assert.equal(await bar.locator('a').count(),4);
  assert.equal(await bar.getAttribute('aria-label'),"Accessi rapidi dell'app Archivio ADC");
  assert.equal(await bar.locator('a[aria-current="page"]').count(),1);
  const box=await bar.boundingBox();
  assert.ok(box&&box.y>650,'toolbar must be at viewport bottom');
  const x=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert.ok(x.width<=x.viewport+5,'overflow '+JSON.stringify(x));
  await bar.getByRole('link',{name:'Fonti'}).click();
  await page.waitForURL('**/adc/fonti/');
  await page.locator('#adc-app-toolbar').waitFor({state:'visible'});
  assert.equal(await page.locator('#adc-app-toolbar a[aria-current="page"]').textContent(),'Fonti');
  await page.evaluate(()=>window.dispatchEvent(new Event('offline')));
  await page.locator('#adc-app-offline').waitFor({state:'visible'});
  await page.evaluate(()=>window.dispatchEvent(new Event('online')));
  await page.locator('#adc-app-offline').waitFor({state:'hidden'});
  await context.close();
  const normal=await browser.newContext({viewport:{width:390,height:844}});
  const normalPage=await normal.newPage();
  await normalPage.goto(BASE+'/adc/',{waitUntil:'domcontentloaded'});
  assert.equal(await normalPage.locator('#adc-app-toolbar').count(),0,'browser mode must not show app toolbar');
  await normal.close();
  const tablet=await browser.newContext({viewport:{width:820,height:1024}});
  await tablet.addInitScript(()=>{
   const orig=window.matchMedia.bind(window);
   window.matchMedia=q=>q.includes('display-mode: standalone')?{matches:true,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}:orig(q);
  });
  const tabletPage=await tablet.newPage();
  await tabletPage.goto(BASE+'/adc/',{waitUntil:'domcontentloaded'});
  await tabletPage.locator('#adc-app-toolbar').waitFor({state:'attached'});
  assert.equal(await tabletPage.locator('#adc-app-toolbar').isVisible(),false,'tablet gets regular menu');
  await tablet.close();
  console.log('ADC app: standalone navigation, page transitions, connectivity notices and normal browser isolation passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

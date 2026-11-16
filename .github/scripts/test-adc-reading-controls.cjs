const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const ctx=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'allow'});
  await ctx.addInitScript(()=>{
   const orig=window.matchMedia.bind(window);
   window.matchMedia=q=>q.includes('display-mode: standalone')?{matches:true,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}:orig(q);
  });
  const page=await ctx.newPage();
  const BASE='http://127.0.0.1:8765';
  await page.goto(BASE+'/adc/dossier-1213-1537/',{waitUntil:'domcontentloaded'});
  const controls=page.locator('#adc-reader-controls');
  await controls.waitFor({state:'visible',timeout:12000});
  assert.equal(await controls.locator('button').count(),3);
  const consent=page.locator('#mb-consent');
  if(await consent.count()){await consent.getByRole('button',{name:'Rifiuta'}).click();await consent.waitFor({state:'detached'})}
  const grow=controls.getByRole('button',{name:'Ingrandisci dimensione del testo'});
  await grow.click();
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--adc-reader-scale').trim()),'1.1');
  assert.equal(await page.evaluate(()=>localStorage.getItem('adc-reading-scale-v1')),'1.1');
  await page.evaluate(()=>scrollTo(0,950));
  await page.waitForFunction(()=>Number(localStorage.getItem('adc-reading-scroll-v1:/adc/dossier-1213-1537/'))>=400,{timeout:7000});
  await page.goto(BASE+'/adc/',{waitUntil:'domcontentloaded'});
  await page.locator('#adc-reader-controls').waitFor({state:'visible'});
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--adc-reader-scale').trim()),'1.1');
  const homeConsent=page.locator('#mb-consent');
  if(await homeConsent.count()){
   const reject=homeConsent.getByRole('button',{name:'Rifiuta'});
   if(await reject.count())await reject.click();
   await homeConsent.waitFor({state:'detached'});
  }
  await page.getByRole('button',{name:'Continua lettura'}).click();
  await page.waitForURL('**/adc/dossier-1213-1537/');
  await page.locator('#adc-reader-controls').waitFor({state:'visible'});
  await page.getByRole('button',{name:'Riprendi qui'}).click();
  assert.ok(await page.evaluate(()=>scrollY)>=400,'resume position was not restored');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+5),'no horizontal overflow');
  await ctx.close();
  const ordinary=await browser.newContext({viewport:{width:390,height:844}});
  const browserPage=await ordinary.newPage();
  await browserPage.goto(BASE+'/adc/',{waitUntil:'domcontentloaded'});
  assert.equal(await browserPage.locator('#adc-reader-controls').count(),0,'no standalone reader bar in browser mode');
  await ordinary.close();
  console.log('ADC reading preferences passed: font controls, local storage, continue and resume, browser isolation.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

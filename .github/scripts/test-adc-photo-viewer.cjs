const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [390,820,1366]){
   const ctx=await browser.newContext({viewport:{width,height:850},serviceWorkers:'block'});
   const page=await ctx.newPage();
   const response=await page.goto('http://127.0.0.1:8765/adc/mediateca/',{waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200);
   const photos=page.locator('#fotografie-mediateca figure.adc-photo-tile');
   assert.equal(await photos.count(),4);
   const first=photos.first();
   const textBefore=await first.locator('figcaption').innerText();
   const attribution=await first.locator('figcaption a').count();
   assert.ok(attribution>=2,'original photo attribution must be retained');
   const consent=page.locator('#mb-consent');
   if(await consent.isVisible().catch(()=>false)){
    const reject=consent.getByRole('button',{name:/Rifiuta/i});
    if(await reject.count())await reject.click();
   }
   const open=first.getByRole('button',{name:/Ingrandisci fotografia/i});
   await open.click();
   const modal=page.locator('#adc-photo-viewer');
   assert.equal(await modal.evaluate(el=>el.open),true);
   assert.equal(await modal.locator('.adc-viewer-caption').innerText(),textBefore);
   assert.equal(await modal.locator('.adc-viewer-caption a').count(),attribution);
   await modal.getByRole('button',{name:'Successiva'}).click();
   assert.match(await modal.locator('.adc-viewer-bar').innerText(),/2 di 4/);
   await modal.getByRole('button',{name:'Ingrandisci'}).click();
   assert.equal(await modal.locator('.adc-viewer-stage').getAttribute('class'),'adc-viewer-stage is-zoomed');
   await page.keyboard.press('Escape');
   assert.equal(await modal.evaluate(el=>el.open),false);
   assert.equal(await open.evaluate(el=>document.activeElement===el),true);
   const bounds=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
   assert.ok(bounds.scroll<=bounds.width+5,'horizontal scroll on width '+width);
   await ctx.close();
   console.log('Mediateca viewer OK at '+width+'px');
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

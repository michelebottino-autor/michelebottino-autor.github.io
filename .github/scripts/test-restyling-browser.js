const { chromium } = require('playwright');
const fs = require('fs');
(async()=>{
 fs.mkdirSync('restyling-screenshots',{recursive:true});
 const browser=await chromium.launch({headless:true});
 let errors=[];
 for(const [name,width,height] of [['mobile',390,844],['desktop',1440,900]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  try{
   const response=await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded',timeout:45000});
   if(!response?.ok())throw new Error('Homepage HTTP non valida');
   const hero=page.locator('section.hero').first();
   if(!await hero.isVisible())errors.push(name+': hero non visibile');
   if(!await page.locator('section.hero h1').isVisible())errors.push(name+': titolo principale non visibile');
   if(!await page.locator('section.hero img').first().isVisible())errors.push(name+': immagine hero non visibile');
   if(!await page.locator('header nav').first().count())errors.push(name+': navigazione non trovata');
   await page.screenshot({path:'restyling-screenshots/home-'+name+'.png',fullPage:true});
   if(name==='mobile'){
    const toggle=page.locator('header summary').first();
    if(await toggle.count()){
     await toggle.click();
     if(!await page.locator('header details[open]').count())errors.push('Menu mobile non aperto');
     await page.screenshot({path:'restyling-screenshots/menu-mobile.png'});
     await toggle.click();
     if(await page.locator('header details[open]').count())errors.push('Menu mobile non chiuso');
    }else errors.push('Menu mobile non trovato');
   }
  }catch(e){errors.push(name+': '+e.message)}
  await page.close();
 }
 await browser.close();
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
 else console.log('Screenshot e controlli di navigazione responsive superati');
})().catch(e=>{console.error(e);process.exit(1)});

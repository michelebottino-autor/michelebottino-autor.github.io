const { chromium } = require('playwright');
const fs = require('fs');
(async()=>{
  fs.mkdirSync('restyling-screenshots',{recursive:true});
  const browser=await chromium.launch({headless:true});
  let errors=[];
  for(const [name,width,height] of [['mobile',390,844],['desktop',1440,900]]){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle',timeout:45000});
    await page.screenshot({path:'restyling-screenshots/home-'+name+'.png',fullPage:true});
    const bg=await page.locator('.hero.container').evaluate(el=>getComputedStyle(el).backgroundColor);
    const nav=page.locator('#menu');
    if(name==='mobile'){
      const toggle=page.locator('#menu-toggle');
      await toggle.click();
      if(await toggle.getAttribute('aria-expanded')!=='true')errors.push('Menu mobile non aperto');
      if(!await nav.isVisible())errors.push('Menu mobile invisibile');
      await page.screenshot({path:'restyling-screenshots/menu-mobile.png'});
    }
    console.log(name+' hero-background: '+bg);
    await page.close();
  }
  await browser.close();
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
})().catch(e=>{console.error(e);process.exit(1)});

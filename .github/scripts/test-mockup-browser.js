const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.mkdirSync('restyling-screenshots/sections',{recursive:true});const b=await chromium.launch({headless:true});const problems=[];
for(const slug of ['biografia','opere','adc','ricerca','contatti']){
 for(const [device,w,h] of [['mobile',390,844],['desktop',1440,900]]){
  const p=await b.newPage({viewport:{width:w,height:h}});
  await p.goto('http://127.0.0.1:8765/'+slug+'/',{waitUntil:'networkidle',timeout:45000});
  const hero=p.locator('.mockup-hero');if(!await hero.isVisible())problems.push(slug+'/'+device+': hero not visible');
  const width=await p.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
  if(width.scroll>width.client+3)problems.push(slug+'/'+device+': horizontal overflow '+JSON.stringify(width));
  const image=hero.locator('img');if(await image.count()){const loaded=await image.evaluate(e=>e.complete&&e.naturalWidth>0);if(!loaded)problems.push(slug+'/'+device+': image failed');}
  await p.screenshot({path:'restyling-screenshots/sections/'+slug+'-'+device+'.png',fullPage:true});await p.close();
 }
}
await b.close();console.log('10 section screenshots generated');if(problems.length){console.error(problems.join('\n'));process.exitCode=1}
})().catch(e=>{console.error(e);process.exitCode=1});

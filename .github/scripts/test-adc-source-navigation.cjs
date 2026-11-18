const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const root='http://127.0.0.1:8765';
const cases=[
 {path:'/adc/dossier-1213-1537/',ids:['adc-notizia-1213','adc-notizia-1537','adc-fonti-e-limiti'],texts:['1213','1537','Tracciabilità']},
 {path:'/adc/processo-334/',ids:['adc-letture-proposte','aggiornamento-20261111','adc-limiti-334'],texts:['Letture e interpretazioni','11 novembre','Che cosa sappiamo']},
 {path:'/adc/verifica-riproduzioni-184-334/',ids:['adc-dati-confronto','adc-repertorio-ufficiale','adc-verifiche-aperte'],texts:['Risultati del confronto','repertorio ufficiale','resta da verificare']}
];
(async()=>{
const browser=await chromium.launch({headless:true});
try{
 for(const width of [390,820,1366]){
  const ctx=await browser.newContext({viewport:{width,height:850},serviceWorkers:'block'});
  const page=await ctx.newPage();
  await ctx.addInitScript(()=>{try{localStorage.setItem('mb-consent','no')}catch(e){}});
  for(const item of cases){
   let r=await page.goto(root+item.path,{waitUntil:'domcontentloaded'});
   assert.equal(r.status(),200,item.path);
   const nav=page.locator('.adc-reading-nav');
   assert.equal(await nav.count(),1,'one documentary navigation per page');
   const links=nav.locator('a[href^="#"]');
   assert.equal(await links.count(),3);
   for(let i=0;i<item.ids.length;i++){
    const target=page.locator('#'+item.ids[i]);
    assert.equal(await target.count(),1,'unique target '+item.ids[i]);
    assert.ok((await target.innerText()).includes(item.texts[i]),'matching target content '+item.ids[i]);
    assert.equal(await links.nth(i).getAttribute('href'),'#'+item.ids[i]);
   }
   const screen=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(screen.document<=screen.viewport+5,'horizontal scroll '+width+' '+item.path);
  }
  await ctx.close();
  console.log('Documentary links and layout passed at '+width+'px');
 }
}finally{await browser.close()}
})().catch(err=>{console.error(err);process.exitCode=1});

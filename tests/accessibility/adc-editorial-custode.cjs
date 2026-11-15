const { chromium } = require('playwright');
const fs = require('fs');
const paths = ['adc/index.html','adc/percorsi.html','adc/fonti/index.html','adc/carta/index.html','adc/contribuisci/index.html','adc/custode/index.html','adc/storia/index.html','adc/atlante/index.html','adc/inventario/index.html','adc/mediateca/index.html','adc/elena/index.html'];
const inventory = JSON.parse(fs.readFileSync('adc/inventario/testimonianze.json','utf8'));
if (!Array.isArray(inventory.schede) || !inventory.schede.length) throw Error('Inventario non disponibile');
(async () => {
 const browser = await chromium.launch({headless:true});
 const page = await browser.newPage();
 const errors = [];
 for (const path of paths) {
  const res = await page.goto('http://127.0.0.1:8765/' + path, {waitUntil:'domcontentloaded'});
  if (!res?.ok()) { errors.push(path + ': HTTP non valido'); continue; }
  const data = await page.evaluate(() => {
   const ids = [...document.querySelectorAll('[id]')].map(x=>x.id);
   const anchors = [...document.querySelectorAll('a[href^="#"]')].map(x=>x.getAttribute('href').slice(1)).filter(Boolean);
   return { h1:document.querySelectorAll('h1').length, duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i), broken:anchors.filter(id=>!ids.includes(id)), title:document.title };
  });
  if(data.h1!==1) errors.push(path + ': numero h1 ' + data.h1);
  if(data.duplicates.length) errors.push(path + ': ID duplicati ' + data.duplicates.join(','));
  if(data.broken.length) errors.push(path + ': ancore mancanti ' + data.broken.join(','));
  console.log(path + ': struttura verificata');
 }
 // Il Custode e' un percorso legacy: oggi reindirizza a Elena.
 await page.goto('http://127.0.0.1:8765/adc/custode/', {waitUntil:'domcontentloaded'});
 await page.waitForURL('**/adc/elena/', {timeout:10000});
 if(!page.url().endsWith('/adc/elena/')) errors.push('Custode: reindirizzamento a Elena non riuscito');
 if(await page.locator('h1').count()!==1) errors.push('Elena: intestazione principale non univoca');
 console.log('Custode legacy: reindirizzamento a Elena verificato');
 await browser.close();
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
 else console.log('Revisione strutturale ADC e collaudo documentario Custode superati.');
})().catch(e=>{console.error(e);process.exitCode=1;});

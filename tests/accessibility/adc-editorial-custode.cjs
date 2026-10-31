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
 await page.goto('http://127.0.0.1:8765/adc/custode/',{waitUntil:'domcontentloaded'});
 const cases=[
  {q:'castello Calatabiano 1213', expected:'ADC-0001'},
  {q:'chiese medievali Rationes', expected:'ADC-0002'}
 ];
 for(const item of cases){
  await page.locator('#question').fill(item.q);
  await page.locator('#askform button[type="submit"]').click();
  await page.locator('#evidence .evidence-card').filter({hasText:item.expected}).first().waitFor({timeout:15000});
  const evidence = await page.locator('#evidence').innerText();
  const status = await page.locator('#status').innerText();
  if(!evidence.includes(item.expected)) errors.push('Custode '+item.q+': scheda attesa non mostrata. Stato: '+status);
  const links=await page.locator('#evidence a').evaluateAll(els=>els.map(x=>x.getAttribute('href')));
  if(links.some(x=>!x || x.includes('undefined'))) errors.push('Custode '+item.q+': link scheda invalido');
  console.log('Custode: '+item.q+' -> '+status);
 }
 await page.locator('#question').fill('argomentoinesistentezzxq');
 await page.locator('#askform button[type="submit"]').click();
 await page.waitForFunction(() => document.querySelector('#status').textContent.includes('Non ho trovato riferimenti sufficienti'), null, {timeout:15000});
 if(await page.locator('#evidence .evidence-card').count()) errors.push('Custode: fonti inventate su domanda senza riscontro');
 await browser.close();
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
 else console.log('Revisione strutturale ADC e collaudo documentario Custode superati.');
})().catch(e=>{console.error(e);process.exitCode=1;});

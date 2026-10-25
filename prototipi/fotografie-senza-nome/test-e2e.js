'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),local=__dirname;
const html=fs.readFileSync(path.join(local,'index.html'),'utf8');
assert.match(html,/name="robots" content="noindex,nofollow"/);
assert.match(html,/NESSUNA|Nessuna iscrizione/);
const catalog=JSON.parse(fs.readFileSync(path.join(root,'catalogo/corsi.json'),'utf8'));
const c=catalog.courses.find(x=>x.id==='fotografie-senza-nome');
assert.equal(c.status,'coming_soon');assert.equal(c.enrollment.enabled,false);assert.notEqual(c.pricing.payment_enabled,true);
const puppeteer=require(process.env.PUPPETEER_MODULE||'puppeteer');
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css'};
const server=http.createServer((req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let f=path.resolve(root,'.'+pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);res.end();return;}res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);}catch(e){res.writeHead(500);res.end(String(e));}});
(async()=>{await new Promise(ok=>server.listen(0,'127.0.0.1',ok));const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-gpu']});try{
for(const width of [390,1280]){const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewport({width,height:860});await page.goto('http://127.0.0.1:'+server.address().port+'/prototipi/fotografie-senza-nome/',{waitUntil:'networkidle0'});assert.equal(await page.$$eval('fieldset',x=>x.length),3);
await page.click('[data-view="catalog"]');assert.equal(await page.$eval('[data-view="catalog"]',x=>x.getAttribute('aria-pressed')),'true');assert.match(await page.$eval('[data-view-response]',x=>x.textContent),/Library of Congress/);
for(const [name,answer] of [['date','interval'],['author','unknown'],['caption','supported']]){await page.click('input[name="'+name+'"][value="'+answer+'"]');await page.click('[data-check="'+name+'"]');assert.equal(await page.$eval('[data-feedback="'+name+'"]',x=>x.dataset.result),'correct');}
await page.click('#reset-lab');assert.equal(await page.$eval('input[name="date"][value="interval"]',x=>x.checked),false);
await page.click('input[name="date"][value="exact"]');await page.click('[data-check="date"]');assert.equal(await page.$eval('[data-feedback="date"]',x=>x.dataset.result),'incorrect');
await page.click('#export-caption');assert.match(await page.$eval('#lab-status',x=>x.textContent),/Scrivi prima/);
await page.type('#caption-draft','Ritratto catalogato come Mary Church Terrell, 1880–1900.');
await page.click('#export-caption');assert.match(await page.$eval('#lab-status',x=>x.textContent),/Esportazione richiesta/);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+4),true,'horizontal overflow');
assert.deepEqual(errors,[]);
console.log('PHOTO_PROTOTYPE_E2E_OK width='+width+' catalog, quiz, reset, export, responsive');await page.close();
}}finally{await browser.close();server.close();}})().catch(e=>{console.error('PHOTO_PROTOTYPE_E2E_FAIL',e);process.exitCode=1;server.close();});

'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(__dirname,'unita-2/index.html'),'utf8');
assert.ok(html.includes('data-photo-lab="terrell"'));
assert.ok(html.includes('https://www.loc.gov/item/97500102/'));
assert.ok(html.includes('photo-lab.js?v=1'));
const puppeteer=require(process.env.PUPPETEER_MODULE||'puppeteer');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{try{const url=new URL(req.url,'http://localhost');let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404);res.end();return}res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res)}catch(e){res.writeHead(500);res.end(String(e))}});
(async()=>{
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-gpu']});
try{for(const width of [390,1280]){const page=await browser.newPage();await page.setViewport({width,height:844});const errors=[];page.on('pageerror',x=>errors.push(x.message));await page.goto('http://127.0.0.1:'+server.address().port+'/storie-che-mancano/unita-2/',{waitUntil:'networkidle0'});
assert.equal(await page.$$eval('[data-photo-question]',x=>x.length),3);
await page.click('[data-photo-observe="catalog"]');assert.ok((await page.$eval('[data-photo-explanation]',x=>x.textContent)).includes('Library of Congress'));
assert.equal(await page.$eval('[data-photo-observe="catalog"]',x=>x.getAttribute('aria-pressed')),'true');
for(const [index,answer] of [[1,'b'],[2,'c'],[3,'a']]){await page.click('input[name="photo-question-'+index+'"][value="'+answer+'"]');await page.click('[data-photo-question="'+index+'"] button');assert.equal(await page.$eval('[data-photo-question="'+index+'"] .mb-photo-question-feedback',x=>x.dataset.result),'correct')}
await page.click('[data-photo-reset]');assert.equal(await page.$eval('input[name="photo-question-1"][value="b"]',x=>x.checked),false);
await page.click('input[name="photo-question-1"][value="c"]');await page.click('[data-photo-question="1"] button');assert.equal(await page.$eval('[data-photo-question="1"] .mb-photo-question-feedback',x=>x.dataset.result),'incorrect');
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+5),true);
assert.deepEqual(errors,[]);
console.log('PHOTO_LAB_E2E_OK viewport='+width+'; three questions, feedback, reset, focusable controls and responsive layout');
await page.close()}}finally{await browser.close();server.close()}
})().catch(e=>{console.error('PHOTO_LAB_E2E_FAILED',e);process.exitCode=1;server.close()});

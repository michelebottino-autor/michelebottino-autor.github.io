'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const d=JSON.parse(fs.readFileSync(path.join(__dirname,'dossier.json'),'utf8'));
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
assert.equal(d.stages.length,10);
assert.equal(d.claims.length,8);
assert.equal(d.sources.length,3);
assert.equal(d.sources[0].visual_checked,false,'Do not claim visual verification');
assert.ok(d.article.paragraphs.length>=8);
assert.ok(d.article.paragraphs.flatMap(p=>p.claim_ids).every(id=>d.claims.some(c=>c.id===id)));
assert.ok(d.article.paragraphs.reduce((n,p)=>n+p.text.split(/\s+/).length,0)>500);
assert.ok(html.includes('caso-pilota')===false || html.includes('michelebottino-autor.github.io/scrittura-investigativa/caso-pilota/'));
assert.ok(!html.match(/<img[^>]+src=["']https?:\/\//i),'No remote images embedded');
const puppeteer=require(process.env.PUPPETEER_MODULE||'puppeteer');
const server=http.createServer((req,res)=>{
 try{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
 let f=path.resolve(root,'.'+pathname);
 if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
 if(!fs.existsSync(f)){res.writeHead(404);res.end();return;}
 res.writeHead(200,{'Content-Type': f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.json')?'application/json':f.endsWith('.css')?'text/css':'text/javascript'});
 fs.createReadStream(f).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
async function run(){
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const url='http://127.0.0.1:'+server.address().port;
 const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-gpu']});
 const page=await browser.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
 await page.goto(url+'/scrittura-investigativa/caso-pilota/',{waitUntil:'networkidle0'});
 assert.equal(await page.$$eval('.pilot-step',a=>a.length),10);
 assert.equal(await page.evaluate(()=>document.querySelectorAll('.pilot-panel[aria-labelledby=matrix] tbody tr').length),8);
 assert.equal(await page.evaluate(()=>document.querySelectorAll('.pilot-article p').length),d.article.paragraphs.length);
 assert.ok(await page.$eval('a[href="#claim-P3"]',a=>Boolean(a.href)));
 assert.ok(await page.$eval('a[href*="chroniclingamerica.loc.gov"]',a=>Boolean(a.href)));
 assert.ok(await page.$eval('#valutazione-redazionale',x=>x.textContent.includes('65/100')));
 await page.goto(url+'/scrittura-investigativa/',{waitUntil:'networkidle0'});
 assert.equal(await page.$$eval('a[href="./caso-pilota/"]',a=>a.length)>=1,true);
 await page.goto(url+'/scrittura-investigativa/unita-1/',{waitUntil:'networkidle0'});
 await page.waitForSelector('.studio-lesson');
 assert.equal(await page.$$eval('details.studio-legacy',a=>a.length),1);
 assert.equal(await page.$eval('details.studio-legacy',d=>d.open),false);
 assert.ok(await page.$eval('.studio-lesson a[href="../caso-pilota/"]',a=>a.href.includes('caso-pilota')));
 assert.deepEqual(errors,[]);
 console.log('DOCUMENTARY_PILOT_E2E_OK: 10 stages, evidence links, static article, course navigation, archived legacy');
 }finally{await browser.close();}
}
run().catch(e=>{console.error('DOCUMENTARY_PILOT_E2E_FAIL',e);process.exitCode=1;}).finally(()=>server.close());
'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const lab=JSON.parse(fs.readFileSync(path.join(__dirname,'laboratorio-autentico','fonti-verificate.json'),'utf8'));
const assessment=JSON.parse(fs.readFileSync(path.join(__dirname,'caso-modello','valutazione-dimostrativa.json'),'utf8'));
const revisions=JSON.parse(fs.readFileSync(path.join(__dirname,'caso-modello','registro-revisione-proposto.json'),'utf8'));
const program=JSON.parse(fs.readFileSync(path.join(__dirname,'programma.json'),'utf8'));
assert.equal(lab.records.length,4);assert.equal(lab.claims.length,8);
assert.equal(lab.records.filter(x=>x.url.startsWith('https://www.loc.gov/')).length,4);
assert.equal(assessment.criteria.length,5);
assert.equal(assessment.score,assessment.criteria.reduce((s,x)=>s+x.score,0));
assert.equal(assessment.score,77);assert.equal(assessment.human_review_status,'not_performed');
assert.equal(revisions.proposals.length,3);
assert.equal(program.authentic_lab.references,4);assert.equal(program.model_assessment.certification,false);
const dossier=JSON.parse(fs.readFileSync(path.join(__dirname,'caso-modello','dossier.json'),'utf8'));
for(const change of revisions.proposals){assert.ok(dossier.portrait.some(x=>x.text.includes(change.original_excerpt)),'Rewritten excerpt must exist in model');}
const server=http.createServer((req,res)=>{
 try{
  const u=new URL(req.url,'http://127.0.0.1');let file=path.resolve(root,'.'+decodeURIComponent(u.pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':'application/json'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
const puppeteer=require(process.env.PUPPETEER_MODULE||'puppeteer');
(async()=>{
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-gpu']});
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  let r=await page.goto(base+'/storie-che-mancano/',{waitUntil:'networkidle0'});assert.equal(r.status(),200);
  assert.equal(await page.$$eval('a[href="./laboratorio-autentico/"]',a=>a.length),1);
  assert.equal(await page.$$eval('a[href="./caso-modello/valutazione/"]',a=>a.length),1);
  for(const n of [2,3,5,9,10]){
   r=await page.goto(base+'/storie-che-mancano/unita-'+n+'/',{waitUntil:'networkidle0'});assert.equal(r.status(),200);
   assert.equal(await page.$$eval('.archivio-autentico-unit-'+n,a=>a.length),1);
  }
  r=await page.goto(base+'/storie-che-mancano/laboratorio-autentico/',{waitUntil:'networkidle0'});assert.equal(r.status(),200);
  assert.equal(await page.$$eval('.source-list li',a=>a.length),4);
  assert.equal(await page.$$eval('.matrix tbody tr',a=>a.length),8);
  assert.equal(await page.$$eval('ol.steps li',a=>a.length),5);
  assert.ok((await page.$eval('.notice',e=>e.textContent)).includes('metadati'));
  r=await page.goto(base+'/storie-che-mancano/caso-modello/valutazione/',{waitUntil:'networkidle0'});assert.equal(r.status(),200);
  assert.ok((await page.$eval('.notice',e=>e.textContent)).includes('77/100'));
  assert.equal(await page.$$eval('.matrix tbody tr',a=>a.length),6);
  assert.equal(await page.$$eval('a[href="../registro-revisione-proposto.json"]',a=>a.length),1);
  const scoreLink=await page.$eval('a[href="../valutazione-dimostrativa.json"]',a=>a.href);
  const scoreResponse=await page.goto(scoreLink,{waitUntil:'domcontentloaded'});assert.equal(scoreResponse.status(),200);
  const reviewPage=await page.goto(base+'/storie-che-mancano/caso-modello/',{waitUntil:'networkidle0'});assert.equal(reviewPage.status(),200);
  assert.equal(await page.$$eval('#valutazione-interna-r01',a=>a.length),1);
  assert.deepEqual(errors,[]);
  console.log('BIOGRAPHY_REVISION_E2E_OK: 4 LOC references, 8 claims, 5 linked units, 77/100 illustrative rubric, revision proposals, navigation and JSON');
 }finally{await browser.close();}
})().catch(e=>{console.error('BIOGRAPHY_REVISION_E2E_FAILED',e);process.exitCode=1;}).finally(()=>server.close());

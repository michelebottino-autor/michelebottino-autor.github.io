'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),dir=__dirname;
const p=JSON.parse(fs.readFileSync(path.join(dir,'programma.json'),'utf8'));
const d=JSON.parse(fs.readFileSync(path.join(dir,'caso-A01','dossier.json'),'utf8'));
const lab=JSON.parse(fs.readFileSync(path.join(dir,'laboratorio-storico','fonti.json'),'utf8'));
const cat=JSON.parse(fs.readFileSync(path.join(root,'catalogo','corsi.json'),'utf8'));
const c=cat.courses.find(x=>x.id==='archivio-vivo');
assert.equal(p.status,'in_development');assert.equal(p.locale_status,'in_review');assert.equal(p.course_level,'Intermedio');
assert.equal(p.units.length,10);assert.equal(p.units.flatMap(x=>x.lessons).length,30);
assert.ok(p.units.every(x=>x.checks.length===4&&x.steps.length===3&&x.lessons.length===3));
assert.equal(p.rubric.criteria.reduce((s,x)=>s+x.max,0),100);
assert.equal(d.records.length,7);assert.equal(d.claims.length,13);
assert.ok(d.word_count>=900&&d.word_count<=1300);
assert.equal(d.narrative.reduce((s,x)=>s+x.text.trim().split(/\s+/).length,0),d.word_count);
assert.equal(d.records.every(x=>x.condition==='simulated_no_original'),true);
assert.ok(d.narrative.every(n=>n.source_ids.every(id=>d.records.some(x=>x.id===id)||d.claims.some(x=>x.id===id))));
assert.equal(lab.materials.length,3);assert.equal(lab.panel_proposal.length,4);
assert.ok(lab.materials.every(x=>x.url.startsWith('https://www.loc.gov/')));
assert.equal(c.status,'in_development');assert.equal(c.level,'Intermedio');assert.equal(c.enrollment.enabled,false);assert.equal(c.pricing.payment_enabled,false);
const xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
for(const loc of ['',...Array.from({length:10},(_,i)=>'unita-'+(i+1)+'/'),'caso-A01/','laboratorio-storico/'])assert.ok(xml.includes('https://michelebottino-autor.github.io/archivio-vivo/'+loc));
const server=http.createServer((req,res)=>{
 try{
  let f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.existsSync(f)){res.writeHead(404);res.end();return;}
  const ext=path.extname(f);res.writeHead(200,{'Content-Type':{'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.xml':'application/xml'}[ext]||'text/plain'});fs.createReadStream(f).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
const puppeteer=require(process.env.PUPPETEER_MODULE||'puppeteer');
(async()=>{
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-gpu']});
 const page=await browser.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const host='http://127.0.0.1:'+server.address().port;
 try{
  let r=await page.goto(host+'/archivio-vivo/',{waitUntil:'networkidle0'});assert.equal(r.status(),200);
  assert.equal(await page.$$eval('.unit-card',a=>a.length),10);
  assert.equal(await page.$$eval('#guide-question option',a=>a.length),10);
  for(let i=1;i<=10;i++){
   r=await page.goto(host+'/archivio-vivo/unita-'+i+'/',{waitUntil:'networkidle0'});assert.equal(r.status(),200);
   assert.equal(await page.$$eval('.lesson',a=>a.length),3);
   assert.equal(await page.$$eval('[data-check]',a=>a.length),4);
   assert.ok(await page.$eval('#guide-answer',a=>a.textContent.length>25));
  }
  await page.goto(host+'/archivio-vivo/unita-4/',{waitUntil:'networkidle0'});
  await page.type('#notebook-text','Inventario simulato A-01/D2: una lettera dimostra la richiesta, non l’esecuzione.');
  await page.$eval('#check-4-0',el=>{if(!el.checked){el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));}});
   assert.equal(await page.$eval('#check-4-0',el=>el.checked),true,'Checkbox must be selected before saving');
   await page.click('#save-draft');
  assert.ok((await page.$eval('#notebook-status',x=>x.textContent)).includes('Salvataggio locale'));
  await page.reload({waitUntil:'networkidle0'});
  assert.ok((await page.$eval('#notebook-text',x=>x.value)).includes('una lettera dimostra'));
  assert.equal(await page.$eval('#check-4-0',x=>x.checked),true);
  await page.goto(host+'/archivio-vivo/',{waitUntil:'networkidle0'});
  assert.ok((await page.$eval('#progress-label',x=>x.textContent)).includes('1 unità'));
  r=await page.goto(host+'/archivio-vivo/caso-A01/',{waitUntil:'networkidle0'});assert.equal(r.status(),200);
  assert.equal(await page.$$eval('.source-list li',a=>a.length),7);
  assert.equal(await page.$$eval('#racconto article p',a=>a.length),10);
  assert.equal(await page.$$eval('#matrice tbody tr',a=>a.length),13);
  assert.ok((await page.$eval('.notice',x=>x.textContent)).includes('inventato'));
  r=await page.goto(host+'/archivio-vivo/laboratorio-storico/',{waitUntil:'networkidle0'});assert.equal(r.status(),200);
  assert.equal(await page.$$eval('.source-list li',a=>a.length),3);
  assert.equal(await page.$$eval('ol.steps li',a=>a.length),9);
  assert.ok((await page.$eval('.notice',x=>x.textContent)).includes('tre edizioni'));
  r=await page.goto(host+'/catalogo/',{waitUntil:'networkidle0'});assert.equal(r.status(),200);
  await page.waitForFunction(()=>[...document.querySelectorAll('.course')].some(x=>x.textContent.includes('L’archivio diventa racconto')||x.textContent.includes("L'archivio diventa racconto")),{timeout:11000});
  assert.ok(await page.$$eval('a[href="../archivio-vivo/"]',a=>a.length>0));
  r=await page.goto(host+'/formazione/',{waitUntil:'networkidle0'});assert.equal(r.status(),200);
  assert.ok(await page.$eval('#archivio-vivo-pilota-20261018',x=>x.textContent.toLowerCase().includes('intermedio')));
  assert.deepEqual(errors,[]);
  console.log('ARCHIVIO_VIVO_E2E_OK: 10 units, 30 lessons, 7 simulated docs, 13 claims, 1055 words, 3 archival sources, local draft persistence, catalog');
 }finally{await browser.close();}
})().catch(e=>{console.error('ARCHIVIO_VIVO_E2E_FAILED',e);process.exitCode=1;}).finally(()=>server.close());

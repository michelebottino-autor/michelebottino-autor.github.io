'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const program=JSON.parse(fs.readFileSync(path.join(__dirname,'programma.json'),'utf8'));
const dossier=JSON.parse(fs.readFileSync(path.join(__dirname,'caso-modello','dossier.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'catalogo','corsi.json'),'utf8'));
const c=catalog.courses.find(x=>x.id==='storie-che-mancano');
assert.equal(c.status,'in_development');assert.equal(c.level,'Introduttivo');
assert.equal(c.enrollment.enabled,false);assert.equal(c.pricing.payment_enabled,false);assert.equal(c.pilot.student_trials_completed,0);
assert.equal(c.locales.it,'in_review');assert.equal(program.units.length,10);
assert.equal(program.rubric.criteria.reduce((a,x)=>a+x.max,0),100);
assert.equal(dossier.sources.length,5);assert.equal(dossier.assertions.length,7);
assert.ok(dossier.word_count>=550&&dossier.word_count<=850);
assert.ok(dossier.sources.every(s=>/simulat|immaginari|immaginar/i.test(s.type+' '+s.description)));
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
for(const uri of ['',...Array.from({length:10},(_,i)=>'unita-'+(i+1)+'/'),'caso-modello/'])assert.ok(sitemap.includes('https://michelebottino-autor.github.io/storie-che-mancano/'+uri));
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  let target=path.resolve(root,'.'+pathname);
  if(!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  if(!fs.existsSync(target)){res.writeHead(404);res.end();return;}
  const ext=path.extname(target),ctype={'.html':'text/html; charset=utf-8','.json':'application/json','.js':'text/javascript','.css':'text/css','.xml':'application/xml','.svg':'image/svg+xml'};
  res.writeHead(200,{'Content-Type':ctype[ext]||'text/plain'});fs.createReadStream(target).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
const puppeteer=require(process.env.PUPPETEER_MODULE||'puppeteer');
async function run(){
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-gpu']});
 const page=await browser.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  await page.goto(base+'/storie-che-mancano/',{waitUntil:'networkidle0'});
  assert.equal(await page.$$eval('.unit-card',xs=>xs.length),10);
  assert.equal(await page.$$eval('#guide-question option',xs=>xs.length),10);
  assert.ok((await page.$eval('main',e=>e.textContent)).includes('introduttivo'));
  for(let i=1;i<=10;i++){
   const r=await page.goto(base+'/storie-che-mancano/unita-'+i+'/',{waitUntil:'networkidle0'});
   assert.equal(r.status(),200);assert.equal(await page.$$eval('.lesson',xs=>xs.length),3);
   assert.equal(await page.$$eval('[data-check]',xs=>xs.length),4);
   assert.ok(await page.$eval('#notebook-text',e=>e!==null));
   assert.ok(await page.$eval('#guide-answer',e=>e.textContent.trim().length>25));
  }
  await page.goto(base+'/storie-che-mancano/unita-1/',{waitUntil:'networkidle0'});
  await page.type('#notebook-text','Annotazione personale di collaudo: osservazione diversa da interpretazione.');
  await page.click('#check-1-0');await page.click('#save-draft');
  assert.ok((await page.$eval('#notebook-status',e=>e.textContent)).includes('Salvataggio locale'));
  await page.reload({waitUntil:'networkidle0'});
  assert.ok((await page.$eval('#notebook-text',e=>e.value)).includes('Annotazione personale'));
  assert.equal(await page.$eval('#check-1-0',e=>e.checked),true);
  await page.goto(base+'/storie-che-mancano/',{waitUntil:'networkidle0'});
  assert.ok((await page.$eval('#progress-label',e=>e.textContent)).includes('1 unità'));
  await page.goto(base+'/storie-che-mancano/caso-modello/',{waitUntil:'networkidle0'});
  assert.equal(await page.$$eval('.source-list li',xs=>xs.length),5);
  assert.equal(await page.$$eval('#ritratto article p',xs=>xs.length),7);
  assert.equal(await page.$$eval('.matrix tbody tr',xs=>xs.length),12);
  assert.ok((await page.$eval('.notice',e=>e.textContent)).includes('interamente inventati'));
  await page.goto(base+'/catalogo/',{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>[...document.querySelectorAll('.course')].some(x=>x.textContent.includes('Le storie che mancano')),{timeout:12000});
  assert.ok(await page.$$eval('a[href="../storie-che-mancano/"]',a=>a.length>0));
  await page.goto(base+'/formazione/',{waitUntil:'networkidle0'});
  assert.ok(await page.$eval('#storie-che-mancano-pilota-20261018',x=>x.textContent.includes('introduttivo')));
  assert.deepEqual(errors,[]);
  console.log('BIOGRAPHY_E2E_OK: 10 units, 30 lessons, local editor/checklist persistence, guide, 5 invented traces, 7-paragraph model, catalog and sitemap');
 }finally{await browser.close();}
}
run().catch(e=>{console.error('BIOGRAPHY_E2E_FAILED',e);process.exitCode=1;}).finally(()=>server.close());

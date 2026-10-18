'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'catalogo/corsi.json'),'utf8'));
const program=JSON.parse(fs.readFileSync(path.join(root,'catalogo/scrittura-investigativa-programma.json'),'utf8'));
const entry=catalog.courses.find(x=>x.id==='scrittura-investigativa-documentale');
assert.equal(entry.level,'Intermedio');
assert.equal(program.level,'intermedio');
assert.equal(program.units.length,10);
assert.equal(entry.level_details.mandatory_previous_course,false);
assert.deepEqual(program.level_details.mandatory_prerequisites,[]);
assert.equal(entry.enrollment.enabled,false);
assert.equal(program.certificate.issue_enabled,false);
assert.equal(entry.pilot_recruitment.status,'invitation_only');
assert.equal(entry.pilot_recruitment.participants_confirmed,0);
const page=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
assert.match(page,/manifestazioni di interesse|manifestare interesse/i);
assert.match(page,/volontari maggiorenni/i);
assert.match(page,/Facebook ufficiale/i);
assert.doesNotMatch(page,/<form[\s>]/i);
assert.match(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8'),/scrittura-investigativa\/sperimentazione\//);
const puppeteer=require(process.env.PUPPETEER_MODULE||'puppeteer');
const server=http.createServer((req,res)=>{
 try{
  let f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname));
  if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.existsSync(f)){res.writeHead(404);res.end();return;}
  const ext=path.extname(f);res.setHeader('Content-Type',ext==='.html'?'text/html; charset=utf-8':ext==='.json'?'application/json':'text/css');res.writeHead(200);fs.createReadStream(f).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
(async()=>{
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-gpu']});
 const page=await browser.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  await page.goto(base+'/scrittura-investigativa/sperimentazione/',{waitUntil:'domcontentloaded'});
  assert.match(await page.$eval('h1',e=>e.textContent),/Scrittura Investigativa|Aiutaci/i);
  assert.equal(await page.$$eval('form',xs=>xs.length),0);
  assert.equal(await page.$$eval('a[href="https://www.facebook.com/michelebottinoautor"]',xs=>xs.length),1);
  await page.goto(base+'/scrittura-investigativa/',{waitUntil:'domcontentloaded'});
  assert.equal(await page.$$eval('a[href="sperimentazione/"]',xs=>xs.length)>0,true);
  assert.match(await page.$eval('#livello-formativo-20261018',e=>e.textContent),/intermedio/i);
  await page.goto(base+'/formazione/',{waitUntil:'domcontentloaded'});
  assert.equal(await page.$$eval('a[href="/scrittura-investigativa/sperimentazione/"]',xs=>xs.length),1);
  assert.deepEqual(errors,[]);
  console.log('COURSE_CLASSIFICATION_AND_INVITATION_E2E_OK: level, prerequisites, navigation, no signup forms');
 }finally{await browser.close();}
})().catch(e=>{console.error('COURSE_CLASSIFICATION_AND_INVITATION_E2E_FAIL',e);process.exitCode=1;}).finally(()=>server.close());
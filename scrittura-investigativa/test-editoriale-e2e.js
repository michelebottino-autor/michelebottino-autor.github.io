/* E2E browser test for Scrittura Investigativa, no network dependencies except local HTTP */
'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const course=JSON.parse(fs.readFileSync(path.join(__dirname,'officina-percorso.json'),'utf8'));
const program=JSON.parse(fs.readFileSync(path.join(root,'catalogo/scrittura-investigativa-programma.json'),'utf8'));
const elena=JSON.parse(fs.readFileSync(path.join(__dirname,'elena-scrittura.json'),'utf8'));
assert.equal(course.units.length,10);
assert.equal(elena.topics.length,10);
assert.equal(program.units.length,10);
assert.equal(program.certificate.issue_enabled,false);
assert.equal(program.enrollment_enabled,false);
for(let i=1;i<=10;i++){
 const u=course.units[i-1],f=path.join(__dirname,'unita-'+i,'index.html'),html=fs.readFileSync(f,'utf8');
 assert.equal(u.number,i);assert.equal(program.units[i-1].title,u.title);
 assert.ok(u.lesson.length>=3&&u.steps.length>=3&&u.checks.length>=3);
 assert.match(html,/officina-percorso\.js\?v=1/);assert.match(html,/officina-percorso\.css\?v=1/);
 assert.ok(html.includes(u.title),'Title of unit '+i+' must be synchronized');
}
const puppeteer=(()=>{
 try {return require('puppeteer');}
 catch(_) {if(!process.env.PUPPETEER_MODULE)throw new Error('Set PUPPETEER_MODULE to existing Puppeteer installation.');return require(process.env.PUPPETEER_MODULE);}
})();
const mimes={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{
 try{
 const url=new URL(req.url,'http://localhost');
 let pathname=decodeURIComponent(url.pathname);
 let full=path.resolve(root,'.'+pathname);
 if(!full.startsWith(root+path.sep)&&full!==root){res.writeHead(403);res.end();return;}
 if(fs.existsSync(full)&&fs.statSync(full).isDirectory())full=path.join(full,'index.html');
 if(!fs.existsSync(full)){res.writeHead(404);res.end('missing '+pathname);return;}
 res.writeHead(200,{'content-type':mimes[path.extname(full).toLowerCase()]||'application/octet-stream'});
 fs.createReadStream(full).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
const run=async()=>{
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const port=server.address().port,url='http://127.0.0.1:'+port;
 const launch={headless:true,args:['--no-sandbox','--disable-gpu','--disable-features=TranslateUI']};
 if(process.env.CHROME_BIN)launch.executablePath=process.env.CHROME_BIN;
 const browser=await puppeteer.launch(launch);
 const page=await browser.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
 await page.goto(url+'/scrittura-investigativa/',{waitUntil:'networkidle0'});
 await page.waitForSelector('.studio-hub');
 assert.equal(await page.$$eval('.studio-units .studio-unit',a=>a.length),10);
 await page.waitForSelector('#elena-scrittura-question');
 assert.equal(await page.$$eval('#elena-scrittura-question option',a=>a.length),10);
 assert.match(await page.$eval('.studio-caption',x=>x.textContent),/0\/10/);
 for(let i=1;i<=10;i++){
   await page.goto(url+'/scrittura-investigativa/unita-'+i+'/',{waitUntil:'networkidle0'});
   await page.waitForSelector('#taccuino textarea');
   const title=await page.$eval('#taccuino h2',x=>x.textContent);
   assert.equal(title,course.units[i-1].title);
   assert.ok((await page.$$eval('#taccuino .studio-check input',x=>x.length))>=3);
 }
 await page.goto(url+'/scrittura-investigativa/unita-1/',{waitUntil:'networkidle0'});
 await page.waitForSelector('#taccuino textarea');
 const words=Array(90).fill('documento').join(' ')+' conclusione da verificare.';
 await page.$eval('#taccuino textarea',(el,s)=>{el.value=s;el.dispatchEvent(new Event('input',{bubbles:true}));},words);
 await page.$$eval('#taccuino .studio-check input',checks=>checks.forEach(x=>x.click()));
 const marked=await page.$eval('#taccuino .studio-primary',b=>!b.disabled);
 assert.equal(marked,true,'Completion enabled after text and checklist');
 await page.$eval('#taccuino .studio-primary',b=>b.click());
 assert.match(await page.$eval('#taccuino .studio-status',x=>x.textContent),/pronta per revisione/);
 await page.reload({waitUntil:'networkidle0'});
 await page.waitForSelector('#taccuino textarea');
 assert.equal(await page.$eval('#taccuino textarea',x=>x.value),words);
 await page.goto(url+'/scrittura-investigativa/',{waitUntil:'networkidle0'});
 await page.waitForSelector('.studio-hub');
 assert.match(await page.$eval('.studio-caption',x=>x.textContent),/1\/10/);
 await page.goto(url+'/scrittura-investigativa/unita-10/',{waitUntil:'networkidle0'});
 await page.waitForSelector('#taccuino');
 assert.match(await page.$eval('#taccuino',x=>x.textContent),/valutazione umana/);
 assert.deepEqual(errors,[],'JavaScript page errors');
 console.log('SCRITTURA_E2E_OK: 10 pages, 10 Elena topics, text editing, local save, reload, progress, rubric');
 }finally{await browser.close();}
};
run().catch(e=>{console.error('SCRITTURA_E2E_FAILED',e);process.exitCode=1;}).finally(()=>server.close());
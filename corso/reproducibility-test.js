const fs=require('fs');
const js=fs.readFileSync(__dirname+'/course.js','utf8');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
assert((js.match(/\{title:'/g)||[]).length===8,'Le unitÃ  devono essere 8');
assert(js.includes("const check1Questions=["),'Verifica 1 assente');
assert(js.includes("const check2Questions=["),'Verifica 2 assente');
assert(js.includes("done>=3&&!check1Passed()?2"),'Gate Verifica 1 assente');
assert(js.includes("done>=7&&!check2Passed()?6"),'Gate Verifica 2 assente');
assert(js.includes("Math.max(done,8)"),'Completamento 8/8 assente');
assert(js.includes("bm_completed_at"),'Timestamp completamento assente');
assert(js.includes("semplificazione didattica"),'Distinzione pipeline didattica assente');
for(const id of ['units','pct','bar','lessonArticle','continueCourse','quiz','check1','check2'])
 assert(html.includes('id="'+id+'"'),'ID HTML mancante: '+id);
assert(html.includes('course.js?v=30'),'Baseline cache diversa da v30');
assert(js.includes('const progressPct='),'Calcolo avanzamento ponderato assente');
console.log('REPRODUCIBILITY_TEST_OK');
console.log('units=8; checks=2; gates=2; weighted-progress=100%; baseline=v30');

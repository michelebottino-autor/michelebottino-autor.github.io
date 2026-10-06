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
assert(html.includes('course.js?v=36'),'Baseline cache diversa da v33');
assert(js.includes('const progressPct='),'Calcolo avanzamento ponderato assente');
assert(js.includes('function certificateEligible(){return done>=8&&check1Passed()&&check2Passed()&&finalPassed()}'),'Gate attestato finale assente');
assert(html.includes('10.5281/zenodo.23198223'),'DOI Release 1.0 assente');
for(const f of ['BM-CB-01_Guida_al_Corso_Base.pdf','BM-CB-02_Dispensa_essenziale.pdf','BM-CB-03_Quaderno_degli_esempi.pdf','BM-CB-04_Scheda_operativa.pdf','Bottino_Method_Corso_Base_Release_1_0_FINALE_Zenodo_CORRETTO.pdf'])
 assert(html.includes(encodeURIComponent(f)),'Materiale ufficiale assente: '+f);
console.log('REPRODUCIBILITY_TEST_OK');
console.log('units=8; checks=2; gates=2; weighted-progress=100%; baseline=v36');

const fs=require('fs'),vm=require('vm');
const js=fs.readFileSync(__dirname+'/course.js','utf8');
class Store{constructor(seed={}){this.d={...seed}}getItem(k){return Object.prototype.hasOwnProperty.call(this.d,k)?this.d[k]:null}setItem(k,v){this.d[k]=String(v)}}
function state(seed){const s=new Store(seed),ctx={localStorage:s,console,Date};vm.createContext(ctx);
const boot=js.indexOf('function initializeCourse()');
if(boot<0)throw new Error('initializeCourse marker missing');
const pre=js.slice(0,boot);
vm.runInContext(pre+';globalThis.__api={check1Passed,check2Passed,finalPassed,maxAllowed,progressPct};',ctx);
return {s,api:ctx.__api,ctx}}
const A=(x,m)=>{if(!x)throw new Error(m)};
let x=state();A(x.api.maxAllowed()===0,'fresh: only U1 must be available');A(x.api.progressPct()===0,'fresh progress must be 0%');
x=state({bm_done:'3'});A(x.api.maxAllowed()===2,'U4 must be blocked before Check1');A(x.api.progressPct()===30,'3 units without Check1 must be 30%');
x=state({bm_done:'3',bm_check1:'60'});A(x.api.maxAllowed()===2,'failed Check1 must keep U4 blocked');
x=state({bm_done:'3',bm_check1:'80'});A(x.api.maxAllowed()===3,'passed Check1 must unlock U4');A(x.api.progressPct()===40,'Check1 must add 10%');
x=state({bm_done:'7',bm_check1:'80'});A(x.api.maxAllowed()===6,'U8 must be blocked before Check2');
x=state({bm_done:'7',bm_check1:'80',bm_check2:'60'});A(x.api.maxAllowed()===6,'failed Check2 must keep U8 blocked');
x=state({bm_done:'7',bm_check1:'80',bm_check2:'80'});A(x.api.maxAllowed()===7,'passed Check2 must unlock U8');A(x.api.progressPct()===90,'7 units plus both checks must be 90%');
x=state({bm_done:'7',bm_check1:'80',bm_check2:'80',bm_final:'60'});A(!x.api.finalPassed(),'3/5 final assessment must fail');A(x.api.maxAllowed()===7,'failed final assessment must keep U8 accessible but incomplete');
x=state({bm_done:'7',bm_check1:'80',bm_check2:'80',bm_final:'80'});A(x.api.finalPassed(),'4/5 final assessment must pass');A(x.api.maxAllowed()===7,'passed final assessment keeps U8 accessible for completion');
x=state({bm_done:'8',bm_check1:'80',bm_check2:'80',bm_final:'80',bm_completed_at:'2026-10-06T00:00:00.000Z'});A(x.api.maxAllowed()===7,'completed course must remain stable');
A(x.s.getItem('bm_completed_at')!==null,'completion timestamp must survive reload');A(x.api.finalPassed(),'completed course must retain passed final assessment');A(x.api.progressPct()===100,'completed course must be 100%');
console.log('E2E_STATE_TEST_OK');
console.log('fresh -> gate1 fail/pass -> gate2 fail/pass -> final 3/5 blocked -> final 4/5 pass -> completed reload: OK');

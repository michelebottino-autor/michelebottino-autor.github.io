[Reading 19 lines from start (total: 19 lines, 0 remaining)]

const fs=require('fs'),vm=require('vm');
const js=fs.readFileSync(__dirname+'/course.js','utf8');
class Store{constructor(seed={}){this.d={...seed}}getItem(k){return Object.prototype.hasOwnProperty.call(this.d,k)?this.d[k]:null}setItem(k,v){this.d[k]=String(v)}}
function state(seed){const s=new Store(seed),ctx={localStorage:s,console,Date};vm.createContext(ctx);
const pre=js.slice(0,js.indexOf('render();openLesson(current);'));
vm.runInContext(pre+';globalThis.__api={check1Passed,check2Passed,maxAllowed};',ctx);
return {s,api:ctx.__api}}
const A=(x,m)=>{if(!x)throw new Error(m)};
let x=state();A(x.api.maxAllowed()===0,'fresh: only U1 must be available');
x=state({bm_done:'3'});A(x.api.maxAllowed()===2,'U4 must be blocked before Check1');
x=state({bm_done:'3',bm_check1:'60'});A(x.api.maxAllowed()===2,'failed Check1 must keep U4 blocked');
x=state({bm_done:'3',bm_check1:'80'});A(x.api.maxAllowed()===3,'passed Check1 must unlock U4');
x=state({bm_done:'7',bm_check1:'80'});A(x.api.maxAllowed()===6,'U8 must be blocked before Check2');
x=state({bm_done:'7',bm_check1:'80',bm_check2:'60'});A(x.api.maxAllowed()===6,'failed Check2 must keep U8 blocked');
x=state({bm_done:'7',bm_check1:'80',bm_check2:'80'});A(x.api.maxAllowed()===7,'passed Check2 must unlock U8');
x=state({bm_done:'8',bm_check1:'80',bm_check2:'80',bm_completed_at:'2026-10-06T00:00:00.000Z'});A(x.api.maxAllowed()===7,'completed course must remain stable');
A(x.s.getItem('bm_completed_at')!==null,'completion timestamp must survive reload');
console.log('E2E_STATE_TEST_OK');
console.log('fresh -> gate1 fail/pass -> gate2 fail/pass -> U8 -> completed reload: OK');

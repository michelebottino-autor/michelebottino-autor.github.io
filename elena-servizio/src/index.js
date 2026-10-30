// Elena ADC: consultazione documentaria solo di risposte editorialmente approvate.
// Distribuzione Cloudflare Workers. Nessuna inferenza automatica sulle fonti.
const ORIGIN='https://michelebottino-autor.github.io';
const APPROVED=ORIGIN+'/adc/assets/elena-risposte-approvate.json';
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const safePath=u=>typeof u==='string'&&/^\/adc\/[a-z0-9/_-]*(?:\.html)?$/i.test(u);
const evidenceStates=new Set(['SOURCE_IDENTIFIED','EDITION_TEXT_CHECKED','IMAGE_COLLATED','ORIGINAL_COLLATED']);
const valid=a=>a&&a.status==='APPROVED_FOR_PUBLICATION'
 && evidenceStates.has(a.evidence_status)
 && typeof a.evidence_limitations==='string'
 && typeof a.question==='string'&&a.question.trim()
 && typeof a.answer==='string'&&a.answer.trim()
 && typeof a.reviewer==='string'&&a.reviewer.trim()
 && typeof a.reviewed_at==='string'&&a.reviewed_at.trim()
 && typeof a.review_rationale==='string'&&a.review_rationale.trim()
 && Array.isArray(a.sources)&&a.sources.length>0
 && a.sources.every(x=>x&&safePath(x.url)&&typeof x.title==='string'&&x.title.trim()
 && typeof x.page==='string'&&x.page.trim()
 && typeof x.source_type==='string'&&x.source_type.trim());

function json(body,status=200){return new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','access-control-allow-origin':ORIGIN,'vary':'Origin'}})}
export default {
 async fetch(request,env){
  const origin=request.headers.get('Origin');
  if(origin&&origin!==ORIGIN)return json({error:'Origine non consentita'},403);
  const url=new URL(request.url);
  if(url.pathname!=='/api/elena'){return json({error:'Percorso non disponibile'},404)}
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{'access-control-allow-origin':ORIGIN,'access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'content-type','access-control-max-age':'600'}});
  if(request.method!=='POST')return json({error:'Metodo non consentito'},405);
  const size=Number(request.headers.get('content-length')||0);
  if(size>2048)return json({error:'Richiesta troppo grande'},413);
  let query;
  try{const raw=await request.text();if(raw.length>2048)return json({error:'Richiesta troppo grande'},413);const payload=JSON.parse(raw);query=payload?.question}catch{return json({error:'JSON non valido'},400)}
  if(typeof query!=='string'||!query.trim()||query.length>160)return json({error:'Domanda non valida'},400);
  // Il token opzionale protegge l'accesso amministrativo, non va incorporato nel frontend pubblico.
  if(env.ELENA_PRIVATE_TOKEN){
    if(request.headers.get('Authorization')!=='Bearer '+env.ELENA_PRIVATE_TOKEN)return json({error:'Non autorizzato'},401);
  }
  let entries=[];
  try{
    const res=await fetch(APPROVED,{headers:{accept:'application/json'},cf:{cacheTtl:60}});
    if(!res.ok)throw Error('Fonte non disponibile');
    const data=await res.json();
    if(!Array.isArray(data?.answers))throw Error('Formato non valido');
    entries=data.answers;
  }catch{return json({kind:'unavailable',answer:'Le risposte documentarie non sono disponibili in questo momento.',sources:[]},503)}
  const found=entries.find(a=>valid(a)&&normalize(a.question)===normalize(query));
  if(!found)return json({kind:'unverified',answer:'Non è disponibile una risposta verificata per questa domanda. Consulta le schede pubbliche dell’ADC.',sources:[]});
  return json({kind:'documentary',answer:found.answer,sources:found.sources.map(s=>({title:s.title,page:s.page,url:s.url})),reviewed_at:found.reviewed_at,evidence_status:found.evidence_status,evidence_limitations:found.evidence_limitations});
 }
};

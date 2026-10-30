// Contatore ADC indipendente da Google: Cloudflare Worker + D1.
// Base iniziale 2000, poi incremento atomico di una visita per sessione.
const ORIGIN='https://michelebottino-autor.github.io';
const headers={'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type','Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8'};
const respond=(value,status=200)=>new Response(JSON.stringify(value),{status,headers});
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname!=='/visite')return respond({error:'Not found'},404);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(!['GET','POST'].includes(request.method))return respond({error:'Method not allowed'},405);
  if(request.method==='POST'&&request.headers.get('Origin')!==ORIGIN)return respond({error:'Origin not allowed'},403);
  if(!env.DB)return respond({error:'Database not configured'},503);
  try{
   if(request.method==='POST'){
    const result=await env.DB.prepare("UPDATE visits SET total = total + 1 WHERE id = 'adc' RETURNING total").first();
    if(!result)return respond({error:'Database not initialized'},503);
    return respond({total:Number(result.total)});
   }
   const result=await env.DB.prepare("SELECT total FROM visits WHERE id = 'adc'").first();
   if(!result)return respond({error:'Database not initialized'},503);
   return respond({total:Number(result.total)});
  }catch{return respond({error:'Counter unavailable'},503)}
 }
};

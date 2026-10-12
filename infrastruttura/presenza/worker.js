// Cloudflare Worker + Durable Object: ephemeral per-page presence.
// Deploy separately; never publish a private token in GitHub Pages.
const SITE='https://michelebottino-autor.github.io';
const TTL=110000;
export default {
 async fetch(request,env){
  const origin=request.headers.get('Origin');
  const headers={'Access-Control-Allow-Origin':SITE,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Cache-Control':'no-store','Vary':'Origin'};
  if(origin!==SITE)return new Response('Forbidden',{status:403});
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(request.method!=='POST'||new URL(request.url).pathname!=='/presence')return new Response('Not found',{status:404,headers});
  if(Number(request.headers.get('Content-Length')||0)>1024)return new Response('Too large',{status:413,headers});
  let payload;try{payload=await request.json()}catch(_){return new Response('Bad request',{status:400,headers})}
  if(!payload||typeof payload.page!=='string'||!/^\/[a-z0-9/_-]{0,180}$/i.test(payload.page)||typeof payload.id!=='string'||!/^[a-f0-9-]{32,36}$/i.test(payload.id))return new Response('Bad request',{status:400,headers});
  const key=payload.page;const stub=env.PRESENCE.get(env.PRESENCE.idFromName(key));
  const res=await stub.fetch('https://presence.internal/',{method:'POST',body:JSON.stringify({id:payload.id})});
  return new Response(res.body,{status:res.status,headers:{...headers,'Content-Type':'application/json; charset=utf-8'}});
 }
};
export class Presence {
 constructor(state){this.state=state;this.active=new Map()}
 async fetch(request){
  if(request.method!=='POST')return new Response('Not allowed',{status:405});
  const {id}=await request.json();const now=Date.now();
  for(const [key,time] of this.active){if(now-time>TTL)this.active.delete(key)}
  // One ephemeral random browser-tab token; no IP, names, cookies, user-agent, or history.
  this.active.set(id,now);
  return Response.json({count:this.active.size},{headers:{'Cache-Control':'no-store'}});
 }
}

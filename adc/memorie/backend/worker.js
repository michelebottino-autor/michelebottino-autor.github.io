// ADC Memorie — Cloudflare Worker con database D1 privato.
// Configurare DB, ADMIN_TOKEN, RATE_SALT, TURNSTILE_SECRET prima della pubblicazione.
const ORIGIN='https://michelebottino-autor.github.io';
const json=(body,status=200,origin='')=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json;charset=utf-8','cache-control':'no-store',...(origin?{'access-control-allow-origin':origin,'vary':'Origin'}:{})}});
const valid=(value,max)=>typeof value==='string'&&value.trim().length<=max;
const clean=(value)=>String(value||'').trim();
async function gate(request,env){
  const ip=request.headers.get('CF-Connecting-IP')||'';
  const day=new Date().toISOString().slice(0,10);
  if(!ip||!env.RATE_SALT)return false;
  const data=new TextEncoder().encode(env.RATE_SALT+':'+day+':'+ip);
  const sum=await crypto.subtle.digest('SHA-256',data);
  const key=day+':'+Array.from(new Uint8Array(sum)).map(x=>x.toString(16).padStart(2,'0')).join('');
  await env.DB.prepare('INSERT INTO richieste_giornaliere(id,numero,scadenza) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET numero=numero+1').bind(key,day+'T23:59:59Z').run();
  const row=await env.DB.prepare('SELECT numero FROM richieste_giornaliere WHERE id=?').bind(key).first();
  return row&&row.numero<=3;
}
async function captcha(request,env,token){
  if(!env.TURNSTILE_SECRET || !token)return false;
  const form=new FormData();
  form.append('secret',env.TURNSTILE_SECRET);form.append('response',token);
  const ip=request.headers.get('CF-Connecting-IP');
  if(ip)form.append('remoteip',ip);
  const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form});
  if(!r.ok)return false;
  const data=await r.json();
  return data.success===true && data.hostname==='michelebottino-autor.github.io';
}
function admin(request,env){
  if(!env.ADMIN_TOKEN || env.ADMIN_TOKEN.length<32)return false;
  const value=request.headers.get('authorization')||'';
  if(!value.startsWith('Bearer '))return false;
  const received=new TextEncoder().encode(value.slice(7)),expected=new TextEncoder().encode(env.ADMIN_TOKEN);
  if(received.length!==expected.length)return false;
  let mismatch=0;for(let i=0;i<received.length;i++)mismatch|=received[i]^expected[i];
  return mismatch===0;
}
export default {
 async fetch(request,env){
  const origin=request.headers.get('Origin')||'';
  const allow=origin===ORIGIN?ORIGIN:'';
  const url=new URL(request.url);
  if(!env.DB)return json({error:'Archivio non configurato'},503,allow);
  if(!env.ADMIN_TOKEN||!env.RATE_SALT||!env.TURNSTILE_SECRET)return json({error:'Servizio non ancora configurato'},503,allow);
  if(origin && origin!==ORIGIN)return json({error:'Origine non ammessa'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{'access-control-allow-origin':ORIGIN,'access-control-allow-methods':'GET,POST,PATCH,DELETE,OPTIONS','access-control-allow-headers':'Content-Type,Authorization','access-control-max-age':'3600'}});
  try{
   if(url.pathname==='/v1/health'&&request.method==='GET')return json({status:'ready'},200,allow);
   if(url.pathname==='/v1/memorie'&&request.method==='POST'){
    if(origin!==ORIGIN)return json({error:'Invio consentito solo dal sito ADC'},403,allow);
    if(Number(request.headers.get('content-length')||0)>65000)return json({error:'Testo troppo lungo'},413,allow);
    if(!(request.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))return json({error:'Formato non supportato'},415,allow);
    const d=await request.json();
    if(!d||typeof d!=='object'||Array.isArray(d)||d.website||!valid(d.title,140)||!valid(d.story,20000)||clean(d.story).length<30||!valid(d.period,100)||!valid(d.place,180)||!valid(d.attribution,100)||!valid(d.private_contact,180)||!['non_autorizzata','nome','anonima'].includes(d.publication)||d.consent!==true)return json({error:'Controlla il racconto e le autorizzazioni'},400,allow);
    if(d.publication==='nome'&&!clean(d.attribution))return json({error:'Indica il nome o scegli anonimato'},400,allow);
    if(d.private_contact&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.private_contact))return json({error:'Recapito email non valido'},400,allow);
    if(!await captcha(request,env,d.turnstile_token))return json({error:'Verifica antispam non completata'},403,allow);
    if(!await gate(request,env))return json({error:'Limite di invii raggiunto per oggi'},429,allow);
    const id='ADC-MEM-'+crypto.randomUUID(),now=new Date().toISOString();
    await env.DB.prepare(`INSERT INTO testimonianze(id,created_at,updated_at,titolo,periodo,luogo,racconto,attribuzione,recapito,scelta_pubblicazione,consenso_condivisione)
       VALUES(?,?,?,?,?,?,?,?,?,?,1)`).bind(id,now,now,clean(d.title),clean(d.period),clean(d.place),clean(d.story),d.publication==='nome'?clean(d.attribution):'',clean(d.private_contact),d.publication).run();
    return json({id,status:'ricevuta',message:'Testimonianza ricevuta per la valutazione, non pubblicata.'},201,allow);
   }
   if(url.pathname==='/v1/pubbliche'&&request.method==='GET'){
     const rows=await env.DB.prepare("SELECT id,titolo,periodo,luogo,testo_pubblico,CASE WHEN scelta_pubblicazione='nome' THEN attribuzione ELSE '' END AS autore,pubblicata_at FROM testimonianze WHERE stato='pubblicata' AND scelta_pubblicazione IN ('nome','anonima') AND testo_pubblico IS NOT NULL ORDER BY pubblicata_at DESC LIMIT 100").all();
     return json({entries:rows.results||[]},200,allow);
   }
   if(url.pathname.startsWith('/v1/redazione/')){
    if(!admin(request,env))return json({error:'Non autorizzato'},401,allow);
    if(url.pathname==='/v1/redazione/elenco'&&request.method==='GET'){
     const rows=await env.DB.prepare('SELECT id,created_at,titolo,periodo,luogo,scelta_pubblicazione,stato FROM testimonianze ORDER BY created_at DESC LIMIT 100').all();
     return json({entries:rows.results||[]},200,allow);
    }
    const id=url.pathname.slice('/v1/redazione/'.length);
    if(!/^ADC-MEM-[a-f0-9-]{36}$/i.test(id))return json({error:'ID non valido'},400,allow);
    if(request.method==='GET'){
     const row=await env.DB.prepare('SELECT * FROM testimonianze WHERE id=?').bind(id).first();
     return row?json(row,200,allow):json({error:'Non trovato'},404,allow);
    }
    if(request.method==='DELETE'){
     await env.DB.prepare('DELETE FROM testimonianze WHERE id=?').bind(id).run();
     return json({status:'eliminata'},200,allow);
    }
    if(request.method==='PATCH'){
     if(!(request.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))return json({error:'Formato non supportato'},415,allow);
     const d=await request.json(),stato=clean(d.stato);
     if(!['in_revisione','approvata','pubblicata','ritirata','respinta'].includes(stato)||!valid(d.note_redazionali||'',5000)||!valid(d.testo_pubblico||'',20000))return json({error:'Dati non validi'},400,allow);
     const existing=await env.DB.prepare('SELECT scelta_pubblicazione,stato FROM testimonianze WHERE id=?').bind(id).first();
     if(!existing)return json({error:'Non trovato'},404,allow);
     if(stato==='approvata'&&(existing.scelta_pubblicazione==='non_autorizzata'||!['ricevuta','in_revisione'].includes(existing.stato)))return json({error:'Approvazione non consentita'},409,allow);
     if(stato==='pubblicata'&&(existing.scelta_pubblicazione==='non_autorizzata'||existing.stato!=='approvata'||!clean(d.testo_pubblico)))return json({error:'Pubblicazione vietata: manca il consenso o l’approvazione preventiva'},409,allow);
     if(['ritirata','respinta'].includes(existing.stato))return json({error:'Testimonianza ritirata o respinta: non modificabile'},409,allow);
     await env.DB.prepare('UPDATE testimonianze SET stato=?,note_redazionali=?,testo_pubblico=?,pubblicata_at=?,updated_at=? WHERE id=?')
      .bind(stato,clean(d.note_redazionali||''),stato==='pubblicata'?clean(d.testo_pubblico):null,stato==='pubblicata'?new Date().toISOString():null,new Date().toISOString(),id).run();
     return json({id,stato},200,allow);
    }
   }
   return json({error:'Percorso non disponibile'},404,allow);
  }catch(e){return json({error:'Richiesta non completata'},500,allow);}
 }
};
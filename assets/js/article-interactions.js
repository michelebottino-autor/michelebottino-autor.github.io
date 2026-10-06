(()=>{"use strict";
const root=document.querySelector("[data-article-reactions]");if(!root)return;
const slug=root.dataset.articleSlug;const status=root.querySelector("[data-reaction-status]");const buttons=[...root.querySelectorAll("[data-reaction]")];
const cfg=window.MB_INTERACTIONS||{};let client=null;
const setStatus=m=>{if(status)status.textContent=m};
const setDisabled=v=>buttons.forEach(b=>b.disabled=v);
const paint=(counts,myVote)=>buttons.forEach(b=>{const v=b.dataset.reaction;b.setAttribute("aria-pressed",String(v===myVote));const n=b.querySelector("[data-count]");if(n)n.textContent=String(counts[v]||0)});
async function load(){
 if(!slug){setDisabled(true);return setStatus("Identificativo articolo non disponibile.");}
 if(!cfg.supabaseUrl||!cfg.supabaseKey||!window.supabase){setDisabled(true);return setStatus("Reazioni in attivazione.");}
 try{client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseKey);const device=getDevice();
 const [{data:c,error:ce},{data:v,error:ve}]=await Promise.all([
 client.rpc("article_reaction_counts",{p_article_slug:slug}),
 client.from("article_reactions").select("reaction").eq("article_slug",slug).eq("device_id",device).maybeSingle()
 ]);if(ce)throw ce;if(ve)throw ve;const counts={like:0,dislike:0};(c||[]).forEach(r=>counts[r.reaction]=Number(r.total)||0);paint(counts,v?.reaction||null);setDisabled(false);setStatus("");
 }catch(e){console.error("Article reactions:",e);setDisabled(true);setStatus("Reazioni temporaneamente non disponibili.");}}
function getDevice(){const k="mb-reaction-device";let v=localStorage.getItem(k);if(!v){v=(crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random().toString(16).slice(2));localStorage.setItem(k,v)}return v}
buttons.forEach(b=>b.addEventListener("click",async()=>{if(!client)return;setDisabled(true);try{const {data,error}=await client.rpc("set_article_reaction",{p_article_slug:slug,p_device_id:getDevice(),p_reaction:b.dataset.reaction});if(error)throw error;const counts={like:0,dislike:0};(data||[]).forEach(r=>counts[r.reaction]=Number(r.total)||0);paint(counts,b.dataset.reaction);setStatus("Reazione registrata.");}catch(e){console.error("Article reactions:",e);setStatus("Non è stato possibile registrare la reazione.");}finally{setDisabled(false)}}));
load();
})();
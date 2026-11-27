(()=>{'use strict';
const $=id=>document.getElementById(id),tools=$('reader-tools'),list=$('reader-list'),status=$('reader-status'),fallback=$('reader-fallback');
if(!tools||!list||!status||!fallback)return;
const key='mb-reader-state-v1';let articles=[],state={saved:[],read:[]},storageOK=true;
try{const raw=localStorage.getItem(key);if(raw){const s=JSON.parse(raw);state={saved:Array.isArray(s.saved)?s.saved.filter(x=>typeof x==='string'):[],read:Array.isArray(s.read)?s.read.filter(x=>typeof x==='string'):[]};}}catch{storageOK=false;}
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
function store(){try{localStorage.setItem(key,JSON.stringify(state));}catch{storageOK=false;status.textContent='Le preferenze restano disponibili solo per questa sessione.';}}
function node(tag,text,cls){const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;}
function toggle(type,url){const a=state[type],i=a.indexOf(url);if(i===-1)a.push(url);else a.splice(i,1);store();render();}
function render(){
 const q=norm($('reader-search').value),filter=$('reader-filter').value;
 const visible=articles.filter(a=>(!q||norm(a.title+' '+a.desc+' '+a.category).includes(q))&&(filter==='all'||(filter==='saved'&&state.saved.includes(a.url))||(filter==='read'&&state.read.includes(a.url))||(filter==='unread'&&!state.read.includes(a.url))));
 list.replaceChildren();$('reader-empty').hidden=visible.length!==0;
 for(const a of visible){const card=node('article','','mb-reader-card');const h=node('h3',a.title),desc=node('p',a.desc),category=node('p',a.category,'mb-reader-category'),actions=node('div','','mb-reader-actions');const link=node('a','Leggi');link.href=a.url;actions.append(link);
 for(const [type,yes,no] of [['saved','Salvato','Salva'],['read','Letto','Segna come letto']]){const pressed=state[type].includes(a.url),b=node('button',pressed?yes:no);b.type='button';b.setAttribute('aria-pressed',String(pressed));b.setAttribute('aria-label',(pressed?(type==='saved'?'Rimuovi dai salvati':'Segna come non letto'):no)+': '+a.title);b.addEventListener('click',()=>{toggle(type,a.url);const buttons=[...list.querySelectorAll('button')];buttons.find(x=>x.getAttribute('aria-label')?.endsWith(': '+a.title)&&x.textContent===(pressed?no:yes))?.focus();});actions.append(b);}
 card.append(category,h,desc,actions);list.append(card);}
 status.textContent=visible.length+' di '+articles.length+' articoli'+(storageOK?'':'. Preferenze non persistenti in questo browser.');
}
async function load(){
 $('reader-refresh').disabled=true;status.textContent='Aggiornamento dell’elenco…';
 try{const response=await fetch('/articoli/feed.xml',{cache:'no-cache'});if(!response.ok)throw Error('HTTP '+response.status);const doc=new DOMParser().parseFromString(await response.text(),'application/xml');if(doc.querySelector('parsererror'))throw Error('RSS non valido');const seen=new Set(),next=[];
 for(const item of doc.querySelectorAll('channel > item')){const get=t=>item.querySelector(t)?.textContent.trim()||'';const u=new URL(get('link'),location.origin);if(u.origin!==location.origin||!/^\/articoli\/[^/]+\/$/.test(u.pathname)||u.search||u.hash||seen.has(u.href)||!get('title'))continue;seen.add(u.href);next.push({url:u.href,title:get('title'),desc:get('description'),category:get('category')});}
 if(!next.length)throw Error('Feed vuoto');articles=next;fallback.hidden=true;tools.hidden=false;render();
 }catch{if(articles.length){render();status.textContent+=' · Impossibile aggiornare; è mostrato l’ultimo elenco disponibile.';}else{tools.hidden=true;fallback.hidden=false;status.textContent='Il feed non è disponibile. Puoi usare l’elenco dei collegamenti.';}}finally{$('reader-refresh').disabled=false;}
}
$('reader-search').addEventListener('input',render);$('reader-filter').addEventListener('change',render);$('reader-refresh').addEventListener('click',load);$('reader-reset').addEventListener('click',()=>{if(!confirm('Cancellare tutti gli articoli salvati e gli stati di lettura su questo browser?'))return;state={saved:[],read:[]};try{localStorage.removeItem(key);}catch{storageOK=false;}render();status.textContent+=' · Preferenze cancellate.';});load();
})();
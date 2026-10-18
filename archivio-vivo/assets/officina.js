'use strict';
(()=> {
 const KEY='scom_archivio_intermedio_2026_v1_';
 const info=document.querySelector('[data-course-root]');
 if(!info)return;
 const unit=Number(document.body.dataset.unit||0);
 const units=10;
 const byId=id=>document.getElementById(id);
 const setStatus=(t)=>{const el=byId('notebook-status');if(el)el.textContent=t;};
 const safeGet=(name)=>{try{return JSON.parse(localStorage.getItem(KEY+name)||'null')}catch{return null}};
 const safeSet=(name,value)=>{try{localStorage.setItem(KEY+name,JSON.stringify(value));return true}catch{return false}};
 const download=(name,text)=>{
  const blob=new Blob([text],{type:'text/markdown;charset=utf-8'});
  const link=document.createElement('a'),url=URL.createObjectURL(blob);
  link.href=url;link.download=name;document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2500);
 };
 function updateProgress(){
  let checked=0,active=0,withNotes=0;
  for(let i=1;i<=units;i++){const state=safeGet('unit'+i);if(state&&state.text?.trim()){withNotes++;active++}if(state?.checks){checked+=state.checks.filter(Boolean).length; if(state.checks.some(Boolean)&&!(state.text?.trim()))active++;}}
  const track=byId('course-progress'),value=byId('progress-label');
  if(track)track.style.width=(checked/(units*4)*100).toFixed(1)+'%';
  if(value)value.textContent=checked+' criteri di autocontrollo su '+(units*4)+' · '+withNotes+' unità con note di lavoro.';
 }
 function exportPortfolio(){
  const lines=['# L’archivio diventa racconto — portfolio personale','','Documento esportato dal dispositivo dell’utente. Nessun testo è stato inviato al sito.',''];
  let n=0;
  for(let i=1;i<=units;i++){
   const title=document.querySelector('[data-unit-name="'+i+'"]')?.textContent||('Unità '+i);
   const state=safeGet('unit'+i);
   if(state?.text?.trim()){n++;lines.push('## '+title,'',state.text.trim(),'','Criteri di autocontrollo: '+(state.checks||[]).filter(Boolean).length+'/4','');}
  }
  if(!n){alert('Non ci sono ancora appunti salvati in questo browser.');return;}
  lines.push('## Nota sull’uso delle fonti','', 'Verificare sempre la provenienza, le autorizzazioni e i limiti dei documenti reali prima di pubblicare.','','Questo portfolio non equivale a valutazione o attestato.','');
  download('portfolio-le-archivio-vivo.md',lines.join('\n'));
 }
 const exportButton=byId('export-portfolio');
 if(exportButton)exportButton.addEventListener('click',exportPortfolio);
 if(unit>=1 && unit<=units){
  const text=byId('notebook-text'),boxes=[...document.querySelectorAll('[data-check]')];
  if(text){
   const saved=safeGet('unit'+unit);
   if(saved){text.value=saved.text||'';boxes.forEach((b,i)=>b.checked=Boolean(saved.checks?.[i]));setStatus('Bozza locale recuperata da questo browser.');}
   const persist=()=>{const good=safeSet('unit'+unit,{text:text.value,checks:boxes.map(b=>b.checked),saved_at:new Date().toISOString()});setStatus(good?'Salvataggio locale completato. Esporta il portfolio per conservare una copia.':'Salvataggio non disponibile nel browser. Copia il testo altrove.');updateProgress();};
   byId('save-draft')?.addEventListener('click',persist);
   boxes.forEach(b=>b.addEventListener('change',persist));
   byId('download-unit')?.addEventListener('click',()=>download('archivio-vivo-unita-'+unit+'.md','# L’archivio diventa racconto — Unità '+unit+'\n\n'+text.value+'\n'));
   byId('delete-draft')?.addEventListener('click',()=>{
    if(!confirm('Eliminare il testo e gli autocontrolli di questa unità dal browser? Questa operazione non è annullabile.'))return;
    try{localStorage.removeItem(KEY+'unit'+unit);text.value='';boxes.forEach(b=>b.checked=false);setStatus('Bozza locale eliminata.');updateProgress();}
    catch{setStatus('Non è stato possibile eliminare la bozza locale.');}
   });
   let changed=false;text.addEventListener('input',()=>{changed=true;setStatus('Modifiche non ancora salvate.');});
   addEventListener('beforeunload',e=>{if(changed&&text.value!==safeGet('unit'+unit)?.text){e.preventDefault();e.returnValue='';}});
   byId('save-draft')?.addEventListener('click',()=>{changed=false;});
  }
 }
 const guideSelect=byId('guide-question'),guideAnswer=byId('guide-answer');
 if(guideSelect&&guideAnswer){
  const answers=[...guideSelect.options].map(x=>x.dataset.answer||'');
  const update=()=>guideAnswer.textContent=answers[guideSelect.selectedIndex]||'';
  guideSelect.addEventListener('change',update);update();
 }
 updateProgress();
})();

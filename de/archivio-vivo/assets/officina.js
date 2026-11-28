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
  if(value)value.textContent=checked+" Selbstkontrollpunkte von "+(units*4)+' · '+withNotes+" Einheiten mit Arbeitsnotizen.";
 }
 function exportPortfolio(){
  const lines=["# Vom Archiv zur Erzählung — persönliches Portfolio",'',"Von Ihrem Gerät exportiert. Es wurde kein Text an die Website übermittelt.",''];
  let n=0;
  for(let i=1;i<=units;i++){
   const title=document.querySelector('[data-unit-name="'+i+'"]')?.textContent||("Einheit "+i);
   const state=safeGet('unit'+i);
   if(state?.text?.trim()){n++;lines.push('## '+title,'',state.text.trim(),'',"Selbstkontrollpunkte: "+(state.checks||[]).filter(Boolean).length+'/4','');}
  }
  if(!n){alert("In diesem Browser sind noch keine Notizen gespeichert.");return;}
  lines.push("## Hinweis zur Quellennutzung",'', "Prüfen Sie vor der Veröffentlichung stets Herkunft, Genehmigungen und Aussagegrenzen echter Dokumente.",'',"Dieses Portfolio stellt keine Beurteilung oder Bescheinigung dar.",'');
  download('portfolio-le-archivio-vivo.md',lines.join('\n'));
 }
 const exportButton=byId('export-portfolio');
 if(exportButton)exportButton.addEventListener('click',exportPortfolio);
 if(unit>=1 && unit<=units){
  const text=byId('notebook-text'),boxes=[...document.querySelectorAll('[data-check]')];
  if(text){
   const saved=safeGet('unit'+unit);
   if(saved){text.value=saved.text||'';boxes.forEach((b,i)=>b.checked=Boolean(saved.checks?.[i]));setStatus("Entwurf aus diesem Browser wiederhergestellt.");}
   const snapshot=()=>JSON.stringify([text.value,...boxes.map(box=>box.checked)]);
   let savedSnapshot=snapshot();
   const persist=()=>{
    const good=safeSet('unit'+unit,{text:text.value,checks:boxes.map(box=>box.checked),saved_at:new Date().toISOString()});
    if(good)savedSnapshot=snapshot();
    setStatus(good?"Auf diesem Gerät gespeichert. Exportieren Sie das Portfolio, um eine Kopie zu behalten.":"Der Entwurf konnte in diesem Browser nicht gespeichert werden. Kopieren Sie den Text an einen anderen Ort.");
    updateProgress();
   };
   byId('save-draft')?.addEventListener('click',persist);
   boxes.forEach(b=>b.addEventListener('change',persist));
   byId('download-unit')?.addEventListener('click',()=>download('archivio-vivo-unita-'+unit+'.md',"# Vom Archiv zur Erzählung — Einheit "+unit+'\n\n'+text.value+'\n'));
   byId('delete-draft')?.addEventListener('click',()=>{
    if(!confirm("Text und Selbstkontrollen dieser Einheit aus dem Browser löschen? Der Vorgang lässt sich nicht rückgängig machen."))return;
    try{localStorage.removeItem(KEY+'unit'+unit);text.value='';boxes.forEach(b=>b.checked=false);savedSnapshot=snapshot();setStatus("Lokalen Entwurf gelöscht.");updateProgress();}
    catch{setStatus("Der lokale Entwurf konnte nicht gelöscht werden.");}
   });
   text.addEventListener('input',()=>setStatus("Änderungen noch nicht gespeichert."));
   addEventListener('beforeunload',event=>{
    if(snapshot()!==savedSnapshot){event.preventDefault();event.returnValue='';}
   });
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

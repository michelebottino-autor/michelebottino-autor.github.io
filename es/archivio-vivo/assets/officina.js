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
  if(value)value.textContent=checked+" criterios de autoevaluación de "+(units*4)+' · '+withNotes+" unidades con notas de trabajo.";
 }
 function exportPortfolio(){
  const lines=["# Del archivo al relato — portfolio personal",'',"Documento exportado desde tu dispositivo. No se envió ningún texto al sitio.",''];
  let n=0;
  for(let i=1;i<=units;i++){
   const title=document.querySelector('[data-unit-name="'+i+'"]')?.textContent||("Unidad "+i);
   const state=safeGet('unit'+i);
   if(state?.text?.trim()){n++;lines.push('## '+title,'',state.text.trim(),'',"Criterios de autoevaluación: "+(state.checks||[]).filter(Boolean).length+'/4','');}
  }
  if(!n){alert("Todavía no hay notas guardadas en este navegador.");return;}
  lines.push("## Nota sobre el uso de las fuentes",'', "Antes de publicar, verifica siempre la procedencia, los permisos y los límites de los documentos reales.",'',"Este portfolio no constituye una evaluación ni un certificado.",'');
  download('portfolio-le-archivio-vivo.md',lines.join('\n'));
 }
 const exportButton=byId('export-portfolio');
 if(exportButton)exportButton.addEventListener('click',exportPortfolio);
 if(unit>=1 && unit<=units){
  const text=byId('notebook-text'),boxes=[...document.querySelectorAll('[data-check]')];
  if(text){
   const saved=safeGet('unit'+unit);
   if(saved){text.value=saved.text||'';boxes.forEach((b,i)=>b.checked=Boolean(saved.checks?.[i]));setStatus("Borrador recuperado de este navegador.");}
   const snapshot=()=>JSON.stringify([text.value,...boxes.map(box=>box.checked)]);
   let savedSnapshot=snapshot();
   const persist=()=>{
    const good=safeSet('unit'+unit,{text:text.value,checks:boxes.map(box=>box.checked),saved_at:new Date().toISOString()});
    if(good)savedSnapshot=snapshot();
    setStatus(good?"Guardado en este dispositivo. Exporta tu portfolio para conservar una copia.":"El navegador no ha podido guardar el borrador. Copia el texto en otro lugar.");
    updateProgress();
   };
   byId('save-draft')?.addEventListener('click',persist);
   boxes.forEach(b=>b.addEventListener('change',persist));
   byId('download-unit')?.addEventListener('click',()=>download('archivio-vivo-unita-'+unit+'.md',"# Del archivo al relato — unidad "+unit+'\n\n'+text.value+'\n'));
   byId('delete-draft')?.addEventListener('click',()=>{
    if(!confirm("¿Eliminar de este navegador el texto y las autoevaluaciones de esta unidad? La operación es irreversible."))return;
    try{localStorage.removeItem(KEY+'unit'+unit);text.value='';boxes.forEach(b=>b.checked=false);savedSnapshot=snapshot();setStatus("Borrador local eliminado.");updateProgress();}
    catch{setStatus("No se ha podido eliminar el borrador local.");}
   });
   text.addEventListener('input',()=>setStatus("Cambios pendientes de guardar."));
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

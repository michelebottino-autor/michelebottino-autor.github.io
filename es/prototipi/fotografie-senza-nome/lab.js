'use strict';
(()=>{
const root=document.querySelector('#photo-workspace');if(!root)return;
const explanations={
visible:"Se observa a una persona sentada y mirando hacia la cámara. La imagen por sí sola no acredita un nombre, un lugar o una emoción.",
catalog:"El catálogo de la Library of Congress identifica a la retratada como Mary Church Terrell. El intervalo 1880–1900 procede de la ficha. En el retrato no se lee una fecha.",
uncertain:"La ficha por sí sola no establece la autoría, el día exacto, el lugar ni el estado de ánimo. Describe una copia posterior a la toma."
};
const answers={
date:{value:'interval',explanation:"La fuente da un intervalo de fechas. Distingue la toma de la copia posterior."},
author:{value:'unknown',explanation:"La persona retratada no tiene por qué haber tomado la fotografía. La ficha no identifica a quien la tomó."},
caption:{value:'supported',explanation:"El pie indica la institución, la persona identificada y el intervalo de fechas sin inventar un lugar, una fecha exacta ni una emoción."}
};
const status=document.querySelector('#lab-status');
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
document.querySelector('[data-view-response]').textContent=explanations[button.dataset.view];
}));
document.querySelectorAll('[data-check]').forEach(button=>button.addEventListener('click',()=>{
const key=button.dataset.check,checked=document.querySelector('input[name="'+key+'"]:checked'),el=document.querySelector('[data-feedback="'+key+'"]');
if(!checked){el.textContent="Selecciona primero una respuesta.";el.removeAttribute('data-result');return;}
const ok=checked.value===answers[key].value;
el.dataset.result=ok?'correct':'incorrect';
el.textContent=(ok?"Correcto. ":"Revisa tu respuesta. ")+answers[key].explanation;
}));
document.querySelector('#reset-lab').addEventListener('click',()=>{
document.querySelectorAll('input[type=radio]').forEach(x=>x.checked=false);
document.querySelectorAll('.feedback').forEach(x=>{x.textContent='';x.removeAttribute('data-result')});
document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed','false'));
document.querySelector('[data-view-response]').textContent="Selecciona un nivel para ver cómo se interpreta.";
document.querySelector('#caption-draft').value='';
status.textContent="Ejercicio reiniciado. No se había guardado ningún dato.";
});
document.querySelector('#export-caption').addEventListener('click',()=>{
const draft=document.querySelector('#caption-draft').value.trim();
if(!draft){status.textContent="Escribe un pie de foto antes de exportar.";return;}
const text=["Ficha del ejercicio fotográfico — Michele Bottino","Fuente: Library of Congress, https://www.loc.gov/item/97500102/","Imagen: LC-DIG-ppmsca-68742","Estado: borrador personal sin verificar",'',"Pie de foto:",draft,'',"© 2026 Michele Bottino — modelo didáctico"].join('\n');
const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
const a=document.createElement('a');a.href=url;a.download='fotografie-senza-nome-scheda.txt';a.hidden=true;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
status.textContent="Exportación solicitada. La ficha no se ha enviado al sitio.";
});
})();
'use strict';
(()=>{
const root=document.querySelector('#photo-workspace');if(!root)return;
const explanations={
visible:"You can see a seated person facing the camera. The image alone cannot establish a name, location or emotion.",
catalog:"The Library of Congress catalogue identifies the sitter as Mary Church Terrell. The range 1880–1900 comes from the catalogue. No date is legible on the portrait itself.",
uncertain:"The entry alone does not establish who took the photograph, the exact day or place, or the sitter’s mood. It describes a print made after the exposure."
};
const answers={
date:{value:'interval',explanation:"The source gives a range of dates. Distinguish the exposure from the later print."},
author:{value:'unknown',explanation:"The sitter need not be the photographer. The entry does not identify the photographer."},
caption:{value:'supported',explanation:"The caption names the institution, the identified sitter and the date range. It invents no place, exact date or emotion."}
};
const status=document.querySelector('#lab-status');
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
document.querySelector('[data-view-response]').textContent=explanations[button.dataset.view];
}));
document.querySelectorAll('[data-check]').forEach(button=>button.addEventListener('click',()=>{
const key=button.dataset.check,checked=document.querySelector('input[name="'+key+'"]:checked'),el=document.querySelector('[data-feedback="'+key+'"]');
if(!checked){el.textContent="Choose an answer first.";el.removeAttribute('data-result');return;}
const ok=checked.value===answers[key].value;
el.dataset.result=ok?'correct':'incorrect';
el.textContent=(ok?"Correct. ":"Try again. ")+answers[key].explanation;
}));
document.querySelector('#reset-lab').addEventListener('click',()=>{
document.querySelectorAll('input[type=radio]').forEach(x=>x.checked=false);
document.querySelectorAll('.feedback').forEach(x=>{x.textContent='';x.removeAttribute('data-result')});
document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed','false'));
document.querySelector('[data-view-response]').textContent="Choose a level to see what it tells you.";
document.querySelector('#caption-draft').value='';
status.textContent="Exercise reset. No data had been stored.";
});
document.querySelector('#export-caption').addEventListener('click',()=>{
const draft=document.querySelector('#caption-draft').value.trim();
if(!draft){status.textContent="Write a caption before exporting.";return;}
const text=["Photography exercise entry — Michele Bottino","Source: Library of Congress, https://www.loc.gov/item/97500102/","Image: LC-DIG-ppmsca-68742","Status: unverified personal draft",'',"Caption:",draft,'',"© 2026 Michele Bottino — teaching template"].join('\n');
const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
const a=document.createElement('a');a.href=url;a.download='fotografie-senza-nome-scheda.txt';a.hidden=true;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
status.textContent="Export requested. Your entry was not sent to the site.";
});
})();
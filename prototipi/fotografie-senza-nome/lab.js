'use strict';
(()=>{
const root=document.querySelector('#photo-workspace');if(!root)return;
const explanations={
visible:'Direttamente osservabile: un ritratto di persona seduta, rivolta verso l’obiettivo. L’immagine da sola non certifica nome, luogo o emozione.',
catalog:'Nel catalogo della Library of Congress il soggetto è identificato come Mary Church Terrell. L’intervallo cronologico 1880–1900 proviene dal record, non da una data leggibile sul ritratto.',
uncertain:'Non accertati dal solo record consultato: autore, giorno esatto dello scatto, luogo e stato d’animo. La stampa è descritta come successiva alla ripresa.'
};
const answers={
date:{value:'interval',explanation:'La fonte fornisce un intervallo, non un anno puntuale. Lo scatto e la stampa vanno distinti.'},
author:{value:'unknown',explanation:'La persona raffigurata non è automaticamente l’autrice della fotografia. Il fotografo non è identificato nella scheda utilizzata.'},
caption:{value:'supported',explanation:'La formulazione segnala istituzione, soggetto identificato e intervallo senza inventare luogo, data esatta o emozione.'}
};
const status=document.querySelector('#lab-status');
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
document.querySelector('[data-view-response]').textContent=explanations[button.dataset.view];
}));
document.querySelectorAll('[data-check]').forEach(button=>button.addEventListener('click',()=>{
const key=button.dataset.check,checked=document.querySelector('input[name="'+key+'"]:checked'),el=document.querySelector('[data-feedback="'+key+'"]');
if(!checked){el.textContent='Seleziona prima una risposta.';el.removeAttribute('data-result');return;}
const ok=checked.value===answers[key].value;
el.dataset.result=ok?'correct':'incorrect';
el.textContent=(ok?'Corretto. ':'Da rivedere. ')+answers[key].explanation;
}));
document.querySelector('#reset-lab').addEventListener('click',()=>{
document.querySelectorAll('input[type=radio]').forEach(x=>x.checked=false);
document.querySelectorAll('.feedback').forEach(x=>{x.textContent='';x.removeAttribute('data-result')});
document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed','false'));
document.querySelector('[data-view-response]').textContent='Seleziona un livello per vedere l’interpretazione corretta.';
document.querySelector('#caption-draft').value='';
status.textContent='Esercizio azzerato. Non era stato memorizzato alcun dato.';
});
document.querySelector('#export-caption').addEventListener('click',()=>{
const draft=document.querySelector('#caption-draft').value.trim();
if(!draft){status.textContent='Scrivi prima una didascalia da esportare.';return;}
const text=['Scheda fotografica didattica - Michele Bottino','Fonte: Library of Congress, https://www.loc.gov/item/97500102/','Immagine: LC-DIG-ppmsca-68742','Stato: bozza personale non verificata','','Didascalia:',draft,'','© 2026 Michele Bottino - modello didattico'].join('\n');
const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
const a=document.createElement('a');a.href=url;a.download='fotografie-senza-nome-scheda.txt';a.hidden=true;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
status.textContent='Esportazione richiesta. La scheda non è stata inviata al sito.';
});
})();
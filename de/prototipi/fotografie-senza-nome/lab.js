'use strict';
(()=>{
const root=document.querySelector('#photo-workspace');if(!root)return;
const explanations={
visible:"Zu sehen ist eine sitzende Person mit Blick zur Kamera. Aus dem Bild allein ergeben sich weder Name noch Ort oder Gefühlslage.",
catalog:"Der Katalog der Library of Congress identifiziert die Porträtierte als Mary Church Terrell. Die Zeitspanne 1880–1900 stammt aus dem Eintrag. Auf dem Porträt selbst ist kein Datum lesbar.",
uncertain:"Der Eintrag allein belegt weder Urheberschaft, Aufnahmetag und Ort noch die Stimmung der Porträtierten. Er beschreibt einen späteren Abzug."
};
const answers={
date:{value:'interval',explanation:"Die Quelle gibt eine Zeitspanne an. Unterscheiden Sie Aufnahme und späteren Abzug."},
author:{value:'unknown',explanation:"Die abgebildete Person ist nicht zwangsläufig die Urheberin. Der Eintrag nennt keinen Fotografen."},
caption:{value:'supported',explanation:"Die Bildunterschrift nennt die Institution, die identifizierte Person und die Zeitspanne. Sie erfindet weder Ort noch genaues Datum oder Gefühlslage."}
};
const status=document.querySelector('#lab-status');
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
document.querySelector('[data-view-response]').textContent=explanations[button.dataset.view];
}));
document.querySelectorAll('[data-check]').forEach(button=>button.addEventListener('click',()=>{
const key=button.dataset.check,checked=document.querySelector('input[name="'+key+'"]:checked'),el=document.querySelector('[data-feedback="'+key+'"]');
if(!checked){el.textContent="Wählen Sie zuerst eine Antwort.";el.removeAttribute('data-result');return;}
const ok=checked.value===answers[key].value;
el.dataset.result=ok?'correct':'incorrect';
el.textContent=(ok?"Richtig. ":"Überprüfen Sie Ihre Antwort. ")+answers[key].explanation;
}));
document.querySelector('#reset-lab').addEventListener('click',()=>{
document.querySelectorAll('input[type=radio]').forEach(x=>x.checked=false);
document.querySelectorAll('.feedback').forEach(x=>{x.textContent='';x.removeAttribute('data-result')});
document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed','false'));
document.querySelector('[data-view-response]').textContent="Wählen Sie eine Ebene, um die Erläuterung zu lesen.";
document.querySelector('#caption-draft').value='';
status.textContent="Übung zurückgesetzt. Es wurden keine Daten gespeichert.";
});
document.querySelector('#export-caption').addEventListener('click',()=>{
const draft=document.querySelector('#caption-draft').value.trim();
if(!draft){status.textContent="Schreiben Sie vor dem Export eine Bildunterschrift.";return;}
const text=["Foto-Arbeitsblatt — Michele Bottino","Quelle: Library of Congress, https://www.loc.gov/item/97500102/","Bild: LC-DIG-ppmsca-68742","Stand: ungeprüfter persönlicher Entwurf",'',"Bildunterschrift:",draft,'',"© 2026 Michele Bottino — Lehrvorlage"].join('\n');
const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
const a=document.createElement('a');a.href=url;a.download='fotografie-senza-nome-scheda.txt';a.hidden=true;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
status.textContent="Export angefordert. Ihr Eintrag wurde nicht an die Website gesendet.";
});
})();
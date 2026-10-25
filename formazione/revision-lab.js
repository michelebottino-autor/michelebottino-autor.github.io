'use strict';
(()=>{
 const lab=document.querySelector('[data-revision-lab="scrittura"]'),engine=window.MBFormativeQuiz;
 if(!lab||!engine)return;
 const answers={claim:'b',source:'c',revision:'a'};
 const notes={
 claim:'La pubblicazione dimostra ciò che il giornale riportò, non certifica automaticamente che gli aiuti arrivarono a destinazione.',
 source:'Le tre pagine appartengono alla stessa testata: documentano una sequenza editoriale ma non forniscono tre riscontri indipendenti.',
 revision:'La frase corretta mantiene la data e la provenienza della notizia, distinguendo il contenuto pubblicato dall’esito degli interventi.'
 };
 for(const fieldset of lab.querySelectorAll('[data-revision-question]')){
  fieldset.querySelector('[data-check]')?.addEventListener('click',()=>{
   const code=fieldset.dataset.revisionQuestion;
   engine.evaluate(fieldset,{answer:answers[code],feedbackSelector:'[data-revision-feedback]',
    correctText:notes[code],wrongText:notes[code],emptyText:'Seleziona una risposta prima della verifica.'});
  });
 }
 const explain=lab.querySelector('.mb-revision-explain'),show=lab.querySelector('[data-revision-show]');
 show.addEventListener('click',()=>{
  const open=explain.dataset.expanded!=='true';
  explain.dataset.expanded=String(open);show.setAttribute('aria-expanded',String(open));
  show.textContent=open?'Nascondi la revisione':'Mostra la revisione commentata';
 });
 lab.querySelector('[data-revision-reset]').addEventListener('click',()=>{
  engine.clear(lab,'[data-revision-feedback]');
  explain.dataset.expanded='false';show.setAttribute('aria-expanded','false');
  show.textContent='Mostra la revisione commentata';
 });
})();

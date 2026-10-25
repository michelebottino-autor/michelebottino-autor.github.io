'use strict';
(()=>{
 const lab=document.querySelector('[data-photo-lab="terrell"]');
 if(!lab)return;
 const details={
  visible:'Osservazione diretta: è visibile un ritratto in posa seduta. La fotografia permette di descrivere ciò che appare, ma non lo stato d’animo o le circostanze.',
  catalog:'Informazione catalografica: la Library of Congress identifica la persona ritratta come Mary Church Terrell. Questa identificazione proviene dal catalogo istituzionale, non dal solo aspetto del volto.',
  uncertain:'Questione aperta: l’intervallo 1880–1900 non individua l’anno esatto dello scatto. La scheda distingue inoltre la ripresa dalla stampa successiva.'
 };
 const explanation=lab.querySelector('[data-photo-explanation]');
 for(const button of lab.querySelectorAll('[data-photo-observe]')){
  button.addEventListener('click',()=>{
   for(const b of lab.querySelectorAll('[data-photo-observe]'))b.setAttribute('aria-pressed',String(b===button));
   explanation.textContent=details[button.dataset.photoObserve]||'';
  });
 }
 const questions=[
  {answer:'b',correct:'La posa è osservabile nella riproduzione; l’identità deriva dal catalogo e l’emozione non è determinabile dal solo ritratto.',wrong:'Distingui ciò che la fotografia mostra direttamente da ciò che il catalogo attribuisce o che resta ipotetico.'},
  {answer:'c',correct:'Il catalogo indica un intervallo 1880–1900, non l’anno preciso 1890. La stampa risulta successiva.',wrong:'Un intervallo non può essere trasformato arbitrariamente in una data singola. Controlla la scheda LOC.'},
  {answer:'a',correct:'La didascalia attribuisce correttamente l’identificazione e l’intervallo al catalogo, evitando emozioni e date inventate.',wrong:'La descrizione corretta deve citare la provenienza catalografica e non aggiungere dettagli non documentati.'}
 ];
 lab.querySelectorAll('[data-photo-question]').forEach((fieldset,i)=>{
  const feedback=fieldset.querySelector('.mb-photo-question-feedback');
  fieldset.querySelector('button').addEventListener('click',()=>{
   const selected=fieldset.querySelector('input[type=radio]:checked');
   if(!selected){feedback.textContent='Seleziona una risposta prima di verificare.';feedback.removeAttribute('data-result');return;}
   const correct=selected.value===questions[i].answer;
   feedback.dataset.result=correct?'correct':'incorrect';
   feedback.textContent=(correct?'Risposta corretta. ':'Da rivedere. ')+(correct?questions[i].correct:questions[i].wrong);
  });
 });
 lab.querySelector('[data-photo-reset]').addEventListener('click',()=>{
  for(const b of lab.querySelectorAll('[data-photo-observe]'))b.setAttribute('aria-pressed','false');
  explanation.textContent='Seleziona un aspetto per leggere una spiegazione documentaria.';
  lab.querySelectorAll('input[type=radio]').forEach(x=>x.checked=false);
  lab.querySelectorAll('.mb-photo-question-feedback').forEach(x=>{x.textContent='';x.removeAttribute('data-result')});
 });
})();

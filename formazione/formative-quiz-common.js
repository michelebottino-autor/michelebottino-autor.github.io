'use strict';
/* Motore condiviso di valutazione formativa. Nessun dato trasmesso o persistito. */
window.MBFormativeQuiz=Object.freeze({
 evaluate(fieldset,{answer,feedbackSelector,correctText,wrongText,emptyText}){
  const output=fieldset.querySelector(feedbackSelector);
  const selected=fieldset.querySelector('input[type="radio"]:checked');
  if(!output)return false;
  if(!selected){output.textContent=emptyText||'Seleziona una risposta prima di verificare.';output.removeAttribute('data-result');return null;}
  const correct=selected.value===answer;
  output.dataset.result=correct?'correct':'incorrect';
  output.textContent=(correct?'Corretto. ':'Da rivedere. ')+(correct?correctText:wrongText);
  return correct;
 },
 clear(container,feedbackSelector){
  container.querySelectorAll('input[type="radio"]').forEach(input=>{input.checked=false;});
  container.querySelectorAll(feedbackSelector).forEach(output=>{output.textContent='';output.removeAttribute('data-result');});
 }
});

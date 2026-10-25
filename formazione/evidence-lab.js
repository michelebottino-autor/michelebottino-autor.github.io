'use strict';
(()=>{
 const engine=window.MBFormativeQuiz;
 if(!engine)return;
 for(const lab of document.querySelectorAll('[data-evidence-lab]')){
  for(const fieldset of lab.querySelectorAll('[data-lab-question]')){
   fieldset.querySelector('[data-lab-check]')?.addEventListener('click',()=>engine.evaluate(fieldset,{
    answer:fieldset.dataset.labAnswer,feedbackSelector:'[data-lab-feedback]',
    correctText:fieldset.dataset.labCorrect,wrongText:fieldset.dataset.labWrong
   }));
  }
  lab.querySelector('[data-lab-reset]')?.addEventListener('click',()=>engine.clear(lab,'[data-lab-feedback]'));
 }
})();

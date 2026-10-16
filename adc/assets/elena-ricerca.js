/* Elena: interfaccia documentaria nel browser, nessun invio delle domande. */
(function(){
  'use strict';
  const form=document.getElementById('elena-form'),input=document.getElementById('elena-query'),output=document.getElementById('elena-results');
  if(!form||!input||!output)return;
  const context={lastTopic:null,lastQuestion:''};
  let started=false,busy=false;
  const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
  function appendAnswer(q,result){
    if(!started){output.replaceChildren();started=true;}
    const turn=make('article','elena-turn'),question=make('p','elena-turn-question','Domanda: '+q);
    const answer=make('p','elena-turn-answer',result.message);
    turn.append(question,answer);
    if(result.evidence)turn.append(make('p','elena-turn-evidence','Stato delle fonti: '+result.evidence));
    const sources=(result.sources||[]).filter(s=>s?.url?.startsWith('/adc/')).slice(0,5);
    if(sources.length){
      const section=make('div','elena-turn-sources');section.append(make('p','elena-turn-sources-label','Pagine dell’archivio:'));
      const list=make('ul');
      for(const source of sources){const li=make('li'),a=make('a');a.href=source.url;a.textContent=source.title;li.append(a);if(source.description)li.append(make('span','elena-turn-sources-description',' — '+source.description));list.append(li);}
      section.append(list);turn.append(section);
    }
    if((result.suggestions||[]).length){
      const follow=make('div','elena-followups');follow.append(make('p','elena-turn-sources-label','Puoi chiedere anche:'));
      for(const suggestion of result.suggestions.slice(0,2)){
        const btn=make('button','elena-followup',suggestion);btn.type='button';
        btn.addEventListener('click',()=>{input.value=suggestion;ask(suggestion);});
        follow.append(btn);
      }
      turn.append(follow);
    }
    output.append(turn);
    while(output.children.length>6)output.firstElementChild.remove();
    turn.scrollIntoView?.({block:'nearest',behavior:'auto'});
  }
  async function ask(raw){
    const q=String(raw||'').trim().slice(0,160);if(!q||busy)return;
    if(!window.ElenaADC){output.replaceChildren(make('p','','Il motore documentario non è disponibile. Consulta la sezione Fonti.'));return;}
    busy=true;
    const submit=form.querySelector('button[type=submit]');if(submit)submit.disabled=true;
    try{const result=await window.ElenaADC.answer(q,context);appendAnswer(q,result);input.value='';}
    catch(_){output.replaceChildren(make('p','','Non riesco a caricare l’indice dell’Archivio. Riprova oppure consulta la pagina Fonti.'));}
    finally{busy=false;if(submit)submit.disabled=false;}
  }
  form.addEventListener('submit',ev=>{ev.preventDefault();ask(input.value)});
  document.querySelectorAll('[data-query]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.query||'')));
  // Compatibilità con vecchi URL di ricerca; i nuovi moduli non creano URL contenenti le domande.
  const initial=new URLSearchParams(location.search).get('q');if(initial&&initial.length<=160)ask(initial);
})();
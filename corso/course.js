const titles=['Prima di credere, verifica','Fatto, affermazione, fonte e interpretazione','Quanto possiamo realmente affermare?','Una fonte non vale l’altra','Quando le fonti non concordano','Il Bottino Method in pratica','Intelligenza artificiale sotto controllo','Caso finale'];
let done=Number(localStorage.getItem('bm_done')||0);
let quiz1=localStorage.getItem('bm_quiz1')==='passed';
function render(){
 document.querySelector('#units').innerHTML=titles.map((t,i)=>'<div class="unit '+(i<done?'done':'')+'"><span class="num">0'+(i+1)+'</span><h3>'+t+'</h3><small>'+(i<done?'✓ Completata':i===done?'● Da continuare':'○ Da iniziare')+'</small><b>'+(i===7?'30':'25')+' min</b></div>').join('');
 let p=Math.round(done/8*100); document.querySelector('#pct').textContent=p+'%'; document.querySelector('#bar').style.width=p+'%';
 let n=Math.min(done,7); document.querySelector('#nextTitle').textContent='Unità '+(n+1)+' — '+titles[n];
}
render();
document.querySelector('#continueCourse').onclick=()=>document.querySelector('#lesson').scrollIntoView({behavior:'smooth'});
document.querySelector('#complete').onclick=()=>{done=Math.max(done,1);localStorage.setItem('bm_done',done);render();document.querySelector('#quiz').scrollIntoView({behavior:'smooth'})};
document.querySelector('#login').onclick=()=>alert('Accesso Google: integrazione backend in preparazione. Questa demo non raccoglie credenziali.');
const opts=['Il castello fu costruito nel 1427.','Il documento dimostra che il castello fu costruito nel 1427.','Il sito afferma che un documento daterebbe la costruzione del castello al 1427.','La notizia è falsa perché il documento non è disponibile.'];
document.querySelector('#answers').innerHTML=opts.map((x,i)=>'<button data-i="'+i+'">'+String.fromCharCode(65+i)+'. '+x+'</button>').join('');
document.querySelectorAll('#answers button').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('#answers button').forEach(x=>x.classList.remove('selected')); b.classList.add('selected');
 let ok=Number(b.dataset.i)===2,f=document.querySelector('#feedback'); f.className=ok?'ok':'bad';
 f.innerHTML=ok?'<b>Risposta corretta.</b><br>Hai mantenuto separata l’affermazione del sito dal fatto ancora da verificare.':'<b>Da rivedere.</b><br>Non abbiamo elementi per trasformare la notizia in fatto, ma neppure per dichiararla falsa.';
 document.querySelector('#quizNext').style.display=ok?'inline-block':'none';
});
document.querySelector('#quizNext').onclick=()=>{quiz1=true;localStorage.setItem('bm_quiz1','passed');alert('Verifica registrata. Nel corso completo questo risultato sarà associato al tuo profilo personale.');document.querySelector('#dashboard').scrollIntoView({behavior:'smooth'})};
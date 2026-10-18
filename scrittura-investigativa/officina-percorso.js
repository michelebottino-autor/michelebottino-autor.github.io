/* Officina delle Storie · taccuino locale, nessun invio di dati */
(() => {
'use strict';
const ROOT = 'si_editoriale_2026_';
const isUnit = /\/unita-(\d+)\/?(?:index\.html)?$/.exec(location.pathname);
const unitNumber = isUnit ? Number(isUnit[1]) : 0;
const base = unitNumber ? '../' : './';
const main = document.querySelector('main');
if (!main) return;
const E = (tag, cls = '', value = '') => {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (value) el.textContent = value;
  return el;
};
const heading = (level, value) => E('h' + level, '', value);
const para = (value, cls='') => E('p',cls,value);
const appendLines = (parent, tag, values) => {
  const list=E(tag);
  values.forEach(v=>list.append(E('li','',v)));
  parent.append(list);
};
const store = {
  get(key) { try { return localStorage.getItem(ROOT + key) || ''; } catch (_) { return ''; } },
  set(key,value) { try { localStorage.setItem(ROOT+key,value); return true; } catch (_) { return false; } },
  remove(key) { try { localStorage.removeItem(ROOT+key); } catch (_) {} }
};
function wordCount(s){return (s.trim().match(/\S+/g)||[]).length}
function ready(n){return store.get('complete_'+n)==='1'}
function downloadText(text,filename){
  const blob=new Blob([text],{type:'text/markdown;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=E('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function portfolio(course){
 const parts=['# Scrittura Investigativa · Portfolio didattico','Edizione: '+course.edition,
 'Stato: bozza personale non valutata; nessun attestato ufficiale.',''];
 course.units.forEach(u=>{
   parts.push('## Unità '+u.number+' — '+u.title);
   const t=store.get('draft_'+u.number);
   parts.push(t.trim()||'[Elaborato non ancora redatto]','');
 });
 parts.push('## Rubrica per il revisore','Originalità: 15/100 · Struttura e chiarezza: 25/100 · Interviste e documenti: 20/100 · Accuratezza: 25/100 · Revisione: 15/100.',
 'Usa la rubrica per rileggere il tuo elaborato e riconoscere gli aspetti da migliorare.');
 return parts.join('\n');
}
function renderHub(course){
 const sec=E('section','studio-panel studio-hub');
 sec.id='officina-studio';
 sec.append(heading(2,'Officina dell’autore · il percorso di scrittura'),
   para('Dieci unità progressive: dalla proposta editoriale a un testo documentato completo. La verifica delle fonti resta una condizione del lavoro; il risultato è una scrittura originale, chiara e sostenibile.'));
 const pilot=E('p','studio-source');
const pilotA=E('a','','Consulta il caso pilota su una pagina di giornale autentica →');
pilotA.href='./caso-pilota/';
pilot.append(pilotA);sec.append(pilot); // case-pilot-link-v1
const completed=course.units.filter(u=>ready(u.number)).length;
 const meter=E('div','studio-meter');
 meter.setAttribute('role','progressbar');
 meter.setAttribute('aria-label','Elaborati segnati come pronti per revisione');
 meter.setAttribute('aria-valuemin','0');meter.setAttribute('aria-valuemax','10');meter.setAttribute('aria-valuenow',String(completed));
 const fill=E('span');fill.style.width=(completed*10)+'%';meter.append(fill);
 sec.append(para(completed+'/10 bozze segnate come pronte per revisione sul dispositivo. Questo indicatore non è una valutazione.','studio-caption'),meter);
 const grid=E('div','studio-units');
 course.units.forEach(u=>{
   const a=E('a','studio-unit');
   a.href='./unita-'+u.number+'/';
   a.append(E('span','studio-unit-number',String(u.number).padStart(2,'0')));
   const label=E('span');
   label.append(E('strong','',u.title),E('small','',u.assignment+' · '+(ready(u.number)?'Bozza pronta per revisione':'Da elaborare')));
   a.append(label);
   grid.append(a);
 });
 sec.append(grid);
 const buttons=E('div','studio-actions');
 const b=E('button','studio-primary','Esporta il portfolio in Markdown');
 b.type='button';b.addEventListener('click',()=>downloadText(portfolio(course),'scrittura-investigativa-portfolio.md'));
 buttons.append(b);
 const t=E('button','studio-secondary','Esporta solo la scheda della rubrica');
 t.type='button';t.addEventListener('click',()=>downloadText('# Rubrica editoriale\nOriginalità: 15\nStruttura e chiarezza: 25\nInterviste e documenti: 20\nAccuratezza fattuale: 25\nQualità della revisione: 15\nSoglia progettuale: 70/100, applicabile esclusivamente dopo valutazione umana.\n','rubrica-scrittura-investigativa.md'));
 buttons.append(t);sec.append(buttons);
 sec.append(para('I testi restano esclusivamente nella memoria locale del browser; non sono inviati al sito, a Elena o a un docente. Per conservarli altrove, esporta periodicamente il portfolio. La pulizia dei dati del browser li cancella.','studio-note'));
 const old=main.querySelector('.unitlist');
 if(old) main.insertBefore(sec,old);else main.append(sec);
 renderElena(course,sec);
}
function renderElena(course,anchor){
 fetch(base+'elena-scrittura.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Guida non disponibile');return r.json()}).then(doc=>{
   if(!Array.isArray(doc.topics)||doc.topics.length!==10)throw new Error('Schede incomplete');
   const s=E('section','studio-panel');s.id='elena-scrittura';
   s.append(heading(2,'Elena · guida editoriale controllata'),
       para('Dieci risposte redazionali, una per unità. Elena spiega le consegne e segnala i limiti: non consulta il Cervello locale e non corregge gli elaborati.'));
   const label=E('label','studio-label','Scegli una domanda di studio');
   label.htmlFor='elena-scrittura-question';s.append(label);
   const sel=E('select');sel.id='elena-scrittura-question';
   doc.topics.forEach((t,i)=>{const o=E('option','',t.unit+' · '+t.question);o.value=String(i);sel.append(o);});
   s.append(sel);
   const result=E('div','studio-answer');result.setAttribute('aria-live','polite');s.append(result);
   function show(){
      result.replaceChildren();
      const item=doc.topics[Number(sel.value)];
      result.append(heading(3,item.question),para(item.answer),para('Esercizio suggerito: '+item.exercise),para('Limite: '+item.limitation,'studio-note'));
   }
   sel.addEventListener('change',show);show();
   anchor.insertAdjacentElement('afterend',s);
 }).catch(()=>{
  const p=para('La guida editoriale di Elena non è momentaneamente disponibile. Le lezioni restano accessibili.','studio-note');
  anchor.insertAdjacentElement('afterend',p);
 });
}
function archiveLegacyUnit(){
  const h=main.querySelector('h1');
  if(!h||!h.nextSibling)return null;
  const legacy=E('details','studio-legacy');
  const summary=E('summary','','Fondamenti di verifica e caso S-01 simulato · materiali facoltativi');
  legacy.append(summary,para('Questa è la versione precedente delle esercitazioni di verifica documentaria. Rimane disponibile come approfondimento, ma la lezione principale è l’Officina dell’autore. Il caso S-01 è interamente fittizio.','studio-note'));
  while(h.nextSibling)legacy.append(h.nextSibling);
  h.insertAdjacentElement('afterend',legacy);
  return legacy;
}
function renderUnit(course,u){
 const archived=archiveLegacyUnit();
 const sec=E('section','studio-panel studio-lesson');sec.id='taccuino';
 sec.append(para('PERCORSO DI SCRITTURA · UNITÀ '+u.number+'/10','studio-kicker'),heading(2,u.title),para(u.subtitle,'studio-lead'),para('Obiettivo: '+u.outcome));
 u.lesson.forEach(([title,text])=>{
   const art=E('article','studio-concept');art.append(heading(3,title),para(text));sec.append(art);
 });
 const ex=E('aside','studio-model');ex.append(heading(3,'Esempio di lavoro'),para(u.model));sec.append(ex);
const revision=E('section','studio-revision');
revision.append(heading(3,'Revisione commentata · dal difetto al testo'),para('Formulazione da evitare: '+u.editorial_revision.pitfall,'studio-erroneous'),para('Riscrittura documentata: '+u.editorial_revision.rewrite,'studio-better'),para(u.editorial_revision.comment),heading(3,'Esercizio di riscrittura applicata'),para(u.editorial_revision.workshop),para('Criterio editoriale: '+u.editorial_revision.assessment,'studio-note'));
sec.append(revision);
 const pilot=E('p','studio-source');
const pilotA=E('a','','Vedi questa competenza applicata al caso pilota documentario →');
pilotA.href='../caso-pilota/';pilot.append(pilotA);sec.append(pilot);
const source=E('p','studio-source','Riferimento di lettura: ');
 const l=E('a','',u.source.title);l.href=u.source.url;l.rel='noopener noreferrer';l.target='_blank';
 source.append(l);sec.append(source);
 sec.append(heading(3,'Consegna · '+u.assignment),para(u.instructions));
 appendLines(sec,'ol',u.steps);
 sec.append(para('Da produrre: '+u.deliverable,'studio-deliverable'));
 const form=E('div','studio-editor');form.append(heading(3,'Il mio taccuino di scrittura'));
 const label=E('label','studio-label','Scrivi qui la bozza o incolla il testo elaborato');
 label.htmlFor='studio-draft-'+u.number;form.append(label);
 const ta=E('textarea');ta.id=label.htmlFor;ta.rows=13;
 ta.placeholder='La bozza è personale. Distingui contenuti documentati, note e parti da verificare.';
 ta.value=store.get('draft_'+u.number);form.append(ta);
 const count=E('p','studio-caption');const status=E('p','studio-status');status.setAttribute('aria-live','polite');
 const review=E('fieldset','studio-checklist');review.append(E('legend','','Prima di segnare la bozza come pronta'));
 const checks=[];
 u.checks.forEach((c,i)=>{
  const lab=E('label','studio-check');const ck=E('input');ck.type='checkbox';
  const key='check_'+u.number+'_'+i;ck.checked=store.get(key)==='1';
  ck.addEventListener('change',()=>{store.set(key,ck.checked?'1':'0');update()});
  checks.push(ck);lab.append(ck,document.createTextNode(' '+c));review.append(lab);
 });
 form.append(review);
 const actions=E('div','studio-actions');
 const save=E('button','studio-secondary','Salva la bozza');save.type='button';
 const exportBtn=E('button','studio-secondary','Scarica questa unità');exportBtn.type='button';
 const complete=E('button','studio-primary','Segna come pronta per revisione');complete.type='button';
 actions.append(save,exportBtn,complete);form.append(count,status,actions);
 const info=para('Salvataggio esclusivamente locale. Un controllo di presenza del testo e la checklist non verificano qualità o veridicità; la valutazione richiede un revisore umano.','studio-note');
 form.append(info);sec.append(form);
 const workshop=main.querySelector('.writing-workshop');
 const intro=main.querySelector("h1");if(intro)intro.insertAdjacentElement("afterend",sec);else main.append(sec);
 const jump=E('a','studio-jump','Vai al taccuino dell’autore ↓');jump.href='#taccuino';
 const h=main.querySelector('h1');if(h)h.insertAdjacentElement('afterend',jump);
 function update(){
   const n=wordCount(ta.value);count.textContent=n+' parole nella bozza personale.';
   const ok=n>=70&&checks.every(x=>x.checked);
   complete.disabled=!ok;
   if(ready(u.number)) status.textContent='Bozza segnata come pronta per revisione (autodichiarazione, non attestato).';
   else status.textContent='Per segnare la bozza, scrivi almeno 70 parole e completa la checklist.';
 }
 ta.addEventListener('input',()=>{
    if(!store.set('draft_'+u.number,ta.value))status.textContent='Non è stato possibile salvare: esporta il testo manualmente.';
    if(ready(u.number)){store.remove('complete_'+u.number);}
    update();
 });
 save.addEventListener('click',()=>{status.textContent=store.set('draft_'+u.number,ta.value)?'Bozza salvata nel browser.':'Salvataggio non riuscito: usa il download.';});
 exportBtn.addEventListener('click',()=>downloadText('# Unità '+u.number+' — '+u.title+'\n\n'+ta.value+'\n','scrittura-investigativa-unita-'+u.number+'.md'));
 complete.addEventListener('click',()=>{
   if(wordCount(ta.value)<70||!checks.every(c=>c.checked))return;
   if(!store.set('draft_'+u.number,ta.value)||!store.set('complete_'+u.number,'1')){status.textContent='Impossibile aggiornare il salvataggio locale.';return;}
   update();
 });
 update();
 const bottom=E('nav','studio-next');bottom.setAttribute('aria-label','Navigazione fra unità');
 if(u.number>1){const prev=E('a','','← Unità '+(u.number-1));prev.href='../unita-'+(u.number-1)+'/';bottom.append(prev);}
 const hub=E('a','','Indice e portfolio');hub.href='../';bottom.append(hub);
 if(u.number<10){const next=E('a','','Unità '+(u.number+1)+' →');next.href='../unita-'+(u.number+1)+'/';bottom.append(next);}
 sec.append(bottom);
 if(u.number===10){
   const r=E('section','studio-model');r.append(heading(3,'Rubrica finale · solo per valutazione umana'));
   const entries=Object.entries(course.rubric).filter(([k])=>k!=='threshold');
   appendLines(r,'ul',entries.map(([k,v])=>k.replace('_',' ')+' — '+v+' punti'));
   r.append(para('Soglia progettuale '+course.rubric.threshold+'/100. Nessun voto o attestato viene rilasciato dal browser.'));sec.append(r);
 }
}
fetch(base+'officina-percorso.json',{cache:'no-store'}).then(r=>{
 if(!r.ok)throw new Error('Materiale didattico non disponibile');
 return r.json();
}).then(course=>{
 if(!Array.isArray(course.units)||course.units.length!==10||course.units.some((u,i)=>u.number!==i+1))throw new Error('Programma incompleto');
 if(unitNumber){const u=course.units.find(x=>x.number===unitNumber);if(u)renderUnit(course,u);}else renderHub(course);
}).catch(err=>{
 main.append(para('Il taccuino interattivo non è momentaneamente disponibile. Restano accessibili le lezioni e gli esercizi già presenti nella pagina.','studio-note'));
});
})();
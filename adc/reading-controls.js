/* ADC: dimensione del testo e posizione di lettura conservate solo localmente. */
(function(){
 'use strict';
 if(window.__adcReadingReady||!location.pathname.startsWith('/adc/'))return;
 window.__adcReadingReady=true;
 const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 if(!standalone)return;
 if(location.pathname.startsWith('/adc/installa/'))return;
 const SIZE_KEY='adc-reading-scale-v1',LAST_KEY='adc-reading-last-v1';
 const KEY_PREFIX='adc-reading-scroll-v1:';
 const min=1,max=1.3,step=.1;
 const read=(key)=>{try{return localStorage.getItem(key)}catch(_){return null}};
 const save=(key,value)=>{try{localStorage.setItem(key,String(value))}catch(_){}};
 const key=KEY_PREFIX+location.pathname;
 const safePath=path=>typeof path==='string'&&/^\/adc\/[a-z0-9/_-]*\/?$/i.test(path)&&!path.startsWith('/adc/installa/');
 const canonical=location.pathname;
 const storedSize=Number(read(SIZE_KEY));
 let size=storedSize>=min&&storedSize<=max?Math.round(storedSize*10)/10:1;
 const apply=()=>document.documentElement.style.setProperty('--adc-reader-scale',String(size));
 apply();
 const setup=()=>{
  if(!document.body||document.getElementById('adc-reader-controls'))return;
  const box=document.createElement('div');box.id='adc-reader-controls';
  box.setAttribute('role','group');box.setAttribute('aria-label','Strumenti di lettura');
  const smaller=document.createElement('button');smaller.type='button';smaller.textContent='A−';smaller.setAttribute('aria-label','Riduci dimensione del testo');
  const bigger=document.createElement('button');bigger.type='button';bigger.textContent='A+';bigger.setAttribute('aria-label','Ingrandisci dimensione del testo');
  const resume=document.createElement('button');resume.type='button';resume.dataset.readerResume='true';
  const update=()=>{
   smaller.disabled=size<=min;bigger.disabled=size>=max;
   if(canonical==='/adc/'){
    const last=read(LAST_KEY);resume.textContent='Continua lettura';
    resume.disabled=!safePath(last)||last==='/adc/';
   }else{
    const offset=Number(read(key));resume.textContent='Riprendi qui';
    resume.disabled=!Number.isFinite(offset)||offset<400;
   }
   // Non occupare lo schermo con «Riprendi» finché non esiste una posizione salvata.
   resume.hidden=resume.disabled;
  };
  const change=delta=>{size=Math.min(max,Math.max(min,Math.round((size+delta)*10)/10));apply();save(SIZE_KEY,size);update()};
  smaller.addEventListener('click',()=>change(-step));
  bigger.addEventListener('click',()=>change(step));
  resume.addEventListener('click',()=>{
   if(canonical==='/adc/'){
    const last=read(LAST_KEY);if(safePath(last)&&last!=='/adc/')location.assign(last);
   }else{const y=Number(read(key));if(Number.isFinite(y)&&y>=400)scrollTo({top:Math.min(y,Math.max(0,document.documentElement.scrollHeight-innerHeight)),behavior:'instant'})}
  });
  box.append(smaller,bigger,resume);
  document.body.append(box);
  if(canonical!=='/adc/'&&safePath(canonical))save(LAST_KEY,canonical);
  let pending=false;
  const record=()=>{
   pending=false;
   if(canonical==='/adc/'||!safePath(canonical)||document.visibilityState==='hidden')return;
   const y=Math.max(0,Math.round(scrollY));
   if(y>=300){save(key,y);update()}
  };
  addEventListener('scroll',()=>{if(pending)return;pending=true;requestAnimationFrame(record)},{passive:true});
  addEventListener('pagehide',()=>{if(canonical!=='/adc/'&&safePath(canonical)){save(key,Math.max(0,Math.round(scrollY)));save(LAST_KEY,canonical)}});
  update();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
 else setup();
})();

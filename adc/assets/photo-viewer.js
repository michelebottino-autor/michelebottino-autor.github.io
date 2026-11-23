/* Ingrandimento delle fotografie già pubblicate nella Mediateca ADC.
   Il testo delle didascalie e i link alle licenze restano accessibili. */
(function(){
 'use strict';
 const init=()=>{
  const figures=[...document.querySelectorAll('#fotografie-mediateca .adc-photo-gallery figure.adc-photo-tile')]
   .filter(figure=>figure.querySelector('img[src]')&&figure.querySelector('figcaption'));
  if(!figures.length||typeof HTMLDialogElement==='undefined')return;
  const dialog=document.createElement('dialog');dialog.id='adc-photo-viewer';
  dialog.setAttribute('aria-label','Visualizzatore fotografie del territorio');
  const top=document.createElement('div');top.className='adc-viewer-bar';
  const number=document.createElement('span');number.setAttribute('aria-live','polite');
  const close=document.createElement('button');close.type='button';close.textContent='Chiudi';close.setAttribute('aria-label','Chiudi la fotografia ingrandita');
  top.append(number,close);
  const stage=document.createElement('div');stage.className='adc-viewer-stage';
  const image=document.createElement('img');image.className='adc-viewer-image';image.alt='';stage.append(image);
  const actions=document.createElement('div');actions.className='adc-viewer-actions';
  const prev=document.createElement('button');prev.type='button';prev.textContent='← Precedente';
  const next=document.createElement('button');next.type='button';next.textContent='Successiva →';
  const zoom=document.createElement('button');zoom.type='button';zoom.textContent='Ingrandisci';
  zoom.setAttribute('aria-pressed','false');
  actions.append(prev,next,zoom);
  const caption=document.createElement('div');caption.className='adc-viewer-caption';caption.id='adc-viewer-caption';
  dialog.setAttribute('aria-describedby',caption.id);
  dialog.append(top,stage,actions,caption);
  document.body.append(dialog);
  let index=0,opener=null;
  const setZoom=value=>{
   stage.classList.toggle('is-zoomed',value);
   zoom.textContent=value?'Adatta allo schermo':'Ingrandisci';
   zoom.setAttribute('aria-pressed',String(value));
   stage.scrollTop=0;stage.scrollLeft=0;
  };
  const show=i=>{
   index=(i+figures.length)%figures.length;
   const original=figures[index].querySelector('img');
   image.src=original.currentSrc||original.src;
   image.alt=original.alt;
   caption.replaceChildren(figures[index].querySelector('figcaption').cloneNode(true));
   number.textContent='Fotografia '+(index+1)+' di '+figures.length;
   setZoom(false);
  };
  figures.forEach((figure,i)=>{
   const original=figure.querySelector('img');
   const button=document.createElement('button');
   button.type='button';button.className='adc-photo-open';
   original.parentNode.insertBefore(button,original);
   button.append(original);
   const hint=document.createElement('span');hint.className='adc-photo-hint';hint.textContent='Tocca per ingrandire';
   button.append(hint);
   button.addEventListener('click',()=>{
    opener=button;show(i);dialog.showModal();close.focus();
   });
  });
  prev.addEventListener('click',()=>show(index-1));
  next.addEventListener('click',()=>show(index+1));
  zoom.addEventListener('click',()=>setZoom(!stage.classList.contains('is-zoomed')));
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{image.removeAttribute('src');if(opener?.isConnected)opener.focus()});
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  dialog.addEventListener('keydown',event=>{
   if(event.target.closest('a'))return;
   if(event.key==='ArrowLeft'){event.preventDefault();show(index-1)}
   if(event.key==='ArrowRight'){event.preventDefault();show(index+1)}
  });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();

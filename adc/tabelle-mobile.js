/* ADC — rende le tabelle documentarie leggibili su schermi stretti. */
(function(){
'use strict';
function init(){
 document.querySelectorAll('main table,article table').forEach(table=>{
  if(table.classList.contains('adc-mobile-cards'))return;
  const rows=Array.from(table.querySelectorAll('tbody tr'));
  const head=table.querySelector('thead tr');
  if(!head||!rows.length)return;
  const headers=Array.from(head.children).map((th)=>th.textContent.replace(/\s+/g,' ').trim());
  if(headers.length<2)return;
  const compatible=rows.every(row=>Array.from(row.children).length===headers.length&&!row.querySelector('[colspan],[rowspan]'));
  if(!compatible)return;
  table.classList.add('adc-mobile-cards');
  rows.forEach(row=>Array.from(row.children).forEach((cell,i)=>cell.setAttribute('data-label',headers[i])));
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

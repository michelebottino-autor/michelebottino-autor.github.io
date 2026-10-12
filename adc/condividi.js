/* Condivisione degli articoli ADC. Nessun tracker o SDK esterno. */
(function(){
"use strict";
function ready(){
  if(document.querySelector("[data-adc-share]"))return;
  var main=document.querySelector("main")||document.querySelector("article");
  if(!main)return;
  var title=(document.querySelector("h1")||{}).textContent||document.title;
  title=title.trim();
  var canonical=document.querySelector('link[rel="canonical"]');
  var url=canonical&&canonical.href?canonical.href:location.href.split("#")[0];
  var description=document.querySelector('meta[name="description"]');
  var desc=description?description.content:"";
  var enc=encodeURIComponent, u=enc(url), t=enc(title);
  var box=document.createElement("section");box.className="adc-share";box.setAttribute("data-adc-share","");
  box.setAttribute("aria-label","Condividi questo articolo");
  var heading=document.createElement("h2");heading.textContent="Condividi questo articolo";box.appendChild(heading);
  var note=document.createElement("p");note.textContent="Se questa lettura ti è stata utile, puoi farla conoscere ad altre persone.";box.appendChild(note);
  var links=document.createElement("div");links.className="adc-share-actions";
  function anchor(label,href){var a=document.createElement("a");a.textContent=label;a.href=href;a.target="_blank";a.rel="noopener noreferrer";links.appendChild(a)}
  if(typeof navigator.share==="function"){
    var native=document.createElement("button");native.type="button";native.textContent="Condividi…";
    native.addEventListener("click",function(){navigator.share({title:title,text:desc,url:url}).catch(function(){})});links.appendChild(native);
  }
  anchor("Facebook","https://www.facebook.com/sharer/sharer.php?u="+u);
  anchor("WhatsApp","https://api.whatsapp.com/send?text="+t+"%20"+u);
  anchor("Telegram","https://t.me/share/url?url="+u+"&text="+t);
  anchor("LinkedIn","https://www.linkedin.com/sharing/share-offsite/?url="+u);
  anchor("X","https://twitter.com/intent/tweet?url="+u+"&text="+t);
  anchor("Email / Gmail","mailto:?subject="+t+"&body="+enc(title+"\n"+url));
  var copy=document.createElement("button");copy.type="button";copy.textContent="Copia link";
  copy.addEventListener("click",function(){
    function success(){copy.textContent="Link copiato";setTimeout(function(){copy.textContent="Copia link"},2400)}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(success,function(){fallback()})}
    else fallback();
    function fallback(){var field=document.createElement("textarea");field.value=url;field.style.position="fixed";field.style.left="-9999px";document.body.appendChild(field);field.select();try{if(document.execCommand("copy"))success();else window.prompt("Copia l'indirizzo:",url)}catch(e){window.prompt("Copia l'indirizzo:",url)}field.remove()}
  });links.appendChild(copy);
  box.appendChild(links);main.appendChild(box);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready);else ready();
})();
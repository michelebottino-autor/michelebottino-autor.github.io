/* Condivisione degli articoli ADC. Nessun tracker o SDK esterno. */
(function(){
"use strict";
function ready(){
  if(document.querySelector("[data-adc-share]")||document.querySelector('meta[http-equiv="refresh" i]'))return;
  if(location.pathname==='/adc/offline.html'||location.pathname.startsWith('/adc/widget/'))return;
  var main=document.querySelector("main")||document.querySelector("article");
  if(!main)return;
  if(!document.querySelector('link[data-adc-share-style]')){
    var css=document.createElement("link");
    css.rel="stylesheet";
    css.href="/adc/assets/condivisione-responsive.css?v=20261124-archive";
    css.dataset.adcShareStyle="true";
    document.head.appendChild(css);
  }
  var title=(main.querySelector("h1")||document.querySelector("h1")||{}).textContent||document.title;
  title=title.trim();
  var canonical=document.querySelector('link[rel="canonical"]');
  var url=new URL(canonical&&canonical.href?canonical.href:location.href);
  url.hash="";
  url.search="";
  url=url.href;
  var author="Michele Bottino";
  var authorPage="https://www.facebook.com/share/1Cgu8E47hw/";
  var credit="Archivio Documentale Calatabiano · A cura di "+author;
  var authorCredit=credit;
  var enc=encodeURIComponent, u=enc(url), t=enc(title);
  var tags=["#ArchivioDocumentaleCalatabiano","#Calatabiano"];
  var path=url;
  if(/\/adc\/chiese(?:\/|$)/.test(path))tags.push("#PatrimonioEcclesiastico","#StoriaLocale");
  else if(/\/adc\/(?:atlante|castello|patrimonio-edilizio)(?:\/|$)/.test(path))tags.push("#PatrimonioCulturale","#StoriaLocale");
  else if(/\/adc\/mediateca(?:\/|$)/.test(path))tags.push("#MemoriaStorica");
  else tags.push("#RicercaStorica","#MemoriaStorica");
  var hashtags=tags.join(" ");
  var shareText=title+" — "+credit;
  var box=document.createElement("section");box.className="adc-share";box.setAttribute("data-adc-share","");
  box.setAttribute("aria-label","Condividi questa pagina");
  var heading=document.createElement("h2");heading.textContent="Condividi questa pagina";box.appendChild(heading);
  var note=document.createElement("p");note.textContent="Archivio Documentale Calatabiano · A cura di Michele Bottino.";box.appendChild(note);
  var authorLink=document.createElement("p");var authorAnchor=document.createElement("a");authorAnchor.href=authorPage;authorAnchor.target="_blank";authorAnchor.rel="noopener noreferrer";authorAnchor.textContent="Segui l’Archivio Documentale Calatabiano su Facebook";authorLink.appendChild(authorAnchor);box.appendChild(authorLink);
  var tagNote=document.createElement("p");tagNote.textContent=hashtags;tagNote.className="adc-share-hashtags";box.appendChild(tagNote);
  var links=document.createElement("div");links.className="adc-share-actions";
  var icons={
    share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.8 10.6 6.4-4.2m-6.4 7 6.4 4.1"/>',
    facebook:'<path d="M15 21v-8h3l.5-4H15V7c0-1.1.4-2 2-2h2V1.5A22 22 0 0 0 16 1c-3.2 0-5 1.9-5 5v3H8v4h3v8"/>',
    whatsapp:'<path d="M20.4 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20l1.2-4.8a8.4 8.4 0 1 1 16.2-3.7Z"/><path d="M8.4 8.1c.6 3.3 3.3 6.1 6.7 6.9l1.4-1.4-2.3-1.2-.9 1c-1.3-.6-2.3-1.7-2.9-3l.9-.9-1.4-2.3-1.5.9Z"/>',
    telegram:'<path d="m21 3-3.5 18-5.8-5-3.1 2.8.6-4.7L3 11.5 21 3Z"/><path d="m9.2 14.1 8.5-7.4"/>',
    linkedin:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 10v7m0-10v.1M11 17v-7h3v1.1c1.3-2.1 4-1.2 4 1.6V17"/>',
    x:'<path d="M4 3h4l12 18h-4L4 3ZM20 3 4 21"/>',
    email:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/>',
    copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    quote:'<path d="M10 11H5V6h6v7l-4 5m12-7h-5V6h6v7l-4 5"/>'
  };
  function setLabel(el,text){el.querySelector(".adc-share-label").textContent=text;}
  function decorate(el,key){var label=document.createElement("span");label.className="adc-share-label";label.textContent=el.textContent;el.replaceChildren(label);el.dataset.network=key;var holder=document.createElement("span");holder.className="adc-share-icon";holder.setAttribute("aria-hidden","true");holder.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">'+icons[key]+'</svg>';el.prepend(holder);return el;}
  function anchor(label,href,key){var a=document.createElement("a");a.textContent=label;a.href=href;a.target="_blank";a.rel="noopener noreferrer";decorate(a,key);links.appendChild(a)}
  if(typeof navigator.share==="function"){
    var native=document.createElement("button");native.type="button";native.textContent="Condividi…";
    native.addEventListener("click",function(){navigator.share({title:title,text:authorCredit+"\n"+hashtags,url:url}).catch(function(){})});native.className="adc-share-primary";decorate(native,"share");links.appendChild(native);
  }
  anchor("Facebook","https://www.facebook.com/sharer/sharer.php?u="+u+"&hashtag="+enc(tags[0]),"facebook");
  anchor("WhatsApp","https://api.whatsapp.com/send?text="+enc(shareText+"\n"+url+"\n\n"+hashtags),"whatsapp");
  anchor("Telegram","https://t.me/share/url?url="+u+"&text="+enc(shareText+"\n"+hashtags),"telegram");
  anchor("LinkedIn","https://www.linkedin.com/sharing/share-offsite/?url="+u,"linkedin");
  anchor("X","https://twitter.com/intent/tweet?url="+u+"&text="+enc(title+" — "+author)+"&hashtags="+enc(tags.map(function(t){return t.slice(1)}).join(",")),"x");
  anchor("Email / Gmail","mailto:?subject="+t+"&body="+enc(shareText+"\n"+url),"email");
  var attribution=document.createElement("button");attribution.type="button";attribution.textContent="Copia testo e hashtag";attribution.addEventListener("click",function(){var message=shareText+"\n"+url+"\n\n"+hashtags;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(message).then(function(){setLabel(attribution,"Testo copiato");setTimeout(function(){setLabel(attribution,"Copia testo e hashtag")},2400)},function(){window.prompt("Copia il testo:",message)})}else window.prompt("Copia il testo:",message)});attribution.className="adc-share-copy";decorate(attribution,"quote");links.appendChild(attribution);
  var copy=document.createElement("button");copy.type="button";copy.textContent="Copia link";
  copy.addEventListener("click",function(){
    function success(){setLabel(copy,"Link copiato");setTimeout(function(){setLabel(copy,"Copia link")},2400)}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(success,function(){fallback()})}
    else fallback();
    function fallback(){var field=document.createElement("textarea");field.value=url;field.style.position="fixed";field.style.left="-9999px";document.body.appendChild(field);field.select();try{if(document.execCommand("copy"))success();else window.prompt("Copia l'indirizzo:",url)}catch(e){window.prompt("Copia l'indirizzo:",url)}field.remove()}
  });copy.className="adc-share-copy";decorate(copy,"copy");links.appendChild(copy);
  authorLink.className="adc-share-author";box.appendChild(links);main.appendChild(box);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready);else ready();
})();

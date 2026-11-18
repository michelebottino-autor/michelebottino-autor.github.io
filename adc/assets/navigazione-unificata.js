(function () {
  'use strict';
  function start() {
    if (document.getElementById('adc-unified-header')) return;
    var body = document.body;
    if (!body) return;
    var names = [
      ['Archivio','/adc/'], ['Storia','/adc/storia-per-tutti/'], ['Le chiese','/adc/chiese/'],
      ['Fonti','/adc/fonti/'], ['Atlante','/adc/atlante/'],
      ['Mediateca','/adc/mediateca/'], ['Patrimonio','/adc/materiali-patrimonio/'],
      ['Stampa','/adc/stampa/'], ['Persone e libri','/adc/persone/'],
      ['Elena','/adc/elena/'], ['Michele Bottino','/']
    ];
    var header = document.createElement('div');
    header.id = 'adc-unified-header';
    header.setAttribute('role','banner');
    var bar = document.createElement('div'); bar.className = 'adc-u-bar';
    var brand = document.createElement('a'); brand.className = 'adc-u-brand';
    brand.href = '/adc/'; brand.appendChild(document.createTextNode('Archivio Documentale Calatabiano'));
    var small = document.createElement('small'); small.textContent = 'A cura di Michele Bottino';
    brand.appendChild(small); bar.appendChild(brand);
    var button = document.createElement('button'); button.type = 'button';
    button.className = 'adc-u-toggle'; button.textContent = '☰ Menu';
    button.setAttribute('aria-controls','adc-u-links');
    button.setAttribute('aria-expanded','false'); bar.appendChild(button);
    header.appendChild(bar);
    var nav = document.createElement('nav'); nav.className = 'adc-u-links';
    nav.id = 'adc-u-links'; nav.setAttribute('aria-label','Navigazione principale ADC');
    names.forEach(function (item) {
      var a = document.createElement('a'); a.href = item[1]; a.textContent = item[0];
      if (location.pathname === item[1] || (item[1] === '/adc/chiese/' && location.pathname.startsWith('/adc/chiese/'))) a.setAttribute('aria-current','page');
      nav.appendChild(a);
    });
    header.appendChild(nav);
    function setOpen(open) {
      button.setAttribute('aria-expanded',String(open));
      nav.setAttribute('data-open',String(open));
      button.textContent = open ? '✕ Chiudi' : '☰ Menu';
    }
    button.addEventListener('click',function (event) {
      event.preventDefault(); event.stopPropagation();
      setOpen(button.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('click',function (event) {
      if (!header.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown',function (event) {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        setOpen(false); button.focus();
      }
    });
    // Limit legacy navigation cleanup to direct body children: never hide article or section headers.
    var old = body.querySelectorAll(':scope > header, :scope > nav.adc-project-nav, :scope > nav#adc-design-nav, :scope > section.adc-accessi-distinti, :scope > nav.site-transparency-links');
    old.forEach(function (el) {
      if (el.closest('footer,details')) return;
      // Un'intestazione con un titolo proprio del dossier e' contenuto editoriale,
      // non una navigazione duplicata: conservarla e nascondere solo i menu legacy.
      if (el.tagName === 'HEADER' && el.querySelector('h1')) {
        el.querySelectorAll('nav').forEach(function (menu) {
          menu.hidden = true;
          menu.style.setProperty('display','none','important');
        });
        return;
      }
      el.hidden = true;
      el.style.setProperty('display','none','important');
    });
    body.insertBefore(header,body.firstChild);
    document.documentElement.classList.add('adc-unified-ready');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
/* Applica un footer comune senza alterare i contenuti editoriali esistenti. */
(function () {
  'use strict';
  if (!location.pathname.startsWith('/adc/') || location.pathname.startsWith('/adc/widget/')) return;
  function init() {
    var footer = document.querySelector('footer');
    if (!footer) {
      footer = document.createElement('footer');
      document.body.appendChild(footer);
    }
    footer.classList.add('adc-global-footer');
    footer.setAttribute('aria-label', 'Informazioni e collegamenti dell’Archivio Documentale Calatabiano');
    if (footer.querySelector('[data-adc-footer-identity]')) return;
    var line = document.createElement('div');
    line.className = 'adc-u-footer-line';
    line.dataset.adcFooterIdentity = 'true';
    line.innerHTML = '<span>Archivio Documentale Calatabiano · A cura di Michele Bottino</span><nav aria-label="Collegamenti principali"><a href="/adc/">Archivio</a><a href="/adc/stampa/">Giornali storici</a><a href="/adc/persone/">Persone, libri e studi</a><a href="/">Sito dell’autore</a></nav>';
    footer.appendChild(line);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();

/* Carica il client di presenza anonima su tutte le pagine ADC che usano la navigazione condivisa.
   Il client rimane inattivo in assenza di consenso o di un backend verificato. */
(function () {
  'use strict';
  if (!location.pathname.startsWith('/adc/') || location.pathname.startsWith('/adc/widget/')) return;
  if (document.querySelector('script[data-adc-presence]')) return;
  var script = document.createElement('script');
  script.src = '/assets/js/lettori-presenti.js';
  script.defer = true;
  script.dataset.adcPresence = 'true';
  document.head.appendChild(script);
})();

/* Collega le pagine ADC alla PWA con ambito esclusivo /adc/. */
(function(){
 'use strict';
 if(!location.pathname.startsWith('/adc/'))return;
 if(document.querySelector('script[data-adc-app-init]'))return;
 const app=document.createElement('script');app.src='/adc/app-init.js';
 app.defer=true;app.dataset.adcAppInit='true';document.head.appendChild(app);
})();

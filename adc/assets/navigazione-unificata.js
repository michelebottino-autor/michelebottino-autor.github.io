(function () {
  'use strict';
  function start() {
    if (document.getElementById('adc-unified-header')) return;
    var body = document.body;
    if (!body) return;
    // Due percorsi d'accesso chiari, strumenti principali e sezioni secondarie.
    var mainNames = [
      ['Archivio','/adc/'], ['Per i cittadini','/adc/storia-per-tutti/'],
      ['Per gli studiosi','/adc/fonti/'], ['Cerca','/adc/cerca/'],
      ['Inventario','/adc/inventario/'], ['Luoghi','/adc/atlante/'],
      ['Persone','/adc/persone/'], ['Elena','/adc/elena/']
    ];
    var otherNames = [
      ['Le chiese','/adc/chiese/'], ['Monasteri','/adc/monasteri/'],
      ['Mediateca','/adc/mediateca/'], ['Patrimonio','/adc/materiali-patrimonio/'],
      ['Stampa','/adc/stampa/'], ['Origini e dedica','/adc/#dedica-comunita'],
      ['Carta ADC','/adc/carta/'], ['Michele Bottino','/']
    ];
    var header = document.createElement('div');
    header.id = 'adc-unified-header';
    header.setAttribute('role','banner');
    var bar = document.createElement('div'); bar.className = 'adc-u-bar';
    var brand = document.createElement('a'); brand.className = 'adc-u-brand';
    brand.href = '/adc/';
    var emblem = document.createElement('img');
    emblem.className = 'adc-u-emblem';
    emblem.src = '/images/logo_laboratorio_adc_144.webp';
    emblem.srcset = '/images/logo_laboratorio_adc_144.webp 144w, /images/logo_laboratorio_adc_360.webp 360w';
    emblem.sizes = '(max-width: 760px) 52px, 60px';
    emblem.width = 60; emblem.height = 60;
    emblem.alt = '';
    emblem.decoding = 'async';
    emblem.setAttribute('aria-hidden', 'true');
    brand.appendChild(emblem);
    var brandText = document.createElement('span');
    brandText.className = 'adc-u-brand-text';
    brandText.appendChild(document.createTextNode('Archivio Documentale Calatabiano'));
    var small = document.createElement('small'); small.textContent = 'A cura di Michele Bottino';
    brandText.appendChild(small);
    brand.appendChild(brandText); bar.appendChild(brand);
    var button = document.createElement('button'); button.type = 'button';
    button.className = 'adc-u-toggle'; button.textContent = '☰ Menu';
    button.setAttribute('aria-controls','adc-u-links');
    button.setAttribute('aria-expanded','false'); bar.appendChild(button);
    header.appendChild(bar);
    var nav = document.createElement('nav'); nav.className = 'adc-u-links';
    nav.id = 'adc-u-links'; nav.setAttribute('aria-label','Navigazione principale ADC');
    function makeLink(item) {
      var a = document.createElement('a'); a.href = item[1]; a.textContent = item[0];
      if (location.pathname === item[1] || (item[1] === '/adc/#dedica-comunita' && location.pathname === '/adc/' && location.hash === '#dedica-comunita') || (item[1] === '/adc/chiese/' && location.pathname.startsWith('/adc/chiese/')) || (item[1] === '/adc/monasteri/' && location.pathname.startsWith('/adc/monasteri/'))) a.setAttribute('aria-current','page');
      return a;
    }
    mainNames.forEach(function (item) { nav.appendChild(makeLink(item)); });
    var more = document.createElement('details'); more.className = 'adc-u-more';
    var summary = document.createElement('summary'); summary.textContent = 'Altre sezioni';
    more.appendChild(summary);
    var moreLinks = document.createElement('div'); moreLinks.className = 'adc-u-more-links';
    otherNames.forEach(function (item) { moreLinks.appendChild(makeLink(item)); });
    more.appendChild(moreLinks);
    nav.appendChild(more);
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
    nav.addEventListener('click',function (event) {
      var link = event.target.closest('a[href]');
      if (link && nav.contains(link)) { setOpen(false); more.open = false; }
    });
    window.addEventListener('hashchange', function () {
      nav.querySelectorAll('a[aria-current]').forEach(function (link) { link.removeAttribute('aria-current'); });
      nav.querySelectorAll('a').forEach(function (link) {
        if (link.getAttribute('href') === '/adc/#dedica-comunita' && location.pathname === '/adc/' && location.hash === '#dedica-comunita') link.setAttribute('aria-current','page');
        else if (link.getAttribute('href') === location.pathname && !location.hash) link.setAttribute('aria-current','page');
      });
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
    line.innerHTML = '<span>Archivio Documentale Calatabiano · A cura di Michele Bottino</span><nav aria-label="Collegamenti principali"><a href="/adc/">Archivio</a><a href="/adc/stampa/">Giornali storici</a><a href="/adc/persone/">Persone, libri e studi</a><a href="/adc/#dedica-comunita">Origini e dedica</a><a href="/adc/carta/">Carta ADC</a><a href="/">Sito dell’autore</a></nav>';
    footer.appendChild(line);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();

/* Contatore ADC nel footer di tutte le pagine: nessun Google Analytics. */
(function () {
  'use strict';
  if (!location.pathname.startsWith('/adc/')) return;
  function init() {
    var footer = document.querySelector('footer');
    if (!footer || document.getElementById('adc-visite-footer')) return;
    var wrap = document.createElement('p');
    wrap.id = 'adc-visite-footer';
    wrap.style.cssText = 'text-align:center;margin:18px auto 8px;padding:12px 14px;max-width:400px;border-top:1px solid rgba(194,170,111,.35);font-variant-numeric:tabular-nums;';
    var label = document.createElement('strong');
    label.textContent = 'Conteggio sessioni: ';
    var count = document.createElement('span');
    count.id = 'adc-visite-numero';
    count.textContent = '—';
    var state = document.createElement('small');
    state.style.cssText = 'display:block;font-size:.76rem;margin-top:4px;opacity:.8;';
    state.textContent = '';
    wrap.append(label, count, state);
    var bottom = footer.querySelector('.adc-archive-footer__bottom,.adc-inner-footer__bottom');
    if (bottom) footer.insertBefore(wrap, bottom);
    else footer.appendChild(wrap);
    var format = function (value) { return Number(value).toLocaleString('it-IT'); };
    fetch('/adc/contatore-config.json', {cache:'no-store'}).then(function(r){if(!r.ok)throw Error('config');return r.json();}).then(function(cfg){
      if (!cfg || !/^https:\/\/[-a-zA-Z0-9.]+\/visite$/.test(cfg.endpoint || '')) return;
      var endpoint = cfg.endpoint;
      var registered = false;
      try { registered = sessionStorage.getItem('adc-visita-registrata-v1') === '1'; } catch(_) {}
      return fetch(endpoint, {method: registered ? 'GET' : 'POST', mode:'cors', cache:'no-store'}).then(function(r){if(!r.ok)throw Error('counter');return r.json();}).then(function(result){
        if (!Number.isSafeInteger(result.total) || result.total < 2000) return;
        // Il servizio include 2.000 unità iniziali non corrispondenti a sessioni registrate.
        count.textContent = format(result.total - 2000);
        state.textContent = '';
        if (!registered) { try {sessionStorage.setItem('adc-visita-registrata-v1','1');} catch(_) {} }
      });
    }).catch(function(){
      state.textContent = '';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
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

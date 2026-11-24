/* Carica la grafica condivisa dopo gli stili specifici della pagina. */
(function () {
  'use strict';
  if (!location.pathname.startsWith('/adc/') || location.pathname.startsWith('/adc/custode/')) return;
  function loadTheme() {
    var presenceLink = document.querySelector('link[rel="stylesheet"][href*="/adc/assets/elena-presenza.css"]');
    if (presenceLink && !presenceLink.href.includes('v=20261124-mobile-modal-1')) {
      presenceLink.href = '/adc/assets/elena-presenza.css?v=20261124-mobile-modal-1';
    }
    if (!document.head || document.getElementById('adc-visual-theme')) return;
    var link = document.createElement('link');
    link.id = 'adc-visual-theme';
    link.rel = 'stylesheet';
    link.href = '/adc/assets/identita-visiva-condivisa-2026.css?v=20261124-contrast';
    document.head.appendChild(link);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadTheme, {once:true});
  else loadTheme();
})();

(function () {
  'use strict';
  function start() {
    if (document.getElementById('adc-unified-header')) return;
    var body = document.body;
    if (!body) return;
    // Due percorsi d'accesso chiari, strumenti principali e sezioni secondarie.
    // In evidenza i percorsi del patrimonio; Elena resta uno strumento di consultazione.
    var mainNames = [
      ['Archivio','/adc/'], ['Documenti','/adc/inventario/'],
      ['Fonti','/adc/fonti/'], ['Luoghi','/adc/atlante/'],
      ['Chiese e arte','/adc/chiese/'], ['Foto e video','/adc/mediateca/'],
      ['Cerca','/adc/cerca/']
    ];
    var otherNames = [
      ['Persone e memorie','/adc/persone/'], ['Storia per tutti','/adc/storia-per-tutti/'],
      ['Monasteri','/adc/monasteri/'], ['Patrimonio','/adc/materiali-patrimonio/'],
      ['Stampa','/adc/stampa/'], ['Elena','/adc/elena/'],
      ['Origini e dedica','/adc/#dedica-comunita'],
      ['Carta ADC','/adc/carta/'], ['Sito dell’autore','/']
    ];
    var header = document.createElement('div');
    header.id = 'adc-unified-header';
    header.setAttribute('role','banner');
    // Salta la navigazione e raggiungi direttamente la scheda consultata.
    var mainContent = document.querySelector('main');
    if (mainContent) {
      if (!mainContent.id) mainContent.id = 'adc-main-content';
      var skip = document.createElement('a');
      skip.className = 'adc-u-skip';
      skip.href = '#' + mainContent.id;
      skip.textContent = 'Vai al contenuto';
      header.appendChild(skip);
    }
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
      if (!open) more.open = false;
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
      if (event.key === 'Escape') {
        var mobileMenuOpen = button.getAttribute('aria-expanded') === 'true';
        if (more.open || mobileMenuOpen) {
          event.preventDefault();
          setOpen(false);
          (mobileMenuOpen ? button : summary).focus();
        }
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
/* Il footer principale e le statistiche sono condivisi da tutte le pagine ADC. */
(function () {
  'use strict';
  if (!location.pathname.startsWith('/adc/') || location.pathname.startsWith('/adc/widget/') || location.pathname === '/adc/offline.html') return;
  if (document.querySelector('meta[http-equiv="refresh" i]')) return;
  const scripts = ['/adc/assets/footer.js', '/adc/assets/visite.js', '/assets/js/lettori-presenti.js'];
  for (const src of scripts) {
    if (document.querySelector('script[src^="' + src + '"]')) continue;
    const script = document.createElement('script');
    script.src = src + '?v=20261124-footer-adc';
    script.async = false;
    document.head.appendChild(script);
  }
})();

/* Collega le pagine ADC alla PWA con ambito esclusivo /adc/. */
(function(){
 'use strict';
 if(!location.pathname.startsWith('/adc/'))return;
 if(document.querySelector('script[data-adc-app-init]'))return;
 const app=document.createElement('script');app.src='/adc/app-init.js';
 app.defer=true;app.dataset.adcAppInit='true';document.head.appendChild(app);
})();


/* Il riquadro di condivisione è il medesimo su tutte le pagine pubbliche ADC. */
(function () {
  'use strict';
  if (!location.pathname.startsWith('/adc/') || location.pathname === '/adc/offline.html') return;
  if (location.pathname.startsWith('/adc/widget/') || document.querySelector('meta[http-equiv="refresh" i]')) return;
  if (document.querySelector('script[src*="/adc/condividi.js"], [data-adc-share]')) return;
  const script = document.createElement('script');
  script.src = '/adc/condividi.js?v=20261124-archive';
  document.head.appendChild(script);
})();

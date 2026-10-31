(function () {
  'use strict';
  function start() {
    if (document.getElementById('adc-unified-header')) return;
    var body = document.body;
    if (!body) return;
    var names = [
      ['Archivio','/adc/'], ['Storia','/adc/storia-per-tutti/'],
      ['Fonti','/adc/fonti/'], ['Atlante','/adc/atlante/'],
      ['Mediateca','/adc/mediateca/'], ['Patrimonio','/adc/materiali-patrimonio/'],
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
      if (location.pathname === item[1]) a.setAttribute('aria-current','page');
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
    // Only remove navigations outside article content; preserve in-page dossier links.
    var old = body.querySelectorAll('header, nav.adc-project-nav, nav#adc-design-nav, section.adc-accessi-distinti, nav.site-transparency-links');
    old.forEach(function (el) {
      if (el.closest('footer,details')) return;
      el.hidden = true;
      el.style.setProperty('display','none','important');
    });
    body.insertBefore(header,body.firstChild);
    document.documentElement.classList.add('adc-unified-ready');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
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

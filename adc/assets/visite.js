/* Contatore ADC nel footer di tutte le pagine: nessun Google Analytics. */
(function () {
  'use strict';
  if (!location.pathname.startsWith('/adc/') || location.pathname.startsWith('/adc/widget/') || location.pathname === '/adc/offline.html') return;
  if (document.querySelector('meta[http-equiv="refresh" i]')) return;
  function init() {
    var footer = document.querySelector('footer') || document.querySelector('main');
    if (!footer || document.getElementById('adc-visite-footer')) return;
    var wrap = document.createElement('p');
    wrap.id = 'adc-visite-footer';
    wrap.style.cssText = 'text-align:center;margin:18px auto 8px;padding:12px 14px;max-width:400px;border-top:1px solid rgba(194,170,111,.35);font-variant-numeric:tabular-nums;';
    var label = document.createElement('strong');
    label.textContent = 'Visite totali registrate: ';
    var count = document.createElement('span');
    count.id = 'adc-visite-numero';
    count.textContent = '—';
    wrap.append(label, count);
    var bottom = footer.querySelector('.adc-archive-footer__bottom,.adc-inner-footer__bottom');
    var homeBottom = location.pathname === '/adc/' && footer.classList.contains('adc-lux-footer') ? footer.querySelector('.adc-lux-footer-bottom') : null;
    if (homeBottom) {
      wrap.classList.add('adc-lux-visible-counter');
      wrap.style.cssText = 'display:inline-flex;gap:6px;align-items:baseline;margin:0;padding:0;border:0;max-width:none;text-align:left;font-variant-numeric:tabular-nums;';
      homeBottom.appendChild(wrap);
    } else if (bottom) footer.insertBefore(wrap, bottom);
    else footer.appendChild(wrap);
    var format = function (value) { return Number(value).toLocaleString('it-IT'); };
    load();
    async function load() {
      try {
        const response = await fetch('/adc/contatore-config.json', {cache:'no-store', credentials:'omit'});
        if (!response.ok) throw Error('config');
        const cfg = await response.json();
        if (!cfg || !/^https:\/\/[-a-zA-Z0-9.]+\/visite$/.test(cfg.endpoint || '')) throw Error('endpoint');
        const base = Number.isSafeInteger(cfg.legacyBase) && cfg.legacyBase >= 0 ? cfg.legacyBase : 2000;

        // Riserva il tentativo prima di inviarlo: ricaricare dopo una risposta
        // persa non deve aggiungere una seconda visita. Senza storage, sola lettura.
        let method = 'GET';
        try {
          const key = 'adc-visita-registrata-v1';
          if (sessionStorage.getItem(key) !== '1') {
            sessionStorage.setItem(key, '1');
            method = 'POST';
          }
        } catch (_) {}
        const request = async (verb) => {
          const r = await fetch(cfg.endpoint, {
            method:verb, mode:'cors', cache:'no-store', credentials:'omit', referrerPolicy:'no-referrer'
          });
          if (!r.ok) throw Error('counter');
          const result = await r.json();
          if (!Number.isSafeInteger(result.total) || result.total < base) throw Error('invalid total');
          return result.total - base;
        };
        let visits;
        try { visits = await request(method); }
        catch (error) { if (method !== 'POST') throw error; visits = await request('GET'); }
        count.textContent = format(visits);
      } catch (_) {
        count.textContent = 'Non disponibile';
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

/* ADC — presenza anonima. Visualizza soltanto dati effettivamente restituiti dal servizio.
 * Richiede consenso statistiche e endpoint HTTPS configurato. */
(() => {
  'use strict';
  if (!location.pathname.startsWith('/adc/') || location.pathname.startsWith('/adc/widget/')) return;
  if (window.__mbPresenceClientInstalled) return;
  window.__mbPresenceClientInstalled = true;
  const consentKey = 'mb_analytics_consent_v1';
  const consentDateKey = 'mb_analytics_consent_date_v1';
  const tokenKey = 'adc-presenza-scheda-v1';
  const consent = () => {
    try {
      const date = Number(localStorage.getItem(consentDateKey));
      return localStorage.getItem(consentKey) === 'yes' && Number.isFinite(date) &&
        date > 0 && date <= Date.now() && Date.now() - date <= 180 * 24 * 60 * 60 * 1000;
    } catch (_) { return false; }
  };
  let host, timer, endpoint, started = false, busy = false;
  const page = location.pathname.replace(/\/index\.html$/i, '/').replace(/\/+$/, '/') || '/adc/';
  const active = () => consent() && !document.hidden;
  function ensureToken() {
    try {
      let existing = sessionStorage.getItem(tokenKey);
      if (existing && /^[a-f0-9-]{32,36}$/i.test(existing)) return existing;
      const created = crypto.randomUUID ? crypto.randomUUID()
        : Array.from(crypto.getRandomValues(new Uint8Array(16)), v => v.toString(16).padStart(2, '0')).join('');
      sessionStorage.setItem(tokenKey, created);
      return created;
    } catch (_) {
      return crypto.randomUUID ? crypto.randomUUID()
        : Array.from(crypto.getRandomValues(new Uint8Array(16)), v => v.toString(16).padStart(2, '0')).join('');
    }
  }
  function mount() {
    if (host || !document.querySelector('main')) return;
    if (!document.querySelector('link[href="/assets/css/lettori-presenti.css"]')) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = '/assets/css/lettori-presenti.css';
      document.head.appendChild(css);
    }
    host = document.createElement('aside');
    host.className = 'mb-presence';
    host.setAttribute('aria-label', 'Lettori attivi nell’Archivio Documentale Calatabiano');
    host.title = 'Stima delle schede attive negli ultimi due minuti, non delle persone uniche';
    const dot = document.createElement('span');
    dot.className = 'mb-presence-icon';
    dot.setAttribute('aria-hidden', 'true');
    dot.textContent = '●';
    const label = document.createElement('span');
    label.className = 'mb-presence-label';
    label.textContent = 'Lettori online nell’ADC';
    const count = document.createElement('strong');
    count.className = 'mb-presence-count';
    count.setAttribute('aria-live', 'off');
    host.append(dot, label, count);
    host.hidden = true;
    const footer = document.querySelector('footer');
    if (footer) footer.prepend(host);
    else document.querySelector('main').append(host);
  }
  async function loadEndpoint() {
    try {
      const r = await fetch('/adc/presenza-config.json', { cache: 'no-store', credentials: 'omit' });
      if (!r.ok) return null;
      const config = await r.json();
      const url = typeof config.endpoint === 'string' ? config.endpoint.replace(/\/+$/, '') : '';
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash) return null;
      return parsed.href.replace(/\/+$/, '');
    } catch (_) { return null; }
  }
  async function beat() {
    if (!active() || !endpoint || busy) return;
    busy = true;
    try {
      const response = await fetch(endpoint + '/presence', {
        method: 'POST', mode: 'cors', credentials: 'omit', cache: 'no-store',
        referrerPolicy: 'no-referrer',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, id: ensureToken() })
      });
      if (!response.ok) throw Error('unavailable');
      const data = await response.json();
      if (!Number.isSafeInteger(data.total) || data.total < 1 || data.total > 1000000) throw Error('invalid count');
      mount();
      if (host) {
        host.querySelector('.mb-presence-count').textContent = String(data.total);
        host.hidden = false;
      }
    } catch (_) { if (host) host.hidden = true; }
    finally { busy = false; }
  }
  async function start() {
    if (!active() || started) return;
    started = true;
    endpoint = await loadEndpoint();
    if (!started || !active() || !endpoint) { started = false; return; }
    await beat();
    timer = setInterval(beat, 40000);
  }
  function stop() {
    started = false;
    if (timer) clearInterval(timer);
    timer = null;
    if (host) host.hidden = true;
  }
  function refresh() { if (active()) start(); else stop(); }
  function init() {
    refresh();
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('pagehide', stop);
    window.addEventListener('pageshow', refresh);
    window.addEventListener('storage', event => { if (event.key === consentKey) refresh(); });
    // Il pannello delle preferenze salva il consenso prima della fine del click.
    document.addEventListener('click', event => {
      if (event.target.closest('#mb-consent [data-choice]')) setTimeout(refresh, 0);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

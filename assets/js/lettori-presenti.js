/* ADC — presenza anonima. Visualizza soltanto dati effettivamente restituiti dal servizio.
 * Richiede consenso statistiche e endpoint HTTPS configurato. */
(() => {
  'use strict';
  if (!location.pathname.startsWith('/adc/') || location.pathname.startsWith('/adc/widget/')) return;
  if (location.pathname === '/adc/offline.html' || document.querySelector('meta[http-equiv="refresh" i]')) return;
  if (window.__mbPresenceClientInstalled || typeof WebSocket !== 'function') return;
  window.__mbPresenceClientInstalled = true;
  const consentKey = 'mb_analytics_consent_v1';
  const consentDateKey = 'mb_analytics_consent_date_v1';
  const consent = () => {
    try {
      const date = Number(localStorage.getItem(consentDateKey));
      return localStorage.getItem(consentKey) === 'yes' && Number.isFinite(date) &&
        date > 0 && date <= Date.now() && Date.now() - date <= 180 * 24 * 60 * 60 * 1000;
    } catch (_) { return false; }
  };
  let host, socket, retry, poll, connecting = false, eligible = true;
  let lastResponse = 0;
  const active = () => eligible && consent() && !document.hidden;
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
    host.title = 'Schede attive con statistiche abilitate in tutto l’Archivio';
    const dot = document.createElement('span');
    dot.className = 'mb-presence-icon';
    dot.setAttribute('aria-hidden', 'true');
    dot.textContent = '●';
    const label = document.createElement('span');
    label.className = 'mb-presence-label';
    label.textContent = 'Schede attive online nell’ADC';
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
      const url = new URL(config.endpoint);
      if (url.protocol !== 'wss:' || url.username || url.password || url.search || url.hash || url.pathname !== '/presence') return null;
      return url.href;
    } catch (_) { return null; }
  }
  function hide() { if (host) host.hidden = true; }
  function stop() {
    clearTimeout(retry);
    clearInterval(poll);
    retry = poll = undefined;
    const closing = socket;
    socket = null;
    if (closing) closing.close();
    hide();
  }
  function reconnect() {
    stop();
    if (active()) retry = setTimeout(() => { retry = undefined; refresh(); }, 10000);
  }
  async function refresh() {
    if (!active()) { stop(); return; }
    if (socket || connecting || retry) return;
    connecting = true;
    try {
      const endpoint = await loadEndpoint();
      if (!active() || !endpoint) return;
      const connection = new WebSocket(endpoint);
      socket = connection;
      lastResponse = Date.now();
      connection.addEventListener('message', event => {
        if (socket !== connection || !active()) return;
        try {
          const data = JSON.parse(event.data);
          if (!Number.isSafeInteger(data.total) || data.total < 1 || data.total > 5000) throw Error('invalid count');
          lastResponse = Date.now();
          mount();
          if (host) {
            host.querySelector('.mb-presence-count').textContent = data.total.toLocaleString('it-IT');
            host.hidden = false;
          }
        } catch (_) { hide(); }
      });
      connection.addEventListener('close', () => { if (socket === connection) reconnect(); });
      connection.addEventListener('error', () => { if (socket === connection) reconnect(); });
      poll = setInterval(() => {
        if (!active()) { stop(); return; }
        if (Date.now() - lastResponse > 60000) { reconnect(); return; }
        if (socket === connection && connection.readyState === WebSocket.OPEN) connection.send('count');
      }, 30000);
    } catch (_) { reconnect(); }
    finally { connecting = false; }
  }
  function init() {
    refresh();
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('pagehide', () => { eligible = false; stop(); });
    window.addEventListener('pageshow', () => { eligible = true; refresh(); });
    window.addEventListener('storage', event => { if (event.key === consentKey) refresh(); });
    // Il pannello delle preferenze salva il consenso prima della fine del click.
    document.addEventListener('click', event => {
      if (event.target.closest('#mb-consent [data-choice]')) setTimeout(refresh, 0);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

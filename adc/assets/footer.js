/* Footer istituzionale ADC, basato sul modello della homepage. */
(() => {
  'use strict';
  if (!location.pathname.startsWith('/adc/') || location.pathname.startsWith('/adc/widget/') || location.pathname === '/adc/offline.html') return;
  if (document.querySelector('meta[http-equiv="refresh" i]')) return;

  const markup = `<footer class="adc-lux-footer" data-adc-common-footer data-adc-footer-identity aria-label="Informazioni e collegamenti dell'Archivio Documentale Calatabiano">
 <div class="adc-lux-footer-top">
  <a class="adc-lux-footer-brand" href="/adc/">▣ <strong>ADC</strong><span>Archivio Documentale<br>Calatabiano</span></a>
  <p>La memoria di Calatabiano,<br>accessibile, viva, condivisa.</p>
  <nav aria-label="Navigazione a piè di pagina">
    <a href="/adc/">Home</a><a href="/adc/elena/">Elena</a><a href="/adc/inventario/">Documenti</a><a href="/adc/fonti/">Fonti</a><a href="/adc/atlante/">Percorsi</a><a href="/contatti/">Contatti</a>
  </nav>
 </div>
 <div class="adc-lux-footer-bottom"><span>© 2026 ADC · A cura di Michele Bottino</span><span>Elena: ideazione Michele Bottino · sviluppo DarkAronte</span><a data-adc-footer-top-link href="#contenuto">Torna all'inizio ↑</a></div>
 <div class="adc-footer-stats" data-adc-footer-stats>
  <div class="adc-footer-online" data-adc-footer-online></div>
  <div class="adc-footer-visits" data-adc-footer-visits></div>
 </div>
 <details class="adc-lux-footer-more"><summary>Altri collegamenti e informazioni legali</summary>
  <div class="adc-lux-footer-extra">
   <a href="/adc/storia-per-tutti/">Storia di Calatabiano</a><a href="/adc/mediateca/">Mediateca</a><a href="/adc/materiali-patrimonio/">Patrimonio documentale</a><a href="/metodo/">Metodo di ricerca</a><a href="/">Sito dell'autore</a><a href="/privacy/">Privacy</a><a href="/accessibilita/">Accessibilità</a><a href="/cookie/">Cookie e statistiche</a><a href="/disclaimer/">Disclaimer</a><a href="/installa/">Installa il sito</a><a href="https://dark-aronte.github.io/aegis-system/" rel="noopener noreferrer">Integrità digitale · ARONTE AEGIS</a>
<section class="adc-footer-tutela" id="tutela-persone-fonti" aria-labelledby="adc-footer-tutela-title"><h2 id="adc-footer-tutela-title">Fonti, rettifiche e tutela</h2><p>L’Archivio distingue i fatti documentati dalle interpretazioni e dalle questioni aperte. Per segnalare errori, problemi di attribuzione o diritti di riproduzione consulta la <a href="/rettifiche-e-diritti/">pagina dedicata alle rettifiche</a>. Il canale riservato non è ancora attivo: non inserire dati personali nei commenti pubblici.</p></section>
  </div>
 </details>
</footer>`;

  function mount() {
    if (document.querySelector('[data-adc-common-footer]')) return;
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/adc/assets/footer.css?v=20261124-footer-adc';
    document.head.append(stylesheet);

    const template = document.createElement('template');
    template.innerHTML = markup;
    const footer = template.content.firstElementChild;
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'contenuto';
    if (main) footer.querySelector('[data-adc-footer-top-link]').href = '#' + main.id;
    else footer.querySelector('[data-adc-footer-top-link]').remove();

    const slots = [
      ['.mb-presence', '[data-adc-footer-online]'],
      ['#adc-visite-footer', '[data-adc-footer-visits]'],
      ['.mb-preferences-control', '.adc-lux-footer-bottom']
    ];
    for (const [selector, target] of slots) {
      const node = document.querySelector(selector);
      if (node) footer.querySelector(target).append(node);
    }

    const previous = [...document.querySelectorAll('footer')].filter(node => !node.closest('article, aside, blockquote, footer footer'));
    const known = new Set([...footer.querySelectorAll('a')].map(link => link.href));
    const extras = footer.querySelector('.adc-lux-footer-extra');
    for (const old of previous) {
      if (!old.classList.contains('adc-lux-footer')) preservePageNotes(old, extras, known);
      old.remove();
    }
    document.body.append(footer);
  }

  function preservePageNotes(previous, extras, known) {
    const links = document.createElement('div');
    links.className = 'adc-footer-page-links';
    for (const link of previous.querySelectorAll('a[href]')) {
      const url = new URL(link.href, location.href);
      if (!['https:', 'http:', 'mailto:'].includes(url.protocol) || known.has(url.href) || link.getAttribute('href').startsWith('#')) continue;
      const label = link.textContent.trim() || link.getAttribute('aria-label');
      if (!label) continue;
      const copy = document.createElement('a');
      copy.href = url.href;
      copy.textContent = label;
      links.append(copy);
      known.add(url.href);
    }

    // Le note scientifiche e i diritti specifici della pagina restano consultabili.
    const original = previous.cloneNode(true);
    original.querySelectorAll('nav,.aegis-footer-signature,.adc-inner-footer__about,.adc-archive-footer__about,[data-adc-footer-identity],script,style').forEach(node => node.remove());
    original.querySelectorAll('a').forEach(node => node.replaceWith(node.textContent));
    const note = original.textContent.replace(/\s+/g, ' ').trim();
    const editorial = /revisione|aggiornat|\bottobre\b|\bnovembre\b|fotografi|riproduzion|limiti |bibliografi|fonti secondarie|diritti|edizione iniziale/i.test(note);
    if (!links.childElementCount && !editorial) return;
    const group = document.createElement('details');
    group.className = 'adc-footer-page-notes';
    const summary = document.createElement('summary');
    summary.textContent = 'Note e collegamenti della pagina';
    group.append(summary);
    if (editorial) {
      const paragraph = document.createElement('p');
      paragraph.textContent = note;
      group.append(paragraph);
    }
    if (links.childElementCount) group.append(links);
    extras.append(group);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true});
  else mount();
})();

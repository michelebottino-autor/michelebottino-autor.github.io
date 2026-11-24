const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const js = fs.readFileSync('adc/assets/navigazione-unificata.js','utf8');
const css = fs.readFileSync('adc/assets/navigazione-unificata.css','utf8');

test('archive navigation preserves people and press links while separating main and secondary entries', () => {
  assert.match(js, /var mainNames = \[/);
  assert.match(js, /var otherNames = \[/);
  assert.match(js, /\['Storia per tutti','\/adc\/storia-per-tutti\/'\]/);
  assert.match(js, /\['Fonti','\/adc\/fonti\/'\]/);
  assert.match(js, /\['Persone e memorie','\/adc\/persone\/'\]/);
  assert.match(js, /\['Stampa','\/adc\/stampa\/'\]/);
  assert.match(js, /document\.createElement\('details'\)/);
  assert.match(css, /\.adc-u-more-links/);
});

test('mobile navigation exposes state and supports Escape', () => {
  assert.match(js, /aria-expanded/);
  assert.match(js, /event\.key === 'Escape'/);
  assert.match(js, /\(mobileMenuOpen \? button : summary\)\.focus\(\)/);
  assert.match(css, /:focus-visible/);
});

test('shared footer includes the archive paths and displays the measured session counter', () => {
  assert.match(js, /data-adc-footer-identity/);
  assert.match(js, /\/adc\/stampa\//);
  assert.match(js, /\/adc\/persone\//);
  assert.match(js, /\/adc\/assets\/visite\.js/);
});

test('shared page surfaces define consistent cards, headings and footer colors', () => {
  assert.match(css, /body\.adc-inner-2026[^\n]*\.card/);
  assert.match(css, /footer\.adc-global-footer/);
  assert.match(css, /Georgia/);
});

test('secondary menu closes on mobile menu dismissal and Escape', () => {
  assert.match(js, /if \(!open\) more\.open = false/);
  assert.match(js, /if \(event\.key === 'Escape'\)/);
  assert.match(js, /more\.open \|\| mobileMenuOpen/);
  assert.match(js, /\(mobileMenuOpen \? button : summary\)\.focus\(\)/);
});

const vm = require('node:vm');
const visitClient = fs.readFileSync('adc/assets/visite.js', 'utf8');
async function renderVisits(storage, replies) {
  let count;
  const element = () => ({
    style: {},
    classList: {add() {}},
    append(...children) { count = children.at(-1); },
    appendChild() {},
    querySelector() { return null; }
  });
  const methods = [];
  const response = (value) => ({ok: true, json: async () => value});
  vm.runInNewContext(visitClient, {
    location: {pathname: '/adc/fonti/'},
    document: {readyState: 'complete', querySelector: selector => selector === 'footer' ? element() : null, getElementById: () => null, createElement: element},
    sessionStorage: storage,
    fetch: async (url, options) => {
      if (url.endsWith('.json')) return response({
        endpoint: 'https://conto.example/visite', legacyBase: 2000
      });
      methods.push(options.method);
      const reply = replies.shift();
      if (reply instanceof Error) throw reply;
      return response({total: reply});
    }
  });
  await new Promise(setImmediate);
  return {methods, text: count.textContent};
}
const makeStorage = () => {
  const items = new Map();
  return {getItem: key => items.get(key), setItem: (key, value) => items.set(key, value)};
};

test('first page registers one visit; subsequent pages read the measured count', async () => {
  const storage = makeStorage();
  assert.deepEqual(await renderVisits(storage, [2399]), {methods: ['POST'], text: '399'});
  assert.deepEqual(await renderVisits(storage, [2400]), {methods: ['GET'], text: '400'});
});

test('a lost response falls back to GET without repeating the increment', async () => {
  const storage = makeStorage();
  assert.deepEqual(await renderVisits(storage, [Error('network'), 2401]), {methods: ['POST', 'GET'], text: '401'});
  assert.deepEqual(await renderVisits(storage, [2401]), {methods: ['GET'], text: '401'});
});

test('if storage is unavailable, read only; if the backend is unavailable, show the status', async () => {
  const blocked = {getItem() { throw Error('blocked'); }};
  assert.deepEqual(await renderVisits(blocked, [2401]), {methods: ['GET'], text: '401'});
  assert.deepEqual(await renderVisits(blocked, [1999]), {methods: ['GET'], text: 'Non disponibile'});
});

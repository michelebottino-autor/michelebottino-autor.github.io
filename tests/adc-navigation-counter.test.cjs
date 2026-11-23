const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const js = fs.readFileSync('adc/assets/navigazione-unificata.js','utf8');
const css = fs.readFileSync('adc/assets/navigazione-unificata.css','utf8');

test('archive navigation preserves people and press links while separating main and secondary entries', () => {
  assert.match(js, /var mainNames = \[/);
  assert.match(js, /var otherNames = \[/);
  assert.match(js, /\['Per i cittadini','\/adc\/storia-per-tutti\/'\]/);
  assert.match(js, /\['Per gli studiosi','\/adc\/fonti\/'\]/);
  assert.match(js, /\['Persone','\/adc\/persone\/'\]/);
  assert.match(js, /\['Stampa','\/adc\/stampa\/'\]/);
  assert.match(js, /document\.createElement\('details'\)/);
  assert.match(css, /\.adc-u-more-links/);
});

test('mobile navigation exposes state and supports Escape', () => {
  assert.match(js, /aria-expanded/);
  assert.match(js, /event\.key === 'Escape'/);
  assert.match(js, /button\.focus\(\)/);
  assert.match(css, /:focus-visible/);
});

test('shared footer includes the archive paths and displays the measured session counter', () => {
  assert.match(js, /data-adc-footer-identity/);
  assert.match(js, /\/adc\/stampa\//);
  assert.match(js, /\/adc\/persone\//);
  assert.match(js, /adc-visite-footer/);
  assert.match(js, /Conteggio sessioni/);
  assert.match(js, /result.total - 2000/);
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

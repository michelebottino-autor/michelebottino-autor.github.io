const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const js = fs.readFileSync('adc/assets/navigazione-unificata.js','utf8');
const css = fs.readFileSync('adc/assets/navigazione-unificata.css','utf8');
const config = JSON.parse(fs.readFileSync('adc/contatore-config.json','utf8'));

test('counter never displays an unverified numeric placeholder', () => {
  assert.match(js, /count\.textContent = '—';/);
  assert.doesNotMatch(js, /count\.textContent = '2\.000';/);
});
test('counter excludes the conventional baseline from the public total', () => {
  assert.equal(config.base, undefined);
  assert.match(js, /Conteggio sessioni: /);
  assert.match(js, /format\(result\.total - 2000\)/);
  assert.doesNotMatch(js, /Conteggio sessioni \(base iniziale/);
});
test('counter checks server response before displaying it', () => {
  assert.match(js, /Number\.isSafeInteger\(result\.total\)/);
  assert.match(js, /if\(!r\.ok\)throw Error\('counter'\)/);
});
test('navigation exposes state and Escape keyboard handling', () => {
  assert.match(js, /aria-expanded/);
  assert.match(js, /event\.key === 'Escape'/);
  assert.match(js, /button\.focus\(\)/);
  assert.match(css, /:focus-visible/);
});

test('visit registration is recorded only after a valid server response', () => {
  const marker = "sessionStorage.setItem('adc-visita-registrata-v1','1')";
  assert.equal(js.split(marker).length - 1, 1);
  assert.ok(js.indexOf(marker) > js.indexOf('count.textContent = format(result.total - 2000)'));
});

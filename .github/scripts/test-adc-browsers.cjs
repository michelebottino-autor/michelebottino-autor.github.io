'use strict';

const assert = require('node:assert/strict');
const { chromium, firefox, webkit, devices } = require('playwright');

const origin = process.env.ADC_TEST_ORIGIN || 'http://127.0.0.1:8765';
const engine = process.argv[2] || 'chromium';
const browsers = { chromium, firefox, webkit, edge: chromium, chrome: chromium };
const guide = 'chiese/schede/maria-santissima-annunziata/';
const routes = ['', guide, 'cerca/', 'fonti/', 'chiese/', 'atlante/', 'mediateca/',
  'inventario/', 'elena/', 'elena/documenti/', 'widget/', 'widget/compatto/'];
const widths = [320, 360, 384, 390, 412, 768, 1024, 1440];

async function verifyLayout(page, width, height, failures) {
  await page.setViewportSize({ width, height });
  for (const route of routes) {
    const path = '/adc/' + route;
    try {
      const response = await page.goto(origin + path, { waitUntil: 'load' });
      assert(response?.ok() || response?.status() === 304, 'HTTP ' + response?.status());
      const layout = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
        content: Boolean(document.querySelector('main, .widget')),
      }));
      assert(layout.content, 'contenuto principale assente');
      assert(layout.scroll <= layout.width + 1, `scorrimento orizzontale (${layout.scroll}/${layout.width})`);
    } catch (error) {
      failures.push(`${width}×${height} ${path}: ${error.message}`);
    }
  }
}

async function verifyControls(context) {
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/adc/cerca/');
  await page.locator('#mb-consent [data-choice="no"]').click();
  const menu = page.locator('#adc-unified-header .adc-u-toggle');
  await menu.focus();
  await menu.press('Enter');
  await page.locator('#adc-u-links a[href="/adc/fonti/"]').waitFor({ state: 'visible' });
  await menu.press('Enter');
  await page.locator('#adc-u-links').waitFor({ state: 'hidden' });

  await page.locator('#query').fill('castello');
  await page.locator('#search-form button').click();
  await page.locator('#results a').first().waitFor({ state: 'visible' });

  const toggle = page.locator('.elena-presenza-toggle');
  await toggle.click();
  await page.locator('#elena-presenza-panel').waitFor({ state: 'visible' });
  await page.locator('.elena-presenza-close').click();
  await page.locator('#elena-presenza-panel').waitFor({ state: 'hidden' });
  assert(await toggle.evaluate(button => button === document.activeElement), 'focus di Elena non ripristinato');
  await page.goto(origin + '/adc/elena/');
  await page.locator('main input[type="search"], main input[type="text"], main textarea').first().waitFor({ state: 'visible' });
  await page.close();
}

async function verifyRecordings(context) {
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  try {
    await page.goto(origin + '/adc/');
    const consent = page.locator('#mb-consent [data-choice="no"]');
    if (await consent.isVisible()) await consent.click();
    const guideLink = page.locator('main .adc-elena-listen a[href$="#elena-audioguida"]');
    const homeSample = page.locator('main .adc-elena-listen audio');
    assert.equal(await homeSample.getAttribute('src'), '/adc/audio/elena-ufficiale.mp3');
    await guideLink.click();
    assert.equal(new URL(page.url()).pathname, '/adc/' + guide);

    const audio = page.locator('#elena-audio-player');
    await page.getByText('Parte 1 di 29', { exact: true }).waitFor();
    assert(await page.locator('#elena-prev').isDisabled());
    await page.locator('#elena-next').click();
    assert.match(await audio.getAttribute('src'), /elena-01\.mp3$/);
    await audio.dispatchEvent('ended');
    assert.match(await audio.getAttribute('src'), /elena-02\.mp3$/);

    await page.goto(origin + '/adc/elena/');
    assert.equal(await page.locator('main .adc-elena-listen audio').getAttribute('src'), '/adc/audio/elena-ufficiale.mp3');
    await page.locator('#elena-query').fill('Chi possedeva il castello di Calatabiano nel 1213?');
    await page.locator('#elena-form button[type="submit"]').click();
    const answer = page.locator('.elena-dialogue-answer audio');
    await answer.waitFor();
    assert.match(await answer.getAttribute('src'), /elena-serena-risposta-E-026-A01-A03\.mp3$/);
    assert((await page.request.get(new URL(await answer.getAttribute('src'), origin).href)).ok());
  } finally {
    await page.close();
  }
}

async function run() {
  assert(browsers[engine], 'Browser sconosciuto: ' + engine);
  const channel = { edge: 'msedge', chrome: 'chrome' }[engine];
  const executablePath = process.env.ADC_CHROMIUM_PATH;
  const browser = await browsers[engine].launch(channel ? { channel } :
    engine === 'chromium' && executablePath ? { executablePath } : {});
  const failures = [];
  try {
    const options = engine === 'webkit' ? devices['iPhone 13'] :
      engine === 'chromium' ? devices['Pixel 7'] : {};
    const { defaultBrowserType, ...mobileOptions } = options;
    for (const [contextOptions, sizes] of [
      [{}, [[1024, 768], [1440, 900]]],
      [mobileOptions, widths.filter(width => width < 1024).map(width => [width, 844]).concat([[844, 390]])],
    ]) {
      const context = await browser.newContext(contextOptions);
      const page = await context.newPage();
      for (const [width, height] of sizes) await verifyLayout(page, width, height, failures);
      await context.close();
    }

    const basic = await browser.newContext();
    await basic.addInitScript(() => {
      Object.defineProperty(window, 'SpeechRecognition', { value: undefined });
      Object.defineProperty(window, 'webkitSpeechRecognition', { value: undefined });
    });
    try { await verifyControls(basic); }
    catch (error) { failures.push('Menu, ricerca ed Elena: ' + error.message); }
    try { await verifyRecordings(basic); }
    catch (error) { failures.push('Voce di Elena e audioguida: ' + error.message); }
    await basic.close();
  } finally {
    await browser.close();
  }
  assert.equal(failures.length, 0, failures.join('\n'));
  console.log(`${engine}: ${routes.length * (widths.length + 1)} controlli di impaginazione, navigazione da tastiera, ricerca ed Elena`);
}

run().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});

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
  await page.locator('#adc-u-links a[href="/adc/elena/"]').waitFor({ state: 'visible' });
  const more = page.locator('#adc-u-links .adc-u-more summary');
  await more.press('Enter');
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
    const homeIntro = page.locator('main .adc-elena-listen audio');
    assert.equal(await homeIntro.getAttribute('src'), '/adc/audio/elena-presentazione-adc.mp3?v=20261126-v11');
    const introResponse = await page.request.head(new URL(await homeIntro.getAttribute('src'), origin).href);
    assert(introResponse.ok() && /audio/i.test(introResponse.headers()['content-type']));
    await guideLink.click();
    assert.equal(new URL(page.url()).pathname, '/adc/' + guide);

    const section = page.locator('#elena-audioguida');
    const audio = section.locator('audio[controls]');
    await audio.waitFor({ state: 'visible' });
    assert.equal(await audio.count(), 1, 'Una sola traccia continua');
    const source = await audio.getAttribute('src');
    assert.match(source, /ascolto-elena-r18-20261126\.mp3$/);
    const recording = await page.request.head(new URL(source, page.url()).href);
    assert(recording.ok() && /audio/i.test(recording.headers()['content-type']), source);
    assert(Number(recording.headers()['content-length']) > 0, 'Traccia audio vuota');
    const transcript = section.locator('details.adc-audio-transcript');
    assert.equal(await transcript.count(), 1);
    if (!(await transcript.evaluate(el => el.open))) await transcript.locator('summary').click();
    assert(await transcript.locator('p').first().isVisible(), 'Trascrizione non consultabile');
    assert((await transcript.innerText()).length > 1000, 'Trascrizione troppo breve');

    await page.goto(origin + '/adc/elena/');
    assert.equal(await page.locator('main .adc-elena-listen audio').getAttribute('src'), '/adc/audio/elena-voce-ufficiale-tramonto.mp3?v=20261126');
    await page.locator('#elena-query').fill('Chi possedeva il castello di Calatabiano nel 1213?');
    await page.locator('#elena-form button[type="submit"]').click();
    const answer = page.locator('.elena-dialogue-answer audio');
    await answer.waitFor();
    assert.match(await answer.getAttribute('src'), /elena-serena-risposta-E-026-A01-A03\.mp3\?v=20261126$/);
    assert((await page.request.get(new URL(await answer.getAttribute('src'), origin).href)).ok());
  } finally {
    await page.close();
  }
}

async function verifyChurchGuides(context) {
  const page = await context.newPage();
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(origin + '/adc/chiese/');
    const links = await page.locator('.card a[href$="#elena-audioguida"]').evaluateAll(anchors => anchors.map(anchor => anchor.href));
    assert.equal(links.length, 10, 'Una audioguida per ogni scheda dell’indice delle chiese');
    assert.equal(new Set(links).size, links.length);
    for (const link of links) {
      assert((await page.goto(link)).ok(), link);
      const guide = page.locator('#elena-audioguida');
      const player = guide.locator('audio[controls]');
      await player.waitFor({ state: 'visible' });
      const src = await player.getAttribute('src');
      const response = await page.request.head(new URL(src, link).href);
      assert(response.ok() && /audio/i.test(response.headers()['content-type']), src);
      assert(await guide.evaluate(section => section.getBoundingClientRect().right <= innerWidth + 1), link);
      if (src.endsWith('audioguida-elena.mp3')) {
        const transcript = guide.locator('details');
        await transcript.locator('summary').click();
        assert(await transcript.locator('p').first().isVisible(), link);
      }
    }
  } finally {
    await page.close();
  }
}

async function verifyPublishedPassages(context) {
  const page = await context.newPage({ viewport: { width: 390, height: 844 } });
  try {
    await page.goto(origin + '/adc/elena/');
    const consent = page.locator('#mb-consent [data-choice="no"]');
    if (await consent.isVisible()) await consent.click();
    const field = page.locator('#elena-query');
    const send = page.locator('#elena-form button[type="submit"]');
    const responses = page.locator('.elena-dialogue-answer');
    const cases = [
      ['Trascrivi l’atto originale del 1537 sugli zuccheri', 'Francesco Mirulla', 'fogli 330–332', '/adc/dossier-1213-1537/#adc-notizia-1537'],
      ['Santa Maria e il cappellano Tommaso nelle decime', 'Presbiter Thomasius', 'riscontro sull’immagine', '/adc/chiese/studi/rationes/#adc-0002'],
      ['Che cosa è stato accertato sul Processo 334?', 'Tommaso Mirulla', 'Restano da identificare', '/adc/processo-334/#aggiornamento-20261111'],
      ['Che cosa conferma il privilegio regio del 1213?', 'Costanza', 'originale manoscritto', '/adc/dossier-1213-1537/#adc-notizia-1213'],
      ['Chi aveva diritto all’acqua del mulino di Gullia?', 'Costantino de Fimi', 'identificare il Panagia', '/adc/acque-mulini-confini/#adc-0012']
    ];
    for (const [index, [query, excerpt, limit, href]] of cases.entries()) {
      await field.fill(query);
      await send.click();
      const answer = responses.nth(index);
      await answer.getByText(/Passaggio ripreso da una scheda pubblicata/).waitFor();
      const text = await answer.innerText();
      assert(text.includes(excerpt) && text.includes(limit), query);
      assert.equal(await answer.locator('a').first().getAttribute('href'), href);
      assert.equal(await answer.locator('audio').count(), 0);
    }

    await field.fill('Chi ottenne l’arbitrio degli zuccheri nel 1538?');
    await send.click();
    await responses.nth(cases.length).waitFor();
    assert.equal(await responses.nth(cases.length).getByText(/Passaggio ripreso/).count(), 0);

    await page.goto(origin + '/adc/dossier-1213-1537/');
    await page.locator('.elena-presenza-toggle').click();
    await page.locator('#elena-presenza-query').fill(cases[0][0]);
    await page.locator('.elena-presenza-form button[type="submit"]').click();
    const panelLink = page.locator('.elena-presenza-result a');
    await panelLink.waitFor();
    assert.equal(await panelLink.getAttribute('href'), cases[0][3]);
  } finally {
    await page.close();
  }
}

async function verifyDesktopHome(context) {
  const page = await context.newPage();
  try {
    for (const width of [1024, 1366, 1440]) {
      await page.setViewportSize({ width, height: 720 });
      await page.goto(origin + '/adc/');
      const main = page.locator('main#contenuto');
      const hero = main.locator('.adc-lux-hero');
      const chat = hero.locator('.adc-lux-chat');
      const intro = hero.locator('#adc-lux-home-title');
      const stories = main.locator('.adc-lux-cards').first();
      const dedication = main.locator(':scope > #dedica-comunita');
      const resources = main.locator(':scope > #adc-risorse-complete');
      const footer = page.locator('body > footer.adc-lux-footer[data-adc-common-footer]');
      const share = main.locator('[data-adc-share] [data-network="facebook"]');

      await dedication.getByText(/Antonino Bottino/).waitFor();
      await share.waitFor();
      await footer.waitFor();
      const [mainBox, storyBox, dedicationBox, resourcesBox, footerBox, chatBox, introBox] =
        await Promise.all([main, stories, dedication, resources, footer, chat, intro].map(node => node.boundingBox()));
      assert(chatBox.x > introBox.x + introBox.width, width + ': Elena deve affiancare l’introduzione');
      assert(dedicationBox.y >= storyBox.y + storyBox.height, width + ': dedica sotto le schede');
      assert(dedicationBox.width >= storyBox.width * 0.95, width + ': dedica troppo stretta');
      assert(Math.abs(resourcesBox.x - dedicationBox.x) <= 1 &&
        resourcesBox.width >= dedicationBox.width * 0.95, width + ': risorse disallineate');
      const footerGap = footerBox.y - mainBox.y - mainBox.height;
      assert(Math.abs(footerGap) <= 2, width + ': spazio prima del footer (' + footerGap + ' px)');
      assert.equal(await page.locator('.elena-presenza-toggle').isVisible(), false);
      assert.equal(await share.evaluate(link => getComputedStyle(link).backgroundColor), 'rgb(22, 72, 66)');
    }
  } finally {
    await page.close();
  }
}

async function verifyMobileColors(context) {
  const page = await context.newPage();
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => Object.defineProperty(navigator, 'standalone', { value: true }));
    await page.goto(origin + '/adc/');
    await page.waitForFunction(() => {
      const link = document.querySelector('.adc-lux-intro-links a');
      return link && getComputedStyle(link).color === 'rgb(255, 224, 161)';
    }, null, { timeout: 5000 });
    const introLink = page.locator('.adc-lux-intro-links a').first();
    assert.equal(await introLink.evaluate(a => getComputedStyle(a).color), 'rgb(255, 224, 161)');

    const toolbar = page.locator('#adc-app-toolbar');
    const elena = page.locator('.elena-presenza-toggle');
    const [barBounds, elenaBounds] = await Promise.all([toolbar.boundingBox(), elena.boundingBox()]);
    assert(barBounds && elenaBounds, 'Barra o pulsante Elena assente');
    assert(elenaBounds.y + elenaBounds.height <= barBounds.y, 'Elena copre la barra installata');

    for (const route of ['atlante/', 'dossier-1213-1537/']) {
      await page.goto(origin + '/adc/' + route);
      const row = page.locator('table.adc-mobile-cards:not(.attestazioni) tbody tr').first();
      assert.equal(await row.evaluate(tr => getComputedStyle(tr).backgroundColor), 'rgb(18, 63, 59)', route);
      const label = row.locator('td[data-label]').nth(1);
      assert.equal(await label.evaluate(td => getComputedStyle(td, '::before').color), 'rgb(255, 224, 161)', route);
    }

    await page.goto(origin + '/adc/cerca/?q=comune');
    const highlight = page.locator('#results mark').first();
    await highlight.waitFor({ state: 'visible' });
    const colors = await highlight.evaluate(mark => {
      const style = getComputedStyle(mark);
      return [style.color, style.backgroundColor];
    });
    assert.deepEqual(colors, ['rgb(25, 46, 39)', 'rgb(255, 223, 153)']);
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
    try { await verifyChurchGuides(basic); }
    catch (error) { failures.push('Audioguide delle chiese: ' + error.message); }
    try { await verifyPublishedPassages(basic); }
    catch (error) { failures.push('Passaggi pubblicati di Elena: ' + error.message); }
    try { await verifyDesktopHome(basic); }
    catch (error) { failures.push('Impaginazione home desktop: ' + error.message); }
    try { await verifyMobileColors(basic); }
    catch (error) { failures.push('Contrasto e barra mobile: ' + error.message); }
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

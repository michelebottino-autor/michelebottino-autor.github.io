const { chromium } = require('playwright');
(async () => {
 const browser = await chromium.launch({ headless: true });
 const paths = ['/', '/adc/', '/accessibilita/', '/privacy/', '/cookie/'];
 const failures = [];
 for (const path of paths) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const gaRequests = [];
  page.on('request', request => { if (/googletagmanager\\.com\\/gtag\\/js|google-analytics\\.com\\/(g\\/collect|collect)/.test(request.url())) gaRequests.push(request.url()); });
  try {
   const response = await page.goto('http://127.0.0.1:8765' + path, { waitUntil: 'domcontentloaded' });
   if (!response?.ok()) throw new Error('HTTP non valido');
   await page.waitForTimeout(300);
   if (gaRequests.length) failures.push(path + ': richiesta Analytics prima del consenso');
   const consent = page.locator('#mb-consent');
   if (await consent.count()) {
    if (!await consent.getByRole('button', { name: 'Rifiuta' }).isVisible()) failures.push(path + ': rifiuto non disponibile');
    await consent.getByRole('button', { name: 'Rifiuta' }).click();
    if (await consent.count()) failures.push(path + ': banner non chiuso dopo il rifiuto');
    if (gaRequests.length) failures.push(path + ': richiesta Analytics dopo il rifiuto');
    const stored = await page.evaluate(() => localStorage.getItem('mb_analytics_consent_v1'));
    if (stored !== 'no') failures.push(path + ': rifiuto non registrato');
   } else failures.push(path + ': banner consenso assente in sessione nuova');
   const pref = page.getByRole('button', { name: /Preferenze statistiche/ }).first();
   if (!await pref.isVisible()) failures.push(path + ': preferenze statistiche non disponibili');
   else {
    await pref.click();
    if (!await page.locator('#mb-consent').isVisible()) failures.push(path + ': impossibile riaprire il consenso');
   }
   const skip = page.locator('a[href="#contenuto"]').first();
   if (!await skip.count()) failures.push(path + ': link salta al contenuto assente');
   const main = page.locator('#contenuto').first();
   if (!await main.count()) failures.push(path + ': destinazione salta al contenuto assente');
   console.log(path + ': controlli consenso e navigazione eseguiti');
  } catch (e) { failures.push(path + ': ' + e.message); }
  await context.close();
 }
 await browser.close();
 if (failures.length) { console.error(failures.join('\\n')); process.exitCode = 1; }
 else console.log('Consenso e navigazione: verifiche browser superate.');
})().catch(e => { console.error(e); process.exitCode = 1; });

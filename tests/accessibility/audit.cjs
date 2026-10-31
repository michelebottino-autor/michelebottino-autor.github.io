const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const pages = ['/', '/adc/', '/accessibilita/', '/privacy/', '/cookie/'];
(async () => {
 const browser = await chromium.launch({ headless: true });
 let failures = 0;
 for (const path of pages) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
   const response = await page.goto('http://127.0.0.1:8765' + path, { waitUntil: 'domcontentloaded' });
   if (!response || !response.ok()) throw new Error('HTTP non valido');
   const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
   console.log(path, 'violazioni:', result.violations.length, 'incomplete:', result.incomplete.length);
   for (const violation of result.violations) console.log(' -', violation.id, violation.impact, violation.nodes.length, violation.help);
   if (result.violations.length) failures++;
  } catch (error) { failures++; console.error(path, error.message); }
  await page.close();
 }
 await browser.close();
 if (failures) { console.error('Audit automatico: pagine con problemi:', failures); process.exitCode = 1; }
 else console.log('Nessuna violazione automatica rilevata nelle pagine campione. Verifiche manuali ancora necessarie.');
})().catch(e => { console.error(e); process.exitCode = 1; });
